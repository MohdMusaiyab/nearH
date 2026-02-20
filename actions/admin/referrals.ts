"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { Database } from "@/types/database.types";
import { Hospital } from "@/types";
import { getAuthenticatedProfile } from "@/utils/authCache";

type ReferralRow = Database["public"]["Tables"]["referrals"]["Row"];
type ReferralInsert = Database["public"]["Tables"]["referrals"]["Insert"];

export interface ReferralWithDetails extends ReferralRow {
  from_hospital: { name: string; official_phone: string } | null;
  to_hospital: { name: string; official_phone: string } | null;
  specialty: { specialty_name: string } | null;
  direction: "inbound" | "outbound";
}

async function getValidatedAdminContext(): Promise<{
  hospitalId: string | null;
  userId: string | null;
  error?: string;
}> {
  const profile = await getAuthenticatedProfile();
  if (!profile)
    return {
      hospitalId: null,
      userId: null,
      error: "Unauthorized - Please log in",
    };
  if (profile.role !== "admin" || profile.status !== "approved") {
    return {
      hospitalId: null,
      userId: null,
      error: "Unauthorized - Approved Admin access only",
    };
  }
  return { hospitalId: profile.associated_hospital_id, userId: profile.id };
}

export async function sendReferral(
  payload: Omit<ReferralInsert, "from_hospital_id" | "referred_by_admin_id">,
): Promise<ActionResponse<ReferralRow>> {
  const {
    hospitalId,
    userId,
    error: authError,
  } = await getValidatedAdminContext();
  if (!hospitalId || !userId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("referrals")
    .insert([
      {
        ...payload,
        from_hospital_id: hospitalId,
        referred_by_admin_id: userId,
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
  const { hospitalId, error: authError } = await getValidatedAdminContext();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

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
    .or(`from_hospital_id.eq.${hospitalId},to_hospital_id.eq.${hospitalId}`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message, data: null };

  const formattedData: ReferralWithDetails[] = (data || []).map((ref) => ({
    ...ref,
    direction: ref.from_hospital_id === hospitalId ? "outbound" : "inbound",
  })) as ReferralWithDetails[];

  return { success: true, message: "Referrals fetched", data: formattedData };
}

export async function updateReferralStatus(
  referralId: string,
  status: Database["public"]["Enums"]["referral_status"],
  rejectionReason?: string,
): Promise<ActionResponse<ReferralRow>> {
  const { hospitalId, error: authError } = await getValidatedAdminContext();
  if (!hospitalId)
    return { success: false, message: authError || "Unauthorized", data: null };

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("referrals")
    .update({
      status,
      rejection_reason: rejectionReason || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", referralId)
    .eq("to_hospital_id", hospitalId)
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
    data: (data || []) as unknown as SearchResult[],
  };
}

export type SharedReferralDetail =
  Database["public"]["Tables"]["referrals"]["Row"] & {
    from_hospital: {
      id: string;
      name: string;
      location: { city: string; state: string } | null;
    } | null;
    to_hospital: {
      id: string;
      name: string;
      location: { city: string; state: string } | null;
    } | null;
    specialty: { specialty_name: string } | null;
  };

export async function getReferralById(
  id: string,
): Promise<ActionResponse<SharedReferralDetail>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("referrals")
    .select(
      `
      *,
      from_hospital:hospitals!referrals_from_hospital_id_fkey(
        id,
        name,
        location:locations(city, state)
      ),
      to_hospital:hospitals!referrals_to_hospital_id_fkey(
        id,
        name,
        location:locations(city, state)
      ),
      specialty:specialties_list(specialty_name)
    `,
    )
    .eq("id", id)
    .single();

  if (error)
    return { success: false, message: "Referral not found", data: null };

  return {
    success: true,
    message: "Referral details retrieved",
    data: data as unknown as SharedReferralDetail,
  };
}
