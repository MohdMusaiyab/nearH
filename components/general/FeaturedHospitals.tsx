"use client";

import React from "react";
import {
  BedDouble,
  Activity,
  Droplets,
  ShieldCheck,
  MapPin,
  ArrowRight,
  DatabaseZap,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export function SystemIntelligence() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-badge-bg text-accent text-[10px] font-black uppercase tracking-widest mb-6 border border-accent/10 shadow-sm">
              <DatabaseZap size={14} className="animate-pulse" /> Unified
              Healthcare Protocol
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-heading tracking-tighter leading-[0.9] uppercase">
              Engineered for <br />{" "}
              <span className="text-accent">Zero-Latency.</span>
            </h2>
            <p className="mt-6 text-muted text-sm font-bold uppercase tracking-widest leading-relaxed border-l-2 border-accent pl-6">
              NearH bridges the gap between emergency and care <br /> by
              synchronizing clinical nodes into a single grid.
            </p>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:h-[650px]">
          {}
          <div className="md:col-span-8 bg-slate-50 rounded-[3rem] border border-border p-10 lg:p-14 relative overflow-hidden group hover:bg-white transition-all duration-500">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-accent mb-8 shadow-sm group-hover:shadow-lg transition-all">
                  <BedDouble size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-black text-heading uppercase tracking-tight mb-4 leading-none">
                  Live Bed <br /> Inventory
                </h3>
                <p className="text-muted text-sm font-medium leading-relaxed max-w-sm">
                  Our proprietary synchronization engine polls hospital systems
                  every 5 minutes, providing sub-minute accuracy for ICU and
                  General capacity.
                </p>
              </div>
              <div className="mt-10 flex gap-4">
                <div className="px-5 py-2.5 bg-white rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-accent">
                  99.8% Accuracy
                </div>
                <div className="px-5 py-2.5 bg-white rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Verified Sync
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
              <Activity
                size={400}
                className="translate-x-1/4 -translate-y-1/4"
              />
            </div>
          </div>

          {}
          <div className="md:col-span-4 bg-white rounded-[3rem] border border-border p-10 flex flex-col justify-between relative overflow-hidden hover:shadow-2xl hover:shadow-red-100 transition-all duration-500 group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-error mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <Droplets size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-heading uppercase tracking-tight mb-4">
                Blood <br /> Registry
              </h3>
              <p className="text-muted text-xs font-bold uppercase tracking-widest leading-relaxed">
                Real-time stock monitoring <br /> of rare blood groups <br />{" "}
                (O-, AB+) across verified <br /> clinical nodes.
              </p>
            </div>
            <Link
              href="/explore"
              className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-error group-hover:gap-4 transition-all"
            >
              Verify Stock <ChevronRight size={14} strokeWidth={3} />
            </Link>
          </div>

          {}
          <div className="md:col-span-4 bg-white rounded-[3rem] border border-border p-10 flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-badge-bg border border-border flex items-center justify-center text-accent mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <MapPin size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-heading uppercase tracking-tight mb-4">
                Critical <br /> Navigation
              </h3>
              <p className="text-muted text-xs font-medium leading-relaxed">
                Automated emergency routing to the nearest facility with
                verified capacity for specific medical requirements.
              </p>
            </div>
          </div>

          {}
          <div className="md:col-span-8 bg-slate-50 rounded-[3rem] border border-border p-10 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-white transition-all duration-500 group">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-heading uppercase tracking-tight mb-4">
                Audit & Verification
              </h3>
              <p className="text-muted text-xs font-medium leading-relaxed max-w-sm">
                Every facility in the network undergoes a 24-point medical audit
                to ensure equipment and staff credentials meet the national
                standard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm hover:border-accent/30 transition-all">
                <span className="text-2xl font-black text-heading leading-none tabular-nums">
                  LIVE
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  Status
                </span>
              </div>
              <div className="w-24 h-24 rounded-3xl bg-white border border-slate-100 flex flex-col items-center justify-center shadow-sm hover:border-emerald-300 transition-all">
                <span className="text-2xl font-black text-emerald-600 leading-none">
                  100%
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">
                  Accredited
                </span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="mt-20 flex flex-col items-center">
          <Link
            href="/explore"
            className="px-12 py-5 bg-heading text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95"
          >
            Enter the Live Grid <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      </div>
    </section>
  );
}
