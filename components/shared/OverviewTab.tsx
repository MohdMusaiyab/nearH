import { BedDouble, Activity, AlertCircle, AlertTriangle } from "lucide-react";
import { StatCard } from "./StatCard";
import { HospitalProfile } from "../hospital/profile/types";

interface Props {
  hospital: HospitalProfile;
}

export function OverviewTab({ hospital }: Props) {
  return (
    <div className="space-y-8">
      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={BedDouble}
          label="Available Beds"
          value={hospital.inventory.available_beds}
          color="blue"
        />
        <StatCard
          icon={Activity}
          label="ICU Beds"
          value={hospital.inventory.icu_beds_available}
          color="green"
        />
        <StatCard
          icon={AlertCircle}
          label="Ventilators"
          value={hospital.inventory.ventilators_available}
          color="purple"
        />
      </div>

      {}
      {hospital.inventory.last_updated && (
        <p className="text-xs text-slate-400 text-right">
          Last updated:{" "}
          {new Date(hospital.inventory.last_updated).toLocaleString()}
        </p>
      )}

      {}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h4 className="font-black text-red-800 mb-1">Emergency Services</h4>
            <p className="text-red-700 text-sm">
              For emergencies, call:{" "}
              <span className="font-bold">108 (National Emergency)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
