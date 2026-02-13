"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";

export async function approveHospital(
  profileId: string,
  hospitalId: string,
): Promise<ActionResponse> {
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
      .update({ status: "approved", role: "admin" })
      .eq("id", profileId);

    if (profileError) throw new Error("Profile approval failed.");

    revalidatePath("/superadmin/approvals");
    return {
      success: true,
      message: "Hospital and Admin approved successfully.",
      data: null,
    };
  } catch (error) {
    return { success: false, message: "Approval process failed.", data: null };
  }
}

export async function rejectAndPurgeUser(
  profileId: string,
  hospitalId: string,
): Promise<ActionResponse> {
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
        message: "Cannot delete a verified hospital. Deactivate it instead.",
        data: null,
      };
    }
    const { error: hospDeleteError } = await supabase
      .from("hospitals")
      .delete()
      .eq("id", hospitalId);

    if (hospDeleteError) throw new Error("Failed to delete hospital data.");

    const { error: authError } =
      await supabase.auth.admin.deleteUser(profileId);

    if (authError) {
      await supabase.from("profiles").delete().eq("id", profileId);
    }

    revalidatePath("/superadmin/approvals");
    return {
      success: true,
      message: "Application rejected and all associated data purged.",
      data: null,
    };
  } catch (error) {
    return { success: false, message: "Purge failed." + error, data: null };
  }
}
