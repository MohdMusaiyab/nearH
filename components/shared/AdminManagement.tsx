import { UserCog, Mail, Calendar } from "lucide-react";
import {
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";

interface Props {
  hospital: PrivateHospitalProfile | SuperAdminHospitalProfile;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
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
      <div className="mt-8 p-8 bg-slate-50 rounded-2xl text-center">
        <UserCog className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500">No admins assigned to this hospital</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-black text-slate-900 mb-4">
        Hospital Administrators
      </h3>
      <div className="space-y-3">
        {hospital.admins.map((admin) => (
          <div
            key={admin.id}
            className="p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-black text-slate-900">
                  {admin.full_name || "Unnamed Admin"}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Mail className="w-3 h-3" />
                  <span>{admin.email}</span>
                </div>
              </div>
              {admin.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black ${
                    statusColors[admin.status]
                  }`}
                >
                  {admin.status.toUpperCase()}
                </span>
              )}
            </div>
            {admin.created_at && (
              <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>
                  Since {new Date(admin.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
