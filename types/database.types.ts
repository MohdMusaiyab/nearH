export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blood_bank: {
        Row: {
          blood_group: string
          hospital_id: string | null
          id: string
          last_updated: string | null
          units_available: number | null
        }
        Insert: {
          blood_group: string
          hospital_id?: string | null
          id?: string
          last_updated?: string | null
          units_available?: number | null
        }
        Update: {
          blood_group?: string
          hospital_id?: string | null
          id?: string
          last_updated?: string | null
          units_available?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blood_bank_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          availability_schedule: Json | null
          created_at: string | null
          experience_years: number | null
          hospital_id: string | null
          id: string
          is_available: boolean | null
          name: string
          room_number: string | null
          specialty_id: string | null
          status: Database["public"]["Enums"]["doctor_status"] | null
          updated_at: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          created_at?: string | null
          experience_years?: number | null
          hospital_id?: string | null
          id?: string
          is_available?: boolean | null
          name: string
          room_number?: string | null
          specialty_id?: string | null
          status?: Database["public"]["Enums"]["doctor_status"] | null
          updated_at?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          created_at?: string | null
          experience_years?: number | null
          hospital_id?: string | null
          id?: string
          is_available?: boolean | null
          name?: string
          room_number?: string | null
          specialty_id?: string | null
          status?: Database["public"]["Enums"]["doctor_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctors_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties_list"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_images: {
        Row: {
          created_at: string | null
          hospital_id: string | null
          id: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          created_at?: string | null
          hospital_id?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          created_at?: string | null
          hospital_id?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_images_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_inventory: {
        Row: {
          ambulance_available_count: number | null
          available_beds: number | null
          hospital_id: string | null
          icu_beds_available: number | null
          icu_beds_total: number | null
          id: string
          last_updated: string | null
          oxygen_status: boolean | null
          pharmacy_available: boolean | null
          total_beds: number | null
          ventilators_available: number | null
          ventilators_total: number | null
        }
        Insert: {
          ambulance_available_count?: number | null
          available_beds?: number | null
          hospital_id?: string | null
          icu_beds_available?: number | null
          icu_beds_total?: number | null
          id?: string
          last_updated?: string | null
          oxygen_status?: boolean | null
          pharmacy_available?: boolean | null
          total_beds?: number | null
          ventilators_available?: number | null
          ventilators_total?: number | null
        }
        Update: {
          ambulance_available_count?: number | null
          available_beds?: number | null
          hospital_id?: string | null
          icu_beds_available?: number | null
          icu_beds_total?: number | null
          id?: string
          last_updated?: string | null
          oxygen_status?: boolean | null
          pharmacy_available?: boolean | null
          total_beds?: number | null
          ventilators_available?: number | null
          ventilators_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_inventory_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: true
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_services: {
        Row: {
          hospital_id: string
          service_id: string
        }
        Insert: {
          hospital_id: string
          service_id: string
        }
        Update: {
          hospital_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospital_services_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_list"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          created_at: string | null
          emergency_contact: string | null
          has_ayushman_bharat: boolean | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          location_id: string | null
          name: string
          official_email: string
          official_phone: string
          trauma_level: number | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          emergency_contact?: string | null
          has_ayushman_bharat?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location_id?: string | null
          name: string
          official_email: string
          official_phone: string
          trauma_level?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          emergency_contact?: string | null
          has_ayushman_bharat?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location_id?: string | null
          name?: string
          official_email?: string
          official_phone?: string
          trauma_level?: number | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospitals_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string
          created_at: string | null
          id: string
          state: string
        }
        Insert: {
          city: string
          created_at?: string | null
          id?: string
          state: string
        }
        Update: {
          city?: string
          created_at?: string | null
          id?: string
          state?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          associated_hospital_id: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["approval_status"] | null
          updated_at: string | null
        }
        Insert: {
          associated_hospital_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          updated_at?: string | null
        }
        Update: {
          associated_hospital_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["approval_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_associated_hospital_id_fkey"
            columns: ["associated_hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          from_hospital_id: string | null
          id: string
          medical_reason: string | null
          patient_age: number | null
          patient_gender: string | null
          patient_name: string
          priority: Database["public"]["Enums"]["priority_level"] | null
          referred_by_admin_id: string | null
          rejection_reason: string | null
          specialty_required: string | null
          status: Database["public"]["Enums"]["referral_status"] | null
          to_hospital_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_hospital_id?: string | null
          id?: string
          medical_reason?: string | null
          patient_age?: number | null
          patient_gender?: string | null
          patient_name: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          referred_by_admin_id?: string | null
          rejection_reason?: string | null
          specialty_required?: string | null
          status?: Database["public"]["Enums"]["referral_status"] | null
          to_hospital_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_hospital_id?: string | null
          id?: string
          medical_reason?: string | null
          patient_age?: number | null
          patient_gender?: string | null
          patient_name?: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          referred_by_admin_id?: string | null
          rejection_reason?: string | null
          specialty_required?: string | null
          status?: Database["public"]["Enums"]["referral_status"] | null
          to_hospital_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_from_hospital_id_fkey"
            columns: ["from_hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_by_admin_id_fkey"
            columns: ["referred_by_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_specialty_required_fkey"
            columns: ["specialty_required"]
            isOneToOne: false
            referencedRelation: "specialties_list"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_to_hospital_id_fkey"
            columns: ["to_hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      services_list: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          service_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          service_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          service_name?: string
        }
        Relationships: []
      }
      specialties_list: {
        Row: {
          created_at: string | null
          id: string
          specialty_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          specialty_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          specialty_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      doctor_status:
        | "Available"
        | "In_OPD"
        | "In_Surgery"
        | "On_Call"
        | "On_Leave"
        | "Emergency_Only"
      priority_level: "Routine" | "Urgent" | "Critical"
      referral_status: "Pending" | "Accepted" | "Rejected" | "Completed"
      user_role: "user" | "admin" | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_status: ["pending", "approved", "rejected"],
      doctor_status: [
        "Available",
        "In_OPD",
        "In_Surgery",
        "On_Call",
        "On_Leave",
        "Emergency_Only",
      ],
      priority_level: ["Routine", "Urgent", "Critical"],
      referral_status: ["Pending", "Accepted", "Rejected", "Completed"],
      user_role: ["user", "admin", "superadmin"],
    },
  },
} as const
