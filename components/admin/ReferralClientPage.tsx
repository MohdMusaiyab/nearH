"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { type ReferralWithDetails } from "@/actions/admin/referrals";
import ReferralCard from "./ReferralCard";
import { Plus, Inbox, Send, ChevronLeft, ChevronRight } from "lucide-react";
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
        { event: "*", schema: "public", table: "referrals" },
        () => {
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

  const totalCount = referrals.filter((r) => r.direction === activeTab).length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const updateFilters = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value.toString());
    if (key === "type") params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* ── Filter & Action Bar ── */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-3 rounded-2xl border border-border shadow-sm">
        <div className="flex p-1 bg-badge-bg/50 rounded-xl w-full md:w-auto">
          {[
            { id: "inbound", label: "Inbound", icon: Inbox },
            { id: "outbound", label: "Outbound", icon: Send },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => updateFilters("type", tab.id)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? "bg-white text-accent shadow-sm border border-border"
                  : "text-muted hover:text-heading"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href="/admin/referrals/new"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> New Referral
        </Link>
      </div>

      {/* ── Cards List ── */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-border border-dashed">
            <div className="w-16 h-16 bg-badge-bg rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "inbound" ? (
                <Inbox className="text-muted" />
              ) : (
                <Send className="text-muted" />
              )}
            </div>
            <p className="text-heading font-black text-sm uppercase tracking-tight">
              No {activeTab} referrals
            </p>
            <p className="text-muted text-xs mt-1">
              Incoming and outgoing patient transfers will appear here.
            </p>
          </div>
        ) : (
          filteredData.map((ref) => (
            <Link key={ref.id} href={`/shared/referrals/${ref.id}`}>
              <ReferralCard referral={ref} />
            </Link>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => updateFilters("page", currentPage - 1)}
            className="p-2.5 rounded-xl border border-border bg-white text-muted hover:text-accent disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="px-6 py-2 rounded-xl bg-white border border-border text-xs font-black text-heading shadow-sm">
            {currentPage}{" "}
            <span className="text-muted mx-1">/</span>{" "}
            {totalPages}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => updateFilters("page", currentPage + 1)}
            className="p-2.5 rounded-xl border border-border bg-white text-muted hover:text-accent disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
