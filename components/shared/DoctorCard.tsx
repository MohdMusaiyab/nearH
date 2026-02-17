// components/hospital/profile/DoctorCard.tsx
import { Calendar, CheckCircle, XCircle, MapPin } from "lucide-react";
import {
  PublicHospitalProfile,
  PrivateHospitalProfile,
} from "@/types/hospital";

type Doctor = PublicHospitalProfile["doctors"][0];
type PrivateDoctor = PrivateHospitalProfile["doctors"][0];

interface Props {
  doctor: Doctor | PrivateDoctor;
  canViewPrivate: boolean;
}

const statusColors: Record<string, string> = {
  Available: "bg-green-100 text-green-700",
  In_OPD: "bg-blue-100 text-blue-700",
  In_Surgery: "bg-purple-100 text-purple-700",
  On_Call: "bg-amber-100 text-amber-700",
  On_Leave: "bg-gray-100 text-gray-700",
  Emergency_Only: "bg-red-100 text-red-700",
};

const formatStatus = (status: string) => {
  return status.replace(/_/g, " ");
};

export function DoctorCard({ doctor, canViewPrivate }: Props) {
  const isPrivateDoctor = "room_number" in doctor;

  return (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-black text-slate-900">{doctor.name}</h4>
          <p className="text-sm text-indigo-600 font-bold">
            {doctor.specialty || "General Physician"}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-black ${statusColors[doctor.status]}`}
        >
          {formatStatus(doctor.status)}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{doctor.experience_years} years exp.</span>
        </div>
        <div className="flex items-center gap-1">
          {doctor.is_available ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">Available</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Unavailable</span>
            </>
          )}
        </div>
      </div>

      {canViewPrivate && isPrivateDoctor && doctor.room_number && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3 h-3" />
            <span>Room: {doctor.room_number}</span>
          </div>
        </div>
      )}
    </div>
  );
}
