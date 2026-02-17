// components/hospital/profile/admin/ReferralsTab.tsx
import { FileText, AlertCircle } from "lucide-react";
import {
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";

interface Props {
  hospital: PrivateHospitalProfile | SuperAdminHospitalProfile;
}

const priorityColors: Record<string, string> = {
  Routine: "bg-blue-100 text-blue-700",
  Urgent: "bg-amber-100 text-amber-700",
  Critical: "bg-red-100 text-red-700",
};

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Completed: "bg-blue-100 text-blue-700",
};

export function ReferralsTab({ hospital }: Props) {
  const fromReferrals = hospital.referrals_as_from ?? [];
  const toReferrals = hospital.referrals_as_to ?? [];

  if (fromReferrals.length === 0 && toReferrals.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">No referrals found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {}
      {fromReferrals.length > 0 && (
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-4">
            Outgoing Referrals
          </h3>
          <div className="space-y-3">
            {fromReferrals.map((referral) => (
              <div
                key={referral.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-black text-slate-900">
                      {referral.patient_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      To: {referral.to_hospital.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {referral.priority && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-black ${
                          priorityColors[referral.priority]
                        }`}
                      >
                        {referral.priority}
                      </span>
                    )}
                    {referral.status && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-black ${
                          statusColors[referral.status]
                        }`}
                      >
                        {referral.status}
                      </span>
                    )}
                  </div>
                </div>
                {referral.created_at && (
                  <p className="text-xs text-slate-400">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {toReferrals.length > 0 && (
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-4">
            Incoming Referrals
          </h3>
          <div className="space-y-3">
            {toReferrals.map((referral) => (
              <div
                key={referral.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-black text-slate-900">
                      {referral.patient_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      From: {referral.from_hospital.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {referral.priority && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-black ${
                          priorityColors[referral.priority]
                        }`}
                      >
                        {referral.priority}
                      </span>
                    )}
                    {referral.status && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-black ${
                          statusColors[referral.status]
                        }`}
                      >
                        {referral.status}
                      </span>
                    )}
                  </div>
                </div>
                {referral.created_at && (
                  <p className="text-xs text-slate-400">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
