"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDoctor, updateDoctor } from "@/actions/admin/doctor";
import { Database } from "@/types/database.types";
import { Loader2, Save, Calendar } from "lucide-react";

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

export default function DoctorForm({ specialties, initialData }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initialData;

  const schedule =
    (initialData?.availability_schedule as unknown as DoctorSchedule) || {
      available_days: [],
      notes: "",
    };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

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
      router.push("/admin/doctors");
      router.refresh();
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
    >
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Doctor&apos;s Full Name
          </label>
          <input
            name="name"
            required
            defaultValue={initialData?.name}
            placeholder="Dr. Shrusti Patil"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
          />
        </div>

        {}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Specialty</label>
          <select
            name="specialty_id"
            defaultValue={initialData?.specialty_id || ""}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
          >
            <option value="">Select Specialty</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.specialty_name}
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Experience (Years)
          </label>
          <input
            name="experience_years"
            type="number"
            defaultValue={initialData?.experience_years || 0}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
          />
        </div>

        {}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            OPD Room Number
          </label>
          <input
            name="room_number"
            defaultValue={initialData?.room_number || ""}
            placeholder="e.g. 204-B"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
          />
        </div>

        {}
        <div className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            name="is_available"
            id="is_available"
            defaultChecked={initialData?.is_available ?? true}
            className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <label
            htmlFor="is_available"
            className="text-sm font-bold text-slate-700 cursor-pointer"
          >
            Currently on Duty / Active
          </label>
        </div>
      </div>

      {}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          Weekly OPD Schedule
        </label>
        <div className="flex flex-wrap gap-3">
          {DAYS.map((day) => (
            <label
              key={day}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-white hover:border-indigo-300 transition-all"
            >
              <input
                type="checkbox"
                name="days"
                value={day}
                className="rounded text-indigo-600"
                defaultChecked={schedule.available_days?.includes(day)}
              />
              <span className="text-xs font-bold text-slate-600 uppercase">
                {day}
              </span>
            </label>
          ))}
        </div>
        <textarea
          name="schedule_notes"
          placeholder="e.g. 10:00 AM - 02:00 PM (Every Mon & Wed)"
          defaultValue={schedule.notes || ""}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          rows={2}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100 disabled:bg-slate-300"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              {isEdit ? "Update Profile" : "Create Doctor Profile"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
