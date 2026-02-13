import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Clock, ShieldCheck, Mail } from "lucide-react";

export default async function WaitingRoom() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("status, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.status === "approved") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-4 rounded-full">
            <Clock className="w-12 h-12 text-blue-600 animate-pulse" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Verification Pending
        </h1>

        <p className="text-slate-600 mb-6">
          Hello{" "}
          <span className="font-semibold text-slate-800">
            {profile?.full_name}
          </span>
          , your hospital registration is currently under review by our
          Superadmin team.
        </p>

        <div className="space-y-4 text-left bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">
                Security Check:
              </span>{" "}
              We verify the legal name and emergency contacts of all hospitals.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">Notification:</span>{" "}
              You will receive an email once your dashboard access is granted.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Sign out and check later
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
