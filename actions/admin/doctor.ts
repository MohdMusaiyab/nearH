"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { getValidatedAdminHospitalId } from "@/lib/auth/guards";
import { CreateDoctorSchema, UpdateDoctorSchema } from "@/lib/validations/actions";

type DoctorRow = Database["public"]["Tables"]["doctors"]["Row"];
type DoctorInsert = Database["public"]["Tables"]["doctors"]["Insert"];
type SpecialtyRow = Database["public"]["Tables"]["specialties_list"]["Row"];

export type DoctorWithSpecialty = DoctorRow & {
  specialties_list: Pick<SpecialtyRow, "id" | "specialty_name"> | null;
};

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

  const parsed = CreateDoctorSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Validation failed",
      data: null,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("doctors")
    .insert([{ ...parsed.data, hospital_id: hospitalId }])
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

  const parsed = UpdateDoctorSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Validation failed",
      data: null,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("doctors")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
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
