"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  MapPin,
  LogOut,
  Menu,
  X,
  Hospital,
  ShieldAlert,
} from "lucide-react";

const SuperAdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
    { name: "Approvals", href: "/superadmin/approvals", icon: UserCheck },
    { name: "Locations", href: "/superadmin/locations", icon: MapPin },
    { name: "Hospitals", href: "/superadmin/hospitals", icon: Hospital },
    { name: "Services", href: "/superadmin/services", icon: Hospital },
    { name: "Specialities", href: "/superadmin/specialities", icon: Hospital },
  ];

  const NavLink = ({ item }: { item: (typeof navItems)[0] }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
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
          <ShieldAlert className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-slate-900 tracking-tight">
            SuperAdmin
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-50 text-slate-600"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
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
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              MediControl
            </span>
          </div>

          {}
          <nav className="flex-1 space-y-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Main Menu
            </p>
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          {}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <form action="/auth/logout" method="POST">
              <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
