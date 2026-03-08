"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {}
      <div
        className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-lg w-full text-center relative z-10">
        {}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent/10 rounded-[2.5rem] blur-2xl scale-150"></div>
            <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-border">
              <ShieldAlert className="w-16 h-16 text-accent stroke-[1.5]" />
            </div>
          </div>
        </motion.div>

        {}
        <div className="space-y-4 mb-12">
          <h1 className="text-[120px] font-black text-slate-100 leading-none tracking-tighter select-none">
            404
          </h1>
          <div className="space-y-2 ">
            <h2 className="text-2xl font-black text-heading uppercase tracking-tight">
              Resource Not Found
            </h2>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">
              Protocol Error: Terminal Endpoint Unavailable
            </p>
          </div>
          <p className="text-muted font-medium leading-relaxed max-w-sm mx-auto text-sm">
            The clinical data or directory page you are attempting to access has
            been moved or purged from the live grid.
          </p>
        </div>

        {}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-heading text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Return to Core
          </Link>

          <Link
            href={"/explore"}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-heading font-black text-[10px] uppercase tracking-widest rounded-2xl border border-border hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Find Hospitals
          </Link>
        </div>

        {}
        <div className="mt-16 pt-8 border-t border-slate-50">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            If this persistence continues, contact the <br />
            <span className="text-accent font-black cursor-pointer hover:underline">
              System Intelligence Bureau
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
