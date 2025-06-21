// Environment configuration
export const config = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  
  // Supabase Configuration (if needed)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Validate required environment variables
export const validateEnv = () => {
  const required = ['GOOGLE_CLIENT_ID'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please create a .env file with the required variables.');
  }
};

// Export individual config values for convenience
export const { GOOGLE_CLIENT_ID, SUPABASE_URL, SUPABASE_ANON_KEY } = config; 