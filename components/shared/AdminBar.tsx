"use client";

import { useRouter } from "next/navigation";
import {
  Shield,
  Edit,
  UserCog,
  ChevronRight,
  Settings2,
  Command,
  LayoutDashboard,
  Hammer,
} from "lucide-react";
import { useState } from "react";

interface Props {
  hospitalId: string;
  isOwner: boolean;
  isSuperadmin: boolean;
}

export function AdminBar({ hospitalId, isOwner, isSuperadmin }: Props) {
  const router = useRouter();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const getEditUrl = () => {
    if (isOwner) return `/admin/profile`;
    if (isSuperadmin) return `/superadmin/hospitals/${hospitalId}`;
    return null;
  };

  const getDashboardUrl = () => {
    if (isOwner) return `/admin/dashboard`;
    if (isSuperadmin) return `/superadmin/hospitals/${hospitalId}`;
    return null;
  };

  const editUrl = getEditUrl();
  const dashboardUrl = getDashboardUrl();

  return (
    <div className="w-full animate-in slide-in-from-top duration-700 ease-out">
      <div
        className={`relative group overflow-hidden rounded-[1.25rem] border border-white shadow-2xl shadow-slate-200/40 backdrop-blur-xl ${
          isSuperadmin
            ? "bg-white/60 border-[var(--color-accent)]/10"
            : "bg-white/60 border-emerald-500/10"
        }`}
      >
        {/* Subtle accent gradient overlay */}
        <div
          className={`absolute inset-0 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10 ${
            isSuperadmin ? "bg-[var(--color-accent)]" : "bg-emerald-600"
          }`}
        />

        <div className="px-4 py-2.5 flex items-center justify-between relative z-10">
          {/* ── Status Section ── */}
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
                isSuperadmin
                  ? "bg-[var(--color-heading)] text-white shadow-[var(--color-heading)]/20"
                  : "bg-emerald-600 text-white shadow-emerald-600/20"
              }`}
            >
              <Shield size={20} strokeWidth={2.5} />
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isSuperadmin ? "bg-[var(--color-accent)]" : "bg-emerald-400"
                  }`}
                />
                <p className="text-[9px] font-black text-[var(--color-muted)] uppercase tracking-[0.25em] leading-none">
                  Privileged Session
                </p>
              </div>
              <h2
                className={`text-[11px] font-black uppercase tracking-tight ${
                  isSuperadmin
                    ? "text-[var(--color-heading)]"
                    : "text-emerald-800"
                }`}
              >
                {isSuperadmin ? "Superadmin Control" : "Facility Management"}
              </h2>
            </div>
          </div>

          {/* ── Desktop Actions ── */}
          <div className="flex items-center gap-2">
            {isOwner && editUrl && (
              <button
                onClick={() => router.push(editUrl)}
                className="group/btn flex items-center gap-2 px-4 py-2 bg-white/50 border border-[var(--color-border)] text-[var(--color-heading)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all shadow-sm active:scale-95"
              >
                <Edit
                  size={14}
                  strokeWidth={3}
                  className="transition-transform group-hover/btn:-rotate-12"
                />
                <span className="hidden md:inline">Edit Facility</span>
              </button>
            )}

            {dashboardUrl && (
              <button
                onClick={() => router.push(dashboardUrl)}
                className="group/btn flex items-center gap-2 px-4 py-2 bg-[var(--color-heading)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                <LayoutDashboard
                  size={14}
                  strokeWidth={3}
                  className="transition-transform group-hover/btn:scale-110"
                />
                <span className="hidden md:inline">Dashboard</span>
              </button>
            )}

            <div className="w-px h-6 bg-slate-200/50 mx-1 hidden sm:block" />

            {isSuperadmin && (
              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                    showAdminMenu
                      ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/30"
                      : "bg-white border border-[var(--color-border)] text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 shadow-sm"
                  }`}
                >
                  <Hammer size={14} strokeWidth={3} />
                  <span className="hidden lg:inline">System Tools</span>
                  <ChevronRight
                    size={14}
                    className={`transition-transform duration-300 ${showAdminMenu ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Dossier Style Menu */}
                {showAdminMenu && (
                  <div className="absolute right-0 mt-4 w-64 bg-white rounded-[1.5rem] shadow-2xl border border-[var(--color-border)] py-3 z-50 animate-in fade-in zoom-in-95 duration-300 origin-top-right">
                    <div className="px-5 py-2 mb-2">
                      <p className="text-[9px] font-black text-[var(--color-muted)] uppercase tracking-widest leading-none">
                        Administrative Suite
                      </p>
                    </div>
                    <div className="px-2 space-y-1">
                      <button className="w-full px-3 py-3 text-left hover:bg-[var(--color-badge-bg)] rounded-xl flex items-center gap-3 text-[var(--color-heading)] group transition-all">
                        <div className="w-8 h-8 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center shadow-sm group-hover:border-[var(--color-accent)]/20">
                          <UserCog
                            size={14}
                            className="text-[var(--color-accent)]"
                          />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-wide">
                          Manage Authorities
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
