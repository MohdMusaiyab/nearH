import { Droplets } from "lucide-react";

interface Props {
  bloodGroup: string;
  units: number;
}

const bloodGroupColors: Record<string, string> = {
  "A+": "bg-red-50 text-red-700",
  "A-": "bg-red-50 text-red-700",
  "B+": "bg-red-50 text-red-700",
  "B-": "bg-red-50 text-red-700",
  "AB+": "bg-purple-50 text-purple-700",
  "AB-": "bg-purple-50 text-purple-700",
  "O+": "bg-green-50 text-green-700",
  "O-": "bg-green-50 text-green-700",
};

export function BloodGroupCard({ bloodGroup, units }: Props) {
  const colorClass =
    bloodGroupColors[bloodGroup] || "bg-slate-50 text-slate-700";

  return (
    <div className={`p-4 ${colorClass} rounded-xl text-center`}>
      <Droplets className="w-5 h-5 mx-auto mb-2 opacity-60" />
      <div className="text-2xl font-black">{bloodGroup}</div>
      <div className="text-sm font-bold mt-1">{units} units</div>
    </div>
  );
}
