"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";

type LocationRow = Database["public"]["Tables"]["locations"]["Row"];
type LocationInsert = Database["public"]["Tables"]["locations"]["Insert"];

export async function getLocations(): Promise<ActionResponse<LocationRow[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("city", { ascending: true });

  if (error) {
    return { success: false, message: error.message, data: null };
  }

  return { success: true, message: "Locations fetched", data };
}

export async function addLocation(
  payload: LocationInsert,
): Promise<ActionResponse<LocationRow>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("locations")
    .insert([payload])
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "This city already exists in this state.",
        data: null,
      };
    }
    return { success: false, message: error.message, data: null };
  }

  revalidatePath("/superadmin/locations");
  revalidatePath("/auth/signup");
  return { success: true, message: "Location added successfully", data };
}

export async function updateLocation(
  id: string,
  payload: Partial<LocationInsert>,
): Promise<ActionResponse<LocationRow>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("locations")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, message: error.message, data: null };
  }

  revalidatePath("/superadmin/locations");
  return { success: true, message: "Location updated successfully", data };
}

export async function deleteLocation(
  id: string,
): Promise<ActionResponse<null>> {
  const supabase = await createClient();

  const { error } = await supabase.from("locations").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return {
        success: false,
        message:
          "Cannot delete. Hospitals are currently registered in this location.",
        data: null,
      };
    }
    return { success: false, message: error.message, data: null };
  }

  revalidatePath("/superadmin/locations");
  revalidatePath("/auth/signup");
  return {
    success: true,
    message: "Location removed successfully",
    data: null,
  };
}
