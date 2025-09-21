/**
 * Real Estate Leads Import Script
 * Specialized script to import and optimize your real estate CSV for MetisAI AI Sales System
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class RealEstateLeadImporter {
  constructor() {
    this.csvPath = "C:\\Users\\johnb\\OneDrive\\Goliath of All Trade - Software\\Cynosure AI\\B2B Leads\\real estate\\Real Estate Commercial ver1.csv";
    this.leads = [];
    this.errors = [];
    this.stats = {
      total: 0,
      imported: 0,
      errors: 0,
      byIndustry: {},
      byCompanySize: {},
      byLocation: {}
    };
  }

  /**
   * Analyze CSV structure and preview data
   */
  async analyzeCSV() {
    console.log('🔍 Analyzing Real Estate CSV structure...');
    
    return new Promise((resolve, reject) => {
      const headers = [];
      const sampleRows = [];
      let rowCount = 0;

      fs.createReadStream(this.csvPath)
        .pipe(csv())
        .on('headers', (headerList) => {
          headers.push(...headerList);
          console.log('📋 CSV Headers detected:');
          headers.forEach((header, index) => {
            console.log(`  ${index + 1}. ${header}`);
          });
        })
        .on('data', (row) => {
          rowCount++;
          if (sampleRows.length < 5) {
            sampleRows.push(row);
          }
        })
        .on('end', () => {
          this.stats.total = rowCount;
          console.log(`\n📊 CSV Analysis Results:`);
          console.log(`  Total rows: ${rowCount}`);
          console.log(`  Headers: ${headers.length}`);
          
          console.log('\n📝 Sample data (first 3 rows):');
          sampleRows.slice(0, 3).forEach((row, index) => {
            console.log(`\n  Row ${index + 1}:`);
            Object.entries(row).slice(0, 5).forEach(([key, value]) => {
              console.log(`    ${key}: ${value}`);
            });
          });

          resolve({
            headers,
            sampleRows,
            totalRows: rowCount
          });
        })
        .on('error', reject);
    });
  }

  /**
   * Generate optimal field mapping for real estate leads
   */
  generateFieldMapping(headers) {
    console.log('\n🗺️ Generating optimal field mapping...');
    
    const mapping = {};
    const headerLower = headers.map(h => h.toLowerCase());
    
    // Intelligent field mapping
    const fieldMappings = {
      name: ['name', 'contact', 'person', 'full name', 'contact person', 'representative'],
      company: ['company', 'business', 'firm', 'organization', 'corporation', 'agency'],
      email: ['email', 'e-mail', 'email address', 'contact email'],
      phone: ['phone', 'telephone', 'mobile', 'cell', 'contact phone', 'phone number'],
      title: ['title', 'position', 'role', 'job title', 'designation'],
      industry: ['industry', 'business type', 'sector', 'category'],
      location: ['address', 'location', 'city', 'state', 'zip', 'zip code', 'country'],
      website: ['website', 'web', 'url', 'domain', 'company website']
    };

    Object.entries(fieldMappings).forEach(([field, keywords]) => {
      const foundHeader = headers.find(header => 
        keywords.some(keyword => headerLower[headers.indexOf(header)].includes(keyword))
      );
      if (foundHeader) {
        mapping[field] = foundHeader;
        console.log(`  ✅ ${field} → ${foundHeader}`);
      } else {
        console.log(`  ⚠️ ${field} → Not found (will use default)`);
      }
    });

    return mapping;
  }

  /**
   * Process and clean lead data
   */
  processLeadData(rawData, mapping) {
    const lead = {
      id: this.generateLeadId(),
      name: this.extractField(rawData, mapping.name) || 'Unknown',
      company: this.extractField(rawData, mapping.company) || 'Unknown Company',
      industry: 'Real Estate', // Auto-set for this CSV
      title: this.extractField(rawData, mapping.title) || '',
      email: this.extractField(rawData, mapping.email) || '',
      phone: this.cleanPhoneNumber(this.extractField(rawData, mapping.phone) || ''),
      location: this.buildLocation(rawData, mapping),
      website: this.extractField(rawData, mapping.website) || '',
      painPoints: [],
      currentSolutions: [],
      budget: this.estimateBudget(rawData),
      timeline: '',
      decisionMakers: [],
      lastContact: new Date(),
      contactHistory: [],
      preferences: {
        preferredContactMethod: 'email',
        preferredTime: 'business-hours',
        timeZone: 'EST',
        communicationStyle: 'professional',
        interests: ['Real Estate AI Solutions', 'Property Management', 'Market Analysis']
      },
      // Real Estate specific fields
      realEstateData: {
        propertyTypes: this.extractPropertyTypes(rawData),
        marketFocus: this.extractMarketFocus(rawData),
        companySize: this.estimateCompanySize(this.extractField(rawData, mapping.company)),
        leadScore: this.calculateLeadScore(rawData, mapping)
      }
    };

    return lead;
  }

  /**
   * Extract field value with fallback
   */
  extractField(data, fieldName) {
    if (!fieldName) return null;
    return data[fieldName] || null;
  }

  /**
   * Clean and format phone number
   */
  cleanPhoneNumber(phone) {
    if (!phone) return '';
    return phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  /**
   * Build location string
   */
  buildLocation(data, mapping) {
    const parts = [];
    const city = this.extractField(data, mapping.location);
    const state = this.extractField(data, 'state') || this.extractField(data, 'State');
    const zip = this.extractField(data, 'zip') || this.extractField(data, 'Zip Code');
    
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (zip) parts.push(zip);
    
    return parts.join(', ');
  }

  /**
   * Estimate budget based on company indicators
   */
  estimateBudget(data) {
    const company = this.extractField(data, 'company') || '';
    const companyLower = company.toLowerCase();
    
    if (companyLower.includes('enterprise') || companyLower.includes('corporation') || companyLower.includes('international')) {
      return '$50,000+';
    } else if (companyLower.includes('group') || companyLower.includes('associates') || companyLower.includes('properties')) {
      return '$25,000+';
    } else {
      return '$10,000+';
    }
  }

  /**
   * Extract property types from data
   */
  extractPropertyTypes(data) {
    const company = this.extractField(data, 'company') || '';
    const companyLower = company.toLowerCase();
    
    const types = [];
    if (companyLower.includes('commercial')) types.push('Commercial');
    if (companyLower.includes('residential')) types.push('Residential');
    if (companyLower.includes('industrial')) types.push('Industrial');
    if (companyLower.includes('retail')) types.push('Retail');
    if (companyLower.includes('office')) types.push('Office');
    
    return types.length > 0 ? types : ['Commercial'];
  }

  /**
   * Extract market focus
   */
  extractMarketFocus(data) {
    const location = this.buildLocation(data, {});
    return location || 'National';
  }

  /**
   * Estimate company size
   */
  estimateCompanySize(companyName) {
    if (!companyName) return 'small';
    
    const name = companyName.toLowerCase();
    if (name.includes('enterprise') || name.includes('corporation') || name.includes('international') || name.includes('group')) {
      return 'large';
    } else if (name.includes('associates') || name.includes('partners') || name.includes('properties')) {
      return 'medium';
    }
    return 'small';
  }

  /**
   * Calculate lead score (0-100)
   */
  calculateLeadScore(data, mapping) {
    let score = 50; // Base score
    
    // Email present
    if (this.extractField(data, mapping.email)) score += 20;
    
    // Phone present
    if (this.extractField(data, mapping.phone)) score += 15;
    
    // Website present
    if (this.extractField(data, mapping.website)) score += 10;
    
    // Company size bonus
    const companySize = this.estimateCompanySize(this.extractField(data, mapping.company));
    if (companySize === 'large') score += 15;
    else if (companySize === 'medium') score += 10;
    
    // Title indicates decision maker
    const title = this.extractField(data, mapping.title) || '';
    const titleLower = title.toLowerCase();
    if (titleLower.includes('president') || titleLower.includes('ceo') || titleLower.includes('owner') || titleLower.includes('partner')) {
      score += 15;
    } else if (titleLower.includes('manager') || titleLower.includes('director')) {
      score += 10;
    }
    
    return Math.min(100, score);
  }

  /**
   * Import leads from CSV
   */
  async importLeads() {
    console.log('\n🚀 Starting Real Estate leads import...');
    
    const analysis = await this.analyzeCSV();
    const mapping = this.generateFieldMapping(analysis.headers);
    
    return new Promise((resolve, reject) => {
      const leads = [];
      let processed = 0;

      fs.createReadStream(this.csvPath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            const lead = this.processLeadData(row, mapping);
            leads.push(lead);
            processed++;
            
            if (processed % 1000 === 0) {
              console.log(`  Processed ${processed} leads...`);
            }
          } catch (error) {
            this.errors.push(`Row ${processed + 1}: ${error.message}`);
          }
        })
        .on('end', () => {
          this.leads = leads;
          this.stats.imported = leads.length;
          this.stats.errors = this.errors.length;
          
          this.generateStats(leads);
          this.generateCampaignRecommendations(leads);
          
          resolve({
            leads,
            stats: this.stats,
            errors: this.errors,
            mapping
          });
        })
        .on('error', reject);
    });
  }

  /**
   * Generate import statistics
   */
  generateStats(leads) {
    console.log('\n📊 Import Statistics:');
    console.log(`  Total processed: ${this.stats.total}`);
    console.log(`  Successfully imported: ${this.stats.imported}`);
    console.log(`  Errors: ${this.stats.errors}`);
    console.log(`  Success rate: ${((this.stats.imported / this.stats.total) * 100).toFixed(1)}%`);
    
    // Company size distribution
    const sizeDistribution = leads.reduce((acc, lead) => {
      const size = lead.realEstateData.companySize;
      acc[size] = (acc[size] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n🏢 Company Size Distribution:');
    Object.entries(sizeDistribution).forEach(([size, count]) => {
      console.log(`  ${size}: ${count} leads`);
    });
    
    // Lead score distribution
    const scoreDistribution = {
      'High (80-100)': leads.filter(l => l.realEstateData.leadScore >= 80).length,
      'Medium (60-79)': leads.filter(l => l.realEstateData.leadScore >= 60 && l.realEstateData.leadScore < 80).length,
      'Low (0-59)': leads.filter(l => l.realEstateData.leadScore < 60).length
    };
    
    console.log('\n⭐ Lead Score Distribution:');
    Object.entries(scoreDistribution).forEach(([range, count]) => {
      console.log(`  ${range}: ${count} leads`);
    });
  }

  /**
   * Generate campaign recommendations
   */
  generateCampaignRecommendations(leads) {
    console.log('\n🎯 Campaign Recommendations:');
    
    const highValueLeads = leads.filter(l => l.realEstateData.leadScore >= 80);
    const mediumLeads = leads.filter(l => l.realEstateData.leadScore >= 60 && l.realEstateData.leadScore < 80);
    const largeCompanies = leads.filter(l => l.realEstateData.companySize === 'large');
    
    console.log('\n📋 Recommended Campaigns:');
    
    if (highValueLeads.length > 0) {
      console.log(`\n1. "High-Value Real Estate" Campaign (${highValueLeads.length} leads)`);
      console.log('   - Persona: Sarah Chen (Enterprise Sales Director)');
      console.log('   - Approach: Direct phone calls + personalized emails');
      console.log('   - Focus: ROI demonstrations, enterprise features');
    }
    
    if (largeCompanies.length > 0) {
      console.log(`\n2. "Large Real Estate Companies" Campaign (${largeCompanies.length} leads)`);
      console.log('   - Persona: Marcus Rodriguez (Technical Solutions Architect)');
      console.log('   - Approach: Technical consultation + integration planning');
      console.log('   - Focus: Quantum AI capabilities, technical architecture');
    }
    
    if (mediumLeads.length > 0) {
      console.log(`\n3. "Medium Real Estate Prospects" Campaign (${mediumLeads.length} leads)`);
      console.log('   - Persona: Alex Thompson (Marketing & Growth Specialist)');
      console.log('   - Approach: Email sequences + LinkedIn outreach');
      console.log('   - Focus: Growth opportunities, competitive advantages');
    }
    
    console.log('\n🔄 Recommended Sequence:');
    console.log('   Day 1: Email introduction');
    console.log('   Day 3: Phone call attempt');
    console.log('   Day 5: LinkedIn connection');
    console.log('   Day 7: Follow-up email with case study');
    console.log('   Day 14: Final follow-up with demo offer');
  }

  /**
   * Export processed leads to JSON
   */
  exportLeads() {
    const exportData = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      leads: this.leads,
      errors: this.errors
    };
    
    const filename = `real-estate-leads-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    console.log(`\n💾 Exported processed leads to: ${filename}`);
    return filename;
  }

  /**
   * Generate unique lead ID
   */
  generateLeadId() {
    return `real_estate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Main execution
async function main() {
  console.log('🏢 MetisAI Real Estate Leads Import Tool');
  console.log('=====================================\n');
  
  const importer = new RealEstateLeadImporter();
  
  try {
    const result = await importer.importLeads();
    
    console.log('\n✅ Import completed successfully!');
    
    // Export results
    const exportFile = importer.exportLeads();
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Access your AI Sales Dashboard: https://metisai.tech/ai-sales');
    console.log('2. Upload the exported JSON file or use the CSV directly');
    console.log('3. Create campaigns based on the recommendations above');
    console.log('4. Launch AI-powered outreach with your personas');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  }
}

// Run the import
if (require.main === module) {
  main();
}

module.exports = RealEstateLeadImporter;
