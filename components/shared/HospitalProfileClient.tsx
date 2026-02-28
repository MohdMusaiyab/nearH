"use client";

import { useState } from "react";
import {
  HospitalProfile,
  hasPrivateData,
} from "@/components/hospital/profile/types";
import { TabId } from "./TabNavigation";
import { AdminBar } from "./AdminBar";
import { HeroSection } from "./HeroSection";
import { ContactInfo } from "./ContactInfo";
import { TabNavigation } from "./TabNavigation";
import { OverviewTab } from "./OverviewTab";
import { DoctorsTab } from "./DoctorsTab";
import { ServicesTab as Services } from "./ServicesTab";
import { BloodBankTab } from "./BloodBankTab";
import { ReferralsTab } from "./ReferralsTab";
import { AdminManagement } from "./AdminManagement";
import { Info, ShieldCheck, Sparkles } from "lucide-react";

interface Props {
  hospital: HospitalProfile;
  userId: string;
  isOwner: boolean;
  isSuperadmin: boolean;
}

export default function HospitalProfileClient({
  hospital,
  isOwner,
  isSuperadmin,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const canViewPrivate = isOwner || isSuperadmin;
  const canEdit = isOwner;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8 pb-20 animate-in fade-in duration-700">
      {/* ── Admin Command Strip (Light & Airy Glass Version) ── */}
      {canViewPrivate && (
        <div className="relative group overflow-hidden bg-white/60 backdrop-blur-xl border border-accent/20 p-2 rounded-[1.5rem] flex items-center justify-between shadow-2xl shadow-slate-200/40 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-xl bg-badge-bg flex items-center justify-center text-accent shadow-sm">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted uppercase tracking-[0.25em] leading-none mb-1">
                Security clearance level
              </p>
              <h2 className="text-[11px] font-black text-heading uppercase tracking-tight">
                {isSuperadmin
                  ? "Superadmin Intelligence"
                  : "Facility Management"}
              </h2>
            </div>
          </div>

          <AdminBar
            hospitalId={hospital.id}
            isOwner={isOwner}
            isSuperadmin={isSuperadmin}
          />
        </div>
      )}

      {/* ── Hero Header ── */}
      <HeroSection hospital={hospital} />

      {/* ── Main Dossier Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Primary Data Columns (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-3xl border border-border shadow-sm sticky top-28 z-30 transition-all">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              showReferralsTab={canViewPrivate}
            />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-border shadow-sm min-h-[600px] transition-all duration-500 hover:shadow-xl hover:shadow-slate-100/50">
            {activeTab === "overview" && <OverviewTab hospital={hospital} />}

            {activeTab === "doctors" && (
              <DoctorsTab
                doctors={hospital.doctors}
                canViewPrivate={canViewPrivate}
                canEdit={canEdit}
              />
            )}

            {activeTab === "services" && (
              <Services
                services={hospital.services}
                specialties={hospital.specialties}
              />
            )}

            {activeTab === "blood-bank" && (
              <BloodBankTab bloodBank={hospital.blood_bank} canEdit={canEdit} />
            )}

            {activeTab === "referrals" &&
              canViewPrivate &&
              hasPrivateData(hospital) && (
                <div className="space-y-12 animate-in fade-in duration-500">
                  <ReferralsTab hospital={hospital} />
                  {isSuperadmin && (
                    <div className="pt-10 border-t border-slate-100">
                      <AdminManagement hospital={hospital} />
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>

        {/* Right: Logistics & Action Sidebar (1/3) ── */}
        <div className="space-y-6">
          {/* Authorization Check Badge */}
          {canViewPrivate && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                <Sparkles size={16} />
              </div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-tight">
                Privileged data unlocked <br />
                <span className="opacity-60">Full dossier access granted</span>
              </p>
            </div>
          )}

          {/* Secure Vertical Contact Stack */}
          {canViewPrivate && hasPrivateData(hospital) && (
            <ContactInfo hospital={hospital} />
          )}

          {/* Facility Logistics Sidebar */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-widest mb-8 px-1">
              Registry Logistics
            </h3>

            <div className="space-y-8">
              <div className="flex items-start gap-4 px-1 group">
                <div className="w-10 h-10 rounded-2xl bg-badge-bg border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <Info size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black text-muted uppercase tracking-tighter leading-none mb-2">
                    System Identifier
                  </p>
                  <p className="font-mono text-[10px] text-heading p-2.5 bg-slate-50 rounded-xl border border-slate-100 break-all leading-relaxed">
                    {hospital.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
