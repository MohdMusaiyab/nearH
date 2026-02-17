import {
  PublicHospitalProfile,
  PrivateHospitalProfile,
  SuperAdminHospitalProfile,
} from "@/types/hospital";

export type HospitalProfile =
  | PublicHospitalProfile
  | PrivateHospitalProfile
  | SuperAdminHospitalProfile;

export interface BaseProps {
  hospital: HospitalProfile;
}

export interface WithPermissionProps extends BaseProps {
  isOwner: boolean;
  isSuperadmin: boolean;
}

export const hasPrivateData = (
  hospital: HospitalProfile,
): hospital is PrivateHospitalProfile | SuperAdminHospitalProfile => {
  return "official_email" in hospital;
};

export const isSuperAdminProfile = (
  hospital: HospitalProfile,
): hospital is SuperAdminHospitalProfile => {
  return "admins" in hospital;
};
