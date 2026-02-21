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
} from "lucide-react";
import { getExploreHospitals } from "@/actions/shared/getAllHospitals";
import { ExploreHospital } from "@/types/explore";
import { useDebounce } from "@/hooks/useDebounce";
import { Database } from "@/types/database.types";

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
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(window.location.search);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      if (!updates.page) {
        params.set("page", "1");
      }

      const newUrl = `?${params.toString()}`;
      router.push(newUrl);
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

    if (prevParamsRef.current === currentParams) {
      return;
    }

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
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {}
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            Explore Network
          </h1>
          <p className="text-slate-500 font-medium text-lg italic">
            Discover verified medical facilities across the state.
          </p>
        </div>

        <div className="relative group max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by hospital name..."
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[2rem] text-lg font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all shadow-xl shadow-slate-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isPending && (
            <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />
          )}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={locationId}
          onChange={(e) => updateFilters({ locationId: e.target.value })}
          className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 appearance-none cursor-pointer"
        >
          <option value="">All Locations</option>
          {filters.locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.city}, {loc.state}
            </option>
          ))}
        </select>

        <select
          value={specialtyId}
          onChange={(e) => updateFilters({ specialtyId: e.target.value })}
          className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 appearance-none cursor-pointer"
        >
          <option value="">All Specialties</option>
          {filters.specialties.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.specialty_name}
            </option>
          ))}
        </select>

        <select
          value={serviceId}
          onChange={(e) => updateFilters({ serviceId: e.target.value })}
          className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-50 appearance-none cursor-pointer"
        >
          <option value="">All Services</option>
          {filters.services.map((serv) => (
            <option key={serv.id} value={serv.id}>
              {serv.service_name}
            </option>
          ))}
        </select>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hospitals.map((hospital) => (
          <Link
            key={hospital.id}
            href={`/explore/hospitals/${hospital.id}`}
            className="group bg-white border border-slate-200 rounded-[3rem] p-8 space-y-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            <div className="flex justify-between items-start">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                <Hospital className="w-8 h-8" />
              </div>
              {hospital.is_verified && (
                <Award className="text-amber-400 fill-amber-50 w-8 h-8" />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {hospital.name}
              </h3>
              <p className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase mt-2">
                <MapPin className="w-3.5 h-3.5" /> {hospital.location?.city},{" "}
                {hospital.location?.state}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {hospital.specialties.slice(0, 2).map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg"
                >
                  {s}
                </span>
              ))}
              {hospital.specialties.length > 2 && (
                <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-black uppercase rounded-lg">
                  +{hospital.specialties.length - 2}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Beds Available
                </p>
                <p className="text-xl font-black text-slate-900">
                  {hospital.inventory?.available_beds ?? 0}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  ICU Units
                </p>
                <p className="text-xl font-black text-indigo-600 text-right">
                  {hospital.inventory?.icu_beds_available ?? 0}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {}
      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <p className="text-sm font-bold text-slate-400 italic">
          Total Facilities: <span className="text-slate-900">{count}</span>
        </p>
        <div className="flex gap-4">
          <button
            disabled={currentPage <= 1 || isPending}
            onClick={() => updateFilters({ page: currentPage - 1 })}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            disabled={currentPage * 20 >= count || isPending}
            onClick={() => updateFilters({ page: currentPage + 1 })}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
