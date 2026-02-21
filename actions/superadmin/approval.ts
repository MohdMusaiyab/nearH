"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import {
  getAuthenticatedProfile,
  invalidateUserCache,
} from "@/utils/authCache";
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
export async function approveHospital(
  profileId: string,
  hospitalId: string,
): Promise<ActionResponse<null>> {
  const { isSuperAdmin, error: authError } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: authError || "Unauthorized", data: null };
  const supabase = await createClient();
  try {
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", profileId)
      .single();
    if (currentProfile?.status === "approved") {
      return {
        success: false,
        message: "This user is already approved.",
        data: null,
      };
    }
    const { error: hospError } = await supabase
      .from("hospitals")
      .update({ is_verified: true })
      .eq("id", hospitalId);
    if (hospError) throw new Error("Hospital verification failed.");
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        status: "approved",
        role: "admin",
        associated_hospital_id: hospitalId,
      })
      .eq("id", profileId);
    if (profileError) throw new Error("Profile approval failed.");
    await invalidateUserCache(profileId);
    revalidatePath("/superadmin/approvals");
    revalidatePath("/explore");
    return {
      success: true,
      message: "Hospital verified. Inventory created via System Trigger.",
      data: null,
    };
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Approval process failed.";
    return { success: false, message: msg, data: null };
  }
}
export async function rejectAndPurgeUser(
  profileId: string,
  hospitalId: string,
): Promise<ActionResponse<null>> {
  const { isSuperAdmin } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: "Unauthorized", data: null };
  const supabase = await createClient();
  try {
    const { data: hospital } = await supabase
      .from("hospitals")
      .select("is_verified")
      .eq("id", hospitalId)
      .single();
    if (hospital?.is_verified) {
      return {
        success: false,
        message: "Cannot purge a verified hospital. Use 'Deactivate' instead.",
        data: null,
      };
    }
    const { error: hospDeleteError } = await supabase
      .from("hospitals")
      .delete()
      .eq("id", hospitalId);
    if (hospDeleteError) throw new Error("Failed to delete hospital record.");
    const { error: profileDeleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", profileId);
    if (profileDeleteError) throw new Error("Failed to delete user profile.");
    await invalidateUserCache(profileId);
    revalidatePath("/superadmin/approvals");
    return {
      success: true,
      message: "Application purged successfully.",
      data: null,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Purge failed.";
    return { success: false, message: msg, data: null };
  }
}
