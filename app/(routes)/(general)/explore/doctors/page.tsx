import { getDoctorDirectory } from "@/actions/shared/getAllDoctors";
import { getExploreFilters } from "@/actions/shared/filter";
import DoctorDirectoryClient from "@/components/shared/DoctorDirectoryClient";

export default async function DoctorDirectoryPage() {
  const [doctorsRes, filtersRes] = await Promise.all([
    getDoctorDirectory({ page: 1 }),
    getExploreFilters(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50/50">
      <DoctorDirectoryClient
        initialDoctors={doctorsRes.data?.doctors ?? []}
        totalCount={doctorsRes.data?.totalCount ?? 0}
        specialties={filtersRes.data?.specialties ?? []}
      />
    </main>
  );
}
