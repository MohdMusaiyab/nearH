"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Stethoscope,
  Clock,
  MapPin,
  Hospital,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { getDoctorDirectory } from "@/actions/shared/getAllDoctors";
import { DoctorDirectoryEntry, DoctorStatus } from "@/types/doctors";
import { useDebounce } from "@/hooks/useDebounce";
import { Database } from "@/types/database.types";
import Link from "next/link";

type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];

interface Props {
  initialDoctors: DoctorDirectoryEntry[];
  totalCount: number;
  specialties: Specialty[];
}

export default function DoctorDirectoryClient({
  initialDoctors,
  totalCount,
  specialties,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [doctors, setDoctors] =
    useState<DoctorDirectoryEntry[]>(initialDoctors);
  const [count, setCount] = useState(totalCount);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const currentPage = Number(searchParams.get("page")) || 1;
  const specialtyId = searchParams.get("specialtyId") || "";

  const statusMap: Record<DoctorStatus, { color: string; label: string }> = {
    Available: { color: "bg-emerald-50 text-emerald-700", label: "Available" },
    In_OPD: { color: "bg-blue-50 text-blue-700", label: "In OPD" },
    In_Surgery: { color: "bg-rose-50 text-rose-700", label: "In Surgery" },
    On_Call: { color: "bg-amber-50 text-amber-700", label: "On Call" },
    On_Leave: { color: "bg-slate-100 text-slate-500", label: "On Leave" },
    Emergency_Only: {
      color: "bg-red-100 text-red-700",
      label: "Emergency Only",
    },
  };

  const updateURL = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
      else params.delete(key);
    });
    if (!updates.page) params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    updateURL({ query: debouncedSearch });
  }, [debouncedSearch]);

  useEffect(() => {
    startTransition(async () => {
      const res = await getDoctorDirectory({
        page: currentPage,
        query: searchParams.get("query") || undefined,
        specialtyId: specialtyId || undefined,
      });
      if (res.success && res.data) {
        setDoctors(res.data.doctors);
        setCount(res.data.totalCount);
      }
    });
  }, [currentPage, specialtyId, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Specialists
          </h1>
          <p className="text-slate-500 font-medium">
            Verified medical professionals across the hospital network.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <select
            value={specialtyId}
            onChange={(e) => updateURL({ specialtyId: e.target.value })}
            className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm appearance-none"
          >
            <option value="">All Specialties</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.specialty_name}
              </option>
            ))}
          </select>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search doctor..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isPending && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-indigo-500 w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[doctor.status].color}`}
              >
                {statusMap[doctor.status].label}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {doctor.name}
              </h3>
              <p className="text-indigo-600 font-bold text-sm">
                {doctor.specialty?.name}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-500">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs font-bold">
                  {doctor.experience_years} Years Experience
                </span>
              </div>
              <Link
                href={`/hospital/${doctor.hospital.id}`}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <Hospital className="w-4 h-4" />
                <span className="text-xs font-bold line-clamp-1">
                  {doctor.hospital.name}
                </span>
              </Link>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">
                  {doctor.hospital.location?.city}
                </span>
              </div>
            </div>

            {/* Timings */}
            <div className="mt-8 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Weekly Schedule
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(doctor.availability_schedule).map(
                  ([day, time]) => (
                    <div
                      key={day}
                      className="flex justify-between bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                    >
                      <span className="text-slate-400">{day}</span>
                      <span className="text-slate-700">{time}</span>
                    </div>
                  ),
                )}
                {Object.keys(doctor.availability_schedule).length === 0 && (
                  <p className="text-[10px] text-slate-400 italic col-span-2">
                    Schedule not provided
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Total Doctors: {count}
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage <= 1 || isPending}
            onClick={() => updateURL({ page: currentPage - 1 })}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            disabled={currentPage * 20 >= count || isPending}
            onClick={() => updateURL({ page: currentPage + 1 })}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
