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
import { ServicesTab } from "../superadmin/ServicesTab";
import { ServicesTab as Services } from "./ServicesTab";
import { BloodBankTab } from "./BloodBankTab";
import { ReferralsTab } from "./ReferralsTab";
import { AdminManagement } from "./AdminManagement";

interface Props {
  hospital: HospitalProfile;
  userId: string;
  isOwner: boolean;
  isSuperadmin: boolean;
}

export default function HospitalProfileClient({
  hospital,
  userId,
  isOwner,
  isSuperadmin,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const canViewPrivate = isOwner || isSuperadmin;
  const canEdit = isOwner;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Bar - Only for owners and superadmins */}
      {canViewPrivate && (
        <AdminBar
          hospitalId={hospital.id}
          isOwner={isOwner}
          isSuperadmin={isSuperadmin}
        />
      )}

      {/* Hero Section */}
      <HeroSection hospital={hospital} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Contact Info - Only for those who can view private data */}
        {canViewPrivate && hasPrivateData(hospital) && (
          <ContactInfo hospital={hospital} />
        )}

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showReferralsTab={canViewPrivate}
        />

        {/* Tab Content */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
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
              <div className="space-y-8">
                <ReferralsTab hospital={hospital} />
                {isSuperadmin && <AdminManagement hospital={hospital} />}
              </div>
            )}
        </div>

        {canViewPrivate && hasPrivateData(hospital) && (
          <div className="mt-8 text-xs text-slate-400 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-4">
              <span>Hospital ID: {hospital.id}</span>
              <span>•</span>
              <span>
                Last Updated:{" "}
                {new Date(hospital.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
