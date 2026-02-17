"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import {
  HospitalWithRelations,
  PublicHospitalProfile,
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";

export async function getHospitalProfile(
  hospitalId: string,
): Promise<
  ActionResponse<
    PublicHospitalProfile | PrivateHospitalProfile | SuperAdminHospitalProfile
  >
> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: hospital, error: hospitalError } = await supabase
      .from("hospitals")
      .select(
        `
        *,
        location:locations(
          city,
          state
        ),
        hospital_inventory(
          available_beds,
          icu_beds_available,
          ventilators_available,
          total_beds,
          icu_beds_total,
          ventilators_total,
          last_updated
        ),
        hospital_images(
          image_url,
          is_primary
        ),
        doctors(
          id,
          name,
          experience_years,
          status,
          is_available,
          room_number,
          availability_schedule,
          specialty:specialties_list(
            id,
            specialty_name
          )
        ),
        blood_bank(
          blood_group,
          units_available,
          last_updated
        )
      `,
      )
      .eq("id", hospitalId)
      .maybeSingle();

    if (hospitalError) {
      console.error("Error fetching hospital:", hospitalError);
      return {
        success: false,
        message: "Failed to fetch hospital data",
        data: null,
      };
    }

    if (!hospital) {
      return {
        success: false,
        message: "Hospital not found",
        data: null,
      };
    }

    const typedHospital = hospital as unknown as HospitalWithRelations;

    let isOwner = false;
    let isSuperAdmin = false;

    if (user) {
      const { data: viewer } = await supabase
        .from("profiles")
        .select("role, associated_hospital_id")
        .eq("id", user.id)
        .maybeSingle();

      isOwner = viewer?.associated_hospital_id === hospitalId;
      isSuperAdmin = viewer?.role === "superadmin";
    }

    const canViewPrivate = isOwner || isSuperAdmin;

    const specialties = Array.from(
      new Set(
        typedHospital.doctors
          ?.map((d) => d.specialty?.specialty_name)
          .filter((name): name is string => !!name) ?? [],
      ),
    );

    const primaryImage =
      typedHospital.hospital_images?.find((img) => img.is_primary)?.image_url ??
      typedHospital.hospital_images?.[0]?.image_url ??
      null;

    const publicProfile: PublicHospitalProfile = {
      id: typedHospital.id,
      name: typedHospital.name,
      is_verified: typedHospital.is_verified ?? false,
      has_ayushman_bharat: typedHospital.has_ayushman_bharat ?? false,
      trauma_level: typedHospital.trauma_level,
      location: typedHospital.location,
      inventory: {
        available_beds: typedHospital.hospital_inventory?.available_beds ?? 0,
        icu_beds_available:
          typedHospital.hospital_inventory?.icu_beds_available ?? 0,
        ventilators_available:
          typedHospital.hospital_inventory?.ventilators_available ?? 0,
        last_updated: typedHospital.hospital_inventory?.last_updated ?? null,
      },
      doctors:
        typedHospital.doctors?.map((d) => ({
          id: d.id,
          name: d.name,
          specialty: d.specialty?.specialty_name ?? null,
          experience_years: d.experience_years ?? 0,
          status: d.status,
          is_available: d.is_available ?? true,
        })) ?? [],
      specialties,
      blood_bank:
        typedHospital.blood_bank?.map((b) => ({
          blood_group: b.blood_group,
          units_available: b.units_available,
        })) ?? [],
      primary_image: primaryImage,
    };

    if (!canViewPrivate) {
      return {
        success: true,
        message: "Public profile retrieved",
        data: publicProfile,
      };
    }

    const privateProfile: PrivateHospitalProfile = {
      ...publicProfile,
      official_email: typedHospital.official_email,
      official_phone: typedHospital.official_phone,
      website_url: typedHospital.website_url,
      emergency_contact: typedHospital.emergency_contact,
      is_active: typedHospital.is_active ?? true,
      created_at: typedHospital.created_at ?? new Date().toISOString(),
      updated_at: typedHospital.updated_at ?? new Date().toISOString(),
      doctors:
        typedHospital.doctors?.map((d) => {
          const publicDoctor = publicProfile.doctors.find(
            (pd) => pd.id === d.id,
          );
          return {
            ...publicDoctor!,
            room_number: d.room_number,
            availability_schedule: d.availability_schedule as Record<
              string,
              string
            >,
          };
        }) ?? [],
      inventory_full: {
        total_beds: typedHospital.hospital_inventory?.total_beds ?? 0,
        icu_beds_total: typedHospital.hospital_inventory?.icu_beds_total ?? 0,
        ventilators_total:
          typedHospital.hospital_inventory?.ventilators_total ?? 0,
        available_beds: typedHospital.hospital_inventory?.available_beds ?? 0,
        icu_beds_available:
          typedHospital.hospital_inventory?.icu_beds_available ?? 0,
        ventilators_available:
          typedHospital.hospital_inventory?.ventilators_available ?? 0,
        last_updated: typedHospital.hospital_inventory?.last_updated ?? null,
      },
    };

    if (isOwner) {
      const { data: fromReferrals } = await supabase
        .from("referrals")
        .select(
          `
          id,
          patient_name,
          priority,
          status,
          created_at,
          to_hospital:hospitals!to_hospital_id(
            id,
            name
          )
        `,
        )
        .eq("from_hospital_id", hospitalId)
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: toReferrals } = await supabase
        .from("referrals")
        .select(
          `
          id,
          patient_name,
          priority,
          status,
          created_at,
          from_hospital:hospitals!from_hospital_id(
            id,
            name
          )
        `,
        )
        .eq("to_hospital_id", hospitalId)
        .order("created_at", { ascending: false })
        .limit(10);

      privateProfile.referrals_as_from = (fromReferrals ?? []).map((r) => ({
        id: r.id,
        patient_name: r.patient_name,
        priority: r.priority,
        status: r.status,
        created_at: r.created_at,
        to_hospital: r.to_hospital as { id: string; name: string },
      }));

      privateProfile.referrals_as_to = (toReferrals ?? []).map((r) => ({
        id: r.id,
        patient_name: r.patient_name,
        priority: r.priority,
        status: r.status,
        created_at: r.created_at,
        from_hospital: r.from_hospital as { id: string; name: string },
      }));
    }

    if (isSuperAdmin) {
      const { data: admins } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          email:users!inner(email),
          status,
          created_at
        `,
        )
        .eq("associated_hospital_id", hospitalId);

      const { data: referralMetrics } = await supabase
        .from("referrals")
        .select("status")
        .or(
          `from_hospital_id.eq.${hospitalId},to_hospital_id.eq.${hospitalId}`,
        );

      const totalReferrals = referralMetrics?.length ?? 0;
      const completedReferrals =
        referralMetrics?.filter((r) => r.status === "Completed").length ?? 0;
      const pendingReferrals =
        referralMetrics?.filter((r) => r.status === "Pending").length ?? 0;

      const superAdminProfile: SuperAdminHospitalProfile = {
        ...privateProfile,
        admins: (admins ?? []).map((a) => ({
          id: a.id,
          full_name: a.full_name,
          email: (a.email as unknown as { email: string }).email,
          status: a.status,
          created_at: a.created_at,
        })),
        system_metrics: {
          total_referrals: totalReferrals,
          completed_referrals: completedReferrals,
          pending_referrals: pendingReferrals,
          average_response_time: null,
        },
      };

      return {
        success: true,
        message: "Superadmin profile retrieved",
        data: superAdminProfile,
      };
    }

    return {
      success: true,
      message: "Private profile retrieved",
      data: privateProfile,
    };
  } catch (error) {
    console.error("Unexpected error in getHospitalProfile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: null,
    };
  }
}
