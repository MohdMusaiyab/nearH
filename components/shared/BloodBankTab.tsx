"use client";

import { Droplets, Plus, RefreshCw, Activity } from "lucide-react";
import { BloodGroupCard } from "./BloodGroupCard";
import { PublicHospitalProfile } from "@/types/hospital";

interface Props {
  bloodBank: PublicHospitalProfile["blood_bank"];
  canEdit: boolean;
}

export function BloodBankTab({ bloodBank, canEdit }: Props) {
  if (bloodBank.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 rounded-[2rem] bg-red-50 border border-red-100 flex items-center justify-center mb-6 shadow-sm">
          <Droplets className="w-10 h-10 text-red-400 opacity-60" />
        </div>
        <h3 className="text-xl font-black text-heading uppercase tracking-tighter mb-2">
          Hematology Registry Empty
        </h3>
        <p className="text-sm text-muted max-w-xs font-medium leading-relaxed">
          No real-time blood inventory data has been synchronized for this
          facility.
        </p>

        {canEdit && (
          <button className="mt-8 flex items-center gap-2 px-8 py-4 bg-heading text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
            <Plus size={16} /> Initialize Inventory
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Header Strategy ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-error">
            <Droplets size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xs font-black text-heading uppercase tracking-[0.2em] leading-none">
              Blood Bank Inventory
            </h3>
            <p className="text-[10px] font-bold text-muted uppercase mt-1.5 flex items-center gap-1.5">
              <Activity size={10} className="text-success" />
              Live Hematological Stock Levels
            </p>
          </div>
        </div>

        {canEdit && (
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-border text-heading rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-accent hover:text-accent transition-all shadow-sm active:scale-95">
            <RefreshCw
              size={14}
              strokeWidth={3}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
            Update Stock
          </button>
        )}
      </div>

      {/* ── Inventory Grid ── */}
      {/* Using grid-cols-2 for mobile to prevent text overlap, 
        expanding to 4 columns on larger screens for high-density viewing.
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {bloodBank.map((item) => (
          <BloodGroupCard
            key={item.blood_group}
            bloodGroup={item.blood_group}
            units={item.units_available}
          />
        ))}
      </div>

      <div className="mt-10 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
        <p className="text-[9px] font-bold text-muted uppercase tracking-widest text-center">
          Notice: Blood availability is subject to real-time changes. Please
          contact the ER hotline for emergency reservations.
        </p>
      </div>
    </div>
  );
}
