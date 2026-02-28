"use client";

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Search,
  Zap,
  PhoneCall,
  Clock,
  Heart,
  Users,
  Activity,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function WhyNearH() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {}
      <div
        className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-error text-[10px] font-black uppercase tracking-widest mb-6 border border-red-100"
            >
              <AlertCircle size={14} />
              Latency Analysis
            </motion.div>
            <h2 className="text-5xl lg:text-7xl font-black text-heading tracking-tighter leading-[0.9] uppercase">
              In emergencies, <br />
              <span className="text-accent">
                Minutes are Milestones.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-muted text-sm font-bold uppercase tracking-widest leading-relaxed border-l-2 border-accent pl-6">
              NearH replaces systemic fragmentation with verified clinical data,
              accelerating the path from crisis to care.
            </p>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-24">
          {}
          <div className="xl:col-span-5 bg-slate-50 rounded-[3rem] p-10 border border-border flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <TrendingDown size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Legacy Friction
                </span>
              </div>
              <ul className="space-y-6">
                {beforeItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 opacity-60">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-[8px] font-black text-slate-500 mt-1">
                      ✕
                    </div>
                    <span className="text-sm font-bold text-slate-600 tracking-tight leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {}
          <div className="xl:col-span-7 bg-heading rounded-[3rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl">
            {}
            <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none">
              <Activity
                size={400}
                className="translate-x-1/4 -translate-y-1/4 text-white"
              />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                    NearH Standard 2.0
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {afterItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-black uppercase tracking-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border rounded-[2.5rem] bg-white overflow-hidden mb-24">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-10 relative group ${idx !== 2 ? "border-b md:border-b-0 md:border-r border-border" : ""}`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-badge-bg text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <step.icon size={28} strokeWidth={2.5} />
                </div>
                <span className="text-4xl font-black text-slate-100 group-hover:text-accent/10 transition-colors">
                  {idx + 1}
                </span>
              </div>
              <h3 className="text-xl font-black text-heading uppercase tracking-tighter mb-4">
                {step.title}
              </h3>
              <p className="text-muted text-sm font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {}
        <div className="relative rounded-[4rem] bg-accent p-12 lg:p-20 overflow-hidden shadow-3xl shadow-blue-500/20">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {impactStats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-6 w-16 h-16 rounded-[2rem] bg-white/20 backdrop-blur-lg flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
                  <stat.icon size={32} />
                </div>
                <div className="text-6xl lg:text-7xl font-black text-white tracking-tighter mb-2">
                  {stat.value}
                </div>
                <div className="font-black text-blue-100 uppercase text-[10px] tracking-[0.3em] mb-4">
                  {stat.label}
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest border border-white/10">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="mt-28 flex flex-col items-center">
          <h3 className="text-4xl lg:text-6xl font-black text-heading tracking-tighter uppercase text-center mb-10 max-w-3xl leading-[0.9]">
            Secure the{" "}
            <span className="text-accent">Critical Grid.</span>
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-12 py-5 bg-heading text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Initialize Access <ChevronRight size={18} strokeWidth={3} />
            </Link>
            <Link
              href="/explore"
              className="w-full sm:w-auto px-12 py-5 bg-white text-heading border border-border rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              Verify Grid
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const beforeItems = [
  "Frantic phone calls during crisis",
  "Outdated inventory & false hope",
  "Opaque pricing & hidden costs",
  "Travel time lost to 'Full' facilities",
];

const afterItems = [
  "One-tap real-time grid",
  "Sync intervals of <5 mins",
  "Verified bed availability",
  "Live ICU & blood logistics",
];

const impactStats = [
  {
    icon: Users,
    value: "10K+",
    label: "Lives Routed",
    subtext: "Clinical Success",
  },
  {
    icon: Heart,
    value: "500+",
    label: "Facilities",
    subtext: "Verified Partners",
  },
  {
    icon: Clock,
    value: "12M",
    label: "Response Time",
    subtext: "85% Efficiency Gain",
  },
];

const steps = [
  {
    icon: Search,
    title: "Grid Discovery",
    description:
      "Filter by live ICU, ventilator capacity, or blood types across our localized clinical nodes.",
  },
  {
    icon: Zap,
    title: "Data Verification",
    description:
      "Our protocols synchronize with hospital  every 5 minutes to eliminate latency.",
  },
  {
    icon: PhoneCall,
    title: "Clinical Handoff",
    description:
      "Pre-arrival communication and emergency routing ensure the facility is ready for the intake.",
  },
];
