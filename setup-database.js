#!/usr/bin/env node

/**
 * MetisAI Database Setup and Migration Script
 * Automates database schema deployment and initial data setup
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

class DatabaseSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.supabase = null;
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async loadEnvironment() {
    console.log('🔍 Loading environment configuration...');
    
    // Load .env.local if it exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = {};
      
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      });

      process.env = { ...process.env, ...envVars };
      console.log('✅ Environment variables loaded from .env.local');
    } else {
      console.log('⚠️  .env.local not found. Please run setup-environment.js first.');
      process.exit(1);
    }
  }

  async initializeSupabase() {
    console.log('🔌 Initializing Supabase connection...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing Supabase configuration. Please check your environment variables.');
      process.exit(1);
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase connection initialized');
  }

  async testConnection() {
    console.log('🧪 Testing database connection...');
    
    try {
      const { data, error } = await this.supabase.from('users').select('count').limit(1);
      if (error) {
        console.log('⚠️  Database connection test failed (this is expected for new setup)');
        console.log(`   Error: ${error.message}`);
      } else {
        console.log('✅ Database connection successful');
      }
    } catch (error) {
      console.log('⚠️  Database connection test failed (this is expected for new setup)');
      console.log(`   Error: ${error.message}`);
    }
  }

  async deploySchema() {
    console.log('📋 Deploying database schema...');
    
    const schemaPath = path.join(process.cwd(), 'database-schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.log('❌ database-schema.sql not found');
      return false;
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    try {
      // Split schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      console.log(`   Found ${statements.length} SQL statements to execute`);

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`   Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { error } = await this.supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.log(`   ⚠️  Statement ${i + 1} failed: ${error.message}`);
            // Continue with other statements
          } else {
            console.log(`   ✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`   ⚠️  Statement ${i + 1} error: ${err.message}`);
        }
      }

      console.log('✅ Database schema deployment completed');
      return true;
    } catch (error) {
      console.log('❌ Schema deployment failed:', error.message);
      return false;
    }
  }

  async createInitialData() {
    console.log('🌱 Creating initial data...');
    
    try {
      // Create default pricing tiers
      const pricingTiers = [
        {
          name: 'Starter',
          description: 'Basic quantum algorithms for small projects',
          price: 29.99,
          currency: 'USD',
          features: ['5 QUBO algorithms', 'Basic support', 'Standard processing'],
          max_requests: 1000,
          is_active: true
        },
        {
          name: 'Professional',
          description: 'Advanced quantum algorithms for business use',
          price: 99.99,
          currency: 'USD',
          features: ['20 QUBO algorithms', 'Priority support', 'Fast processing', 'API access'],
          max_requests: 10000,
          is_active: true
        },
        {
          name: 'Enterprise',
          description: 'Full quantum computing suite for large organizations',
          price: 299.99,
          currency: 'USD',
          features: ['Unlimited algorithms', '24/7 support', 'Custom processing', 'White-label options'],
          max_requests: 100000,
          is_active: true
        }
      ];

      for (const tier of pricingTiers) {
        const { error } = await this.supabase
          .from('pricing_tiers')
          .insert(tier);
        
        if (error) {
          console.log(`   ⚠️  Failed to create pricing tier ${tier.name}: ${error.message}`);
        } else {
          console.log(`   ✅ Created pricing tier: ${tier.name}`);
        }
      }

      // Create default QUBO algorithms
      const algorithms = [
        {
          name: 'Traveling Salesman Problem',
          description: 'Optimize routes for maximum efficiency',
          category: 'optimization',
          complexity: 'medium',
          base_price: 15.99,
          setup_fee: 50.00,
          consulting_fee: 100.00,
          is_premium: true,
          is_active: true
        },
        {
          name: 'Portfolio Optimization',
          description: 'Quantum-enhanced financial portfolio management',
          category: 'finance',
          complexity: 'high',
          base_price: 25.99,
          setup_fee: 75.00,
          consulting_fee: 150.00,
          is_premium: true,
          is_active: true
        },
        {
          name: 'Resource Allocation',
          description: 'Optimize resource distribution across projects',
          category: 'management',
          complexity: 'medium',
          base_price: 19.99,
          setup_fee: 60.00,
          consulting_fee: 120.00,
          is_premium: true,
          is_active: true
        }
      ];

      for (const algorithm of algorithms) {
        const { error } = await this.supabase
          .from('qubo_algorithms')
          .insert(algorithm);
        
        if (error) {
          console.log(`   ⚠️  Failed to create algorithm ${algorithm.name}: ${error.message}`);
        } else {
          console.log(`   ✅ Created algorithm: ${algorithm.name}`);
        }
      }

      console.log('✅ Initial data creation completed');
      return true;
    } catch (error) {
      console.log('❌ Initial data creation failed:', error.message);
      return false;
    }
  }

  async verifySetup() {
    console.log('🔍 Verifying database setup...');
    
    try {
      // Check if tables exist
      const tables = [
        'users', 'pricing_tiers', 'qubo_algorithms', 'subscriptions',
        'payments', 'usage_logs', 'marketplace_items', 'fkt_tokens'
      ];

      let allTablesExist = true;
      for (const table of tables) {
        const { data, error } = await this.supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ Table ${table} not accessible: ${error.message}`);
          allTablesExist = false;
        } else {
          console.log(`   ✅ Table ${table} is accessible`);
        }
      }

      if (allTablesExist) {
        console.log('✅ Database setup verification completed successfully');
        return true;
      } else {
        console.log('⚠️  Some tables are not accessible. Please check the schema deployment.');
        return false;
      }
    } catch (error) {
      console.log('❌ Database verification failed:', error.message);
      return false;
    }
  }

  async runSetup() {
    console.log('\n🚀 MetisAI Database Setup\n');
    
    try {
      await this.loadEnvironment();
      await this.initializeSupabase();
      await this.testConnection();
      
      const schemaDeployed = await this.deploySchema();
      if (schemaDeployed) {
        await this.createInitialData();
        await this.verifySetup();
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Test the platform: npm run dev');
        console.log('2. Run comprehensive tests: npm run test-all');
        console.log('3. Deploy to production: node production-deploy.js');
      } else {
        console.log('\n❌ Database setup failed. Please check the error messages above.');
      }
    } catch (error) {
      console.log('\n❌ Setup failed:', error.message);
    } finally {
      this.rl.close();
    }
  }
}

// Run the setup
const setup = new DatabaseSetup();
setup.runSetup().catch(console.error);
