"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  MapPin,
  Mail,
  ArrowUpRight,
  Database,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[var(--color-border)] mt-auto relative overflow-hidden">
      {}
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {}
          <div className="lg:col-span-1 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--color-heading)] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                <Activity size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-2xl font-black text-[var(--color-heading)] tracking-tighter uppercase leading-none block">
                  NearH
                </span>
                <span className="text-[9px] font-black text-[var(--color-accent)] uppercase tracking-[0.3em]">
                  Healthcare Grid
                </span>
              </div>
            </Link>
            <p className="text-[var(--color-muted)] text-xs font-bold uppercase tracking-wide leading-relaxed max-w-xs">
              India&apos;s real-time clinical network. Synchronizing emergency
              protocols with live hospital inventory.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-[var(--color-heading)] uppercase tracking-[0.2em] mb-8">
              Public Directory
            </h4>
            <ul className="space-y-5">
              <FooterLink
                href="/explore"
                label="Live Hospital Grid"
                icon={<ArrowUpRight size={12} />}
              />
              <FooterLink href="/about-us" label="System Narrative" />
              <FooterLink href="/privacy-policy" label="Data Sovereignty" />
            </ul>
          </div>

          {}
          <div>
            <h4 className="text-[10px] font-black text-[var(--color-heading)] uppercase tracking-[0.2em] mb-8">
              System Access
            </h4>
            <ul className="space-y-5">
              <FooterLink
                href="/admin/dashboard"
                label="Admin Terminal"
                icon={<Database size={12} />}
              />
              <FooterLink href="/admin/hospitals" label="Facility Audit" />
            </ul>
          </div>

          {}
          <div>
            <h4 className="text-[10px] font-black text-[var(--color-heading)] uppercase tracking-[0.2em] mb-8">
              Support Triage
            </h4>
            <div className="space-y-6">
              <a
                href="mailto:support@nearh.in"
                className="group flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all shadow-sm">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[var(--color-muted)] uppercase tracking-widest leading-none mb-1.5">
                    Direct Email
                  </p>
                  <p className="text-xs font-bold text-[var(--color-heading)]">
                    support@nearh.in
                  </p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[var(--color-accent)]">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[var(--color-muted)] uppercase tracking-widest leading-none mb-1.5">
                    HQ Operations
                  </p>
                  <p className="text-xs font-bold text-[var(--color-heading)]">
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 order-2 md:order-1">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              © {currentYear} NearH
            </p>
          </div>

          <div className="flex items-center gap-8 order-1 md:order-2">
            <Link
              href="/terms"
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy"
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/security"
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className="group flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-all text-xs font-bold uppercase tracking-tight"
    >
      <span className="group-hover:translate-x-1 transition-transform">
        {label}
      </span>
      {icon && (
        <span className="opacity-0 group-hover:opacity-100 transition-all">
          {icon}
        </span>
      )}
    </Link>
  </li>
);
