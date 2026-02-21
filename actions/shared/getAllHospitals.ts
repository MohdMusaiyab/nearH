"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { ExploreHospital } from "@/types/explore";
import { Database } from "@/types/database.types";
interface ExploreParams {
  page: number;
  query?: string;
  locationId?: string;
  specialtyId?: string;
  serviceId?: string;
}
type RawJoinResult = Database["public"]["Tables"]["hospitals"]["Row"] & {
  location: { city: string; state: string } | null;
  hospital_inventory:
    | {
        available_beds: number;
        icu_beds_available: number;
        ventilators_available: number;
      }[]
    | null;
  hospital_images: { image_url: string }[] | null;
  doctors: {
    specialty_id: string;
    specialties_list: { specialty_name: string } | null;
  }[];
  hospital_services: {
    service_id: string;
    services_list: { service_name: string } | null;
  }[];
};
export async function getExploreHospitals({
  page,
  query,
  locationId,
  specialtyId,
  serviceId,
}: ExploreParams): Promise<
  ActionResponse<{ hospitals: ExploreHospital[]; totalCount: number }>
> {
  const supabase = await createClient();
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  try {
    let supabaseQuery = supabase.from("hospitals").select(
      `
        *,
        location:locations(city, state),
        hospital_inventory(available_beds, icu_beds_available, ventilators_available),
        hospital_images(image_url),
        doctors(
          specialty_id,
          specialties_list(specialty_name)
        ),
        hospital_services(
          service_id,
          services_list(service_name)
        )
      `,
      { count: "exact" },
    );
    if (query) supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
    if (locationId) supabaseQuery = supabaseQuery.eq("location_id", locationId);
    if (specialtyId) {
      supabaseQuery = supabaseQuery.filter(
        "doctors.specialty_id",
        "eq",
        specialtyId,
      );
    }
    if (serviceId) {
      supabaseQuery = supabaseQuery.filter(
        "hospital_services.service_id",
        "eq",
        serviceId,
      );
    }
    const { data, error, count } = await supabaseQuery
      .eq("is_active", true)
      .order("is_verified", { ascending: false })
      .order("name", { ascending: true })
      .range(from, to);
    if (error) throw new Error(error.message);
    const rawData = (data ?? []) as unknown as RawJoinResult[];
    const hospitals: ExploreHospital[] = rawData.map((h) => {
      const inv = h.hospital_inventory?.[0] ?? null;
      const img =
        h.hospital_images?.find((i) => i.image_url)?.image_url ?? null;
      const specialties = Array.from(
        new Set(
          h.doctors
            ?.map((d) => d.specialties_list?.specialty_name)
            .filter((n): n is string => !!n) ?? [],
        ),
      );
      const services =
        h.hospital_services
          ?.map((s) => s.services_list?.service_name)
          .filter((n): n is string => !!n) ?? [];
      return {
        id: h.id,
        name: h.name,
        is_verified: !!h.is_verified,
        has_ayushman_bharat: !!h.has_ayushman_bharat,
        trauma_level: h.trauma_level,
        location: h.location,
        inventory: {
          available_beds: inv?.available_beds ?? 0,
          icu_beds_available: inv?.icu_beds_available ?? 0,
          ventilators_available: inv?.ventilators_available ?? 0,
        },
        primary_image: img,
        specialties,
        services,
      };
    });
    return {
      success: true,
      message: "Hospitals retrieved successfully",
      data: {
        hospitals,
        totalCount: count || 0,
      },
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to load exploration data";
    console.error(`[ExploreHospitals Error]: ${msg}`);
    return {
      success: false,
      message: msg,
      data: null,
    };
  }
}
