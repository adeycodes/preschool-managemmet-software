-- Create user_sessions table in Supabase
-- Run this SQL in your Supabase SQL Editor

-- Add updated_at column to students table if it doesn't exist
ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access their own sessions
CREATE POLICY "Users can only access their own sessions" ON user_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);