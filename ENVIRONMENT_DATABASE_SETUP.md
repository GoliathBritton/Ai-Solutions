# MetisAI Environment & Database Setup Guide

This guide provides comprehensive instructions for setting up the MetisAI platform environment and database configuration.

## 🚀 Quick Start

For a complete automated setup, run:
```bash
npm run setup-production
```

This will run all setup scripts in sequence:
1. Environment configuration
2. Database setup
3. Environment validation
4. Database testing

## 📋 Manual Setup Steps

### 1. Environment Configuration

#### Option A: Interactive Setup
```bash
npm run setup-env
```

This will prompt you for all required environment variables.

#### Option B: Manual Configuration
Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Dynex Configuration
DYNEX_API_KEY=your_dynex_api_key
DYNEX_NETWORK=testnet

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Web3 Configuration
INFURA_API_KEY=your_infura_key
ALCHEMY_API_KEY=your_alchemy_key
IPFS_GATEWAY_URL=https://ipfs.io/ipfs/
ARWEAVE_GATEWAY_URL=https://arweave.net/

# TOR Configuration
TOR_SOCKS_PORT=9050
TOR_CONTROL_PORT=9051

# Search Engine APIs
DUCKDUCKGO_API_KEY=your_duckduckgo_key
BRAVE_SEARCH_API_KEY=your_brave_key
STARTPAGE_API_KEY=your_startpage_key

# Security
JWT_SECRET=your_32_character_jwt_secret
ENCRYPTION_KEY=your_32_character_encryption_key
API_RATE_LIMIT=100

# Database
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# Monitoring
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id

# Deployment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=MetisAI
NEXT_PUBLIC_APP_DESCRIPTION=Quantum-Enhanced AI Platform
```

### 2. Database Setup

#### Option A: Automated Setup
```bash
npm run setup-db
```

#### Option B: Manual Setup

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down the URL and API keys

2. **Deploy Database Schema**:
   - Copy the contents of `database-schema.sql`
   - Run it in your Supabase SQL editor

3. **Configure Row Level Security (RLS)**:
   - Enable RLS on all tables
   - Create appropriate policies for your use case

### 3. Environment Validation

```bash
npm run validate-env
```

This will check:
- ✅ All required environment variables are set
- ✅ Supabase connection is working
- ✅ Dynex API configuration is valid
- ✅ Stripe payment configuration is correct
- ✅ Web3 services are accessible
- ✅ Search engine APIs are configured
- ✅ Security settings are properly configured

### 4. Database Testing

```bash
npm run test-db
```

This will test:
- ✅ Database connection
- ✅ All tables are accessible
- ✅ CRUD operations work correctly
- ✅ Data integrity constraints
- ✅ Query performance

## 🔧 Required Services

### Supabase
- **Purpose**: Database, Authentication, Real-time subscriptions
- **Setup**: Create project at [supabase.com](https://supabase.com)
- **Required**: URL, Anon Key, Service Role Key

### Dynex
- **Purpose**: Quantum computing backend
- **Setup**: Get API key from [dynex.ai](https://dynex.ai)
- **Required**: API Key, Network selection

### Stripe
- **Purpose**: Payment processing
- **Setup**: Create account at [stripe.com](https://stripe.com)
- **Required**: Secret Key, Publishable Key, Webhook Secret

### Web3 Services
- **Infura**: Ethereum node access
- **Alchemy**: Blockchain data and analytics
- **IPFS**: Decentralized storage
- **Arweave**: Permanent storage

### Search Engines
- **DuckDuckGo**: Privacy-focused search
- **Brave Search**: Independent search index
- **Startpage**: Google results without tracking

## 🛡️ Security Configuration

### JWT Secret
Generate a secure 32+ character secret:
```bash
openssl rand -base64 32
```

### Encryption Key
Generate a secure encryption key:
```bash
openssl rand -base64 32
```

### API Rate Limiting
Configure appropriate rate limits based on your expected usage:
- Development: 100 requests/minute
- Production: 1000+ requests/minute

## 📊 Monitoring Setup

### Sentry (Optional)
- **Purpose**: Error tracking and performance monitoring
- **Setup**: Create project at [sentry.io](https://sentry.io)
- **Required**: DSN

### Analytics (Optional)
- **Purpose**: Usage analytics and insights
- **Setup**: Configure with your preferred analytics provider
- **Required**: Analytics ID

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Environment validation passed
- [ ] Database testing passed
- [ ] Domain configured
- [ ] SSL certificates ready
- [ ] Monitoring configured

### Deployment Commands
```bash
# Complete setup
npm run setup-production

# Build for production
npm run build

# Start production server
npm run start
```

## 🔍 Troubleshooting

### Common Issues

#### Environment Variables Not Loading
- Ensure `.env.local` is in the project root
- Check for typos in variable names
- Restart the development server

#### Database Connection Failed
- Verify Supabase credentials
- Check network connectivity
- Ensure database is not paused

#### Payment Processing Issues
- Verify Stripe keys are correct
- Check webhook configuration
- Ensure test/live mode consistency

#### Web3 Services Not Working
- Verify API keys are valid
- Check rate limits
- Ensure proper network configuration

### Getting Help

1. Check the logs for specific error messages
2. Run validation scripts to identify issues
3. Review the troubleshooting section in each script
4. Check service-specific documentation

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Dynex Documentation](https://dynex.ai/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🎯 Next Steps

After completing the environment and database setup:

1. **Test the Platform**: Run `npm run dev` and test all features
2. **Run Comprehensive Tests**: Execute `npm run test-all`
3. **Deploy to Production**: Use `node production-deploy.js`
4. **Monitor Performance**: Set up monitoring and analytics
5. **Scale as Needed**: Configure additional services based on usage

---

**Note**: This setup process is designed to be comprehensive and production-ready. All scripts include error handling and validation to ensure a smooth deployment experience.
