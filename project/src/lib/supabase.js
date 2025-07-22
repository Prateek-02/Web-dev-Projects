import { createClient } from '@supabase/supabase-js'

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Ensure supabase client is created only if both URL and key are available
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing in environment variables.');
    return false;
  }
  return !!supabase;
}

// Log a warning if Supabase is not configured
if (!isSupabaseConfigured()) {
  console.error('Supabase is not configured properly. Please check your environment variables.');
}

export default supabase;