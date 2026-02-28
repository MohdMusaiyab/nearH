import { getHospitalDoctors } from "@/actions/admin/doctor";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import DoctorTable from "@/components/admin/DoctorTable";

export default async function DoctorsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page, search } = await searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(page) || 1;

  const res = await getHospitalDoctors({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: search,
  });

  const doctors = res.data?.doctors || [];
  const totalCount = res.data?.totalCount || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-heading tracking-tight">
              Medical Staff
            </h1>
            <p className="text-muted text-sm font-medium">
              Manage doctor profiles, specialties, and hospital availability.
            </p>
          </div>
        </div>
        <Link
          href="/admin/doctors/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-accent-hover transition-all shadow-sm active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Doctor
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <DoctorTable initialData={doctors} totalCount={totalCount} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
