"use client";
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Visual Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 scale-150"></div>
            <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <Search className="w-16 h-16 text-blue-600 stroke-[1.5]" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-7xl font-black text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          The resource you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Support Link */}
        <p className="mt-12 text-sm text-slate-400">
          If you believe this is a technical error, please contact your{" "}
          <span className="text-slate-500 font-medium">
            System Administrator
          </span>
          .
        </p>
      </div>
    </div>
  );
}
