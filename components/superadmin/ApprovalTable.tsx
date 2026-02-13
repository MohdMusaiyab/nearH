"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  approveHospital,
  rejectAndPurgeUser,
} from "@/actions/superadmin/approval";
import {
  Search,
  MapPin,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { ApprovalsTableProps } from "@/types/approvals";
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

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleAction = async (
    action: "approve" | "reject",
    profileId: string,
    hospitalId: string,
  ) => {
    if (
      action === "reject" &&
      !confirm("Are you sure? This will PERMANENTLY delete all hospital data.")
    )
      return;

    setLoadingId(profileId);
    const res =
      action === "approve"
        ? await approveHospital(profileId, hospitalId)
        : await rejectAndPurgeUser(profileId, hospitalId);

    if (res.success) {
      router.refresh();
    } else {
      alert(res.message);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            onChange={(e) => updateFilters("search", e.target.value)}
            defaultValue={searchParams.get("search") || ""}
            placeholder="Search by admin name..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
          />
        </div>

        <select
          onChange={(e) => updateFilters("location", e.target.value)}
          defaultValue={searchParams.get("location") || ""}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.city}, {loc.state}
            </option>
          ))}
        </select>
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Admin & Hospital
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-400">
                    No pending applications found.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">
                        {item.full_name || "Unnamed Admin"}
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        {item.hospitals?.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.hospitals?.official_email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {item.hospitals?.locations
                          ? `${item.hospitals.locations.city}, ${item.hospitals.locations.state}`
                          : "N/A"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            item.hospitals &&
                            handleAction("approve", item.id, item.hospitals.id)
                          }
                          disabled={!!loadingId}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 font-medium text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            item.hospitals &&
                            handleAction("reject", item.id, item.hospitals.id)
                          }
                          disabled={!!loadingId}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 font-medium text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      <div className="flex items-center justify-between px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500 font-medium">
          Showing <span className="text-slate-900">{data.length}</span> of{" "}
          <span className="text-slate-900">{totalCount}</span> applications
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateFilters("page", String(currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="text-sm font-semibold text-slate-700">
            Page {currentPage}
          </span>
          <button
            onClick={() => updateFilters("page", String(currentPage + 1))}
            disabled={currentPage * pageSize >= totalCount}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
