"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminSignupSchema,
  type AdminSignupInput,
} from "@/lib/validations/auth";
import { signup } from "@/actions/auth";
import { useRouter } from "next/navigation";

interface Props {
  locations: { id: string; city: string; state: string }[];
}

export default function RegistrationForm({ locations }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSignupInput>({
    resolver: zodResolver(AdminSignupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      hospital_name: "",
      official_email: "",
      official_phone: "",
      location_id: "",
      emergency_contact: "",
      has_ayushman_bharat: false,
    },
  });

  const onSubmit = async (data: AdminSignupInput) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await signup(data);
      if (result.success) {
        router.push("/auth/waiting-room");
        router.refresh();
      } else {
        setServerError(result.message);
      }
    } catch (err) {
      setServerError("A critical network error occurred." + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <div className="p-3 text-xs bg-orange-50 border border-orange-200 text-orange-800 rounded">
          Please fix the highlighted errors below to continue.
        </div>
      )}

      {serverError && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 font-medium">
          {serverError}
        </div>
      )}

      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">
            1
          </span>
          Admin Credentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              {...register("full_name")}
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="John Doe"
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Login Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@hospital.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Login Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">
            2
          </span>
          Hospital Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Hospital Legal Name
            </label>
            <input
              {...register("hospital_name")}
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.hospital_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.hospital_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Official Public Email
            </label>
            <input
              {...register("official_email")}
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="contact@hospital.com"
            />
            {errors.official_email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.official_email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Official Phone
            </label>
            <input
              {...register("official_phone")}
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.official_phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.official_phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 text-black">
              Operating City
            </label>
            <select
              {...register("location_id")}
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none appearance-none"
              style={{ color: "black" }}
            >
              <option value="" className="text-slate-400">
                Select city
              </option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="text-black">
                  {loc.city}, {loc.state}
                </option>
              ))}
            </select>
            {errors.location_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.location_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Emergency Contact (24/7)
            </label>
            <input
              {...register("emergency_contact")}
              placeholder="10-digit mobile"
              className="w-full px-4 py-2 mt-1 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.emergency_contact && (
              <p className="text-red-500 text-xs mt-1">
                {errors.emergency_contact.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
            <input
              {...register("has_ayushman_bharat")}
              id="ayushman"
              type="checkbox"
              className="h-5 w-5 text-blue-600 rounded"
            />
            <label
              htmlFor="ayushman"
              className="ml-3 text-sm font-semibold text-blue-900"
            >
              Empanelled under Ayushman Bharat (PM-JAY)
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-4 rounded-xl shadow-lg text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-400"
      >
        {isLoading ? "Creating Your Account..." : "Register Hospital"}
      </button>
    </form>
  );
}
