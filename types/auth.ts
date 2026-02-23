import { Database } from "@/types/database.types";

export type DbProfile = Database["public"]["Tables"]["profiles"]["Row"];

export interface ExtendedProfile extends DbProfile {
  hospitalName?: string;
}
