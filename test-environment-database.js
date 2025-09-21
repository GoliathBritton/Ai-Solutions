#!/usr/bin/env node

/**
 * MetisAI Environment & Database Test Script
 * Comprehensive testing of environment and database setup
 */

const fs = require('fs');
const path = require('path');

class EnvironmentDatabaseTest {
  constructor() {
    this.results = {
      environment: { status: 'pending', details: [] },
      database: { status: 'pending', details: [] },
      scripts: { status: 'pending', details: [] },
      production: { status: 'pending', details: [] }
    };
  }

  async testEnvironmentFiles() {
    console.log('🔍 Testing environment files...');
    
    const envFiles = [
      '.env.local',
      'env.example',
      'database-config.json'
    ];

    let successCount = 0;
    for (const file of envFiles) {
      if (fs.existsSync(file)) {
        this.results.environment.details.push(`✅ ${file} exists`);
        successCount++;
      } else {
        this.results.environment.details.push(`❌ ${file} missing`);
      }
    }

    if (successCount === envFiles.length) {
      this.results.environment.status = 'success';
    } else {
      this.results.environment.status = 'warning';
    }

    return successCount > 0;
  }

  async testDatabaseFiles() {
    console.log('🗄️ Testing database files...');
    
    const dbFiles = [
      'database-schema.sql',
      'setup-database.js',
      'test-database.js'
    ];

    let successCount = 0;
    for (const file of dbFiles) {
      if (fs.existsSync(file)) {
        this.results.database.details.push(`✅ ${file} exists`);
        successCount++;
      } else {
        this.results.database.details.push(`❌ ${file} missing`);
      }
    }

    if (successCount === dbFiles.length) {
      this.results.database.status = 'success';
    } else {
      this.results.database.status = 'warning';
    }

    return successCount > 0;
  }

  async testSetupScripts() {
    console.log('🔧 Testing setup scripts...');
    
    const scripts = [
      'setup-environment.js',
      'setup-database.js',
      'validate-environment.js',
      'test-database.js'
    ];

    let successCount = 0;
    for (const script of scripts) {
      if (fs.existsSync(script)) {
        this.results.scripts.details.push(`✅ ${script} exists`);
        successCount++;
      } else {
        this.results.scripts.details.push(`❌ ${script} missing`);
      }
    }

    if (successCount === scripts.length) {
      this.results.scripts.status = 'success';
    } else {
      this.results.scripts.status = 'warning';
    }

    return successCount > 0;
  }

  async testProductionReadiness() {
    console.log('🚀 Testing production readiness...');
    
    const productionFiles = [
      'next.config.js',
      'package.json',
      'production-deploy.js',
      'comprehensive-test-suite.js'
    ];

    let successCount = 0;
    for (const file of productionFiles) {
      if (fs.existsSync(file)) {
        this.results.production.details.push(`✅ ${file} exists`);
        successCount++;
      } else {
        this.results.production.details.push(`❌ ${file} missing`);
      }
    }

    // Check package.json scripts
    if (fs.existsSync('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const requiredScripts = [
        'setup-env',
        'setup-db',
        'validate-env',
        'test-db',
        'setup-production'
      ];

      let scriptCount = 0;
      for (const script of requiredScripts) {
        if (packageJson.scripts[script]) {
          this.results.production.details.push(`✅ Script ${script} configured`);
          scriptCount++;
        } else {
          this.results.production.details.push(`❌ Script ${script} missing`);
        }
      }

      if (scriptCount === requiredScripts.length) {
        this.results.production.details.push('✅ All required scripts configured');
        successCount++;
      }
    }

    if (successCount >= 4) {
      this.results.production.status = 'success';
    } else {
      this.results.production.status = 'warning';
    }

    return successCount >= 4;
  }

  async testEnvironmentContent() {
    console.log('📋 Testing environment content...');
    
    if (fs.existsSync('.env.local')) {
      const envContent = fs.readFileSync('.env.local', 'utf8');
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

      let varCount = 0;
      for (const varName of requiredVars) {
        if (envContent.includes(varName)) {
          this.results.environment.details.push(`✅ ${varName} configured`);
          varCount++;
        } else {
          this.results.environment.details.push(`❌ ${varName} missing`);
        }
      }

      this.results.environment.details.push(`\n📊 Environment variables: ${varCount}/${requiredVars.length} configured`);
    }
  }

  async testDatabaseSchema() {
    console.log('📊 Testing database schema...');
    
    if (fs.existsSync('database-schema.sql')) {
      const schema = fs.readFileSync('database-schema.sql', 'utf8');
      const requiredTables = [
        'users',
        'pricing_tiers',
        'qubo_algorithms',
        'subscriptions',
        'payments',
        'usage_logs',
        'marketplace_items',
        'fkt_tokens'
      ];

      let tableCount = 0;
      for (const table of requiredTables) {
        if (schema.includes(`CREATE TABLE ${table}`) || schema.includes(`CREATE TABLE public.${table}`)) {
          this.results.database.details.push(`✅ Table ${table} defined`);
          tableCount++;
        } else {
          this.results.database.details.push(`❌ Table ${table} missing`);
        }
      }

      this.results.database.details.push(`\n📊 Database tables: ${tableCount}/${requiredTables.length} defined`);
    }
  }

  async generateReport() {
    console.log('\n📊 Environment & Database Test Report\n');
    console.log('=' .repeat(60));

    const statusEmoji = {
      success: '✅',
      warning: '⚠️',
      failed: '❌',
      pending: '⏳'
    };

    for (const [category, result] of Object.entries(this.results)) {
      console.log(`\n${statusEmoji[result.status]} ${category.toUpperCase()}`);
      console.log('-'.repeat(30));
      result.details.forEach(detail => console.log(`  ${detail}`));
    }

    const overallStatus = Object.values(this.results).every(r => r.status === 'success' || r.status === 'warning') ? 'success' : 'failed';
    
    console.log('\n' + '='.repeat(60));
    console.log(`\n🎯 Overall Status: ${statusEmoji[overallStatus]} ${overallStatus.toUpperCase()}`);
    
    if (overallStatus === 'success') {
      console.log('\n🎉 Environment and Database setup is complete!');
      console.log('\n📋 Next Steps:');
      console.log('1. Configure real environment variables in .env.local');
      console.log('2. Set up Supabase project and deploy schema');
      console.log('3. Configure external services (Dynex, Stripe, etc.)');
      console.log('4. Run: npm run validate-env');
      console.log('5. Run: npm run test-db');
      console.log('6. Deploy to production: node production-deploy.js');
    } else {
      console.log('\n⚠️  Please complete the setup before deploying to production.');
    }

    return overallStatus === 'success';
  }

  async runTests() {
    console.log('🚀 MetisAI Environment & Database Test\n');
    
    try {
      await this.testEnvironmentFiles();
      await this.testDatabaseFiles();
      await this.testSetupScripts();
      await this.testProductionReadiness();
      await this.testEnvironmentContent();
      await this.testDatabaseSchema();

      const isReady = await this.generateReport();
      return isReady;
    } catch (error) {
      console.log('\n❌ Testing failed:', error.message);
      return false;
    }
  }
}

// Run tests
const tester = new EnvironmentDatabaseTest();
tester.runTests().then(isReady => {
  process.exit(isReady ? 0 : 1);
}).catch(console.error);
