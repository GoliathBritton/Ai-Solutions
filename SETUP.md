# MetisAI Platform Setup Guide

## Authentication Setup

### 1. Supabase Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Update the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Set up Authentication in Supabase**
   - Go to Authentication > Settings in your Supabase dashboard
   - Configure your site URL: `http://localhost:3000`
   - Add redirect URLs: `http://localhost:3000/**`
   - Enable email authentication
   - Optionally enable Google OAuth

### 2. Install Dependencies

```bash
npm install
npm run setup-quantum
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test Authentication

1. Navigate to `http://localhost:3000`
2. You should be redirected to `/auth/signin`
3. Create an account or sign in
4. You should be redirected back to the main app

## Protected Routes

The following routes require authentication:
- `/` (Home page)
- `/profile` (User profile)
- `/settings` (User settings)

## Authentication Pages

The following pages are available for authentication:
- `/auth/signin` (Sign in)
- `/auth/signup` (Sign up)
- `/auth/reset-password` (Password reset)

## Features

- ✅ Supabase authentication with email/password
- ✅ Google OAuth integration
- ✅ Protected routes with middleware
- ✅ User profile and settings pages
- ✅ Header authentication state
- ✅ Sign in/out functionality
- ✅ Password reset flow
- ✅ Responsive design
- ✅ Quantum AI branding

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the project root
   - Restart the development server after adding variables

2. **Authentication Redirects Not Working**
   - Check Supabase site URL configuration
   - Verify redirect URLs in Supabase dashboard

3. **Middleware Issues**
   - Ensure `src/middleware.ts` exists
   - Check that protected routes are properly configured

### Support

For additional help, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MetisAI Platform Docs](https://metisai.com/docs)
