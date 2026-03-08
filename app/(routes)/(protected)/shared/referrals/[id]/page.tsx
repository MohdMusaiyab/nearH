import { getReferralById } from "@/actions/admin/referrals";
import { notFound } from "next/navigation";
import ReferralDetailView from "@/components/shared/ReferralDetailView";
import { FileSearch } from "lucide-react";
import { getAuthenticatedProfile } from "@/utils/authCache";
interface Props {
  params: Promise<{ id: string }>;
}
export default async function SharedReferralDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: referral, success } = await getReferralById(id);
  if (!success || !referral) return notFound();
  const profile = await getAuthenticatedProfile();
  const userRole = (profile?.role as "user" | "admin" | "superadmin") || "user";
  return (
    <div className="flex-1 lg:pl-72 pt-24 px-4 md:px-8 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-heading flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
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
