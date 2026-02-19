"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble,
  Stethoscope,
  MapPin,
  Award,
  ArrowRight,
  Activity,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";

// --- Strict Types ---

type HospitalRow = Database["public"]["Tables"]["hospitals"]["Row"];

interface RawHospitalQuery extends HospitalRow {
  location: { city: string; state: string } | null;
  hospital_inventory:
    | {
        available_beds: number;
        total_beds: number;
        icu_beds_available: number;
      }[]
    | null;
  hospital_images: { image_url: string; is_primary: boolean }[] | null;
  blood_bank: { blood_group: string }[] | null;
}

interface FeaturedHospital {
  id: string;
  name: string;
  city: string;
  state: string;
  is_verified: boolean;
  available_beds: number;
  total_beds: number;
  icu_available: number;
  blood_groups: string[];
  image_url: string | null;
}

// --- Component ---

export function FeaturedHospitals() {
  const [hospitals, setHospitals] = useState<FeaturedHospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const supabase = createClient();

  useEffect(() => {
    async function fetchFeaturedHospitals() {
      try {
        const { data, error } = await supabase
          .from("hospitals")
          .select(
            `
            *,
            location:locations(city, state),
            hospital_inventory(available_beds, total_beds, icu_beds_available),
            hospital_images(image_url, is_primary),
            blood_bank(blood_group)
          `,
          )
          .eq("is_active", true)
          .eq("is_verified", true)
          .limit(6);

        if (error) throw error;

        // Transform data with zero 'any'
        const formattedHospitals: FeaturedHospital[] = (
          data as unknown as RawHospitalQuery[]
        ).map((h) => {
          const inv = h.hospital_inventory?.[0];
          const primaryImg =
            h.hospital_images?.find((img) => img.is_primary)?.image_url ??
            h.hospital_images?.[0]?.image_url ??
            null;

          return {
            id: h.id,
            name: h.name,
            city: h.location?.city ?? "Unknown",
            state: h.location?.state ?? "Unknown",
            is_verified: h.is_verified ?? false,
            available_beds: inv?.available_beds ?? 0,
            total_beds: inv?.total_beds ?? 0,
            icu_available: inv?.icu_beds_available ?? 0,
            blood_groups: h.blood_bank?.map((b) => b.blood_group) ?? [],
            image_url: primaryImg,
          };
        });

        setHospitals(formattedHospitals);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedHospitals();

    // Real-time Sync
    const channel = supabase
      .channel("featured-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "hospital_inventory" },
        (payload) => {
          const updated =
            payload.new as Database["public"]["Tables"]["hospital_inventory"]["Row"];
          setHospitals((prev) =>
            prev.map((h) =>
              h.id === updated.hospital_id
                ? {
                    ...h,
                    available_beds: updated.available_beds ?? 0,
                    icu_available: updated.icu_beds_available ?? 0,
                  }
                : h,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const cities = ["all", ...Array.from(new Set(hospitals.map((h) => h.city)))];
  const filtered =
    selectedCity === "all"
      ? hospitals
      : hospitals.filter((h) => h.city === selectedCity);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">
            Featured <span className="text-indigo-600">Hospitals</span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-12">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCity === city
                  ? "bg-indigo-600 text-white shadow-xl"
                  : "bg-white text-slate-400 border border-slate-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((hospital) => (
            <Link
              key={hospital.id}
              href={`/hospital/${hospital.id}`}
              className="group bg-white rounded-[3rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-56 bg-slate-100">
                {hospital.image_url ? (
                  <Image
                    src={hospital.image_url}
                    alt={hospital.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Stethoscope className="w-12 h-12" />
                  </div>
                )}
                {hospital.is_verified && (
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-amber-600 border border-amber-100 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Verified
                  </div>
                )}
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {hospital.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase mt-1">
                    <MapPin className="w-4 h-4" /> {hospital.city},{" "}
                    {hospital.state}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mb-1">
                      <BedDouble className="w-3.5 h-3.5" /> Beds
                    </div>
                    <p className="text-xl font-black text-slate-900">
                      {hospital.available_beds}
                    </p>
                  </div>
                  <div className="bg-indigo-50/50 p-4 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-400 uppercase mb-1">
                      <Activity className="w-3.5 h-3.5" /> ICU
                    </div>
                    <p className="text-xl font-black text-indigo-600">
                      {hospital.icu_available}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex gap-1">
                    {hospital.blood_groups.slice(0, 3).map((bg) => (
                      <div
                        key={bg}
                        className="w-8 h-8 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black flex items-center justify-center border border-rose-100"
                      >
                        {bg}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                    View <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-96 bg-white border border-slate-200 rounded-[3rem] animate-pulse"
        />
      ))}
    </div>
  );
}
