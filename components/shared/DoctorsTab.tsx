import { Stethoscope } from "lucide-react";
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
      <div className="text-center py-12">
        <Stethoscope className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-black text-slate-900 mb-2">
          No Doctors Listed
        </h3>
        <p className="text-slate-500">
          This hospital hasn&apos;t added any doctors yet.
        </p>
        {canEdit && (
          <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Add Doctors
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-slate-900">
          Medical Staff ({doctors.length})
        </h3>
        {canEdit && (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
            Manage Doctors
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
