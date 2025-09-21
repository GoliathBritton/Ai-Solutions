#!/usr/bin/env node

/**
 * MetisAI Environment Configuration Setup
 * Automates the setup of environment variables and database configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class EnvironmentSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.envConfig = {};
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async setupEnvironment() {
    console.log('\n🚀 MetisAI Environment Configuration Setup\n');
    console.log('This script will help you configure all necessary environment variables for production deployment.\n');

    // Check if .env.local already exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const overwrite = await this.question('⚠️  .env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Setup cancelled.');
        this.rl.close();
        return;
      }
    }

    console.log('\n📋 Required Environment Variables:\n');

    // Supabase Configuration
    console.log('🔐 Supabase Configuration:');
    this.envConfig.NEXT_PUBLIC_SUPABASE_URL = await this.question('Enter Supabase URL: ');
    this.envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY = await this.question('Enter Supabase Anon Key: ');
    this.envConfig.SUPABASE_SERVICE_ROLE_KEY = await this.question('Enter Supabase Service Role Key: ');

    // Dynex Configuration
    console.log('\n⚡ Dynex Configuration:');
    this.envConfig.DYNEX_API_KEY = await this.question('Enter Dynex API Key: ');
    this.envConfig.DYNEX_NETWORK = await this.question('Enter Dynex Network (mainnet/testnet): ') || 'testnet';

    // Payment Processing
    console.log('\n💳 Payment Configuration:');
    this.envConfig.STRIPE_SECRET_KEY = await this.question('Enter Stripe Secret Key: ');
    this.envConfig.STRIPE_PUBLISHABLE_KEY = await this.question('Enter Stripe Publishable Key: ');
    this.envConfig.STRIPE_WEBHOOK_SECRET = await this.question('Enter Stripe Webhook Secret: ');

    // Web3 Configuration
    console.log('\n🌐 Web3 Configuration:');
    this.envConfig.INFURA_API_KEY = await this.question('Enter Infura API Key: ');
    this.envConfig.ALCHEMY_API_KEY = await this.question('Enter Alchemy API Key: ');
    this.envConfig.IPFS_GATEWAY_URL = await this.question('Enter IPFS Gateway URL: ') || 'https://ipfs.io/ipfs/';
    this.envConfig.ARWEAVE_GATEWAY_URL = await this.question('Enter Arweave Gateway URL: ') || 'https://arweave.net/';

    // TOR Configuration
    console.log('\n🔒 TOR Configuration:');
    this.envConfig.TOR_SOCKS_PORT = await this.question('Enter TOR SOCKS Port (default 9050): ') || '9050';
    this.envConfig.TOR_CONTROL_PORT = await this.question('Enter TOR Control Port (default 9051): ') || '9051';

    // Search Engine APIs
    console.log('\n🔍 Search Engine Configuration:');
    this.envConfig.DUCKDUCKGO_API_KEY = await this.question('Enter DuckDuckGo API Key (optional): ');
    this.envConfig.BRAVE_SEARCH_API_KEY = await this.question('Enter Brave Search API Key: ');
    this.envConfig.STARTPAGE_API_KEY = await this.question('Enter Startpage API Key (optional): ');

    // Security
    console.log('\n🛡️ Security Configuration:');
    this.envConfig.JWT_SECRET = await this.question('Enter JWT Secret (32+ characters): ');
    this.envConfig.ENCRYPTION_KEY = await this.question('Enter Encryption Key (32+ characters): ');
    this.envConfig.API_RATE_LIMIT = await this.question('Enter API Rate Limit (requests per minute): ') || '100';

    // Database
    console.log('\n🗄️ Database Configuration:');
    this.envConfig.DATABASE_URL = await this.question('Enter Database URL (if different from Supabase): ');
    this.envConfig.REDIS_URL = await this.question('Enter Redis URL (for caching): ');

    // Monitoring
    console.log('\n📊 Monitoring Configuration:');
    this.envConfig.SENTRY_DSN = await this.question('Enter Sentry DSN (optional): ');
    this.envConfig.ANALYTICS_ID = await this.question('Enter Analytics ID (optional): ');

    // Deployment
    console.log('\n🚀 Deployment Configuration:');
    this.envConfig.NODE_ENV = 'production';
    this.envConfig.NEXT_PUBLIC_APP_URL = await this.question('Enter App URL: ');
    this.envConfig.NEXT_PUBLIC_APP_NAME = 'MetisAI';
    this.envConfig.NEXT_PUBLIC_APP_DESCRIPTION = 'Quantum-Enhanced AI Platform';

    await this.generateEnvFile();
    await this.generateDatabaseConfig();
    await this.validateConfiguration();
  }

  async generateEnvFile() {
    console.log('\n📝 Generating .env.local file...');
    
    const envContent = `# MetisAI Environment Configuration
# Generated on ${new Date().toISOString()}

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${this.envConfig.NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${this.envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${this.envConfig.SUPABASE_SERVICE_ROLE_KEY}

# Dynex Configuration
DYNEX_API_KEY=${this.envConfig.DYNEX_API_KEY}
DYNEX_NETWORK=${this.envConfig.DYNEX_NETWORK}

# Payment Processing
STRIPE_SECRET_KEY=${this.envConfig.STRIPE_SECRET_KEY}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${this.envConfig.STRIPE_PUBLISHABLE_KEY}
STRIPE_WEBHOOK_SECRET=${this.envConfig.STRIPE_WEBHOOK_SECRET}

# Web3 Configuration
INFURA_API_KEY=${this.envConfig.INFURA_API_KEY}
ALCHEMY_API_KEY=${this.envConfig.ALCHEMY_API_KEY}
IPFS_GATEWAY_URL=${this.envConfig.IPFS_GATEWAY_URL}
ARWEAVE_GATEWAY_URL=${this.envConfig.ARWEAVE_GATEWAY_URL}

# TOR Configuration
TOR_SOCKS_PORT=${this.envConfig.TOR_SOCKS_PORT}
TOR_CONTROL_PORT=${this.envConfig.TOR_CONTROL_PORT}

# Search Engine APIs
DUCKDUCKGO_API_KEY=${this.envConfig.DUCKDUCKGO_API_KEY || ''}
BRAVE_SEARCH_API_KEY=${this.envConfig.BRAVE_SEARCH_API_KEY}
STARTPAGE_API_KEY=${this.envConfig.STARTPAGE_API_KEY || ''}

# Security
JWT_SECRET=${this.envConfig.JWT_SECRET}
ENCRYPTION_KEY=${this.envConfig.ENCRYPTION_KEY}
API_RATE_LIMIT=${this.envConfig.API_RATE_LIMIT}

# Database
DATABASE_URL=${this.envConfig.DATABASE_URL || ''}
REDIS_URL=${this.envConfig.REDIS_URL || ''}

# Monitoring
SENTRY_DSN=${this.envConfig.SENTRY_DSN || ''}
ANALYTICS_ID=${this.envConfig.ANALYTICS_ID || ''}

# Deployment
NODE_ENV=${this.envConfig.NODE_ENV}
NEXT_PUBLIC_APP_URL=${this.envConfig.NEXT_PUBLIC_APP_URL}
NEXT_PUBLIC_APP_NAME=${this.envConfig.NEXT_PUBLIC_APP_NAME}
NEXT_PUBLIC_APP_DESCRIPTION=${this.envConfig.NEXT_PUBLIC_APP_DESCRIPTION}
`;

    fs.writeFileSync('.env.local', envContent);
    console.log('✅ .env.local file created successfully');
  }

  async generateDatabaseConfig() {
    console.log('\n🗄️ Generating database configuration...');
    
    const dbConfig = {
      supabase: {
        url: this.envConfig.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: this.envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceRoleKey: this.envConfig.SUPABASE_SERVICE_ROLE_KEY
      },
      redis: {
        url: this.envConfig.REDIS_URL
      },
      connection: {
        pool: {
          min: 2,
          max: 10
        },
        timeout: 30000
      }
    };

    fs.writeFileSync('database-config.json', JSON.stringify(dbConfig, null, 2));
    console.log('✅ database-config.json created successfully');
  }

  async validateConfiguration() {
    console.log('\n🔍 Validating configuration...');
    
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'DYNEX_API_KEY',
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'JWT_SECRET',
      'ENCRYPTION_KEY'
    ];

    const missing = requiredVars.filter(varName => !this.envConfig[varName]);
    
    if (missing.length > 0) {
      console.log('❌ Missing required environment variables:');
      missing.forEach(varName => console.log(`   - ${varName}`));
      console.log('\n⚠️  Please run the setup again and provide all required values.');
    } else {
      console.log('✅ All required environment variables configured');
    }

    console.log('\n📋 Configuration Summary:');
    console.log(`   - Supabase URL: ${this.envConfig.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}`);
    console.log(`   - Dynex API: ${this.envConfig.DYNEX_API_KEY ? '✅' : '❌'}`);
    console.log(`   - Stripe: ${this.envConfig.STRIPE_SECRET_KEY ? '✅' : '❌'}`);
    console.log(`   - Web3: ${this.envConfig.INFURA_API_KEY ? '✅' : '❌'}`);
    console.log(`   - Security: ${this.envConfig.JWT_SECRET ? '✅' : '❌'}`);

    this.rl.close();
  }
}

// Run the setup
const setup = new EnvironmentSetup();
setup.setupEnvironment().catch(console.error);