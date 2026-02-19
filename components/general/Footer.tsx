// components/home/Footer.tsx
"use client";

import Link from "next/link";
import {
  Hospital,
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ChevronRight,
  ArrowUp,
  Shield,
  Clock,
  Ambulance,
  Droplets,
  Stethoscope,
  Award,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 relative">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </button>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section - Logo & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 pb-12 border-b border-slate-800">
          {/* Logo & Description */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Hospital className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                Near<span className="text-indigo-400">H</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Making healthcare accessible through real-time hospital
              availability tracking and seamless patient-provider connections.
            </p>

            {/* Trust Badges */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Real-time</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Trusted</span>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:pl-12">
            <h3 className="text-white font-bold mb-3">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Get notified about new hospitals and features.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-slate-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* For Patients */}
          <div>
            <h3 className="text-white font-bold mb-4">For Patients</h3>
            <ul className="space-y-3">
              {[
                { label: "Find Hospitals", href: "/explore" },
                { label: "Emergency Care", href: "/explore?type=emergency" },
                { label: "Blood Banks", href: "/explore?service=blood" },
                { label: "ICU Availability", href: "/explore?service=icu" },
                { label: "Specialists", href: "/explore?type=specialists" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Hospitals */}
          <div>
            <h3 className="text-white font-bold mb-4">For Hospitals</h3>
            <ul className="space-y-3">
              {[
                { label: "Join Network", href: "/auth/signup" },
                { label: "Admin Login", href: "/admin" },
                { label: "Pricing", href: "/pricing" },
                { label: "Success Stories", href: "/stories" },
                { label: "Partner Resources", href: "/resources" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Careers", href: "/careers" },
                { label: "Blog", href: "/blog" },
                { label: "Press", href: "/press" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                { label: "Help Center", href: "/help" },
                { label: "FAQs", href: "/faqs" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Emergency Guidelines", href: "/emergency" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="grid md:grid-cols-2 gap-8 py-8 border-t border-slate-800">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-indigo-400" />
                <a
                  href="mailto:support@nearh.com"
                  className="hover:text-indigo-400 transition-colors"
                >
                  support@nearh.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-indigo-400" />
                <a
                  href="tel:+18001234567"
                  className="hover:text-indigo-400 transition-colors"
                >
                  1-800-123-4567
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 md:text-right">
            <h3 className="text-white font-bold">Follow Us</h3>
            <div className="flex gap-4 md:justify-end">
              {[
                {
                  icon: Twitter,
                  href: "https://twitter.com/nearh",
                  label: "Twitter",
                },
                {
                  icon: Facebook,
                  href: "https://facebook.com/nearh",
                  label: "Facebook",
                },
                {
                  icon: Instagram,
                  href: "https://instagram.com/nearh",
                  label: "Instagram",
                },
                {
                  icon: Linkedin,
                  href: "https://linkedin.com/company/nearh",
                  label: "LinkedIn",
                },
                {
                  icon: Github,
                  href: "https://github.com/nearh",
                  label: "GitHub",
                },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-slate-300 hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {currentYear} NearH. All rights reserved.</p>

          {/* Emergency Disclaimer */}
          <div className="flex items-center gap-2 text-xs bg-slate-800/50 px-4 py-2 rounded-full">
            <Ambulance className="w-4 h-4 text-amber-400" />
            <span>In emergency, always call 108 first</span>
          </div>

          {/* Made with love */}
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
            for better healthcare
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800">
          {[
            { icon: Hospital, label: "Active Hospitals", value: "500+" },
            { icon: Droplets, label: "Blood Units", value: "2.5k+" },
            { icon: Stethoscope, label: "Specialists", value: "1.2k+" },
            { icon: Award, label: "Lives Impacted", value: "50k+" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
