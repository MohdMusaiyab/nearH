"use server";
import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { validateSuperAdmin } from "@/lib/auth/guards";
import { Database } from "@/types/database.types";
type PriorityLevel = Database["public"]["Enums"]["priority_level"];
type ReferralStatus = Database["public"]["Enums"]["referral_status"];
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
  hospital_inventory: DBInventoryPartial | DBInventoryPartial[] | null;
  blood_bank: DBCountRow[] | null;
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
  month: string;
  count: number;
}
export interface BedOccupancyPoint {
  hospital: string;
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
function formatLocation(loc: DBLocation | null): string {
  if (!loc?.city && !loc?.state) return "Unknown";
  if (!loc.state) return loc.city!;
  if (!loc.city) return loc.state;
  return `${loc.city}, ${loc.state}`;
}
function processMonthlyGrowth(
  data: Array<{ created_at: string | null }>,
  monthCount = 6,
): MonthlyGrowthPoint[] {
  const buckets = new Map<string, number>();
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleString("en-IN", {
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
function extractInventory(
  inventory: DBInventoryPartial | DBInventoryPartial[] | null | undefined,
): DBInventoryPartial | null {
  if (!inventory) return null;
  if (Array.isArray(inventory)) {
    return inventory.length > 0 ? inventory[0] : null;
  }
  return inventory;
}

function calculateOccupancyPercent(
  inventory: DBInventoryPartial | DBInventoryPartial[] | null | undefined,
): number | null {
  const inv = extractInventory(inventory);
  if (!inv || typeof inv.total_beds !== "number" || inv.total_beds <= 0)
    return null;
  const available = inv.available_beds ?? 0;
  const occupied = Math.max(0, inv.total_beds - available);
  return Math.round((occupied / inv.total_beds) * 100);
}
export async function getSuperAdminDashboard(): Promise<
  ActionResponse<SuperAdminDashboardData>
> {
  const supabase = await createClient();
  try {
    const { isSuperAdmin, error: authError } = await validateSuperAdmin();
    if (!isSuperAdmin) {
      return { success: false, message: authError || "Unauthorized", data: null };
    }
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    const sixMonthsAgoISO = sixMonthsAgo.toISOString();
    const [
      totalHospitalsRes,
      activeHospitalsRes,
      verifiedHospitalsRes,
      pendingAdminCountRes,
      totalReferralsRes,
      pendingReferralsRes,
      recentHospitalsRes,
      pendingAdminsRes,
      recentReferralsRes,
      hospitalListRes,
      inventorySummaryRes,
      growthDataRes,
    ] = await Promise.all([
      // Database-level exact counts via PostgREST (no row data transferred across the network)
      supabase.from("hospitals").select("*", { count: "exact", head: true }),
      supabase
        .from("hospitals")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("hospitals")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .eq("role", "admin"),
      supabase.from("referrals").select("*", { count: "exact", head: true }),
      supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending"),
      supabase
        .from("hospitals")
        .select("id, name, created_at, location:locations(city, state)")
        .order("created_at", { ascending: false })
        .limit(5)
        .returns<DBRecentHospital[]>(),
      supabase
        .from("profiles")
        .select("id, full_name, created_at, hospitals(name)")
        .eq("status", "pending")
        .eq("role", "admin")
        .order("created_at", { ascending: false })
        .limit(10)
        .returns<DBPendingAdmin[]>(),
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
      supabase
        .from("hospital_inventory")
        .select("available_beds, icu_beds_available")
        .returns<DBInventorySummary[]>(),
      supabase
        .from("hospitals")
        .select("created_at")
        .gte("created_at", sixMonthsAgoISO)
        .returns<Array<{ created_at: string | null }>>(),
    ]);
    if (recentHospitalsRes.error) throw recentHospitalsRes.error;
    if (pendingAdminsRes.error) throw pendingAdminsRes.error;
    if (hospitalListRes.error) throw hospitalListRes.error;
    if (recentReferralsRes.error) throw recentReferralsRes.error;
    const pendingAdmins: PendingAdminItem[] = await Promise.all(
      (pendingAdminsRes.data ?? []).map(
        async (admin): Promise<PendingAdminItem> => {
          let email = "N/A";
          try {
            const { data: authUser } = await supabase.auth.admin.getUserById(
              admin.id,
            );
            email = authUser?.user?.email ?? "N/A";
          } catch {}
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
    const hospitalList = hospitalListRes.data ?? [];
    const totalAdmins = hospitalList.reduce(
      (sum, h) => sum + (h.profiles?.[0]?.count ?? 0),
      0,
    );

    // Calculate beds and ICU from hospital list (extracting 1:1 object or array)
    let listBeds = 0;
    let listIcu = 0;
    for (const h of hospitalList) {
      const inv = extractInventory(h.hospital_inventory);
      if (inv) {
        listBeds += inv.available_beds ?? 0;
        listIcu += inv.icu_beds_available ?? 0;
      }
    }

    const inventorySummary = inventorySummaryRes.data ?? [];
    const summaryBeds = inventorySummary.reduce(
      (sum, i) => sum + (i.available_beds ?? 0),
      0,
    );
    const summaryIcu = inventorySummary.reduce(
      (sum, i) => sum + (i.icu_beds_available ?? 0),
      0,
    );

    const totalBedsAvailable = Math.max(listBeds, summaryBeds);
    const totalIcuAvailable = Math.max(listIcu, summaryIcu);

    const dashboardData: SuperAdminDashboardData = {
      overview: {
        totalHospitals: totalHospitalsRes.count ?? 0,
        activeHospitals: activeHospitalsRes.count ?? 0,
        verifiedHospitals: verifiedHospitalsRes.count ?? 0,
        pendingAdminApprovals: pendingAdminCountRes.count ?? 0,
        totalAdmins,
        totalReferrals: totalReferralsRes.count ?? 0,
        pendingReferrals: pendingReferralsRes.count ?? 0,
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
      hospitals: hospitalList.map((h) => {
        const inv = extractInventory(h.hospital_inventory);
        return {
          id: h.id,
          name: h.name,
          location: formatLocation(h.location),
          isActive: h.is_active,
          isVerified: !!h.is_verified,
          adminCount: h.profiles?.[0]?.count ?? 0,
          lastUpdated: h.updated_at,
          metrics: {
            bedsAvailable: inv?.available_beds ?? 0,
            icuAvailable: inv?.icu_beds_available ?? 0,
            bloodGroupsOnFile: h.blood_bank?.[0]?.count ?? 0,
          },
        };
      }),
    };
    console.log("📊 Growth Points:", dashboardData.charts.hospitalGrowth);
    console.log("🏥 Occupancy Points:", dashboardData.charts.bedOccupancy);
    console.log(
      "📋 Raw Hospital Inventory Sample:",
      hospitalList[0]?.hospital_inventory,
    );
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
