import { getMasterServices } from "@/actions/superadmin/services";
import { Plus } from "lucide-react";
import Link from "next/link";
import ServiceTable from "@/components/superadmin/ServiceTable";

export default async function ServicesPage() {
  const response = await getMasterServices();
  const services = response.success ? response.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Catalog</h1>
          <p className="text-slate-500 text-sm">
            Define global medical services available for hospitals to offer.
          </p>
        </div>
        <Link
          href="/superadmin/services/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <ServiceTable initialData={services} />
      </div>
    </div>
  );
}
