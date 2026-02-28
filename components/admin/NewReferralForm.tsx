"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  sendReferral,
  searchHospitals,
  type SearchResult,
} from "@/actions/admin/referrals";
import { Database } from "@/types/database.types";
import {
  Loader2,
  Search,
  Send,
  User,
  ChevronRight,
  Building2,
  MapPin,
  ChevronDown,
  Stethoscope,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

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
      if (res.data?.length === 0)
        toast.info("No facilities found in this city.");
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
        toast.success("Referral Dispatched", {
          description: `Request sent to ${selectedHospital.name}`,
        });
        router.push("/admin/referrals");
        router.refresh();
      } else {
        toast.error("Dispatch Failed", { description: res.message });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── Step 1: Hospital Discovery ── */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-6 rounded-full bg-heading text-white text-[10px] flex items-center justify-center font-black">
                01
              </span>
              <h2 className="text-xs font-black text-muted uppercase tracking-widest">
                Select Target Facility
              </h2>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
                <select
                  name="city"
                  className="w-full pl-11 pr-10 py-4 bg-badge-bg/50 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent appearance-none font-bold text-heading transition-all cursor-pointer"
                >
                  <option value="">Search across all cities</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.city}, {l.state}
                    </option>
                  ))}
                </select>
                {/* Custom Chevron */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-heading transition-colors">
                  <ChevronDown size={18} strokeWidth={3} />
                </div>
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-10 py-4 bg-heading text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Discover
              </button>
            </form>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.length === 0 && !searching && (
              <div className="md:col-span-2 py-20 text-center bg-badge-bg/20 rounded-[2.5rem] border-2 border-dashed border-border">
                <Building2 className="w-12 h-12 text-border mx-auto mb-4" />
                <p className="text-muted font-black text-xs uppercase tracking-widest">
                  No facilities selected
                </p>
                <p className="text-muted text-[10px] mt-1 italic">
                  Choose a city above to view real-time availability
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
                className="text-left p-6 bg-white border border-border rounded-[2rem] hover:border-accent hover:shadow-xl hover:shadow-accent/5 transition-all group relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="min-w-0">
                    <h3 className="font-black text-heading text-lg truncate tracking-tight group-hover:text-accent transition-colors">
                      {h.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] font-bold text-muted uppercase tracking-tight">
                        Verified Facility
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-badge-bg flex items-center justify-center text-muted group-hover:bg-accent group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                      General Beds
                    </p>
                    <p className="text-lg font-black text-emerald-700">
                      {h.inventory?.available_beds ?? 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                      ICU Units
                    </p>
                    <p className="text-lg font-black text-blue-700">
                      {h.inventory?.icu_beds_available ?? 0}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Clinical Data Entry ── */}
      {step === 2 && selectedHospital && (
        <form
          onSubmit={onSubmit}
          className="space-y-6 animate-in zoom-in-95 duration-300"
        >
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-border shadow-sm space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
              <div className="w-14 h-14 bg-badge-bg text-accent rounded-2xl border border-border flex items-center justify-center flex-shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] leading-none mb-1">
                  Receiving Facility
                </p>
                <p className="text-xl font-black text-heading truncate tracking-tight uppercase leading-none">
                  {selectedHospital.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-[10px] font-black text-accent uppercase tracking-widest bg-badge-bg rounded-xl border border-border hover:bg-white transition-all"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User size={12} className="text-accent" />{" "}
                  Patient Full Name
                </label>
                <input
                  name="patient_name"
                  required
                  placeholder="Full name as per ID"
                  className="w-full px-5 py-4 bg-badge-bg/30 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent font-bold text-heading transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">
                    Age
                  </label>
                  <input
                    name="patient_age"
                    type="number"
                    required
                    min="0"
                    placeholder="00"
                    className="w-full px-5 py-4 bg-badge-bg/30 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent font-bold text-heading transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      className="w-full pl-5 pr-10 py-4 bg-badge-bg/30 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent font-bold text-heading transition-all appearance-none cursor-pointer"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Stethoscope
                    size={12}
                    className="text-accent"
                  />{" "}
                  Required Specialty
                </label>
                <div className="relative">
                  <select
                    name="specialty"
                    required
                    className="w-full pl-5 pr-10 py-4 bg-badge-bg/30 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent font-bold text-heading transition-all appearance-none cursor-pointer"
                  >
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.specialty_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                  <AlertTriangle
                    size={12}
                    className="text-error"
                  />{" "}
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    className="w-full pl-5 pr-10 py-4 bg-red-50 border border-red-100 rounded-2xl outline-none focus:ring-2 focus:ring-error/10 focus:border-error font-black text-error transition-all appearance-none cursor-pointer uppercase text-xs"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-error pointer-events-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">
                  Clinical Reason / Notes
                </label>
                <textarea
                  name="reason"
                  rows={4}
                  required
                  className="w-full p-5 bg-badge-bg/30 border border-border rounded-3xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent font-medium text-sm leading-relaxed"
                  placeholder="Explain why the patient needs a transfer..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-5 bg-accent text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-accent/20 hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send size={16} /> Dispatch Referral
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
