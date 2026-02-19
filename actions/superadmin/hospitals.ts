"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";

interface UpdateHospitalStatusParams {
  hospitalId: string;
  is_active: boolean;
  is_verified?: boolean;
}

export async function updateHospitalStatus({
  hospitalId,
  is_active,
  is_verified,
}: UpdateHospitalStatusParams): Promise<ActionResponse<null>> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "superadmin") {
      return {
        success: false,
        message: "Superadmin access required",
        data: null,
      };
    }

    const updates: Partial<{ is_active: boolean; is_verified: boolean }> = {
      is_active,
    };

    if (is_verified !== undefined) {
      updates.is_verified = is_verified;
    }

    const { error } = await supabase
      .from("hospitals")
      .update(updates)
      .eq("id", hospitalId);

    if (error) {
      console.error("Error updating hospital:", error);
      return {
        success: false,
        message: "Failed to update hospital status",
        data: null,
      };
    }

    revalidatePath(`/superadmin/hospitals/${hospitalId}`);

    return {
      success: true,
      message: "Hospital status updated",
      data: null,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      data: null,
    };
  }
}

// Fix: Remove the users!inner join and handle nulls properly
export async function getHospitalAdmins(hospitalId: string): Promise<
  ActionResponse<
    {
      id: string;
      full_name: string | null;
      email: string | null; // Make email nullable
      status: string | null; // Make status nullable
      created_at: string | null; // Make created_at nullable
    }[]
  >
> {
  const supabase = await createClient();

  try {
    // First get all profiles for this hospital
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        status,
        created_at
      `,
      )
      .eq("associated_hospital_id", hospitalId);

    if (error) {
      console.error("Error fetching admins:", error);
      return {
        success: false,
        message: "Failed to fetch admins",
        data: null,
      };
    }

    // For each profile, fetch the email from auth.users (need to do this separately)
    const admins = await Promise.all(
      (profiles ?? []).map(async (profile) => {
        // Get user email from auth.users (this is a separate call)
        const { data: userData } = await supabase.auth.admin.getUserById(
          profile.id,
        );

        return {
          id: profile.id,
          full_name: profile.full_name,
          email: userData?.user?.email ?? null, // Can be null
          status: profile.status, // Already can be null from DB
          created_at: profile.created_at, // Already can be null from DB
        };
      }),
    );

    return {
      success: true,
      message: "Admins retrieved",
      data: admins,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      data: null,
    };
  }
}
