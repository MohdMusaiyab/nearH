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
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name is too long"),

    email: z
      .string()
      .email("Please enter a valid work email address")
      .trim()
      .toLowerCase(),

    password: passwordRule,

    confirmPassword: z.string().min(1, "Please confirm your password"),

    hospital_name: z
      .string()
      .min(3, "Hospital name must be at least 3 characters")
      .max(100, "Hospital name is too long"),

    official_email: z
      .string()
      .email("Please enter a valid hospital official email"),

    official_phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),

    location_id: z.string().uuid("Please select a valid hospital location"),

    has_ayushman_bharat: z.boolean({
      error: "Please specify if you support Ayushman Bharat",
    }),

    emergency_contact: z
      .string()
      .regex(/^[0-9]{10}$/, "Emergency contact must be exactly 10 digits"),
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
