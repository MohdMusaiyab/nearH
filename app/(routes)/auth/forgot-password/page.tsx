"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Loader2,
  CheckCircle2,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { requestPasswordReset } from "@/actions/auth";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background Photo (Same as Login) ── */}
      <img
        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=85"
        alt="Hospital"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#0a1628]/75" />

      {/* ── Top-left logo ── */}
      <div className="absolute top-8 left-10 flex items-center gap-2.5 z-20">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40">
          <Activity size={18} className="text-white" />
        </div>
        <Link
          href="/"
          className="text-2xl font-black text-white tracking-tight"
        >
          NearH
        </Link>
      </div>

      {/* ── Card Container ── */}
      <div className="relative z-20 w-full flex justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden"
        >
          {/* Card top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-accent to-link" />

          <div className="p-8">
            {/* Header */}
            <div className="mb-7">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest hover:underline mb-4"
              >
                <ArrowLeft size={12} /> Back to Login
              </Link>
              <h2 className="text-2xl font-black text-heading tracking-tight leading-tight">
                Recover{" "}
                <span className="text-accent">Access.</span>
              </h2>
              <p className="text-sm text-muted mt-1">
                Enter your email to receive a secure reset link.
              </p>
            </div>

            {message?.type === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center"
              >
                <CheckCircle2
                  className="mx-auto text-emerald-500 mb-3"
                  size={32}
                />
                <p className="text-sm font-bold text-emerald-800 uppercase tracking-tight leading-snug">
                  {message.text}
                </p>
                <p className="text-[10px] text-emerald-600 mt-2 font-bold uppercase tracking-widest">
                  Check your inbox & spam
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-[10px] font-bold text-heading uppercase tracking-widest ml-1"
                  >
                    Official Email
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors"
                      size={15}
                    />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-badge-bg border border-border rounded-xl text-sm font-semibold text-heading placeholder:text-muted outline-none focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                      placeholder="admin@hospital.com"
                    />
                  </div>
                </div>

                {message?.type === "error" && (
                  <p className="text-xs font-bold text-error text-center bg-red-50 p-2 rounded-lg">
                    {message.text}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-black rounded-xl shadow-lg shadow-accent/30 disabled:opacity-60 transition-all mt-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />{" "}
                      Verifying...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-5 border-t border-border">
              <ShieldCheck size={12} className="text-muted" />
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">
                Identity Verification Required
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
