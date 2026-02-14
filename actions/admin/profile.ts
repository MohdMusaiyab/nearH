"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";

type HospitalUpdate = Database["public"]["Tables"]["hospitals"]["Update"];

export async function updateHospitalProfile(
  payload: HospitalUpdate,
  serviceIds: string[],
): Promise<ActionResponse<null>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("associated_hospital_id")
    .eq("id", user?.id || "")
    .single();

  const hospitalId = profile?.associated_hospital_id;
  if (!hospitalId)
    return { success: false, message: "Unauthorized", data: null };

  // 1. Update Hospital Core Data
  const { error: hospitalError } = await supabase
    .from("hospitals")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", hospitalId);

  if (hospitalError)
    return { success: false, message: hospitalError.message, data: null };

  // 2. Sync Services
  await supabase
    .from("hospital_services")
    .delete()
    .eq("hospital_id", hospitalId);
  if (serviceIds.length > 0) {
    const serviceRows = serviceIds.map((sId) => ({
      hospital_id: hospitalId,
      service_id: sId,
    }));
    await supabase.from("hospital_services").insert(serviceRows);
  }

  revalidatePath("/admin/profile");
  return { success: true, message: "Profile updated successfully", data: null };
}
