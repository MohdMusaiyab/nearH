"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { Database } from "@/types/database.types";
import { getAuthenticatedProfile } from "@/utils/authCache";
export type SuperadminReferral =
  Database["public"]["Tables"]["referrals"]["Row"] & {
    from_hospital: {
      name: string;
      location: { city: string; state: string } | null;
    } | null;
    to_hospital: {
      name: string;
      location: { city: string; state: string } | null;
    } | null;
    specialty: { specialty_name: string } | null;
  };
interface GetReferralsParams {
  page: number;
  pageSize: number;
  status?: Database["public"]["Enums"]["referral_status"];
  priority?: Database["public"]["Enums"]["priority_level"];
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
export async function getNetworkReferrals({
  page,
  pageSize,
  status,
  priority,
}: GetReferralsParams): Promise<
  ActionResponse<{ referrals: SuperadminReferral[]; totalCount: number }>
> {
  const { isSuperAdmin, error: authError } = await validateSuperAdmin();
  if (!isSuperAdmin) {
    return { success: false, message: authError || "Unauthorized", data: null };
  }
  const supabase = await createClient();
  try {
    let query = supabase.from("referrals").select(
      `
        *,
        from_hospital:hospitals!referrals_from_hospital_id_fkey(
          name,
          location:locations(city, state)
        ),
        to_hospital:hospitals!referrals_to_hospital_id_fkey(
          name,
          location:locations(city, state)
        ),
        specialty:specialties_list(specialty_name)
      `,
      { count: "exact" },
    );
    if (status) query = query.eq("status", status);
    if (priority) query = query.eq("priority", priority);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) throw new Error(error.message);
    return {
      success: true,
      message: "Network-wide referrals retrieved successfully.",
      data: {
        referrals: (data || []) as SuperadminReferral[],
        totalCount: count || 0,
      },
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to fetch network referrals";
    console.error(`[NetworkReferrals Error]: ${msg}`);
    return {
      success: false,
      message: msg,
      data: null,
    };
  }
}
