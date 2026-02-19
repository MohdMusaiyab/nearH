// components/home/WhyNearH.tsx
"use client";

import {
  AlertCircle,
  CheckCircle,
  Search,
  BarChart3,
  PhoneCall,
  Clock,
  Heart,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

export function WhyNearH() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Problem Statement */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full mb-6">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-rose-700">
              The Reality
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            During a medical emergency,{" "}
            <span className="text-rose-500">every minute counts</span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            But finding an available hospital bed shouldn't be one of them. We
            built NearH to solve one problem:{" "}
            <span className="font-bold text-indigo-600">
              real-time hospital availability, for everyone.
            </span>
          </p>
        </div>

        {/* 3-Step Solution */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent" />
                )}

                <div className="text-center relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <Icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Before vs After Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Before Card */}
          <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-2xl font-black text-rose-900">
                Before NearH
              </h3>
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-rose-400 text-xl">❌</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After Card */}
          <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-emerald-900">
                With NearH
              </h3>
            </div>
            <ul className="space-y-4">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-emerald-400 text-xl">✅</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-10 mb-20 text-white">
          <h3 className="text-3xl font-black text-center mb-12">
            ✨ The Difference We're Making
          </h3>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {impactStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black mb-2">{stat.value}</div>
                  <div className="text-indigo-100 font-medium">
                    {stat.label}
                  </div>
                  <div className="text-sm text-indigo-200 mt-1">
                    {stat.subtext}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Testimonial */}
          <div className="max-w-3xl mx-auto bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
                </div>
              </div>
              <div>
                <p className="text-lg italic mb-3">
                  "Found an ICU bed in 5 minutes during an emergency. This
                  platform saved my father."
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-bold">— Priya S.</span>
                  <span className="text-indigo-200">•</span>
                  <span className="text-indigo-200">Bengaluru</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-black text-slate-900 mb-6">
            Healthcare should be accessible, not a scavenger hunt
          </h3>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            We're on a mission to make every hospital bed visible, every blood
            unit countable, and every emergency manageable. Join us in building
            a healthier, more connected India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Join the Network
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold border-2 border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Data
const steps = [
  {
    icon: Search,
    title: "Search",
    description:
      "Find hospitals by location, specialty, or emergency care needs in seconds.",
  },
  {
    icon: BarChart3,
    title: "Compare",
    description:
      "Check real-time bed availability, ICU units, and blood bank status side-by-side.",
  },
  {
    icon: PhoneCall,
    title: "Connect",
    description:
      "Get instant contact details and directions to your chosen hospital.",
  },
];

const beforeItems = [
  "Calling hospital by hospital, wasting precious minutes",
  "Outdated information leading to false hope",
  "No way to compare options quickly",
  "Stress and uncertainty for families",
  "Arriving at hospitals with no beds available",
];

const afterItems = [
  "See all hospital availability at a single glance",
  "Real-time data updated every 5 minutes",
  "Easy comparison of beds, ICU, and blood banks",
  "Peace of mind with verified information",
  "Direct contact and navigation to available beds",
];

const impactStats = [
  {
    icon: Users,
    value: "10k+",
    label: "Patients Connected",
    subtext: "To available beds",
  },
  {
    icon: Heart,
    value: "500+",
    label: "Hospitals Partnered",
    subtext: "Across India",
  },
  {
    icon: Clock,
    value: "15min",
    label: "Avg Time to Find Bed",
    subtext: "Down from 2+ hours",
  },
];
