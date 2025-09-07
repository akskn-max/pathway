import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client component helper
export const createSupabaseClient = () => createClientComponentClient();

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          persona_profile: any;
          onboarding_completed: boolean;
          privacy_settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string | null;
          persona_profile?: any;
          onboarding_completed?: boolean;
          privacy_settings?: any;
        };
        Update: {
          first_name?: string;
          last_name?: string;
          date_of_birth?: string | null;
          persona_profile?: any;
          onboarding_completed?: boolean;
          privacy_settings?: any;
          updated_at?: string;
        };
      };
      journeys: {
        Row: {
          id: string;
          user_id: string;
          journey_type: string;
          status: string;
          start_date: string;
          target_completion: string | null;
          milestones: any;
          current_phase: string;
          journey_data: any;
          ai_recommendations: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          journey_type: string;
          status?: string;
          start_date?: string;
          target_completion?: string | null;
          milestones?: any;
          current_phase?: string;
          journey_data?: any;
          ai_recommendations?: any;
        };
        Update: {
          journey_type?: string;
          status?: string;
          start_date?: string;
          target_completion?: string | null;
          milestones?: any;
          current_phase?: string;
          journey_data?: any;
          ai_recommendations?: any;
          updated_at?: string;
        };
      };
      providers: {
        Row: {
          id: string;
          name: string;
          provider_type: string;
          specializations: string[];
          location_data: any;
          contact_info: any;
          credentials: any;
          insurance_accepted: string[];
          rating_average: number;
          total_ratings: number;
          outcome_metrics: any;
          verification_status: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}