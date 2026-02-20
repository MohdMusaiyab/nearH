import { getDashboardData } from "@/actions/admin/dashboard";
import RealtimeDashboard from "@/components/admin/RealtimeDashboard";

export default async function AdminDashboardPage() {
  const { data } = await getDashboardData();
  

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
        hospitalId={data?.inventory?.hospital_id || ""}
      />
    </div>
  );
}
