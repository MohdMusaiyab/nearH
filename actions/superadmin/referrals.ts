"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { Database } from "@/types/database.types";

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

export async function getNetworkReferrals({
  page,
  pageSize,
  status,
  priority,
}: GetReferralsParams): Promise<
  ActionResponse<{ referrals: SuperadminReferral[]; totalCount: number }>
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id || "")
    .single();

  if (profile?.role !== "superadmin") {
    return {
      success: false,
      message: "Unauthorized: Superadmin access required",
      data: null,
    };
  }
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

  if (error) return { success: false, message: error.message, data: null };

  return {
    success: true,
    message: "Network referrals fetched",
    data: {
      referrals: data as unknown as SuperadminReferral[],
      totalCount: count || 0,
    },
  };
}

