"use client";

import { useState } from "react";
import { deleteDoctor, type DoctorWithSpecialty } from "@/actions/admin/doctor";
import { Pencil, Trash2, Search, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface DoctorTableProps {
  initialData: DoctorWithSpecialty[];
}

export default function DoctorTable({ initialData }: DoctorTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<DoctorWithSpecialty[]>(initialData);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove Dr. ${name}?`)) return;
    const prev = [...data];
    setData(data.filter((d) => d.id !== id));

    const res = await deleteDoctor(id);
    if (!res.success) {
      alert(res.message);
      setData(prev);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none text-slate-900"
            onChange={(e) => updateFilters("search", e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Doctor Details
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Specialty
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-slate-400 text-sm italic"
                >
                  No doctors found.
                </td>
              </tr>
            ) : (
              data.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {doc.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {doc.experience_years} Years Exp.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                      {doc.specialties_list?.specialty_name || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/doctors/edit/${doc.id}`}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id, doc.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
