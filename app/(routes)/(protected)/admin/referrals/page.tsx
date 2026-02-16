import { getAllHospitalReferrals } from "@/actions/admin/referrals";
import ReferralClientPage from "@/components/admin/ReferralClientPage";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  if (!profile?.associated_hospital_id) return notFound();

  const { data, success } = await getAllHospitalReferrals();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Referrals
          </h1>
          <p className="text-slate-500">
            Manage patient transfers and incoming requests.
          </p>
        </div>
      </div>

      <ReferralClientPage
        initialData={data || []}
        hospitalId={profile.associated_hospital_id}
      />
    </div>
  );
}
