import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined';

if (!isSupabaseConfigured) {
  console.warn("Supabase credentials missing (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). App will run in offline mode.");
}

// Initialize with placeholders if missing to prevent "supabaseUrl is required" error during module load.
// Functional calls will fail, but we guard against them in the UI using `isSupabaseConfigured`.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);