"use client";

import { SuperadminReferral } from "@/actions/superadmin/referrals";
import {
  MapPin,
  ArrowRight,
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
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

export default function SuperadminReferralClient({
  initialReferrals,
  totalCount,
  currentPage,
}: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / 10);

  const statusColors: Record<Status, string> = {
    Pending: "text-amber-600 bg-amber-50",
    Accepted: "text-green-600 bg-green-50",
    Rejected: "text-red-600 bg-red-50",
    Completed: "text-blue-600 bg-blue-50",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Patient
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Route (Source → Destination)
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Priority
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {initialReferrals.map((ref) => (
                <tr
                  key={ref.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {ref.patient_name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {ref.patient_age}y • {ref.patient_gender}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="text-xs">
                        <p className="font-bold text-slate-700">
                          {ref.from_hospital?.name}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" />{" "}
                          {ref.from_hospital?.location?.city}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                      <div className="text-xs">
                        <p className="font-bold text-slate-700">
                          {ref.to_hospital?.name}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" />{" "}
                          {ref.to_hospital?.location?.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusColors[ref.status || "Pending"]}`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${ref.priority === "Critical" ? "bg-red-500" : "bg-blue-400"}`}
                      />
                      <span className="text-xs font-bold text-slate-600">
                        {ref.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      href={`/shared/referral/${ref.id}`}
                      className="inline-flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex justify-between items-center px-4">
        <p className="text-xs font-bold text-slate-400">
          Showing{" "}
          <span className="text-slate-900">{(currentPage - 1) * 10 + 1}</span>{" "}
          to{" "}
          <span className="text-slate-900">
            {Math.min(currentPage * 10, totalCount)}
          </span>{" "}
          of {totalCount}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => router.push(`?page=${currentPage - 1}`)}
            className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => router.push(`?page=${currentPage + 1}`)}
            className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
