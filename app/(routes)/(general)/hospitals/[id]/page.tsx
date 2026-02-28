import { createClient } from "@/lib/supabase/server";
import { getHospitalProfile } from "@/actions/shared/getHospitalbyId";
import HospitalProfileClient from "@/components/shared/HospitalProfileClient";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HospitalPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  try {
    const result = await getHospitalProfile(id);
    if (!result.success || !result.data) return notFound();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    let isOwner = false;
    let isSuperadmin = false;
    const userId = user?.id || "";

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
      /* Full Width Layout Wrapper:
         - pt-24: Offset for fixed Navigation
         - no pl-72: No sidebar offset requested
      */
      <div className="min-h-screen bg-slate-50 pt-24 w-full">
        <HospitalProfileClient
          hospital={result.data}
          userId={userId}
          isOwner={isOwner}
          isSuperadmin={isSuperadmin}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-border p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100">
            <AlertCircle className="w-10 h-10 text-error" />
          </div>
          <h1 className="text-2xl font-black text-heading tracking-tighter uppercase mb-2">
            System Error
          </h1>
          <p className="text-muted text-sm font-medium mb-8">
            An error occurred while loading this facility&apos;s dossier.
          </p>
          <Link
            href="/explore"
            className="inline-block px-8 py-4 bg-heading text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }
}
