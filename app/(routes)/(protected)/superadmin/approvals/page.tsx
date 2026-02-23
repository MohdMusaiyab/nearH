import { createClient } from "@/lib/supabase/server";
import ApprovalsTable from "@/components/superadmin/ApprovalTable";
import { Suspense } from "react";
import { ProfileWithHospital } from "@/types/approvals";
import { UserCheck, Clock } from "lucide-react";

export default async function ApprovalsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; location?: string }>;
}) {
  const supabase = await createClient();
  const { page, search, location } = await searchParams;

  const PAGE_SIZE = 20;
  const currentPage = Number(page) || 1;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("profiles")
    .select(
      `
      id, 
      full_name, 
      status,
      hospitals!inner (
        id, 
        name, 
        official_email, 
        location_id,
        locations (id, city, state, created_at)
      )
    `,
      { count: "exact" },
    )
    .eq("status", "pending")
    .range(from, to);

  if (search) query = query.ilike("full_name", `%${search}%`);
  if (location) query = query.eq("hospitals.location_id", location);

  const { data, count, error } = await query;

  if (error) console.error("Supabase Query Error:", error.message);

  const { data: locationsData } = await supabase
    .from("locations")
    .select("*")
    .order("city");

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page header ── */}
      <div className="mb-8">

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/25 flex-shrink-0">
              <UserCheck size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--color-heading)] tracking-tight leading-none">
                Pending Approvals
              </h1>
              <p className="text-sm text-[var(--color-muted)] mt-0.5">
                Review and verify hospital admin access requests
              </p>
            </div>
          </div>

          {/* Live count badge */}
          {(count ?? 0) > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 self-start sm:self-auto">
              <Clock size={14} className="text-amber-600 flex-shrink-0" />
              <span className="text-xs font-bold text-amber-700 whitespace-nowrap">
                {count} request{count !== 1 ? "s" : ""} awaiting review
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-border)]" />
      </div>

      {/* ── Table ── */}
      <Suspense
        fallback={
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-16 text-center">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-3 animate-pulse">
              <UserCheck size={18} className="text-[var(--color-muted)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-muted)] animate-pulse">
              Loading applications…
            </p>
          </div>
        }
      >
        <ApprovalsTable
          data={(data as unknown as ProfileWithHospital[]) || []}
          locations={locationsData || []}
          totalCount={count || 0}
          pageSize={PAGE_SIZE}
        />
      </Suspense>
    </div>
  );
}