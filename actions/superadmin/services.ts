"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";

type ServiceRow = Database["public"]["Tables"]["services_list"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services_list"]["Insert"];

export async function getMasterServices(): Promise<
  ActionResponse<ServiceRow[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services_list")
    .select("*")
    .order("service_name", { ascending: true });

  if (error) return { success: false, message: error.message, data: null };
  return { success: true, message: "services_list fetched", data };
}

export async function addMasterService(
  payload: ServiceInsert,
): Promise<ActionResponse<ServiceRow>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services_list")
    .insert([payload])
    .select()
    .single();

  if (error) {
    if (error.code === "23505")
      return {
        success: false,
        message: "Service name already exists.",
        data: null,
      };
    return { success: false, message: error.message, data: null };
  }

  revalidatePath("/superadmin/services_list");
  return { success: true, message: "Service added to master catalog", data };
}

export async function updateMasterService(
  id: string,
  payload: Partial<ServiceInsert>,
): Promise<ActionResponse<ServiceRow>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services_list")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/superadmin/services_list");
  return { success: true, message: "Service updated successfully", data };
}

export async function deleteMasterService(
  id: string,
): Promise<ActionResponse<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("services_list").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return {
        success: false,
        message:
          "Cannot delete. This service is currently linked to hospitals.",
        data: null,
      };
    }
    return { success: false, message: error.message, data: null };
  }

  revalidatePath("/superadmin/services_list");
  return { success: true, message: "Service removed from catalog", data: null };
}
