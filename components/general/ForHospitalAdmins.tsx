"use client";

import React from "react";
import {
  LayoutDashboard,
  UserPlus,
  History,
  BarChart,
  Smartphone,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const adminFeatures = [
  {
    title: "One-Tap Inventory",
    desc: "Update ICU and bed counts in seconds. Syncs instantly across the network.",
    icon: Zap,
  },
  {
    title: "Digital Referrals",
    desc: "Receive and manage patient transfers with full digital history.",
    icon: UserPlus,
  },
  {
    title: "Usage Analytics",
    desc: "Monitor peak demand times to optimize staff allocation.",
    icon: BarChart,
  },
  {
    title: "Staff Audit Trail",
    desc: "Keep a secure log of all inventory updates for compliance.",
    icon: History,
  },
];

export function ForHospitalAdmins() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Subtle Background Pattern - Very faint grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,white,transparent,white)]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="admin-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
              <Globe size={14} className="text-accent" /> Hospital Management
              Suite
            </div>

            <h2 className="text-4xl lg:text-6xl font-heading font-bold text-heading leading-[1.1] mb-6">
              Manage your facility <br />
              <span className="text-accent/80">in real-time.</span>
            </h2>

            <p className="text-body text-lg mb-10 max-w-lg leading-relaxed">
              Move beyond manual tracking. Our admin suite integrates with your
              existing workflow to provide transparency to those who need it
              most.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {adminFeatures.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/5 flex items-center justify-center text-accent">
                    <f.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-heading font-bold text-sm mb-1">
                      {f.title}
                    </h4>
                    <p className="text-muted text-xs leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/admin/signup"
                className="px-8 py-4 bg-heading text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Get Admin Access <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 bg-white border border-border text-heading rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Right: Clean Dashboard Interface */}
          <div className="relative">
            {/* Soft Glow Backgrounds */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/5 blur-[100px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {/* Mockup Top Bar */}
              <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-black text-xs">
                    H
                  </div>
                  <span className="text-xs font-bold text-heading">
                    Control Panel
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-bold text-success uppercase">
                    System Active
                  </span>
                </div>
              </div>

              {/* Mockup Stats */}
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
                        ICU Bed Occupancy
                      </p>
                      <p className="text-3xl font-black text-heading">82%</p>
                    </div>
                    <div className="text-right text-xs font-bold text-error">
                      - 4 Units Available
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "82%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-muted uppercase mb-2">
                      Total Referrals
                    </p>
                    <p className="text-xl font-bold text-heading">124</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-muted uppercase mb-2">
                      Wait Time
                    </p>
                    <p className="text-xl font-bold text-heading">
                      08<span className="text-xs ml-1">min</span>
                    </p>
                  </div>
                </div>

                {/* Activity Mockup */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-muted uppercase mb-4">
                    Live Activity
                  </p>
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
                          <CheckCircle2 size={14} />
                        </div>
                        <p className="text-[11px] font-medium text-body">
                          Inventory data synced with main server
                        </p>
                        <span className="ml-auto text-[10px] text-muted font-mono">
                          14:0{i}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
