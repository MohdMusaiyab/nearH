"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  approveHospital,
  rejectAndPurgeUser,
} from "@/actions/superadmin/approval";
import {
  Search,
  MapPin,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { ApprovalsTableProps } from "@/types/approvals";
import { toast } from "sonner";
import { Modal } from "antd";

export default function ApprovalsTable({
  data,
  locations,
  totalCount,
  pageSize,
}: ApprovalsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleApprove = async (profileId: string, hospitalId: string, hospitalName: string) => {
    setLoadingId(profileId);
    const res = await approveHospital(profileId, hospitalId);
    if (res.success) {
      toast.success(`${hospitalName} approved successfully`, {
        description: "The hospital admin now has full access.",
      });
      router.refresh();
    } else {
      toast.error("Approval failed", { description: res.message });
    }
    setLoadingId(null);
  };

  const handleReject = (profileId: string, hospitalId: string, hospitalName: string) => {
    Modal.confirm({
      title: "Reject & Delete Hospital?",
      content: (
        <div className="pt-1">
          <p className="text-sm text-gray-600 mb-2">
            You are about to permanently delete{" "}
            <span className="font-bold text-gray-900">{hospitalName}</span> and
            all associated data.
          </p>
          <p className="text-xs text-red-600 font-semibold bg-red-50 rounded-lg px-3 py-2 border border-red-100">
            ⚠️ This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Reject & Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        className: "!bg-red-600 !border-red-600 hover:!bg-red-700 !font-bold !text-white",
      },
      icon: null,
      centered: true,
      async onOk() {
        setLoadingId(profileId);
        const res = await rejectAndPurgeUser(profileId, hospitalId);
        if (res.success) {
          toast.success(`${hospitalName} has been rejected and removed.`);
          router.refresh();
        } else {
          toast.error("Rejection failed", { description: res.message });
        }
        setLoadingId(null);
      },
    });
  };

  return (
    <div className="space-y-4">

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            onChange={(e) => updateFilters("search", e.target.value)}
            defaultValue={searchParams.get("search") || ""}
            placeholder="Search by admin name…"
            className="w-full pl-10 pr-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-heading)] placeholder:text-[var(--color-muted)] bg-white outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all"
          />
        </div>

        <select
          onChange={(e) => updateFilters("location", e.target.value)}
          defaultValue={searchParams.get("location") || ""}
          className="px-3.5 py-2.5 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-body)] bg-white outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all cursor-pointer"
        >
          <option value="">📍 All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.city}, {loc.state}
            </option>
          ))}
        </select>

        {(searchParams.get("search") || searchParams.get("location")) && (
          <button
            onClick={() => {
              updateFilters("search", "");
              updateFilters("location", "");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-[var(--color-error)] hover:bg-red-50 border border-transparent hover:border-red-100 transition-all flex-shrink-0"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* ── Table / Cards ── */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">

        {data.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center mb-4">
              <UserCheck size={24} className="text-[var(--color-muted)]" />
            </div>
            <h3 className="text-base font-bold text-[var(--color-heading)] mb-1">
              No pending applications
            </h3>
            <p className="text-sm text-[var(--color-muted)]">
              All caught up — no approvals waiting.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--color-badge-bg)] border-b border-[var(--color-border)]">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">
                      Admin
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">
                      Hospital
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">
                      Location
                    </th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/60">
                  {data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[var(--color-badge-bg)]/40 transition-colors group"
                    >
                      {/* Admin */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-black text-[var(--color-accent)]">
                              {(item.full_name || "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--color-heading)]">
                              {item.full_name || "Unnamed Admin"}
                            </p>
                            <p className="text-xs text-[var(--color-muted)]">
                              {item.hospitals?.official_email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Hospital */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={14} className="text-[var(--color-accent)] flex-shrink-0" />
                          <span className="text-sm font-semibold text-[var(--color-heading)]">
                            {item.hospitals?.name}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[var(--color-accent)] flex-shrink-0" />
                          <span className="text-sm text-[var(--color-body)]">
                            {item.hospitals?.locations
                              ? `${item.hospitals.locations.city}, ${item.hospitals.locations.state}`
                              : "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              item.hospitals &&
                              handleApprove(item.id, item.hospitals.id, item.hospitals.name)
                            }
                            disabled={!!loadingId}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          >
                            {loadingId === item.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              item.hospitals &&
                              handleReject(item.id, item.hospitals.id, item.hospitals.name)
                            }
                            disabled={!!loadingId}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-[var(--color-error)] border border-red-200 hover:bg-[var(--color-error)] hover:text-white hover:border-[var(--color-error)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          >
                            <Trash2 size={13} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[var(--color-border)]/60">
              {data.map((item) => (
                <div key={item.id} className="p-5 space-y-4">
                  {/* Admin + hospital row */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-black text-[var(--color-accent)]">
                        {(item.full_name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--color-heading)] truncate">
                        {item.full_name || "Unnamed Admin"}
                      </p>
                      <p className="text-xs text-[var(--color-muted)] truncate">
                        {item.hospitals?.official_email}
                      </p>
                    </div>
                  </div>

                  {/* Hospital + location */}
                  <div className="flex flex-col gap-1.5 px-3 py-3 bg-[var(--color-badge-bg)] rounded-xl border border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <Building2 size={13} className="text-[var(--color-accent)] flex-shrink-0" />
                      <span className="text-sm font-semibold text-[var(--color-heading)] truncate">
                        {item.hospitals?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-[var(--color-muted)] flex-shrink-0" />
                      <span className="text-xs text-[var(--color-muted)]">
                        {item.hospitals?.locations
                          ? `${item.hospitals.locations.city}, ${item.hospitals.locations.state}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        item.hospitals &&
                        handleApprove(item.id, item.hospitals.id, item.hospitals.name)
                      }
                      disabled={!!loadingId}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-40 transition-all"
                    >
                      {loadingId === item.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={13} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        item.hospitals &&
                        handleReject(item.id, item.hospitals.id, item.hospitals.name)
                      }
                      disabled={!!loadingId}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-[var(--color-error)] border border-red-200 hover:bg-[var(--color-error)] hover:text-white hover:border-[var(--color-error)] disabled:opacity-40 transition-all"
                    >
                      <Trash2 size={13} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-2xl border border-[var(--color-border)] px-5 py-4">
          <p className="text-sm font-semibold text-[var(--color-muted)]">
            Showing{" "}
            <span className="font-black text-[var(--color-heading)]">{data.length}</span>{" "}
            of{" "}
            <span className="font-black text-[var(--color-heading)]">{totalCount}</span>{" "}
            applications
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateFilters("page", String(currentPage - 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[var(--color-border)] rounded-xl text-sm font-bold text-[var(--color-heading)] hover:bg-[var(--color-badge-bg)] hover:border-[var(--color-accent)]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} /> Prev
            </button>

            <span className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white text-sm font-black min-w-[2.5rem] text-center">
              {currentPage}
            </span>

            {totalPages > 1 && (
              <span className="text-xs text-[var(--color-muted)] font-semibold">
                of {totalPages}
              </span>
            )}

            <button
              onClick={() => updateFilters("page", String(currentPage + 1))}
              disabled={currentPage * pageSize >= totalCount}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[var(--color-border)] rounded-xl text-sm font-bold text-[var(--color-heading)] hover:bg-[var(--color-badge-bg)] hover:border-[var(--color-accent)]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}