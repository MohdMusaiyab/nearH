"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import {
  getAuthenticatedProfile,
  invalidateUserCache,
} from "@/utils/authCache";
interface UpdateHospitalStatusParams {
  hospitalId: string;
  is_active: boolean;
  is_verified?: boolean;
}
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
export async function updateHospitalStatus({
  hospitalId,
  is_active,
  is_verified,
}: UpdateHospitalStatusParams): Promise<ActionResponse<null>> {
  const { isSuperAdmin, error: authError } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: authError || "Unauthorized", data: null };
  const supabase = await createClient();
  try {
    const updates: Partial<{
      is_active: boolean;
      is_verified: boolean;
      updated_at: string;
    }> = {
      is_active,
      updated_at: new Date().toISOString(),
    };
    if (is_verified !== undefined) {
      updates.is_verified = is_verified;
    }
    const { error } = await supabase
      .from("hospitals")
      .update(updates)
      .eq("id", hospitalId);
    if (error) throw new Error(error.message);
    const { data: linkedAdmins } = await supabase
      .from("profiles")
      .select("id")
      .eq("associated_hospital_id", hospitalId);
    if (linkedAdmins && linkedAdmins.length > 0) {
      await Promise.all(
        linkedAdmins.map((admin) => invalidateUserCache(admin.id)),
      );
    }
    revalidatePath(`/superadmin/hospitals/${hospitalId}`);
    revalidatePath("/explore");
    return {
      success: true,
      message: "Hospital status updated and associated admin caches cleared.",
      data: null,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return { success: false, message: msg, data: null };
  }
}
interface AdminProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  status: string | null;
  created_at: string | null;
}
export async function getHospitalAdmins(
  hospitalId: string,
): Promise<ActionResponse<AdminProfile[]>> {
  const { isSuperAdmin } = await validateSuperAdmin();
  if (!isSuperAdmin)
    return { success: false, message: "Unauthorized", data: null };
  const supabase = await createClient();
  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(`id, full_name, status, created_at`)
      .eq("associated_hospital_id", hospitalId);
    if (error) throw new Error(error.message);
    const admins: AdminProfile[] = await Promise.all(
      (profiles ?? []).map(async (profile) => {
        try {
          const { data: userData } = await supabase.auth.admin.getUserById(
            profile.id,
          );
          return {
            id: profile.id,
            full_name: profile.full_name,
            email: userData?.user?.email ?? "N/A",
            status: profile.status,
            created_at: profile.created_at,
          };
        } catch {
          return {
            id: profile.id,
            full_name: profile.full_name,
            email: "Error fetching email",
            status: profile.status,
            created_at: profile.created_at,
          };
        }
      }),
    );
    return {
      success: true,
      message: "Admins retrieved",
      data: admins,
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, message: msg, data: null };
  }
}
