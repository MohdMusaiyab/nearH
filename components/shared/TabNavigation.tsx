"use client";

import {
  Hospital,
  Stethoscope,
  Pill,
  Droplets,
  FileText,
  LucideIcon,
} from "lucide-react";

export type TabId =
  | "overview"
  | "doctors"
  | "services"
  | "blood-bank"
  | "referrals";

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  showReferralsTab: boolean;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  showReferralsTab,
}: Props) {
  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: Hospital },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
    { id: "services", label: "Services", icon: Pill },
    { id: "blood-bank", label: "Blood Bank", icon: Droplets },
  ];

  const allTabs = showReferralsTab
    ? [
        ...tabs,
        { id: "referrals" as const, label: "Referrals", icon: FileText },
      ]
    : tabs;

  return (
    <div className="w-full overflow-hidden">
      {}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-nowrap py-1 px-1">
        {allTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 md:px-5 py-3 rounded-xl 
                text-[10px] font-black uppercase tracking-[0.15em] 
                transition-all duration-300 whitespace-nowrap border
                ${
                  isActive
                    ? "bg-badge-bg text-accent border-accent/40 shadow-sm ring-4 ring-accent/5"
                    : "bg-white text-muted border-border hover:border-accent/40 hover:bg-slate-50/50"
                }
              `}
            >
              <Icon
                size={14}
                className={`transition-colors duration-300 ${
                  isActive ? "text-accent" : "text-muted"
                }`}
                strokeWidth={isActive ? 3 : 2}
              />
              <span className={isActive ? "text-heading" : ""}>
                {tab.label}
              </span>

              {}
              {isActive && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
