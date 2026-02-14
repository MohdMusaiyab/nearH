"use client";

import { useState, useEffect } from "react";
import {
  getDashboardData,
  updateInventory,
  initializeBloodBank,
} from "@/actions/admin/dashboard";
import { Save, Loader2, Droplets } from "lucide-react";
import { Database } from "@/types/database.types";

type Inventory = Database["public"]["Tables"]["hospital_inventory"]["Row"];

export default function InventorySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Inventory | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getDashboardData();
      if (res.success) setData(res.data?.inventory || null);
      setLoading(false);
    }
    load();
  }, []);

  const handleInitBlood = async () => {
    if (confirm("Initialize all 8 blood groups with 0 units?")) {
      await initializeBloodBank();
      alert("Blood Bank Ready!");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      total_beds: parseInt(formData.get("total_beds") as string) || 0,
      icu_beds_total: parseInt(formData.get("icu_beds_total") as string) || 0,
      ventilators_total:
        parseInt(formData.get("ventilators_total") as string) || 0,
      ambulance_available_count:
        parseInt(formData.get("ambulance_available_count") as string) || 0,
      oxygen_status: formData.get("oxygen_status") === "true",
    };

    const res = await updateInventory(payload);
    if (res.success) alert("Inventory caps updated!");
    setSaving(false);
  };

  if (loading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin inline mr-2" /> Loading...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Infrastructure Settings
        </h1>
        <p className="text-slate-500">
          Set the total capacity of your facility. These values act as the Max
          limit for your dashboard.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4" /> Setup Blood Bank
            </h3>
            <p className="text-xs text-indigo-700 mb-4">
              If your blood bank stock is showing as empty, click below to
              initialize the standard groups.
            </p>
            <button
              onClick={handleInitBlood}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
            >
              Initialize Stock Rows
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Total General Beds
              </label>
              <input
                name="total_beds"
                type="number"
                defaultValue={data?.total_beds ?? 0}
                className="w-full p-3 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Total ICU Beds
              </label>
              <input
                name="icu_beds_total"
                type="number"
                defaultValue={data?.icu_beds_total ?? 0}
                className="w-full p-3 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Total Ventilators
              </label>
              <input
                name="ventilators_total"
                type="number"
                defaultValue={data?.ventilators_total ?? 0}
                className="w-full p-3 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Ambulance Fleet Size
              </label>
              <input
                name="ambulance_available_count"
                type="number"
                defaultValue={data?.ambulance_available_count ?? 0}
                className="w-full p-3 bg-slate-50 border rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Oxygen Plant Status
            </label>
            <select
              name="oxygen_status"
              defaultValue={String(data?.oxygen_status)}
              className="w-full p-3 bg-slate-50 border rounded-xl"
            >
              <option value="true">Active / Functional</option>
              <option value="false">Non-Functional / Out of Stock</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Infrastructure Caps
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
