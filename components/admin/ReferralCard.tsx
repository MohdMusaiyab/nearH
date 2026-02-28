"use client";

import React, { memo, useState, useTransition } from "react";
import {
  type ReferralWithDetails,
  updateReferralStatus,
} from "@/actions/admin/referrals";
import {
  Clock,
  User,
  CheckCircle2,
  Loader2,
  Hospital,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Database } from "@/types/database.types";
import AcceptModal from "./AcceptModal";
import { toast } from "sonner";
import { Modal, ConfigProvider, App as AntApp } from "antd";

type Priority = Database["public"]["Enums"]["priority_level"];
type Status = Database["public"]["Enums"]["referral_status"];

export const ReferralCard = memo(
  ({ referral }: { referral: ReferralWithDetails }) => {
    const [isPending, startTransition] = useTransition();
    const [showModal, setShowModal] = useState(false);

    // Mapping to NearH Semantic Theme Variables
    const priorityStyles: Record<Priority, string> = {
      Routine: "bg-blue-50 text-blue-700 border-blue-100",
      Urgent:
        "bg-badge-bg text-badge-text border-border",
      Critical: "bg-red-50 text-error border-red-100",
    };

    const handleAction = (status: Status) => {
      if (status === "Rejected") {
        Modal.confirm({
          title: (
            <span className="font-black text-heading">
              Decline Referral
            </span>
          ),
          content: `Are you sure you want to decline the referral for ${referral.patient_name}?`,
          okText: "Decline",
          okType: "danger",
          centered: true,
          async onOk() {
            performUpdate(status);
          },
        });
      } else {
        performUpdate(status);
      }
    };

    const performUpdate = (status: Status) => {
      startTransition(async () => {
        const res = await updateReferralStatus(referral.id, status);
        if (res.success) {
          toast.success(`Referral ${status.toLowerCase()}`);
          if (status === "Accepted") setShowModal(true);
        } else {
          toast.error("Operation failed", { description: res.message });
        }
      });
    };

    const dateValue = referral.created_at
      ? new Date(referral.created_at)
      : new Date();
    const priorityKey = referral.priority || "Routine";

    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0284C7",
            borderRadius: 16,
          },
        }}
      >
        <AntApp>
          {showModal && (
            <AcceptModal
              referral={referral}
              onClose={() => setShowModal(false)}
            />
          )}

          <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {/* Top Priority/Time Row */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${priorityStyles[priorityKey]}`}
                >
                  {priorityKey}
                </span>
                <span className="text-[10px] font-bold text-muted uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {format(dateValue, "MMM d, h:mm a")}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-badge-bg/40 rounded-lg border border-border">
                <Hospital className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-black text-heading uppercase tracking-tight">
                  {referral.direction === "inbound"
                    ? "Inbound Request"
                    : "Outbound Sent"}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                {/* Patient Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-badge-bg rounded-2xl flex items-center justify-center text-accent border border-border flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-black text-heading truncate tracking-tight">
                      {referral.patient_name}
                    </h3>
                    <p className="text-xs font-bold text-muted uppercase mt-0.5">
                      {referral.patient_age} Years • {referral.patient_gender} •{" "}
                      {referral.specialty?.specialty_name || "General Medicine"}
                    </p>
                  </div>
                </div>

                {/* Medical Reason */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-accent/20 transition-all">
                  <p className="text-[10px] font-black text-muted uppercase mb-1.5 tracking-widest">
                    Clinical Reason
                  </p>
                  <p className="text-sm text-body leading-relaxed line-clamp-2 italic font-medium">
                    &ldquo;{referral.medical_reason}&rdquo;
                  </p>
                </div>
              </div>

              {/* Hospital & Actions Column */}
              <div className="flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8 min-w-[240px]">
                <div className="text-right w-full">
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">
                    {referral.direction === "inbound"
                      ? "Originating Hospital"
                      : "Target Hospital"}
                  </p>
                  <div className="flex items-center justify-end gap-2 text-heading">
                    <span className="font-black text-sm">
                      {referral.direction === "inbound"
                        ? referral.from_hospital?.name
                        : referral.to_hospital?.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </div>
                </div>

                <div className="flex w-full gap-2 mt-6">
                  {referral.status === "Pending" &&
                  referral.direction === "inbound" ? (
                    <>
                      <button
                        disabled={isPending}
                        onClick={() => handleAction("Accepted")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-success text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
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
                        className="px-4 py-3 bg-white border border-border text-error rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-between px-4 py-3 bg-badge-bg/40 rounded-xl border border-border">
                      <span className="text-[10px] font-black text-muted uppercase">
                        Transfer Status
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${referral.status === "Accepted" ? "bg-success animate-pulse" : "bg-slate-400"}`}
                        />
                        <span className="text-xs font-black text-heading uppercase">
                          {referral.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </AntApp>
      </ConfigProvider>
    );
  },
);

ReferralCard.displayName = "ReferralCard";
export default ReferralCard;
