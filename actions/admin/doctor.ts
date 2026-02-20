"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { getAuthenticatedProfile } from "@/utils/authCache";

type DoctorRow = Database["public"]["Tables"]["doctors"]["Row"];
type DoctorInsert = Database["public"]["Tables"]["doctors"]["Insert"];
type SpecialtyRow = Database["public"]["Tables"]["specialties_list"]["Row"];

export type DoctorWithSpecialty = DoctorRow & {
  specialties_list: Pick<SpecialtyRow, "id" | "specialty_name"> | null;
};

async function getValidatedAdminHospitalId(): Promise<{
  hospitalId: string | null;
  error?: string;
}> {
  const profile = await getAuthenticatedProfile();

  if (!profile)
    return { hospitalId: null, error: "Unauthorized - Not logged in" };
  if (profile.role !== "admin")
    return { hospitalId: null, error: "Unauthorized - Admin only" };
  if (profile.status !== "approved")
    return { hospitalId: null, error: "Account pending approval" };
  if (!profile.associated_hospital_id)
    return {
      hospitalId: null,
      error: "No hospital associated with this account",
    };

  return { hospitalId: profile.associated_hospital_id };
}

export async function getHospitalDoctors(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<
  ActionResponse<{ doctors: DoctorWithSpecialty[]; totalCount: number }>
> {
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();
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
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

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
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

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
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

  const { error } = await supabase
    .from("doctors")
    .delete()
    .match({ id, hospital_id: hospitalId });

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/admin/doctors");
  return { success: true, message: "Doctor record removed", data: null };
}
