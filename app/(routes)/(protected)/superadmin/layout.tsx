import React from "react";
import SuperAdminSidebar from "@/components/superadmin/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
      pt-20 lg:pt-24 — pushes the entire layout body below the fixed global Navigation.
      The sidebar uses sticky top-24 so it also starts cleanly below the nav on desktop.
    */
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 pt-20 lg:pt-24">
      <SuperAdminSidebar />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <div className="p-4 md:p-6 lg:p-10 mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
