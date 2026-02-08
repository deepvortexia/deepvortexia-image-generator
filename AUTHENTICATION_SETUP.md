# 🔥 AUTHENTICATION & CREDITS SYSTEM SETUP GUIDE

This guide explains how the authentication and credits system works in this image generator, cloned from the working emoticon-generator system.

## 🎯 System Overview

The application has two modes:
1. **Free Tier** (No Auth): 2 free generations per user (localStorage)
2. **Authenticated Users**: Credits-based system with Supabase

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Replicate API Key**: Get from [replicate.com](https://replicate.com)

## 🔧 Step 1: Set Up Supabase Database

### 1.1 Create Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create transactions table (for payment tracking)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  pack_name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  credits_purchased INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);
```

### 1.2 Set Up Authentication Providers

In your Supabase Dashboard:

1. Go to **Authentication → Providers**
2. Enable **Google** provider:
   - Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
3. Enable **Email** provider (already enabled by default)

## 🔑 Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Replicate API (Required)
REPLICATE_API_TOKEN=r8_your_token_here

# Supabase Configuration (Required for auth/credits)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Stripe (for credit purchases)
STRIPE_SECRET_KEY=sk_test_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

### Get Your Supabase Keys:

1. Go to your Supabase project
2. Navigate to **Settings → API**
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🚀 Step 3: Run the Application

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

## ✅ Step 4: Test the System

### Test Free Tier (No Auth):
1. Open the app without signing in
2. You should see "🎁 2 free generations remaining"
3. Generate an image twice
4. On the third attempt, you should be prompted to sign in

### Test Authentication:
1. Click "Sign In" button in the header
2. Choose Google or Email authentication
3. Complete the auth flow
4. You should see your credits (default: 3)
5. Header should show your email/username

### Test Credit Deduction:
1. Sign in
2. Generate an image
3. Credits should decrease by 1
4. If generation fails, credit should be restored

### Test Sign Out:
1. Click on your profile in the header
2. Confirm sign out
3. Should return to free tier mode

## 🔍 How It Works

### Authentication Flow:

```
User clicks "Sign In"
  ↓
AuthModal opens
  ↓
User chooses Google or Email
  ↓
Supabase handles OAuth/Magic Link
  ↓
Redirected to /auth/callback
  ↓
Session established
  ↓
Profile fetched/created with 3 credits
  ↓
User sees their credits in CreditsDisplay
```

### Generation Flow (Non-Logged):

```
User clicks "Generate"
  ↓
Check localStorage for free generations
  ↓
If available: Deduct 1, call API
  ↓
If API fails: Restore 1
  ↓
If no generations left: Show AuthModal
```

### Generation Flow (Logged In):

```
User clicks "Generate"
  ↓
API checks Supabase session
  ↓
Verify user has credits
  ↓
Deduct credit (atomic operation)
  ↓
Generate image
  ↓
If fails: Restore credit
  ↓
Return result
  ↓
Frontend refreshes profile
```

## 📊 Database Schema

### profiles table:
- `id` (UUID): User ID from auth.users
- `email` (TEXT): User's email
- `full_name` (TEXT): User's name
- `avatar_url` (TEXT): Profile picture URL
- `credits` (INTEGER): Available credits (default: 3)
- `created_at` (TIMESTAMPTZ): Account creation
- `updated_at` (TIMESTAMPTZ): Last profile update

### transactions table:
- `id` (UUID): Transaction ID
- `user_id` (UUID): Reference to profiles
- `stripe_session_id` (TEXT): Stripe checkout session
- `pack_name` (TEXT): Credit pack purchased
- `amount_cents` (INTEGER): Payment amount
- `credits_purchased` (INTEGER): Credits added
- `status` (TEXT): pending/completed/failed
- `created_at` (TIMESTAMPTZ): Transaction date

## 🔒 Security Features

1. **Optimistic Locking**: Credit deduction uses `WHERE credits = {old_value}` to prevent race conditions
2. **Server-Side Validation**: All credit checks happen on the API route
3. **Row Level Security**: Database-level protection
4. **Credit Restoration**: Failed generations restore credits automatically
5. **Session Validation**: Every API call verifies Supabase session

## 🎁 Default Credits

New users receive **3 free credits** upon signup (configurable in AuthContext.tsx line 71).

## 🐛 Troubleshooting

### "Supabase not configured" warning:
- App runs in free-tier mode (2 generations)
- Check `.env.local` has correct Supabase variables

### Authentication not working:
1. Verify Supabase URL and keys in `.env.local`
2. Check Google OAuth is configured in Supabase
3. Ensure redirect URI matches your domain
4. Check browser console for errors

### Credits not deducting:
1. Check database connection
2. Verify RLS policies are set up
3. Check API logs for errors
4. Ensure user profile exists in database

### Build fails with Supabase errors:
- The app is designed to build without Supabase configured
- It will show warnings but should complete successfully

## 📝 Notes

- The system is fully compatible with both development and production
- Free-tier localStorage is per-browser (not per-user)
- Logged-in credits are per-user across devices
- The app works offline for free generations (localStorage)
- Logged-in mode requires internet connection

## 🎯 Next Steps

To add payment functionality:
1. Set up Stripe account
2. Create credit packs in Stripe
3. Implement PricingModal component
4. Add `/api/create-checkout` route
5. Add `/api/webhook` for Stripe events
6. Test payment flow

---

**System cloned from**: `deepvortexia/emoticon-generator`  
**Model**: Google Imagen-4-Fast via Replicate  
**Auth Provider**: Supabase
