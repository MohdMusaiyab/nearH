"use client";

import {
  Check,
  ArrowRight,
  X,
  User,
  AlertCircle,
  Stethoscope,
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden border border-border">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-badge-bg rounded-full -mr-16 -mt-16 opacity-50" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-badge-bg text-muted hover:text-heading rounded-full transition-all z-10 border border-border"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-6 relative">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-success text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-100 rotate-6 border-4 border-white">
            <Check className="w-10 h-10" strokeWidth={3} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-heading tracking-tight uppercase">
              Transfer Accepted
            </h2>
            <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">
              Handshake Successful
            </p>
          </div>

          {/* Patient Info Card */}
          <div className="bg-badge-bg/30 rounded-[2rem] p-6 border border-border text-left space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-border shadow-sm">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-none mb-1">
                  Patient Assigned
                </p>
                <p className="font-black text-heading truncate text-lg leading-none">
                  {referral.patient_name}
                </p>
                <p className="text-[10px] font-bold text-muted mt-1 uppercase">
                  Age: {referral.patient_age}y • {referral.patient_gender}
                </p>
              </div>
            </div>

            <div className="h-px bg-border opacity-60" />

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-accent uppercase tracking-widest">
                <Stethoscope className="w-3.5 h-3.5" /> Clinical Context
              </div>
              <p className="text-sm text-body leading-relaxed italic font-medium">
                &ldquo;{referral.medical_reason}&rdquo;
              </p>
            </div>

            {referral.priority === "Critical" && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-4 h-4 text-error" />
                <span className="text-[10px] font-black text-error uppercase tracking-tight">
                  Priority: Critical Action Required
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="grid grid-cols-1 gap-3 mt-8">
          <button
            onClick={() => router.push("/admin")}
            className="w-full py-4.5 bg-heading text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Update Inventory{" "}
            <ArrowRight className="w-4 h-4 text-accent" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-muted rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-heading transition-all"
          >
            Dismiss View
          </button>
        </div>
      </div>
    </div>
  );
}
