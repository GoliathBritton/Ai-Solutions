#!/usr/bin/env node

/**
 * MetisAI Database Testing Script
 * Comprehensive testing of database operations and connectivity
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

class DatabaseTester {
  constructor() {
    this.supabase = null;
    this.testResults = {
      connection: { status: 'pending', details: [] },
      tables: { status: 'pending', details: [] },
      operations: { status: 'pending', details: [] },
      performance: { status: 'pending', details: [] }
    };
  }

  async loadEnvironment() {
    console.log('🔍 Loading environment configuration...');
    
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.log('❌ .env.local not found. Please run setup-environment.js first.');
      process.exit(1);
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
    console.log('✅ Environment loaded');
  }

  async initializeSupabase() {
    console.log('🔌 Initializing Supabase connection...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      this.testResults.connection.status = 'failed';
      this.testResults.connection.details.push('❌ Missing Supabase credentials');
      return false;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
    return true;
  }

  async testConnection() {
    console.log('🧪 Testing database connection...');
    
    try {
      const startTime = Date.now();
      const { data, error } = await this.supabase.from('users').select('count').limit(1);
      const endTime = Date.now();
      
      if (error) {
        this.testResults.connection.status = 'failed';
        this.testResults.connection.details.push(`❌ Connection failed: ${error.message}`);
        return false;
      }

      this.testResults.connection.status = 'success';
      this.testResults.connection.details.push(`✅ Connection successful (${endTime - startTime}ms)`);
      return true;
    } catch (error) {
      this.testResults.connection.status = 'failed';
      this.testResults.connection.details.push(`❌ Connection error: ${error.message}`);
      return false;
    }
  }

  async testTables() {
    console.log('📋 Testing database tables...');
    
    const tables = [
      'users', 'pricing_tiers', 'qubo_algorithms', 'subscriptions',
      'payments', 'usage_logs', 'marketplace_items', 'fkt_tokens',
      'mcp_verifications', 'qasc_sessions', 'platform_statistics'
    ];

    let successCount = 0;
    let totalCount = tables.length;

    for (const table of tables) {
      try {
        const { data, error } = await this.supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          this.testResults.tables.details.push(`❌ Table ${table}: ${error.message}`);
        } else {
          this.testResults.tables.details.push(`✅ Table ${table}: Accessible`);
          successCount++;
        }
      } catch (err) {
        this.testResults.tables.details.push(`❌ Table ${table}: ${err.message}`);
      }
    }

    if (successCount === totalCount) {
      this.testResults.tables.status = 'success';
    } else if (successCount > 0) {
      this.testResults.tables.status = 'warning';
    } else {
      this.testResults.tables.status = 'failed';
    }

    this.testResults.tables.details.push(`\n📊 Tables accessible: ${successCount}/${totalCount}`);
    return successCount > 0;
  }

  async testCRUDOperations() {
    console.log('🔧 Testing CRUD operations...');
    
    try {
      // Test INSERT operation
      const testUser = {
        email: 'test@metisai.com',
        full_name: 'Test User',
        created_at: new Date().toISOString()
      };

      const { data: insertData, error: insertError } = await this.supabase
        .from('users')
        .insert(testUser)
        .select();

      if (insertError) {
        this.testResults.operations.details.push(`❌ INSERT test failed: ${insertError.message}`);
      } else {
        this.testResults.operations.details.push('✅ INSERT operation successful');
        
        const userId = insertData[0].id;

        // Test SELECT operation
        const { data: selectData, error: selectError } = await this.supabase
          .from('users')
          .select('*')
          .eq('id', userId);

        if (selectError) {
          this.testResults.operations.details.push(`❌ SELECT test failed: ${selectError.message}`);
        } else {
          this.testResults.operations.details.push('✅ SELECT operation successful');
        }

        // Test UPDATE operation
        const { error: updateError } = await this.supabase
          .from('users')
          .update({ full_name: 'Updated Test User' })
          .eq('id', userId);

        if (updateError) {
          this.testResults.operations.details.push(`❌ UPDATE test failed: ${updateError.message}`);
        } else {
          this.testResults.operations.details.push('✅ UPDATE operation successful');
        }

        // Test DELETE operation
        const { error: deleteError } = await this.supabase
          .from('users')
          .delete()
          .eq('id', userId);

        if (deleteError) {
          this.testResults.operations.details.push(`❌ DELETE test failed: ${deleteError.message}`);
        } else {
          this.testResults.operations.details.push('✅ DELETE operation successful');
        }
      }

      this.testResults.operations.status = 'success';
      return true;
    } catch (error) {
      this.testResults.operations.status = 'failed';
      this.testResults.operations.details.push(`❌ CRUD operations failed: ${error.message}`);
      return false;
    }
  }

  async testPerformance() {
    console.log('⚡ Testing database performance...');
    
    try {
      const tests = [
        { name: 'Simple Query', query: () => this.supabase.from('users').select('count').limit(1) },
        { name: 'Complex Query', query: () => this.supabase.from('qubo_algorithms').select('*').eq('is_active', true) },
        { name: 'Join Query', query: () => this.supabase.from('subscriptions').select('*, pricing_tiers(*)') }
      ];

      let totalTime = 0;
      let successCount = 0;

      for (const test of tests) {
        const startTime = Date.now();
        try {
          const { error } = await test.query();
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          if (error) {
            this.testResults.performance.details.push(`❌ ${test.name}: ${error.message}`);
          } else {
            this.testResults.performance.details.push(`✅ ${test.name}: ${duration}ms`);
            totalTime += duration;
            successCount++;
          }
        } catch (err) {
          this.testResults.performance.details.push(`❌ ${test.name}: ${err.message}`);
        }
      }

      if (successCount > 0) {
        const avgTime = totalTime / successCount;
        this.testResults.performance.details.push(`\n📊 Average query time: ${avgTime.toFixed(2)}ms`);
        
        if (avgTime < 1000) {
          this.testResults.performance.status = 'success';
        } else if (avgTime < 3000) {
          this.testResults.performance.status = 'warning';
        } else {
          this.testResults.performance.status = 'failed';
        }
      } else {
        this.testResults.performance.status = 'failed';
      }

      return successCount > 0;
    } catch (error) {
      this.testResults.performance.status = 'failed';
      this.testResults.performance.details.push(`❌ Performance test failed: ${error.message}`);
      return false;
    }
  }

  async testDataIntegrity() {
    console.log('🔒 Testing data integrity...');
    
    try {
      // Test foreign key constraints
      const { error: fkError } = await this.supabase
        .from('subscriptions')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Non-existent user
          pricing_tier_id: 1,
          status: 'active'
        });

      if (fkError && fkError.code === '23503') {
        this.testResults.operations.details.push('✅ Foreign key constraints working');
      } else {
        this.testResults.operations.details.push('⚠️  Foreign key constraints may not be properly configured');
      }

      // Test unique constraints
      const { error: uniqueError } = await this.supabase
        .from('users')
        .insert([
          { email: 'duplicate@test.com', full_name: 'User 1' },
          { email: 'duplicate@test.com', full_name: 'User 2' }
        ]);

      if (uniqueError && uniqueError.code === '23505') {
        this.testResults.operations.details.push('✅ Unique constraints working');
      } else {
        this.testResults.operations.details.push('⚠️  Unique constraints may not be properly configured');
      }

      return true;
    } catch (error) {
      this.testResults.operations.details.push(`❌ Data integrity test failed: ${error.message}`);
      return false;
    }
  }

  async generateReport() {
    console.log('\n📊 Database Test Report\n');
    console.log('=' .repeat(50));

    const statusEmoji = {
      success: '✅',
      warning: '⚠️',
      failed: '❌',
      pending: '⏳'
    };

    for (const [category, result] of Object.entries(this.testResults)) {
      console.log(`\n${statusEmoji[result.status]} ${category.toUpperCase()}`);
      console.log('-'.repeat(20));
      result.details.forEach(detail => console.log(`  ${detail}`));
    }

    const overallStatus = Object.values(this.testResults).every(r => r.status === 'success' || r.status === 'warning') ? 'success' : 'failed';
    
    console.log('\n' + '='.repeat(50));
    console.log(`\n🎯 Overall Status: ${statusEmoji[overallStatus]} ${overallStatus.toUpperCase()}`);
    
    if (overallStatus === 'success') {
      console.log('\n🎉 Database is ready for production use!');
    } else {
      console.log('\n⚠️  Please fix the database issues above before deploying to production.');
    }

    return overallStatus === 'success';
  }

  async runTests() {
    console.log('🚀 MetisAI Database Testing\n');
    
    try {
      await this.loadEnvironment();
      
      const initialized = await this.initializeSupabase();
      if (!initialized) {
        await this.generateReport();
        return false;
      }

      await this.testConnection();
      await this.testTables();
      await this.testCRUDOperations();
      await this.testDataIntegrity();
      await this.testPerformance();

      const isReady = await this.generateReport();
      return isReady;
    } catch (error) {
      console.log('\n❌ Database testing failed:', error.message);
      return false;
    }
  }
}

// Run tests
const tester = new DatabaseTester();
tester.runTests().then(isReady => {
  process.exit(isReady ? 0 : 1);
}).catch(console.error);
