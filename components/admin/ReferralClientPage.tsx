"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type ReferralWithDetails } from "@/actions/admin/referrals";
import ReferralCard from "./ReferralCard";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  initialData: ReferralWithDetails[];
  hospitalId: string;
}

export default function ReferralClientPage({ initialData, hospitalId }: Props) {
  const [referrals, setReferrals] =
    useState<ReferralWithDetails[]>(initialData);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const activeTab = searchParams.get("type") || "inbound";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = 5;

  useEffect(() => {
    const channel = supabase
      .channel("referral-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "referrals",
        },
        async () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [hospitalId, supabase, router]);
  useEffect(() => {
    setReferrals(initialData);
  }, [initialData]);

  const filteredData = useMemo(() => {
    const filtered = referrals.filter((r) => r.direction === activeTab);
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [referrals, activeTab, currentPage]);

  const totalPages = Math.ceil(
    referrals.filter((r) => r.direction === activeTab).length / pageSize,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl border border-slate-200">
        <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          {["inbound", "outbound"].map((tab) => (
            <button
              key={tab}
              onClick={() => router.push(`?type=${tab}&page=1`)}
              className={`flex-1 sm:flex-none px-8 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Link
          href="/admin/referrals/new"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="w-4 h-4" /> New Referral
        </Link>
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2rem] border border-slate-200 border-dashed">
            <p className="text-slate-400 font-medium">
              No {activeTab} referrals found.
            </p>
          </div>
        ) : (
          filteredData.map((ref) => (
            <ReferralCard key={ref.id} referral={ref} />
          ))
        )}
      </div>

      {}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => router.push(`?type=${activeTab}&page=${i + 1}`)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                currentPage === i + 1
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
