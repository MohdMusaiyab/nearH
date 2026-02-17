import { getExploreHospitals } from "@/actions/shared/getAllHospitals";
import { getExploreFilters } from "@/actions/shared/filter";
import ExploreClient from "@/components/shared/ExploreClient";

export default async function Page() {
  // Parallel fetch: Initial 20 hospitals + all dropdown options
  const [hospitalsRes, filtersRes] = await Promise.all([
    getExploreHospitals({ page: 1 }),
    getExploreFilters(),
  ]);

  return (
    <ExploreClient
      initialData={hospitalsRes.data?.hospitals ?? []}
      totalCount={hospitalsRes.data?.totalCount ?? 0}
      filters={
        filtersRes.data ?? { locations: [], specialties: [], services: [] }
      }
    />
  );
}
