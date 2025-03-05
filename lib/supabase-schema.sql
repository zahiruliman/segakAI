-- SegakAI Database Schema
-- This file contains the minimal database setup required for the application

-- Create plans table for storing workout and diet plans
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for plans table
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Users can read only their own plans
CREATE POLICY "Users can read their own plans" 
  ON public.plans FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own plans
CREATE POLICY "Users can insert their own plans" 
  ON public.plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create configuration table for storing application settings
CREATE TABLE IF NOT EXISTS public.app_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  is_secret BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS for app_config (only admins can access this table)
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check for admin privileges in user_metadata
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND (
      raw_user_meta_data->>'is_admin' = 'true' OR
      user_metadata->>'is_admin' = 'true'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only admins can view app config
CREATE POLICY "Only admins can view app config" 
  ON public.app_config FOR SELECT 
  USING (public.is_admin());

-- Only admins can insert/update app config
CREATE POLICY "Only admins can insert/update app config" 
  ON public.app_config FOR INSERT 
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update app config" 
  ON public.app_config FOR UPDATE 
  USING (public.is_admin());

-- Insert initial config values
INSERT INTO public.app_config (key, value, is_secret, description)
VALUES
  ('OPENAI_API_KEY', '', true, 'OpenAI API Key for generating plans')
ON CONFLICT (key) DO NOTHING;

-- Create a function to get a config value
CREATE OR REPLACE FUNCTION public.get_config(config_key TEXT)
RETURNS TEXT AS $$
DECLARE
  config_value TEXT;
BEGIN
  SELECT value INTO config_value
  FROM public.app_config
  WHERE key = config_key;
  
  RETURN config_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 