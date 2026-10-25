"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import {
  invalidateUserCache,
} from "@/utils/authCache";
import { getValidatedAdminContext } from "@/lib/auth/guards";

type HospitalUpdate = Database["public"]["Tables"]["hospitals"]["Update"];

export interface HospitalEditableFields {
  name?: string;
  official_phone?: string;
  location_id?: string | null;
  website_url?: string | null;
  emergency_contact?: string | null;
  has_ayushman_bharat?: boolean | null;
  trauma_level?: number | null;
}

export async function updateHospitalProfile(
  payload: HospitalEditableFields,
  serviceIds: string[],
): Promise<ActionResponse<null>> {
  const {
    hospitalId: authorizedHospitalId,
    userId,
    error: authError,
  } = await getValidatedAdminContext();

  if (!authorizedHospitalId || !userId) {
    return {
      success: false,
      message: authError || "Unauthorized",
      data: null,
    };
  }

  const supabase = await createClient();

  try {
    // Whitelist allowed updates to prevent mass assignment (e.g. self-verifying via is_verified)
    const sanitizedUpdate: Partial<HospitalUpdate> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.name !== undefined) sanitizedUpdate.name = payload.name;
    if (payload.official_phone !== undefined)
      sanitizedUpdate.official_phone = payload.official_phone;
    if (payload.location_id !== undefined)
      sanitizedUpdate.location_id = payload.location_id;
    if (payload.website_url !== undefined)
      sanitizedUpdate.website_url = payload.website_url;
    if (payload.emergency_contact !== undefined)
      sanitizedUpdate.emergency_contact = payload.emergency_contact;
    if (payload.has_ayushman_bharat !== undefined)
      sanitizedUpdate.has_ayushman_bharat = payload.has_ayushman_bharat;
    if (payload.trauma_level !== undefined)
      sanitizedUpdate.trauma_level = payload.trauma_level;

    const { error: hospitalError } = await supabase
      .from("hospitals")
      .update(sanitizedUpdate)
      .eq("id", authorizedHospitalId);

    if (hospitalError) throw new Error(hospitalError.message);

    // Non-destructive diff-based synchronization: only insert additions and delete removals
    const { data: currentServices, error: fetchServicesError } = await supabase
      .from("hospital_services")
      .select("service_id")
      .eq("hospital_id", authorizedHospitalId);

    if (fetchServicesError) throw new Error(fetchServicesError.message);

    const currentServiceIds = new Set(
      (currentServices ?? [])
        .map((s) => s.service_id)
        .filter(Boolean) as string[],
    );
    const targetServiceIds = new Set(serviceIds.filter(Boolean));

    const toAdd = [...targetServiceIds].filter(
      (id) => !currentServiceIds.has(id),
    );
    const toRemove = [...currentServiceIds].filter(
      (id) => !targetServiceIds.has(id),
    );

    // Insert new services first
    if (toAdd.length > 0) {
      const addRows = toAdd.map((sId) => ({
        hospital_id: authorizedHospitalId,
        service_id: sId,
      }));
      const { error: insertError } = await supabase
        .from("hospital_services")
        .insert(addRows);
      if (insertError) throw new Error(insertError.message);
    }

    // Delete only explicitly removed services
    if (toRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from("hospital_services")
        .delete()
        .eq("hospital_id", authorizedHospitalId)
        .in("service_id", toRemove);
      if (deleteError) throw new Error(deleteError.message);
    }

    await invalidateUserCache(userId);

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
