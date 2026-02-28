import { getReferralById } from "@/actions/admin/referrals";
import { notFound } from "next/navigation";
import ReferralDetailView from "@/components/shared/ReferralDetailView";
import { createClient } from "@/lib/supabase/server";
import { FileSearch } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SharedReferralDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: referral, success } = await getReferralById(id);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, associated_hospital_id")
    .eq("id", user.id)
    .single();

  if (!success || !referral) return notFound();

  const userRole = (profile?.role as "user" | "admin" | "superadmin") || "user";

  // Security Gate
  const isSuperadmin = userRole === "superadmin";
  const isParticipant =
    profile?.associated_hospital_id === referral.from_hospital_id ||
    profile?.associated_hospital_id === referral.to_hospital_id;

  if (!isSuperadmin && !isParticipant) return notFound();

  return (
    <div className="flex-1 lg:pl-72 pt-24 px-4 md:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* ── Page Header (NearH Pattern) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-heading flex items-center justify-center shadow-lg shadow-slate-200 flex-shrink-0">
              <FileSearch size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-heading tracking-tight leading-none uppercase">
                Referral Dossier
              </h1>
              <p className="text-sm text-muted mt-1 font-medium">
                Case study and clinical status for Ref ID: {id.slice(0, 8)}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <ReferralDetailView referral={referral} userRole={userRole} />
      </div>
    </div>
  );
}
