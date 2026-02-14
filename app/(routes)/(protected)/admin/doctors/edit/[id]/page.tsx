import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import DoctorForm from "@/components/admin/DoctorForm";

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [doctorRes, specialtyRes] = await Promise.all([
    supabase.from("doctors").select("*").eq("id", id).single(),
    supabase.from("specialties_list").select("*").order("specialty_name"),
  ]);

  if (doctorRes.error || !doctorRes.data) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Edit Doctor Profile
        </h1>
        <p className="text-slate-500 text-sm">
          Update clinical details and availability for Dr. {doctorRes.data.name}
        </p>
      </div>

      <DoctorForm
        specialties={specialtyRes.data || []}
        initialData={doctorRes.data}
      />
    </div>
  );
}
