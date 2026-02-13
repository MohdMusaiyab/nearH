import { createClient } from "@/lib/supabase/server";
import ApprovalsTable from "@/components/superadmin/ApprovalTable";
import { Suspense } from "react";
import { ProfileWithHospital } from "@/types/approvals";

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

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }

  if (location) {
    query = query.eq("hospitals.location_id", location);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Supabase Query Error:", error.message);
  }

  const { data: locationsData } = await supabase
    .from("locations")
    .select("*")
    .order("city");

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Pending Approvals
          </h1>
          <p className="text-slate-500 mt-1">
            Review and verify hospital administrative access requests.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="animate-pulse py-20 text-center text-slate-400">
              Loading Applications...
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
    </div>
  );
}
