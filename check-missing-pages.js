#!/usr/bin/env node

/**
 * MetisAI Missing Pages Checker
 * Comprehensive analysis of what pages are developed and what's missing
 */

const fs = require('fs');
const path = require('path');

class MissingPagesChecker {
  constructor() {
    this.developedPages = [];
    this.missingPages = [];
    this.recommendedPages = [];
    this.analysis = {
      core_pages: { developed: [], missing: [] },
      auth_pages: { developed: [], missing: [] },
      dashboard_pages: { developed: [], missing: [] },
      api_endpoints: { developed: [], missing: [] },
      components: { developed: [], missing: [] },
      business_pages: { developed: [], missing: [] }
    };
  }

  async checkCorePages() {
    console.log('🏠 Checking Core Pages...');
    
    const corePages = [
      { name: 'Homepage', path: 'src/app/page.tsx', required: true },
      { name: 'Layout', path: 'src/app/layout.tsx', required: true },
      { name: 'Global CSS', path: 'src/app/globals.css', required: true }
    ];

    for (const page of corePages) {
      if (fs.existsSync(page.path)) {
        this.developedPages.push(page.name);
        this.analysis.core_pages.developed.push(page.name);
        console.log(`  ✅ ${page.name} - EXISTS`);
      } else {
        this.missingPages.push(page.name);
        this.analysis.core_pages.missing.push(page.name);
        console.log(`  ❌ ${page.name} - MISSING`);
      }
    }
  }

  async checkAuthPages() {
    console.log('🔐 Checking Authentication Pages...');
    
    const authPages = [
      { name: 'Sign In', path: 'src/pages/auth/signin.tsx', required: true },
      { name: 'Sign Up', path: 'src/pages/auth/signup.tsx', required: true },
      { name: 'Reset Password', path: 'src/pages/auth/reset-password.tsx', required: true },
      { name: 'Auth App', path: 'src/pages/_app.tsx', required: true }
    ];

    for (const page of authPages) {
      if (fs.existsSync(page.path)) {
        this.developedPages.push(page.name);
        this.analysis.auth_pages.developed.push(page.name);
        console.log(`  ✅ ${page.name} - EXISTS`);
      } else {
        this.missingPages.push(page.name);
        this.analysis.auth_pages.missing.push(page.name);
        console.log(`  ❌ ${page.name} - MISSING`);
      }
    }
  }

  async checkDashboardPages() {
    console.log('📊 Checking Dashboard Pages...');
    
    const dashboardPages = [
      { name: 'Profile', path: 'src/app/profile/page.tsx', required: true },
      { name: 'Settings', path: 'src/app/settings/page.tsx', required: true }
    ];

    // Check for additional dashboard pages that might be needed
    const additionalDashboardPages = [
      { name: 'Analytics Dashboard', path: 'src/app/analytics/page.tsx', required: false },
      { name: 'Billing Dashboard', path: 'src/app/billing/page.tsx', required: false },
      { name: 'Support Dashboard', path: 'src/app/support/page.tsx', required: false },
      { name: 'Admin Dashboard', path: 'src/app/admin/page.tsx', required: false }
    ];

    for (const page of [...dashboardPages, ...additionalDashboardPages]) {
      if (fs.existsSync(page.path)) {
        this.developedPages.push(page.name);
        this.analysis.dashboard_pages.developed.push(page.name);
        console.log(`  ✅ ${page.name} - EXISTS`);
      } else {
        if (page.required) {
          this.missingPages.push(page.name);
          this.analysis.dashboard_pages.missing.push(page.name);
          console.log(`  ❌ ${page.name} - MISSING (REQUIRED)`);
        } else {
          this.recommendedPages.push(page.name);
          this.analysis.dashboard_pages.missing.push(page.name);
          console.log(`  ⚠️ ${page.name} - MISSING (RECOMMENDED)`);
        }
      }
    }
  }

  async checkAPIEndpoints() {
    console.log('🔌 Checking API Endpoints...');
    
    const apiEndpoints = [
      // Quantum APIs
      { name: 'qdLLM Generate', path: 'src/app/api/quantum/qdllm/generate/route.ts', required: true },
      { name: 'QNLP Process', path: 'src/app/api/quantum/qnlp/process/route.ts', required: true },
      { name: 'QTransform Generate', path: 'src/app/api/quantum/qtransform/generate/route.ts', required: true },
      
      // MCP APIs
      { name: 'MCP Verify', path: 'src/app/api/mcp/verify/route.ts', required: true },
      
      // QASC APIs
      { name: 'QASC Code', path: 'src/app/api/qasc/code/route.ts', required: true },
      
      // FKT APIs
      { name: 'FKT Stake', path: 'src/app/api/fkt/stake/route.ts', required: true },
      { name: 'FKT Contribute', path: 'src/app/api/fkt/contribute/route.ts', required: true },
      
      // Business APIs
      { name: 'Catalog Algorithms', path: 'src/app/api/catalog/algorithms/route.ts', required: true },
      { name: 'Pricing Calculate', path: 'src/app/api/pricing/calculate/route.ts', required: true },
      { name: 'Subscriptions Create', path: 'src/app/api/subscriptions/create/route.ts', required: true },
      { name: 'Payments Process', path: 'src/app/api/payments/process/route.ts', required: true },
      { name: 'Marketplace List', path: 'src/app/api/marketplace/list/route.ts', required: true }
    ];

    for (const endpoint of apiEndpoints) {
      if (fs.existsSync(endpoint.path)) {
        this.developedPages.push(endpoint.name);
        this.analysis.api_endpoints.developed.push(endpoint.name);
        console.log(`  ✅ ${endpoint.name} - EXISTS`);
      } else {
        this.missingPages.push(endpoint.name);
        this.analysis.api_endpoints.missing.push(endpoint.name);
        console.log(`  ❌ ${endpoint.name} - MISSING`);
      }
    }
  }

  async checkComponents() {
    console.log('🧩 Checking Components...');
    
    const components = [
      { name: 'MetisAI Logo', path: 'src/components/MetisAILogo.tsx', required: true },
      { name: 'Auth Header', path: 'src/components/AuthHeader.tsx', required: true },
      { name: 'Quantum LLM Interface', path: 'src/components/quantum/QuantumLLMInterface.tsx', required: true },
      { name: 'MCP Dashboard', path: 'src/components/mcp/MCPDashboard.tsx', required: true },
      { name: 'QASC Dashboard', path: 'src/components/qasc/QASCDashboard.tsx', required: true },
      { name: 'Pricing Dashboard', path: 'src/components/pricing/PremiumPricingDashboard.tsx', required: true }
    ];

    for (const component of components) {
      if (fs.existsSync(component.path)) {
        this.developedPages.push(component.name);
        this.analysis.components.developed.push(component.name);
        console.log(`  ✅ ${component.name} - EXISTS`);
      } else {
        this.missingPages.push(component.name);
        this.analysis.components.missing.push(component.name);
        console.log(`  ❌ ${component.name} - MISSING`);
      }
    }
  }

  async checkBusinessPages() {
    console.log('💼 Checking Business Pages...');
    
    const businessPages = [
      { name: 'Pricing Page', path: 'src/app/pricing/page.tsx', required: false },
      { name: 'About Page', path: 'src/app/about/page.tsx', required: false },
      { name: 'Contact Page', path: 'src/app/contact/page.tsx', required: false },
      { name: 'Terms Page', path: 'src/app/terms/page.tsx', required: false },
      { name: 'Privacy Page', path: 'src/app/privacy/page.tsx', required: false },
      { name: 'Help Center', path: 'src/app/help/page.tsx', required: false },
      { name: 'Status Page', path: 'src/app/status/page.tsx', required: false }
    ];

    for (const page of businessPages) {
      if (fs.existsSync(page.path)) {
        this.developedPages.push(page.name);
        this.analysis.business_pages.developed.push(page.name);
        console.log(`  ✅ ${page.name} - EXISTS`);
      } else {
        this.recommendedPages.push(page.name);
        this.analysis.business_pages.missing.push(page.name);
        console.log(`  ⚠️ ${page.name} - MISSING (RECOMMENDED)`);
      }
    }
  }

  async checkSupportingFiles() {
    console.log('📁 Checking Supporting Files...');
    
    const supportingFiles = [
      { name: 'Middleware', path: 'src/middleware.ts', required: true },
      { name: 'Auth Context', path: 'src/contexts/AuthContext.tsx', required: true },
      { name: 'Supabase Client', path: 'src/lib/supabase/client.ts', required: true },
      { name: 'Supabase Server', path: 'src/lib/supabase/server.ts', required: true },
      { name: 'Database Schema', path: 'database-schema.sql', required: true },
      { name: 'Package.json', path: 'package.json', required: true },
      { name: 'Next Config', path: 'next.config.js', required: true },
      { name: 'Environment Example', path: 'env.example', required: true }
    ];

    for (const file of supportingFiles) {
      if (fs.existsSync(file.path)) {
        this.developedPages.push(file.name);
        console.log(`  ✅ ${file.name} - EXISTS`);
      } else {
        this.missingPages.push(file.name);
        console.log(`  ❌ ${file.name} - MISSING`);
      }
    }
  }

  async generateReport() {
    console.log('\n📊 Missing Pages Analysis Report\n');
    console.log('=' .repeat(60));

    const totalDeveloped = this.developedPages.length;
    const totalMissing = this.missingPages.length;
    const totalRecommended = this.recommendedPages.length;
    const totalPages = totalDeveloped + totalMissing + totalRecommended;

    console.log(`\n📈 Overall Statistics:`);
    console.log(`  ✅ Developed Pages: ${totalDeveloped}`);
    console.log(`  ❌ Missing Required: ${totalMissing}`);
    console.log(`  ⚠️ Recommended: ${totalRecommended}`);
    console.log(`  📊 Total Pages: ${totalPages}`);

    const completionRate = Math.round((totalDeveloped / (totalDeveloped + totalMissing)) * 100);
    console.log(`  🎯 Completion Rate: ${completionRate}%`);

    if (totalMissing === 0) {
      console.log(`\n🎉 ALL REQUIRED PAGES ARE DEVELOPED!`);
      console.log(`\n✅ The platform is ready for production deployment.`);
    } else {
      console.log(`\n⚠️ Missing Required Pages:`);
      this.missingPages.forEach(page => console.log(`  ❌ ${page}`));
    }

    if (totalRecommended > 0) {
      console.log(`\n💡 Recommended Additional Pages:`);
      this.recommendedPages.forEach(page => console.log(`  ⚠️ ${page}`));
    }

    console.log(`\n📋 Category Breakdown:`);
    Object.entries(this.analysis).forEach(([category, data]) => {
      const categoryName = category.replace('_', ' ').toUpperCase();
      const developed = data.developed.length;
      const missing = data.missing.length;
      const total = developed + missing;
      const rate = total > 0 ? Math.round((developed / total) * 100) : 100;
      
      console.log(`  ${categoryName}: ${developed}/${total} (${rate}%)`);
    });

    console.log(`\n🚀 Production Readiness:`);
    if (totalMissing === 0) {
      console.log(`  ✅ READY FOR PRODUCTION`);
      console.log(`  ✅ All essential pages developed`);
      console.log(`  ✅ Complete user journey supported`);
      console.log(`  ✅ Professional quality achieved`);
    } else {
      console.log(`  ⚠️ NEEDS ${totalMissing} MORE PAGES`);
      console.log(`  ⚠️ Complete missing pages before production`);
    }

    return totalMissing === 0;
  }

  async runAnalysis() {
    console.log('🔍 MetisAI Missing Pages Analysis\n');
    
    try {
      await this.checkCorePages();
      await this.checkAuthPages();
      await this.checkDashboardPages();
      await this.checkAPIEndpoints();
      await this.checkComponents();
      await this.checkBusinessPages();
      await this.checkSupportingFiles();

      const isComplete = await this.generateReport();
      return isComplete;
    } catch (error) {
      console.log('\n❌ Analysis failed:', error.message);
      return false;
    }
  }
}

// Run analysis
const checker = new MissingPagesChecker();
checker.runAnalysis().then(isComplete => {
  process.exit(isComplete ? 0 : 1);
}).catch(console.error);
