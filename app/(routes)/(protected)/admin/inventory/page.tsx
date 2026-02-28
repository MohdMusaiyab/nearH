"use client";

import { useState, useEffect } from "react";
import {
  getDashboardData,
  updateInventory,
  initializeBloodBank,
} from "@/actions/admin/dashboard";
import {
  Loader2,
  Droplets,
  Settings2,
  Info,
  Truck,
  Wind,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Database } from "@/types/database.types";
import { toast } from "sonner";
import {  ConfigProvider, App as AntApp } from "antd";

type Inventory = Database["public"]["Tables"]["hospital_inventory"]["Row"];

function InventorySettingsContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Inventory | null>(null);
  const { modal } = AntApp.useApp();

  useEffect(() => {
    async function load() {
      const res = await getDashboardData();
      if (res.success) setData(res.data?.inventory || null);
      setLoading(false);
    }
    load();
  }, []);

  const handleInitBlood = () => {
    modal.confirm({
      title: (
        <span className="font-black text-heading">
          Initialize Blood Bank?
        </span>
      ),
      icon: <Droplets className="text-red-500 w-5 h-5" />,
      content:
        "This will create records for all 8 standard blood groups with 0 units. Proceed?",
      okText: "Initialize Now",
      cancelText: "Cancel",
      centered: true,
      okButtonProps: { className: "!rounded-xl !font-bold !bg-red-600" },
      cancelButtonProps: { className: "!rounded-xl !font-bold" },
      async onOk() {
        const res = await initializeBloodBank();
        if (res.success) {
          toast.success("Blood Bank Initialized", {
            description:
              "All standard groups are now ready for stock management.",
          });
        }
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      total_beds: Math.max(
        0,
        parseInt(formData.get("total_beds") as string) || 0,
      ),
      icu_beds_total: Math.max(
        0,
        parseInt(formData.get("icu_beds_total") as string) || 0,
      ),
      ventilators_total: Math.max(
        0,
        parseInt(formData.get("ventilators_total") as string) || 0,
      ),
      ambulance_available_count: Math.max(
        0,
        parseInt(formData.get("ambulance_available_count") as string) || 0,
      ),
      oxygen_status: formData.get("oxygen_status") === "true",
    };

    const res = await updateInventory(payload);
    if (res.success) {
      toast.success("Infrastructure Updated", {
        description: "Facility maximum capacities have been synchronized.",
      });
    } else {
      toast.error("Update Failed", { description: res.message });
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
        <p className="text-xs font-black text-muted uppercase tracking-widest">
          Loading Infrastructure Data...
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Page Header (NearH Pattern) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-heading flex items-center justify-center shadow-lg shadow-slate-200 flex-shrink-0">
            <Settings2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-heading tracking-tight leading-none">
              Infrastructure Settings
            </h1>
            <p className="text-sm text-muted mt-1">
              Configure baseline capacities for beds, equipment, and resources.
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Setup Assistants */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="bg-badge-bg/30 border border-border p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center mb-4">
              <Droplets className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-black text-heading text-sm uppercase tracking-tight mb-2">
              Blood Bank Setup
            </h3>
            <p className="text-xs text-muted font-medium leading-relaxed mb-5">
              If your hospital maintains a blood bank but the dashboard shows no
              stock groups, use this to initialize the system.
            </p>
            <button
              onClick={handleInitBlood}
              className="w-full py-3 bg-white border border-border text-heading rounded-xl text-xs font-black hover:bg-badge-bg transition-all shadow-sm active:scale-95"
            >
              Initialize Standard Groups
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-emerald-600" />
              <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                Administrator Tip
              </h4>
            </div>
            <p className="text-xs text-emerald-700 font-medium leading-relaxed">
              These values define your 100% capacity mark. Changing these will
              immediately update the occupancy percentages on your live
              dashboard.
            </p>
          </div>
        </div>

        {/* Right Col: Capacity Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 space-y-6 order-1 lg:order-2"
        >
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                {
                  label: "Total General Beds",
                  name: "total_beds",
                  val: data?.total_beds,
                  icon: Activity,
                },
                {
                  label: "Total ICU Units",
                  name: "icu_beds_total",
                  val: data?.icu_beds_total,
                  icon: Activity,
                },
                {
                  label: "Total Ventilators",
                  name: "ventilators_total",
                  val: data?.ventilators_total,
                  icon: Wind,
                },
                {
                  label: "Ambulance Fleet Size",
                  name: "ambulance_available_count",
                  val: data?.ambulance_available_count,
                  icon: Truck,
                },
              ].map((field) => (
                <div key={field.name} className="space-y-2.5">
                  <label className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                    <field.icon className="w-3 h-3" /> {field.label}
                  </label>
                  <input
                    name={field.name}
                    type="number"
                    min="0"
                    defaultValue={field.val ?? 0}
                    onKeyDown={(e) =>
                      (e.key === "-" || e.key === "e") && e.preventDefault()
                    }
                    className="w-full p-3.5 bg-slate-50 border border-border rounded-2xl text-lg font-black text-heading focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-50">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest block mb-3">
                Liquid Medical Oxygen (LMO) Plant
              </label>
              <select
                name="oxygen_status"
                defaultValue={String(data?.oxygen_status)}
                className="w-full p-4 bg-slate-50 border border-border rounded-2xl text-sm font-bold text-heading focus:bg-white outline-none transition-all appearance-none"
              >
                <option value="true">
                  Facility Equipped with Functional Plant
                </option>
                <option value="false">
                  No Plant / Non-Functional / Relying on Cylinders
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4.5 bg-heading text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Save Infrastructure Caps
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Root Export with Providers ──
export default function InventorySettingsPage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0284C7",
          borderRadius: 12,
          fontFamily: "var(--font-sans)",
        },
      }}
    >
      <AntApp>
        <InventorySettingsContent />
      </AntApp>
    </ConfigProvider>
  );
}
