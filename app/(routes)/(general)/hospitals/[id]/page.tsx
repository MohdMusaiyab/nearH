import { createClient } from "@/lib/supabase/server";
import { getHospitalProfile } from "@/actions/shared/getHospitalbyId";
import HospitalProfileClient from "@/components/shared/HospitalProfileClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const { data: hospital } = await supabase
      .from("hospitals")
      .select("name")
      .eq("id", id)
      .single();

    if (!hospital) {
      return {
        title: "Hospital Not Found",
        description: "The requested hospital could not be found.",
      };
    }

    return {
      title: `${hospital.name} | Hospital Profile`,
      description: `View information about ${hospital.name}, including available beds, doctors, and services.`,
    };
  } catch {
    return {
      title: "Hospital Profile",
      description: "View hospital information and services",
    };
  }
}

export default async function HospitalPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    // 1. Get hospital data first (public data is always accessible)
    const result = await getHospitalProfile(id);

    if (!result.success || !result.data) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Hospital Not Found
            </h1>
            <p className="text-slate-500 mb-6">
              {result.message || "The requested hospital could not be found."}
            </p>
            <a
              href="/explore"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              Browse Hospitals
            </a>
          </div>
        </div>
      );
    }

    // 2. Try to get user if logged in (optional)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isOwner = false;
    let isSuperadmin = false;
    const userId = user?.id || "";

    // 3. If user is logged in, check permissions
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, associated_hospital_id")
        .eq("id", user.id)
        .maybeSingle();

      isOwner = profile?.associated_hospital_id === id;
      isSuperadmin = profile?.role === "superadmin";
    }

    return (
      <HospitalProfileClient
        hospital={result.data}
        userId={userId}
        isOwner={isOwner}
        isSuperadmin={isSuperadmin}
      />
    );
  } catch (error) {
    console.error("Unexpected error in hospital page:", error);

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">
            Something Went Wrong
          </h1>
          <p className="text-slate-500 mb-6">
            An unexpected error occurred. Please try again later.
          </p>
          <a
            href="/explore"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
          >
            Browse Hospitals
          </a>
        </div>
      </div>
    );
  }
}
