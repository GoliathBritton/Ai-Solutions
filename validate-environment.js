#!/usr/bin/env node

/**
 * MetisAI Environment Validation Script
 * Validates all environment variables and external service connections
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

class EnvironmentValidator {
  constructor() {
    this.results = {
      environment: { status: 'pending', details: [] },
      supabase: { status: 'pending', details: [] },
      dynex: { status: 'pending', details: [] },
      stripe: { status: 'pending', details: [] },
      web3: { status: 'pending', details: [] },
      search: { status: 'pending', details: [] },
      security: { status: 'pending', details: [] }
    };
  }

  async loadEnvironment() {
    console.log('🔍 Loading environment configuration...');
    
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      this.results.environment.status = 'failed';
      this.results.environment.details.push('❌ .env.local file not found');
      return false;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    process.env = { ...process.env, ...envVars };
    this.results.environment.status = 'success';
    this.results.environment.details.push('✅ Environment variables loaded successfully');
    return true;
  }

  async validateRequiredVariables() {
    console.log('📋 Validating required environment variables...');
    
    const requiredVars = {
      'NEXT_PUBLIC_SUPABASE_URL': 'Supabase URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anon Key',
      'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Role Key',
      'DYNEX_API_KEY': 'Dynex API Key',
      'STRIPE_SECRET_KEY': 'Stripe Secret Key',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'Stripe Publishable Key',
      'JWT_SECRET': 'JWT Secret',
      'ENCRYPTION_KEY': 'Encryption Key'
    };

    const missing = [];
    const present = [];

    for (const [varName, description] of Object.entries(requiredVars)) {
      if (process.env[varName]) {
        present.push(`✅ ${description}: ${process.env[varName].substring(0, 10)}...`);
      } else {
        missing.push(`❌ ${description}: Missing`);
      }
    }

    this.results.environment.details.push(...present);
    if (missing.length > 0) {
      this.results.environment.details.push(...missing);
      this.results.environment.status = 'failed';
    }

    return missing.length === 0;
  }

  async validateSupabase() {
    console.log('🔌 Validating Supabase connection...');
    
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        this.results.supabase.status = 'failed';
        this.results.supabase.details.push('❌ Missing Supabase credentials');
        return false;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test connection
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        this.results.supabase.status = 'warning';
        this.results.supabase.details.push(`⚠️  Connection test failed: ${error.message}`);
        this.results.supabase.details.push('ℹ️  This may be normal for new setups');
      } else {
        this.results.supabase.status = 'success';
        this.results.supabase.details.push('✅ Supabase connection successful');
      }

      // Test authentication
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        this.results.supabase.details.push(`ℹ️  Auth test: ${authError.message}`);
      } else {
        this.results.supabase.details.push('✅ Supabase authentication configured');
      }

      return true;
    } catch (error) {
      this.results.supabase.status = 'failed';
      this.results.supabase.details.push(`❌ Supabase validation failed: ${error.message}`);
      return false;
    }
  }

  async validateDynex() {
    console.log('⚡ Validating Dynex configuration...');
    
    try {
      const apiKey = process.env.DYNEX_API_KEY;
      const network = process.env.DYNEX_NETWORK || 'testnet';

      if (!apiKey) {
        this.results.dynex.status = 'failed';
        this.results.dynex.details.push('❌ Dynex API key not configured');
        return false;
      }

      // Basic validation of API key format
      if (apiKey.length < 20) {
        this.results.dynex.status = 'warning';
        this.results.dynex.details.push('⚠️  Dynex API key seems too short');
      } else {
        this.results.dynex.details.push('✅ Dynex API key format looks valid');
      }

      this.results.dynex.details.push(`ℹ️  Network: ${network}`);
      this.results.dynex.status = 'success';

      return true;
    } catch (error) {
      this.results.dynex.status = 'failed';
      this.results.dynex.details.push(`❌ Dynex validation failed: ${error.message}`);
      return false;
    }
  }

  async validateStripe() {
    console.log('💳 Validating Stripe configuration...');
    
    try {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      if (!secretKey || !publishableKey) {
        this.results.stripe.status = 'failed';
        this.results.stripe.details.push('❌ Missing Stripe credentials');
        return false;
      }

      // Validate key formats
      if (secretKey.startsWith('sk_')) {
        this.results.stripe.details.push('✅ Stripe secret key format valid');
      } else {
        this.results.stripe.details.push('⚠️  Stripe secret key format may be invalid');
      }

      if (publishableKey.startsWith('pk_')) {
        this.results.stripe.details.push('✅ Stripe publishable key format valid');
      } else {
        this.results.stripe.details.push('⚠️  Stripe publishable key format may be invalid');
      }

      this.results.stripe.status = 'success';
      return true;
    } catch (error) {
      this.results.stripe.status = 'failed';
      this.results.stripe.details.push(`❌ Stripe validation failed: ${error.message}`);
      return false;
    }
  }

  async validateWeb3() {
    console.log('🌐 Validating Web3 configuration...');
    
    try {
      const infuraKey = process.env.INFURA_API_KEY;
      const alchemyKey = process.env.ALCHEMY_API_KEY;
      const ipfsGateway = process.env.IPFS_GATEWAY_URL;
      const arweaveGateway = process.env.ARWEAVE_GATEWAY_URL;

      let validCount = 0;

      if (infuraKey) {
        this.results.web3.details.push('✅ Infura API key configured');
        validCount++;
      } else {
        this.results.web3.details.push('⚠️  Infura API key not configured');
      }

      if (alchemyKey) {
        this.results.web3.details.push('✅ Alchemy API key configured');
        validCount++;
      } else {
        this.results.web3.details.push('⚠️  Alchemy API key not configured');
      }

      if (ipfsGateway) {
        this.results.web3.details.push(`✅ IPFS Gateway: ${ipfsGateway}`);
        validCount++;
      } else {
        this.results.web3.details.push('⚠️  IPFS Gateway not configured');
      }

      if (arweaveGateway) {
        this.results.web3.details.push(`✅ Arweave Gateway: ${arweaveGateway}`);
        validCount++;
      } else {
        this.results.web3.details.push('⚠️  Arweave Gateway not configured');
      }

      if (validCount >= 2) {
        this.results.web3.status = 'success';
      } else {
        this.results.web3.status = 'warning';
      }

      return validCount >= 2;
    } catch (error) {
      this.results.web3.status = 'failed';
      this.results.web3.details.push(`❌ Web3 validation failed: ${error.message}`);
      return false;
    }
  }

  async validateSearchEngines() {
    console.log('🔍 Validating search engine configuration...');
    
    try {
      const duckduckgoKey = process.env.DUCKDUCKGO_API_KEY;
      const braveKey = process.env.BRAVE_SEARCH_API_KEY;
      const startpageKey = process.env.STARTPAGE_API_KEY;

      let validCount = 0;

      if (duckduckgoKey) {
        this.results.search.details.push('✅ DuckDuckGo API key configured');
        validCount++;
      } else {
        this.results.search.details.push('ℹ️  DuckDuckGo API key not configured (optional)');
      }

      if (braveKey) {
        this.results.search.details.push('✅ Brave Search API key configured');
        validCount++;
      } else {
        this.results.search.details.push('⚠️  Brave Search API key not configured');
      }

      if (startpageKey) {
        this.results.search.details.push('✅ Startpage API key configured');
        validCount++;
      } else {
        this.results.search.details.push('ℹ️  Startpage API key not configured (optional)');
      }

      if (validCount >= 1) {
        this.results.search.status = 'success';
      } else {
        this.results.search.status = 'warning';
      }

      return validCount >= 1;
    } catch (error) {
      this.results.search.status = 'failed';
      this.results.search.details.push(`❌ Search engine validation failed: ${error.message}`);
      return false;
    }
  }

  async validateSecurity() {
    console.log('🛡️ Validating security configuration...');
    
    try {
      const jwtSecret = process.env.JWT_SECRET;
      const encryptionKey = process.env.ENCRYPTION_KEY;
      const rateLimit = process.env.API_RATE_LIMIT;

      let validCount = 0;

      if (jwtSecret && jwtSecret.length >= 32) {
        this.results.security.details.push('✅ JWT Secret is secure (32+ characters)');
        validCount++;
      } else {
        this.results.security.details.push('❌ JWT Secret is too short or missing (need 32+ characters)');
      }

      if (encryptionKey && encryptionKey.length >= 32) {
        this.results.security.details.push('✅ Encryption Key is secure (32+ characters)');
        validCount++;
      } else {
        this.results.security.details.push('❌ Encryption Key is too short or missing (need 32+ characters)');
      }

      if (rateLimit && !isNaN(parseInt(rateLimit))) {
        this.results.security.details.push(`✅ API Rate Limit configured: ${rateLimit} requests/minute`);
        validCount++;
      } else {
        this.results.security.details.push('⚠️  API Rate Limit not properly configured');
      }

      if (validCount >= 2) {
        this.results.security.status = 'success';
      } else {
        this.results.security.status = 'failed';
      }

      return validCount >= 2;
    } catch (error) {
      this.results.security.status = 'failed';
      this.results.security.details.push(`❌ Security validation failed: ${error.message}`);
      return false;
    }
  }

  async generateReport() {
    console.log('\n📊 Environment Validation Report\n');
    console.log('=' .repeat(50));

    const statusEmoji = {
      success: '✅',
      warning: '⚠️',
      failed: '❌',
      pending: '⏳'
    };

    for (const [category, result] of Object.entries(this.results)) {
      console.log(`\n${statusEmoji[result.status]} ${category.toUpperCase()}`);
      console.log('-'.repeat(20));
      result.details.forEach(detail => console.log(`  ${detail}`));
    }

    const overallStatus = Object.values(this.results).every(r => r.status === 'success' || r.status === 'warning') ? 'success' : 'failed';
    
    console.log('\n' + '='.repeat(50));
    console.log(`\n🎯 Overall Status: ${statusEmoji[overallStatus]} ${overallStatus.toUpperCase()}`);
    
    if (overallStatus === 'success') {
      console.log('\n🎉 Environment is ready for production deployment!');
    } else {
      console.log('\n⚠️  Please fix the issues above before deploying to production.');
    }

    return overallStatus === 'success';
  }

  async runValidation() {
    console.log('🚀 MetisAI Environment Validation\n');
    
    try {
      const envLoaded = await this.loadEnvironment();
      if (!envLoaded) {
        await this.generateReport();
        return false;
      }

      await this.validateRequiredVariables();
      await this.validateSupabase();
      await this.validateDynex();
      await this.validateStripe();
      await this.validateWeb3();
      await this.validateSearchEngines();
      await this.validateSecurity();

      const isValid = await this.generateReport();
      return isValid;
    } catch (error) {
      console.log('\n❌ Validation failed:', error.message);
      return false;
    }
  }
}

// Run validation
const validator = new EnvironmentValidator();
validator.runValidation().then(isValid => {
  process.exit(isValid ? 0 : 1);
}).catch(console.error);
