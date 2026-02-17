export interface ExploreHospital {
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
  } | null;
  primary_image: string | null;
  specialties: string[];
  services: string[];
}
