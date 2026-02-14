"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

type DoctorRow = Database["public"]["Tables"]["doctors"]["Row"];
type DoctorInsert = Database["public"]["Tables"]["doctors"]["Insert"];
type SpecialtyRow = Database["public"]["Tables"]["specialties_list"]["Row"];

export type DoctorWithSpecialty = DoctorRow & {
  specialties_list: Pick<SpecialtyRow, "id" | "specialty_name"> | null;
};

async function getAdminHospitalId(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("associated_hospital_id")
    .eq("id", user.id)
    .single();

  return profile?.associated_hospital_id || null;
}

export async function getHospitalDoctors(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<
  ActionResponse<{ doctors: DoctorWithSpecialty[]; totalCount: number }>
> {
  const supabase = await createClient();
  const hospitalId = await getAdminHospitalId(supabase);

  if (!hospitalId) {
    return {
      success: false,
      message: "Unauthorized or Hospital not linked",
      data: null,
    };
  }

  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase
    .from("doctors")
    .select(
      `
      *,
      specialties_list (id, specialty_name)
    `,
      { count: "exact" },
    )
    .eq("hospital_id", hospitalId)
    .range(from, to)
    .order("name", { ascending: true });

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  const { data, count, error } = await query;

  if (error) return { success: false, message: error.message, data: null };

  return {
    success: true,
    message: "Doctors fetched",
    data: {
      doctors: (data as unknown as DoctorWithSpecialty[]) || [],
      totalCount: count || 0,
    },
  };
}

export async function createDoctor(
  payload: Omit<DoctorInsert, "hospital_id">,
): Promise<ActionResponse<DoctorRow>> {
  const supabase = await createClient();
  const hospitalId = await getAdminHospitalId(supabase);

  if (!hospitalId) {
    return {
      success: false,
      message: "Unauthorized: No hospital linked.",
      data: null,
    };
  }

  const { data, error } = await supabase
    .from("doctors")
    .insert([{ ...payload, hospital_id: hospitalId }])
    .select()
    .single();

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/admin/doctors");
  return { success: true, message: "Doctor profile created", data };
}

export async function updateDoctor(
  id: string,
  payload: Partial<DoctorInsert>,
): Promise<ActionResponse<DoctorRow>> {
  const supabase = await createClient();
  const hospitalId = await getAdminHospitalId(supabase);

  if (!hospitalId)
    return { success: false, message: "Unauthorized", data: null };

  const { data, error } = await supabase
    .from("doctors")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .match({ id, hospital_id: hospitalId })

    .select()
    .single();

  if (error)
    return {
      success: false,
      message: "Update failed or unauthorized",
      data: null,
    };

  revalidatePath("/admin/doctors");
  return { success: true, message: "Doctor profile updated", data };
}

export async function deleteDoctor(id: string): Promise<ActionResponse<null>> {
  const supabase = await createClient();
  const hospitalId = await getAdminHospitalId(supabase);

  if (!hospitalId)
    return { success: false, message: "Unauthorized", data: null };

  const { error } = await supabase
    .from("doctors")
    .delete()
    .match({ id, hospital_id: hospitalId });

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/admin/doctors");
  return { success: true, message: "Doctor record removed", data: null };
}
