// app/superadmin/dashboard/page.tsx
import { getSuperAdminDashboard } from "@/actions/superadmin/dashboard";
import SuperAdminDashboardClient from "@/components/superadmin/SuperAdminDashboardClient";
import { redirect } from "next/navigation";

export default async function SuperAdminDashboardPage() {
  const result = await getSuperAdminDashboard();
  if (!result.success || !result.data) redirect("/unauthorized");
  return <SuperAdminDashboardClient data={result.data} />;
}
