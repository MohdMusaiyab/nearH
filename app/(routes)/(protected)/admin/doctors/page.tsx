import { getHospitalDoctors } from "@/actions/admin/doctor";
import { Plus } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Staff</h1>
          <p className="text-slate-500 text-sm">
            Manage doctor profiles, schedules, and OPD availability.
          </p>
        </div>
        <Link
          href="/admin/doctors/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Doctor
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <DoctorTable
          initialData={doctors}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}
