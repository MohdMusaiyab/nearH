import { Droplets } from "lucide-react";
import { BloodGroupCard } from "./BloodGroupCard";
import { PublicHospitalProfile } from "@/types/hospital";

interface Props {
  bloodBank: PublicHospitalProfile["blood_bank"];
  canEdit: boolean;
}

export function BloodBankTab({ bloodBank, canEdit }: Props) {
  if (bloodBank.length === 0) {
    return (
      <div className="text-center py-12">
        <Droplets className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">No blood bank data available</p>
        {canEdit && (
          <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Add Blood Inventory
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-slate-900">
          Blood Bank Inventory
        </h3>
        {canEdit && (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Update Stock
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bloodBank.map((item) => (
          <BloodGroupCard
            key={item.blood_group}
            bloodGroup={item.blood_group}
            units={item.units_available}
          />
        ))}
      </div>
    </div>
  );
}
