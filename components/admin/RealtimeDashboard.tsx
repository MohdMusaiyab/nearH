"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateInventory, updateBloodStock } from "@/actions/admin/dashboard";
import { Database } from "@/types/database.types";
import { Bed, Droplets, Plus, Minus, Loader2 } from "lucide-react";

type Inventory = Database["public"]["Tables"]["hospital_inventory"]["Row"];
type BloodBank = Database["public"]["Tables"]["blood_bank"]["Row"];

interface Props {
  initialInventory: Inventory | null;
  initialBloodBank: BloodBank[];
  hospitalId: string;
}

// 1. Define strict interface for the Inventory Card Props
interface InventoryCardProps {
  title: string;
  available: number;
  total: number;
  onUpdate: (val: number) => void;
  isPending: boolean;
}

export default function RealtimeDashboard({
  initialInventory,
  initialBloodBank,
  hospitalId,
}: Props) {
  const [inventory, setInventory] = useState<Inventory | null>(
    initialInventory,
  );
  const [bloodBank, setBloodBank] = useState<BloodBank[]>(initialBloodBank);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    const inventoryChannel = supabase
      .channel("realtime-inventory")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "hospital_inventory",
          filter: `hospital_id=eq.${hospitalId}`,
        },
        (payload) => setInventory(payload.new as Inventory),
      )
      .subscribe();

    const bloodChannel = supabase
      .channel("realtime-blood")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blood_bank",
          filter: `hospital_id=eq.${hospitalId}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setBloodBank((prev) =>
              prev.map((b) =>
                b.id === (payload.new as BloodBank).id
                  ? (payload.new as BloodBank)
                  : b,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(bloodChannel);
    };
  }, [hospitalId, supabase]);

  const handleBedUpdate = (field: keyof Inventory, value: number) => {
    startTransition(async () => {
      await updateInventory({ [field]: value });
    });
  };

  const handleBloodUpdate = (
    group: string,
    currentUnits: number,
    delta: number,
  ) => {
    startTransition(async () => {
      await updateBloodStock(group, Math.max(0, currentUnits + delta));
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Bed className="w-5 h-5 text-blue-600" /> Bed Availability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 2. Fix the Null assignment using nullish coalescing (?? 0) */}
          <InventoryCard
            title="General Beds"
            available={inventory?.available_beds ?? 0}
            total={inventory?.total_beds ?? 0}
            onUpdate={(val) => handleBedUpdate("available_beds", val)}
            isPending={isPending}
          />
          <InventoryCard
            title="ICU Beds"
            available={inventory?.icu_beds_available ?? 0}
            total={inventory?.icu_beds_total ?? 0}
            onUpdate={(val) => handleBedUpdate("icu_beds_available", val)}
            isPending={isPending}
          />
          <InventoryCard
            title="Ventilators"
            available={inventory?.ventilators_available ?? 0}
            total={inventory?.ventilators_total ?? 0}
            onUpdate={(val) => handleBedUpdate("ventilators_available", val)}
            isPending={isPending}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-red-600" /> Blood Stock
        </h2>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {bloodBank.map((blood) => (
            <div
              key={blood.id}
              className="py-3 flex items-center justify-between"
            >
              <span className="font-black text-slate-700 w-12">
                {blood.blood_group}
              </span>
              <div className="flex items-center gap-4">
                {/* DECREMENT BUTTON */}
                <button
                  disabled={isPending}
                  onClick={() =>
                    handleBloodUpdate(
                      blood.blood_group,
                      blood.units_available ?? 0, // <--- FIX: Fallback to 0 if null
                      -1,
                    )
                  }
                  className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>

                {/* DISPLAY VALUE */}
                <span className="text-lg font-bold text-slate-900 tabular-nums w-8 text-center">
                  {blood.units_available ?? 0}{" "}
                  {/* <--- FIX: Display 0 if null */}
                </span>

                {/* INCREMENT BUTTON */}
                <button
                  disabled={isPending}
                  onClick={() =>
                    handleBloodUpdate(
                      blood.blood_group,
                      blood.units_available ?? 0, // <--- FIX: Fallback to 0 if null
                      1,
                    )
                  }
                  className="p-1 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 3. Use the typed interface here to remove 'any'
function InventoryCard({
  title,
  available,
  total,
  onUpdate,
  isPending,
}: InventoryCardProps) {
  const percentage = total > 0 ? (available / total) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {isPending && (
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-black text-slate-900">{available}</span>
        <span className="text-slate-400 font-medium pb-1">
          / {total} available
        </span>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${percentage < 20 ? "bg-red-500" : "bg-blue-600"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onUpdate(available + 1)}
          disabled={available >= total || isPending}
          className="flex-1 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
        >
          Increment
        </button>
        <button
          onClick={() => onUpdate(available - 1)}
          disabled={available <= 0 || isPending}
          className="flex-1 py-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
