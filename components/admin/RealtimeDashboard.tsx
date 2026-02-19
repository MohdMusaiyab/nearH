"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateAvailability, updateBloodStock } from "@/actions/admin/dashboard";
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
  RefreshCw
} from "lucide-react";

type Inventory = Database["public"]["Tables"]["hospital_inventory"]["Row"];
type BloodBank = Database["public"]["Tables"]["blood_bank"]["Row"];

interface Props {
  initialInventory: Inventory | null;
  initialBloodBank: BloodBank[];
  hospitalId: string;
}

// Editable field component with inline editing
function EditableField({ 
  value, 
  onSave, 
  label,
  unit = "beds",
  max,
  min = 0,
  isPending 
}: { 
  value: number; 
  onSave: (newValue: number) => Promise<void>;
  label: string;
  unit?: string;
  max?: number;
  min?: number;
  isPending: boolean;
}) {
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

  const handleCancel = () => {
    setInputValue(value.toString());
    setIsEditing(false);
  };

  // Update input value when parent value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-24 px-3 py-2 bg-white border-2 border-indigo-200 rounded-xl text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none"
          min={min}
          max={max}
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={isSaving || isPending}
          className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>
        <button
          onClick={handleCancel}
          className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 group">
      <div>
        <span className="text-3xl font-black text-slate-900">{value}</span>
        <span className="text-sm text-slate-400 ml-1">{unit}</span>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 bg-slate-100 text-slate-400 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-indigo-100 hover:text-indigo-600 transition-all"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Quick action buttons for common increments
function QuickActions({ 
  onAction, 
  currentValue, 
  max,
  isPending 
}: { 
  onAction: (newValue: number) => void;
  currentValue: number;
  max: number;
  isPending: boolean;
}) {
  const actions = [
    { label: '−10', value: currentValue - 10 },
    { label: '−5', value: currentValue - 5 },
    { label: '−1', value: currentValue - 1 },
    { label: '+1', value: currentValue + 1 },
    { label: '+5', value: currentValue + 5 },
    { label: '+10', value: currentValue + 10 },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {actions.map((action) => {
        const isDisabled = action.value < 0 || action.value > max || isPending;
        return (
          <button
            key={action.label}
            onClick={() => onAction(action.value)}
            disabled={isDisabled}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

// Bed Card Component
function BedCard({ 
  title,
  description,
  available,
  total,
  onUpdate,
  isPending
}: { 
  title: string;
  description: string;
  available: number;
  total: number;
  onUpdate: (value: number) => Promise<void>;
  isPending: boolean;
}) {
  const occupied = total - available;
  const occupancyPercentage = total > 0 ? (occupied / total) * 100 : 0;
  
  const getOccupancyColor = () => {
    if (occupancyPercentage >= 80) return "bg-red-500";
    if (occupancyPercentage >= 50) return "bg-amber-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (occupancyPercentage >= 80) return "Critical";
    if (occupancyPercentage >= 50) return "Moderate";
    return "Good";
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-black text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Total Capacity</div>
          <span className="text-2xl font-black text-slate-900">{total}</span>
        </div>
      </div>

      <EditableField
        value={available}
        onSave={onUpdate}
        label="Available"
        unit="beds"
        max={total}
        isPending={isPending}
      />

      {/* Clear Occupancy Display */}
      <div className="mt-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-green-50 p-3 rounded-xl">
            <p className="text-xs text-green-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              FREE
            </p>
            <p className="text-2xl font-black text-green-700">{available}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl">
            <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              OCCUPIED
            </p>
            <p className="text-2xl font-black text-amber-700">{occupied}</p>
          </div>
        </div>
        
        {/* Progress Bar with Labels */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-medium">0%</span>
            <span className="text-slate-700 font-bold flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${getOccupancyColor()}`}></span>
              {occupancyPercentage.toFixed(0)}% Occupied ({getStatusText()})
            </span>
            <span className="text-slate-500 font-medium">100%</span>
          </div>
          
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getOccupancyColor()}`}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-400">
            <span>Free: {available}</span>
            <span>Occupied: {occupied}</span>
          </div>
        </div>
      </div>

      <QuickActions
        currentValue={available}
        max={total}
        onAction={onUpdate}
        isPending={isPending}
      />
    </div>
  );
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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
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
        (payload) => {
          console.log("Inventory update received:", payload.new);
          setInventory(payload.new as Inventory);
          setLastUpdated(new Date().toLocaleTimeString());
        },
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
          console.log("Blood bank update received:", payload);
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            setBloodBank((prev) => {
              const newBlood = payload.new as BloodBank;
              const exists = prev.some(b => b.id === newBlood.id);
              if (exists) {
                return prev.map(b => b.id === newBlood.id ? newBlood : b);
              }
              return [...prev, newBlood];
            });
          } else if (payload.eventType === "DELETE") {
            setBloodBank((prev) => prev.filter(b => b.id !== payload.old.id));
          }
          setLastUpdated(new Date().toLocaleTimeString());
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(bloodChannel);
    };
  }, [hospitalId, supabase]);

  const handleBedUpdate = async (field: keyof Pick<Inventory, 'available_beds' | 'icu_beds_available' | 'ventilators_available'>, value: number) => {
    startTransition(async () => {
      const result = await updateAvailability({ [field]: value });
      if (result.success) {
        // Optimistically update local state
        setInventory(prev => prev ? { ...prev, [field]: value } : prev);
      }
    });
  };

  const handleBloodUpdate = async (groupId: string, currentUnits: number, newUnits: number) => {
    startTransition(async () => {
      const result = await updateBloodStock(groupId, Math.max(0, newUnits));
      if (result.success) {
        // Optimistically update local state
        setBloodBank(prev => 
          prev.map(b => 
            b.blood_group === groupId 
              ? { ...b, units_available: Math.max(0, newUnits) }
              : b
          )
        );
      }
    });
  };

  // Manual refresh button
  const handleRefresh = () => {
    window.location.reload();
  };

  if (!inventory) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin inline mr-2" /> Loading inventory...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Last Updated Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Activity className="w-3 h-3" />
          <span>Last updated: {lastUpdated || 'Just now'}</span>
          {isPending && (
            <>
              <Loader2 className="w-3 h-3 animate-spin ml-2" />
              <span className="text-indigo-500">Updating...</span>
            </>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Inventory Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bed className="w-5 h-5 text-blue-600" /> Bed Availability
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* General Beds Card */}
            <BedCard
              title="General Beds"
              description="Regular ward beds"
              available={inventory.available_beds ?? 0}
              total={inventory.total_beds ?? 0}
              onUpdate={(val) => handleBedUpdate("available_beds", val)}
              isPending={isPending}
            />

            {/* ICU Beds Card */}
            <BedCard
              title="ICU Beds"
              description="Intensive Care Units"
              available={inventory.icu_beds_available ?? 0}
              total={inventory.icu_beds_total ?? 0}
              onUpdate={(val) => handleBedUpdate("icu_beds_available", val)}
              isPending={isPending}
            />

            {/* Ventilators Card */}
            <BedCard
              title="Ventilators"
              description="Mechanical ventilators"
              available={inventory.ventilators_available ?? 0}
              total={inventory.ventilators_total ?? 0}
              onUpdate={(val) => handleBedUpdate("ventilators_available", val)}
              isPending={isPending}
            />
          </div>
        </div>

        {/* Blood Bank Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-red-600" /> Blood Stock
          </h2>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-4">
              {bloodBank.map((blood) => {
                const units = blood.units_available ?? 0;
                return (
                  <div key={blood.id} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-black text-slate-900 text-lg">
                        {blood.blood_group}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isPending}
                          onClick={() => handleBloodUpdate(
                            blood.blood_group,
                            units,
                            units - 1
                          )}
                          className="p-2 bg-white rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <EditableField
                          value={units}
                          onSave={(val) => handleBloodUpdate(blood.blood_group, units, val)}
                          label=""
                          unit="units"
                          isPending={isPending}
                        />
                        
                        <button
                          disabled={isPending}
                          onClick={() => handleBloodUpdate(
                            blood.blood_group,
                            units,
                            units + 1
                          )}
                          className="p-2 bg-white rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Stock indicator */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">0</span>
                        <span className="text-slate-700 font-bold">
                          {units} units
                        </span>
                        <span className="text-slate-500">20+</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            units < 5 ? "bg-red-500" : 
                            units < 10 ? "bg-amber-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(100, (units / 20) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Low stock warning */}
                    {units < 5 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>Low stock - only {units} units left</span>
                      </div>
                    )}
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