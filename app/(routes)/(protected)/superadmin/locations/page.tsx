import { getLocations } from "@/actions/superadmin/locations";
import { Plus, MapPin } from "lucide-react";
import Link from "next/link";
import LocationTable from "@/components/superadmin/LocationsTable";

export default async function LocationsPage() {
  const response = await getLocations();
  const locations = response.success ? response.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hospital Locations
          </h1>
          <p className="text-slate-500 text-sm">
            Manage the cities and states where hospital registration is
            permitted.
          </p>
        </div>

        <Link
          href="/superadmin/locations/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Location
        </Link>
      </div>

      {/* Statistics / Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Cities
            </p>
            <p className="text-xl font-bold text-slate-900">
              {locations.length}
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <LocationTable initialData={locations} />
      </div>
    </div>
  );
}
