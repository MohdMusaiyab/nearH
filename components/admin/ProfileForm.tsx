"use client";

import { useState } from "react";
import { updateHospitalProfile } from "@/actions/admin/profile";
import { Database } from "@/types/database.types";
import {
  Save,
  Loader2,
  Building2,
  Activity,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

type Hospital = Database["public"]["Tables"]["hospitals"]["Row"];
type ServiceItem = Database["public"]["Tables"]["services_list"]["Row"];
type LocationItem = Database["public"]["Tables"]["locations"]["Row"];

interface Props {
  hospital: Hospital;
  allServices: ServiceItem[];
  selectedServiceIds: string[];
  locations: LocationItem[];
}

export default function HospitalProfileForm({
  hospital,
  allServices,
  selectedServiceIds,
  locations,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<string[]>(selectedServiceIds);

  const toggleService = (id: string) => {
    setServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      official_phone: formData.get("official_phone") as string,
      location_id: (formData.get("location_id") as string) || null,
      website_url: formData.get("website_url") as string,
    };

    const res = await updateHospitalProfile(payload, services);
    if (res.success) alert("Profile updated!");
    else alert(res.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SECTION: Basic Information */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" /> Hospital Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hospital Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              Hospital Name
            </label>
            <input
              name="name"
              required
              defaultValue={hospital.name}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900"
            />
          </div>

          {/* Official Phone */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              Official Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="official_phone"
                required
                defaultValue={hospital.official_phone}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              Operating City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                name="location_id"
                defaultValue={hospital.location_id || ""}
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-medium text-slate-900"
              >
                <option value="">Select City</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.city}, {loc.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              Website URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="website_url"
                defaultValue={hospital.website_url || ""}
                placeholder="https://hospital.com"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Services Selector */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" /> Available Facilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allServices.map((s) => (
            <label
              key={s.id}
              className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${services.includes(s.id) ? "bg-indigo-50 border-indigo-200" : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-300"}`}
            >
              <span
                className={`text-sm font-bold ${services.includes(s.id) ? "text-indigo-700" : "text-slate-700"}`}
              >
                {s.service_name}
              </span>
              <input
                type="checkbox"
                className="hidden"
                checked={services.includes(s.id)}
                onChange={() => toggleService(s.id)}
              />
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${services.includes(s.id) ? "bg-indigo-600 border-indigo-600" : "border-slate-300"}`}
              >
                {services.includes(s.id) && (
                  <Save className="w-3 h-3 text-white" />
                )}
              </div>
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-slate-300"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Save className="w-4 h-4" /> Save Profile Changes
          </>
        )}
      </button>
    </form>
  );
}
