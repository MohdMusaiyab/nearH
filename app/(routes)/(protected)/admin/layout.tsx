import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getAuthenticatedProfile } from "@/utils/authCache";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getAuthenticatedProfile();

  if (!profile || profile.role !== "admin" || profile.status !== "approved") {
    redirect("/");
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 pt-20 lg:pt-24">
      <AdminSidebar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
