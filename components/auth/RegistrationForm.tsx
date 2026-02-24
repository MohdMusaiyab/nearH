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
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  locations: { id: string; city: string; state: string }[];
}

const steps = ["Admin Credentials", "Hospital Details"];

function InputField({
  label,
  error,
  icon: Icon,
  hint,
  children,
}: {
  label: string;
  error?: string;
  icon?: React.ElementType;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-[var(--color-heading)] uppercase tracking-widest block">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] group-focus-within:text-[var(--color-accent)] transition-colors pointer-events-none z-10"
          />
        )}
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-[var(--color-error)] font-semibold pl-1 flex items-center gap-1"
          >
            <AlertCircle size={10} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && !error && (
        <p className="text-[10px] text-[var(--color-muted)] pl-1">{hint}</p>
      )}
    </div>
  );
}

const inputCls = (hasIcon = true) =>
  `w-full ${hasIcon ? "pl-11" : "pl-4"} pr-4 py-3 bg-[var(--color-badge-bg)] border border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-heading)] placeholder:text-[var(--color-muted)] placeholder:font-normal outline-none focus:bg-white focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/10 transition-all`;

export default function RegistrationForm({ locations }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
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

  const step1Fields: (keyof AdminSignupInput)[] = [
    "full_name",
    "email",
    "password",
    "confirmPassword",
  ];

  const handleNext = async () => {
    const valid = await trigger(step1Fields);
    if (valid) setStep(1);
  };

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
      setServerError("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-7">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className="flex items-center gap-2 group"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                  i < step
                    ? "bg-[var(--color-success)] text-white"
                    : i === step
                      ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/30"
                      : "bg-[var(--color-badge-bg)] text-[var(--color-muted)] border border-[var(--color-border)]"
                }`}
              >
                {i < step ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block transition-colors ${
                  i === step
                    ? "text-[var(--color-accent)]"
                    : i < step
                      ? "text-[var(--color-success)]"
                      : "text-[var(--color-muted)]"
                }`}
              >
                {s}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3 h-px bg-[var(--color-border)] relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[var(--color-accent)]"
                  animate={{ width: step > i ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Server error */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl mb-5"
          >
            <AlertCircle
              size={14}
              className="text-[var(--color-error)] flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-[var(--color-error)] font-medium">
              {serverError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <InputField
                label="Full Name"
                error={errors.full_name?.message}
                icon={User}
              >
                <input
                  {...register("full_name")}
                  className={inputCls()}
                  placeholder="Dr. Rajesh Kumar"
                />
              </InputField>

              <InputField
                label="Login Email"
                error={errors.email?.message}
                icon={Mail}
              >
                <input
                  {...register("email")}
                  type="email"
                  className={inputCls()}
                  placeholder="admin@hospital.com"
                />
              </InputField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Password"
                  error={errors.password?.message}
                  icon={Lock}
                >
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={`${inputCls()} pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </InputField>

                <InputField
                  label="Confirm Password"
                  error={errors.confirmPassword?.message}
                  icon={Lock}
                >
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    className={`${inputCls()} pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </InputField>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-black rounded-xl shadow-lg shadow-[var(--color-accent)]/30 active:scale-[0.98] transition-all mt-2"
              >
                Continue to Hospital Details
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <InputField
                label="Hospital Legal Name"
                error={errors.hospital_name?.message}
                icon={Building2}
              >
                <input
                  {...register("hospital_name")}
                  className={inputCls()}
                  placeholder="Apollo Hospitals Ltd."
                />
              </InputField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Official Public Email"
                  error={errors.official_email?.message}
                  icon={Mail}
                >
                  <input
                    {...register("official_email")}
                    className={inputCls()}
                    placeholder="contact@hospital.com"
                  />
                </InputField>

                <InputField
                  label="Official Phone"
                  error={errors.official_phone?.message}
                  icon={Phone}
                >
                  <input
                    {...register("official_phone")}
                    className={inputCls()}
                    placeholder="+91 98765 43210"
                  />
                </InputField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Operating City"
                  error={errors.location_id?.message}
                  icon={MapPin}
                >
                  <select
                    {...register("location_id")}
                    className={`${inputCls()} pr-10 appearance-none`}
                  >
                    <option value="">Select city</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city}, {loc.state}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
                  />
                </InputField>

                <InputField
                  label="Emergency Contact (24/7)"
                  error={errors.emergency_contact?.message}
                  icon={Phone}
                  hint="10-digit mobile number"
                >
                  <input
                    {...register("emergency_contact")}
                    className={inputCls()}
                    placeholder="9876543210"
                  />
                </InputField>
              </div>

              {/* Ayushman Bharat toggle */}
              <label className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-badge-bg)] border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-accent)] transition-colors group">
                <input
                  {...register("has_ayushman_bharat")}
                  id="ayushman"
                  type="checkbox"
                  className="w-5 h-5 rounded accent-[var(--color-accent)] cursor-pointer"
                />
                <div>
                  <p className="text-sm font-bold text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors">
                    Ayushman Bharat (PM-JAY) Empanelled
                  </p>
                  <p className="text-[10px] text-[var(--color-muted)] mt-0.5">
                    Check if your hospital is registered under the scheme
                  </p>
                </div>
              </label>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 py-3.5 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-heading)] hover:bg-[var(--color-badge-bg)] active:scale-[0.98] transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] flex items-center justify-center gap-2.5 py-3.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-black rounded-xl shadow-lg shadow-[var(--color-accent)]/30 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Registering…
                    </>
                  ) : (
                    <>
                      Register Hospital
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
