import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: number;
  color: "blue" | "green" | "purple" | "red" | "amber";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
};

export function StatCard({ icon: Icon, label, value, color }: Props) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-slate-500">{label}</span>
      </div>
      <div className="text-3xl font-black text-slate-900">{value}</div>
    </div>
  );
}
