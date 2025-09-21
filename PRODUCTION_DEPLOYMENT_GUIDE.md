# MetisAI Production Deployment Guide

## 🚀 Complete Production Deployment Instructions

### Prerequisites

1. **Cloud Infrastructure**
   - nuco.cloud account with quantum computing access
   - Dynex SDK integration configured
   - Supabase project with database schema deployed

2. **Environment Variables**
   ```bash
   # Copy from ENVIRONMENT_SETUP.md
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Required Services**
   - Supabase project
   - Dynex API key
   - Stripe account
   - nuco.cloud account

### Step 1: Environment Configuration

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com/dashboard
   # Create new project
   # Get URL and API keys
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy .env.example to .env.local
   cp .env.example .env.local
   
   # Edit .env.local with your values
   nano .env.local
   ```

3. **Verify Configuration**
   ```bash
   # Test environment variables
   node -e "console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)"
   ```

### Step 2: Database Setup

1. **Deploy Database Schema**
   ```bash
   # Connect to Supabase
   psql -h your_supabase_host -U postgres -d postgres -f database-schema.sql
   ```

2. **Verify Tables Created**
   ```sql
   -- Check tables
   \dt
   
   -- Check RLS policies
   SELECT schemaname, tablename, policyname FROM pg_policies;
   ```

3. **Test Sample Data**
   ```sql
   -- Insert test data
   INSERT INTO user_profiles (id, email, full_name) VALUES ('test-user', 'test@metisai.com', 'Test User');
   ```

### Step 3: Application Build

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Run Tests**
   ```bash
   node comprehensive-test-suite.js
   ```

### Step 4: nuco.cloud Deployment

1. **Configure nuco.cloud**
   ```bash
   # Install nuco CLI
   npm install -g @nuco/cli
   
   # Login to nuco.cloud
   nuco login
   ```

2. **Deploy Application**
   ```bash
   # Deploy with production config
   nuco deploy --config production-config.json
   ```

3. **Verify Deployment**
   ```bash
   # Check deployment status
   nuco status
   
   # View logs
   nuco logs
   ```

### Step 5: Domain Configuration

1. **Set Up Domain**
   ```bash
   # Configure custom domain
   nuco domain add metisai.com
   
   # Set up SSL
   nuco ssl enable
   ```

2. **Configure CDN**
   ```bash
   # Enable Cloudflare CDN
   nuco cdn enable --provider cloudflare
   ```

### Step 6: Monitoring Setup

1. **Configure DataDog**
   ```bash
   # Install DataDog agent
   nuco monitoring install --provider datadog
   
   # Configure alerts
   nuco monitoring alerts setup
   ```

2. **Set Up Logging**
   ```bash
   # Configure log aggregation
   nuco logging setup --provider datadog
   ```

### Step 7: Security Configuration

1. **Enable Security Features**
   ```bash
   # Enable WAF
   nuco security waf enable
   
   # Enable DDoS protection
   nuco security ddos enable
   ```

2. **Configure Firewall**
   ```bash
   # Set up firewall rules
   nuco security firewall configure
   ```

### Step 8: Final Verification

1. **Run Comprehensive Tests**
   ```bash
   # Run full test suite
   node comprehensive-test-suite.js
   
   # Run deployment tests
   node deploy.js
   ```

2. **Performance Testing**
   ```bash
   # Load testing
   npm run test:load
   
   # Stress testing
   npm run test:stress
   ```

3. **Security Testing**
   ```bash
   # Security scan
   npm run test:security
   ```

### Step 9: Go Live

1. **Final Checks**
   - ✅ All tests passing
   - ✅ Performance metrics met
   - ✅ Security scan clean
   - ✅ Monitoring configured
   - ✅ Backup configured

2. **Launch Announcement**
   - Update status page
   - Send launch notifications
   - Monitor system health

3. **Monitor and Optimize**
   - Real-time monitoring
   - Performance optimization
   - User feedback collection

## 📊 Production Monitoring

### Key Metrics to Monitor

1. **Platform Health**
   - Uptime: 99.9%
   - Response time: <200ms
   - Error rate: <0.1%
   - CPU usage: <70%
   - Memory usage: <80%

2. **Quantum Performance**
   - Quantum efficiency: >90%
   - Algorithm success rate: >95%
   - Processing time: <5s
   - Queue length: <10

3. **Business Metrics**
   - User registrations
   - Subscription conversions
   - Revenue growth
   - Customer satisfaction

### Alerting Rules

1. **Critical Alerts**
   - Platform down
   - Database connection lost
   - Payment processing failed
   - Security breach detected

2. **Warning Alerts**
   - High CPU usage
   - Memory usage spike
   - Slow response times
   - High error rates

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Check environment variables
   echo $NEXT_PUBLIC_SUPABASE_URL
   
   # Test connection
   psql -h your_supabase_host -U postgres -d postgres -c "SELECT 1"
   ```

3. **Quantum Model Errors**
   ```bash
   # Check Dynex API key
   echo $DYNEX_API_KEY
   
   # Test quantum models
   python src/lib/quantum/qdllm.py
   ```

### Support Contacts

- **Technical Support**: support@metisai.com
- **Quantum Computing**: quantum@metisai.com
- **Business Inquiries**: business@metisai.com
- **Emergency**: +1-800-METISAI

## 🎉 Success Criteria

✅ All components deployed and functional
✅ Quantum models operational
✅ Payment processing working
✅ User authentication active
✅ MCP and QASC integrations live
✅ Performance metrics met
✅ Security requirements satisfied
✅ Monitoring systems operational
✅ Backup systems configured
✅ Documentation complete

**MetisAI is ready for production! 🚀**

---

*This guide provides complete instructions for deploying MetisAI to production. Follow each step carefully to ensure a successful deployment.*
