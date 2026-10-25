import { z } from "zod";

export const CreateDoctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Doctor name must be at least 2 characters")
    .max(100, "Doctor name cannot exceed 100 characters"),
  specialty_id: z
    .string()
    .uuid("Invalid specialty identifier")
    .nullable()
    .optional(),
  experience_years: z.coerce
    .number()
    .int()
    .min(0, "Experience cannot be negative")
    .max(70, "Experience years unrealistic")
    .nullable()
    .optional(),
  room_number: z.string().trim().max(50).nullable().optional(),
  is_available: z.boolean().optional(),
  status: z
    .enum([
      "Available",
      "In_OPD",
      "In_Surgery",
      "On_Call",
      "On_Leave",
      "Emergency_Only",
    ])
    .nullable()
    .optional(),
});

export const UpdateDoctorSchema = CreateDoctorSchema.partial();

export const SendReferralSchema = z.object({
  patient_name: z
    .string()
    .trim()
    .min(2, "Patient name must be at least 2 characters")
    .max(100, "Patient name cannot exceed 100 characters"),
  patient_age: z.coerce
    .number()
    .int()
    .min(0, "Patient age cannot be negative")
    .max(130, "Invalid patient age"),
  patient_gender: z.string().trim().min(1, "Patient gender is required").max(20),
  priority: z.enum(["Routine", "Urgent", "Critical"]),
  to_hospital_id: z.string().uuid("Invalid recipient hospital ID"),
  medical_reason: z.string().trim().max(2000).nullable().optional(),
  specialty_required: z.string().trim().max(100).nullable().optional(),
});

export const UpdateReferralStatusSchema = z.object({
  referralId: z.string().uuid("Invalid referral ID"),
  status: z.enum(["Pending", "Accepted", "Rejected", "Completed"]),
  rejectionReason: z.string().trim().max(1000).optional(),
});

export const LocationSchema = z.object({
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters"),
  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(100, "State cannot exceed 100 characters"),
});

export const ServiceSchema = z.object({
  service_name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters")
    .max(100, "Service name cannot exceed 100 characters"),
  description: z.string().trim().max(1000).optional().nullable(),
});

export const SpecialtySchema = z.object({
  specialty_name: z
    .string()
    .trim()
    .min(2, "Specialty name must be at least 2 characters")
    .max(100, "Specialty name cannot exceed 100 characters"),
  description: z.string().trim().max(1000).optional().nullable(),
});
