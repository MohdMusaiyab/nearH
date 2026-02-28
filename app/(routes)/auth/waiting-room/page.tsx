import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  Mail,
  Activity,
  LogOut,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default async function WaitingRoom() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.status === "approved") {
    redirect("/admin/dashboard");
  }

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-24">
      {/* Background photo */}
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

      {/* Dark overlay — lighter at top so the transparent nav reads cleanly */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/10 via-[#0a1628]/20 to-[#0a1628]/40" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Floating ambient orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        }}
      />
      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-accent to-link" />

          <div className="p-7 sm:p-9">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-badge-bg border border-border flex items-center justify-center">
                  <Clock
                    size={36}
                    className="text-accent animate-pulse"
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute -inset-2 rounded-2xl border-2 border-border border-dashed animate-[spin_12s_linear_infinite]" />
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-badge-bg border border-border text-accent text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={11} />
                Verification Pending
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-7">
              <h1 className="text-2xl font-black text-heading tracking-tight leading-tight mb-2">
                Hang tight, {firstName}!
              </h1>
              <p className="text-sm text-muted leading-relaxed">
                Your hospital registration is under review by our team. We&apos;ll
                verify your details and get back to you shortly.
              </p>
            </div>

            {/* Info cards */}
            <div className="space-y-3 mb-7">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-badge-bg border border-border">
                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck
                    size={15}
                    className="text-accent"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-heading mb-0.5">
                    Security Verification
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    We validate the legal name, emergency contacts, and
                    credentials of every hospital before approval.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-badge-bg border border-border">
                <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={15} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold text-heading mb-0.5">
                    Email Notification
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    Once approved, you&apos;ll receive a confirmation at{" "}
                    <span className="font-semibold text-heading">
                      {user.email}
                    </span>{" "}
                    with dashboard access details.
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated time pill */}
            <div className="flex items-center justify-center gap-2 mb-7">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest whitespace-nowrap px-2">
                Typically within 24 – 48 hrs
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-black rounded-xl shadow-lg shadow-accent/30 active:scale-[0.98] transition-all"
              >
                Back to Homepage
                <ArrowRight size={16} />
              </Link>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-bold text-muted hover:text-heading hover:border-heading hover:bg-badge-bg active:scale-[0.98] transition-all"
                >
                  <LogOut size={14} />
                  Sign out & check later
                </button>
              </form>
            </div>

            {/* Trust footer */}
            <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-border">
              <ShieldCheck size={12} className="text-muted" />
              <p className="text-[9px] text-muted font-bold uppercase tracking-widest">
                256-bit encrypted · HIPAA compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
