-- AutoResQ PostgreSQL & Supabase Database Migration
-- Run this script in your Supabase SQL Editor to initialize profiles, incidents, and RLS policies.

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 120),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'reviewer', 'admin')),
  agency TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Reviewers and Admins can view citizen profiles for emergency response
CREATE POLICY "Reviewers and admins can view profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('reviewer', 'admin')
    )
  );

-- 2. INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS public.incidents (
  id TEXT PRIMARY KEY, -- e.g. 'ARQ-2026-1042'
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('accident', 'medical', 'fire', 'collapse', 'flood', 'other')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'awaiting_review' CHECK (status IN ('awaiting_review', 'under_review', 'action_recorded', 'resolved')),
  description TEXT NOT NULL,
  reporter_name TEXT,
  reporter_contact TEXT,
  reporter_email TEXT,
  location JSONB NOT NULL,
  image_url TEXT,
  hazards_identified TEXT[] DEFAULT '{}',
  casualties_estimate INTEGER DEFAULT 0,
  ai_assessment JSONB,
  status_history JSONB NOT NULL DEFAULT '[]',
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  is_demo_record BOOLEAN DEFAULT FALSE
);

-- Enable RLS on incidents
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Incident Policies
-- Anyone can read incidents for safety visibility or triage
CREATE POLICY "Authenticated users can read incidents"
  ON public.incidents
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can insert their own emergency reports
CREATE POLICY "Authenticated users can insert emergency reports"
  ON public.incidents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can edit only their own reports before review, Reviewers/Admins can update any status
CREATE POLICY "Reviewers can update incident status"
  ON public.incidents
  FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('reviewer', 'admin')
    )
  );

-- 3. AUTOMATIC PROFILE TRIGGER ON NEW AUTH USER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, age, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'age')::integer, 25),
    new.email,
    'citizen'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
