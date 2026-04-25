# Supabase Setup Guide for ScamShield

This guide will help you set up Supabase for ScamShield to replace localStorage with a proper database and authentication system.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign in with GitHub or create an account
4. Click "New Project"
5. Choose your organization (or create one)
6. Fill in project details:
   - **Project Name**: `scamshield` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
7. Click "Create new project"
8. Wait for the project to be provisioned (1-2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the **Project URL** and **anon public** key
3. These will be used in your `.env.local` file

### 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.example and fill in your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 4. Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

### 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/*`
4. Enable **Email** provider (should be enabled by default)

### 6. Start Your App

```bash
npm run dev
```

Your app will now use Supabase instead of localStorage!

## 📊 Database Schema Overview

The schema creates these main tables:

### `user_profiles`
- Stores additional user data beyond auth.users
- Links to auth.users via foreign key
- Contains: id, email, name, created_at, updated_at

### `scan_history`
- Stores all scam analysis results
- Contains: user_id, text, risk_level, risk_score, scam_type, red_flags, recommendations, etc.
- Row Level Security ensures users can only access their own data

## 🔐 Authentication Features

### Built-in Auth Features:
- ✅ Email/Password authentication
- ✅ Session management
- ✅ Protected routes (dashboard, history)
- ✅ Automatic user profile creation
- ✅ Session persistence
- ✅ Logout functionality

### Auth Flow:
1. User signs up → Profile automatically created
2. User logs in → Session established
3. Protected routes check authentication
4. Data is filtered by user_id (RLS)

## 🛡️ Security Features

### Row Level Security (RLS):
- Users can only access their own scan history
- Automatic user_id filtering
- Secure profile management

### Session Security:
- JWT-based sessions
- Automatic token refresh
- Secure cookie handling

## 📱 How It Works

### Storage Adapter Pattern:
```typescript
// Automatically switches based on environment
export const storage = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? new SupabaseAdapter() 
  : new LocalStorageAdapter()

export const auth = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? new SupabaseAuthAdapter() 
  : new MockAuthAdapter()
```

### Fallback Behavior:
- **With Supabase**: Full database and auth
- **Without Supabase**: Local storage + mock auth (for development)

## 🔄 Migration from localStorage

If you have existing localStorage data:

1. Your existing data remains in localStorage
2. New users will use Supabase automatically
3. To migrate existing users, you'd need a custom migration script

## 🧪 Testing Your Setup

### Test Authentication:
1. Go to `/signup` - Create a new account
2. Check your email for verification (if enabled)
3. Go to `/login` - Sign in
4. Navigate to `/dashboard` - Should load with your user data
5. Check the navbar - Should show your name and logout button

### Test Data Persistence:
1. Go to `/scan` - Analyze some text
2. Go to `/history` - Should show your analysis
3. Go to `/dashboard` - Should show updated statistics
4. Logout and log back in - Data should persist

### Test Protected Routes:
1. Try accessing `/dashboard` or `/history` without logging in
2. Should show authentication required message

## 🚨 Common Issues & Solutions

### Issue: "Invalid JWT" errors
**Solution**: Ensure your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct

### Issue: Can't access protected routes
**Solution**: Check that Row Level Security policies are applied correctly

### Issue: No data showing in dashboard
**Solution**: Ensure the user has scan history data in the database

### Issue: CORS errors
**Solution**: Add your localhost URL to Supabase CORS settings

## 🔧 Advanced Configuration

### Custom Auth Providers:
You can add OAuth providers in Supabase:
- Google
- GitHub
- Facebook
- And more...

### Custom Database Functions:
The schema includes helper functions for:
- Automatic user profile creation
- Timestamp updates
- Data validation

### Production Considerations:
- Enable email verification
- Set up custom SMTP for emails
- Configure rate limiting
- Set up monitoring

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Auth with Supabase](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Troubleshooting

If you encounter issues:

1. Check your environment variables
2. Verify the database schema was applied
3. Check Supabase logs for errors
4. Ensure RLS policies are enabled
5. Test with a fresh browser session

For support, check the Supabase dashboard logs or create an issue in the project repository.
