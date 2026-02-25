"use client";

import Image from "next/image";
import {
  MapPin,
  Award,
  Activity,
  BedDouble,
  ShieldCheck,
  Star,
} from "lucide-react";
import { HospitalProfile } from "../hospital/profile/types";
import { motion } from "framer-motion";

interface Props {
  hospital: HospitalProfile;
}

export function HeroSection({ hospital }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-[3rem] border border-[var(--color-border)] shadow-sm"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* ── Background Textures ── */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />

      {/* ── Main Layout ── */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-end justify-between">
          <div className="flex-1 space-y-6">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[var(--color-border)] text-[var(--color-accent)] text-[10px] font-black uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                Live Data Synchronized
              </div>
              {hospital.is_verified && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  Verified Facility
                </div>
              )}
            </div>

            {/* Title & Location */}
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-black text-[var(--color-heading)] tracking-tighter leading-[0.9] uppercase">
                {hospital.name}
              </h1>

              <div className="flex items-center gap-4 text-[var(--color-muted)]">
                {hospital.location && (
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-tight">
                    <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                    {hospital.location.city}, {hospital.location.state}
                  </div>
                )}
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <div className="text-[10px] font-black uppercase tracking-widest bg-[var(--color-heading)] text-white px-2 py-1 rounded-md">
                  Trauma Level {hospital.trauma_level || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* ── Real-time Inventory Chips (The "Explore Grid" Logic) ── */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto min-w-[320px]">
            <div className="p-5 bg-white rounded-[2rem] border border-[var(--color-border)] shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-badge-bg)] flex items-center justify-center text-[var(--color-accent)]">
                  <BedDouble size={16} />
                </div>
                <p className="text-[10px] font-black text-[var(--color-muted)] uppercase tracking-widest">
                  General
                </p>
              </div>
              <p className="text-3xl font-black text-[var(--color-heading)] tabular-nums">
                {hospital.inventory?.available_beds ?? 0}
              </p>
              <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase mt-1">
                Free Beds
              </p>
            </div>

            <div
              className="p-5 rounded-[2rem] border shadow-sm"
              style={{
                background: "color-mix(in srgb, var(--color-accent) 6%, white)",
                borderColor:
                  "color-mix(in srgb, var(--color-accent) 18%, transparent)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-white border border-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                  <Activity size={16} />
                </div>
                <p className="text-[10px] font-black text-[var(--color-accent)] uppercase tracking-widest">
                  ICU Status
                </p>
              </div>
              <p className="text-3xl font-black text-[var(--color-accent)] tabular-nums">
                {hospital.inventory?.icu_beds_available ?? 0}
              </p>
              <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase mt-1">
                Available Units
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Integration (Subtle, to maintain lightness) ── */}
      {hospital.primary_image && (
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <Image
            src={hospital.primary_image}
            alt={hospital.name}
            fill
            className="object-cover grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--gradient-hero)]" />
        </div>
      )}
    </div>
  );
}
