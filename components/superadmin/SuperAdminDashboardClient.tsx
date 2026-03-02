"use client";

import { useState } from "react";
import {
  type SuperAdminDashboardData,
  type HospitalListItem,
  type RecentReferralItem,
  type PendingAdminItem,
  type MonthlyGrowthPoint,
  type BedOccupancyPoint,
} from "@/actions/superadmin/dashboard";
import { SortAscIcon } from "lucide-react";

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color: "blue" | "green" | "amber" | "red" | "violet" | "cyan";
  icon: React.ReactNode;
}

const COLOR_MAP: Record<
  StatCardProps["color"],
  { wrap: string; icon: string; value: string; dot: string }
> = {
  blue: {
    wrap: "bg-badge-bg border-border",
    icon: "bg-accent/10 text-accent",
    value: "text-accent",
    dot: "bg-accent",
  },
  green: {
    wrap: "bg-emerald-50 border-emerald-200",
    icon: "bg-emerald-100 text-emerald-600",
    value: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  amber: {
    wrap: "bg-amber-50 border-amber-200",
    icon: "bg-amber-100 text-amber-600",
    value: "text-amber-700",
    dot: "bg-amber-500",
  },
  red: {
    wrap: "bg-red-50 border-error/20",
    icon: "bg-red-100 text-error",
    value: "text-error",
    dot: "bg-error",
  },
  violet: {
    wrap: "bg-violet-50 border-violet-200",
    icon: "bg-violet-100 text-violet-600",
    value: "text-violet-700",
    dot: "bg-violet-500",
  },
  cyan: {
    wrap: "bg-cyan-50 border-cyan-200",
    icon: "bg-cyan-100 text-cyan-600",
    value: "text-cyan-700",
    dot: "bg-cyan-500",
  },
};

function StatCard({ label, value, sub, color, icon }: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div
      className={`${c.wrap} border rounded-2xl p-4 md:p-5 flex items-start gap-4 hover:shadow-md transition-shadow`}
    >
      <div className={`${c.icon} rounded-xl p-2.5 flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">
          {label}
        </p>
        <p
          className={`text-2xl md:text-3xl font-black ${c.value} leading-none tabular-nums`}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-muted mt-1.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
        <h2 className="text-sm font-bold text-heading tracking-tight">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

type PriorityLevel = "Routine" | "Urgent" | "Critical";
type ReferralStatus = "Pending" | "Accepted" | "Rejected" | "Completed";

const PRIORITY_STYLES: Record<PriorityLevel, string> = {
  Routine: "bg-slate-100 text-slate-600",
  Urgent: "bg-amber-100 text-amber-700",
  Critical: "bg-red-100 text-error",
};
const STATUS_STYLES: Record<ReferralStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-error",
  Completed: "bg-badge-bg text-badge-text",
};

function Badge({
  label,
  variant,
}: {
  label: string;
  variant: "priority" | "status";
}) {
  const cls =
    variant === "priority"
      ? (PRIORITY_STYLES[label as PriorityLevel] ??
        "bg-slate-100 text-slate-600")
      : (STATUS_STYLES[label as ReferralStatus] ??
        "bg-slate-100 text-slate-600");
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

function GrowthChart({ data }: { data: MonthlyGrowthPoint[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="px-5 py-5">
      <div className="flex items-end gap-1.5 md:gap-2 h-24 md:h-28">
        {data.map((point) => {
          const pct = Math.max(
            (point.count / max) * 100,
            point.count > 0 ? 8 : 2,
          );
          return (
            <div
              key={point.month}
              className="flex-1 flex flex-col items-center gap-1.5 group relative"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-heading text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {point.count} hospital{point.count !== 1 ? "s" : ""}
              </div>
              <div
                className="w-full rounded-t-lg bg-accent group-hover:bg-accent-hover transition-colors"
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 md:gap-2 mt-2">
        {data.map((point) => (
          <div
            key={point.month}
            className="flex-1 text-center text-[9px] md:text-[10px] text-muted font-medium truncate"
          >
            {point.month}
          </div>
        ))}
      </div>
    </div>
  );
}

function OccupancyChart({ data }: { data: BedOccupancyPoint[] }) {
  if (!data.length) return <EmptyState message="No occupancy data available" />;
  return (
    <div className="px-5 py-5 space-y-3">
      {data.map((item) => {
        const color =
          item.occupancyPercent >= 90
            ? "bg-error"
            : item.occupancyPercent >= 70
              ? "bg-warning"
              : "bg-success";
        return (
          <div key={item.hospital}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-body truncate max-w-[65%]">
                {item.hospital}
              </span>
              <span className="text-xs font-bold text-heading">
                {item.occupancyPercent}%
              </span>
            </div>
            <div className="h-2 bg-badge-bg rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${color}`}
                style={{ width: `${item.occupancyPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReferralsTable({ referrals }: { referrals: RecentReferralItem[] }) {
  if (!referrals.length) return <EmptyState message="No referrals yet" />;
  return (
    <>
      {}
      <div className="divide-y divide-border md:hidden">
        {referrals.map((r) => (
          <div key={r.id} className="px-5 py-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm text-heading">
                {r.patientName}
              </p>
              <span className="text-xs text-muted flex-shrink-0">
                {formatRelativeTime(r.createdAt)}
              </span>
            </div>
            <p className="text-xs text-body">
              <span className="font-medium">{r.fromHospital ?? "—"}</span>
              <span className="mx-1.5 text-muted">→</span>
              <span className="font-medium">{r.toHospital ?? "—"}</span>
            </p>
            <div className="flex gap-2">
              {r.priority && <Badge label={r.priority} variant="priority" />}
              {r.status && <Badge label={r.status} variant="status" />}
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-badge-bg/40">
              {["Patient", "From → To", "Priority", "Status", "When"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider ${i === 4 ? "text-right hidden lg:table-cell" : ""} ${i === 1 ? "hidden lg:table-cell" : ""}`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {referrals.map((r) => (
              <tr key={r.id} className="hover:bg-badge-bg/40 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-heading">
                  {r.patientName}
                </td>
                <td className="px-5 py-3.5 text-body hidden lg:table-cell">
                  <span className="font-medium">{r.fromHospital ?? "—"}</span>
                  <span className="mx-1.5 text-muted">→</span>
                  <span className="font-medium">{r.toHospital ?? "—"}</span>
                </td>
                <td className="px-5 py-3.5">
                  {r.priority ? (
                    <Badge label={r.priority} variant="priority" />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {r.status ? (
                    <Badge label={r.status} variant="status" />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right text-xs text-muted hidden lg:table-cell">
                  {formatRelativeTime(r.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PendingAdminsList({ admins }: { admins: PendingAdminItem[] }) {
  if (!admins.length)
    return <EmptyState message="No pending admin approvals" />;
  return (
    <ul className="divide-y divide-border/50">
      {admins.map((admin) => (
        <li
          key={admin.id}
          className="px-5 py-4 flex items-center gap-3 hover:bg-badge-bg/40 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-badge-bg border border-border flex items-center justify-center flex-shrink-0">
            <span className="text-accent font-bold text-sm">
              {(admin.name ?? admin.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-heading truncate">
              {admin.name ?? "Unnamed"}
            </p>
            <p className="text-xs text-muted truncate">{admin.email}</p>
            {admin.hospitalName && (
              <p className="text-xs text-accent font-medium truncate mt-0.5">
                🏥 {admin.hospitalName}
              </p>
            )}
          </div>
          <span className="text-xs text-muted flex-shrink-0">
            {formatRelativeTime(admin.requestedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}

type SortKey = "name" | "bedsAvailable" | "icuAvailable" | "adminCount";
type SortDir = "asc" | "desc";

function HospitalsTable({ hospitals }: { hospitals: HospitalListItem[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "verified"
  >("all");

  const toggle = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = hospitals
    .filter((h) => {
      const matchSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? h.isActive
            : statusFilter === "inactive"
              ? !h.isActive
              : h.isVerified;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "bedsAvailable")
        cmp = a.metrics.bedsAvailable - b.metrics.bedsAvailable;
      else if (sortKey === "icuAvailable")
        cmp = a.metrics.icuAvailable - b.metrics.icuAvailable;
      else if (sortKey === "adminCount") cmp = a.adminCount - b.adminCount;
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div>
      {}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search hospitals or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-body placeholder:text-muted bg-white"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "active", "inactive", "verified"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors ${
                statusFilter === f
                  ? "bg-accent text-white"
                  : "bg-badge-bg text-body hover:bg-border"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="text-xs text-muted self-center ml-1">
            {filtered.length}/{hospitals.length}
          </span>
        </div>
      </div>

      {}
      {filtered.length === 0 ? (
        <EmptyState message="No hospitals match your filters" />
      ) : (
        <>
          <div className="divide-y divide-border/50 md:hidden">
            {filtered.map((h) => (
              <div key={h.id} className="px-5 py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm text-heading">{h.name}</p>
                    <p className="text-xs text-muted mt-0.5">{h.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${h.isActive ? "text-emerald-700" : "text-error"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${h.isActive ? "bg-emerald-500" : "bg-error"}`}
                      />
                      {h.isActive ? "Active" : "Inactive"}
                    </span>
                    {h.isVerified && (
                      <span className="text-xs font-semibold text-accent">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted">
                  <span>
                    🛏{" "}
                    <span className="font-semibold text-body">
                      {h.metrics.bedsAvailable}
                    </span>{" "}
                    beds
                  </span>
                  <span>
                    🏥{" "}
                    <span className="font-semibold text-body">
                      {h.metrics.icuAvailable}
                    </span>{" "}
                    ICU
                  </span>
                  <span>
                    👤{" "}
                    <span className="font-semibold text-body">
                      {h.adminCount}
                    </span>{" "}
                    admins
                  </span>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-badge-bg/40">
                  <th
                    className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider cursor-pointer hover:text-heading select-none"
                    onClick={() => toggle("name")}
                  >
                    Hospital <SortAscIcon k="name" />
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="text-center px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider cursor-pointer hover:text-heading select-none hidden lg:table-cell"
                    onClick={() => toggle("bedsAvailable")}
                  >
                    Beds <SortAscIcon k="bedsAvailable" />
                  </th>
                  <th
                    className="text-center px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider cursor-pointer hover:text-heading select-none hidden lg:table-cell"
                    onClick={() => toggle("icuAvailable")}
                  >
                    ICU <SortAscIcon k="icuAvailable" />
                  </th>
                  <th
                    className="text-center px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider cursor-pointer hover:text-heading select-none hidden xl:table-cell"
                    onClick={() => toggle("adminCount")}
                  >
                    Admins <SortAscIcon k="adminCount" />
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider hidden xl:table-cell">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((h) => (
                  <tr
                    key={h.id}
                    className="hover:bg-badge-bg/40 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-heading truncate max-w-[200px]">
                        {h.name}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {h.metrics.bloodGroupsOnFile} blood group
                        {h.metrics.bloodGroupsOnFile !== 1 ? "s" : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-body hidden lg:table-cell">
                      {h.location}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${h.isActive ? "text-emerald-700" : "text-error"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${h.isActive ? "bg-emerald-500" : "bg-error"}`}
                          />
                          {h.isActive ? "Active" : "Inactive"}
                        </span>
                        {h.isVerified ? (
                          <span className="text-xs font-semibold text-accent">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="text-xs text-muted">Unverified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center hidden lg:table-cell">
                      <span className="font-bold text-heading">
                        {h.metrics.bedsAvailable}
                      </span>
                      <span className="text-muted text-xs"> avail</span>
                    </td>
                    <td className="px-5 py-4 text-center hidden lg:table-cell">
                      <span className="font-bold text-heading">
                        {h.metrics.icuAvailable}
                      </span>
                      <span className="text-muted text-xs"> avail</span>
                    </td>
                    <td className="px-5 py-4 text-center hidden xl:table-cell">
                      <span className="font-bold text-heading">
                        {h.adminCount}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-xs text-muted hidden xl:table-cell">
                      {formatDate(h.lastUpdated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-badge-bg border border-border flex items-center justify-center mx-auto mb-3">
        <svg
          className="w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

type TabId = "overview" | "hospitals" | "referrals" | "admins";

interface SuperAdminDashboardClientProps {
  data: SuperAdminDashboardData;
}

export default function SuperAdminDashboardClient({
  data,
}: SuperAdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { overview, recentActivity, charts, hospitals } = data;

  const tabs: { id: TabId; label: string; badge?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "hospitals", label: "Hospitals", badge: overview.totalHospitals },
    {
      id: "referrals",
      label: "Referrals",
      badge:
        overview.pendingReferrals > 0 ? overview.pendingReferrals : undefined,
    },
    {
      id: "admins",
      label: "Pending",
      badge:
        overview.pendingAdminApprovals > 0
          ? overview.pendingAdminApprovals
          : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-black text-heading tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted mt-0.5">
              System-wide overview & management
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">Live</span>
          </div>
        </div>

        {}
        <div className="flex gap-1 border-b border-border overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap -mb-px ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-heading hover:border-border"
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 rounded-full text-xs font-bold px-1.5 ${
                    activeTab === tab.id
                      ? "bg-badge-bg text-accent"
                      : "bg-slate-100 text-muted"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="space-y-6">
        {}
        {activeTab === "overview" && (
          <>
            {}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <StatCard
                label="Total Hospitals"
                value={overview.totalHospitals}
                sub={`${overview.activeHospitals} active · ${overview.verifiedHospitals} verified`}
                color="blue"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Pending Approvals"
                value={overview.pendingAdminApprovals}
                sub="Admin requests awaiting review"
                color={overview.pendingAdminApprovals > 0 ? "amber" : "blue"}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Total Admins"
                value={overview.totalAdmins}
                sub="Across all hospitals"
                color="violet"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Total Referrals"
                value={overview.totalReferrals}
                sub={`${overview.pendingReferrals} pending`}
                color={overview.pendingReferrals > 0 ? "amber" : "blue"}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Beds Available"
                value={overview.totalBedsAvailable}
                sub="System-wide"
                color="green"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                }
              />
              <StatCard
                label="ICU Available"
                value={overview.totalIcuAvailable}
                sub="System-wide ICU beds"
                color="cyan"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Active Hospitals"
                value={overview.activeHospitals}
                sub={`${overview.totalHospitals - overview.activeHospitals} inactive`}
                color="green"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                label="Verified Hospitals"
                value={overview.verifiedHospitals}
                sub={`${overview.totalHospitals - overview.verifiedHospitals} unverified`}
                color="blue"
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                }
              />
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Section title="Hospital Registrations (Last 6 Months)">
                <GrowthChart data={charts.hospitalGrowth} />
              </Section>
              <Section title="Bed Occupancy by Hospital">
                <OccupancyChart data={charts.bedOccupancy} />
              </Section>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Section title="Recently Registered Hospitals">
                {recentActivity.newHospitals.length === 0 ? (
                  <EmptyState message="No hospitals registered yet" />
                ) : (
                  <ul className="divide-y divide-border/50">
                    {recentActivity.newHospitals.map((h) => (
                      <li
                        key={h.id}
                        className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-badge-bg/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-heading truncate">
                            {h.name}
                          </p>
                          <p className="text-xs text-muted mt-0.5">
                            {h.location}
                          </p>
                        </div>
                        <span className="text-xs text-muted flex-shrink-0">
                          {formatRelativeTime(h.joinedAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section
                title="Recent Referrals"
                action={
                  overview.pendingReferrals > 0 ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                      {overview.pendingReferrals} pending
                    </span>
                  ) : undefined
                }
              >
                <ReferralsTable
                  referrals={recentActivity.recentReferrals.slice(0, 5)}
                />
              </Section>
            </div>
          </>
        )}

        {}
        {activeTab === "hospitals" && (
          <Section title="All Hospitals">
            <HospitalsTable hospitals={hospitals} />
          </Section>
        )}

        {}
        {activeTab === "referrals" && (
          <Section
            title="All Recent Referrals"
            action={
              overview.pendingReferrals > 0 ? (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                  {overview.pendingReferrals} pending
                </span>
              ) : undefined
            }
          >
            <ReferralsTable referrals={recentActivity.recentReferrals} />
          </Section>
        )}

        {}
        {activeTab === "admins" && (
          <Section
            title="Pending Admin Approvals"
            action={
              overview.pendingAdminApprovals > 0 ? (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
                  {overview.pendingAdminApprovals} awaiting
                </span>
              ) : undefined
            }
          >
            <PendingAdminsList admins={recentActivity.pendingAdmins} />
          </Section>
        )}
      </div>
    </div>
  );
}
