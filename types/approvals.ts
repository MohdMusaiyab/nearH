import { Database } from "@/types/database.types";

export type ProfileWithHospital = {
  id: string;
  full_name: string | null;
  status: Database["public"]["Enums"]["approval_status"]|null;
  hospitals: {
    id: string;
    name: string;
    official_email: string;
    location_id: string | null;
    locations: {
      city: string;
      state: string;
    } | null;
  } | null;
};

export interface ApprovalsTableProps {
  data: ProfileWithHospital[];
  locations: Database["public"]["Tables"]["locations"]["Row"][];
  totalCount: number;
  pageSize: number;
}