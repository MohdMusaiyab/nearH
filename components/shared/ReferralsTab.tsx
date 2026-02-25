"use client";

import { FileText, ArrowUpRight, ArrowDownLeft, Calendar, User, Building2 } from "lucide-react";
import {
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";
import { format } from "date-fns";

// Defining the specific referral types from your hospital profile
type ReferralDetailFrom = NonNullable<PrivateHospitalProfile["referrals_as_from"]>[number];
type ReferralDetailTo = NonNullable<PrivateHospitalProfile["referrals_as_to"]>[number];
type ReferralDetail = ReferralDetailFrom | ReferralDetailTo;

interface Props {
  hospital: PrivateHospitalProfile | SuperAdminHospitalProfile;
}

const priorityColors: Record<string, string> = {
  Routine: "bg-blue-50 text-blue-600 border-blue-100",
  Urgent: "bg-amber-50 text-amber-600 border-amber-200",
  Critical: "bg-red-50 text-[var(--color-error)] border-red-100",
};

const statusColors: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-600 border-slate-200",
  Accepted: "bg-[var(--color-badge-bg)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
  Rejected: "bg-red-50 text-[var(--color-error)] border-red-100",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

export function ReferralsTab({ hospital }: Props) {
  const fromReferrals = hospital.referrals_as_from ?? [];
  const toReferrals = hospital.referrals_as_to ?? [];

  if (fromReferrals.length === 0 && toReferrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-[2rem] bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center mb-6 shadow-sm">
          <FileText className="w-10 h-10 text-[var(--color-muted)] opacity-40" />
        </div>
        <p className="text-[10px] font-black text-[var(--color-muted)] uppercase tracking-widest">
          No Transfer Records Found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* ── Outgoing Section ── */}
      {fromReferrals.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ArrowUpRight size={20} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xs font-black text-[var(--color-heading)] uppercase tracking-[0.2em] leading-none">
                Outgoing Transfers
              </h3>
              <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase mt-1">
                Patients dispatched from this facility
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {fromReferrals.map((referral) => (
              <ReferralItem 
                key={referral.id} 
                referral={referral} 
                type="outgoing" 
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Incoming Section ── */}
      {toReferrals.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ArrowDownLeft size={20} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xs font-black text-[var(--color-heading)] uppercase tracking-[0.2em] leading-none">
                Incoming Requests
              </h3>
              <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase mt-1">
                Patients awaiting admission here
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {toReferrals.map((referral) => (
              <ReferralItem 
                key={referral.id} 
                referral={referral} 
                type="incoming" 
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReferralItem({ referral, type }: { referral: ReferralDetail; type: 'incoming' | 'outgoing' }) {
  const hospitalName = type === 'outgoing' 
    ? ((referral as ReferralDetailFrom).to_hospital as { name?: string })?.name 
    : ((referral as ReferralDetailTo).from_hospital as { name?: string })?.name;

  return (
    <div className="group bg-white p-6 rounded-[2rem] border border-[var(--color-border)] hover:border-[var(--color-accent)]/40 hover:shadow-xl hover:shadow-[var(--color-accent)]/5 transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Patient & Facility Info */}
        <div className="flex items-center gap-5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all shadow-sm">
            <User size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-black text-[var(--color-heading)] uppercase truncate leading-none mb-2">
              {referral.patient_name}
            </h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-muted)] uppercase">
              <Building2 size={12} className="text-[var(--color-accent)]" />
              <span className="truncate">
                {type === 'outgoing' ? 'Target' : 'Origin'}: {hospitalName || "Unspecified Facility"}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Stats Stack */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
            <Calendar size={12} className="text-[var(--color-accent)]" />
            <span className="text-[9px] font-black text-[var(--color-muted)] uppercase tracking-wider">
              {referral.created_at ? format(new Date(referral.created_at), "dd MMM yyyy") : "N/A"}
            </span>
          </div>

          {referral.priority && (
            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${priorityColors[referral.priority]}`}>
              {referral.priority}
            </span>
          )}

          {referral.status && (
            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusColors[referral.status]}`}>
              {referral.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}