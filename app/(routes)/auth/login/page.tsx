"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/lib/validations/auth";
import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Activity,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router=useRouter();
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
  setIsLoading(true);
  setServerError(null);

  const result = await login(data);

  if (result.success) {
    router.push("/admin/dashboard"); // just push, no refresh
  } else {
    setServerError(result.message);
    setIsLoading(false);
  }
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Full-bleed background photo ── */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1538108149393-fbbd81895907"
          alt="Modern Hospital Building"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Deep dark overlay — ensures ALL text over photo is white-readable */}
      <div className="absolute inset-0 bg-[#0a1628]/55" />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 bg-radial-gradient"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* ── Top-left logo ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-8 left-10 flex items-center gap-2.5 z-20"
      >
        <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/40">
          <Activity size={18} className="text-white" />
        </div>
        <Link
          href={"/"}
          className="text-2xl font-black text-white tracking-tight"
        >
          NearH
        </Link>
      </motion.div>

      {/* ── Bottom-left brand copy — only on lg ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-10 left-10 z-20 hidden lg:block max-w-sm"
      >
        <p className="text-white font-black text-3xl leading-tight tracking-tight mb-3">
          Every second
          <br />
          counts.
        </p>
        <p className="text-white/55 text-sm leading-relaxed">
          Real-time bed availability and referral coordination for hospitals
          across India.
        </p>
        <div className="flex items-center gap-5 mt-5">
          {[
            { value: "500+", label: "Hospitals" },
            { value: "10k+", label: "Lives guided" },
            { value: "5 min", label: "Data sync" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white font-black text-lg leading-none">
                {s.value}
              </p>
              <p className="text-white/45 text-[10px] uppercase tracking-widest font-bold mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Floating form card — right side on lg, centered on mobile ── */}
      <div className="relative z-20 w-full flex justify-center lg:justify-end lg:pr-20 xl:pr-28 px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden"
        >
          {/* Card top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-link)]" />

          <div className="p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-badge-bg)] border border-[var(--color-border)] text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-widest mb-4">
                <ShieldCheck size={11} />
                Hospital Portal
              </div>
              <h2 className="text-2xl font-black text-[var(--color-heading)] tracking-tight leading-tight">
                Welcome back
              </h2>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Sign in to your hospital dashboard
              </p>
            </div>

            {/* Server error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl mb-5"
              >
                <Heart
                  size={14}
                  className="text-[var(--color-error)] flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-[var(--color-error)] font-medium">
                  {serverError}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[10px] font-bold text-[var(--color-heading)] uppercase tracking-widest block"
                >
                  Official Email
                </label>
                <div className="relative group">
                  <Mail
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] group-focus-within:text-[var(--color-accent)] transition-colors"
                  />
                  <input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="admin@hospital.com"
                    className="w-full pl-11 pr-4 py-3 bg-[var(--color-badge-bg)] border border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-heading)] placeholder:text-[var(--color-muted)] placeholder:font-normal outline-none focus:bg-white focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/10 transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-[var(--color-error)] font-semibold pl-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-bold text-[var(--color-heading)] uppercase tracking-widest"
                  >
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[10px] font-bold text-[var(--color-accent)] hover:underline uppercase tracking-widest"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] group-focus-within:text-[var(--color-accent)] transition-colors"
                  />
                  <input
                    id="password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 bg-[var(--color-badge-bg)] border border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-heading)] placeholder:text-[var(--color-muted)] outline-none focus:bg-white focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-[var(--color-error)] font-semibold pl-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-black rounded-xl shadow-lg shadow-[var(--color-accent)]/30 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all mt-1"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Login to Dashboard
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-sm text-center text-[var(--color-muted)] mt-6">
              New hospital?{" "}
              <Link
                href="/auth/signup"
                className="font-bold text-[var(--color-accent)] hover:underline"
              >
                Register here
              </Link>
            </p>

            {/* Trust */}
            <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-[var(--color-border)]">
              <ShieldCheck size={12} className="text-[var(--color-muted)]" />
              <p className="text-[9px] text-[var(--color-muted)] font-bold uppercase tracking-widest">
                256-bit encrypted · HIPAA compliant
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
