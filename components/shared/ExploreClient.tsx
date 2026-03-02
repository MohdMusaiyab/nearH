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
  Activity,
  BedDouble,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getExploreHospitals } from "@/actions/shared/getAllHospitals";
import { ExploreHospital } from "@/types/explore";
import { useDebounce } from "@/hooks/useDebounce";
import { Database } from "@/types/database.types";
import { motion, AnimatePresence } from "framer-motion";
import { ExtendedProfile } from "@/types/auth";

type Location = Database["public"]["Tables"]["locations"]["Row"];
type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];
type Service = Database["public"]["Tables"]["services_list"]["Row"];

interface Props {
  initialData: ExploreHospital[];
  totalCount: number;
  profile: ExtendedProfile | null;
  filters: {
    locations: Location[];
    specialties: Specialty[];
    services: Service[];
  };
}

export default function ExploreClient({
  initialData,
  totalCount,
  profile,
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
  const activeFilterCount = [
    locationId,
    specialtyId,
    serviceId,
    searchParams.get("query"),
  ].filter(Boolean).length;
  const totalPages = Math.ceil(count / 20);

  const getDestinationPath = (hospitalId: string) => {
    if (profile?.role === "superadmin")
      return `/superadmin/hospitals/${hospitalId}`;
    return `/hospitals/${hospitalId}`;
  };

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

  const clearAll = () => {
    setSearchTerm("");
    updateFilters({
      locationId: "",
      specialtyId: "",
      serviceId: "",
      query: "",
    });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const currentQuery = searchParams.get("query") || "";
    if (debouncedSearch !== currentQuery)
      updateFilters({ query: debouncedSearch });
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
    <div className="min-h-screen bg-slate-50">
      {}
      <div
        className="relative overflow-hidden pb-14 pt-10 lg:pt-18 lg:pb-20"
        style={{ background: "var(--gradient-hero)" }}
      >
        {}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        {}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/8 rounded-full blur-3xl pointer-events-none" />
        {}
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-border/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16">
            {}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              {}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border text-accent text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Live Healthcare Grid
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-heading tracking-tighter leading-[0.95] mb-4">
                Find{" "}
                <span className="relative inline-block">
                  <span className="text-accent">Care.</span>
                  {}
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full"
                    viewBox="0 0 140 8"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 6 Q35 1 70 5 Q105 9 138 3"
                      stroke="var(--color-accent)"
                      strokeOpacity="0.35"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-muted text-base md:text-lg font-medium mt-3">
                <span className="font-black text-heading">
                  {count.toLocaleString()}
                </span>{" "}
                verified medical facilities — real-time bed &amp; ICU data.
              </p>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full lg:max-w-sm"
            >
              <div className="relative group">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors"
                />
                <input
                  type="text"
                  placeholder="Hospital name or keyword…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-11 py-4 bg-white border border-border rounded-2xl text-heading placeholder:text-muted font-semibold text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-sm"
                />
                {isPending ? (
                  <Loader2
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-accent animate-spin"
                  />
                ) : searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>

              {}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-border text-[10px] font-bold text-body shadow-sm">
                  <BedDouble size={11} className="text-accent" />
                  Bed Availability
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-border text-[10px] font-bold text-body shadow-sm">
                  <Activity size={11} className="text-accent" />
                  ICU Status
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {}
      {}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2.5 py-3 overflow-x-auto scrollbar-none">
            {}
            <div
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold flex-shrink-0 transition-colors ${
                activeFilterCount > 0
                  ? "bg-heading text-white"
                  : "bg-badge-bg text-heading border border-border"
              }`}
            >
              <SlidersHorizontal size={13} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>

            {}
            <select
              value={locationId}
              onChange={(e) => updateFilters({ locationId: e.target.value })}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border outline-none transition-all flex-shrink-0 cursor-pointer ${
                locationId
                  ? "bg-badge-bg text-accent border-accent/40"
                  : "bg-white text-body border-border hover:border-accent/40"
              } focus:border-accent focus:ring-2 focus:ring-accent/10`}
            >
              <option value="">📍 All Locations</option>
              {filters.locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.city}
                </option>
              ))}
            </select>

            {}
            <select
              value={specialtyId}
              onChange={(e) => updateFilters({ specialtyId: e.target.value })}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border outline-none transition-all flex-shrink-0 cursor-pointer ${
                specialtyId
                  ? "bg-badge-bg text-accent border-accent/40"
                  : "bg-white text-body border-border hover:border-accent/40"
              } focus:border-accent focus:ring-2 focus:ring-accent/10`}
            >
              <option value="">🩺 All Specialties</option>
              {filters.specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.specialty_name}
                </option>
              ))}
            </select>

            {}
            <div className="w-px h-5 bg-border flex-shrink-0 mx-1" />

            {}
            <span className="text-xs font-semibold text-muted flex-shrink-0 whitespace-nowrap">
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin text-accent" />
                  Searching…
                </span>
              ) : (
                <>{count.toLocaleString()} results</>
              )}
            </span>

            {}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-error hover:bg-red-50 border border-transparent hover:border-red-100 transition-all flex-shrink-0 ml-auto"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-6">
        {}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-white/50 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-border px-5 py-3.5 flex items-center gap-3">
                <Loader2 size={16} className="animate-spin text-accent" />
                <span className="text-sm font-bold text-heading">
                  Updating…
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {}
        {hospitals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border flex items-center justify-center mb-4">
              <Hospital size={28} className="text-muted" />
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">
              No hospitals found
            </h3>
            <p className="text-sm text-muted mb-6 max-w-xs">
              Try adjusting your filters or searching with a different keyword.
            </p>
            <button
              onClick={clearAll}
              className="px-5 py-2.5 bg-accent text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {hospitals.map((hospital, i) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={getDestinationPath(hospital.id)}
                    className="group flex flex-col bg-white rounded-3xl border border-border hover:border-accent/40 hover:shadow-xl hover:shadow-accent/8 transition-all duration-300 overflow-hidden h-full"
                  >
                    {}
                    <div className="h-[3px] w-full bg-gradient-to-r from-accent to-link opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="p-6 flex flex-col flex-1">
                      {}
                      <div className="flex items-start justify-between gap-3 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-badge-bg border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:border-accent transition-all duration-300 shadow-sm">
                          <Hospital
                            size={20}
                            className="text-accent group-hover:text-white transition-colors duration-300"
                          />
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {}
                          {(hospital.inventory?.available_beds ?? 0) > 0 ? (
                            <span className="flex items-center gap-1.5 text-success text-[9px] font-black uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                              Available
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-error text-[9px] font-black uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-error" />
                              Full
                            </span>
                          )}
                          {hospital.is_verified && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                              <Award size={11} />
                              <span className="text-[9px] font-black uppercase">
                                Verified
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {}
                      <h3 className="text-lg font-heading font-black text-heading group-hover:text-accent transition-colors leading-snug mb-1.5">
                        {hospital.name}
                      </h3>

                      {}
                      <p className="flex items-center gap-1.5 text-muted text-xs font-semibold mb-4">
                        <MapPin
                          size={12}
                          className="text-accent flex-shrink-0"
                        />
                        {hospital.location?.city}, {hospital.location?.state}
                      </p>

                      {}
                      {hospital.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {hospital.specialties.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 bg-badge-bg text-badge-text text-[9px] font-black uppercase tracking-wider rounded-lg border border-border"
                            >
                              {s}
                            </span>
                          ))}
                          {hospital.specialties.length > 3 && (
                            <span className="px-2.5 py-1 bg-slate-50 text-muted text-[9px] font-black uppercase rounded-lg border border-border">
                              +{hospital.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {}
                      <div className="grid grid-cols-2 gap-2.5 mt-auto pt-4 border-t border-border">
                        <div className="p-3.5 bg-badge-bg rounded-2xl border border-border">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <BedDouble size={11} className="text-accent" />
                            <p className="text-[9px] font-black text-muted uppercase tracking-widest">
                              General
                            </p>
                          </div>
                          <p className="text-2xl font-black text-heading tabular-nums leading-none">
                            {hospital.inventory?.available_beds ?? 0}
                          </p>
                          <p className="text-[9px] text-muted mt-0.5">
                            beds free
                          </p>
                        </div>
                        <div
                          className="p-3.5 rounded-2xl border"
                          style={{
                            background:
                              "color-mix(in srgb, var(--color-accent) 6%, white)",
                            borderColor:
                              "color-mix(in srgb, var(--color-accent) 18%, transparent)",
                          }}
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Activity size={11} className="text-accent" />
                            <p className="text-[9px] font-black text-accent uppercase tracking-widest">
                              ICU
                            </p>
                          </div>
                          <p className="text-2xl font-black text-accent tabular-nums leading-none">
                            {hospital.inventory?.icu_beds_available ?? 0}
                          </p>
                          <p className="text-[9px] text-muted mt-0.5">
                            units free
                          </p>
                        </div>
                      </div>

                      {}
                      <div className="mt-4 flex items-center justify-end gap-1 text-accent text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                        View Details <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {}
        {count > 20 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
            <p className="text-sm font-semibold text-muted">
              Page{" "}
              <span className="text-heading font-black">{currentPage}</span> of{" "}
              <span className="text-heading font-black">{totalPages}</span>
              <span className="ml-2 text-muted/60">
                · {count.toLocaleString()} total
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1 || isPending}
                onClick={() => updateFilters({ page: currentPage - 1 })}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-bold text-heading hover:bg-badge-bg hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={15} /> Prev
              </button>

              {}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page =
                    Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                  if (page < 1 || page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => updateFilters({ page })}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                        page === currentPage
                          ? "bg-accent text-white shadow-md shadow-accent/25"
                          : "bg-white border border-border text-body hover:bg-badge-bg hover:border-accent/30"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage * 20 >= count || isPending}
                onClick={() => updateFilters({ page: currentPage + 1 })}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-bold text-heading hover:bg-badge-bg hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
