import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <div className="p-4 md:p-6 lg:p-8 mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
