"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { validateSuperAdmin } from "@/lib/auth/guards";
import { invalidateAllMasterCaches } from "@/utils/masterCache";
import { SpecialtySchema } from "@/lib/validations/actions";
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
  return { success: true, message: "Specialties fetched", data: data || [] };
}
export async function addSpecialty(
  payload: SpecialtyInsert,
): Promise<ActionResponse<SpecialtyRow>> {
  const { isSuperAdmin, error: authError } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: authError || "Unauthorized", data: null };

  const parsed = SpecialtySchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Validation failed",
      data: null,
    };
  }

  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("specialties_list")
      .insert([parsed.data])
      .select()
      .single();
    if (error) {
      if (error.code === "23505") {
        return {
          success: false,
          message: "Specialty already exists.",
          data: null,
        };
      }
      throw error;
    }
    await invalidateAllMasterCaches();
    revalidatePath("/superadmin/specialties");
    revalidatePath("/explore");
    revalidatePath("/admin/doctors");
    return { success: true, message: "Specialty added successfully", data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add specialty";
    return { success: false, message: msg, data: null };
  }
}
export async function updateSpecialty(
  id: string,
  payload: Partial<SpecialtyInsert>,
): Promise<ActionResponse<SpecialtyRow>> {
  const { isSuperAdmin, error: authError } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: authError || "Unauthorized", data: null };

  const parsed = SpecialtySchema.partial().safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Validation failed",
      data: null,
    };
  }

  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("specialties_list")
      .update(parsed.data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    await invalidateAllMasterCaches();
    revalidatePath("/superadmin/specialties");
    revalidatePath("/explore");
    revalidatePath("/admin/doctors");
    return { success: true, message: "Specialty updated", data };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to update specialty";
    return { success: false, message: msg, data: null };
  }
}
export async function deleteSpecialty(
  id: string,
): Promise<ActionResponse<null>> {
  const { isSuperAdmin } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: "Unauthorized", data: null };
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("specialties_list")
      .delete()
      .eq("id", id);
    if (error) {
      if (error.code === "23503") {
        return {
          success: false,
          message:
            "Cannot delete. This specialty is assigned to active doctors.",
          data: null,
        };
      }
      throw error;
    }
    await invalidateAllMasterCaches();
    revalidatePath("/superadmin/specialties");
    revalidatePath("/explore");
    revalidatePath("/admin/doctors");
    return { success: true, message: "Specialty removed", data: null };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to delete specialty";
    return { success: false, message: msg, data: null };
  }
}
