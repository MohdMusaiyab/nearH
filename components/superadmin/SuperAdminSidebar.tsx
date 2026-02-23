"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  MapPin,
  LogOut,
  Hospital,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  ChevronRight,
  X,
  AlignJustify,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Nav config ─────────────────────────────────────────── */
const navGroups = [
  {
    group: "Overview",
    items: [
      { name: "Dashboard", href: "/superadmin/dashboard", icon: LayoutDashboard },
      { name: "Approvals", href: "/superadmin/approvals", icon: UserCheck },
    ],
  },
  {
    group: "Management",
    items: [
      { name: "Hospitals", href: "/superadmin/hospitals", icon: Hospital },
      { name: "Locations", href: "/superadmin/locations", icon: MapPin },
      { name: "Services", href: "/superadmin/services", icon: Stethoscope },
      {
        name: "Specialities",
        href: "/superadmin/specialities",
        icon: Sparkles,
      },
      {
        name:"Referrals",
        href:"/superadmin/referrals",
        icon: ShieldCheck,
      }
    ],
  },
];

/* ─── Single nav link ─────────────────────────────────────── */
type NavItemDef = { name: string; href: string; icon: React.ElementType };

function NavLink({
  item,
  index,
  onClick,
}: {
  item: NavItemDef;
  index: number;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.04 + 0.08,
        duration: 0.22,
        ease: "easeOut",
      }}
    >
      <Link
        href={item.href}
        onClick={onClick}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/25"
            : "text-[var(--color-body)] hover:bg-[var(--color-badge-bg)] hover:text-[var(--color-heading)]"
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-[var(--color-accent)] rounded-xl -z-10"
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
          />
        )}

        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
            isActive
              ? "bg-white/20"
              : "bg-[var(--color-badge-bg)] group-hover:bg-[var(--color-border)]"
          }`}
        >
          <Icon
            size={16}
            className={
              isActive
                ? "text-white"
                : "text-[var(--color-accent)] group-hover:text-[var(--color-heading)]"
            }
          />
        </div>

        <span className="font-semibold text-sm flex-1">{item.name}</span>

        {isActive && (
          <ChevronRight size={13} className="text-white/70 flex-shrink-0" />
        )}
      </Link>
    </motion.div>
  );
}

/* ─── Shared sidebar body ─────────────────────────────────── */
function SidebarContent({ onClose }: { onClose?: () => void }) {
  let idx = 0;
  return (
    <div className="flex flex-col h-full">
      {/* Brand block */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/30 flex-shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <p className="font-black text-[var(--color-heading)] text-base tracking-tight leading-none">
              MediControl
            </p>
            <p className="text-[10px] text-[var(--color-accent)] font-bold tracking-[0.15em] uppercase mt-0.5">
              Super Admin
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-[var(--color-border)] mb-4" />

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.group}>
            <p className="px-3 text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-[0.15em] mb-2">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  item={item}
                  index={idx++}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 mt-auto">
        <div className="mx-2 h-px bg-[var(--color-border)] mb-3" />

        {/* Sign out */}
        <form action="/auth/logout" method="POST">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 text-[var(--color-muted)] hover:text-[var(--color-error)] hover:bg-red-50 rounded-xl transition-all duration-200 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-badge-bg)] group-hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0">
              <LogOut
                size={15}
                className="group-hover:text-[var(--color-error)] transition-colors"
              />
            </div>
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────── */
const SuperAdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Mobile sub-header — sits inside layout below global nav ── */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[var(--color-border)] sticky top-20 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-badge-bg)] flex items-center justify-center text-[var(--color-heading)] hover:bg-[var(--color-border)] transition-colors"
          aria-label="Open sidebar"
        >
          <AlignJustify size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--color-accent)] rounded-md flex items-center justify-center">
            <ShieldCheck size={13} className="text-white" />
          </div>
          <span className="font-bold text-[var(--color-heading)] text-sm">
            Super Admin Panel
          </span>
        </div>
      </div>

      {/* ── Mobile drawer — opens below global nav ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[var(--color-heading)]/30 backdrop-blur-sm z-[90] lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              /* top-20 = 5rem, matches the global Navigation h-20 on mobile */
              className="fixed top-20 left-0 bottom-0 w-72 z-[95] lg:hidden bg-white border-r border-[var(--color-border)] shadow-2xl shadow-[var(--color-heading)]/10 overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[var(--color-badge-bg)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-heading)] hover:bg-[var(--color-border)] transition-all z-10"
                aria-label="Close sidebar"
              >
                <X size={15} />
              </button>

              <SidebarContent onClose={() => setIsOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      {/*
        sticky top-24   → starts exactly below the global nav (h-20 lg:h-24)
        h-[calc(100vh-6rem)] → fills remaining viewport height (6rem = 24 * 0.25rem)
      */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border-r border-[var(--color-border)] sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
        <SidebarContent />
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
