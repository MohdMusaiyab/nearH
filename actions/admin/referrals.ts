"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Hospital } from "@/types";

type ReferralRow = Database["public"]["Tables"]["referrals"]["Row"];
type ReferralInsert = Database["public"]["Tables"]["referrals"]["Insert"];

export interface ReferralWithDetails extends ReferralRow {
  from_hospital: { name: string; official_phone: string } | null;
  to_hospital: { name: string; official_phone: string } | null;
  specialty: { specialty_name: string } | null;
  direction: "inbound" | "outbound";
}

async function getAdminContext(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("associated_hospital_id, id")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function sendReferral(
  payload: Omit<ReferralInsert, "from_hospital_id" | "referred_by_admin_id">,
): Promise<ActionResponse<ReferralRow>> {
  const supabase = await createClient();
  const context = await getAdminContext(supabase);

  if (!context?.associated_hospital_id) {
    return { success: false, message: "Unauthorized", data: null };
  }

  const { data, error } = await supabase
    .from("referrals")
    .insert([
      {
        ...payload,
        from_hospital_id: context.associated_hospital_id,
        referred_by_admin_id: context.id,
      },
    ])
    .select()
    .single();

  if (error) return { success: false, message: error.message, data: null };

  revalidatePath("/admin/referrals");
  return { success: true, message: "Referral sent successfully", data };
}

export async function getAllHospitalReferrals(): Promise<
  ActionResponse<ReferralWithDetails[]>
> {
  const supabase = await createClient();
  const context = await getAdminContext(supabase);
  const hId = context?.associated_hospital_id;

  if (!hId) return { success: false, message: "Unauthorized", data: null };
  const { data, error } = await supabase
    .from("referrals")
    .select(
      `
      *,
      from_hospital:hospitals!referrals_from_hospital_id_fkey(name, official_phone),
      to_hospital:hospitals!referrals_to_hospital_id_fkey(name, official_phone),
      specialty:specialties_list(specialty_name)
    `,
    )
    .or(`from_hospital_id.eq.${hId},to_hospital_id.eq.${hId}`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message, data: null };

  const formattedData: ReferralWithDetails[] = (
    data as unknown as (ReferralRow & {
      from_hospital: { name: string; official_phone: string } | null;
      to_hospital: { name: string; official_phone: string } | null;
      specialty: { specialty_name: string } | null;
    })[]
  ).map((ref) => ({
    ...ref,
    direction: ref.from_hospital_id === hId ? "outbound" : "inbound",
  }));

  return { success: true, message: "Referrals fetched", data: formattedData };
}

export async function updateReferralStatus(
  referralId: string,
  status: Database["public"]["Enums"]["referral_status"],
  rejectionReason?: string,
): Promise<ActionResponse<ReferralRow>> {
  const supabase = await createClient();
  const context = await getAdminContext(supabase);
  const hId = context?.associated_hospital_id;

  if (!hId) return { success: false, message: "Unauthorized", data: null };

  const { data, error } = await supabase
    .from("referrals")
    .update({
      status,
      rejection_reason: rejectionReason || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", referralId)
    .eq("to_hospital_id", hId)
    .select()
    .single();

  if (error)
    return {
      success: false,
      message: "Update failed or unauthorized",
      data: null,
    };

  revalidatePath("/admin/referrals");
  return { success: true, message: `Referral ${status}`, data };
}

export interface SearchResult extends Hospital {
  inventory: {
    available_beds: number;
    icu_beds_available: number;
  } | null;
}
export async function searchHospitals(params: {
  cityId?: string;
  specialtyId?: string;
}): Promise<ActionResponse<SearchResult[]>> {
  const supabase = await createClient();

  let query = supabase
    .from("hospitals")
    .select(
      `
      *,
      inventory:hospital_inventory(available_beds, icu_beds_available)
    `,
    )
    .eq("is_active", true)
    .eq("is_verified", true);

  if (params.cityId) query = query.eq("location_id", params.cityId);

  const { data, error } = await query;

  if (error) return { success: false, message: error.message, data: null };

  return {
    success: true,
    message: "Hospitals found",
    data: data as unknown as SearchResult[],
  };
}
