/*
  # User Profiles Management System

  ## Overview
  Creates a comprehensive user profiles table with education, skills, and experience tracking.

  ## 1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Full name of the user
      - `email` (text, unique) - Email address
      - `role` (text) - User role (Admin, User, Moderator)
      - `avatar` (text) - Avatar URL
      - `phone` (text) - Contact number
      - `gender` (text) - Gender
      - `dob` (date) - Date of birth
      - `address` (text) - Physical address
      - `domicile` (text) - Domicile information
      - `education` (jsonb) - Education details (college, degree, course, year, grade)
      - `skills` (text[]) - Array of skills
      - `projects` (text[]) - Array of project names
      - `experience` (jsonb) - Experience details (domain, subDomain, years)
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for public read access (for demo purposes)
    - Add policy for public insert/update/delete (for demo purposes)

  ## 3. Important Notes
    - Using JSONB for flexible nested data (education, experience)
    - Text arrays for skills and projects
    - Timestamps for audit trail
    - Email uniqueness constraint
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'User',
  avatar text,
  phone text,
  gender text,
  dob date,
  address text,
  domicile text,
  education jsonb DEFAULT '{}'::jsonb,
  skills text[] DEFAULT ARRAY[]::text[],
  projects text[] DEFAULT ARRAY[]::text[],
  experience jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access (for demo app)
CREATE POLICY "Allow public read access"
  ON user_profiles
  FOR SELECT
  TO anon
  USING (true);

-- Public insert access (for demo app)
CREATE POLICY "Allow public insert access"
  ON user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Public update access (for demo app)
CREATE POLICY "Allow public update access"
  ON user_profiles
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Public delete access (for demo app)
CREATE POLICY "Allow public delete access"
  ON user_profiles
  FOR DELETE
  TO anon
  USING (true);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Create index for role filtering
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();