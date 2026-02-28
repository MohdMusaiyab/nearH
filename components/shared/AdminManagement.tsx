"use client";

import {
  UserCog,
  Mail,
  Calendar,
  ShieldCheck,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import {
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";
import { format } from "date-fns";

interface Props {
  hospital: PrivateHospitalProfile | SuperAdminHospitalProfile;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
  rejected: "bg-red-50 text-error border-red-100",
};

const hasAdmins = (
  hospital: PrivateHospitalProfile | SuperAdminHospitalProfile,
): hospital is SuperAdminHospitalProfile => {
  return "admins" in hospital;
};

export function AdminManagement({ hospital }: Props) {
  if (
    !hasAdmins(hospital) ||
    !hospital.admins ||
    hospital.admins.length === 0
  ) {
    return (
      <div className="p-10 bg-badge-bg/20 rounded-[2rem] border-2 border-dashed border-border text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-white rounded-2xl border border-border flex items-center justify-center mx-auto mb-4 shadow-sm text-muted">
          <UserCog size={32} strokeWidth={1.5} />
        </div>
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
          No assigned administrators found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-xl bg-heading flex items-center justify-center text-white shadow-lg shadow-slate-200">
          <ShieldCheck size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xs font-black text-heading uppercase tracking-[0.2em] leading-none">
            Facility Authorities
          </h3>
          <p className="text-[10px] font-bold text-muted uppercase mt-1">
            {hospital.admins.length} Verified System Administrators
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hospital.admins.map((admin) => (
          <div
            key={admin.id}
            className="group p-5 bg-white border border-border rounded-[2rem] hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-badge-bg flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                  <UserCheck size={18} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-heading uppercase leading-none mb-2 truncate">
                    {admin.full_name || "Anonymous Admin"}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase truncate">
                    <Mail size={12} className="text-accent" />
                    <span>{admin.email}</span>
                  </div>
                </div>
              </div>

              {admin.status && (
                <div
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusColors[admin.status.toLowerCase()] || "bg-slate-50 text-slate-500"}`}
                >
                  {admin.status}
                </div>
              )}
            </div>

            {/* Timeline / Metadata Gutter */}
            {admin.created_at && (
              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] font-black text-muted uppercase tracking-widest">
                  <Calendar size={12} className="text-accent" />
                  <span>
                    Onboarded {format(new Date(admin.created_at), "MMM yyyy")}
                  </span>
                </div>
                <div className="text-[8px] font-mono text-slate-300 uppercase">
                  UID: {admin.id.slice(0, 8)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
