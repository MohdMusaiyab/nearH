"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDoctor, updateDoctor } from "@/actions/admin/doctor";
import { Database } from "@/types/database.types";
import {
  Loader2,
  Save,
  Calendar,
  User,
  Hash,
  Briefcase,
  MapPin,
  CheckCircle2,
  X,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Modal, ConfigProvider, App as AntApp } from "antd";

interface DoctorSchedule {
  available_days: string[];
  notes: string;
}

type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];
type Doctor = Database["public"]["Tables"]["doctors"]["Row"];

interface Props {
  specialties: Specialty[];
  initialData?: Doctor;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DoctorFormContent({ specialties, initialData }: Props) {
  const router = useRouter();
  const { modal } = AntApp.useApp();
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!initialData;
  const schedule =
    (initialData?.availability_schedule as unknown as DoctorSchedule) || {
      available_days: [],
      notes: "",
    };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      specialty_id: (formData.get("specialty_id") as string) || null,
      experience_years:
        parseInt(formData.get("experience_years") as string) || 0,
      room_number: formData.get("room_number") as string,
      is_available: formData.get("is_available") === "on",
      availability_schedule: {
        available_days: formData.getAll("days") as string[],
        notes: formData.get("schedule_notes") as string,
      },
    };

    const result =
      isEdit && initialData
        ? await updateDoctor(initialData.id, payload)
        : await createDoctor(payload);

    if (result.success) {
      toast.success(isEdit ? "Profile Updated" : "Doctor Registered", {
        description: `${payload.name} has been saved to the directory.`,
      });
      router.push("/admin/doctors");
      router.refresh();
    } else {
      toast.error("Operation Failed", { description: result.message });
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    modal.confirm({
      title: (
        <span className="font-black text-heading">
          Discard Changes?
        </span>
      ),
      icon: <AlertCircle className="text-warning" />,
      content:
        "Any unsaved information will be lost. Are you sure you want to go back?",
      okText: "Yes, Discard",
      cancelText: "Continue Editing",
      centered: true,
      mask: { closable: true },
      okButtonProps: { className: "!rounded-xl !font-bold" },
      cancelButtonProps: { className: "!rounded-xl !font-bold" },
      onOk: () => router.back(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Basic Information Card ── */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
          <User className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-black text-heading uppercase tracking-widest">
            General Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-tighter">
              Full Name
            </label>
            <div className="relative">
              <input
                name="name"
                required
                defaultValue={initialData?.name}
                placeholder="Dr. Shrusti Patil"
                className="w-full pl-4 pr-4 py-3 bg-badge-bg/30 border border-border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none text-heading font-bold transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-tighter">
              Specialty
            </label>
            <select
              name="specialty_id"
              required
              defaultValue={initialData?.specialty_id || ""}
              className="w-full px-4 py-3 bg-badge-bg/30 border border-border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none text-heading font-bold appearance-none transition-all"
            >
              <option value="">Select Specialty</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.specialty_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-tighter">
              Years of Experience
            </label>
            <div className="relative">
              <input
                name="experience_years"
                type="number"
                required
                min="0" // Prevents negative values in the browser
                defaultValue={initialData?.experience_years || 0}
                onKeyDown={(e) => {
                  // Prevents the user from typing '-' or 'e' manually
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
                className="w-full pl-4 pr-10 py-3 bg-badge-bg/30 border border-border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none text-heading font-bold transition-all"
              />
              <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted uppercase tracking-tighter">
              OPD Room Number
            </label>
            <div className="relative">
              <input
                name="room_number"
                defaultValue={initialData?.room_number || ""}
                placeholder="e.g. 204-B"
                className="w-full px-4 py-3 bg-badge-bg/30 border border-border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent outline-none text-heading font-bold transition-all"
              />
              <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <div className="flex items-center gap-3 md:pt-8">
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_available"
                id="is_available"
                defaultChecked={initialData?.is_available ?? true}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
              <label
                htmlFor="is_available"
                className="ml-3 text-sm font-bold text-heading"
              >
                Active on Directory
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── Schedule Card ── */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
          <Calendar className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-black text-heading uppercase tracking-widest">
            OPD Schedule
          </h2>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-muted uppercase tracking-widest">
            Select Available Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <label
                key={day}
                className="relative flex items-center justify-center px-4 py-2 rounded-xl border border-border bg-badge-bg/20 cursor-pointer hover:border-accent/40 transition-all has-[:checked]:bg-accent has-[:checked]:text-white has-[:checked]:border-accent group"
              >
                <input
                  type="checkbox"
                  name="days"
                  value={day}
                  className="sr-only"
                  defaultChecked={schedule.available_days?.includes(day)}
                />
                <span className="text-xs font-black uppercase tracking-tight group-has-[:checked]:text-white">
                  {day}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-2">
            <label className="text-xs font-black text-muted uppercase tracking-widest block mb-2">
              Timing Notes
            </label>
            <textarea
              name="schedule_notes"
              placeholder="e.g. 10:00 AM - 02:00 PM (Monday & Wednesday)"
              defaultValue={schedule.notes || ""}
              className="w-full px-4 py-3 bg-badge-bg/30 border border-border rounded-xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              {isEdit ? "Update Medical Profile" : "Create Doctor Profile"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-10 py-4 bg-white border border-border text-muted font-bold rounded-2xl hover:bg-slate-50 hover:text-heading transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function DoctorForm(props: Props) {
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
        <DoctorFormContent {...props} />
      </AntApp>
    </ConfigProvider>
  );
}
