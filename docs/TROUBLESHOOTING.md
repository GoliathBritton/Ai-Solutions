# 🔧 MetisAI Troubleshooting Guide

**Version**: 1.0.0  
**Platform**: MetisAI Quantum AI Platform  
**Last Updated**: September 16, 2025

---

## 🚨 **Quick Fixes**

### **Common Issues and Solutions**

| Issue | Quick Fix | Detailed Solution |
|-------|-----------|-------------------|
| API Key Invalid | Check environment variables | [Authentication Issues](#authentication-issues) |
| Database Connection Failed | Verify Supabase credentials | [Database Issues](#database-issues) |
| Quantum Processing Error | Check Dynex API key | [Quantum Processing Issues](#quantum-processing-issues) |
| Payment Processing Failed | Verify Stripe configuration | [Payment Issues](#payment-issues) |
| Slow Response Times | Check rate limits and caching | [Performance Issues](#performance-issues) |

---

## 🔐 **Authentication Issues**

### **Problem: "Invalid API Key" Error**

**Symptoms:**
- 401 Unauthorized responses
- "Invalid API key" error messages
- Authentication failures

**Solutions:**

1. **Check API Key Configuration**
   ```bash
   # Verify environment variables
   echo $METISAI_API_KEY
   
   # Check .env.local file
   cat .env.local | grep API_KEY
   ```

2. **Regenerate API Key**
   - Go to Settings > API Keys
   - Generate new API key
   - Update environment variables
   - Restart application

3. **Verify Key Format**
   ```javascript
   // Check API key format
   const apiKey = process.env.METISAI_API_KEY;
   if (!apiKey || apiKey.length < 32) {
     console.error('Invalid API key format');
   }
   ```

### **Problem: JWT Token Expired**

**Symptoms:**
- "Token expired" error messages
- Authentication failures after time
- Session timeout issues

**Solutions:**

1. **Refresh Token**
   ```javascript
   // Refresh JWT token
   const refreshToken = localStorage.getItem('refresh_token');
   const response = await client.auth.refreshToken(refreshToken);
   localStorage.setItem('access_token', response.access_token);
   ```

2. **Implement Auto-Refresh**
   ```javascript
   // Auto-refresh token before expiry
   setInterval(async () => {
     const token = localStorage.getItem('access_token');
     const decoded = jwt.decode(token);
     const now = Date.now() / 1000;
     
     if (decoded.exp - now < 300) { // 5 minutes before expiry
       await refreshToken();
     }
   }, 60000); // Check every minute
   ```

### **Problem: Rate Limit Exceeded**

**Symptoms:**
- 429 Too Many Requests responses
- "Rate limit exceeded" error messages
- API calls being blocked

**Solutions:**

1. **Implement Exponential Backoff**
   ```javascript
   async function apiCallWithRetry(fn, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (error.status === 429 && i < maxRetries - 1) {
           const delay = Math.pow(2, i) * 1000; // Exponential backoff
           await new Promise(resolve => setTimeout(resolve, delay));
           continue;
         }
         throw error;
       }
     }
   }
   ```

2. **Monitor Rate Limits**
   ```javascript
   // Check rate limit headers
   const response = await client.api.get('/status');
   const remaining = response.headers['x-ratelimit-remaining'];
   const resetTime = response.headers['x-ratelimit-reset'];
   
   if (remaining < 10) {
     console.warn('Rate limit approaching');
   }
   ```

---

## 🗄️ **Database Issues**

### **Problem: Database Connection Failed**

**Symptoms:**
- "Database connection failed" errors
- Supabase connection timeouts
- Data not loading

**Solutions:**

1. **Check Supabase Configuration**
   ```bash
   # Verify environment variables
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```

2. **Test Database Connection**
   ```bash
   # Run database test
   npm run test-db
   
   # Check Supabase status
   curl https://status.supabase.com/api/v2/status.json
   ```

3. **Verify Database Schema**
   ```sql
   -- Check if tables exist
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

### **Problem: Query Timeout**

**Symptoms:**
- Slow database queries
- Query timeout errors
- Performance issues

**Solutions:**

1. **Optimize Queries**
   ```sql
   -- Add indexes for frequently queried columns
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
   ```

2. **Implement Query Caching**
   ```javascript
   const NodeCache = require('node-cache');
   const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes
   
   async function getCachedData(key, queryFn) {
     const cached = cache.get(key);
     if (cached) return cached;
     
     const data = await queryFn();
     cache.set(key, data);
     return data;
   }
   ```

3. **Use Connection Pooling**
   ```javascript
   const { createClient } = require('@supabase/supabase-js');
   
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
     {
       db: {
         schema: 'public'
       },
       auth: {
         persistSession: false
       }
     }
   );
   ```

---

## ⚡ **Quantum Processing Issues**

### **Problem: Dynex API Connection Failed**

**Symptoms:**
- "Quantum processing unavailable" errors
- Dynex API timeouts
- Quantum features not working

**Solutions:**

1. **Check Dynex API Key**
   ```bash
   # Verify Dynex configuration
   echo $DYNEX_API_KEY
   echo $DYNEX_NETWORK
   ```

2. **Test Dynex Connection**
   ```bash
   # Test quantum processing
   npm run test-quantum
   
   # Check Dynex status
   curl https://api.dynex.ai/status
   ```

3. **Implement Fallback Processing**
   ```javascript
   async function processWithFallback(prompt) {
     try {
       // Try quantum processing first
       return await client.qdllm.generate({ prompt, useQuantum: true });
     } catch (error) {
       console.warn('Quantum processing failed, using classical fallback');
       // Fallback to classical processing
       return await client.qdllm.generate({ prompt, useQuantum: false });
     }
   }
   ```

### **Problem: Quantum Processing Timeout**

**Symptoms:**
- Long processing times
- Timeout errors
- Incomplete responses

**Solutions:**

1. **Increase Timeout Limits**
   ```javascript
   const client = new MetisAI({
     apiKey: process.env.METISAI_API_KEY,
     timeout: 30000 // 30 seconds
   });
   ```

2. **Implement Progress Tracking**
   ```javascript
   async function generateWithProgress(prompt, onProgress) {
     const response = await client.qdllm.generate({
       prompt,
       useQuantum: true,
       stream: true
     });
     
     for await (const chunk of response) {
       onProgress(chunk.progress);
     }
     
     return response;
   }
   ```

3. **Optimize Quantum Parameters**
   ```javascript
   const response = await client.qdllm.generate({
     prompt,
     maxLength: 500, // Reduce length for faster processing
     temperature: 0.7, // Lower temperature for more deterministic results
     useQuantum: true
   });
   ```

---

## 💰 **Payment Issues**

### **Problem: Stripe Payment Failed**

**Symptoms:**
- Payment processing errors
- Stripe API failures
- Subscription creation failed

**Solutions:**

1. **Check Stripe Configuration**
   ```bash
   # Verify Stripe keys
   echo $STRIPE_SECRET_KEY
   echo $NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   ```

2. **Test Stripe Connection**
   ```javascript
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   
   // Test Stripe connection
   stripe.balance.retrieve()
     .then(balance => console.log('Stripe connected:', balance))
     .catch(error => console.error('Stripe error:', error));
   ```

3. **Handle Payment Errors**
   ```javascript
   try {
     const payment = await stripe.paymentIntents.create({
       amount: 29900, // $299.00
       currency: 'usd',
       payment_method: paymentMethodId,
       confirmation_method: 'manual',
       confirm: true
     });
   } catch (error) {
     if (error.type === 'card_error') {
       console.error('Card error:', error.message);
     } else if (error.type === 'rate_limit_error') {
       console.error('Rate limit error:', error.message);
     } else {
       console.error('Other error:', error.message);
     }
   }
   ```

### **Problem: Webhook Verification Failed**

**Symptoms:**
- Webhook events not processed
- "Invalid signature" errors
- Subscription updates not reflected

**Solutions:**

1. **Verify Webhook Secret**
   ```bash
   echo $STRIPE_WEBHOOK_SECRET
   ```

2. **Test Webhook Endpoint**
   ```javascript
   app.post('/webhooks/stripe', (req, res) => {
     const sig = req.headers['stripe-signature'];
     const payload = req.body;
     
     try {
       const event = stripe.webhooks.constructEvent(
         payload,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET
       );
       
       // Handle event
       handleStripeEvent(event);
       
       res.json({ received: true });
     } catch (error) {
       console.error('Webhook signature verification failed:', error.message);
       res.status(400).send('Webhook Error');
     }
   });
   ```

---

## 📊 **Performance Issues**

### **Problem: Slow Response Times**

**Symptoms:**
- High response times
- User complaints about slowness
- Timeout errors

**Solutions:**

1. **Implement Caching**
   ```javascript
   const Redis = require('redis');
   const client = Redis.createClient();
   
   async function getCachedResponse(key, fetchFn) {
     const cached = await client.get(key);
     if (cached) return JSON.parse(cached);
     
     const data = await fetchFn();
     await client.setex(key, 3600, JSON.stringify(data)); // 1 hour cache
     return data;
   }
   ```

2. **Optimize Database Queries**
   ```sql
   -- Add indexes for performance
   CREATE INDEX CONCURRENTLY idx_usage_logs_user_id_created_at 
   ON usage_logs(user_id, created_at);
   
   -- Use query optimization
   EXPLAIN ANALYZE SELECT * FROM usage_logs 
   WHERE user_id = 'uuid' AND created_at > '2025-01-01';
   ```

3. **Implement CDN**
   ```javascript
   // Serve static assets from CDN
   const cdnUrl = process.env.CDN_URL || 'https://cdn.metisai.tech';
   
   app.use('/static', express.static('public', {
     maxAge: '1y',
     setHeaders: (res, path) => {
       res.setHeader('Cache-Control', 'public, max-age=31536000');
     }
   }));
   ```

### **Problem: High Memory Usage**

**Symptoms:**
- Memory leaks
- High server resource usage
- Application crashes

**Solutions:**

1. **Monitor Memory Usage**
   ```javascript
   // Monitor memory usage
   setInterval(() => {
     const usage = process.memoryUsage();
     console.log('Memory usage:', {
       rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
       heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
       heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB'
     });
   }, 30000); // Every 30 seconds
   ```

2. **Implement Garbage Collection**
   ```javascript
   // Force garbage collection in development
   if (process.env.NODE_ENV === 'development') {
     setInterval(() => {
       if (global.gc) {
         global.gc();
       }
     }, 60000); // Every minute
   }
   ```

3. **Optimize Data Structures**
   ```javascript
   // Use efficient data structures
   const Map = require('collections/map');
   const cache = new Map();
   
   // Clean up old entries
   setInterval(() => {
     const now = Date.now();
     for (const [key, value] of cache.entries()) {
       if (now - value.timestamp > 3600000) { // 1 hour
         cache.delete(key);
       }
     }
   }, 300000); // Every 5 minutes
   ```

---

## 🔒 **Security Issues**

### **Problem: Security Vulnerabilities**

**Symptoms:**
- Security warnings
- Vulnerability reports
- Potential security breaches

**Solutions:**

1. **Run Security Audit**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Fix vulnerabilities
   npm audit fix
   
   # Check for outdated packages
   npm outdated
   ```

2. **Update Dependencies**
   ```bash
   # Update all dependencies
   npm update
   
   # Update specific packages
   npm install package@latest
   ```

3. **Implement Security Headers**
   ```javascript
   const helmet = require('helmet');
   
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         scriptSrc: ["'self'"],
         imgSrc: ["'self'", "data:", "https:"]
       }
     }
   }));
   ```

### **Problem: CORS Issues**

**Symptoms:**
- CORS errors in browser
- API calls blocked
- Cross-origin requests failing

**Solutions:**

1. **Configure CORS Properly**
   ```javascript
   const cors = require('cors');
   
   const corsOptions = {
     origin: function (origin, callback) {
       const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true,
     optionsSuccessStatus: 200
   };
   
   app.use(cors(corsOptions));
   ```

2. **Handle Preflight Requests**
   ```javascript
   app.options('*', cors(corsOptions));
   ```

---

## 🐛 **Debugging Tools**

### **Application Logging**

1. **Structured Logging**
   ```javascript
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

2. **Debug Mode**
   ```javascript
   // Enable debug mode
   if (process.env.DEBUG === 'true') {
     logger.level = 'debug';
   }
   ```

### **Performance Monitoring**

1. **Response Time Monitoring**
   ```javascript
   app.use((req, res, next) => {
     const start = Date.now();
     
     res.on('finish', () => {
       const duration = Date.now() - start;
       logger.info('Request completed', {
         method: req.method,
         url: req.url,
         status: res.statusCode,
         duration: duration
       });
     });
     
     next();
   });
   ```

2. **Error Tracking**
   ```javascript
   const Sentry = require('@sentry/node');
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV
   });
   
   app.use(Sentry.requestHandler());
   app.use(Sentry.errorHandler());
   ```

---

## 📞 **Getting Help**

### **Support Channels**

1. **Documentation**
   - [API Documentation](API_DOCUMENTATION.md)
   - [Developer Guide](DEVELOPER_GUIDE.md)
   - [User Guide](USER_GUIDE.md)

2. **Community Support**
   - GitHub Issues: https://github.com/metisai/platform/issues
   - Community Forum: https://community.metisai.tech
   - Stack Overflow: Tag `metisai`

3. **Direct Support**
   - Email: support@metisai.tech
   - Live Chat: Available 9 AM - 6 PM EST
   - Phone: +1 (555) 123-4567

### **Reporting Issues**

When reporting issues, please include:

1. **Environment Information**
   - Node.js version
   - Operating system
   - Browser version (if applicable)

2. **Error Details**
   - Complete error message
   - Stack trace
   - Steps to reproduce

3. **Configuration**
   - Environment variables (sanitized)
   - API key format (not the actual key)
   - Network configuration

---

## 📚 **Additional Resources**

- [API Documentation](API_DOCUMENTATION.md)
- [Developer Guide](DEVELOPER_GUIDE.md)
- [User Guide](USER_GUIDE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)

---

**Happy troubleshooting! 🔧**
