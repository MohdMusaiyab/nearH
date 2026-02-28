"use client";

import React from "react";
import { Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 relative overflow-hidden">
      {}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {}
        <div className="mb-16 border-b border-border pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-badge-bg text-accent text-[10px] font-black uppercase tracking-widest mb-6 border border-accent/10">
            <Scale size={14} /> Legal Protocol v1.0
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-heading tracking-tighter uppercase leading-none">
            Terms of{" "}
            <span className="text-accent">Service.</span>
          </h1>
          <p className="mt-6 text-muted text-sm font-bold uppercase tracking-widest">
            Last Updated: February 26, 2026
          </p>
        </div>

        {}
        <div className="space-y-16">
          <section className="group">
            <h3 className="text-xs font-black text-heading uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-accent group-hover:text-white transition-all">
                01
              </span>
              Acceptance of Digital Protocol
            </h3>
            <div className="pl-11 space-y-4 text-sm font-medium text-muted leading-relaxed">
              <p>
                By accessing the NearH Live Grid, you agree to comply with our
                systemic guidelines. This platform is a real-time information
                aggregator and does not provide medical advice or direct
                clinical diagnosis.
              </p>
              <p>
                Users are responsible for verifying the data with local facility
                administrators during critical transit.
              </p>
            </div>
          </section>

          <section className="group">
            <h3 className="text-xs font-black text-heading uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-accent group-hover:text-white transition-all">
                02
              </span>
              Data Accuracy & Latency
            </h3>
            <div className="pl-11 space-y-4 text-sm font-medium text-muted leading-relaxed">
              <p>
                While NearH targets sub-5 minute synchronization intervals,
                system latency or hospital HMS downtime may affect bed
                availability counts. NearH is not liable for data discrepancies
                caused by local facility reporting errors.
              </p>
            </div>
          </section>

          <section className="group">
            <h3 className="text-xs font-black text-heading uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-accent group-hover:text-white transition-all">
                03
              </span>
              Authorized Usage
            </h3>
            <div className="pl-11 space-y-4 text-sm font-medium text-muted leading-relaxed">
              <p>
                Scraping the NearH Live Grid via automated bots is strictly
                prohibited. API access is granted only to verified medical
                partners and emergency response agencies.
              </p>
            </div>
          </section>
        </div>

        {}
        <div className="mt-24 p-10 bg-slate-50 rounded-[3rem] border border-border text-center">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">
            Questions regarding our legal framework?
          </p>
          <a
            href="mailto:legal@nearh.in"
            className="text-accent font-black uppercase text-xs hover:underline tracking-widest"
          >
            legal@nearh.in
          </a>
        </div>
      </div>
    </div>
  );
}
