"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  LifeBuoy,
  Globe,
  AlertCircle,
  Clock,
  Activity,
  PhoneOff,
} from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Zap,
    title: "Speed as a Priority",
    desc: "In a cardiac arrest or trauma, every second counts. We reduce the search time from hours to seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Integrity",
    desc: "We don't show 'estimated' data. Our network is built on direct, verified hospital HMS integration.",
  },
  {
    icon: Heart,
    title: "Empathy First",
    desc: "We build for the person standing outside an ICU at 2 AM. Their peace of mind is our primary metric.",
  },
];

const narrativeSteps = [
  {
    id: 1,
    title: "The Crisis of Information",
    description:
      "Every year, thousands of lives are lost in India not because of a lack of doctors, but because of a lack of real-time data. Families spend the 'Golden Hour' making frantic calls.",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070",
    icon: PhoneOff,
    points: [
      "Eliminating the 'Bed Unavailable' surprise.",
      "Real-time visibility for ICUs.",
      "Unified emergency network.",
    ],
  },
  {
    id: 2,
    title: "The Wall of Uncertainty",
    description:
      "Arriving at a hospital only to be turned away is a heartbreak we can prevent. We bridge the gap between emergency sirens and hospital entry gates.",
    image:
      "https://images.unsplash.com/photo-1586773860418-d3b97978c65a?q=80&w=2070",
    icon: AlertCircle,
    points: [
      "Verified ambulance routing.",
      "Direct HMS data sync.",
      "GPS-enabled facility tracking.",
    ],
  },
  {
    id: 3,
    title: "Clarity in the Chaos",
    description:
      "Our platform updates every 60 seconds. When a bed opens up in a crowded city, you see it instantly. No middlemen, no outdated spreadsheets.",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070",
    icon: Clock,
    points: [
      "Live ventilator counts.",
      "Blood bank inventory.",
      "Specialist availability status.",
    ],
  },
];
export default function AboutPage() {
  const [index, setIndex] = useState(0);

  // Auto-slide logic: 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % narrativeSteps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <main className="bg-white">
      {/* --- Hero Section: The Mission Statement --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-heading/5 text-heading font-bold text-xs uppercase tracking-widest mb-6">
              <LifeBuoy size={14} className="text-accent" /> Our Purpose
            </span>
            <h1 className="text-5xl lg:text-7xl font-heading font-black text-heading leading-[1.1] mb-8">
              Because a hospital bed <br />
              <span className="text-accent underline decoration-heading decoration-4 underline-offset-8">
                shouldn&apos;t be a luxury.
              </span>
            </h1>
            <p className="text-xl text-body font-medium leading-relaxed mb-10">
              NearH was born out of a simple, painful realization: in the
              world&apos;s fastest-growing economy, finding emergency care is
              still a matter of luck. We are changing that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- The Problem vs. The Solution (Storytelling) --- */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }} // Starts from right
                animate={{ opacity: 1, x: 0 }} // Slides to center
                exit={{ opacity: 0, x: -100 }} // Slides out to left
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="grid lg:grid-cols-2 gap-16 items-center"
              >
                {/* Left Side: Dynamic Image */}
                <div className="relative h-[400px] lg:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                  <Image
                    src={narrativeSteps[index].image}
                    alt={narrativeSteps[index].title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-heading/10 mix-blend-multiply" />

                  {/* Floating Icon Badge */}
                  <div className="absolute top-8 left-8 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl">
                    {React.createElement(narrativeSteps[index].icon, {
                      className: "w-8 h-8 text-accent",
                    })}
                  </div>
                </div>

                {/* Right Side: Dynamic Content */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4 text-accent font-bold uppercase tracking-widest text-xs">
                    <Activity size={16} /> Step 0{index + 1}
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-heading font-bold text-heading mb-6 leading-tight">
                    {narrativeSteps[index].title}
                  </h2>
                  <p className="text-body text-xl mb-8 leading-relaxed">
                    {narrativeSteps[index].description}
                  </p>

                  <div className="space-y-4">
                    {narrativeSteps[index].points.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-3 text-heading font-bold"
                      >
                        <CheckCircle2 className="text-success" size={22} />
                        <span>{point}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Indicators */}
                  <div className="flex gap-2 mt-12">
                    {narrativeSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${index === i ? "w-12 bg-accent" : "w-4 bg-slate-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- Our Values: The "VVIP" Cards --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold text-heading">
              The Principles that Drive Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 transition-all"
              >
                <div className="w-14 h-14 bg-heading rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-heading/20">
                  <value.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-heading mb-4">
                  {value.title}
                </h3>
                <p className="text-body leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Impact Stats --- */}
      <section className="py-24 relative overflow-hidden bg-heading">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                500+
              </div>
              <div className="text-accent font-bold uppercase tracking-widest text-sm">
                Partner Hospitals
              </div>
            </div>
            <div>
              <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                10k+
              </div>
              <div className="text-accent font-bold uppercase tracking-widest text-sm">
                Emergencies Guided
              </div>
            </div>
            <div>
              <div className="text-6xl font-black text-white mb-2 tracking-tighter">
                24/7
              </div>
              <div className="text-accent font-bold uppercase tracking-widest text-sm">
                Live Monitoring
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Final CTA: The Human Connection --- */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-accent rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
              <Globe size={200} className="text-white" />
            </div>

            <h2 className="text-3xl lg:text-5xl font-heading font-black text-white mb-8 relative z-10">
              Building a safer India, <br /> one bed at a time.
            </h2>
            <p className="text-blue-50 text-xl mb-10 max-w-2xl mx-auto relative z-10">
              Are you a healthcare provider? Join the network and help us ensure
              that no patient is ever left without a choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="px-10 py-5 bg-white text-heading font-black rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                Register Your Hospital <ArrowRight size={20} />
              </button>
              <button className="px-10 py-5 bg-heading text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all">
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
