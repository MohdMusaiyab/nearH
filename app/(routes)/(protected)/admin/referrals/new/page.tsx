import { createClient } from "@/lib/supabase/server";
import { getLocations } from "@/actions/superadmin/locations";
import NewReferralForm from "@/components/admin/NewReferralForm";
import { notFound } from "next/navigation";
import { SendHorizonal } from "lucide-react";

export default async function NewReferralPage() {
  const supabase = await createClient();

  const [specialtiesRes, locationsRes] = await Promise.all([
    supabase.from("specialties_list").select("*").order("specialty_name"),
    getLocations(),
  ]);

  if (!specialtiesRes.data || !locationsRes.data) {
    return notFound();
  }

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* ── Page Header (NearH Pattern) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20 flex-shrink-0">
            <SendHorizonal size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--color-heading)] tracking-tight leading-none">
              Initiate Referral
            </h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Locate a receiving facility and submit clinical transfer details
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--color-border)]" />

      <NewReferralForm
        specialties={specialtiesRes.data}
        locations={locationsRes.data}
      />
    </div>
  );
}
