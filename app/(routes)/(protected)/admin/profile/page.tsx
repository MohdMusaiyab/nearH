import { createClient } from "@/lib/supabase/server";
import { getLocations } from "@/actions/superadmin/locations";
import HospitalProfileForm from "@/components/admin/ProfileForm";
import { notFound } from "next/navigation";

export default async function HospitalProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("associated_hospital_id")
    .eq("id", user?.id || "")
    .single();

  const hospitalId = profile?.associated_hospital_id;
  if (!hospitalId) notFound();

  const [hospitalRes, allServicesRes, selectedServicesRes, locationsRes] = await Promise.all([
    supabase.from("hospitals").select("*").eq("id", hospitalId).single(),
    supabase.from("services_list").select("*").order("service_name"),
    supabase.from("hospital_services").select("service_id").eq("hospital_id", hospitalId),
    getLocations() // Fetching all locations
  ]);

  if (!hospitalRes.data) notFound();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <HospitalProfileForm 
        hospital={hospitalRes.data}
        allServices={allServicesRes.data || []}
        selectedServiceIds={selectedServicesRes.data?.map(s => s.service_id) || []}
        locations={locationsRes.data || []}
      />
    </div>
  );
}