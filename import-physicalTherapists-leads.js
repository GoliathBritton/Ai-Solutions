/**
 * Physical Therapists Leads Import Script
 * Specialized import for Physical Therapists industry
 */

const RealEstateLeadImporter = require('./import-real-estate-leads.js');

class PhysicalTherapistsLeadImporter extends RealEstateLeadImporter {
  constructor() {
    super();
    this.industry = 'Physical Therapists';
    this.personaId = 'david-support';
    this.campaigns = [
  "PT Practice Management",
  "PT Patient Care AI",
  "PT Billing Solutions"
];
  }

  // Override industry-specific methods
  estimateBudget(data) {
    // Physical Therapists-specific budget estimation
    return this.getIndustryBudget(data);
  }

  getIndustryBudget(data) {
    // Implement Physical Therapists specific budget logic
    return '$15,000+'; // Default for Physical Therapists
  }

  calculateLeadScore(data, mapping) {
    // Physical Therapists-specific lead scoring
    return super.calculateLeadScore(data, mapping);
  }
}

// Export for use in other scripts
module.exports = PhysicalTherapistsLeadImporter;
