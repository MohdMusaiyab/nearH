"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";

type SpecialtyRow = Database["public"]["Tables"]["specialties_list"]["Row"];
type SpecialtyInsert =
  Database["public"]["Tables"]["specialties_list"]["Insert"];

export async function getSpecialties(): Promise<
  ActionResponse<SpecialtyRow[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("specialties_list")
    .select("*")
    .order("specialty_name", { ascending: true });

  if (error) return { success: false, message: error.message, data: null };
  return { success: true, message: "Specialties fetched", data };
}

export async function addSpecialty(
  payload: SpecialtyInsert,
): Promise<ActionResponse<SpecialtyRow>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("specialties_list")
    .insert([payload])
    .select()
    .single();

  if (error) {
    if (error.code === "23505")
      return {
        success: false,
        message: "Specialty already exists.",
        data: null,
      };
    return { success: false, message: error.message, data: null };
  }

  revalidatePath("/superadmin/specialties");
  return { success: true, message: "Specialty added successfully", data };
}

export async function updateSpecialty(
  id: string,
  payload: Partial<SpecialtyInsert>,
): Promise<ActionResponse<SpecialtyRow>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("specialties_list")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/superadmin/specialties");
  return { success: true, message: "Specialty updated", data };
}

export async function deleteSpecialty(
  id: string,
): Promise<ActionResponse<null>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("specialties_list")
    .delete()
    .eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return {
        success: false,
        message: "Cannot delete. This specialty is assigned to active doctors.",
        data: null,
      };
    }
    return { success: false, message: error.message, data: null };
  }

  revalidatePath("/superadmin/specialties");
  return { success: true, message: "Specialty removed", data: null };
}
