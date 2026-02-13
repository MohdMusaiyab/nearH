"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/lib/validations/auth";
import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError(null);

    const result = await login(data);

    if (result.success) {
      router.push("/");
      router.refresh();
    } else {
      setServerError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Hospital Portal Login
        </h1>

        {serverError && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Official Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-50 focus:border-blue-500"
              placeholder="admin@hospital.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-50 focus:border-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isLoading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          New Hospital?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
