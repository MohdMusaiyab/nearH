"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  Activity,
} from "lucide-react";
import { updateUserPassword } from "@/actions/auth";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    startTransition(async () => {
      const res = await updateUserPassword(formData.password);
      if (res.success) {
        router.push(
          "/auth/login?message=Password updated successfully. Please log in with your new credentials.",
        );
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {}
      <img
        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=85"
        alt="Hospital"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#0a1628]/75" />

      {}
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

      {}
      <div className="relative z-20 w-full flex justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-accent to-link" />

          <div className="p-8">
            <div className="mb-7 text-center">
              <div className="w-12 h-12 bg-badge-bg text-accent rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-black text-heading tracking-tight uppercase leading-tight">
                New <span className="text-accent">Secret.</span>
              </h2>
              <p className="text-sm text-muted mt-1 font-medium">
                Update your credentials for secure access.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-heading uppercase tracking-widest ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent"
                    size={16}
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-11 pr-12 py-3 bg-badge-bg border border-border rounded-xl text-sm font-semibold text-heading placeholder:text-muted outline-none focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-heading uppercase tracking-widest ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent"
                    size={16}
                  />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-badge-bg border border-border rounded-xl text-sm font-semibold text-heading placeholder:text-muted outline-none focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 p-3 rounded-xl animate-shake">
                  <p className="text-[10px] font-bold text-error text-center uppercase tracking-tight">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-black hover:bg-zinc-800 text-white text-sm font-black rounded-xl shadow-lg shadow-black/20 disabled:opacity-60 transition-all mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Updating...
                  </>
                ) : (
                  "Update & Logout"
                )}
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-border text-center">
              <p className="text-[9px] text-muted font-bold uppercase tracking-[0.2em]">
                System Security Protocol Active
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
