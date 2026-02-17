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
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {allTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
