import { createClient } from '@supabase/supabase-js';

// Helper to safely get environment variables in various environments (Vite, CRA, Node)
const getEnv = (key: string) => {
  try {
    // @ts-ignore - Handle Vite's import.meta.env
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    // Ignore errors accessing import.meta
  }

  try {
    // Handle standard process.env (Node/CRA)
    // We check typeof process to avoid "ReferenceError: process is not defined" in browser
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore errors accessing process
  }

  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Debug: Log environment variables (remove in production)
console.log('[DEBUG] Environment Variables:');
console.log('[DEBUG] VITE_SUPABASE_URL:', supabaseUrl);
console.log('[DEBUG] VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***SET***' : 'NOT SET');
console.log('[DEBUG] import.meta.env:', typeof import.meta !== 'undefined' ? import.meta.env : 'N/A');

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined';

if (!isSupabaseConfigured) {
  console.error("Supabase credentials missing (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). App will run in offline mode.");
  console.error("[DEBUG] Supabase URL:", supabaseUrl, '| Type:', typeof supabaseUrl);
  console.error("[DEBUG] Supabase Key:", supabaseAnonKey ? 'SET' : 'NOT SET');
} else {
  console.log("✅ Supabase configured successfully");
}

// Initialize with placeholders if missing to prevent "supabaseUrl is required" error during module load.
// Functional calls will fail, but we guard against them in the UI using `isSupabaseConfigured`.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);