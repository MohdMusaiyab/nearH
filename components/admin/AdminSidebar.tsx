"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  BedDouble,
  Droplets,
  ArrowLeftRight,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
  AlignJustify,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAction } from "@/actions/auth";
const navGroups = [
  {
    group: "Operations",
    items: [
      { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Doctors & OPD", href: "/admin/doctors", icon: Stethoscope },
      { name: "Beds & ICU", href: "/admin/inventory", icon: BedDouble },
      { name: "Referrals", href: "/admin/referrals", icon: ArrowLeftRight },
    ],
  },
  {
    group: "Settings",
    items: [
      { name: "Hospital Profile", href: "/admin/profile", icon: Settings },
    ],
  },
];
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
            ? "bg-accent text-white shadow-md shadow-accent/25"
            : "text-body hover:bg-badge-bg hover:text-heading"
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeAdminNav"
            className="absolute inset-0 bg-accent rounded-xl -z-10"
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
          />
        )}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
            isActive ? "bg-white/20" : "bg-badge-bg group-hover:bg-border"
          }`}
        >
          <Icon
            size={16}
            className={
              isActive ? "text-white" : "text-accent group-hover:text-heading"
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
function SidebarContent({ onClose }: { onClose?: () => void }) {
  let idx = 0;
  return (
    <div className="flex flex-col h-full">
      {}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30 flex-shrink-0">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <p className="font-black text-heading text-base tracking-tight leading-none">
              MediPortal
            </p>
            <p className="text-[10px] text-accent font-bold tracking-[0.15em] uppercase mt-0.5">
              Hospital Console
            </p>
          </div>
        </div>
      </div>
      {}
      <div className="mx-5 h-px bg-border mb-4" />
      {}
      <nav className="flex-1 px-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.group}>
            <p className="px-3 text-[10px] font-bold text-muted uppercase tracking-[0.15em] mb-2">
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
      {}
      <div className="p-3 mt-auto">
        <div className="mx-2 h-px bg-border mb-3" />
        {}
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 text-muted hover:text-error hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-badge-bg group-hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0">
              <LogOut
                size={15}
                className="group-hover:text-error transition-colors"
              />
            </div>
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}
const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-border sticky top-20 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="w-9 h-9 rounded-xl border border-border bg-badge-bg flex items-center justify-center text-heading hover:bg-border transition-colors"
          aria-label="Open sidebar"
        >
          <AlignJustify size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
            <Building2 size={13} className="text-white" />
          </div>
          <span className="font-bold text-heading text-sm">Hospital Admin</span>
        </div>
      </div>
      {}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-heading/30 backdrop-blur-sm z-[90] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-20 left-0 bottom-0 w-72 z-[95] lg:hidden bg-white border-r border-border shadow-2xl shadow-heading/10 overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-badge-bg flex items-center justify-center text-muted hover:text-heading hover:bg-border transition-all z-10"
                aria-label="Close sidebar"
              >
                <X size={15} />
              </button>
              <SidebarContent onClose={() => setIsOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      {}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border-r border-border sticky top-24 h-[calc(100vh-6rem)] overflow-hidden">
        <SidebarContent />
      </aside>
    </>
  );
};
export default AdminSidebar;
