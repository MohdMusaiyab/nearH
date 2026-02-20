"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import {
  getAuthenticatedProfile,
  invalidateUserCache,
} from "@/utils/authCache";

type HospitalUpdate = Database["public"]["Tables"]["hospitals"]["Update"];

export async function updateHospitalProfile(
  payload: HospitalUpdate,
  serviceIds: string[],
): Promise<ActionResponse<null>> {
  const profile = await getAuthenticatedProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "approved") {
    return {
      success: false,
      message: "Unauthorized: Admin access only.",
      data: null,
    };
  }

  const authorizedHospitalId = profile.associated_hospital_id;

  if (!authorizedHospitalId) {
    return {
      success: false,
      message: "No hospital associated with your profile.",
      data: null,
    };
  }

  const supabase = await createClient();

  try {
    const { error: hospitalError } = await supabase
      .from("hospitals")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authorizedHospitalId);

    if (hospitalError) throw new Error(hospitalError.message);

    const { error: deleteError } = await supabase
      .from("hospital_services")
      .delete()
      .eq("hospital_id", authorizedHospitalId);

    if (deleteError) throw new Error(deleteError.message);

    if (serviceIds.length > 0) {
      const serviceRows = serviceIds.map((sId) => ({
        hospital_id: authorizedHospitalId,
        service_id: sId,
      }));

      const { error: insertError } = await supabase
        .from("hospital_services")
        .insert(serviceRows);

      if (insertError) throw new Error(insertError.message);
    }

    await invalidateUserCache(profile.id);

    revalidatePath("/admin/profile");
    return {
      success: true,
      message: "Hospital profile updated successfully",
      data: null,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database update failed";
    console.error(`[Hospital Update Error]: ${msg}`);
    return { success: false, message: msg, data: null };
  }
}
