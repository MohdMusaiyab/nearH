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
  Menu,
  X,
  Building2,
} from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Doctors & OPD", href: "/admin/doctors", icon: Stethoscope },
    { name: "Beds & ICU", href: "/admin/inventory", icon: BedDouble },
    { name: "Blood Bank", href: "/admin/blood-bank", icon: Droplets },
    { name: "Referrals", href: "/admin/referrals", icon: ArrowLeftRight },
    { name: "Hospital Profile", href: "/admin/profile", icon: Settings },
  ];

  const NavLink = ({ item }: { item: (typeof navItems)[0] }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <item.icon
          className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}
        />
        <span className="font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {}
      <div className="lg:hidden flex items-center justify-between bg-white border-b px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-indigo-600" />
          <span className="font-bold text-slate-900 tracking-tight text-sm">
            Hospital Admin
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-50 text-slate-600"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full p-6">
          {}
          <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 block leading-none">
                MediPortal
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                Hospital Console
              </span>
            </div>
          </div>

          {}
          <nav className="flex-1 space-y-1">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Operations
            </p>
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          {}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <form action="/auth/logout" method="POST">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
