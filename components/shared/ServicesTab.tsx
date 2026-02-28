"use client";

import {
  Pill,
  Stethoscope,
  FlaskConical,
  Ambulance,
  Droplets,
  HeartPulse,
  LucideIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface Props {
  services: string[];
  specialties: string[];
}

const getServiceIcon = (service: string) => {
  const iconMap: Record<string, LucideIcon> = {
    ICU: HeartPulse,
    Emergency: Ambulance,
    "Blood Bank": Droplets,
    Pharmacy: Pill,
    Diagnostic: FlaskConical,
    General: Stethoscope,
  };

  for (const [key, Icon] of Object.entries(iconMap)) {
    if (service.toLowerCase().includes(key.toLowerCase())) return Icon;
  }
  return Zap;
};

export function ServicesTab({ services, specialties }: Props) {
  const hasServices = services.length > 0;
  const hasSpecialties = specialties.length > 0;

  if (!hasServices && !hasSpecialties) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-[2rem] bg-badge-bg border border-border flex items-center justify-center mb-6">
          <Pill className="w-10 h-10 text-muted opacity-40" />
        </div>
        <p className="text-xs font-black text-muted uppercase tracking-widest">
          No Clinical Capabilities Listed
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* ── Services Section ── */}
      {hasServices && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-5 bg-accent rounded-full" />
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.25em]">
              Facility Infrastucture & Services
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => {
              const Icon = getServiceIcon(service);
              return (
                <div
                  key={service}
                  className="group p-5 bg-white border border-border rounded-[1.5rem] hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-badge-bg flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-black text-heading uppercase tracking-tight block">
                    {service}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Specialties Section ── */}
      {hasSpecialties && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.25em]">
              Medical Expertise & Specialties
            </h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {specialties.map((specialty) => (
              <div
                key={specialty}
                className="flex items-center gap-2.5 pl-2.5 pr-4 py-2.5 bg-white border border-border rounded-xl hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group cursor-default"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={14} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black text-heading uppercase tracking-wide">
                  {specialty}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile Friendly Footer ── */}
      <div className="mt-8 p-6 rounded-2xl border border-dashed border-border bg-slate-50/50">
        <p className="text-[9px] font-bold text-muted uppercase tracking-widest text-center leading-relaxed">
          The above services and specialties are verified based on current
          facility audit data and active medical staff credentials.
        </p>
      </div>
    </div>
  );
}
