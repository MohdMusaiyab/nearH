import { createClient } from "@/lib/supabase/server";
import DoctorForm from "@/components/admin/DoctorForm";

export default async function NewDoctorPage() {
  const supabase = await createClient();
  const { data: specialties } = await supabase
    .from("specialties_list")
    .select("*")
    .order("specialty_name");

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Register New Doctor
      </h1>
      <DoctorForm specialties={specialties || []} />
    </div>
  );
}
