# Environment Variables Setup Guide

This guide will help you set up environment variables for your AI Tools Explorer application to securely manage sensitive configuration data.

## 🔐 Why Environment Variables?

Environment variables help you:
- **Secure sensitive data** like API keys and client IDs
- **Avoid hardcoding** configuration values in your code
- **Manage different environments** (development, staging, production)
- **Follow security best practices**

## 📁 File Structure

```
Ai Tools Explorer/
├── .env                    # Your environment variables (create this)
├── .env.example           # Example environment variables (create this)
├── src/
│   ├── config/
│   │   └── env.js         # Environment configuration
│   └── components/
│       ├── Login.jsx      # Updated to use env vars
│       └── Register.jsx   # Updated to use env vars
```

## 🚀 Setup Instructions

### 1. Create Environment Files

Create a `.env` file in your project root:

```bash
# .env
VITE_GOOGLE_CLIENT_ID=663732832122-em3m7djoa0rl09jam6htka8pae4v92gq.apps.googleusercontent.com

# Optional: Supabase configuration (if not already in supabaseClient.js)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Create .env.example (for reference)

Create a `.env.example` file to document required variables:

```bash
# .env.example
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Optional: Supabase configuration
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Update .gitignore

Make sure your `.env` file is in `.gitignore`:

```bash
# .gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 🔧 Configuration Details

### Environment Configuration (`src/config/env.js`)

The configuration file provides:
- **Centralized config management**
- **Environment variable validation**
- **Fallback values for development**
- **Type-safe configuration access**

```javascript
// Environment configuration
export const config = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'fallback_value',
  
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
```

### Component Usage

Components now import and use environment variables:

```javascript
// Before (hardcoded)
const GOOGLE_CLIENT_ID = '663732832122-em3m7djoa0rl09jam6htka8pae4v92gq.apps.googleusercontent.com';

// After (environment variable)
import { GOOGLE_CLIENT_ID } from '../config/env.js';
```

## 🔍 Vite Environment Variables

### Naming Convention

Vite requires environment variables to be prefixed with `VITE_`:

```bash
# ✅ Correct
VITE_GOOGLE_CLIENT_ID=your_client_id

# ❌ Incorrect (won't be accessible in frontend)
GOOGLE_CLIENT_ID=your_client_id
```

### Access in Code

```javascript
// Access environment variables
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
```

## 🛡️ Security Best Practices

### 1. Never Commit .env Files

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Different Values for Different Environments

```bash
# Development
VITE_GOOGLE_CLIENT_ID=dev_client_id

# Production
VITE_GOOGLE_CLIENT_ID=prod_client_id
```

### 3. Validate Environment Variables

The config file includes validation:

```javascript
// This will warn if required variables are missing
validateEnv();
```

### 4. Use Fallback Values Carefully

```javascript
// Only use fallbacks for development
GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dev_fallback'
```

## 🚀 Deployment

### 1. Development

```bash
# Start development server
npm run dev
```

### 2. Production

Set environment variables in your hosting platform:

**Vercel:**
```bash
# In Vercel dashboard
VITE_GOOGLE_CLIENT_ID=your_production_client_id
```

**Netlify:**
```bash
# In Netlify dashboard
VITE_GOOGLE_CLIENT_ID=your_production_client_id
```

**Railway:**
```bash
# In Railway dashboard
VITE_GOOGLE_CLIENT_ID=your_production_client_id
```

## 🔧 Troubleshooting

### Common Issues

**Issue**: Environment variables not loading
```bash
# Solution: Check naming convention
VITE_GOOGLE_CLIENT_ID=your_value  # ✅ Correct
GOOGLE_CLIENT_ID=your_value       # ❌ Wrong
```

**Issue**: Variables undefined in production
```bash
# Solution: Set variables in hosting platform
# Don't rely on .env files in production
```

**Issue**: Fallback values showing
```bash
# Solution: Check .env file exists and has correct values
# Verify variable names match exactly
```

### Validation

The config includes validation that will warn you:

```javascript
// Add this to your main.jsx or App.jsx
import { validateEnv } from './config/env.js';

// Validate on app start
validateEnv();
```

## 📋 Checklist

- [ ] Create `.env` file with your Google client ID
- [ ] Create `.env.example` for documentation
- [ ] Update `.gitignore` to exclude `.env`
- [ ] Test that Google OAuth still works
- [ ] Set production environment variables
- [ ] Validate environment variables on app start

## 🎉 Benefits

- ✅ **Secure**: No more hardcoded sensitive data
- ✅ **Flexible**: Easy to change values per environment
- ✅ **Maintainable**: Centralized configuration management
- ✅ **Professional**: Follows industry best practices
- ✅ **Scalable**: Easy to add new environment variables

Your application is now properly configured to use environment variables for secure configuration management! 🚀 