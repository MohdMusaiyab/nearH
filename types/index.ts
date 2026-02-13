import { Database } from './database.types'
export type Hospital = Database['public']['Tables']['hospitals']['Row']
export type Doctor = Database['public']['Tables']['doctors']['Row']
export type Inventory = Database['public']['Tables']['hospital_inventory']['Row']
export type DoctorStatus = Database['public']['Enums']['doctor_status']