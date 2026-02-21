"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { getAuthenticatedProfile } from "@/utils/authCache";
import { invalidateAllMasterCaches } from "@/utils/masterCache";
type ServiceRow = Database["public"]["Tables"]["services_list"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services_list"]["Insert"];
async function validateSuperAdmin(): Promise<{
  isSuperAdmin: boolean;
  error?: string;
}> {
  const profile = await getAuthenticatedProfile();
  if (!profile || profile.role !== "superadmin") {
    return {
      isSuperAdmin: false,
      error: "Unauthorized: Superadmin access required.",
    };
  }
  return { isSuperAdmin: true };
}
export async function getMasterServices(): Promise<
  ActionResponse<ServiceRow[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services_list")
    .select("*")
    .order("service_name", { ascending: true });
  if (error) return { success: false, message: error.message, data: null };
  return {
    success: true,
    message: "Services fetched successfully",
    data: data || [],
  };
}
export async function addMasterService(
  payload: ServiceInsert,
): Promise<ActionResponse<ServiceRow>> {
  const { isSuperAdmin, error: authError } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: authError || "Unauthorized", data: null };
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("services_list")
      .insert([payload])
      .select()
      .single();
    if (error) {
      if (error.code === "23505") {
        return {
          success: false,
          message: "Service name already exists.",
          data: null,
        };
      }
      throw error;
    }
    await invalidateAllMasterCaches();
    revalidatePath("/superadmin/services");
    return { success: true, message: "Service added to master catalog", data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to add service";
    return { success: false, message: msg, data: null };
  }
}
export async function updateMasterService(
  id: string,
  payload: Partial<ServiceInsert>,
): Promise<ActionResponse<ServiceRow>> {
  const { isSuperAdmin } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: "Unauthorized", data: null };
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("services_list")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    await invalidateAllMasterCaches();
    revalidatePath("/superadmin/services");
    return { success: true, message: "Service updated successfully", data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update service";
    return { success: false, message: msg, data: null };
  }
}
export async function deleteMasterService(
  id: string,
): Promise<ActionResponse<null>> {
  const { isSuperAdmin } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: "Unauthorized", data: null };
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("services_list")
      .delete()
      .eq("id", id);
    if (error) {
      if (error.code === "23503") {
        return {
          success: false,
          message:
            "Cannot delete. This service is currently linked to hospitals.",
          data: null,
        };
      }
      throw error;
    }
    await invalidateAllMasterCaches();
    revalidatePath("/superadmin/services");
    return {
      success: true,
      message: "Service removed from catalog",
      data: null,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete service";
    return { success: false, message: msg, data: null };
  }
}
