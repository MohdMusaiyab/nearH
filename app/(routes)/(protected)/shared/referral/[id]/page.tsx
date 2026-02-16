import { getReferralById } from "@/actions/admin/referrals";
import { notFound } from "next/navigation";
import ReferralDetailView from "@/components/shared/ReferralDetailView";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SharedReferralDetailPage({ params }: Props) {
  const { id } = await params;

  // Use the specific shared fetcher we built
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

  if (!success || !referral) {
    return notFound();
  }

  // Security Logic
  const isSuperadmin = profile?.role === "superadmin";
  const isParticipant =
    profile?.associated_hospital_id === referral.from_hospital_id ||
    profile?.associated_hospital_id === referral.to_hospital_id;

  if (!isSuperadmin && !isParticipant) {
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* referral now strictly matches SharedReferralDetail 
          which includes from_hospital: { id, name, location } 
      */}
      <ReferralDetailView
        referral={referral}
        userRole={profile?.role || "user"}
      />
    </div>
  );
}
