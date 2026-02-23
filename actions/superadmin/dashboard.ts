"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { getAuthenticatedProfile } from "@/utils/authCache";
import { Database } from "@/types/database.types";

// ─────────────────────────────────────────────────────────────────────────────
// Enum Aliases
// ─────────────────────────────────────────────────────────────────────────────

type PriorityLevel = Database["public"]["Enums"]["priority_level"];
type ReferralStatus = Database["public"]["Enums"]["referral_status"];

// ─────────────────────────────────────────────────────────────────────────────
// Raw DB Result Types (Supabase join shapes)
// ─────────────────────────────────────────────────────────────────────────────

interface DBLocation {
  city: string | null;
  state: string | null;
}

interface DBInventoryPartial {
  available_beds: number | null;
  icu_beds_available: number | null;
  total_beds: number | null;
}

interface DBCountRow {
  count: number;
}

interface DBRecentHospital {
  id: string;
  name: string;
  created_at: string | null;
  location: DBLocation | null;
}

interface DBPendingAdmin {
  id: string;
  full_name: string | null;
  created_at: string | null;
  /** Supabase returns the joined hospital via the FK column name */
  hospitals: { name: string } | null;
}

interface DBRecentReferral {
  id: string;
  patient_name: string;
  priority: PriorityLevel | null;
  status: ReferralStatus | null;
  created_at: string | null;
  from_hospital: { name: string } | null;
  to_hospital: { name: string } | null;
}

interface DBHospitalRow {
  id: string;
  name: string;
  is_active: boolean;
  is_verified: boolean | null;
  updated_at: string | null;
  location: DBLocation | null;
  hospital_inventory: DBInventoryPartial[] | null;
  /** Aggregate count of blood groups on file */
  blood_bank: DBCountRow[] | null;
  /** Aggregate count of admins linked to this hospital */
  profiles: DBCountRow[] | null;
}

interface DBReferralStatus {
  status: ReferralStatus | null;
}

interface DBInventorySummary {
  available_beds: number | null;
  icu_beds_available: number | null;
}

interface DBHospitalFlags {
  is_active: boolean;
  is_verified: boolean | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain / Output Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardOverview {
  totalHospitals: number;
  activeHospitals: number;
  verifiedHospitals: number;
  pendingAdminApprovals: number;
  totalAdmins: number;
  totalReferrals: number;
  pendingReferrals: number;
  totalBedsAvailable: number;
  totalIcuAvailable: number;
}

export interface RecentHospitalItem {
  id: string;
  name: string;
  joinedAt: string | null;
  location: string;
}

export interface PendingAdminItem {
  id: string;
  name: string | null;
  email: string;
  hospitalName: string | null;
  requestedAt: string | null;
}

export interface RecentReferralItem {
  id: string;
  patientName: string;
  fromHospital: string | null;
  toHospital: string | null;
  priority: PriorityLevel | null;
  status: ReferralStatus | null;
  createdAt: string | null;
}

export interface MonthlyGrowthPoint {
  /** e.g. "Jan 25" */
  month: string;
  count: number;
}

export interface BedOccupancyPoint {
  hospital: string;
  /** 0–100 integer percentage */
  occupancyPercent: number;
}

export interface HospitalListItem {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  isVerified: boolean;
  adminCount: number;
  lastUpdated: string | null;
  metrics: {
    bedsAvailable: number;
    icuAvailable: number;
    bloodGroupsOnFile: number;
  };
}

export interface SuperAdminDashboardData {
  overview: DashboardOverview;
  recentActivity: {
    newHospitals: RecentHospitalItem[];
    pendingAdmins: PendingAdminItem[];
    recentReferrals: RecentReferralItem[];
  };
  charts: {
    hospitalGrowth: MonthlyGrowthPoint[];
    bedOccupancy: BedOccupancyPoint[];
  };
  hospitals: HospitalListItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatLocation(loc: DBLocation | null): string {
  if (!loc?.city && !loc?.state) return "Unknown";
  if (!loc.state) return loc.city!;
  if (!loc.city) return loc.state;
  return `${loc.city}, ${loc.state}`;
}

/**
 * Returns monthly hospital registration counts for the past N months,
 * sorted chronologically, as "Mon YY" labels.
 */
function processMonthlyGrowth(
  data: Array<{ created_at: string | null }>,
  monthCount = 6,
): MonthlyGrowthPoint[] {
  const buckets = new Map<string, number>();

  // Pre-fill all months so gaps show as 0
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleString("en-IN", {
      // Force a specific locale
      month: "short",
      year: "2-digit",
    });
    buckets.set(key, 0);
  }

  for (const item of data) {
    if (!item.created_at) continue;
    const key = new Date(item.created_at).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key)! + 1);
    }
  }

  return Array.from(buckets.entries()).map(([month, count]) => ({
    month,
    count,
  }));
}

/**
 * Bed occupancy as an integer 0–100. Returns null if data is missing.
 */
function calculateOccupancyPercent(inventory: DBInventoryPartial[] | DBInventoryPartial | null): number | null {
  // Handle if it's an array (Supabase join) or a direct object
  const inv = Array.isArray(inventory) ? inventory[0] : inventory;
  
  if (!inv || typeof inv.total_beds !== 'number' || inv.total_beds === 0) return null;
  
  const available = inv.available_beds ?? 0;
  const occupied = inv.total_beds - available;
  return Math.round((occupied / inv.total_beds) * 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Action
// ─────────────────────────────────────────────────────────────────────────────

export async function getSuperAdminDashboard(): Promise<
  ActionResponse<SuperAdminDashboardData>
> {
  const supabase = await createClient();

  try {
    // ── Auth guard ────────────────────────────────────────────────────────────
    const profile = await getAuthenticatedProfile();
    if (!profile || profile.role !== "superadmin") {
      return { success: false, message: "Unauthorized", data: null };
    }

    // ── Date range for growth chart ───────────────────────────────────────────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    const sixMonthsAgoISO = sixMonthsAgo.toISOString();

    // ── Fan-out queries (all run in parallel) ─────────────────────────────────
    const [
      hospitalFlagsRes,
      pendingAdminCountRes,
      recentHospitalsRes,
      pendingAdminsRes,
      referralStatusesRes,
      recentReferralsRes,
      hospitalListRes,
      inventorySummaryRes,
      growthDataRes,
    ] = await Promise.all([
      // 1. Hospital flags for overview counts
      supabase
        .from("hospitals")
        .select("is_active, is_verified")
        .returns<DBHospitalFlags[]>(),

      // 2. Pending admin count (head-only, no rows transferred)
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .eq("role", "admin"),

      // 3. Five most recently registered hospitals
      supabase
        .from("hospitals")
        .select("id, name, created_at, location:locations(city, state)")
        .order("created_at", { ascending: false })
        .limit(5)
        .returns<DBRecentHospital[]>(),

      // 4. Pending admin profiles (for the approval queue widget)
      supabase
        .from("profiles")
        .select("id, full_name, created_at, hospitals(name)")
        .eq("status", "pending")
        .eq("role", "admin")
        .order("created_at", { ascending: false })
        .limit(10)
        .returns<DBPendingAdmin[]>(),

      // 5. All referral statuses — used only for counts, so fetch minimal cols
      supabase.from("referrals").select("status").returns<DBReferralStatus[]>(),

      // 6. Recent referrals for the activity feed
      supabase
        .from("referrals")
        .select(
          [
            "id",
            "patient_name",
            "priority",
            "status",
            "created_at",
            "from_hospital:hospitals!referrals_from_hospital_id_fkey(name)",
            "to_hospital:hospitals!referrals_to_hospital_id_fkey(name)",
          ].join(", "),
        )
        .order("created_at", { ascending: false })
        .limit(10)
        .returns<DBRecentReferral[]>(),

      // 7. Full hospital list with nested aggregates for the table view
      supabase
        .from("hospitals")
        .select(
          [
            "id",
            "name",
            "is_active",
            "is_verified",
            "updated_at",
            "location:locations(city, state)",
            "hospital_inventory(available_beds, icu_beds_available, total_beds)",
            "blood_bank(count)",
            "profiles!profiles_associated_hospital_id_fkey(count)",
          ].join(", "),
        )
        .order("name")
        .returns<DBHospitalRow[]>(),

      // 8. Inventory summary for global bed/ICU counts
      supabase
        .from("hospital_inventory")
        .select("available_beds, icu_beds_available")
        .returns<DBInventorySummary[]>(),

      // 9. Hospital creation dates for the growth chart
      supabase
        .from("hospitals")
        .select("created_at")
        .gte("created_at", sixMonthsAgoISO)
        .returns<Array<{ created_at: string | null }>>(),
    ]);

    // ── Error surfacing ───────────────────────────────────────────────────────
    // Throw on queries whose data is load-bearing; log-and-degrade on the rest.
    if (hospitalFlagsRes.error) throw hospitalFlagsRes.error;
    if (recentHospitalsRes.error) throw recentHospitalsRes.error;
    if (pendingAdminsRes.error) throw pendingAdminsRes.error;
    if (hospitalListRes.error) throw hospitalListRes.error;
    if (referralStatusesRes.error) throw referralStatusesRes.error;

    // ── Resolve emails for pending admins ─────────────────────────────────────
    // N+1 is unavoidable here — Supabase Auth emails aren't in public schema.
    // We cap the list at 10 rows above to limit the blast radius.
    const pendingAdmins: PendingAdminItem[] = await Promise.all(
      (pendingAdminsRes.data ?? []).map(
        async (admin): Promise<PendingAdminItem> => {
          let email = "N/A";
          try {
            const { data: authUser } = await supabase.auth.admin.getUserById(
              admin.id,
            );
            email = authUser?.user?.email ?? "N/A";
          } catch {
            // Non-fatal: email stays "N/A"
          }
          return {
            id: admin.id,
            name: admin.full_name,
            email,
            hospitalName: admin.hospitals?.name ?? null,
            requestedAt: admin.created_at,
          };
        },
      ),
    );

    // ── Derived counts ────────────────────────────────────────────────────────
    const hospitalFlags = hospitalFlagsRes.data ?? [];
    const referralStatuses = referralStatusesRes.data ?? [];
    const inventorySummary = inventorySummaryRes.data ?? [];
    const hospitalList = hospitalListRes.data ?? [];

    const totalAdmins = hospitalList.reduce(
      (sum, h) => sum + (h.profiles?.[0]?.count ?? 0),
      0,
    );

    const totalBedsAvailable = inventorySummary.reduce(
      (sum, i) => sum + (i.available_beds ?? 0),
      0,
    );

    const totalIcuAvailable = inventorySummary.reduce(
      (sum, i) => sum + (i.icu_beds_available ?? 0),
      0,
    );

    // ── Assemble dashboard payload ────────────────────────────────────────────
    const dashboardData: SuperAdminDashboardData = {
      overview: {
        totalHospitals: hospitalFlags.length,
        activeHospitals: hospitalFlags.filter((h) => h.is_active).length,
        verifiedHospitals: hospitalFlags.filter((h) => h.is_verified).length,
        pendingAdminApprovals: pendingAdminCountRes.count ?? 0,
        totalAdmins,
        totalReferrals: referralStatuses.length,
        pendingReferrals: referralStatuses.filter((r) => r.status === "Pending")
          .length,
        totalBedsAvailable,
        totalIcuAvailable,
      },

      recentActivity: {
        newHospitals: (recentHospitalsRes.data ?? []).map((h) => ({
          id: h.id,
          name: h.name,
          joinedAt: h.created_at,
          location: formatLocation(h.location),
        })),

        pendingAdmins,

        recentReferrals: (recentReferralsRes.data ?? []).map((r) => ({
          id: r.id,
          patientName: r.patient_name,
          fromHospital: r.from_hospital?.name ?? null,
          toHospital: r.to_hospital?.name ?? null,
          priority: r.priority,
          status: r.status,
          createdAt: r.created_at,
        })),
      },

      charts: {
        hospitalGrowth: processMonthlyGrowth(growthDataRes.data ?? []),

        bedOccupancy: hospitalList
          .map((h) => ({
            hospital: h.name,
            occupancyPercent:
              calculateOccupancyPercent(h.hospital_inventory) ?? 0,
          }))
          .filter((h) => h.occupancyPercent > 0)
          .sort((a, b) => b.occupancyPercent - a.occupancyPercent)
          .slice(0, 10),
      },

      hospitals: hospitalList.map((h) => ({
        id: h.id,
        name: h.name,
        location: formatLocation(h.location),
        isActive: h.is_active,
        isVerified: !!h.is_verified,
        adminCount: h.profiles?.[0]?.count ?? 0,
        lastUpdated: h.updated_at,
        metrics: {
          bedsAvailable: h.hospital_inventory?.[0]?.available_beds ?? 0,
          icuAvailable: h.hospital_inventory?.[0]?.icu_beds_available ?? 0,
          bloodGroupsOnFile: h.blood_bank?.[0]?.count ?? 0,
        },
      })),
    };
console.log("📊 Growth Points:", dashboardData.charts.hospitalGrowth);
console.log("🏥 Occupancy Points:", dashboardData.charts.bedOccupancy);
console.log("📋 Raw Hospital Inventory Sample:", hospitalList[0]?.hospital_inventory);
    return {
      success: true,
      message: "Dashboard data retrieved",
      data: dashboardData,
    };
  } catch (error) {
    console.error("[getSuperAdminDashboard]", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected dashboard error",
      data: null,
    };
  }
}
