// components/home/ForHospitalAdmins.tsx
"use client";

import Link from "next/link";
import {
  Shield,
  TrendingUp,
  Users,
  Clock,
  BellRing,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  CalendarClock,
  Ambulance,
  Stethoscope,
  Building2,
  HeartPulse,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export function ForHospitalAdmins() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Visibility",
      description:
        "Get discovered by patients actively searching for care in your area.",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Update bed availability instantly. No phone calls, no delays.",
    },
    {
      icon: Users,
      title: "Direct Referrals",
      description:
        "Receive patient referrals directly from other hospitals in the network.",
    },
    {
      icon: BellRing,
      title: "Emergency Alerts",
      description:
        "Get notified when patients need your specialized care urgently.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track occupancy trends, peak hours, and patient demographics.",
    },
    {
      icon: Shield,
      title: "Verified Badge",
      description: "Build trust with patients through our verification system.",
    },
  ];

  const stats = [
    { label: "Active Hospitals", value: "500+", icon: Building2 },
    { label: "Daily Searches", value: "10k+", icon: TrendingUp },
    { label: "Avg Response Time", value: "< 5min", icon: Clock },
    { label: "Successful Referrals", value: "2.5k+", icon: HeartPulse },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent" />

      {/* Animated Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">
              For Hospital Administrators
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Join the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-400">
              Healthcare Network
            </span>
          </h2>
          <p className="text-xl text-indigo-200 leading-relaxed">
            Stop wasting time on phone calls. Update availability in real-time
            and receive direct referrals from other hospitals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-sm text-indigo-300">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3">{benefit.title}</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-indigo-600/50 to-purple-600/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-400 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-black text-indigo-900">
                    DR
                  </span>
                </div>
              </div>
              <div>
                <p className="text-lg italic mb-4 text-indigo-100">
                  "We've reduced our incoming phone calls by 70% since joining
                  NearH. Patients now check availability online first, and
                  referrals come directly through the platform. It's transformed
                  our admission process."
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-black">Dr. Rajesh Kumar</p>
                    <p className="text-sm text-indigo-300">
                      Medical Director, City Hospital
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles key={star} className="w-4 h-4 fill-amber-300" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* For New Hospitals */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-8 border border-white/20 hover:scale-[1.02] transition-all">
            <Building2 className="w-12 h-12 mb-6" />
            <h3 className="text-2xl font-black mb-3">New to NearH?</h3>
            <p className="text-indigo-200 mb-6">
              List your hospital on our network and start reaching patients
              today.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Free 30-day trial",
                "No credit card required",
                "Setup in under 10 minutes",
                "Dedicated onboarding specialist",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup?type=hospital"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all group"
            >
              List Your Hospital
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* For Existing Admins */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 border border-white/20 hover:scale-[1.02] transition-all">
            <Stethoscope className="w-12 h-12 mb-6" />
            <h3 className="text-2xl font-black mb-3">Already Registered?</h3>
            <p className="text-purple-200 mb-6">
              Access your dashboard to update inventory, manage referrals, and
              view analytics.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <CalendarClock className="w-5 h-5 text-purple-300" />
                <span>Last updated: Today at 10:23 AM</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BellRing className="w-5 h-5 text-purple-300" />
                <span>3 new referral requests</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-black text-sm hover:bg-purple-50 transition-all group flex-1 justify-center"
              >
                Go to Dashboard
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/referrals"
                className="px-6 py-3 bg-purple-400 text-white rounded-xl font-black text-sm hover:bg-purple-300 transition-all"
              >
                View Referrals
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/20">
          <div className="flex items-center gap-2 text-indigo-300">
            <Shield className="w-5 h-5" />
            <span className="text-sm">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-300">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">Verified by Medical Council</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-300">
            <Users className="w-5 h-5" />
            <span className="text-sm">Trusted by 500+ Hospitals</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-300">
            <Clock className="w-5 h-5" />
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
