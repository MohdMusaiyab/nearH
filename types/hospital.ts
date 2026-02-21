import { Database } from "@/types/database.types";

type DoctorStatus = Database["public"]["Enums"]["doctor_status"];
type UserRole = Database["public"]["Enums"]["user_role"];
type PriorityLevel = Database["public"]["Enums"]["priority_level"];
type ReferralStatus = Database["public"]["Enums"]["referral_status"];
type ApprovalStatus = Database["public"]["Enums"]["approval_status"];

export interface HospitalWithRelations {
  id: string;
  name: string;
  official_email: string | null;
  official_phone: string | null;
  website_url: string | null;
  emergency_contact: string | null;
  is_verified: boolean;
  is_active: boolean;
  has_ayushman_bharat: boolean;
  trauma_level: number | null;
  location_id: string | null;
  created_at: string | null;
  updated_at: string | null;

  location: {
    city: string;
    state: string;
  } | null;

  hospital_inventory: {
    available_beds: number;
    icu_beds_available: number;
    ventilators_available: number;
    total_beds: number;
    icu_beds_total: number;
    ventilators_total: number;
    last_updated: string | null;
  } | null;

  hospital_images: {
    image_url: string;
    is_primary: boolean;
  }[];

  doctors: {
    id: string;
    name: string;
    experience_years: number;
    status: DoctorStatus;
    is_available: boolean;
    room_number: string | null;
    availability_schedule: Record<string, string>;
    specialty: {
      id: string;
      specialty_name: string;
    } | null;
  }[];

  blood_bank: {
    blood_group: string;
    units_available: number;
    last_updated: string | null;
  }[];
}

export interface PublicHospitalProfile {
  id: string;
  name: string;
  is_verified: boolean;
  has_ayushman_bharat: boolean;
  trauma_level: number | null;
  location: {
    city: string;
    state: string;
  } | null;
  inventory: {
    available_beds: number;
    icu_beds_available: number;
    ventilators_available: number;
    last_updated: string | null;
  };
  doctors: {
    id: string;
    name: string;
    specialty: string | null;
    experience_years: number;
    status: DoctorStatus;
    is_available: boolean;
  }[];
  specialties: string[];
  // ✅ NEW: Add services array
  services: string[];
  blood_bank: {
    blood_group: string;
    units_available: number;
  }[];
  primary_image: string | null;
}

export interface PrivateHospitalProfile extends PublicHospitalProfile {
  official_email: string | null;
  official_phone: string | null;
  website_url: string | null;
  emergency_contact: string | null;
  is_active: boolean;

  created_at: string;
  updated_at: string;

  doctors: (PublicHospitalProfile["doctors"][0] & {
    room_number: string | null;
    availability_schedule: Record<string, string>;
  })[];

  inventory_full: {
    total_beds: number;
    icu_beds_total: number;
    ventilators_total: number;
    available_beds: number;
    icu_beds_available: number;
    ventilators_available: number;
    last_updated: string | null;
  };

  referrals_as_from?: {
    id: string;
    patient_name: string;
    priority: PriorityLevel | null;
    status: ReferralStatus | null;
    created_at: string | null;
    to_hospital: {
      id: string;
      name: string;
    };
  }[];

  referrals_as_to?: {
    id: string;
    patient_name: string;
    priority: PriorityLevel | null;
    status: ReferralStatus | null;
    created_at: string | null;
    from_hospital: {
      id: string;
      name: string;
    };
  }[];
}

export interface SuperAdminHospitalProfile extends PrivateHospitalProfile {
  admins: {
    id: string;
    full_name: string | null;
    email: string;
    status: ApprovalStatus | null;
    created_at: string | null;
  }[];

  system_metrics: {
    total_referrals: number;
    completed_referrals: number;
    pending_referrals: number;
    average_response_time: number | null;
  };
}
