import { createClient } from "@/lib/supabase/server";
import RegistrationForm from "@/components/auth/RegistrationForm";
import Link from "next/link";

export default async function SignupPage() {
  const supabase = await createClient();
  const { data: locations } = await supabase
    .from("locations")
    .select("id, city, state")
    .order("city", { ascending: true });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-slate-900">
          Hospital Onboarding
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in to your dashboard
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-200 sm:rounded-xl sm:px-10">
          <RegistrationForm locations={locations || []} />
        </div>
      </div>
    </div>
  );
}