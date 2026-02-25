"use client";

import { Stethoscope, Plus, Users, UserPlus } from "lucide-react";
import { DoctorCard } from "./DoctorCard";
import { PublicHospitalProfile } from "@/types/hospital";

interface Props {
  doctors: PublicHospitalProfile["doctors"];
  canViewPrivate: boolean;
  canEdit: boolean;
}

export function DoctorsTab({ doctors, canViewPrivate, canEdit }: Props) {
  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-[2rem] bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center mb-6 shadow-sm">
          <Stethoscope className="w-10 h-10 text-[var(--color-muted)]" />
        </div>
        <h3 className="text-xl font-black text-[var(--color-heading)] uppercase tracking-tighter mb-2">
          Clinical Staff Pending
        </h3>
        <p className="text-sm text-[var(--color-muted)] max-w-xs font-medium leading-relaxed">
          There are currently no practitioners associated with this facility&apos;s
          digital registry.
        </p>

        {canEdit && (
          <button className="mt-8 flex items-center gap-2 px-8 py-4 bg-[var(--color-heading)] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
            <UserPlus size={16} /> Add Medical Staff
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Tab Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-badge-bg)] flex items-center justify-center text-[var(--color-accent)] border border-[var(--color-accent)]/10">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-xs font-black text-[var(--color-heading)] uppercase tracking-[0.2em] leading-none">
              Verified Practitioners
            </h3>
            <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase mt-1">
              {doctors.length} Active Medical Staff Members
            </p>
          </div>
        </div>

        {canEdit && (
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[var(--color-border)] text-[var(--color-heading)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all shadow-sm active:scale-95">
            <Plus size={14} strokeWidth={3} /> Manage Registry
          </button>
        )}
      </div>

      {/* ── Responsive Staff Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            canViewPrivate={canViewPrivate}
          />
        ))}
      </div>
    </div>
  );
}
