"use client";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  EyeOff,
  UserCheck,
  Database,
  FileText,
  Clock,
  CheckCircle2,
  PhoneCall,
  UserIcon,
  ShieldAlert,
} from "lucide-react";

const securityPrinciples = [
  {
    icon: EyeOff,
    title: "Zero Public Access",
    desc: "Your medical data is never visible to other users. Search results only show hospital availability, never patient identities.",
  },
  {
    icon: UserCheck,
    title: "Admin-Only Visibility",
    desc: "Only verified hospital administrators can access patient profiles, limited to core details required for emergency intake.",
  },
  {
    icon: FileText,
    title: "Referral-Specific Use",
    desc: "Patient records are only processed during active referral cases to ensure a seamless transfer between medical facilities.",
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="bg-white min-h-screen">
      {}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {}
        <div
          className="absolute inset-0 opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-badge-bg)] text-[var(--color-accent)] text-[10px] font-black uppercase tracking-widest mb-8 border border-[var(--color-accent)]/10 shadow-sm">
              <ShieldAlert size={14} /> Data Sovereignty Protocol
            </div>
            <h1 className="text-5xl lg:text-8xl font-black text-[var(--color-heading)] tracking-tighter leading-[0.9] uppercase mb-10">
              Your Health Data, <br />
              <span className="text-[var(--color-accent)]">
                Under Lock & Key.
              </span>
            </h1>
            <p className="text-[var(--color-muted)] text-sm font-bold uppercase tracking-widest leading-relaxed border-l-2 border-[var(--color-accent)] pl-6 max-w-2xl">
              NearH utilizes a zero-trust architecture. Patient telemetry and
              personal identifiers are encrypted at the edge and only decrypted
              by authorized clinical nodes.
            </p>
          </motion.div>
        </div>
      </section>

      {}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {securityPrinciples.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-10 rounded-[3rem] border border-[var(--color-border)] bg-white shadow-xl shadow-slate-200/20 transition-all"
              >
                <div className="w-14 h-14 bg-[var(--color-heading)] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-black text-[var(--color-heading)] uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {}
            <div className="lg:col-span-7">
              <div className="mb-12">
                <p className="text-[10px] font-black text-[var(--color-accent)] uppercase tracking-[0.3em] mb-4">
                  Access Matrix
                </p>
                <h2 className="text-4xl lg:text-6xl font-black text-[var(--color-heading)] tracking-tighter uppercase leading-[0.9] mb-6">
                  Strict Access <br /> Controls.
                </h2>
                <p className="text-[var(--color-muted)] text-sm font-medium leading-relaxed max-w-md">
                  We enforce data minimization. Only specific clinical roles can
                  access the corresponding data fragments during an active
                  emergency.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Patient Identity",
                    access: "Admin Only",
                    icon: UserIcon,
                  },
                  {
                    label: "Clinical Rx",
                    access: "Attending Doctor",
                    icon: FileText,
                  },
                  {
                    label: "Emergency Contact",
                    access: "Coordinator Only",
                    icon: PhoneCall,
                  },
                  {
                    label: "Medical History",
                    access: "E2E Encrypted",
                    icon: ShieldCheck,
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-[var(--color-border)] group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
                        <row.icon size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[11px] font-black text-[var(--color-heading)] uppercase tracking-widest">
                        {row.label}
                      </span>
                    </div>

                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--color-muted)] bg-white px-4 py-2 rounded-lg border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/20 transition-all">
                      {row.access}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="lg:col-span-5 pt-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-[var(--color-heading)] rounded-[3rem] p-10 lg:p-14 text-white relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Database size={200} />
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)] flex items-center justify-center mb-8">
                    <Clock className="text-white" size={24} />
                  </div>

                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">
                    Data Retention & <br /> Purge Protocol
                  </h3>

                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                    Patient records generated during referral are automatically
                    archived 72 hours post-admission. We strictly do not share
                    data with insurance brokers or third-party advertisers.
                  </p>

                  <ul className="space-y-5">
                    {[
                      "256-bit AES Encryption",
                      "ISO 27001 Compliance",
                      "Immutable Audit Logs",
                    ].map((check, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <CheckCircle2
                            className="text-white"
                            size={12}
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-100">
                          {check}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-slate-50 border-t border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-[var(--color-heading)] tracking-tighter uppercase mb-16 leading-[0.9]">
            Common{" "}
            <span className="text-[var(--color-accent)]">Protocols.</span>
          </h2>

          <div className="space-y-4 text-left">
            <div className="p-8 rounded-3xl bg-white border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all">
              <h4 className="text-[11px] font-black text-[var(--color-heading)] uppercase tracking-[0.2em] mb-3">
                Inter-Hospital Isolation
              </h4>
              <p className="text-[var(--color-muted)] text-sm font-medium leading-relaxed">
                Hospitals cannot cross-query patient data. Only the single
                destination facility receives the temporary decryption key for
                your medical profile.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all">
              <h4 className="text-[11px] font-black text-[var(--color-heading)] uppercase tracking-[0.2em] mb-3">
                Prescription Handling
              </h4>
              <p className="text-[var(--color-muted)] text-sm font-medium leading-relaxed">
                Medical Rx data is strictly for ICU preparation. Once admission
                is confirmed, the file is moved to the hospital&apos;s private
                internal HMS.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
