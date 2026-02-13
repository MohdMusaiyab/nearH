"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addSpecialty } from "@/actions/superadmin/speciality";
import { ArrowLeft, Loader2, Save, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function NewSpecialtyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const specialty_name = formData.get("specialty_name") as string;

    const result = await addSpecialty({ specialty_name });
    if (result.success) router.push("/superadmin/specialties");
    else {
      setError(result.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/superadmin/specialties"
          className="p-2 hover:bg-white rounded-full border border-slate-200 text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Add Specialty</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border-l-4 border-red-500">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Specialty Name
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="specialty_name"
                required
                placeholder="e.g. Oncology, Orthopedics"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Specialty
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
