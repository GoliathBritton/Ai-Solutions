# MetisAI Platform - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ installed
- Python 3.8+ installed
- Supabase project configured
- Dynex SDK credentials
- nuco.cloud account (optional)

### 1. Environment Configuration

Create `.env.local` with your production credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# MetisAI Platform Configuration
NEXT_PUBLIC_APP_NAME=MetisAI Platform
NEXT_PUBLIC_APP_VERSION=1.0.0

# Quantum Processing Configuration
NEXT_PUBLIC_QUANTUM_ENABLED=true
NEXT_PUBLIC_DYNEX_ENDPOINT=your-dynex-endpoint

# Production URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Build and Test

```bash
# Install dependencies
npm install

# Install Python dependencies
npm run setup-quantum

# Build the application
npm run build

# Test the build locally
npm run start
```

### 3. Deployment Options

#### Option A: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Option B: Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables

#### Option C: Self-Hosted (VPS/Cloud)
1. Set up a server with Node.js and Python
2. Clone the repository
3. Install dependencies
4. Configure environment variables
5. Use PM2 or similar for process management

### 4. Supabase Configuration

#### Authentication Settings
- Set Site URL to your production domain
- Add redirect URLs for your domain
- Configure email templates
- Set up Google OAuth (optional)

#### Database Setup
```sql
-- Create user profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  quantum_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage tracking table
CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  model_type TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  processing_time FLOAT DEFAULT 0,
  quantum_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Dynex SDK Configuration

1. Copy DynexSDK to your production server
2. Configure `dynex.ini` with production credentials
3. Set up API endpoints for quantum processing
4. Configure rate limiting and monitoring

### 6. nuco.cloud Integration

1. Set up nuco.cloud account
2. Configure quantum computing resources
3. Update environment variables
4. Test quantum processing endpoints

### 7. Monitoring and Analytics

#### Application Monitoring
- Set up error tracking (Sentry, Bugsnag)
- Configure performance monitoring
- Set up uptime monitoring

#### Quantum Processing Metrics
- Track quantum vs classical usage
- Monitor processing times
- Log confidence scores
- Track error rates

### 8. Security Considerations

#### Environment Security
- Use strong, unique passwords
- Rotate API keys regularly
- Enable 2FA on all accounts
- Use HTTPS in production

#### Application Security
- Enable Supabase RLS (Row Level Security)
- Implement rate limiting
- Set up CORS properly
- Use secure headers

### 9. Performance Optimization

#### Next.js Optimization
- Enable static generation where possible
- Use image optimization
- Implement caching strategies
- Optimize bundle size

#### Quantum Processing Optimization
- Cache quantum results
- Implement fallback mechanisms
- Optimize QUBO formulations
- Use connection pooling

### 10. Backup and Recovery

#### Database Backups
- Set up automated Supabase backups
- Export data regularly
- Test restore procedures

#### Application Backups
- Version control all code
- Backup configuration files
- Document deployment procedures

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Not Working**
   - Check Supabase URL and keys
   - Verify redirect URLs
   - Check CORS settings

2. **Quantum Processing Errors**
   - Verify Dynex SDK installation
   - Check API credentials
   - Test with classical fallback

3. **Build Failures**
   - Check Node.js version
   - Verify all dependencies
   - Check environment variables

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Dynex SDK Guide](https://github.com/dynexcoin/DynexSDK)
- [MetisAI Support](https://metisai.com/support)

## 📊 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Authentication working correctly
- [ ] Quantum processing functional
- [ ] All pages loading properly
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Backup procedures tested
- [ ] Security measures in place
- [ ] Documentation updated
- [ ] Team access configured

---

**MetisAI Platform** - *Deploying the Future of Quantum AI* ⚡🧠🔄
