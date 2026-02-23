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
  ArrowRight,
  Activity,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function WhyNearH() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background Decor: Suble Medical SVGs */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header: High Impact */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 text-error font-bold text-xs uppercase tracking-tighter mb-4"
            >
              <AlertCircle size={14} />
              The Emergency Gap
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-heading font-bold text-heading leading-[1.1]">
              In emergencies, <br />
              <span className="text-accent underline decoration-error/30">
                minutes are milestones.
              </span>
            </h2>
          </div>
          <p className="text-body text-lg max-w-sm font-medium border-l-4 border-accent pl-6">
            We replace frantic phone calls with verified data, giving you the
            clarity to act fast.
          </p>
        </div>

        {/* The Comparison Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          {/* Left: The Problem (4 Columns) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-5 bg-slate-50 rounded-[2rem] p-8 border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-8 text-slate-400">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <TrendingDown size={24} />
              </div>
              <span className="font-bold uppercase text-sm tracking-widest">
                Traditional Way
              </span>
            </div>
            <ul className="space-y-6">
              {beforeItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-slate-500 opacity-70"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                    ✕
                  </div>
                  <span className="text-base font-medium line-through">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: The NearH Solution (7 Columns) */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-7 bg-heading rounded-[2rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl"
          >
            {/* Decorative SVG Wave */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <Activity
                size={300}
                className="translate-x-1/4 -translate-y-1/4"
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-accent rounded-lg">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <span className="font-bold uppercase text-sm tracking-widest text-blue-200">
                  The NearH Standard
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {afterItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <CheckCircle2 size={20} className="text-success" />
                    <span className="text-sm lg:text-base font-semibold leading-tight">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-24">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group text-center sm:text-left">
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-badge-bg text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <step.icon size={32} />
              </div>
              <h3 className="text-xl font-heading font-bold text-heading mb-2">
                {step.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {step.description}
              </p>
              {idx !== 2 && (
                <div className="hidden sm:block absolute top-8 left-full w-full border-t-2 border-dashed border-border -z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Impact Stats Section */}
        <div className="rounded-[3rem] bg-accent p-8 lg:p-16 relative overflow-hidden shadow-3xl shadow-blue-500/20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {impactStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center text-white"
              >
                <div className="mb-4 p-3 bg-white/20 rounded-xl backdrop-blur-md">
                  <stat.icon size={28} />
                </div>
                <div className="text-5xl lg:text-6xl font-black mb-1 tracking-tighter">
                  {stat.value}
                </div>
                <div className="font-bold text-blue-100 uppercase text-xs tracking-[0.2em]">
                  {stat.label}
                </div>
                <div className="text-white/60 text-xs mt-2 italic">
                  {stat.subtext}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl lg:text-5xl font-heading font-bold text-heading mb-6">
            Ready to secure a life?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-10 py-5 bg-accent text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Join the Network <ArrowRight size={20} />
            </Link>
            <Link
              href="/about-us"
              className="w-full sm:w-auto px-10 py-5 bg-white text-heading border-2 border-border rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              View Hospitals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    icon: Search,
    title: "Locate",
    description: "Filter by ICU, ventilators, or blood type in real-time.",
  },
  {
    icon: Zap,
    title: "Verify",
    description: "Our systems sync with hospital HMS every 5 minutes.",
  },
  {
    icon: PhoneCall,
    title: "Navigate",
    description: "Direct emergency routing and pre-arrival contact.",
  },
];

const beforeItems = [
  "Endless phone calls during crisis",
  "Outdated data and false hope",
  "Zero transparency on pricing",
  "Wasted travel to 'Full' hospitals",
];

const afterItems = [
  "One-tap real-time directory",
  "Data synced every 5 minutes",
  "Verified bed availability counts",
  "Emergency navigation routes",
];

const impactStats = [
  {
    icon: Users,
    value: "10k+",
    label: "Lives Guided",
    subtext: "To critical care",
  },
  {
    icon: Heart,
    value: "500+",
    label: "Hospitals",
    subtext: "Verified partners",
  },
  {
    icon: Clock,
    value: "12m",
    label: "Response",
    subtext: "Time reduced by 85%",
  },
];
