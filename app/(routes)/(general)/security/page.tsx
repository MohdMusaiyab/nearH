"use client";

import React from "react";
import { ShieldAlert, Lock, Database, RefreshCcw, EyeOff } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="mb-16 border-b border-[var(--color-border)] pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
            <ShieldAlert size={14} /> Network Integrity Status: Active
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-[var(--color-heading)] tracking-tighter uppercase leading-none">
            Security <span className="text-emerald-500">Protocols.</span>
          </h1>
          <p className="mt-6 text-[var(--color-muted)] text-sm font-bold uppercase tracking-widest">
            NearH Platform Hardening & Data Encryption Standards
          </p>
        </div>

        {/* Security Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <SecurityCard
            icon={<Lock />}
            title="End-to-End Encryption"
            desc="All clinical data transfers between hospital HMS and the NearH Grid are secured via TLS 1.3 and AES-256 encryption."
          />
          <SecurityCard
            icon={<Database />}
            title="Sovereign Storage"
            desc="Patient metadata and facility credentials are stored in high-security, compliant regional nodes with 24/7 monitoring."
          />
          <SecurityCard
            icon={<RefreshCcw />}
            title="Auto-Audit Sync"
            desc="Our verification engine automatically blacklists facilities with inconsistent reporting to prevent 'Ghost Bed' data."
          />
          <SecurityCard
            icon={<EyeOff />}
            title="Zero-Trust Access"
            desc="Role-based access control (RBAC) ensures only verified medical administrators can view sensitive referral logs."
          />
        </div>

        <section className="bg-[var(--color-heading)] text-white p-12 rounded-[3rem] relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-6">
              Responsible Disclosure
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 max-w-xl">
              Found a vulnerability? We operate a bug bounty program for
              security researchers. Help us harden the grid.
            </p>
            <button className="px-8 py-4 bg-[var(--color-accent)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20">
              Report Vulnerability
            </button>
          </div>
          <ShieldAlert
            className="absolute top-0 right-0 w-64 h-64 text-white/5 -translate-y-1/4 translate-x-1/4"
            size={250}
          />
        </section>
      </div>
    </div>
  );
}

function SecurityCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8 bg-white border border-[var(--color-border)] rounded-[2.5rem] hover:border-[var(--color-accent)]/30 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-badge-bg)] text-[var(--color-accent)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
        {React.cloneElement(icon as React.ReactElement, {})}
      </div>
      <h4 className="text-lg font-black text-[var(--color-heading)] uppercase tracking-tight mb-3">
        {title}
      </h4>
      <p className="text-[var(--color-muted)] text-xs font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
