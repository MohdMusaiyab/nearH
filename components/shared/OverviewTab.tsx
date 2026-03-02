"use client";

import {
  BedDouble,
  Activity,
  AlertCircle,
  AlertTriangle,
  Clock,
  LucideIcon,
} from "lucide-react";
import { HospitalProfile } from "../hospital/profile/types";

interface Props {
  hospital: HospitalProfile;
}

export function OverviewTab({ hospital }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewStat
          icon={BedDouble}
          label="General Beds"
          value={hospital.inventory.available_beds}
          variant="blue"
        />
        <OverviewStat
          icon={Activity}
          label="ICU Units"
          value={hospital.inventory.icu_beds_available}
          variant="green"
        />
        <OverviewStat
          icon={AlertCircle}
          label="Ventilators"
          value={hospital.inventory.ventilators_available}
          variant="purple"
        />
      </div>

      {}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-badge-bg/30 border border-border rounded-2xl">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-accent" />
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">
            Data Sync Status
          </p>
        </div>
        {hospital.inventory.last_updated && (
          <p className="text-[10px] font-black text-heading uppercase tracking-tight">
            Last Refresh:{" "}
            {new Date(hospital.inventory.last_updated).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {}
      <div className="relative group overflow-hidden bg-red-50/50 border border-red-100 rounded-[2rem] p-6 md:p-8 transition-all hover:bg-white hover:border-red-200">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <AlertTriangle size={80} className="text-red-600" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white border border-red-100 flex items-center justify-center text-error shadow-sm">
            <AlertTriangle
              size={28}
              strokeWidth={2.5}
              className="animate-pulse"
            />
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-black text-error uppercase tracking-[0.2em]">
              Emergency Dispatch
            </h4>
            <p className="text-2xl font-black text-red-900 tracking-tight leading-tight">
              Dial{" "}
              <span className="text-error underline decoration-red-200 underline-offset-4">
                108
              </span>{" "}
              for Immediate Care
            </p>
            <p className="text-[10px] font-bold text-red-600/70 uppercase tracking-widest">
              National Medical Emergency Response Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

{
}
function OverviewStat({
  icon: Icon,
  label,
  value,
  variant,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  variant: "blue" | "green" | "purple";
}) {
  const styles = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    green: "bg-emerald-50 border-emerald-100 text-emerald-600",
    purple: "bg-purple-50 border-purple-100 text-purple-600",
  };

  return (
    <div
      className={`p-6 rounded-[2rem] border shadow-sm transition-all hover:scale-[1.02] ${styles[variant]}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
          {label}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tighter tabular-nums">
          {value}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
          Available
        </span>
      </div>
    </div>
  );
}
