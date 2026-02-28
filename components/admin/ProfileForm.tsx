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
  Check,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { ConfigProvider, App as AntApp } from "antd";

type Hospital = Database["public"]["Tables"]["hospitals"]["Row"];
type ServiceItem = Database["public"]["Tables"]["services_list"]["Row"];
type LocationItem = Database["public"]["Tables"]["locations"]["Row"];

interface Props {
  hospital: Hospital;
  allServices: ServiceItem[];
  selectedServiceIds: string[];
  locations: LocationItem[];
}

function HospitalProfileFormContent({
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
    if (res.success) {
      toast.success("Profile Synchronized", {
        description: "Your hospital information has been updated successfully.",
      });
    } else {
      toast.error("Update Failed", { description: res.message });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* SECTION: Basic Information */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
          <Building2 className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-black text-heading uppercase tracking-widest">
            Hospital Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hospital Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">
              Hospital Name
            </label>
            <input
              name="name"
              required
              defaultValue={hospital.name}
              className="w-full p-3.5 bg-slate-50 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold text-heading"
            />
          </div>

          {/* Official Phone */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">
              Official Phone
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                name="official_phone"
                required
                defaultValue={hospital.official_phone}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold text-heading"
              />
            </div>
          </div>

          {/* Location Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">
              Operating City
            </label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <select
                name="location_id"
                defaultValue={hospital.location_id || ""}
                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent appearance-none font-bold text-heading cursor-pointer"
              >
                <option value="">Select City</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.city}, {loc.state}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none group-hover:text-heading transition-colors" />
            </div>
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">
              Website URL
            </label>
            <div className="relative group">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                name="website_url"
                defaultValue={hospital.website_url || ""}
                placeholder="https://hospital.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-border rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all font-bold text-heading"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Services Selector */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
          <Activity className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-black text-heading uppercase tracking-widest">
            Available Facilities
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allServices.map((s) => {
            const isSelected = services.includes(s.id);
            return (
              <label
                key={s.id}
                className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-badge-bg border-accent"
                    : "bg-slate-50/50 border-border hover:bg-white hover:border-accent/40"
                }`}
              >
                <span
                  className={`text-xs font-black uppercase tracking-tight transition-colors ${isSelected ? "text-accent" : "text-body"}`}
                >
                  {s.service_name}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => toggleService(s.id)}
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-accent border-accent"
                      : "border-border"
                  }`}
                >
                  {isSelected && (
                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4.5 bg-heading text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50"
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

export default function HospitalProfileForm(props: Props) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0284C7",
          borderRadius: 12,
          fontFamily: "var(--font-sans)",
        },
      }}
    >
      <AntApp>
        <HospitalProfileFormContent {...props} />
      </AntApp>
    </ConfigProvider>
  );
}
