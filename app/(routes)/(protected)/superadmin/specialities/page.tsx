import { getSpecialties } from "@/actions/superadmin/speciality";
import { Plus, Award, LayoutList } from "lucide-react";
import Link from "next/link";
import SpecialtyTable from "@/components/superadmin/SpecialtyTable";

export default async function SpecialtiesPage() {
  const response = await getSpecialties();
  const specialties = response.success ? response.data || [] : [];

  return (
    <div className="min-h-screen bg-slate-50 space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/25 flex-shrink-0">
            <Award size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-heading)] tracking-tight leading-none">
              Medical Specialties
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">
              Define clinical departments and doctor expertise
            </p>
          </div>
        </div>

        <Link
          href="/superadmin/specialties/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-xl text-sm font-bold hover:bg-[var(--color-accent-hover)] transition-all shadow-md shadow-[var(--color-accent)]/25 active:scale-95 self-start sm:self-auto flex-shrink-0"
        >
          <Plus size={16} />
          Add Specialty
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-[var(--color-border)]" />

      {/* ── Stat card ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
            <LayoutList size={18} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-widest">
              Total Specialties
            </p>
            <p className="text-2xl font-black text-[var(--color-heading)] tabular-nums leading-tight">
              {specialties.length}
            </p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <SpecialtyTable initialData={specialties} />
      </div>
    </div>
  );
}
