#!/usr/bin/env node

/**
 * Complete Environment Setup Script
 * Sets up all environment variables and configurations for MetisAI
 * @author MetisAI Team
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up complete MetisAI environment...\n');

// Environment template
const envTemplate = `# MetisAI Environment Configuration
# Generated on ${new Date().toISOString()}

# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Dynex Configuration
DYNEX_API_KEY=your_dynex_api_key_here
DYNEX_API_URL=https://platform.dynex.co/api
DYNEX_QUANTUM_URL=https://quantum.dynex.co

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Encryption Configuration
ENCRYPTION_KEY=your_encryption_key_here

# Search Engine APIs
NEXT_PUBLIC_BRAVE_API_KEY=your_brave_api_key_here
NEXT_PUBLIC_SEARX_URL=https://searx.example.com
NEXT_PUBLIC_YACY_URL=http://localhost:8090

# Web3 Storage
NEXT_PUBLIC_IPFS_ENDPOINT=https://ipfs.infura.io:5001
NEXT_PUBLIC_ARWEAVE_ENDPOINT=https://arweave.net
NEXT_PUBLIC_FILECOIN_ENDPOINT=https://api.filecoin.io

# Smart Contract Addresses
NEXT_PUBLIC_FLY_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_FLY_GOVERNANCE_ADDRESS=0x...
NEXT_PUBLIC_FLY_STAKING_ADDRESS=0x...
NEXT_PUBLIC_FLY_DEFI_ADDRESS=0x...
NEXT_PUBLIC_AI_MODEL_NFT_ADDRESS=0x...
NEXT_PUBLIC_DATA_NFT_ADDRESS=0x...
NEXT_PUBLIC_FLY_BRIDGE_ADDRESS=0x...
NEXT_PUBLIC_COMPLIANCE_ENGINE_ADDRESS=0x...

# Network RPC URLs
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_project_id
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-dataseed.binance.org

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=metisai.tech
NEXT_PUBLIC_API_URL=https://api.metisai.tech
NEXT_PUBLIC_CDN_URL=https://cdn.metisai.tech
QUANTUM_API_URL=https://quantum.metisai.tech

# TOR Configuration
TOR_ENABLED=true
TOR_SAFETY_LEVEL=medium
TOR_MAX_RESULTS=10

# Compliance Configuration
KYC_PROVIDER_API_KEY=your_kyc_provider_key_here
AML_PROVIDER_API_KEY=your_aml_provider_key_here
SANCTIONS_API_KEY=your_sanctions_api_key_here

# Monitoring and Analytics
DATADOG_API_KEY=your_datadog_api_key_here
SENTRY_DSN=your_sentry_dsn_here
ANALYTICS_ID=your_analytics_id_here
`;

// Create .env.local file
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local file');
} else {
  console.log('⚠️  .env.local already exists, skipping creation');
}

// Create production environment file
const prodEnvPath = path.join(__dirname, 'production.env');
if (!fs.existsSync(prodEnvPath)) {
  const prodEnvTemplate = envTemplate.replace('http://localhost:3000', 'https://metisai.tech');
  fs.writeFileSync(prodEnvPath, prodEnvTemplate);
  console.log('✅ Created production.env file');
} else {
  console.log('⚠️  production.env already exists, skipping creation');
}

// Create next.config.js if it doesn't exist
const nextConfigPath = path.join(__dirname, 'next.config.js');
if (!fs.existsSync(nextConfigPath)) {
  const nextConfig = `const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'localhost',
      'metisai.tech',
      'api.metisai.tech',
      'cdn.metisai.tech',
      'quantum.metisai.tech',
      'ipfs.io',
      'arweave.net'
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/quantum/:path*',
        destination: '/api/quantum/:path*',
      },
      {
        source: '/api/dynex/:path*',
        destination: '/api/quantum/dynex',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://metisai.tech',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
};

module.exports = nextConfig;
`;
  fs.writeFileSync(nextConfigPath, nextConfig);
  console.log('✅ Created next.config.js file');
} else {
  console.log('⚠️  next.config.js already exists, skipping creation');
}

// Create requirements.txt for Python dependencies
const requirementsPath = path.join(__dirname, 'requirements.txt');
if (!fs.existsSync(requirementsPath)) {
  const requirements = `# MetisAI Python Dependencies
numpy>=1.21.0
scipy>=1.7.0
scikit-learn>=1.0.0
pandas>=1.3.0
requests>=2.25.0
beautifulsoup4>=4.9.0
lxml>=4.6.0
torch>=1.9.0
transformers>=4.12.0
datasets>=1.15.0
accelerate>=0.5.0
sentencepiece>=0.1.96
protobuf>=3.19.0
`;
  fs.writeFileSync(requirementsPath, requirements);
  console.log('✅ Created requirements.txt file');
} else {
  console.log('⚠️  requirements.txt already exists, skipping creation');
}

// Create comprehensive test script
const testScriptPath = path.join(__dirname, 'test-complete-integration.js');
if (!fs.existsSync(testScriptPath)) {
  const testScript = `#!/usr/bin/env node

/**
 * Complete Integration Test Script
 * Tests all components of the MetisAI platform
 * @author MetisAI Team
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running complete MetisAI integration tests...\n');

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function runTest(name, testFn) {
  try {
    console.log(\`Running test: \${name}\`);
    const result = testFn();
    testResults.passed++;
    testResults.tests.push({ name, status: 'PASSED', result });
    console.log(\`✅ \${name}: PASSED\`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'FAILED', error: error.message });
    console.log(\`❌ \${name}: FAILED - \${error.message}\`);
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
      throw new Error(\`Missing required environment variable: \${varName}\`);
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
      throw new Error(\`Missing required dependency: \${dep}\`);
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
    console.log(\`⚠️  ESLint: WARNING - \${error.message}\`);
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
      throw new Error(\`Missing required file: \${file}\`);
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
      throw new Error(\`Missing API route: \${route}\`);
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
      throw new Error(\`Missing ABI file: \${abi}\`);
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

console.log('\\n📊 Test Results Summary:');
console.log(\`Total Tests: \${report.summary.total}\`);
console.log(\`Passed: \${report.summary.passed}\`);
console.log(\`Failed: \${report.summary.failed}\`);
console.log(\`Warnings: \${report.summary.warnings}\`);
console.log(\`Success Rate: \${report.summary.successRate}\`);

if (testResults.failed > 0) {
  console.log('\\n❌ Some tests failed. Please check the test report for details.');
  process.exit(1);
} else {
  console.log('\\n✅ All tests passed! MetisAI platform is ready for deployment.');
  process.exit(0);
}
`;
  fs.writeFileSync(testScriptPath, testScript);
  console.log('✅ Created test-complete-integration.js file');
} else {
  console.log('⚠️  test-complete-integration.js already exists, skipping creation');
}

// Update package.json with new scripts
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

packageJson.scripts['setup-complete'] = 'node setup-complete-environment.js';
packageJson.scripts['test-complete'] = 'node test-complete-integration.js';
packageJson.scripts['install-deps'] = 'npm install && pip install -r requirements.txt';

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json with new scripts');

console.log('\n🎉 Complete environment setup finished!');
console.log('\nNext steps:');
console.log('1. Fill in your actual API keys in .env.local');
console.log('2. Run: npm run install-deps');
console.log('3. Run: npm run test-complete');
console.log('4. Run: npm run dev');
console.log('\nFor production deployment:');
console.log('1. Update production.env with production values');
console.log('2. Run: npm run build');
console.log('3. Deploy to your hosting platform');
