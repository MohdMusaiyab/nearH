"use client";

import { SuperadminReferral } from "@/actions/superadmin/referrals";
import {
  MapPin,
  ArrowRight,
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Database } from "@/types/database.types";

type Status = Database["public"]["Enums"]["referral_status"];

interface Props {
  initialReferrals: SuperadminReferral[];
  totalCount: number;
  currentPage: number;
}

const STATUS_STYLES: Record<Status, { pill: string; dot: string }> = {
  Pending: {
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  Accepted: {
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-success",
  },
  Rejected: {
    pill: "bg-red-50 text-error border border-red-200",
    dot: "bg-error",
  },
  Completed: {
    pill: "bg-badge-bg text-badge-text border border-border",
    dot: "bg-accent",
  },
};

const PRIORITY_STYLES: Record<string, { dot: string; text: string }> = {
  Critical: {
    dot: "bg-error",
    text: "text-error",
  },
  Urgent: {
    dot: "bg-warning",
    text: "text-warning",
  },
  Routine: {
    dot: "bg-muted",
    text: "text-muted",
  },
};

export default function SuperadminReferralClient({
  initialReferrals,
  totalCount,
  currentPage,
}: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / 10);
  const from = (currentPage - 1) * 10 + 1;
  const to = Math.min(currentPage * 10, totalCount);

  return (
    <div className="space-y-4">
      {}
      {initialReferrals.length === 0 && (
        <div className="bg-white rounded-2xl border border-border flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-badge-bg border border-border flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-muted" />
          </div>
          <h3 className="text-base font-bold text-heading mb-1">
            No referrals found
          </h3>
          <p className="text-sm text-muted">
            Referrals will appear here once hospitals start using the network.
          </p>
        </div>
      )}

      {initialReferrals.length > 0 && (
        <>
          {}
          <div className="hidden lg:block bg-white rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-badge-bg border-b border-border">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                      Patient
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                      Route
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest">
                      Priority
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-muted uppercase tracking-widest text-right">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {initialReferrals.map((ref) => {
                    const status = ref.status ?? "Pending";
                    const priority = ref.priority ?? "Routine";
                    const statusStyle =
                      STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
                    const priorityStyle =
                      PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Routine;

                    return (
                      <tr
                        key={ref.id}
                        className="hover:bg-badge-bg/40 transition-colors group"
                      >
                        {}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-badge-bg border border-border flex items-center justify-center flex-shrink-0">
                              <User size={15} className="text-accent" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-heading">
                                {ref.patient_name}
                              </p>
                              <p className="text-[10px] text-muted font-semibold mt-0.5">
                                {ref.patient_age}y · {ref.patient_gender}
                              </p>
                            </div>
                          </div>
                        </td>

                        {}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-heading truncate max-w-[140px]">
                                {ref.from_hospital?.name}
                              </p>
                              <p className="text-[10px] text-muted flex items-center gap-1 font-medium mt-0.5">
                                <MapPin size={10} />
                                {ref.from_hospital?.location?.city}
                              </p>
                            </div>
                            <ArrowRight
                              size={14}
                              className="text-border flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-heading truncate max-w-[140px]">
                                {ref.to_hospital?.name}
                              </p>
                              <p className="text-[10px] text-muted flex items-center gap-1 font-medium mt-0.5">
                                <MapPin size={10} />
                                {ref.to_hospital?.location?.city}
                              </p>
                            </div>
                          </div>
                        </td>

                        {}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusStyle.pill}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusStyle.dot}`}
                            />
                            {status}
                          </span>
                        </td>

                        {}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold ${priorityStyle.text}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityStyle.dot}`}
                            />
                            {priority}
                          </span>
                        </td>

                        {}
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/shared/referral/${ref.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-border rounded-xl text-xs font-bold text-muted hover:text-accent hover:border-accent/40 hover:bg-badge-bg transition-all opacity-0 group-hover:opacity-100"
                          >
                            View <ExternalLink size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {}
          <div className="lg:hidden space-y-3">
            {initialReferrals.map((ref) => {
              const status = ref.status ?? "Pending";
              const priority = ref.priority ?? "Routine";
              const statusStyle =
                STATUS_STYLES[status] ?? STATUS_STYLES.Pending;
              const priorityStyle =
                PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Routine;

              return (
                <div
                  key={ref.id}
                  className="bg-white rounded-2xl border border-border overflow-hidden"
                >
                  {}
                  <div className="px-5 py-4 flex items-start justify-between gap-3 border-b border-border/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-badge-bg border border-border flex items-center justify-center flex-shrink-0">
                        <User size={15} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-heading truncate">
                          {ref.patient_name}
                        </p>
                        <p className="text-[10px] text-muted font-semibold">
                          {ref.patient_age}y · {ref.patient_gender}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusStyle.pill}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                        />
                        {status}
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="px-5 py-3.5 bg-badge-bg/40">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">
                      Route
                    </p>
                    <div className="flex items-center gap-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-heading truncate">
                          {ref.from_hospital?.name}
                        </p>
                        <p className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                          <MapPin size={9} />
                          {ref.from_hospital?.location?.city}
                        </p>
                      </div>
                      <ArrowRight
                        size={13}
                        className="text-border flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-right">
                        <p className="text-xs font-bold text-heading truncate">
                          {ref.to_hospital?.name}
                        </p>
                        <p className="text-[10px] text-muted flex items-center justify-end gap-1 mt-0.5">
                          <MapPin size={9} />
                          {ref.to_hospital?.location?.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold ${priorityStyle.text}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${priorityStyle.dot}`}
                      />
                      {priority}
                    </span>
                    <Link
                      href={`/shared/referral/${ref.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-badge-bg border border-border rounded-xl text-xs font-bold text-heading hover:border-accent/40 hover:text-accent hover:bg-white transition-all"
                    >
                      View Details <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-2xl border border-border px-5 py-4">
            <p className="text-sm font-semibold text-muted">
              Showing <span className="font-black text-heading">{from}</span> –{" "}
              <span className="font-black text-heading">{to}</span> of{" "}
              <span className="font-black text-heading">{totalCount}</span>{" "}
              referrals
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => router.push(`?page=${currentPage - 1}`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-heading hover:bg-badge-bg hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={15} /> Prev
              </button>

              <span className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-black min-w-[2.5rem] text-center">
                {currentPage}
              </span>
              {totalPages > 1 && (
                <span className="text-xs font-semibold text-muted">
                  of {totalPages}
                </span>
              )}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => router.push(`?page=${currentPage + 1}`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-border rounded-xl text-sm font-bold text-heading hover:bg-badge-bg hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
