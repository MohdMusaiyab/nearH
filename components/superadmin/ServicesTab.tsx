import { Pill } from "lucide-react";

interface Props {
  specialties: string[];
}

export function ServicesTab({ specialties }: Props) {
  if (specialties.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">No specialties listed</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-black text-slate-900 mb-6">
        Medical Specialties
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {specialties.map((specialty) => (
          <div
            key={specialty}
            className="p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Pill className="w-5 h-5 text-indigo-500 mb-2" />
            <span className="font-bold text-sm text-indigo-900">
              {specialty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
