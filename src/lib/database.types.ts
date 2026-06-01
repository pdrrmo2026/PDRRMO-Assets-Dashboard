// Auto-generated Supabase database types
// Para i-regenerate: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
//
// Ang file na ito ay base sa existing types ng project (src/types.ts).
// I-update ito pagkatapos mong i-setup ang iyong Supabase tables.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      equipment: {
        Row: {
          id: string;
          name: string;
          type: string;
          quantity: number;
          condition: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
          location: string;
          lat: number;
          lng: number;
          agency: string;
          date_added: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          quantity: number;
          condition: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
          location: string;
          lat: number;
          lng: number;
          agency: string;
          date_added?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          quantity?: number;
          condition?: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
          location?: string;
          lat?: number;
          lng?: number;
          agency?: string;
          date_added?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          plate_number: string;
          type: string;
          brand: string;
          model: string;
          capacity: string;
          condition: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
          location: string;
          lat: number;
          lng: number;
          agency: string;
          date_added: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          plate_number: string;
          type: string;
          brand: string;
          model: string;
          capacity: string;
          condition: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
          location: string;
          lat: number;
          lng: number;
          agency: string;
          date_added?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plate_number?: string;
          type?: string;
          brand?: string;
          model?: string;
          capacity?: string;
          condition?: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
          location?: string;
          lat?: number;
          lng?: number;
          agency?: string;
          date_added?: string;
          updated_at?: string;
        };
      };
      personnel: {
        Row: {
          id: string;
          name: string;
          position: string;
          agency: string;
          contact: string;
          trainings: string[];
          status: 'Active' | 'On Leave' | 'Deployed';
          hadr_team: string;
          date_added: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position: string;
          agency: string;
          contact: string;
          trainings?: string[];
          status: 'Active' | 'On Leave' | 'Deployed';
          hadr_team: string;
          date_added?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string;
          agency?: string;
          contact?: string;
          trainings?: string[];
          status?: 'Active' | 'On Leave' | 'Deployed';
          hadr_team?: string;
          date_added?: string;
          updated_at?: string;
        };
      };
      acdv: {
        Row: {
          id: string;
          organization_name: string;
          office_address: string;
          registered_lgu: string;
          date_added: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_name: string;
          office_address: string;
          registered_lgu: string;
          date_added?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_name?: string;
          office_address?: string;
          registered_lgu?: string;
          date_added?: string;
          updated_at?: string;
        };
      };
      acdv_personnel: {
        Row: {
          id: string;
          acdv_id: string;
          name: string;
          age: number;
          gender: 'Male' | 'Female' | 'Other';
          address: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          acdv_id: string;
          name: string;
          age: number;
          gender: 'Male' | 'Female' | 'Other';
          address: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          acdv_id?: string;
          name?: string;
          age?: number;
          gender?: 'Male' | 'Female' | 'Other';
          address?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      condition_type: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
      personnel_status: 'Active' | 'On Leave' | 'Deployed';
      gender_type: 'Male' | 'Female' | 'Other';
    };
  };
}
