// app/superadmin/hospitals/[id]/SuperAdminHospitalClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HospitalProfile } from "@/components/hospital/profile/types";
import { HeroSection } from "../shared/HeroSection";
import { ContactInfo } from "../shared/ContactInfo";
import { OverviewTab } from "../shared/OverviewTab";
import { DoctorsTab } from "../shared/DoctorsTab";
import { ServicesTab } from "./ServicesTab";
import { BloodBankTab } from "../shared/BloodBankTab";
import {
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Users,
  Activity,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { updateHospitalStatus } from "@/actions/superadmin/hospitals";
import {
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";

interface Admin {
  id: string;
  full_name: string | null;
  email: string | null;  // Make nullable
  status: string | null;  // Make nullable
  created_at: string | null;  // Make nullable
}

interface Props {
  hospital: HospitalProfile;
  admins: Admin[];
}

// Type guard to check if hospital has private fields
const hasPrivateFields = (
  hospital: HospitalProfile,
): hospital is PrivateHospitalProfile | SuperAdminHospitalProfile => {
  return "is_active" in hospital;
};

export default function SuperAdminHospitalClient({ hospital, admins }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "doctors" | "services" | "blood-bank" | "admins"
  >("overview");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Since this is a superadmin page, we can assert that hospital has private fields
  // But let's handle it safely with a type guard
  if (!hasPrivateFields(hospital)) {
    // This should never happen on superadmin page, but handle it gracefully
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900">Access Error</h2>
          <p className="text-slate-500 mt-2">
            Unable to load private hospital data
          </p>
        </div>
      </div>
    );
  }

  // Now TypeScript knows hospital has is_active and is_verified
  const hospitalWithPrivate = hospital;

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const result = await updateHospitalStatus({
        hospitalId: hospital.id,
        is_active: !hospital.is_active,
      });

      if (result.success) {
        router.refresh();
      }
    } finally {
      setIsUpdating(false);
      setShowConfirm(false);
    }
  };

  const handleVerifyToggle = async () => {
    setIsUpdating(true);
    try {
      const result = await updateHospitalStatus({
        hospitalId: hospital.id,
        is_active: hospital.is_active,
        is_verified: !hospital.is_verified,
      });

      if (result.success) {
        router.refresh();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Superadmin Bar */}
      <div className="bg-indigo-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/superadmin/hospitals")}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-500 rounded-xl hover:bg-indigo-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-bold text-sm">Back to Hospitals</span>
              </button>
              <Shield className="w-5 h-5 ml-2" />
              <span className="font-bold text-sm">
                SUPERADMIN CONTROL PANEL
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badges */}
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500 rounded-xl">
                <span className="text-sm font-bold">Status:</span>
                {hospital.is_active ? (
                  <span className="flex items-center gap-1 text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-300">
                    <XCircle className="w-4 h-4" />
                    Inactive
                  </span>
                )}
              </div>

              {hospital.is_verified && (
                <div className="px-4 py-2 bg-amber-500 rounded-xl">
                  <span className="flex items-center gap-1 text-sm font-bold">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              Management Controls
            </h2>
            <div className="flex gap-3">
              {/* Toggle Active Status */}
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isUpdating}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                  hospital.is_active
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {isUpdating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {hospital.is_active ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {hospital.is_active
                      ? "Deactivate Hospital"
                      : "Activate Hospital"}
                  </>
                )}
              </button>

              {/* Toggle Verification */}
              <button
                onClick={handleVerifyToggle}
                disabled={isUpdating}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                  hospital.is_verified
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                {isUpdating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {hospital.is_verified
                      ? "Remove Verification"
                      : "Mark as Verified"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">
              {hospital.is_active
                ? "Deactivate Hospital?"
                : "Activate Hospital?"}
            </h3>
            <p className="text-slate-500 text-center mb-6">
              {hospital.is_active
                ? "This will hide the hospital from public listings and prevent new referrals."
                : "This will make the hospital visible to the public and allow new referrals."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusToggle}
                disabled={isUpdating}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection hospital={hospital} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Contact Info */}
        <ContactInfo hospital={hospitalWithPrivate} />

        {/* Quick Stats for Superadmin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Hospital Admins
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {admins.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-xl">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">
                  Total Doctors
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {hospital.doctors.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Blood Groups</p>
                <p className="text-2xl font-black text-slate-900">
                  {hospital.blood_bank.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "doctors", label: "Doctors" },
            { id: "services", label: "Services" },
            { id: "blood-bank", label: "Blood Bank" },

            { id: "admins", label: "Admins" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          {activeTab === "overview" && <OverviewTab hospital={hospital} />}

          {activeTab === "doctors" && (
            <DoctorsTab
              doctors={hospital.doctors}
              canViewPrivate={true}
              canEdit={false}
            />
          )}

          {activeTab === "services" && (
            <ServicesTab specialties={hospital.specialties} />
          )}

          {activeTab === "blood-bank" && (
            <BloodBankTab bloodBank={hospital.blood_bank} canEdit={false} />
          )}

          {activeTab === "admins" && (
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-6">
                Hospital Administrators
              </h3>
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-slate-900">
                          {admin.full_name || "Unnamed Admin"}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {admin.email}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          admin.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : admin.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {admin.status ? admin.status.toUpperCase() : "UNKNOWN"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Since {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
