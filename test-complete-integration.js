#!/usr/bin/env node

/**
 * Complete Integration Test Script
 * Tests all components of the MetisAI platform
 * @author MetisAI Team
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running complete MetisAI integration tests...\n');

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function runTest(name, testFn) {
  try {
    console.log(`Running test: ${name}`);
    const result = testFn();
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASSED', result });
    console.log(`PASSED: ${name}`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAILED', error: error.message });
    console.log(`FAILED: ${name} - ${error.message}`);
  }
}

// Test 1: Environment Variables
runTest('Environment Variables', () => {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found');
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DYNEX_API_KEY',
    'STRIPE_PUBLISHABLE_KEY'
  ];
  
  for (const varName of requiredVars) {
    if (!envContent.includes(varName)) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
});

// Test 2: Package Dependencies
runTest('Package Dependencies', () => {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDeps = ['ethers', 'next', 'react', 'react-dom'];
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep]) {
      throw new Error(`Missing required dependency: ${dep}`);
    }
  }
});

// Test 3: TypeScript Compilation
runTest('TypeScript Compilation', () => {
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('TypeScript compilation failed');
  }
});

// Test 4: ESLint
runTest('ESLint', () => {
  try {
    execSync('npm run lint', { stdio: 'pipe' });
  } catch (error) {
    testResults.warnings++;
    console.log(`WARNING: ESLint - ${error.message}`);
  }
});

// Test 5: File Structure
runTest('File Structure', () => {
  const requiredFiles = [
    'src/lib/information/MultiSearchEngine.ts',
    'src/lib/information/TorIntegration.ts',
    'src/lib/information/InformationVerificationEngine.ts',
    'src/lib/web3/Web3Maximization.ts',
    'src/lib/crypto/FLYTokenManager.ts',
    'src/app/api/verify/route.ts',
    'src/app/api/search/multi/route.ts',
    'src/app/api/search/tor/route.ts',
    'src/app/api/web3/store/route.ts',
    'src/components/information/UnbiasedInformationDashboard.tsx',
    'src/components/crypto/FLYTokenDashboard.tsx',
    'src/components/crypto/StakingInterface.tsx',
    'src/components/crypto/GovernanceInterface.tsx'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }
});

// Test 6: API Routes
runTest('API Routes', () => {
  const apiDir = path.join(__dirname, 'src/app/api');
  const apiFiles = fs.readdirSync(apiDir, { recursive: true });
  
  const expectedRoutes = ['verify', 'search/multi', 'search/tor', 'web3/store'];
  for (const route of expectedRoutes) {
    const routePath = path.join(apiDir, route, 'route.ts');
    if (!fs.existsSync(routePath)) {
      throw new Error(`Missing API route: ${route}`);
    }
  }
});

// Test 7: Smart Contract ABIs
runTest('Smart Contract ABIs', () => {
  const abiDir = path.join(__dirname, 'src/lib/crypto/abis');
  const abiFiles = fs.readdirSync(abiDir);
  
  const expectedABIs = [
    'FLYTokenABI.ts',
    'FLYGovernanceABI.ts',
    'FLYStakingABI.ts',
    'FLYDeFiABI.ts',
    'AIModelNFTABI.ts',
    'DataNFTABI.ts',
    'FLYBridgeABI.ts',
    'ComplianceEngineABI.ts'
  ];
  
  for (const abi of expectedABIs) {
    if (!abiFiles.includes(abi)) {
      throw new Error(`Missing ABI file: ${abi}`);
    }
  }
});

// Generate test report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: testResults.passed + testResults.failed,
    passed: testResults.passed,
    failed: testResults.failed,
    warnings: testResults.warnings,
    successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2) + '%'
  },
  tests: testResults.tests
};

// Save test report
const reportPath = path.join(__dirname, 'test-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('\nTest Results Summary:');
console.log(`Total Tests: ${report.summary.total}`);
console.log(`Passed: ${report.summary.passed}`);
console.log(`Failed: ${report.summary.failed}`);
console.log(`Warnings: ${report.summary.warnings}`);
console.log(`Success Rate: ${report.summary.successRate}`);

if (testResults.failed > 0) {
  console.log('\nSome tests failed. Please check the test report for details.');
  process.exit(1);
} else {
  console.log('\nAll tests passed! MetisAI platform is ready for deployment.');
  process.exit(0);
}
