import { Database } from "@/types/database.types";

export type DoctorStatus = Database["public"]["Enums"]["doctor_status"];

export interface DoctorSchedule {
  [day: string]: string;
}

export interface DoctorDirectoryEntry {
  id: string;
  name: string;
  experience_years: number;
  status: DoctorStatus;
  is_available: boolean;
  room_number: string | null;
  availability_schedule: DoctorSchedule;
  specialty: {
    id: string;
    name: string;
  } | null;
  hospital: {
    id: string;
    name: string;
    location: {
      city: string;
      state: string;
    } | null;
  };
}
