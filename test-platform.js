#!/usr/bin/env node

/**
 * MetisAI Platform Test Script
 * Tests all components of the quantum-enhanced AI platform
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MetisAI Platform Test Suite');
console.log('================================\n');

// Test functions
function testNodeModules() {
  console.log('📦 Testing Node.js dependencies...');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      '@supabase/supabase-js',
      '@supabase/ssr',
      'next',
      'react',
      'react-dom',
      'python-shell'
    ];
    
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      console.log('❌ Missing dependencies:', missingDeps.join(', '));
      return false;
    }
    
    console.log('✅ All Node.js dependencies installed');
    return true;
  } catch (error) {
    console.log('❌ Error checking dependencies:', error.message);
    return false;
  }
}

function testPythonDependencies() {
  console.log('🐍 Testing Python dependencies...');
  try {
    execSync('python --version', { stdio: 'pipe' });
    console.log('✅ Python is available');
    
    // Check if requirements.txt exists
    if (fs.existsSync('requirements.txt')) {
      console.log('✅ requirements.txt found');
    } else {
      console.log('⚠️  requirements.txt not found');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Python not available:', error.message);
    return false;
  }
}

function testFileStructure() {
  console.log('📁 Testing file structure...');
  const requiredFiles = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/middleware.ts',
    'src/lib/supabase/client.ts',
    'src/lib/supabase/server.ts',
    'src/contexts/AuthContext.tsx',
    'src/components/MetisAILogo.tsx',
    'src/components/AuthHeader.tsx',
    'src/components/quantum/QuantumLLMInterface.tsx',
    'src/pages/auth/signin.tsx',
    'src/pages/auth/signup.tsx',
    'src/pages/auth/reset-password.tsx',
    'src/lib/quantum/qdllm.py',
    'src/lib/quantum/qnlp.py',
    'src/lib/quantum/qtransform.py'
  ];
  
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.log('❌ Missing files:', missingFiles.join(', '));
    return false;
  }
  
  console.log('✅ All required files present');
  return true;
}

function testEnvironmentSetup() {
  console.log('🔧 Testing environment setup...');
  
  if (fs.existsSync('.env.local')) {
    console.log('✅ .env.local found');
  } else {
    console.log('⚠️  .env.local not found - please create it with Supabase credentials');
  }
  
  if (fs.existsSync('.env.example')) {
    console.log('✅ .env.example found');
  } else {
    console.log('⚠️  .env.example not found');
  }
  
  return true;
}

function testBuildProcess() {
  console.log('🔨 Testing build process...');
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Build successful');
    return true;
  } catch (error) {
    console.log('❌ Build failed:', error.message);
    return false;
  }
}

function testQuantumModels() {
  console.log('🧠 Testing quantum models...');
  
  const quantumFiles = [
    'src/lib/quantum/qdllm.py',
    'src/lib/quantum/qnlp.py',
    'src/lib/quantum/qtransform.py',
    'src/lib/quantum/qdllm_interface.py',
    'src/lib/quantum/qnlp_interface.py',
    'src/lib/quantum/qtransform_interface.py'
  ];
  
  const missingFiles = quantumFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.log('❌ Missing quantum files:', missingFiles.join(', '));
    return false;
  }
  
  console.log('✅ All quantum model files present');
  return true;
}

function testAPIRoutes() {
  console.log('🌐 Testing API routes...');
  
  const apiFiles = [
    'src/app/api/quantum/qdllm/generate/route.ts',
    'src/app/api/quantum/qnlp/process/route.ts',
    'src/app/api/quantum/qtransform/generate/route.ts'
  ];
  
  const missingFiles = apiFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.log('❌ Missing API files:', missingFiles.join(', '));
    return false;
  }
  
  console.log('✅ All API routes present');
  return true;
}

// Run all tests
function runAllTests() {
  const tests = [
    testNodeModules,
    testPythonDependencies,
    testFileStructure,
    testEnvironmentSetup,
    testQuantumModels,
    testAPIRoutes,
    testBuildProcess
  ];
  
  let passed = 0;
  let total = tests.length;
  
  tests.forEach(test => {
    if (test()) {
      passed++;
    }
    console.log(''); // Add spacing
  });
  
  console.log('📊 Test Results');
  console.log('===============');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! MetisAI Platform is ready to go!');
    console.log('\nNext steps:');
    console.log('1. Configure Supabase credentials in .env.local');
    console.log('2. Run: npm run dev');
    console.log('3. Visit: http://localhost:3000');
    console.log('4. Test the quantum AI features!');
  } else {
    console.log('\n⚠️  Some tests failed. Please fix the issues above.');
  }
}

// Run the tests
runAllTests();
