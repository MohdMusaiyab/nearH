"use client";

import React, {
  useState,
  useEffect,
  useTransition,
  useCallback,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Hospital,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Activity,
  BedDouble,
  ArrowRight,
} from "lucide-react";
import { getExploreHospitals } from "@/actions/shared/getAllHospitals";
import { ExploreHospital } from "@/types/explore";
import { useDebounce } from "@/hooks/useDebounce";
import { Database } from "@/types/database.types";
import { motion, AnimatePresence } from "framer-motion";

type Location = Database["public"]["Tables"]["locations"]["Row"];
type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];
type Service = Database["public"]["Tables"]["services_list"]["Row"];

interface Props {
  initialData: ExploreHospital[];
  totalCount: number;
  filters: {
    locations: Location[];
    specialties: Specialty[];
    services: Service[];
  };
}

export default function ExploreClient({
  initialData,
  totalCount,
  filters,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);
  const prevParamsRef = useRef<string>("");

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [hospitals, setHospitals] = useState<ExploreHospital[]>(initialData);
  const [count, setCount] = useState(totalCount);

  const debouncedSearch = useDebounce(searchTerm, 500);

  const currentPage = Number(searchParams.get("page")) || 1;
  const locationId = searchParams.get("locationId") || "";
  const specialtyId = searchParams.get("specialtyId") || "";
  const serviceId = searchParams.get("serviceId") || "";

  const updateFilters = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(window.location.search);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
        else params.delete(key);
      });
      if (!updates.page) params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const currentQuery = searchParams.get("query") || "";
    if (debouncedSearch !== currentQuery) {
      updateFilters({ query: debouncedSearch });
    }
  }, [debouncedSearch, searchParams, updateFilters]);

  useEffect(() => {
    const currentParams = JSON.stringify({
      page: currentPage,
      query: searchParams.get("query"),
      locationId,
      specialtyId,
      serviceId,
    });

    if (prevParamsRef.current === currentParams) return;
    prevParamsRef.current = currentParams;

    let isMounted = true;
    startTransition(async () => {
      const res = await getExploreHospitals({
        page: currentPage,
        query: searchParams.get("query") || undefined,
        locationId: locationId || undefined,
        specialtyId: specialtyId || undefined,
        serviceId: serviceId || undefined,
      });

      if (isMounted && res.success && res.data) {
        setHospitals(res.data.hospitals);
        setCount(res.data.totalCount);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [currentPage, locationId, specialtyId, serviceId, searchParams]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* --- Page Header --- */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-12 lg:pt-40 lg:pb-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-bold text-[10px] uppercase tracking-widest mb-4">
                <Activity size={14} /> Live Healthcare Grid
              </div>
              <h1 className="text-5xl lg:text-7xl font-heading font-black text-heading tracking-tighter leading-none">
                Find <span className="text-accent">Care.</span>
              </h1>
              <p className="mt-4 text-body text-lg font-medium opacity-70">
                Browse {count} verified medical facilities with real-time bed
                and ICU data sync.
              </p>
            </div>

            {/* Search Bar - High end "Glass" feel */}
            <div className="relative w-full lg:max-w-md group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Hospital name or keyword..."
                className="w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-heading outline-none focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isPending && (
                <Loader2
                  className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-accent"
                  size={20}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Filter Bar --- */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-2 bg-heading rounded-lg text-white">
              <Filter size={18} />
            </div>

            <select
              value={locationId}
              onChange={(e) => updateFilters({ locationId: e.target.value })}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-heading outline-none focus:border-accent"
            >
              <option value="">All Locations</option>
              {filters.locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.city}
                </option>
              ))}
            </select>

            <select
              value={specialtyId}
              onChange={(e) => updateFilters({ specialtyId: e.target.value })}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-heading outline-none focus:border-accent"
            >
              <option value="">Specialties</option>
              {filters.specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.specialty_name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                updateFilters({
                  locationId: "",
                  specialtyId: "",
                  serviceId: "",
                  query: "",
                });
              }}
              className="px-4 py-2.5 text-xs font-black text-error hover:bg-error/5 rounded-xl transition-all"
            >
              CLEAR FILTERS
            </button>
          </div>
        </div>
      </div>

      {/* --- Hospital Grid --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {hospitals.map((hospital) => (
              <Link
                key={hospital.id}
                href={`/explore/hospitals/${hospital.id}`}
                className="group bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col hover:border-accent/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 text-heading rounded-2xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <Hospital size={24} />
                  </div>
                  {hospital.is_verified && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                      <Award size={14} />
                      <span className="text-[10px] font-black uppercase">
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-heading font-bold text-heading group-hover:text-accent transition-colors leading-tight mb-2">
                  {hospital.name}
                </h3>
                <p className="flex items-center gap-1 text-muted font-bold text-xs uppercase mb-6">
                  <MapPin size={14} className="text-accent" />{" "}
                  {hospital.location?.city}, {hospital.location?.state}
                </p>

                {/* Specialties Chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {hospital.specialties.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Bento Style Inventory Stats */}
                <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-slate-100">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <BedDouble size={12} className="text-blue-500" /> General
                    </p>
                    <p className="text-xl font-black text-heading">
                      {hospital.inventory?.available_beds ?? 0}
                    </p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Activity size={12} /> ICU Units
                    </p>
                    <p className="text-xl font-black text-accent">
                      {hospital.inventory?.icu_beds_available ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-accent font-black text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all">
                  Check Details <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* --- Pagination --- */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-16 pt-10 border-t border-slate-200">
          <p className="text-sm font-bold text-muted italic">
            Displaying <span className="text-heading">{hospitals.length}</span>{" "}
            of <span className="text-heading">{count}</span> facilities
          </p>
          <div className="flex gap-3">
            <button
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateFilters({ page: currentPage - 1 })}
              className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 text-heading" />
            </button>
            <button
              disabled={currentPage * 20 >= count || isPending}
              onClick={() => updateFilters({ page: currentPage + 1 })}
              className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm active:scale-95"
            >
              <ChevronRight className="w-6 h-6 text-heading" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
