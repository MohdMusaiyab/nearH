"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BedDouble,
  Stethoscope,
  MapPin,
  ArrowRight,
  Activity,
  ShieldCheck,
  Droplets,
  HeartPulse,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";

// --- Types (Kept from your original logic) ---
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
            `*, location:locations(city, state), hospital_inventory(available_beds, total_beds, icu_beds_available), hospital_images(image_url, is_primary), blood_bank(blood_group)`,
          )
          .eq("is_active", true)
          .eq("is_verified", true)
          .limit(6);

        if (error) throw error;

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
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedHospitals();

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
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success font-bold text-[10px] uppercase tracking-widest mb-4"
            >
              <HeartPulse size={14} /> Live Inventory Enabled
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-heading font-bold text-heading tracking-tight">
              Verified <span className="text-accent">Partners.</span>
            </h2>
            <p className="mt-4 text-body text-lg font-medium opacity-80">
              Only NABH accredited hospitals with real-time data sync are listed
              in our priority network.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-white border border-border/60 rounded-2xl shadow-sm overflow-x-auto no-scrollbar max-w-full">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCity === city
                    ? "bg-accent text-white shadow-md shadow-blue-200"
                    : "text-muted hover:bg-slate-50"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((hospital, idx) => (
              <motion.div
                layout
                key={hospital.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  href={`/hospital/${hospital.id}`}
                  className="group block bg-white rounded-[2rem] border border-border/50 hover:border-accent/30 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 h-full flex flex-col"
                >
                  {/* Image with Floating Label */}
                  <div className="relative h-56 m-3 rounded-[1.5rem] overflow-hidden shadow-inner">
                    {hospital.image_url ? (
                      <Image
                        src={hospital.image_url}
                        alt={hospital.name}
                        fill
                        priority={idx < 3}
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                        <Stethoscope size={64} />
                      </div>
                    )}

                    {/* Verification Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border shadow-sm">
                        <ShieldCheck size={14} className="text-success" />
                        <span className="text-[10px] font-black uppercase text-heading">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl font-heading font-bold text-heading group-hover:text-accent transition-colors line-clamp-1">
                        {hospital.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-muted">
                        <MapPin size={14} className="text-accent/60" />
                        <span className="text-sm font-medium">
                          {hospital.city}, {hospital.state}
                        </span>
                      </div>
                    </div>

                    {/* Inventory Grid: Bento Style */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-border/30">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase mb-1.5">
                          <BedDouble size={14} className="text-blue-500" />{" "}
                          General
                        </div>
                        <p className="text-xl font-black text-heading leading-none">
                          {hospital.available_beds}
                          <span className="text-xs font-medium text-muted ml-1">
                            beds
                          </span>
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-2xl border transition-colors ${hospital.icu_available > 0 ? "bg-accent/5 border-accent/10" : "bg-slate-50 border-border/20 opacity-60"}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase mb-1.5">
                          <Activity size={14} /> ICU Units
                        </div>
                        <p className="text-xl font-black text-accent leading-none">
                          {hospital.icu_available}
                        </p>
                      </div>
                    </div>

                    {/* Blood Bank & CTA */}
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-muted tracking-widest">
                          Blood Bank
                        </span>
                        <div className="flex -space-x-2">
                          {hospital.blood_groups.length > 0 ? (
                            hospital.blood_groups.slice(0, 3).map((bg) => (
                              <div
                                key={bg}
                                className="w-8 h-8 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center text-[10px] font-bold text-error shadow-sm"
                              >
                                {bg}
                              </div>
                            ))
                          ) : (
                            <span className="text-xs font-medium text-slate-300 italic">
                              None available
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-16 text-center">
          <Link
            href="/hospitals"
            className="inline-flex items-center gap-2 text-heading font-bold hover:text-accent transition-colors group"
          >
            Browse All 500+ Facilities{" "}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
      <div className="h-20 w-1/3 bg-slate-100 rounded-3xl mb-12 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[480px] bg-slate-50 border border-border/40 rounded-[2.5rem] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
