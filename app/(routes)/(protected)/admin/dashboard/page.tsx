import { getDashboardData } from "@/actions/admin/dashboard";
import RealtimeDashboard from "@/components/admin/RealtimeDashboard";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const { data } = await getDashboardData();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("associated_hospital_id")
    .eq("id", user?.id || "")
    .single();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Command Center
        </h1>
        <p className="text-slate-500">
          Live monitoring and resource management.
        </p>
      </div>

      <RealtimeDashboard
        initialInventory={data?.inventory || null}
        initialBloodBank={data?.bloodBank || []}
        hospitalId={profile?.associated_hospital_id || ""}
      />
    </div>
  );
}
