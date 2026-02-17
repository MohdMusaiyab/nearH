"use client";

import { useRouter } from "next/navigation";
import { Shield, Edit, UserCog, ChevronRight } from "lucide-react";
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
    if (isOwner) return `/admin/hospitals/${hospitalId}/edit`;
    if (isSuperadmin) return `/superadmin/hospitals/${hospitalId}/edit`;
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
    <div
      className={`${isSuperadmin ? "bg-indigo-600" : "bg-emerald-600"} text-white sticky top-0 z-50 shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5" />
            <span className="font-bold text-sm">
              {isSuperadmin ? "SUPERADMIN ACCESS" : "HOSPITAL ADMIN ACCESS"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {}
            {isOwner && editUrl && (
              <button
                onClick={() => router.push(editUrl)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Hospital
              </button>
            )}

            {}
            {dashboardUrl && (
              <button
                onClick={() => router.push(dashboardUrl)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl font-bold text-sm hover:bg-white/30 transition-colors"
              >
                <UserCog className="w-4 h-4" />
                Dashboard
              </button>
            )}

            {}
            {isSuperadmin && (
              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl font-bold text-sm hover:bg-indigo-400 transition-colors"
                >
                  Admin Tools
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${showAdminMenu ? "rotate-90" : ""}`}
                  />
                </button>

                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
                    <button className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 text-slate-700">
                      <UserCog className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-sm">Manage Admins</span>
                    </button>
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
