# Render Deployment Guide for Vitrus Backend

## Issue Description
The backend deployment on Render is failing with "Supabase connection test failed" error. This guide provides steps to resolve the deployment issues.

## Root Cause Analysis
The deployment failure is likely due to one or more of the following issues:
1. Missing or incorrect Supabase environment variables on Render
2. Invalid Supabase credentials
3. Network connectivity issues between Render and Supabase
4. Supabase database/table configuration issues

## Solution Steps

### 1. Configure Environment Variables on Render

In your Render dashboard, go to your backend service and add the following environment variables:

**Required Variables:**
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
PORT=10000
```

**Optional but Recommended:**
```
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=info
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### 2. Verify Supabase Configuration

1. **Check Supabase Project Status:**
   - Log into your Supabase dashboard
   - Ensure your project is active and not paused
   - Verify the project URL matches your environment variable

2. **Verify API Keys:**
   - Go to Settings > API in your Supabase dashboard
   - Copy the correct `anon/public` key
   - Copy the correct `service_role` key (if needed)

3. **Check Database Tables:**
   - Ensure the `users` table exists in your database
   - Verify table permissions allow read access for the anon key

### 3. Database Setup

If the `users` table doesn't exist, create it with this SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for anon access (read-only)
CREATE POLICY "Allow anon read access" ON users
  FOR SELECT
  TO anon
  USING (true);
```

### 4. Test Connection Locally

Before deploying, test the connection locally:

```bash
# In the backend directory
cd backend

# Set environment variables
export SUPABASE_URL="your_supabase_url"
export SUPABASE_ANON_KEY="your_anon_key"

# Test the connection
node -e "require('./src/config/supabase').testConnection()"
```

### 5. Deploy with Better Error Handling

The updated `supabase.js` configuration now includes:
- Detailed error logging
- Connection timeout handling
- Retry logic with exponential backoff
- Environment variable validation

### 6. Monitor Deployment Logs

After deployment, check the Render logs for:
- Environment variable status
- Detailed connection error messages
- Retry attempts and results

## Troubleshooting Common Issues

### Issue: "SUPABASE_URL environment variable is required"
**Solution:** Add the SUPABASE_URL environment variable in Render dashboard

### Issue: "Connection timeout after 10 seconds"
**Solution:** 
- Check Supabase project status
- Verify network connectivity
- Ensure Supabase isn't experiencing downtime

### Issue: "Permission denied for table users"
**Solution:**
- Check Row Level Security policies
- Verify anon key permissions
- Ensure table exists and is accessible

### Issue: "Invalid API key"
**Solution:**
- Regenerate API keys in Supabase dashboard
- Update environment variables on Render
- Ensure no extra spaces or characters in keys

## Verification Steps

1. **Check Environment Variables:**
   ```bash
   # In Render shell (if available)
   echo $SUPABASE_URL
   echo $SUPABASE_ANON_KEY | wc -c  # Should show key length
   ```

2. **Test API Endpoint:**
   ```bash
   # Test health endpoint
   curl https://your-render-app.onrender.com/api/health
   ```

3. **Monitor Logs:**
   - Watch deployment logs for connection success messages
   - Look for "✅ Supabase connection established successfully"

## Next Steps After Successful Deployment

1. Test all API endpoints
2. Verify frontend can connect to backend
3. Test user authentication flows
4. Monitor performance and error rates

## Support

If issues persist:
1. Check Render status page
2. Check Supabase status page
3. Review detailed error logs
4. Contact support with specific error messages