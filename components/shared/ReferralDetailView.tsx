"use client";

import { SharedReferralDetail } from "@/actions/admin/referrals";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Activity,
  User,
  FileText,
  AlertTriangle,
  Hash,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Database } from "@/types/database.types";

type Priority = Database["public"]["Enums"]["priority_level"];
type Status = Database["public"]["Enums"]["referral_status"];
interface Props {
  referral: SharedReferralDetail;
  userRole: "user" | "admin" | "superadmin"; // Matches the profile role type
}
export default function ReferralDetailView({ referral, userRole }: Props) {
  const router = useRouter();

  const statusColors: Record<Status, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Accepted: "bg-green-50 text-green-700 border-green-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    Completed: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const priorityColors: Record<Priority, string> = {
    Routine: "text-blue-600 bg-blue-50",
    Urgent: "text-orange-600 bg-orange-50",
    Critical: "text-red-600 bg-red-50",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Clinical Info - Main Section */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {referral.patient_name}
                  </h1>
                  <p className="text-slate-500 font-medium">
                    Age: {referral.patient_age} • Gender:{" "}
                    {referral.patient_gender}
                  </p>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${statusColors[referral.status || "Pending"]}`}
              >
                {referral.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Requested Specialty
                </p>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  {referral.specialty?.specialty_name || "General Medicine"}
                </div>
              </div>
              <div
                className={`p-4 rounded-2xl border ${priorityColors[referral.priority || "Routine"]} border-current opacity-80`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                  Priority Level
                </p>
                <div className="flex items-center gap-2 font-black">
                  <AlertTriangle className="w-4 h-4" />
                  {referral.priority}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3 text-indigo-500" /> Clinical Reason
                for Referral
              </p>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {referral.medical_reason}
              </div>
            </div>
          </section>
        </div>

        {/* Handshake Details - Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <HospitalBriefCard
            title="Sending Facility"
            hospital={referral.from_hospital}
          />
          <HospitalBriefCard
            title="Receiving Facility"
            hospital={referral.to_hospital}
          />

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Tracking
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 font-medium">Created:</span>
                <span className="font-bold text-slate-900">
                  {referral.created_at
                    ? format(new Date(referral.created_at), "dd MMM yyyy")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Hash className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500 font-medium">Ref ID:</span>
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {referral.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HospitalBriefCard({
  title,
  hospital,
}: {
  title: string;
  hospital: SharedReferralDetail["from_hospital"];
}) {
  if (!hospital) return null;

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {title}
      </h3>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{hospital.name}</p>
          <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {hospital.location?.city},{" "}
            {hospital.location?.state}
          </p>
          <p className="text-[9px] text-slate-400 font-mono mt-2 uppercase">
            ID: {hospital.id.slice(0, 13)}...
          </p>
        </div>
      </div>
    </div>
  );
}
