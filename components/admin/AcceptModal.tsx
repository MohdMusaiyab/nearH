"use client";

import {
  Check,
  ArrowRight,
  X,
  User,
  Activity,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReferralWithDetails } from "@/actions/admin/referrals";

interface Props {
  referral: ReferralWithDetails;
  onClose: () => void;
}

export default function AcceptModal({ referral, onClose }: Props) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        {}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-6 relative">
          <div className="w-20 h-20 bg-green-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-green-100 rotate-6">
            <Check className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Referral Accepted
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              The handshake was successful.
            </p>
          </div>

          {}
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Patient Details
                </p>
                <p className="font-bold text-slate-900">
                  {referral.patient_name}, {referral.patient_age}y
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Activity className="w-3 h-3 text-indigo-500" /> Clinical Reason
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                &quot;{referral.medical_reason}&quot;
              </p>
            </div>

            {referral.priority === "Critical" && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-black text-red-600 uppercase">
                  Immediate Action Required
                </span>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 gap-3 mt-8">
          <button
            onClick={() => router.push("/admin")}
            className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Update Inventory <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-4 text-slate-400 rounded-2xl font-bold text-sm hover:text-slate-600 transition-all"
          >
            Stay in Referrals
          </button>
        </div>
      </div>
    </div>
  );
}
