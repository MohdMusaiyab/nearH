"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendReferral } from "@/actions/admin/referrals";
import { searchHospitals, type SearchResult } from "@/actions/admin/referrals";
import { Database } from "@/types/database.types";
import {
  Loader2,
  Search,
  Send,
  User,
  ChevronRight,
  Building2,
  MapPin,
} from "lucide-react";

type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];
type Location = Database["public"]["Tables"]["locations"]["Row"];
type Priority = Database["public"]["Enums"]["priority_level"];

interface Props {
  specialties: Specialty[];
  locations: Location[];
}

export default function NewReferralForm({ specialties, locations }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<1 | 2>(1);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<SearchResult | null>(
    null,
  );

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearching(true);
    const formData = new FormData(e.currentTarget);
    const cityId = formData.get("city") as string;

    const res = await searchHospitals({ cityId });
    if (res.success) {
      setSearchResults(res.data || []);
    }
    setSearching(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedHospital) return;

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await sendReferral({
        to_hospital_id: selectedHospital.id,
        patient_name: formData.get("patient_name") as string,
        patient_age: parseInt(formData.get("patient_age") as string) || 0,
        patient_gender: formData.get("gender") as string,
        medical_reason: formData.get("reason") as string,
        specialty_required: formData.get("specialty") as string,
        priority: formData.get("priority") as Priority,
        status: "Pending",
      });

      if (res.success) {
        router.push("/admin/referrals");
        router.refresh();
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
              Step 1: Locate Facility
            </h2>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  name="city"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium"
                >
                  <option value="">Select City / Search All</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.city}, {l.state}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 disabled:bg-slate-300 transition-all"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Find Hospitals
              </button>
            </form>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.length === 0 && !searching && (
              <div className="md:col-span-2 py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">
                  Search for a city to view available hospitals.
                </p>
              </div>
            )}

            {searchResults.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  setSelectedHospital(h);
                  setStep(2);
                }}
                className="text-left p-6 bg-white border border-slate-200 rounded-3xl hover:border-indigo-500 hover:ring-4 hover:ring-indigo-50 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {h.name}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{" "}
                      {h.website_url || "Verified Facility"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
                </div>

                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-[10px] font-black text-green-600 uppercase">
                      General
                    </p>
                    <p className="text-sm font-bold text-green-700">
                      {h.inventory?.available_beds ?? 0} Free
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-600 uppercase">
                      ICU
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      {h.inventory?.icu_beds_available ?? 0} Free
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {}
      {step === 2 && selectedHospital && (
        <form
          onSubmit={onSubmit}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 animate-in zoom-in-95 duration-300"
        >
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Target Facility
              </p>
              <p className="text-lg font-bold text-slate-900">
                {selectedHospital.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="ml-auto px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Change Hospital
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Patient Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  name="patient_name"
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Age
                </label>
                <input
                  name="patient_age"
                  type="number"
                  required
                  placeholder="0"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Gender
                </label>
                <select
                  name="gender"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Required Specialty
              </label>
              <select
                name="specialty"
                required
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.specialty_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Priority Level
              </label>
              <select
                name="priority"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-black text-red-600"
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Medical Reason / Clinical Notes
              </label>
              <textarea
                name="reason"
                rows={4}
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                placeholder="Detailed reason for referral..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-4.5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-slate-300"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Referral
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
