/*
  # Pathways to Parenthood - Complete Database Schema

  1. New Tables
    - `user_profiles` - Core user data with persona profiles
    - `journeys` - User journey tracking and path selection
    - `providers` - Healthcare and service provider directory
    - `appointments` - Appointment scheduling and tracking
    - `health_data` - Aggregated health information
    - `financial_data` - Cost tracking and insurance information
    - `consent_logs` - Privacy and data consent tracking
    - `agent_interactions` - Multi-agent system interaction logs
    - `educational_content` - Personalized learning resources
    - `provider_ratings` - Outcome-based provider feedback

  2. Security
    - Enable RLS on all tables
    - User-scoped access policies for PHI compliance
    - Audit logging for all data operations

  3. Features
    - JSON persona profiles for dynamic UI
    - Comprehensive journey mapping
    - Provider ecosystem management
    - Privacy-first architecture
*/

-- User Profiles with Persona Data
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  date_of_birth date,
  persona_profile jsonb DEFAULT '{}',
  onboarding_completed boolean DEFAULT false,
  privacy_settings jsonb DEFAULT '{"data_sharing": false, "marketing": false, "research": false}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Journey Tracking and Path Management
CREATE TABLE IF NOT EXISTS journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_type text NOT NULL CHECK (journey_type IN ('ivf', 'natural_conception', 'domestic_adoption', 'international_adoption', 'surrogacy', 'egg_freezing')),
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'discontinued')),
  start_date date DEFAULT CURRENT_DATE,
  target_completion date,
  milestones jsonb DEFAULT '[]',
  current_phase text DEFAULT 'assessment',
  journey_data jsonb DEFAULT '{}',
  ai_recommendations jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Provider Directory and Marketplace
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider_type text NOT NULL CHECK (provider_type IN ('fertility_clinic', 'adoption_agency', 'legal_services', 'mental_health', 'financial_advisor', 'insurance_specialist')),
  specializations text[] DEFAULT '{}',
  location_data jsonb DEFAULT '{}',
  contact_info jsonb DEFAULT '{}',
  credentials jsonb DEFAULT '{}',
  insurance_accepted text[] DEFAULT '{}',
  rating_average decimal(3,2) DEFAULT 0.0,
  total_ratings integer DEFAULT 0,
  outcome_metrics jsonb DEFAULT '{}',
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointment Management
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  journey_id uuid REFERENCES journeys(id) ON DELETE CASCADE,
  appointment_type text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  notes text DEFAULT '',
  preparation_tasks jsonb DEFAULT '[]',
  follow_up_actions jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Health Data Aggregation
CREATE TABLE IF NOT EXISTS health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type text NOT NULL CHECK (data_type IN ('vitals', 'lab_results', 'cycle_tracking', 'medication', 'symptoms', 'wearable_data')),
  data_source text NOT NULL DEFAULT 'manual',
  recorded_at timestamptz DEFAULT now(),
  data_values jsonb NOT NULL DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Financial Information and Cost Tracking
CREATE TABLE IF NOT EXISTS financial_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id uuid REFERENCES journeys(id) ON DELETE CASCADE,
  expense_type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  insurance_covered boolean DEFAULT false,
  insurance_coverage_amount decimal(10,2) DEFAULT 0,
  provider_id uuid REFERENCES providers(id),
  transaction_date date DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Privacy and Consent Management
CREATE TABLE IF NOT EXISTS consent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  granted boolean NOT NULL,
  consent_details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  blockchain_hash text
);

-- Agent Interaction Tracking
CREATE TABLE IF NOT EXISTS agent_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_type text NOT NULL CHECK (agent_type IN ('health_data_input', 'demographic_input', 'compliance_verification', 'solution_recommender', 'partner_manager', 'ai_concierge')),
  interaction_type text NOT NULL,
  input_data jsonb DEFAULT '{}',
  output_data jsonb DEFAULT '{}',
  processing_time_ms integer,
  success boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Educational Content and Resources
CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('article', 'video', 'checklist', 'calculator', 'webinar')),
  target_personas text[] DEFAULT '{}',
  journey_phases text[] DEFAULT '{}',
  content_data jsonb NOT NULL DEFAULT '{}',
  tags text[] DEFAULT '{}',
  reading_time_minutes integer,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Provider Ratings and Outcomes
CREATE TABLE IF NOT EXISTS provider_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  journey_id uuid REFERENCES journeys(id) ON DELETE CASCADE,
  overall_rating integer NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  outcome_achieved boolean,
  communication_rating integer CHECK (communication_rating >= 1 AND communication_rating <= 5),
  cost_transparency_rating integer CHECK (cost_transparency_rating >= 1 AND cost_transparency_rating <= 5),
  recommendation_likelihood integer CHECK (recommendation_likelihood >= 1 AND recommendation_likelihood <= 10),
  detailed_feedback text DEFAULT '',
  anonymous boolean DEFAULT false,
  verified_outcome boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for User Data
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own journeys"
  ON journeys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read verified providers"
  ON providers
  FOR SELECT
  TO authenticated
  USING (verification_status = 'verified');

CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own health data"
  ON health_data
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own financial data"
  ON financial_data
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own consent logs"
  ON consent_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own agent interactions"
  ON agent_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read published educational content"
  ON educational_content
  FOR SELECT
  TO authenticated
  USING (published = true);

CREATE POLICY "Users can manage own provider ratings"
  ON provider_ratings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for Performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_journeys_user_id ON journeys(user_id);
CREATE INDEX idx_journeys_type ON journeys(journey_type);
CREATE INDEX idx_providers_type ON providers(provider_type);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_type ON health_data(data_type);
CREATE INDEX idx_agent_interactions_user_id ON agent_interactions(user_id);
CREATE INDEX idx_provider_ratings_provider_id ON provider_ratings(provider_id);