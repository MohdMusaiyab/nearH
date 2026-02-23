"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addSpecialty } from "@/actions/superadmin/speciality";
import { ArrowLeft, Loader2, Save, Award, Lightbulb } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewSpecialtyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const specialty_name = (formData.get("specialty_name") as string).trim();

    if (!specialty_name) {
      toast.error("Specialty name cannot be empty.");
      setIsLoading(false);
      return;
    }

    const result = await addSpecialty({ specialty_name });
    if (result.success) {
      toast.success(`"${specialty_name}" added to specialties`);
      router.push("/superadmin/specialties");
    } else {
      toast.error("Failed to add specialty", { description: result.message });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto space-y-6">
        {/* ── Page header ── */}
        <div className="flex items-center gap-4">
          <Link
            href="/superadmin/specialties"
            className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-white flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-heading)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-badge-bg)] transition-all flex-shrink-0"
            aria-label="Back to specialties"
          >
            <ArrowLeft size={17} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/25 flex-shrink-0">
              <Award size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--color-heading)] tracking-tight leading-none">
                Add Specialty
              </h1>
              <p className="text-sm text-[var(--color-muted)] mt-0.5">
                Add a new clinical specialty to the master catalog
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-border)]" />

        {/* ── Form card ── */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
          {/* Card header strip */}
          <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-badge-bg)]/50 flex items-center gap-3">
            <Award size={15} className="text-[var(--color-accent)]" />
            <span className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-widest">
              Specialty Details
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="specialty_name"
                className="text-xs font-bold text-[var(--color-heading)] uppercase tracking-widest block"
              >
                Specialty Name{" "}
                <span className="text-[var(--color-error)]">*</span>
              </label>
              <div className="relative">
                <Award
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                />
                <input
                  id="specialty_name"
                  name="specialty_name"
                  required
                  placeholder="e.g. Oncology, Orthopedics, Neurology"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-badge-bg)] border border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-heading)] placeholder:text-[var(--color-muted)] placeholder:font-normal outline-none focus:bg-white focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-bold rounded-xl shadow-md shadow-[var(--color-accent)]/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Specialty
                  </>
                )}
              </button>

              <Link
                href="/superadmin/specialties"
                className="px-5 py-3 border border-[var(--color-border)] rounded-xl text-sm font-bold text-[var(--color-body)] hover:bg-[var(--color-badge-bg)] hover:border-[var(--color-accent)]/30 hover:text-[var(--color-heading)] transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* ── Tip card ── */}
        <div className="flex items-start gap-3 px-5 py-4 bg-[var(--color-badge-bg)] border border-[var(--color-border)] rounded-2xl">
          <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb size={15} className="text-[var(--color-accent)]" />
          </div>
          <p className="text-sm text-[var(--color-body)] leading-relaxed">
            Specialties appear in the{" "}
            <span className="font-bold text-[var(--color-heading)]">
              Hospital Profile
            </span>{" "}
            and the{" "}
            <span className="font-bold text-[var(--color-heading)]">
              Explore
            </span>{" "}
            directory filters. Use standard clinical terminology so hospitals
            and patients can find them easily.
          </p>
        </div>
      </div>
    </div>
  );
}
