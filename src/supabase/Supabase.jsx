"use client";
import { createClient } from '@supabase/supabase-js';

// Fetch credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug: Check if environment variables are correctly loaded
// console.log("Supabase URL:", supabaseUrl);
// console.log("Supabase ANON KEY:", supabaseAnonKey);

// Validate that environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and ANON KEY are required. Check your environment variables.");
}

// Create a Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
