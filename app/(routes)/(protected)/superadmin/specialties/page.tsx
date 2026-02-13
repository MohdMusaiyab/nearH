import { getSpecialties } from "@/actions/superadmin/speciality";
import { Plus } from "lucide-react";
import Link from "next/link";
import SpecialtyTable from "@/components/superadmin/SpecialtyTable";

export default async function SpecialtiesPage() {
  const response = await getSpecialties();
  const specialties = response.success ? response.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">
            Medical Specialties
          </h1>
          <p className="text-slate-500 text-sm">
            Define the master list of clinical departments and doctor expertise.
          </p>
        </div>
        <Link
          href="/superadmin/specialties/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Specialty
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <SpecialtyTable initialData={specialties} />
      </div>
    </div>
  );
}
