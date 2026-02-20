"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { getAuthenticatedProfile } from "@/utils/authCache";

type InventoryRow = Database["public"]["Tables"]["hospital_inventory"]["Row"];
type InventoryUpdate =
  Database["public"]["Tables"]["hospital_inventory"]["Update"];
type BloodBankRow = Database["public"]["Tables"]["blood_bank"]["Row"];

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
  if (!profile.associated_hospital_id) {
    return {
      hospitalId: null,
      error: "No hospital associated with this account. Contact Superadmin.",
    };
  }

  return { hospitalId: profile.associated_hospital_id };
}

export async function getDashboardData(): Promise<
  ActionResponse<{
    inventory: InventoryRow | null;
    bloodBank: BloodBankRow[];
  }>
> {
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

  try {
    const [inventoryRes, bloodRes] = await Promise.all([
      supabase
        .from("hospital_inventory")
        .select("*")
        .eq("hospital_id", hospitalId)
        .maybeSingle(),
      supabase
        .from("blood_bank")
        .select("*")
        .eq("hospital_id", hospitalId)
        .order("blood_group"),
    ]);

    return {
      success: true,
      message: "Dashboard data synced",
      data: {
        inventory: inventoryRes.data || null,
        bloodBank: bloodRes.data || [],
      },
    };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return {
      success: false,
      message: "Failed to fetch dashboard data",
      data: null,
    };
  }
}

export async function updateInventory(
  payload: InventoryUpdate,
): Promise<ActionResponse<InventoryRow>> {
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hospital_inventory")
    .update({
      ...payload,
      last_updated: new Date().toISOString(),
    })
    .eq("hospital_id", hospitalId)
    .select()
    .single();

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Inventory updated successfully", data };
}

export async function updateBloodStock(
  bloodGroup: string,
  units: number,
): Promise<ActionResponse<BloodBankRow>> {
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blood_bank")
    .upsert(
      {
        hospital_id: hospitalId,
        blood_group: bloodGroup,
        units_available: units,
        last_updated: new Date().toISOString(),
      },
      { onConflict: "hospital_id, blood_group" },
    )
    .select()
    .single();

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/admin/dashboard");
  return { success: true, message: `${bloodGroup} stock updated`, data };
}

export async function initializeBloodBank(): Promise<ActionResponse<null>> {
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();
  const allGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const { data: existingRows, error: fetchError } = await supabase
    .from("blood_bank")
    .select("blood_group")
    .eq("hospital_id", hospitalId);

  if (fetchError)
    return { success: false, message: fetchError.message, data: null };

  const existingGroups = existingRows?.map((r) => r.blood_group) || [];
  const missingGroups = allGroups.filter((g) => !existingGroups.includes(g));

  if (missingGroups.length === 0) {
    return {
      success: true,
      message: "Blood bank already initialized",
      data: null,
    };
  }

  const rowsToInsert = missingGroups.map((group) => ({
    hospital_id: hospitalId,
    blood_group: group,
    units_available: 0,
  }));

  const { error: insertError } = await supabase
    .from("blood_bank")
    .insert(rowsToInsert);

  if (insertError)
    return { success: false, message: insertError.message, data: null };

  revalidatePath("/admin/dashboard");
  return {
    success: true,
    message: `Initialized ${missingGroups.length} blood groups`,
    data: null,
  };
}

export async function updateAvailability(
  payload: Partial<
    Pick<
      InventoryRow,
      "available_beds" | "icu_beds_available" | "ventilators_available"
    >
  >,
): Promise<ActionResponse<InventoryRow>> {
  const { hospitalId, error: authError } = await getValidatedAdminHospitalId();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hospital_inventory")
    .update({
      ...payload,
      last_updated: new Date().toISOString(),
    })
    .eq("hospital_id", hospitalId)
    .select()
    .single();

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/admin/dashboard");
  return { success: true, message: "Real-time availability updated", data };
}
