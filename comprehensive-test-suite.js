#!/usr/bin/env node

/**
 * MetisAI Comprehensive Test Suite
 * This script performs thorough testing of all platform components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class MetisAITestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest(testName, testFunction) {
    try {
      this.log(`Running test: ${testName}`);
      const result = await testFunction();
      this.results.tests.push({
        name: testName,
        status: 'passed',
        result
      });
      this.results.passed++;
      this.log(`✅ ${testName} - PASSED`, 'success');
      return result;
    } catch (error) {
      this.results.tests.push({
        name: testName,
        status: 'failed',
        error: error.message
      });
      this.results.failed++;
      this.log(`❌ ${testName} - FAILED: ${error.message}`, 'error');
      return null;
    }
  }

  async testFileStructure() {
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/components/MetisAILogo.tsx',
      'src/components/AuthHeader.tsx',
      'src/lib/supabase/client.ts',
      'src/lib/supabase/server.ts',
      'src/lib/quantum/QUBOCatalog.ts',
      'src/lib/pricing/DynamicPricing.ts',
      'src/lib/subscription/SubscriptionManager.ts',
      'src/lib/marketplace/QuantumMarketplace.ts',
      'src/lib/mcp/MachineContentProtocol.ts',
      'src/lib/qasc/QuantumAgenticSwarmCoding.ts',
      'src/lib/verification/MultiSourceVerification.ts',
      'src/lib/tor/TorIntegration.ts',
      'src/lib/web3/Web3Maximization.ts',
      'src/lib/token/FLYFOXKnowledgeToken.ts',
      'database-schema.sql'
    ];

    const missingFiles = [];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
    }

    return { totalFiles: requiredFiles.length, missingFiles: missingFiles.length };
  }

  async testDependencies() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      'typescript',
      '@types/node',
      '@types/react',
      '@types/react-dom',
      'tailwindcss',
      '@supabase/supabase-js',
      'python-shell'
    ];

    const missingDeps = [];
    for (const dep of requiredDeps) {
      if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
        missingDeps.push(dep);
      }
    }

    if (missingDeps.length > 0) {
      throw new Error(`Missing required dependencies: ${missingDeps.join(', ')}`);
    }

    return { totalDeps: requiredDeps.length, missingDeps: missingDeps.length };
  }

  async testTypeScriptCompilation() {
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      return { compilationSuccess: true };
    } catch (error) {
      throw new Error(`TypeScript compilation failed: ${error.message}`);
    }
  }

  async testNextJSBuild() {
    try {
      execSync('npm run build', { stdio: 'pipe' });
      return { buildSuccess: true };
    } catch (error) {
      throw new Error(`Next.js build failed: ${error.message}`);
    }
  }

  async testAPIEndpoints() {
    const apiEndpoints = [
      'src/app/api/quantum/qdllm/generate/route.ts',
      'src/app/api/quantum/qnlp/process/route.ts',
      'src/app/api/quantum/qtransform/generate/route.ts',
      'src/app/api/mcp/verify/route.ts',
      'src/app/api/qasc/code/route.ts',
      'src/app/api/fkt/stake/route.ts',
      'src/app/api/fkt/contribute/route.ts',
      'src/app/api/catalog/algorithms/route.ts',
      'src/app/api/catalog/automations/route.ts',
      'src/app/api/pricing/calculate/route.ts',
      'src/app/api/subscriptions/create/route.ts',
      'src/app/api/subscriptions/status/route.ts',
      'src/app/api/payments/process/route.ts',
      'src/app/api/marketplace/list/route.ts',
      'src/app/api/marketplace/purchase/route.ts'
    ];

    const missingEndpoints = [];
    for (const endpoint of apiEndpoints) {
      if (!fs.existsSync(endpoint)) {
        missingEndpoints.push(endpoint);
      }
    }

    if (missingEndpoints.length > 0) {
      throw new Error(`Missing API endpoints: ${missingEndpoints.join(', ')}`);
    }

    return { totalEndpoints: apiEndpoints.length, missingEndpoints: missingEndpoints.length };
  }

  async testQuantumComponents() {
    const quantumFiles = [
      'src/lib/quantum/qdllm.py',
      'src/lib/quantum/qnlp.py',
      'src/lib/quantum/qtransform.py',
      'src/lib/quantum/qdllm_interface.py',
      'src/lib/quantum/qnlp_interface.py',
      'src/lib/quantum/qtransform_interface.py'
    ];

    const missingFiles = [];
    for (const file of quantumFiles) {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing quantum components: ${missingFiles.join(', ')}`);
    }

    return { totalFiles: quantumFiles.length, missingFiles: missingFiles.length };
  }

  async testAuthenticationSystem() {
    const authFiles = [
      'src/pages/auth/signin.tsx',
      'src/pages/auth/signup.tsx',
      'src/pages/auth/reset-password.tsx',
      'src/contexts/AuthContext.tsx',
      'src/components/AuthHeader.tsx',
      'src/middleware.ts'
    ];

    const missingFiles = [];
    for (const file of authFiles) {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing authentication files: ${missingFiles.join(', ')}`);
    }

    return { totalFiles: authFiles.length, missingFiles: missingFiles.length };
  }

  async testMCPIntegration() {
    const mcpFiles = [
      'src/lib/mcp/MachineContentProtocol.ts',
      'src/lib/verification/MultiSourceVerification.ts',
      'src/lib/tor/TorIntegration.ts',
      'src/lib/web3/Web3Maximization.ts',
      'src/components/mcp/MCPDashboard.tsx'
    ];

    const missingFiles = [];
    for (const file of mcpFiles) {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing MCP integration files: ${missingFiles.join(', ')}`);
    }

    return { totalFiles: mcpFiles.length, missingFiles: missingFiles.length };
  }

  async testQASCIntegration() {
    const qascFiles = [
      'src/lib/qasc/QuantumAgenticSwarmCoding.ts',
      'src/lib/token/FLYFOXKnowledgeToken.ts',
      'src/components/qasc/QASCDashboard.tsx'
    ];

    const missingFiles = [];
    for (const file of qascFiles) {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing QASC integration files: ${missingFiles.join(', ')}`);
    }

    return { totalFiles: qascFiles.length, missingFiles: missingFiles.length };
  }

  async testPricingSystem() {
    const pricingFiles = [
      'src/lib/pricing/DynamicPricing.ts',
      'src/lib/subscription/SubscriptionManager.ts',
      'src/lib/marketplace/QuantumMarketplace.ts',
      'src/components/pricing/PremiumPricingDashboard.tsx'
    ];

    const missingFiles = [];
    for (const file of pricingFiles) {
      if (!fs.existsSync(file)) {
        missingFiles.push(file);
      }
    }

    if (missingFiles.length > 0) {
      throw new Error(`Missing pricing system files: ${missingFiles.join(', ')}`);
    }

    return { totalFiles: pricingFiles.length, missingFiles: missingFiles.length };
  }

  async testDatabaseSchema() {
    if (!fs.existsSync('database-schema.sql')) {
      throw new Error('Database schema file not found');
    }

    const schema = fs.readFileSync('database-schema.sql', 'utf8');
    const requiredTables = [
      'user_profiles',
      'qubo_algorithms',
      'qubo_automations',
      'subscriptions',
      'usage_records',
      'payments',
      'marketplace_items',
      'deployment_requests',
      'purchases',
      'mcp_verifications',
      'qasc_tasks',
      'fkt_staking',
      'fkt_contributions'
    ];

    const missingTables = [];
    for (const table of requiredTables) {
      if (!schema.includes(`CREATE TABLE.*${table}`)) {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      throw new Error(`Missing database tables: ${missingTables.join(', ')}`);
    }

    return { totalTables: requiredTables.length, missingTables: missingTables.length };
  }

  async testEnvironmentSetup() {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missingVars = [];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }

    if (missingVars.length > 0) {
      this.log(`⚠️ Missing environment variables: ${missingVars.join(', ')}`, 'warning');
      this.results.warnings++;
    }

    return { totalVars: requiredEnvVars.length, missingVars: missingVars.length };
  }

  async testPythonDependencies() {
    try {
      const requirements = fs.readFileSync('requirements.txt', 'utf8');
      const requiredDeps = ['dynex', 'python-shell'];
      
      const missingDeps = [];
      for (const dep of requiredDeps) {
        if (!requirements.includes(dep)) {
          missingDeps.push(dep);
        }
      }

      if (missingDeps.length > 0) {
        throw new Error(`Missing Python dependencies: ${missingDeps.join(', ')}`);
      }

      return { totalDeps: requiredDeps.length, missingDeps: missingDeps.length };
    } catch (error) {
      throw new Error(`Python dependencies test failed: ${error.message}`);
    }
  }

  async testDocumentation() {
    const docFiles = [
      'README.md',
      'SETUP.md',
      'DEPLOYMENT.md',
      'QUANTUM_SETUP.md',
      'API_DOCUMENTATION.md',
      'MCP_QASC_INTEGRATION.md',
      'FINAL_SETUP.md'
    ];

    const missingDocs = [];
    for (const doc of docFiles) {
      if (!fs.existsSync(doc)) {
        missingDocs.push(doc);
      }
    }

    if (missingDocs.length > 0) {
      throw new Error(`Missing documentation files: ${missingDocs.join(', ')}`);
    }

    return { totalDocs: docFiles.length, missingDocs: missingDocs.length };
  }

  async runAllTests() {
    this.log('🚀 Starting MetisAI Comprehensive Test Suite');
    this.log('=' * 50);

    // Core Platform Tests
    await this.runTest('File Structure', () => this.testFileStructure());
    await this.runTest('Dependencies', () => this.testDependencies());
    await this.runTest('TypeScript Compilation', () => this.testTypeScriptCompilation());
    await this.runTest('Next.js Build', () => this.testNextJSBuild());
    await this.runTest('API Endpoints', () => this.testAPIEndpoints());

    // Quantum Components Tests
    await this.runTest('Quantum Components', () => this.testQuantumComponents());
    await this.runTest('Python Dependencies', () => this.testPythonDependencies());

    // Authentication Tests
    await this.runTest('Authentication System', () => this.testAuthenticationSystem());

    // Integration Tests
    await this.runTest('MCP Integration', () => this.testMCPIntegration());
    await this.runTest('QASC Integration', () => this.testQASCIntegration());
    await this.runTest('Pricing System', () => this.testPricingSystem());

    // Database Tests
    await this.runTest('Database Schema', () => this.testDatabaseSchema());

    // Environment Tests
    await this.runTest('Environment Setup', () => this.testEnvironmentSetup());

    // Documentation Tests
    await this.runTest('Documentation', () => this.testDocumentation());

    this.generateReport();
  }

  generateReport() {
    const endTime = Date.now();
    const duration = (endTime - this.startTime) / 1000;

    this.log('=' * 50);
    this.log('📊 MetisAI Test Suite Report');
    this.log('=' * 50);
    this.log(`Total Tests: ${this.results.passed + this.results.failed}`);
    this.log(`✅ Passed: ${this.results.passed}`);
    this.log(`❌ Failed: ${this.results.failed}`);
    this.log(`⚠️ Warnings: ${this.results.warnings}`);
    this.log(`⏱️ Duration: ${duration.toFixed(2)}s`);
    this.log('=' * 50);

    if (this.results.failed > 0) {
      this.log('❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'failed')
        .forEach(test => {
          this.log(`  - ${test.name}: ${test.error}`);
        });
    }

    if (this.results.warnings > 0) {
      this.log('⚠️ Warnings:');
      this.log('  - Some environment variables may be missing');
      this.log('  - Check .env.local file configuration');
    }

    const successRate = (this.results.passed / (this.results.passed + this.results.failed)) * 100;
    this.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);

    if (successRate >= 90) {
      this.log('🎉 MetisAI Platform is ready for deployment!', 'success');
    } else if (successRate >= 70) {
      this.log('⚠️ MetisAI Platform needs some fixes before deployment', 'warning');
    } else {
      this.log('❌ MetisAI Platform requires significant fixes before deployment', 'error');
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      duration,
      results: this.results,
      successRate,
      status: successRate >= 90 ? 'ready' : successRate >= 70 ? 'needs_fixes' : 'requires_significant_fixes'
    };

    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    this.log('📄 Detailed report saved to test-report.json');
  }
}

// Run the test suite
if (require.main === module) {
  const testSuite = new MetisAITestSuite();
  testSuite.runAllTests().catch(console.error);
}

module.exports = MetisAITestSuite;
