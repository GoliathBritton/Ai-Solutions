/**
 * Insurance Leads Import Script
 * Specialized import for Insurance industry
 */

const RealEstateLeadImporter = require('./import-real-estate-leads.js');

class InsuranceLeadImporter extends RealEstateLeadImporter {
  constructor() {
    super();
    this.industry = 'Insurance';
    this.personaId = 'alex-marketing';
    this.campaigns = [
  "Insurance AI Solutions",
  "Claims Processing AI",
  "Insurance Analytics"
];
  }

  // Override industry-specific methods
  estimateBudget(data) {
    // Insurance-specific budget estimation
    return this.getIndustryBudget(data);
  }

  getIndustryBudget(data) {
    // Implement Insurance specific budget logic
    return '$15,000+'; // Default for Insurance
  }

  calculateLeadScore(data, mapping) {
    // Insurance-specific lead scoring
    return super.calculateLeadScore(data, mapping);
  }
}

// Export for use in other scripts
module.exports = InsuranceLeadImporter;
