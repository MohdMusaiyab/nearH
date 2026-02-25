import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import DoctorForm from "@/components/admin/DoctorForm";
import { UserPen, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch both doctor data and specialties list in parallel
  const [doctorRes, specialtyRes] = await Promise.all([
    supabase.from("doctors").select("*").eq("id", id).single(),
    supabase.from("specialties_list").select("*").order("specialty_name"),
  ]);

  if (doctorRes.error || !doctorRes.data) {
    notFound();
  }

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* ── Breadcrumb / Back Link ── */}
      <Link
        href="/admin/doctors"
        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors group"
      >
        <ChevronLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Medical Staff
      </Link>

      {/* ── Page Header (NearH Pattern) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] flex items-center justify-center shadow-sm flex-shrink-0">
            <UserPen size={24} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-heading)] tracking-tight leading-none">
              Edit Doctor Profile
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Updating clinical details and availability for{" "}
              <span className="text-[var(--color-heading)] font-bold">
                Dr. {doctorRes.data.name}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* ── Form Container ── */}
      <div className="max-w-4xl">
        <DoctorForm
          specialties={specialtyRes.data || []}
          initialData={doctorRes.data}
        />
      </div>
    </div>
  );
}
