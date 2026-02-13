"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addLocation } from "@/actions/superadmin/locations";
import { MapPin, ArrowLeft, Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NewLocationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    const result = await addLocation({ city, state });

    if (result.success) {
      // Small delay for UX feel, then redirect
      router.push("/superadmin/locations");
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button & Title */}
      <div className="flex items-center gap-4">
        <Link
          href="/superadmin/locations"
          className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add Location</h1>
          <p className="text-slate-500 text-sm">
            Expand the hospital network to a new city.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* City Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                City Name
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="city"
                  required
                  placeholder="e.g. Pune"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
                />
              </div>
            </div>

            {/* State Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                State / Province
              </label>
              <input
                name="state"
                required
                placeholder="e.g. Maharashtra"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300 disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Save Location
                </>
              )}
            </button>

            <Link
              href="/superadmin/locations"
              className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Pro Tip Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <div className="text-blue-600">💡</div>
        <p className="text-sm text-blue-800 leading-relaxed">
          Adding a location makes it immediately available in the{" "}
          <strong>Hospital Registration</strong> dropdown. Ensure the spelling
          is correct as hospitals will be grouped by these cities.
        </p>
      </div>
    </div>
  );
}
