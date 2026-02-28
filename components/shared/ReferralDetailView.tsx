"use client";

import { SharedReferralDetail } from "@/actions/admin/referrals";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Activity,
  User,
  FileText,
  AlertTriangle,
  Hash,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Database } from "@/types/database.types";
import Link from "next/link";

type Priority = Database["public"]["Enums"]["priority_level"];
type Status = Database["public"]["Enums"]["referral_status"];

interface Props {
  referral: SharedReferralDetail;
  userRole: "user" | "admin" | "superadmin";
}

export default function ReferralDetailView({ referral, userRole }: Props) {
  const router = useRouter();
  const isSuperadmin = userRole === "superadmin";

  const statusColors: Record<Status, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Accepted:
      "bg-badge-bg text-accent border-border",
    Rejected: "bg-red-50 text-error border-red-200",
    Completed: "bg-green-50 text-green-700 border-green-200",
  };

  const priorityColors: Record<Priority, string> = {
    Routine: "text-accent bg-blue-50 border-blue-100",
    Urgent: "text-orange-600 bg-orange-50 border-orange-100",
    Critical: "text-error bg-red-50 border-red-100",
  };

  return (
    <div className="space-y-6">
      <Link
        href={`/${isSuperadmin ? "superadmin" : "admin"}/dashboard`}
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-heading transition-all group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Return to Dashboard
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ── Clinical Section ── */}
        <div className="xl:col-span-8 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-border shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-badge-bg border border-border text-accent rounded-3xl flex items-center justify-center flex-shrink-0">
                  <User size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-heading tracking-tighter uppercase leading-none">
                    {referral.patient_name}
                  </h1>
                  <p className="text-muted text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                    Age: {referral.patient_age}{" "}
                    <span className="w-1 h-1 rounded-full bg-slate-300" />{" "}
                    {referral.patient_gender}
                  </p>
                </div>
              </div>
              <div
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${statusColors[referral.status || "Pending"]}`}
              >
                {referral.status}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="p-5 bg-badge-bg/30 rounded-2xl border border-border">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Activity size={12} className="text-accent" />{" "}
                  Requested Specialty
                </p>
                <div className="text-sm font-black text-heading uppercase">
                  {referral.specialty?.specialty_name || "General Care"}
                </div>
              </div>

              <div
                className={`p-5 rounded-2xl border ${priorityColors[referral.priority || "Routine"]} shadow-sm`}
              >
                <p className="text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Priority Level
                </p>
                <div className="text-sm font-black uppercase">
                  {referral.priority}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                <FileText size={14} className="text-accent" />{" "}
                Clinical Reason
              </p>
              <div className="p-8 bg-slate-50/80 rounded-[2rem] border border-slate-100 text-body leading-relaxed font-medium whitespace-pre-wrap text-sm italic shadow-inner">
                &ldquo;{referral.medical_reason}&rdquo;
              </div>
            </div>
          </section>
        </div>

        {/* ── Tracking Sidebar ── */}
        <div className="xl:col-span-4 space-y-6">
          <HospitalBriefCard
            title="Sending Facility"
            hospital={referral.from_hospital}
          />
          <HospitalBriefCard
            title="Receiving Facility"
            hospital={referral.to_hospital}
          />

          <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-widest mb-5 px-1 border-b border-slate-50 pb-2">
              System Audit
            </h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3 px-1">
                <Calendar size={16} className="text-accent" />
                <div>
                  <p className="text-[9px] font-black text-muted uppercase leading-none">
                    Created On
                  </p>
                  <p className="text-xs font-black text-heading mt-1">
                    {referral.created_at
                      ? format(new Date(referral.created_at), "dd MMM yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-1">
                <Hash size={16} className="text-accent" />
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-muted uppercase leading-none">
                    Internal ID
                  </p>
                  <p className="font-mono text-[9px] bg-slate-50 border border-slate-100 px-2 py-1 rounded-md text-heading mt-1 truncate">
                    {referral.id}
                  </p>
                </div>
              </div>
              {isSuperadmin && (
                <div className="pt-2 px-1">
                  <div className="flex items-center gap-2 px-3 py-2 bg-badge-bg rounded-xl border border-border">
                    <ShieldCheck
                      size={14}
                      className="text-accent"
                    />
                    <span className="text-[9px] font-black text-accent uppercase">
                      Privileged Audit View
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HospitalBriefCard({
  title,
  hospital,
}: {
  title: string;
  hospital: SharedReferralDetail["from_hospital"];
}) {
  if (!hospital) return null;

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm hover:border-accent/30 transition-all group">
      <h3 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4 px-1">
        {title}
      </h3>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-badge-bg text-accent border border-border rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
          <Building2 size={20} />
        </div>
        <Link href={`/hospitals/${hospital.id}`} className="min-w-0">
          <p className="font-black text-heading text-sm uppercase leading-tight truncate">
            {hospital.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin size={10} className="text-accent" />
            <p className="text-[10px] text-muted font-black uppercase tracking-tighter">
              {hospital.location?.city || "Unknown City"}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
