"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addMasterService } from "@/actions/superadmin/services";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

export default function NewServicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    const result = await addMasterService({ service_name: name });
    if (result.success) router.push("/superadmin/services");
    else {
      setError(result.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/superadmin/services"
          className="p-2 hover:bg-white rounded-full border border-slate-200 text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Service</h1>
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
              Service Name
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Neurology, Dialysis"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Service
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
