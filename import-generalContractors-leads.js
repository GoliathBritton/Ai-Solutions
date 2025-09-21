/**
 * General Contractors Leads Import Script
 * Specialized import for General Contractors industry
 */

const RealEstateLeadImporter = require('./import-real-estate-leads.js');

class GeneralContractorsLeadImporter extends RealEstateLeadImporter {
  constructor() {
    super();
    this.industry = 'General Contractors';
    this.personaId = 'marcus-technical';
    this.campaigns = [
  "GC Enterprise Solutions",
  "GC Project Management",
  "GC Construction Tech"
];
  }

  // Override industry-specific methods
  estimateBudget(data) {
    // General Contractors-specific budget estimation
    return this.getIndustryBudget(data);
  }

  getIndustryBudget(data) {
    // Implement General Contractors specific budget logic
    return '$15,000+'; // Default for General Contractors
  }

  calculateLeadScore(data, mapping) {
    // General Contractors-specific lead scoring
    return super.calculateLeadScore(data, mapping);
  }
}

// Export for use in other scripts
module.exports = GeneralContractorsLeadImporter;
