"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  MapPin,
  Mail,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white">
                <Activity size={24} />
              </div>
              <span className="text-2xl font-heading font-black text-heading tracking-tighter">
                NearH
              </span>
            </Link>
            <p className="text-body text-sm leading-relaxed mb-6 max-w-xs">
              India&apos;s real-time healthcare network. Bridging the gap
              between emergency needs and hospital availability.
            </p>
            <div className="flex items-center gap-2 text-success font-bold text-[10px] uppercase tracking-widest bg-success/5 px-3 py-1.5 rounded-full w-fit border border-success/10">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Network Live: 524 Hospitals
            </div>
          </div>

          {/* Public Links */}
          <div>
            <h4 className="text-heading font-bold text-sm uppercase tracking-widest mb-6">
              General Public
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/explore"
                  className="text-muted hover:text-accent transition-colors flex items-center gap-1 group text-sm font-medium"
                >
                  Explore Hospitals{" "}
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-all"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-muted hover:text-accent transition-colors text-sm font-medium"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted hover:text-accent transition-colors text-sm font-medium"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Links */}
          <div>
            <h4 className="text-heading font-bold text-sm uppercase tracking-widest mb-6">
              Hospital Admins
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-muted hover:text-accent transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <ShieldCheck size={16} className="text-accent" /> Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/hospitals"
                  className="text-muted hover:text-accent transition-colors text-sm font-medium"
                >
                  Manage Facility
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/benefits"
                  className="text-muted hover:text-accent transition-colors text-sm font-medium"
                >
                  Partner Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="text-heading font-bold text-sm uppercase tracking-widest mb-6">
              Contact Support
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:support@nearh.in"
                className="flex items-center gap-3 text-muted hover:text-heading transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-accent/10">
                  <Mail size={16} className="text-accent" />
                </div>
                <span className="text-sm font-medium">support@nearh.in</span>
              </a>
              <div className="flex items-center gap-3 text-muted">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <MapPin size={16} className="text-accent" />
                </div>
                <span className="text-sm font-medium">
                  Bengaluru, KA, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-muted">
          <p>© {currentYear} NearH Healthcare. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-heading">
              Terms
            </Link>
            <Link href="/security" className="hover:text-heading">
              Security
            </Link>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-[10px] font-bold">
              v2.0.4-LTS
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
