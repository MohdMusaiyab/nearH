import { Phone, Mail, Globe, AlertCircle } from "lucide-react";
import {
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";

interface Props {
  hospital: PrivateHospitalProfile | SuperAdminHospitalProfile;
}

export function ContactInfo({ hospital }: Props) {
  const hasContactInfo =
    hospital.official_email ||
    hospital.official_phone ||
    hospital.website_url ||
    hospital.emergency_contact;

  if (!hasContactInfo) return null;

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-200">
      <h2 className="text-lg font-black text-slate-900 mb-4">
        Contact Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hospital.official_email && (
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <a
              href={`mailto:${hospital.official_email}`}
              className="hover:text-indigo-600 truncate"
            >
              {hospital.official_email}
            </a>
          </div>
        )}

        {hospital.official_phone && (
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <a
              href={`tel:${hospital.official_phone}`}
              className="hover:text-indigo-600"
            >
              {hospital.official_phone}
            </a>
          </div>
        )}

        {hospital.website_url && (
          <div className="flex items-center gap-3 text-slate-600">
            <Globe className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <a
              href={hospital.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 truncate"
            >
              Visit Website
            </a>
          </div>
        )}

        {hospital.emergency_contact && (
          <div className="flex items-center gap-3 text-slate-600">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <a
              href={`tel:${hospital.emergency_contact}`}
              className="hover:text-red-600 font-bold"
            >
              Emergency: {hospital.emergency_contact}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
