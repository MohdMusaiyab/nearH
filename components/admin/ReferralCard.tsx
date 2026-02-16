"use client";

import React, { memo, useState, useTransition } from "react";
import {
  type ReferralWithDetails,
  updateReferralStatus,
} from "@/actions/admin/referrals";
import { Clock, User, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Database } from "@/types/database.types";
import AcceptModal from "./AcceptModal";

type Priority = Database["public"]["Enums"]["priority_level"];

export const ReferralCard = memo(
  ({ referral }: { referral: ReferralWithDetails }) => {
    const [isPending, startTransition] = useTransition();
    const [showModal, setShowModal] = useState(false);

    const priorityColors: Record<Priority, string> = {
      Routine: "bg-blue-50 text-blue-700 border-blue-100",
      Urgent: "bg-orange-50 text-orange-700 border-orange-100",
      Critical: "bg-red-50 text-red-700 border-red-100",
    };

    const handleAction = (
      status: Database["public"]["Enums"]["referral_status"],
    ) => {
      startTransition(async () => {
        const res = await updateReferralStatus(referral.id, status);
        if (res.success) {
          if (status === "Accepted") {
            setShowModal(true);
          }
        } else {
          alert(res.message);
        }
      });
    };

    const dateValue = referral.created_at
      ? new Date(referral.created_at)
      : new Date();
    const priorityKey = referral.priority || "Routine";

    return (
      <>
        {}
        {showModal && (
          <AcceptModal
            referral={referral}
            onClose={() => setShowModal(false)}
          />
        )}

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${priorityColors[priorityKey]}`}
                >
                  {priorityKey}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />{" "}
                  {format(dateValue, "MMM d, h:mm a")}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {referral.patient_name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {referral.patient_age}y • {referral.patient_gender} •{" "}
                    {referral.specialty?.specialty_name || "General"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                  Medical Reason
                </p>
                <p className="text-sm text-slate-700 line-clamp-2">
                  {referral.medical_reason}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 min-w-[200px]">
              <div className="text-right space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {referral.direction === "inbound" ? "From" : "To"}
                </p>
                <p className="font-bold text-slate-900">
                  {referral.direction === "inbound"
                    ? referral.from_hospital?.name || "Unknown Hospital"
                    : referral.to_hospital?.name || "Unknown Hospital"}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                {referral.status === "Pending" &&
                referral.direction === "inbound" ? (
                  <>
                    <button
                      disabled={isPending}
                      onClick={() => handleAction("Accepted")}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all flex items-center gap-2 disabled:bg-slate-200"
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Accept
                    </button>
                    <button
                      disabled={isPending}
                      onClick={() => handleAction("Rejected")}
                      className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                    <div
                      className={`w-2 h-2 rounded-full ${referral.status === "Accepted" ? "bg-green-500" : "bg-slate-300"}`}
                    />
                    <span className="text-sm font-bold text-slate-700">
                      {referral.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

ReferralCard.displayName = "ReferralCard";
export default ReferralCard;
