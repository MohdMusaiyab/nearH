import { createClient } from "@/lib/supabase/server";
import RegistrationForm from "@/components/auth/RegistrationForm";
import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default async function SignupPage() {
  const supabase = await createClient();
  const { data: locations } = await supabase
    .from("locations")
    .select("id, city, state")
    .order("city", { ascending: true });

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-bleed background photo */}
      <Image
        width={500}
        height={500}
        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=85"
        alt="Hospital"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0a1628]/80" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Top-left logo */}
      <div className="absolute top-8 left-6 sm:left-10 flex items-center gap-2.5 z-20">
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

      {/* Bottom-left brand copy — lg only */}
      <div className="absolute bottom-10 left-10 z-20 hidden lg:block max-w-xs">
        <p className="text-white font-black text-3xl leading-tight tracking-tight mb-3">
          Join India&apos;s
          <br />
          care network.
        </p>
        <p className="text-white/55 text-sm leading-relaxed">
          Register your hospital to start coordinating beds and referrals in
          real time.
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
      </div>

      {/* Main content — scrollable, centered or right-aligned on lg */}
      <div className="relative z-20 w-full flex justify-center lg:justify-end lg:pr-20 xl:pr-28 px-4 sm:px-6 py-20 sm:py-24">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-accent to-link" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-badge-bg border border-border text-accent text-[10px] font-bold uppercase tracking-widest mb-4">
                <ShieldCheck size={11} />
                Hospital Onboarding
              </div>
              <h2 className="text-2xl font-black text-heading tracking-tight leading-tight">
                Register your hospital
              </h2>
              <p className="text-sm text-muted mt-1">
                Already registered?{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-accent hover:underline"
                >
                  Sign in to dashboard
                </Link>
              </p>
            </div>

            {/* The form */}
            <RegistrationForm locations={locations || []} />

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
