"use client";

import {
  Phone,
  Mail,
  Globe,
  AlertCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import {
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";

interface Props {
  hospital: PrivateHospitalProfile | SuperAdminHospitalProfile;
}

export function ContactInfo({ hospital }: Props) {
  const hasContactInfo =
    hospital.official_email ||
    hospital.official_phone ||
    hospital.website_url ||
    hospital.emergency_contact;

  if (!hasContactInfo) return null;

  return (
    <section className="bg-white rounded-[2.5rem] border border-[var(--color-border)] shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <h2 className="text-[10px] font-black text-[var(--color-muted)] uppercase tracking-[0.2em]">
          Contact Directory
        </h2>
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
      </div>

      {/* The Vertical Stack */}
      <div className="flex flex-col divide-y divide-slate-50">
        {/* Emergency - Priority Top */}
        {hospital.emergency_contact && (
          <ContactRow
            label="Emergency Hotline"
            value={hospital.emergency_contact}
            href={`tel:${hospital.emergency_contact}`}
            icon={<AlertCircle size={16} strokeWidth={3} />}
            isEmergency
          />
        )}

        {/* Primary Phone */}
        {hospital.official_phone && (
          <ContactRow
            label="Reception / Admin"
            value={hospital.official_phone}
            href={`tel:${hospital.official_phone}`}
            icon={<Phone size={16} strokeWidth={2.5} />}
          />
        )}

        {/* Official Email */}
        {hospital.official_email && (
          <ContactRow
            label="Official Email"
            value={hospital.official_email}
            href={`mailto:${hospital.official_email}`}
            icon={<Mail size={16} strokeWidth={2.5} />}
          />
        )}

        {/* Digital Portal */}
        {hospital.website_url && (
          <ContactRow
            label="Hospital Website"
            value="View Portal"
            href={hospital.website_url}
            icon={<Globe size={16} strokeWidth={2.5} />}
            isExternal
          />
        )}
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  icon,
  isExternal,
  isEmergency,
}: {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  isExternal?: boolean;
  isEmergency?: boolean;
}) {
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group flex flex-col p-5 hover:bg-slate-50/80 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        {/* Icon Left */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 group-hover:rotate-6 ${
            isEmergency
              ? "bg-red-50 text-[var(--color-error)] border border-red-100"
              : "bg-[var(--color-badge-bg)] text-[var(--color-accent)] border border-[var(--color-border)]"
          }`}
        >
          {icon}
        </div>

        {/* Info Right */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 ${
              isEmergency
                ? "text-[var(--color-error)]"
                : "text-[var(--color-muted)]"
            }`}
          >
            {label}
          </p>
          <div className="flex items-center justify-between gap-2">
            <p
              className={`text-xs font-bold truncate ${
                isEmergency
                  ? "text-[var(--color-error)]"
                  : "text-[var(--color-heading)]"
              }`}
            >
              {value}
            </p>
            <ArrowRight
              size={12}
              className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ${
                isEmergency
                  ? "text-[var(--color-error)]"
                  : "text-[var(--color-accent)]"
              }`}
            />
          </div>
        </div>
      </div>
    </a>
  );
}
