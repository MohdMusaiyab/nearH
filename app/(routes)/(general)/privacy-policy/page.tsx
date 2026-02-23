"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  Database,
  FileText,
  Clock,
  ChevronRight,
  CheckCircle2,
  PhoneCall,
  UserIcon,
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
      {/* --- Header Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-24 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <ShieldCheck size={400} className="text-heading translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-xs uppercase tracking-widest mb-6">
              <Lock size={14} /> Trust & Security
            </div>
            <h1 className="text-5xl lg:text-7xl font-heading font-black text-heading leading-tight mb-8">
              Your Health Data, <br />
              <span className="text-accent underline decoration-heading decoration-4 underline-offset-8">
                Under Lock and Key.
              </span>
            </h1>
            <p className="text-xl text-body font-medium leading-relaxed">
              At NearH, we treat your privacy as a medical emergency. We have
              built a zero-trust architecture where patient data is only
              accessible to those saving your life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- Core Protections --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {securityPrinciples.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="w-16 h-16 bg-heading rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-heading/20 group-hover:scale-110 transition-transform">
                  <item.icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-heading mb-4">
                  {item.title}
                </h3>
                <p className="text-body leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Data Access Breakdown: The "Admin Vault" --- */}
      {/* --- Data Access Breakdown: The "Admin Vault" --- */}
      <section className="py-24 bg-heading relative overflow-hidden">
        {/* Subtle texture to give depth to the dark blue */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Fixed Visibility: Pure White Heading */}
              <h2 className="text-4xl lg:text-6xl font-heading font-black text-accent text-white mb-8 leading-tight">
                Strict Access <br />
                <span className="text-accent">Controls.</span>
              </h2>

              {/* Fixed Visibility: High-contrast light blue text */}
              <p className="text-blue-50/80 text-lg mb-12 leading-relaxed max-w-lg">
                We believe in data minimization. We only collect what is
                absolutely necessary to facilitate emergency hospital
                admissions. Everything else stays with you.
              </p>

              <div className="space-y-4">
                {[
                  {
                    label: "Patient Name & Age",
                    access: "Admin Only",
                    icon: UserIcon,
                  },
                  {
                    label: "Medical Prescription",
                    access: "Admitting Doctor Only",
                    icon: FileText,
                  },
                  {
                    label: "Contact Details",
                    access: "Emergency Coordinator",
                    icon: PhoneCall,
                  },
                  {
                    label: "Medical History",
                    access: "End-to-End Encrypted",
                    icon: ShieldCheck,
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <row.icon size={18} className="text-white" />
                      </div>
                      {/* Pure White for Row Labels */}
                      <span className="font-bold text-white tracking-tight">
                        {row.label}
                      </span>
                    </div>

                    {/* High visibility badge */}
                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white bg-accent px-4 py-2 rounded-lg shadow-lg shadow-accent/20">
                      {row.access}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Card: Clean White Container */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative"
            >
              <div className="absolute top-0 right-0 p-10 text-slate-50 pointer-events-none">
                <Database size={140} />
              </div>

              <h3 className="text-2xl font-bold text-heading mb-6 flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Clock className="text-accent" size={20} />
                </div>
                Data Retention
              </h3>

              <p className="text-body text-base mb-10 leading-relaxed relative z-10">
                Patient records created for referral cases are automatically
                archived after admission. We do not sell, trade, or share your
                medical data with insurance companies or third-party
                advertisers.
              </p>

              <ul className="space-y-5 relative z-10">
                {[
                  "256-bit AES Encryption at rest",
                  "ISO 27001 Data Compliance",
                  "Immutable Audit logs for every access",
                ].map((check, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-heading font-bold text-sm"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="text-success" size={16} />
                    </div>
                    {check}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Simple FAQ Footer --- */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-heading mb-12">
            Common Questions
          </h2>
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h4 className="font-bold text-heading mb-2">
                Can other hospitals see my data?
              </h4>
              <p className="text-body text-sm">
                No. Only the hospital you are being referred to has the
                permission to decrypt your data.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
              <h4 className="font-bold text-heading mb-2">
                Is my prescription shared with anyone?
              </h4>
              <p className="text-body text-sm">
                Prescriptions are only stored to help the receiving ICU prepare
                for your arrival.
              </p>
            </div>
          </div>

          <button className="mt-16 inline-flex items-center gap-2 text-accent font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
            Read Full Legal Documentation <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
