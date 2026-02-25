"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  updateAvailability,
  updateBloodStock,
} from "@/actions/admin/dashboard";
import { Database } from "@/types/database.types";
import {
  Bed,
  Droplets,
  Plus,
  Minus,
  Loader2,
  Edit3,
  Check,
  X,
  Activity,
  AlertCircle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

type Inventory = Database["public"]["Tables"]["hospital_inventory"]["Row"];
type BloodBank = Database["public"]["Tables"]["blood_bank"]["Row"];

interface Props {
  initialInventory: Inventory | null;
  initialBloodBank: BloodBank[];
  hospitalId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Themed Components
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  icon: Icon,
  right,
}: {
  title: string;
  icon: React.ElementType;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <h2 className="text-sm font-bold text-[var(--color-heading)] uppercase tracking-widest flex items-center gap-2">
        <Icon className="w-4 h-4 text-[var(--color-accent)]" /> {title}
      </h2>
      {right}
    </div>
  );
}

interface EditableFieldProps {
  value: number;
  onSave: (newValue: number) => Promise<void>;
  unit?: string;
  max?: number;
  min?: number;
  isPending: boolean;
  size?: "md" | "lg";
}

function EditableField({
  value,
  onSave,
  unit = "units",
  max,
  min = 0,
  isPending,
  size = "lg",
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue)) return;
    if (max !== undefined && numValue > max) return;
    if (min !== undefined && numValue < min) return;

    setIsSaving(true);
    await onSave(numValue);
    setIsSaving(false);
    setIsEditing(false);
  };

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-16 px-2 py-1 bg-white border border-[var(--color-accent)] rounded-lg text-sm font-black text-[var(--color-heading)] focus:outline-none"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={isSaving || isPending}
          className="p-1.5 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-lg hover:bg-[var(--color-success)]/20 transition-colors"
        >
          {isSaving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="p-1.5 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-lg hover:bg-[var(--color-error)]/20 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span
        className={`${size === "lg" ? "text-3xl" : "text-lg"} font-black text-[var(--color-heading)] tabular-nums`}
      >
        {value}
      </span>
      {unit && (
        <span className="text-[10px] font-bold text-[var(--color-muted)] uppercase">
          {unit}
        </span>
      )}
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-[var(--color-muted)] opacity-0 group-hover:opacity-100 hover:text-[var(--color-accent)] transition-all"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bed Card
// ─────────────────────────────────────────────────────────────────────────────

interface BedCardProps {
  title: string;
  description: string;
  available: number;
  total: number;
  onUpdate: (value: number) => Promise<void>;
  isPending: boolean;
}

function BedCard({
  title,
  description,
  available,
  total,
  onUpdate,
  isPending,
}: BedCardProps) {
  const occupied = total - available;
  const pct = total > 0 ? (occupied / total) * 100 : 0;
  const colorClass =
    pct >= 90
      ? "bg-[var(--color-error)]"
      : pct >= 70
        ? "bg-[var(--color-warning)]"
        : "bg-[var(--color-success)]";

  return (
    <div className="bg-white p-5 rounded-2xl border border-[var(--color-border)] hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold text-[var(--color-heading)]">
            {title}
          </h3>
          <p className="text-xs text-[var(--color-muted)]">{description}</p>
        </div>
        <div className="bg-[var(--color-badge-bg)] px-2 py-1 rounded-lg">
          <span className="text-[10px] font-bold text-[var(--color-badge-text)] uppercase">
            Capacity: {total}
          </span>
        </div>
      </div>

      <EditableField
        value={available}
        onSave={onUpdate}
        max={total}
        isPending={isPending}
        unit="beds"
      />

      <div className="mt-5 space-y-2">
        <div className="flex justify-between items-end">
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${pct >= 90 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
          >
            {pct.toFixed(0)}% Occupied
          </span>
          <span className="text-[10px] font-bold text-[var(--color-muted)]">
            {available} Free / {occupied} Filled
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
          <div
            className={`h-full transition-all duration-700 ${colorClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex gap-1.5 mt-4">
        {[-5, -1, 1, 5].map((v) => (
          <button
            key={v}
            disabled={isPending || available + v < 0 || available + v > total}
            onClick={() => onUpdate(available + v)}
            className="flex-1 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-[var(--color-body)] hover:bg-[var(--color-badge-bg)] hover:border-[var(--color-border)] disabled:opacity-30 transition-colors"
          >
            {v > 0 ? `+${v}` : v}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Dashboard
// ─────────────────────────────────────────────────────────────────────────────

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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const invChannel = supabase
      .channel("inv")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "hospital_inventory",
          filter: `hospital_id=eq.${hospitalId}`,
        },
        (p) => {
          setInventory(p.new as Inventory);
          setLastUpdated(new Date().toLocaleTimeString());
        },
      )
      .subscribe();

    const bloodChannel = supabase
      .channel("blood")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blood_bank",
          filter: `hospital_id=eq.${hospitalId}`,
        },
        (p) => {
          if (p.eventType === "UPDATE" || p.eventType === "INSERT") {
            const newData = p.new as BloodBank;
            setBloodBank((prev) =>
              prev.some((b) => b.id === newData.id)
                ? prev.map((b) => (b.id === newData.id ? newData : b))
                : [...prev, newData],
            );
          } else if (p.eventType === "DELETE") {
            const oldData = p.old as { id: string };
            setBloodBank((prev) => prev.filter((b) => b.id !== oldData.id));
          }
          setLastUpdated(new Date().toLocaleTimeString());
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(invChannel);
      supabase.removeChannel(bloodChannel);
    };
  }, [hospitalId, supabase]);

  const handleBedUpdate = async (field: keyof Inventory, value: number) => {
    startTransition(async () => {
      const res = await updateAvailability({ [field]: value });
      if (res.success)
        setInventory((prev) => (prev ? { ...prev, [field]: value } : prev));
    });
  };

  const handleBloodUpdate = async (group: string, val: number) => {
    startTransition(async () => {
      const res = await updateBloodStock(group, Math.max(0, val));
      if (res.success)
        setBloodBank((prev) =>
          prev.map((b) =>
            b.blood_group === group
              ? { ...b, units_available: Math.max(0, val) }
              : b,
          ),
        );
    });
  };

  if (!inventory)
    return (
      <div className="p-12 text-center text-[var(--color-muted)] font-bold animate-pulse">
        Establishing Secure Connection...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[var(--color-heading)] leading-none tracking-tight">
              Inventory Terminal
            </h1>
            <p className="text-[10px] font-bold text-[var(--color-muted)] uppercase mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full animate-pulse" />
              Live Sync Active • {lastUpdated || "Connected"}
            </p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-[var(--color-badge-bg)] text-[var(--color-heading)] text-xs font-bold rounded-xl border border-[var(--color-border)] transition-all"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Bed Management */}
        <div className="lg:col-span-8 space-y-4">
          <SectionHeader title="Bed Availability" icon={Bed} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BedCard
              title="General Ward"
              description="Standard patient beds"
              available={inventory.available_beds ?? 0}
              total={inventory.total_beds ?? 0}
              onUpdate={(v) => handleBedUpdate("available_beds", v)}
              isPending={isPending}
            />
            <BedCard
              title="ICU Units"
              description="Critical care support"
              available={inventory.icu_beds_available ?? 0}
              total={inventory.icu_beds_total ?? 0}
              onUpdate={(v) => handleBedUpdate("icu_beds_available", v)}
              isPending={isPending}
            />
            <div className="md:col-span-2">
              <BedCard
                title="Ventilators"
                description="Life support equipment"
                available={inventory.ventilators_available ?? 0}
                total={inventory.ventilators_total ?? 0}
                onUpdate={(v) => handleBedUpdate("ventilators_available", v)}
                isPending={isPending}
              />
            </div>
          </div>
        </div>

        {/* Right: Blood Bank Management */}
        <div className="lg:col-span-4 space-y-4">
          <SectionHeader title="Blood Bank" icon={Droplets} />
          <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
            <div className="divide-y divide-[var(--color-border)]/50">
              {bloodBank.map((blood) => {
                const units = blood.units_available ?? 0;
                const isLow = units < 5;
                return (
                  <div
                    key={blood.id}
                    className="p-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black ${isLow ? "bg-red-100 text-red-600" : "bg-[var(--color-badge-bg)] text-[var(--color-badge-text)]"}`}
                        >
                          {blood.blood_group}
                        </span>
                        {isLow && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 animate-pulse">
                            <AlertCircle className="w-3 h-3" /> LOW
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={isPending}
                          onClick={() =>
                            handleBloodUpdate(blood.blood_group, units - 1)
                          }
                          className="p-1 bg-white border border-[var(--color-border)] rounded-md text-[var(--color-muted)] hover:text-[var(--color-error)]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <div className="px-2">
                          <EditableField
                            value={units}
                            onSave={(val) =>
                              handleBloodUpdate(blood.blood_group, val)
                            }
                            isPending={isPending}
                            unit=""
                            size="md"
                          />
                        </div>

                        <button
                          disabled={isPending}
                          onClick={() =>
                            handleBloodUpdate(blood.blood_group, units + 1)
                          }
                          className="p-1 bg-white border border-[var(--color-border)] rounded-md text-[var(--color-muted)] hover:text-[var(--color-success)]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {/* Visual Progress Bar for Blood */}
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${isLow ? "bg-[var(--color-error)]" : "bg-[var(--color-success)]"}`}
                        style={{
                          width: `${Math.min(100, (units / 20) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
