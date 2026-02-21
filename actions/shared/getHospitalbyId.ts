"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import {
  HospitalWithRelations,
  PublicHospitalProfile,
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";
import { getAuthenticatedProfile } from "@/utils/authCache";
export async function getHospitalProfile(
  hospitalId: string,
): Promise<
  ActionResponse<
    PublicHospitalProfile | PrivateHospitalProfile | SuperAdminHospitalProfile
  >
> {
  if (!hospitalId) {
    return { success: false, message: "Hospital ID is required", data: null };
  }
  const supabase = await createClient();
  try {
    const viewerProfile = await getAuthenticatedProfile();
    const isOwner = viewerProfile?.associated_hospital_id === hospitalId;
    const isSuperAdmin = viewerProfile?.role === "superadmin";
    const canViewPrivate = isOwner || isSuperAdmin;
    const { data: hospital, error: hospitalError } = await supabase
      .from("hospitals")
      .select(
        `
    *,
    location:locations(city, state),
    hospital_inventory(
      available_beds, icu_beds_available, ventilators_available,
      total_beds, icu_beds_total, ventilators_total, last_updated
    ),
    hospital_images(image_url, is_primary),
    doctors(
      id, name, experience_years, status, is_available, room_number,
      availability_schedule,
      specialty:specialties_list(id, specialty_name)
    ),
    blood_bank(blood_group, units_available, last_updated),
    hospital_services(
      service_id,
      services_list(
        id,
        service_name,
        description
      )
    )
  `,
      )
      .eq("id", hospitalId)
      .maybeSingle();
    if (hospitalError || !hospital) {
      return {
        success: false,
        message: hospitalError?.message || "Hospital not found",
        data: null,
      };
    }
    const typedHospital = hospital as unknown as HospitalWithRelations & {
      hospital_services: {
        service_id: string;
        services_list: {
          id: string;
          service_name: string;
          description: string | null;
        } | null;
      }[];
    };
    const specialties = Array.from(
      new Set(
        typedHospital.doctors
          ?.map((d) => d.specialty?.specialty_name)
          .filter((name): name is string => !!name) ?? [],
      ),
    );
    const services =
      typedHospital.hospital_services
        ?.map((hs) => hs.services_list?.service_name)
        .filter((name): name is string => !!name) ?? [];
    const primaryImage =
      typedHospital.hospital_images?.find((img) => img.is_primary)?.image_url ??
      typedHospital.hospital_images?.[0]?.image_url ??
      null;
    const publicProfile: PublicHospitalProfile = {
      id: typedHospital.id,
      name: typedHospital.name,
      is_verified: !!typedHospital.is_verified,
      has_ayushman_bharat: !!typedHospital.has_ayushman_bharat,
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
          is_available: !!d.is_available,
        })) ?? [],
      specialties,
      services,
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
      is_active: !!typedHospital.is_active,
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
      const [fromRes, toRes] = await Promise.all([
        supabase
          .from("referrals")
          .select(
            "id, patient_name, priority, status, created_at, to_hospital:hospitals!to_hospital_id(id, name)",
          )
          .eq("from_hospital_id", hospitalId)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("referrals")
          .select(
            "id, patient_name, priority, status, created_at, from_hospital:hospitals!from_hospital_id(id, name)",
          )
          .eq("to_hospital_id", hospitalId)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      privateProfile.referrals_as_from = (fromRes.data ?? []).map((r) => ({
        ...r,
        to_hospital: r.to_hospital as { id: string; name: string },
      }));
      privateProfile.referrals_as_to = (toRes.data ?? []).map((r) => ({
        ...r,
        from_hospital: r.from_hospital as { id: string; name: string },
      }));
    }
    if (isSuperAdmin) {
      const [adminRes, metricsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, status, created_at")
          .eq("associated_hospital_id", hospitalId),
        supabase
          .from("referrals")
          .select("status")
          .or(
            `from_hospital_id.eq.${hospitalId},to_hospital_id.eq.${hospitalId}`,
          ),
      ]);
      const adminsWithEmail = await Promise.all(
        (adminRes.data ?? []).map(async (admin) => {
          const { data: userData } = await supabase.auth.admin.getUserById(
            admin.id,
          );
          return {
            id: admin.id,
            full_name: admin.full_name,
            email: userData?.user?.email ?? "Email not available",
            status: admin.status,
            created_at: admin.created_at,
          };
        }),
      );
      const superAdminProfile: SuperAdminHospitalProfile = {
        ...privateProfile,
        admins: adminsWithEmail,
        system_metrics: {
          total_referrals: metricsRes.data?.length ?? 0,
          completed_referrals:
            metricsRes.data?.filter((r) => r.status === "Completed").length ??
            0,
          pending_referrals:
            metricsRes.data?.filter((r) => r.status === "Pending").length ?? 0,
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
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : "Critical error fetching profile";
    return { success: false, message: msg, data: null };
  }
}
