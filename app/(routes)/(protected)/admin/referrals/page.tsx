import { getAllHospitalReferrals } from "@/actions/admin/referrals";
import ReferralClientPage from "@/components/admin/ReferralClientPage";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeftRight } from "lucide-react";

export default async function ReferralsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("associated_hospital_id")
    .eq("id", user?.id || "")
    .single();

  const hospitalId = profile?.associated_hospital_id;
  if (!hospitalId) return notFound();

  const { data } = await getAllHospitalReferrals();

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* ── Page Header (NearH Pattern) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 flex-shrink-0">
            <ArrowLeftRight size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-heading tracking-tight leading-none">
              Patient Referrals
            </h1>
            <p className="text-sm text-muted mt-1">
              Track and manage inter-hospital patient transfers in real-time
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      <ReferralClientPage initialData={data || []} hospitalId={hospitalId} />
    </div>
  );
}
