// components/home/Hero.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  BedDouble,
  Droplets,
  Stethoscope,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";

interface Stat {
  label: string;
  value: string;
  icon: typeof BedDouble;
  change: string;
}

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (location) params.set("location", location);
    router.push(`/explore?${params.toString()}`);
  };

  const stats: Stat[] = [
    {
      label: "Available Beds",
      value: "1,234",
      icon: BedDouble,
      change: "+12% this week",
    },
    {
      label: "Blood Units",
      value: "456",
      icon: Droplets,
      change: "+8% today",
    },
    {
      label: "Active Hospitals",
      value: "500+",
      icon: Stethoscope,
      change: "Across India",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-50" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column - Main Message */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">
                Trusted by 500+ hospitals across India
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Find Available
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Healthcare, Instantly
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Real-time bed availability, blood bank status, and doctor
              information across 500+ verified hospitals. When every minute
              counts.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search hospitals or specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-lg"
                  />
                </div>
                <div className="sm:w-64 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-bold text-base hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
                >
                  Search Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href="/explore"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
                >
                  Browse all hospitals →
                </Link>
              </div>
            </form>

            {/* Quick Categories */}
            <div className="flex flex-wrap gap-3 pt-4">
              <span className="text-sm text-slate-500 font-medium">
                Quick search:
              </span>
              <Link
                href="/explore?emergency=icu"
                className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all"
              >
                🚨 Emergency Care
              </Link>
              <Link
                href="/explore?service=icu"
                className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all"
              >
                🏥 ICU Available
              </Link>
              <Link
                href="/explore?blood=available"
                className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all"
              >
                🩸 Blood Bank
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-600">
                  Real-time updates
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-600">
                  Verified hospitals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-600">
                  Live availability
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Visual */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-xl shadow-indigo-50/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-slate-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {stat.label}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium">
                        {stat.change}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Featured Image/Visual */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-900">
                    Live Availability
                  </h3>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Updates every 5 min
                  </span>
                </div>

                {/* Live Updates List */}
                <div className="space-y-3">
                  {[
                    {
                      hospital: "City Hospital",
                      beds: 12,
                      icu: 3,
                      blood: "A+, O+",
                    },
                    {
                      hospital: "Apollo Clinic",
                      beds: 5,
                      icu: 1,
                      blood: "B+, AB-",
                    },
                    {
                      hospital: "Medanta",
                      beds: 8,
                      icu: 4,
                      blood: "All groups",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {item.hospital}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <BedDouble className="w-3 h-3" /> {item.beds} beds
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Stethoscope className="w-3 h-3" /> {item.icu} ICU
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          Available
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/explore"
                  className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1"
                >
                  View all live updates
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs text-amber-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                For medical emergencies, always call 108 or your local emergency
                services first.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
