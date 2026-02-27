"use client";

import React from "react";
import { easeOut, motion } from "framer-motion";
import { Activity, Search, ArrowRight, Zap, Clock, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const stats = [
  {
    label: "Inventory Sync",
    value: "< 5 Min",
    icon: Activity,
    color: "text-blue-500",
  },
  {
    label: "Search Latency",
    value: "Sub-Sec",
    icon: Zap,
    color: "text-amber-500",
  },
  {
    label: "Service Uptime",
    value: "24/7",
    icon: Clock,
    color: "text-emerald-500",
  },
  {
    label: "Grid Coverage",
    value: "Multi-City",
    icon: Globe,
    color: "text-indigo-500",
  },
];
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

export const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden py-20 lg:py-0">
      {}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://wallpapercave.com/wp/wp2968489.jpg"
          alt="Healthcare background"
          fill
          priority
          quality={100}
          className="object-cover"
          sizes="100vw"
        />
        {}
        {}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent hidden lg:block" />

        {}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent lg:hidden" />

        {}
        <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            className="text-center lg:text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-6"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              Live Healthcare Network
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-heading leading-[1] tracking-tighter mb-6"
            >
              Health <br />
              <span className="text-accent">Simplified.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-body font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10"
            >
              Access real-time insights into hospital beds, ICU availability,
              and blood banks. We bridge the gap between emergency and care.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/explore"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white rounded-xl font-bold shadow-xl shadow-blue-600/20 hover:bg-accent-hover transition-all active:scale-95"
              >
                <Search size={20} />
                Find Emergency Care
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href={"/about-us"}
                className="px-8 py-4 bg-white border border-border text-heading rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                About Us
              </Link>
            </motion.div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-2 gap-4 md:gap-6"
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`p-6 md:p-8 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white shadow-xl flex flex-col items-center lg:items-start text-center lg:text-left ${idx % 2 !== 0 ? "lg:translate-y-8" : ""}`}
              >
                <div className={`p-3 rounded-2xl bg-white shadow-inner mb-4`}>
                  <stat.icon size={28} className={stat.color} />
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-heading mb-1">
                  {stat.value}
                </h4>
                <p className="text-muted text-sm md:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            ))}

            {}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-[120px] rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
