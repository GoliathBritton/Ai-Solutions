/**
 * MetisAI Lead Management System
 * Comprehensive CRM for managing B2B leads with AI-powered automation
 */

import { LeadInfo, LeadPreferences } from '../ai-personas/ConversationalAI';

export interface LeadSource {
  id: string;
  name: string;
  type: 'csv' | 'api' | 'manual' | 'website' | 'social' | 'referral';
  filePath?: string;
  lastImported: Date;
  totalLeads: number;
  activeLeads: number;
}

export interface LeadStatus {
  status: 'new' | 'contacted' | 'qualified' | 'demo-scheduled' | 'proposal-sent' | 'negotiating' | 'closed-won' | 'closed-lost' | 'nurturing';
  lastUpdated: Date;
  updatedBy: string;
  notes: string;
  probability: number; // 0-100%
  estimatedValue: number;
  expectedCloseDate: Date;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'note';
  timestamp: Date;
  performedBy: string;
  description: string;
  outcome: string;
  nextAction?: string;
  scheduledFor?: Date;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'cold-outreach' | 'warm-nurture' | 'demo-sequence' | 'follow-up' | 'retention';
  status: 'active' | 'paused' | 'completed';
  targetCriteria: CampaignCriteria;
  personaId: string;
  sequence: CampaignStep[];
  startDate: Date;
  endDate?: Date;
  results: CampaignResults;
}

export interface CampaignCriteria {
  industries?: string[];
  companySizes?: string[];
  locations?: string[];
  titles?: string[];
  leadSources?: string[];
  status?: string[];
  tags?: string[];
}

export interface CampaignStep {
  id: string;
  stepNumber: number;
  type: 'call' | 'email' | 'linkedin' | 'wait';
  delay: number; // hours
  template: string;
  subject?: string;
  personalizedFields: string[];
}

export interface CampaignResults {
  totalSent: number;
  responses: number;
  meetings: number;
  demos: number;
  qualified: number;
  closed: number;
  responseRate: number;
  conversionRate: number;
}

export interface LeadSegment {
  id: string;
  name: string;
  criteria: CampaignCriteria;
  leadCount: number;
  lastUpdated: Date;
}

export class LeadManagementSystem {
  private leads: Map<string, LeadInfo> = new Map();
  private leadStatuses: Map<string, LeadStatus> = new Map();
  private leadActivities: Map<string, LeadActivity[]> = new Map();
  private campaigns: Map<string, Campaign> = new Map();
  private leadSources: Map<string, LeadSource> = new Map();
  private segments: Map<string, LeadSegment> = new Map();

  constructor() {
    this.initializeDefaultSegments();
  }

  /**
   * Import leads from CSV file
   */
  async importLeadsFromCSV(
    csvContent: string,
    sourceId: string,
    mapping: CSVMapping
  ): Promise<{ imported: number; errors: string[] }> {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const imported: LeadInfo[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = this.parseCSVLine(line);
        const leadInfo = this.createLeadFromCSVRow(headers, values, mapping, sourceId);
        
        if (this.validateLead(leadInfo)) {
          this.leads.set(leadInfo.id, leadInfo);
          this.leadStatuses.set(leadInfo.id, {
            status: 'new',
            lastUpdated: new Date(),
            updatedBy: 'system',
            notes: 'Imported from CSV',
            probability: 10,
            estimatedValue: this.estimateLeadValue(leadInfo),
            expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
          });
          this.leadActivities.set(leadInfo.id, []);
          imported.push(leadInfo);
        } else {
          errors.push(`Row ${i + 1}: Invalid lead data`);
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    // Update source statistics
    const source = this.leadSources.get(sourceId);
    if (source) {
      source.lastImported = new Date();
      source.totalLeads += imported.length;
      source.activeLeads += imported.length;
    }

    return { imported: imported.length, errors };
  }

  /**
   * Parse CSV line handling quoted fields
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Create lead from CSV row
   */
  private createLeadFromCSVRow(
    headers: string[],
    values: string[],
    mapping: CSVMapping,
    sourceId: string
  ): LeadInfo {
    const leadInfo: LeadInfo = {
      id: this.generateLeadId(),
      name: this.getValueByMapping(headers, values, mapping.name) || 'Unknown',
      company: this.getValueByMapping(headers, values, mapping.company) || 'Unknown Company',
      industry: this.getValueByMapping(headers, values, mapping.industry) || 'Real Estate',
      title: this.getValueByMapping(headers, values, mapping.title) || '',
      email: this.getValueByMapping(headers, values, mapping.email) || '',
      phone: this.getValueByMapping(headers, values, mapping.phone) || '',
      location: this.getValueByMapping(headers, values, mapping.location) || '',
      painPoints: [],
      currentSolutions: [],
      budget: '',
      timeline: '',
      decisionMakers: [],
      lastContact: new Date(),
      contactHistory: [],
      preferences: {
        preferredContactMethod: 'email',
        preferredTime: 'business-hours',
        timeZone: 'EST',
        communicationStyle: 'professional',
        interests: []
      }
    };

    return leadInfo;
  }

  /**
   * Get value by mapping
   */
  private getValueByMapping(
    headers: string[],
    values: string[],
    mappingField?: string
  ): string | undefined {
    if (!mappingField) return undefined;
    
    const index = headers.findIndex(h => 
      h.toLowerCase().includes(mappingField.toLowerCase())
    );
    
    return index >= 0 ? values[index] : undefined;
  }

  /**
   * Validate lead information
   */
  private validateLead(lead: LeadInfo): boolean {
    return !!(lead.name && lead.company && (lead.email || lead.phone));
  }

  /**
   * Estimate lead value based on industry and company info
   */
  private estimateLeadValue(lead: LeadInfo): number {
    const baseValue = 10000; // Base value for real estate
    
    // Adjust based on company size indicators
    const companySize = this.estimateCompanySize(lead.company);
    const sizeMultiplier = companySize === 'large' ? 3 : companySize === 'medium' ? 2 : 1;
    
    return baseValue * sizeMultiplier;
  }

  /**
   * Estimate company size
   */
  private estimateCompanySize(companyName: string): 'small' | 'medium' | 'large' {
    const largeIndicators = ['group', 'enterprises', 'corporation', 'holdings', 'international'];
    const mediumIndicators = ['associates', 'partners', 'properties', 'realty'];
    
    const lowerName = companyName.toLowerCase();
    
    if (largeIndicators.some(indicator => lowerName.includes(indicator))) {
      return 'large';
    } else if (mediumIndicators.some(indicator => lowerName.includes(indicator))) {
      return 'medium';
    }
    
    return 'small';
  }

  /**
   * Create campaign for lead outreach
   */
  createCampaign(
    name: string,
    type: Campaign['type'],
    targetCriteria: CampaignCriteria,
    personaId: string,
    sequence: CampaignStep[]
  ): Campaign {
    const campaign: Campaign = {
      id: this.generateCampaignId(),
      name,
      type,
      status: 'active',
      targetCriteria,
      personaId,
      sequence,
      startDate: new Date(),
      results: {
        totalSent: 0,
        responses: 0,
        meetings: 0,
        demos: 0,
        qualified: 0,
        closed: 0,
        responseRate: 0,
        conversionRate: 0
      }
    };

    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  /**
   * Get leads matching campaign criteria
   */
  getLeadsForCampaign(campaignId: string): LeadInfo[] {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return [];

    const allLeads = Array.from(this.leads.values());
    return allLeads.filter(lead => this.leadMatchesCriteria(lead, campaign.targetCriteria));
  }

  /**
   * Check if lead matches criteria
   */
  private leadMatchesCriteria(lead: LeadInfo, criteria: CampaignCriteria): boolean {
    if (criteria.industries && !criteria.industries.includes(lead.industry)) {
      return false;
    }
    
    if (criteria.locations && !criteria.locations.some(loc => 
      lead.location.toLowerCase().includes(loc.toLowerCase())
    )) {
      return false;
    }
    
    if (criteria.titles && !criteria.titles.some(title => 
      lead.title.toLowerCase().includes(title.toLowerCase())
    )) {
      return false;
    }

    return true;
  }

  /**
   * Execute campaign step for lead
   */
  async executeCampaignStep(
    campaignId: string,
    leadId: string,
    stepNumber: number
  ): Promise<{ success: boolean; message: string; nextAction?: string }> {
    const campaign = this.campaigns.get(campaignId);
    const lead = this.leads.get(leadId);
    
    if (!campaign || !lead) {
      return { success: false, message: 'Campaign or lead not found' };
    }

    const step = campaign.sequence.find(s => s.stepNumber === stepNumber);
    if (!step) {
      return { success: false, message: 'Campaign step not found' };
    }

    try {
      let result;
      
      switch (step.type) {
        case 'email':
          result = await this.sendEmail(lead, step);
          break;
        case 'call':
          result = await this.makeCall(lead, step);
          break;
        case 'linkedin':
          result = await this.sendLinkedInMessage(lead, step);
          break;
        case 'wait':
          result = { success: true, message: 'Waiting period completed' };
          break;
        default:
          result = { success: false, message: 'Unknown step type' };
      }

      // Record activity
      this.recordLeadActivity(leadId, {
        id: this.generateActivityId(),
        leadId,
        type: step.type as any,
        timestamp: new Date(),
        performedBy: campaign.personaId,
        description: `Campaign: ${campaign.name}, Step: ${stepNumber}`,
        outcome: result.success ? 'completed' : 'failed',
        nextAction: result.nextAction
      });

      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Send email to lead
   */
  private async sendEmail(lead: LeadInfo, step: CampaignStep): Promise<{ success: boolean; message: string; nextAction?: string }> {
    // This would integrate with email service (SendGrid, Mailchimp, etc.)
    const personalizedContent = this.personalizeContent(step.template, lead);
    
    // Simulate email sending
    console.log(`Sending email to ${lead.email}: ${personalizedContent.substring(0, 100)}...`);
    
    return {
      success: true,
      message: 'Email sent successfully',
      nextAction: 'Wait for response or proceed to next step'
    };
  }

  /**
   * Make call to lead
   */
  private async makeCall(lead: LeadInfo, step: CampaignStep): Promise<{ success: boolean; message: string; nextAction?: string }> {
    // This would integrate with telephony service (Twilio, etc.)
    const personalizedContent = this.personalizeContent(step.template, lead);
    
    // Simulate call
    console.log(`Calling ${lead.phone}: ${personalizedContent.substring(0, 100)}...`);
    
    return {
      success: true,
      message: 'Call completed',
      nextAction: 'Follow up based on call outcome'
    };
  }

  /**
   * Send LinkedIn message
   */
  private async sendLinkedInMessage(lead: LeadInfo, step: CampaignStep): Promise<{ success: boolean; message: string; nextAction?: string }> {
    // This would integrate with LinkedIn API
    const personalizedContent = this.personalizeContent(step.template, lead);
    
    // Simulate LinkedIn message
    console.log(`Sending LinkedIn message to ${lead.name}: ${personalizedContent.substring(0, 100)}...`);
    
    return {
      success: true,
      message: 'LinkedIn message sent',
      nextAction: 'Monitor for response'
    };
  }

  /**
   * Personalize content with lead information
   */
  private personalizeContent(template: string, lead: LeadInfo): string {
    let personalized = template;
    
    personalized = personalized.replace(/\[NAME\]/g, lead.name);
    personalized = personalized.replace(/\[COMPANY\]/g, lead.company);
    personalized = personalized.replace(/\[INDUSTRY\]/g, lead.industry);
    personalized = personalized.replace(/\[LOCATION\]/g, lead.location);
    personalized = personalized.replace(/\[TITLE\]/g, lead.title);
    
    return personalized;
  }

  /**
   * Record lead activity
   */
  recordLeadActivity(leadId: string, activity: LeadActivity): void {
    const activities = this.leadActivities.get(leadId) || [];
    activities.push(activity);
    this.leadActivities.set(leadId, activities);
  }

  /**
   * Update lead status
   */
  updateLeadStatus(
    leadId: string,
    status: LeadStatus['status'],
    notes: string,
    updatedBy: string
  ): void {
    const currentStatus = this.leadStatuses.get(leadId);
    if (!currentStatus) return;

    const newStatus: LeadStatus = {
      ...currentStatus,
      status,
      lastUpdated: new Date(),
      updatedBy,
      notes
    };

    this.leadStatuses.set(leadId, newStatus);

    // Record activity
    this.recordLeadActivity(leadId, {
      id: this.generateActivityId(),
      leadId,
      type: 'note',
      timestamp: new Date(),
      performedBy: updatedBy,
      description: `Status changed to ${status}`,
      outcome: 'status_updated'
    });
  }

  /**
   * Get lead analytics
   */
  getLeadAnalytics(): {
    totalLeads: number;
    byStatus: Record<string, number>;
    byIndustry: Record<string, number>;
    conversionRate: number;
    averageDealSize: number;
    topPerformingCampaigns: Array<{ id: string; name: string; conversionRate: number }>;
  } {
    const totalLeads = this.leads.size;
    const byStatus: Record<string, number> = {};
    const byIndustry: Record<string, number> = {};
    let totalValue = 0;
    let qualifiedLeads = 0;

    this.leads.forEach(lead => {
      // Count by industry
      byIndustry[lead.industry] = (byIndustry[lead.industry] || 0) + 1;

      // Get status
      const status = this.leadStatuses.get(lead.id);
      if (status) {
        byStatus[status.status] = (byStatus[status.status] || 0) + 1;
        
        if (status.status === 'qualified' || status.status === 'closed-won') {
          qualifiedLeads++;
          totalValue += status.estimatedValue;
        }
      }
    });

    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
    const averageDealSize = qualifiedLeads > 0 ? totalValue / qualifiedLeads : 0;

    // Get top performing campaigns
    const topCampaigns = Array.from(this.campaigns.values())
      .map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        conversionRate: campaign.results.conversionRate
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5);

    return {
      totalLeads,
      byStatus,
      byIndustry,
      conversionRate,
      averageDealSize,
      topPerformingCampaigns: topCampaigns
    };
  }

  /**
   * Create lead segment
   */
  createSegment(name: string, criteria: CampaignCriteria): LeadSegment {
    const segment: LeadSegment = {
      id: this.generateSegmentId(),
      name,
      criteria,
      leadCount: 0,
      lastUpdated: new Date()
    };

    // Calculate lead count
    const matchingLeads = Array.from(this.leads.values()).filter(lead =>
      this.leadMatchesCriteria(lead, criteria)
    );
    segment.leadCount = matchingLeads.length;

    this.segments.set(segment.id, segment);
    return segment;
  }

  /**
   * Initialize default segments
   */
  private initializeDefaultSegments(): void {
    // High-value prospects
    this.createSegment('High-Value Real Estate', {
      industries: ['Real Estate'],
      companySizes: ['large', 'medium']
    });

    // New leads
    this.createSegment('New Real Estate Leads', {
      industries: ['Real Estate'],
      status: ['new']
    });

    // Qualified prospects
    this.createSegment('Qualified Prospects', {
      status: ['qualified', 'demo-scheduled']
    });
  }

  /**
   * Generate unique IDs
   */
  private generateLeadId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCampaignId(): string {
    return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateActivityId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSegmentId(): string {
    return `segment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all leads
   */
  getAllLeads(): LeadInfo[] {
    return Array.from(this.leads.values());
  }

  /**
   * Get lead by ID
   */
  getLead(id: string): LeadInfo | undefined {
    return this.leads.get(id);
  }

  /**
   * Get lead status
   */
  getLeadStatus(id: string): LeadStatus | undefined {
    return this.leadStatuses.get(id);
  }

  /**
   * Get lead activities
   */
  getLeadActivities(id: string): LeadActivity[] {
    return this.leadActivities.get(id) || [];
  }

  /**
   * Get all campaigns
   */
  getAllCampaigns(): Campaign[] {
    return Array.from(this.campaigns.values());
  }

  /**
   * Get campaign by ID
   */
  getCampaign(id: string): Campaign | undefined {
    return this.campaigns.get(id);
  }
}

export interface CSVMapping {
  name?: string;
  company?: string;
  industry?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export default LeadManagementSystem;
