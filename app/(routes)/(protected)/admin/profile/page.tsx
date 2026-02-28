import { createClient } from "@/lib/supabase/server";
import { getLocations } from "@/actions/superadmin/locations";
import HospitalProfileForm from "@/components/admin/ProfileForm";
import { notFound } from "next/navigation";
import { Building2, Activity, Settings } from "lucide-react";

export default async function HospitalProfilePage() {
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
  if (!hospitalId) notFound();

  const [hospitalRes, allServicesRes, selectedServicesRes, locationsRes] =
    await Promise.all([
      supabase.from("hospitals").select("*").eq("id", hospitalId).single(),
      supabase.from("services_list").select("*").order("service_name"),
      supabase
        .from("hospital_services")
        .select("service_id")
        .eq("hospital_id", hospitalId),
      getLocations(),
    ]);

  if (!hospitalRes.data) notFound();

  const selectedCount = selectedServicesRes.data?.length || 0;

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* ── Page Header (NearH Pattern) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 flex-shrink-0">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-heading tracking-tight leading-none">
              Hospital Profile
            </h1>
            <p className="text-sm text-muted mt-1">
              Manage your facility&apos;s public identity and medical services
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* ── Metric Summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-badge-bg border border-border flex items-center justify-center">
            <Activity size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted uppercase tracking-widest">
              Selected Facilities
            </p>
            <p className="text-xl font-black text-heading">
              {selectedCount}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <HospitalProfileForm
          hospital={hospitalRes.data}
          allServices={allServicesRes.data || []}
          selectedServiceIds={
            selectedServicesRes.data?.map((s) => s.service_id) || []
          }
          locations={locationsRes.data || []}
        />
      </div>
    </div>
  );
}
