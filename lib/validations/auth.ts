import { z } from "zod";

const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^a-zA-Z0-9]/,
    "Password must contain at least one special character",
  );

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid official email")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const AdminSignupSchema = z
  .object({
    full_name: z.string().min(2),
    email: z.string().email().trim().toLowerCase(),
    password: passwordRule,
    confirmPassword: z.string(),

    hospital_name: z.string().min(3),
    official_email: z.string().email("Hospital official email is required"),
    official_phone: z.string().min(10, "Hospital phone is required"),
    location_id: z.string().uuid(),
    has_ayushman_bharat: z.boolean(),
    emergency_contact: z.string().regex(/^[0-9]{10}$/),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").trim().toLowerCase(),
});

export const ResetPasswordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type AdminSignupInput = z.infer<typeof AdminSignupSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
