# 🚀 MetisAI Deployment Guide

**Version**: 1.0.0  
**Platform**: MetisAI Quantum AI Platform  
**Last Updated**: September 16, 2025

---

## 📋 **Overview**

This guide covers the complete deployment process for the MetisAI platform, including environment setup, database configuration, quantum processing setup, and production deployment.

---

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                   │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)                                        │
│  ├── Static Assets (Cloudflare CDN)                       │
│  ├── Server-Side Rendering (nuco.cloud)                   │
│  └── Client-Side Hydration (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│  Backend Services (nuco.cloud)                             │
│  ├── API Routes (Next.js API)                             │
│  ├── Authentication (Supabase Auth)                       │
│  ├── Database (Supabase PostgreSQL)                       │
│  └── File Storage (Supabase Storage)                      │
├─────────────────────────────────────────────────────────────┤
│  Quantum Processing Layer                                  │
│  ├── Dynex SDK Integration                                │
│  ├── Python Quantum Algorithms                            │
│  ├── QUBO Optimization Engine                             │
│  └── Neuromorphic Computing                               │
├─────────────────────────────────────────────────────────────┤
│  External Services                                         │
│  ├── Payment Processing (Stripe)                          │
│  ├── Monitoring (DataDog)                                 │
│  ├── Analytics (Google Analytics)                         │
│  └── Security (Cloudflare)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **Prerequisites**

### **System Requirements**

- **Node.js**: 18.0.0 or higher
- **Python**: 3.8.0 or higher
- **npm**: 8.0.0 or higher
- **pip**: 21.0.0 or higher
- **Git**: 2.30.0 or higher

### **Cloud Services**

- **nuco.cloud**: Cloud infrastructure and deployment
- **Supabase**: Database and authentication
- **Stripe**: Payment processing
- **Cloudflare**: CDN and security
- **DataDog**: Monitoring and analytics
- **Dynex**: Quantum processing

### **API Keys Required**

- Supabase URL and keys
- Stripe secret and publishable keys
- Dynex API key
- nuco.cloud API key
- DataDog API key
- Cloudflare API key

---

## 🚀 **Quick Start Deployment**

### **1. Clone Repository**

```bash
git clone https://github.com/metisai/platform.git
cd metisai-console
```

### **2. Install Dependencies**

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### **3. Environment Configuration**

```bash
# Copy environment template
cp env.example .env.local

# Edit environment variables
nano .env.local
```

**Required Environment Variables:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Dynex Configuration
DYNEX_API_KEY=your_dynex_api_key
DYNEX_NETWORK=mainnet

# nuco.cloud Configuration
NUCO_CLOUD_API_KEY=your_nuco_cloud_api_key
NUCO_CLOUD_ENDPOINT=https://api.nuco.cloud

# Monitoring Configuration
DATADOG_API_KEY=your_datadog_api_key
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=your_ga_id

# Security Configuration
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

### **4. Database Setup**

```bash
# Run database setup script
npm run setup-db

# Verify database connection
npm run test-db
```

### **5. Quantum Processing Setup**

```bash
# Install quantum dependencies
npm run setup-quantum

# Test quantum processing
npm run test-quantum
```

### **6. Build and Deploy**

```bash
# Build for production
npm run build

# Deploy to nuco.cloud
npm run deploy
```

---

## 🗄️ **Database Configuration**

### **Supabase Setup**

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Note down URL and API keys

2. **Run Database Schema**
   ```bash
   # Execute database schema
   node setup-database.js
   ```

3. **Verify Tables Created**
   ```sql
   -- Check if all tables exist
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

### **Database Schema**

The platform uses the following main tables:

- **users**: User accounts and profiles
- **subscriptions**: Subscription plans and billing
- **usage_logs**: API usage tracking
- **payments**: Payment history and invoices
- **support_tickets**: Customer support system
- **algorithms**: QUBO algorithms catalog
- **automations**: Automation templates
- **fkt_tokens**: FLYFOX Knowledge Tokens

### **Database Migrations**

```bash
# Run migrations
npm run migrate

# Rollback migrations
npm run migrate:rollback

# Check migration status
npm run migrate:status
```

---

## ⚡ **Quantum Processing Setup**

### **Dynex SDK Integration**

1. **Install Dynex SDK**
   ```bash
   pip install dynex
   ```

2. **Configure Dynex**
   ```python
   import dynex
   
   # Initialize Dynex client
   dynex_client = dynex.DynexClient(
       api_key=os.getenv('DYNEX_API_KEY'),
       network='mainnet'
   )
   ```

3. **Test Quantum Processing**
   ```bash
   # Test qdLLM
   python src/lib/quantum/qdllm.py

   # Test QNLP
   python src/lib/quantum/qnlp.py

   # Test QTransform
   python src/lib/quantum/qtransform.py
   ```

### **Quantum Algorithms**

The platform includes several quantum algorithms:

- **QUBO Optimization**: Quadratic unconstrained binary optimization
- **Quantum Annealing**: Simulated annealing for optimization
- **Quantum Machine Learning**: Quantum-enhanced ML algorithms
- **Quantum Natural Language Processing**: Quantum NLP algorithms

---

## 🌐 **Production Deployment**

### **nuco.cloud Deployment**

1. **Create nuco.cloud Account**
   - Go to https://nuco.cloud
   - Create account and get API key
   - Set up billing and payment method

2. **Deploy Application**
   ```bash
   # Deploy to nuco.cloud
   npm run deploy:production
   ```

3. **Configure Domain**
   - Set up custom domain
   - Configure SSL certificates
   - Set up DNS records

### **Environment Configuration**

1. **Production Environment Variables**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://metisai.nuco.cloud
   NEXT_PUBLIC_API_URL=https://api.metisai.nuco.cloud
   ```

2. **Security Configuration**
   ```env
   # Enable security features
   SECURE_COOKIES=true
   CSRF_PROTECTION=true
   RATE_LIMITING=true
   ```

### **CDN and Security (Cloudflare)**

1. **Cloudflare Setup**
   - Add domain to Cloudflare
   - Configure DNS records
   - Enable security features

2. **Security Features**
   - DDoS protection
   - WAF (Web Application Firewall)
   - Bot protection
   - SSL/TLS encryption

---

## 📊 **Monitoring and Analytics**

### **DataDog Integration**

1. **Install DataDog Agent**
   ```bash
   # Install DataDog agent
   curl -s https://s3.amazonaws.com/dd-agent/scripts/install_script.sh | bash
   ```

2. **Configure Monitoring**
   ```javascript
   // DataDog configuration
   const datadog = require('dd-trace');
   
   datadog.init({
     service: 'metisai-platform',
     env: 'production',
     version: '1.0.0'
   });
   ```

### **Application Monitoring**

1. **Performance Metrics**
   - Response times
   - Error rates
   - Throughput
   - Resource usage

2. **Business Metrics**
   - User registrations
   - API usage
   - Revenue tracking
   - Customer satisfaction

### **Logging Configuration**

```javascript
// Winston logger configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ]
});
```

---

## 🔒 **Security Configuration**

### **Authentication Security**

1. **JWT Configuration**
   ```javascript
   const jwt = require('jsonwebtoken');
   
   const jwtConfig = {
     secret: process.env.JWT_SECRET,
     expiresIn: '24h',
     algorithm: 'HS256'
   };
   ```

2. **Password Security**
   ```javascript
   const bcrypt = require('bcrypt');
   
   // Hash passwords
   const saltRounds = 12;
   const hashedPassword = await bcrypt.hash(password, saltRounds);
   ```

### **API Security**

1. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP'
   });
   ```

2. **CORS Configuration**
   ```javascript
   const cors = require('cors');
   
   const corsOptions = {
     origin: process.env.ALLOWED_ORIGINS.split(','),
     credentials: true,
     optionsSuccessStatus: 200
   };
   ```

### **Data Encryption**

1. **Database Encryption**
   - Enable encryption at rest
   - Use encrypted connections
   - Secure backup storage

2. **File Encryption**
   ```javascript
   const crypto = require('crypto');
   
   function encryptFile(data, key) {
     const cipher = crypto.createCipher('aes-256-cbc', key);
     let encrypted = cipher.update(data, 'utf8', 'hex');
     encrypted += cipher.final('hex');
     return encrypted;
   }
   ```

---

## 🧪 **Testing and Quality Assurance**

### **Automated Testing**

1. **Unit Tests**
   ```bash
   # Run unit tests
   npm run test:unit
   ```

2. **Integration Tests**
   ```bash
   # Run integration tests
   npm run test:integration
   ```

3. **End-to-End Tests**
   ```bash
   # Run E2E tests
   npm run test:e2e
   ```

### **Performance Testing**

1. **Load Testing**
   ```bash
   # Run load tests
   npm run test:load
   ```

2. **Stress Testing**
   ```bash
   # Run stress tests
   npm run test:stress
   ```

### **Security Testing**

1. **Vulnerability Scanning**
   ```bash
   # Run security scan
   npm audit
   ```

2. **Penetration Testing**
   - Regular security audits
   - Third-party security testing
   - Vulnerability assessments

---

## 📈 **Scaling and Optimization**

### **Horizontal Scaling**

1. **Load Balancing**
   - Configure load balancer
   - Set up health checks
   - Implement failover

2. **Database Scaling**
   - Read replicas
   - Connection pooling
   - Query optimization

### **Performance Optimization**

1. **Caching Strategy**
   ```javascript
   const redis = require('redis');
   
   const client = redis.createClient({
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT
   });
   ```

2. **CDN Configuration**
   - Static asset caching
   - Image optimization
   - Global distribution

### **Monitoring and Alerting**

1. **Health Checks**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       uptime: process.uptime()
     });
   });
   ```

2. **Alert Configuration**
   - Set up monitoring alerts
   - Configure notification channels
   - Define escalation procedures

---

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm run test
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to nuco.cloud
      run: npm run deploy:production
      env:
        NUCO_CLOUD_API_KEY: ${{ secrets.NUCO_CLOUD_API_KEY }}
```

### **Deployment Process**

1. **Code Review**
   - Pull request review
   - Automated testing
   - Security scanning

2. **Staging Deployment**
   - Deploy to staging environment
   - Run integration tests
   - User acceptance testing

3. **Production Deployment**
   - Deploy to production
   - Monitor deployment
   - Verify functionality

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Database Connection Issues**
   ```bash
   # Check database connection
   npm run test-db
   
   # Verify environment variables
   npm run validate-env
   ```

2. **Quantum Processing Issues**
   ```bash
   # Test quantum processing
   npm run test-quantum
   
   # Check Dynex API key
   echo $DYNEX_API_KEY
   ```

3. **Deployment Issues**
   ```bash
   # Check deployment logs
   npm run logs:deployment
   
   # Verify nuco.cloud status
   npm run status:nuco
   ```

### **Debugging Tools**

1. **Application Logs**
   ```bash
   # View application logs
   npm run logs:app
   
   # View error logs
   npm run logs:error
   ```

2. **Performance Monitoring**
   ```bash
   # View performance metrics
   npm run metrics:performance
   
   # View resource usage
   npm run metrics:resources
   ```

---

## 📚 **Additional Resources**

- [API Documentation](API_DOCUMENTATION.md)
- [Developer Guide](DEVELOPER_GUIDE.md)
- [User Guide](USER_GUIDE.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## 📞 **Support**

- **Technical Support**: support@metisai.tech
- **Deployment Support**: deployment@metisai.tech
- **Emergency Support**: +1 (555) 123-4567

---

**Happy deploying! 🚀**
