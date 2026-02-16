import { createClient } from "@/lib/supabase/server";
import { getLocations } from "@/actions/superadmin/locations";
import NewReferralForm from "@/components/admin/NewReferralForm";
import { notFound } from "next/navigation";

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
    <div className="py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Initiate Referral
        </h1>
        <p className="text-slate-500">
          Find a receiving facility and provide patient clinical details.
        </p>
      </div>

      <NewReferralForm
        specialties={specialtiesRes.data}
        locations={locationsRes.data}
      />
    </div>
  );
}
