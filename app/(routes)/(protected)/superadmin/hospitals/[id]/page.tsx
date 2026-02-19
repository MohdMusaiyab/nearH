import { createClient } from "@/lib/supabase/server";
import { getHospitalProfile } from "@/actions/shared/getHospitalbyId";
import { getHospitalAdmins } from "@/actions/superadmin/hospitals";
import SuperAdminHospitalClient from "@/components/superadmin/SuperAdminHospitalClient";
import { redirect } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: hospital } = await supabase
    .from("hospitals")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: `Superadmin: ${hospital?.name || "Hospital"} | Manage`,
    description: "Superadmin hospital management",
  };
}

export default async function SuperAdminHospitalPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Check superadmin access
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "superadmin") {
    redirect("/explore");
  }

  // Fetch hospital data
  const hospitalResult = await getHospitalProfile(id);

  if (!hospitalResult.success || !hospitalResult.data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-2">
            Hospital Not Found
          </h1>
          <a
            href="/superadmin/hospitals"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm"
          >
            Back to Hospitals
          </a>
        </div>
      </div>
    );
  }

  // Fetch admins separately for superadmin
  const adminsResult = await getHospitalAdmins(id);

  // Fix: Provide default empty array even if data is null
  const admins = adminsResult.success && adminsResult.data ? adminsResult.data : [];

  return (
    <SuperAdminHospitalClient
      hospital={hospitalResult.data}
      admins={admins}
    />
  );
}