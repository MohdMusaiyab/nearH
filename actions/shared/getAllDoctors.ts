"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { DoctorDirectoryEntry, DoctorSchedule } from "@/types/doctors";
import { Database } from "@/types/database.types";

interface DoctorQueryParams {
  page: number;
  query?: string;
  specialtyId?: string;
}
type RawDoctorJoin = Database["public"]["Tables"]["doctors"]["Row"] & {
  specialties_list: { id: string; specialty_name: string } | null;
  hospitals: {
    id: string;
    name: string;
    location: { city: string; state: string } | null;
  } | null;
};

export async function getDoctorDirectory({
  page,
  query,
  specialtyId,
}: DoctorQueryParams): Promise<
  ActionResponse<{ doctors: DoctorDirectoryEntry[]; totalCount: number }>
> {
  const supabase = await createClient();
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 1. Build Query with all required fields
  let supabaseQuery = supabase.from("doctors").select(
    `
      *,
      specialties_list(id, specialty_name),
      hospitals(
        id,
        name,
        location:locations(city, state)
      )
    `,
    { count: "exact" },
  );

  // 2. Filters
  if (query) supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
  if (specialtyId)
    supabaseQuery = supabaseQuery.eq("specialty_id", specialtyId);

  // 3. Execution
  const { data, error, count } = await supabaseQuery
    .order("name", { ascending: true })
    .range(from, to);

  if (error) return { success: false, message: error.message, data: null };

  // 4. Strict Transformation
  const doctors: DoctorDirectoryEntry[] = (
    data as unknown as RawDoctorJoin[]
  ).map((d) => {
    // Safely cast JSONB to our DoctorSchedule interface
    const schedule = (d.availability_schedule as DoctorSchedule) ?? {};

    return {
      id: d.id,
      name: d.name,
      experience_years: d.experience_years ?? 0,
      status: d.status ?? "Available",
      is_available: !!d.is_available,
      room_number: d.room_number,
      availability_schedule: schedule,
      specialty: d.specialties_list
        ? {
            id: d.specialties_list.id,
            name: d.specialties_list.specialty_name,
          }
        : null,
      hospital: {
        id: d.hospitals?.id ?? "unknown",
        name: d.hospitals?.name ?? "Unknown Hospital",
        location: d.hospitals?.location
          ? {
              city: d.hospitals.location.city,
              state: d.hospitals.location.state,
            }
          : null,
      },
    };
  });

  return {
    success: true,
    message: "Doctors retrieved",
    data: { doctors, totalCount: count || 0 },
  };
}
