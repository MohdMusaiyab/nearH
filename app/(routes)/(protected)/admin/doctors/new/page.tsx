import { createClient } from "@/lib/supabase/server";
import DoctorForm from "@/components/admin/DoctorForm";
import { UserPlus, Stethoscope } from "lucide-react";

export default async function NewDoctorPage() {
  const supabase = await createClient();
  const { data: specialties } = await supabase
    .from("specialties_list")
    .select("*")
    .order("specialty_name");

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* ── Page Header (NearH Pattern) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20 flex-shrink-0">
            <UserPlus size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-heading)] tracking-tight leading-none">
              Register New Doctor
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Add a medical professional to your hospital&apos;s public directory
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      {/* ── Form Container ── */}
      <div className="max-w-4xl">
        <DoctorForm specialties={specialties || []} />
      </div>
    </div>
  );
}