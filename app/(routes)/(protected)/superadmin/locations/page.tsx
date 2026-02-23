import { getLocations } from "@/actions/superadmin/locations";
import { Plus, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import LocationTable from "@/components/superadmin/LocationsTable";

export default async function LocationsPage() {
  const response = await getLocations();
  const locations = response.success ? response.data || [] : [];

  // Derive unique states count
  const uniqueStates = new Set(locations.map((l) => l.state)).size;

  return (
    <div className="min-h-screen bg-slate-50 space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/25 flex-shrink-0">
            <MapPin size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-heading)] tracking-tight leading-none">
              Locations
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">
              Manage cities & states where hospital registration is permitted
            </p>
          </div>
        </div>

        <Link
          href="/superadmin/locations/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-xl text-sm font-bold hover:bg-[var(--color-accent-hover)] transition-all shadow-md shadow-[var(--color-accent)]/25 active:scale-95 self-start sm:self-auto flex-shrink-0"
        >
          <Plus size={16} />
          Add Location
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--color-border)]" />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">
              Total Cities
            </p>
            <p className="text-2xl font-black text-[var(--color-heading)] tabular-nums leading-tight">
              {locations.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
            <Globe size={18} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">
              States Covered
            </p>
            <p className="text-2xl font-black text-[var(--color-heading)] tabular-nums leading-tight">
              {uniqueStates}
            </p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <LocationTable initialData={locations} />
      </div>
    </div>
  );
}
