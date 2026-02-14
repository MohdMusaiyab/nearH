"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

type InventoryRow = Database["public"]["Tables"]["hospital_inventory"]["Row"];
type InventoryUpdate =
  Database["public"]["Tables"]["hospital_inventory"]["Update"];
type BloodBankRow = Database["public"]["Tables"]["blood_bank"]["Row"];

async function getAdminHospitalId(
  supabase: SupabaseClient<Database>,
): Promise<string | null> {
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

export async function getDashboardData(): Promise<
  ActionResponse<{
    inventory: InventoryRow | null;
    bloodBank: BloodBankRow[];
  }>
> {
  const supabase = await createClient();
  const hospitalId = await getAdminHospitalId(supabase);

  if (!hospitalId)
    return { success: false, message: "Unauthorized", data: null };

  const [inventoryRes, bloodRes] = await Promise.all([
    supabase
      .from("hospital_inventory")
      .select("*")
      .eq("hospital_id", hospitalId)
      .single(),
    supabase
      .from("blood_bank")
      .select("*")
      .eq("hospital_id", hospitalId)
      .order("blood_group"),
  ]);

  return {
    success: true,
    message: "Data fetched",
    data: {
      inventory: inventoryRes.data,
      bloodBank: bloodRes.data || [],
    },
  };
}

export async function updateInventory(
  payload: InventoryUpdate,
): Promise<ActionResponse<InventoryRow>> {
  const supabase = await createClient();
  const hospitalId = await getAdminHospitalId(supabase);

  if (!hospitalId)
    return { success: false, message: "Unauthorized", data: null };

  const { data, error } = await supabase
    .from("hospital_inventory")
    .update({ ...payload, last_updated: new Date().toISOString() })
    .eq("hospital_id", hospitalId)
    .select()
    .single();

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/admin");
  return { success: true, message: "Inventory updated", data };
}

export async function updateBloodStock(
  bloodGroup: string,
  units: number,
): Promise<ActionResponse<BloodBankRow>> {
  const supabase = await createClient();
  const hospitalId = await getAdminHospitalId(supabase);

  if (!hospitalId)
    return { success: false, message: "Unauthorized", data: null };

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

  revalidatePath("/admin");
  return { success: true, message: `${bloodGroup} stock updated`, data };
}

export async function initializeBloodBank(): Promise<ActionResponse<null>> {
  const supabase = await createClient();
  const hospitalId = await getAdminHospitalId(supabase);
  if (!hospitalId)
    return { success: false, message: "Unauthorized", data: null };

  const groups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const rows = groups.map((group) => ({
    hospital_id: hospitalId,
    blood_group: group,
    units_available: 0,
  }));

  const { error } = await supabase
    .from("blood_bank")
    .upsert(rows, { onConflict: "hospital_id, blood_group" });

  if (error) return { success: false, message: error.message, data: null };
  revalidatePath("/admin");
  return { success: true, message: "Blood bank initialized", data: null };
}
