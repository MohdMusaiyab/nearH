import { Database } from "@/types/database.types";

export interface SuperAdminDashboardData {
  overview: {
    totalHospitals: number;
    pendingApprovals: number;
    activeHospitals: number;
    totalAdmins: number;
    totalReferrals: number;
    pendingReferrals: number;
    totalBedsAvailable: number;
    totalIcuAvailable: number;
  };
  recentActivity: {
    newHospitals: Array<{
      id: string;
      name: string;
      joinedAt: string | null;
      location: string;
    }>;
    pendingAdmins: Array<{
      id: string;
      name: string | null;
      email: string;
      hospitalName: string | null;
      requestedAt: string | null;
    }>;
    recentReferrals: Array<{
      id: string;
      patientName: string;
      fromHospital: string | null;
      toHospital: string | null;
      priority: Database["public"]["Enums"]["priority_level"] | null;
      status: Database["public"]["Enums"]["referral_status"] | null;
      createdAt: string | null;
    }>;
  };
  charts: {
    hospitalGrowth: Array<{ month: string; count: number }>;
    bedOccupancy: Array<{ hospital: string; occupancy: number }>;
  };
  hospitals: Array<{
    id: string;
    name: string;
    location: string;
    status: "active" | "inactive";
    isVerified: boolean;
    adminCount: number;
    lastUpdated: string | null;
    metrics: {
      bedsAvailable: number;
      icuAvailable: number;
      bloodGroups: number;
    };
  }>;
}