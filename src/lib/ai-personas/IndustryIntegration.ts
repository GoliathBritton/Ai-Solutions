/**
 * Comprehensive Industry Integration System
 * Central hub for managing all 30+ industry personas and campaigns
 */

import { IndustryAIPersona, industryPersonas } from './IndustryPersonas';
import { IndustryCampaign, industryCampaigns } from './IndustryCampaigns';
import { IndustryLeadScore, industryLeadScoring } from './IndustryLeadScoring';

export interface IndustryIntegration {
  industry: string;
  persona: IndustryAIPersona;
  campaigns: IndustryCampaign[];
  leadScoring: IndustryLeadScore;
  totalLeads: number;
  estimatedValue: number;
  conversionRate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'ready' | 'in-progress' | 'planned' | 'completed';
}

export class IndustryIntegrationManager {
  private integrations: Map<string, IndustryIntegration> = new Map();

  constructor() {
    this.initializeIntegrations();
  }

  /**
   * Initialize all industry integrations
   */
  private initializeIntegrations() {
    const industries = [
      'Agriculture', 'Aviation', 'Banking', 'Casino Games', 'Construction',
      'Corrections', 'E-Learning & Education', 'Energy & Utilities', 'Environmental Management', 'Finance',
      'Food & Beverage', 'Gaming', 'Healthcare', 'Hospitality & Travel', 'Human Capital Management (HCM)',
      'Insurance', 'Legal', 'Lending', 'Media & Entertainment', 'Meetings & Events',
      'Mortgage', 'Nonprofit', 'Oil & Gas', 'Payments', 'Political Campaigns',
      'Retail', 'Real Estate', 'Sports', 'Supply Chain', 'Telecommunications', 'Transportation'
    ];

    industries.forEach(industry => {
      const persona = industryPersonas.find(p => p.industry === industry);
      const campaigns = industryCampaigns.filter(c => c.industry === industry);
      const leadScoring = industryLeadScoring.find(s => s.industry === industry);

      if (persona && leadScoring) {
        const integration: IndustryIntegration = {
          industry,
          persona,
          campaigns,
          leadScoring,
          totalLeads: this.estimateLeadCount(industry),
          estimatedValue: this.estimateIndustryValue(industry),
          conversionRate: this.estimateConversionRate(industry),
          priority: this.determinePriority(industry),
          status: this.determineStatus(industry)
        };

        this.integrations.set(industry, integration);
      }
    });
  }

  /**
   * Estimate lead count for each industry
   */
  private estimateLeadCount(industry: string): number {
    const leadEstimates: Record<string, number> = {
      'Agriculture': 500000,
      'Aviation': 15000,
      'Banking': 8000,
      'Casino Games': 25000,
      'Construction': 200000,
      'Corrections': 8000,
      'E-Learning & Education': 100000,
      'Energy & Utilities': 25000,
      'Environmental Management': 50000,
      'Finance': 15000,
      'Food & Beverage': 300000,
      'Gaming': 75000,
      'Healthcare': 150000,
      'Hospitality & Travel': 200000,
      'Human Capital Management (HCM)': 100000,
      'Insurance': 75000,
      'Legal': 100000,
      'Lending': 50000,
      'Media & Entertainment': 125000,
      'Meetings & Events': 150000,
      'Mortgage': 75000,
      'Nonprofit': 500000,
      'Oil & Gas': 30000,
      'Payments': 40000,
      'Political Campaigns': 100000,
      'Retail': 400000,
      'Real Estate': 1500000, // Already processed
      'Sports': 50000,
      'Supply Chain': 100000,
      'Telecommunications': 35000,
      'Transportation': 125000
    };

    return leadEstimates[industry] || 50000;
  }

  /**
   * Estimate industry value potential
   */
  private estimateIndustryValue(industry: string): number {
    const leadCount = this.estimateLeadCount(industry);
    const averageDealSize = this.getAverageDealSize(industry);
    const conversionRate = this.parseConversionRate(this.estimateConversionRate(industry));
    
    return leadCount * averageDealSize * conversionRate;
  }

  /**
   * Get average deal size for industry
   */
  private getAverageDealSize(industry: string): number {
    const dealSizes: Record<string, number> = {
      'Agriculture': 87500,
      'Aviation': 275000,
      'Banking': 1050000,
      'Casino Games': 537500,
      'Construction': 262500,
      'Corrections': 525000,
      'E-Learning & Education': 257500,
      'Energy & Utilities': 2550000,
      'Environmental Management': 137500,
      'Finance': 787500,
      'Food & Beverage': 80000,
      'Gaming': 262500,
      'Healthcare': 1025000,
      'Hospitality & Travel': 257500,
      'Human Capital Management (HCM)': 387500,
      'Insurance': 525000,
      'Legal': 262500,
      'Lending': 262500,
      'Media & Entertainment': 525000,
      'Meetings & Events': 130000,
      'Mortgage': 262500,
      'Nonprofit': 52500,
      'Oil & Gas': 2550000,
      'Payments': 525000,
      'Political Campaigns': 130000,
      'Retail': 257500,
      'Real Estate': 130000,
      'Sports': 387500,
      'Supply Chain': 525000,
      'Telecommunications': 2550000,
      'Transportation': 387500
    };

    return dealSizes[industry] || 100000;
  }

  /**
   * Estimate conversion rate for industry
   */
  private estimateConversionRate(industry: string): string {
    const conversionRates: Record<string, string> = {
      'Agriculture': '12-18%',
      'Aviation': '15-22%',
      'Banking': '18-25%',
      'Casino Games': '10-15%',
      'Construction': '14-20%',
      'Corrections': '12-18%',
      'E-Learning & Education': '15-22%',
      'Energy & Utilities': '10-15%',
      'Environmental Management': '12-18%',
      'Finance': '15-20%',
      'Food & Beverage': '18-25%',
      'Gaming': '15-22%',
      'Healthcare': '16-24%',
      'Hospitality & Travel': '18-25%',
      'Human Capital Management (HCM)': '15-22%',
      'Insurance': '12-18%',
      'Legal': '15-22%',
      'Lending': '14-20%',
      'Media & Entertainment': '12-18%',
      'Meetings & Events': '16-24%',
      'Mortgage': '15-22%',
      'Nonprofit': '10-15%',
      'Oil & Gas': '8-12%',
      'Payments': '12-18%',
      'Political Campaigns': '15-22%',
      'Retail': '20-28%',
      'Real Estate': '22-30%',
      'Sports': '12-18%',
      'Supply Chain': '14-20%',
      'Telecommunications': '10-15%',
      'Transportation': '12-18%'
    };

    return conversionRates[industry] || '12-18%';
  }

  /**
   * Parse conversion rate string to number
   */
  private parseConversionRate(rateString: string): number {
    const match = rateString.match(/(\d+)-(\d+)%/);
    if (match) {
      const min = parseInt(match[1]);
      const max = parseInt(match[2]);
      return (min + max) / 200; // Convert to decimal
    }
    return 0.15; // Default 15%
  }

  /**
   * Determine industry priority
   */
  private determinePriority(industry: string): 'high' | 'medium' | 'low' {
    const highPriority = ['Real Estate', 'Healthcare', 'Banking', 'Construction', 'Retail'];
    const mediumPriority = ['Agriculture', 'Manufacturing', 'Technology', 'Finance', 'Insurance'];

    if (highPriority.includes(industry)) return 'high';
    if (mediumPriority.includes(industry)) return 'medium';
    return 'low';
  }

  /**
   * Determine industry status
   */
  private determineStatus(industry: string): 'ready' | 'in-progress' | 'planned' | 'completed' {
    if (industry === 'Real Estate') return 'completed';
    if (['Healthcare', 'Construction', 'Banking', 'Retail'].includes(industry)) return 'ready';
    return 'planned';
  }

  /**
   * Get all industry integrations
   */
  public getAllIntegrations(): IndustryIntegration[] {
    return Array.from(this.integrations.values());
  }

  /**
   * Get integration by industry
   */
  public getIntegration(industry: string): IndustryIntegration | undefined {
    return this.integrations.get(industry);
  }

  /**
   * Get integrations by priority
   */
  public getIntegrationsByPriority(priority: 'high' | 'medium' | 'low'): IndustryIntegration[] {
    return this.getAllIntegrations().filter(integration => integration.priority === priority);
  }

  /**
   * Get integrations by status
   */
  public getIntegrationsByStatus(status: 'ready' | 'in-progress' | 'planned' | 'completed'): IndustryIntegration[] {
    return this.getAllIntegrations().filter(integration => integration.status === status);
  }

  /**
   * Get total database summary
   */
  public getDatabaseSummary() {
    const integrations = this.getAllIntegrations();
    const totalLeads = integrations.reduce((sum, integration) => sum + integration.totalLeads, 0);
    const totalValue = integrations.reduce((sum, integration) => sum + integration.estimatedValue, 0);
    const highPriorityCount = integrations.filter(i => i.priority === 'high').length;
    const readyCount = integrations.filter(i => i.status === 'ready').length;

    return {
      totalIndustries: integrations.length,
      totalLeads: totalLeads.toLocaleString(),
      totalValue: `$${totalValue.toLocaleString()}`,
      highPriorityIndustries: highPriorityCount,
      readyToLaunch: readyCount,
      averageConversionRate: '15%',
      estimatedAnnualRevenue: `$${(totalValue * 0.15).toLocaleString()}`
    };
  }

  /**
   * Get industry performance metrics
   */
  public getIndustryMetrics(industry: string) {
    const integration = this.getIntegration(industry);
    if (!integration) return null;

    return {
      industry: integration.industry,
      persona: integration.persona.name,
      totalLeads: integration.totalLeads.toLocaleString(),
      estimatedValue: `$${integration.estimatedValue.toLocaleString()}`,
      conversionRate: integration.conversionRate,
      averageDealSize: integration.persona.averageDealSize,
      salesCycle: integration.persona.salesCycle,
      priority: integration.priority,
      status: integration.status,
      campaigns: integration.campaigns.length,
      readyToLaunch: integration.status === 'ready' || integration.status === 'completed'
    };
  }

  /**
   * Get launch roadmap
   */
  public getLaunchRoadmap() {
    const integrations = this.getAllIntegrations();
    
    return {
      phase1: {
        name: 'Immediate Launch (Ready Industries)',
        industries: integrations.filter(i => i.status === 'ready' || i.status === 'completed'),
        timeline: 'Weeks 1-4',
        expectedRevenue: '$2,000,000 - $5,000,000'
      },
      phase2: {
        name: 'High Priority Expansion',
        industries: integrations.filter(i => i.priority === 'high' && i.status === 'planned'),
        timeline: 'Weeks 5-12',
        expectedRevenue: '$5,000,000 - $10,000,000'
      },
      phase3: {
        name: 'Full Multi-Industry Launch',
        industries: integrations.filter(i => i.priority === 'medium' || i.priority === 'low'),
        timeline: 'Weeks 13-24',
        expectedRevenue: '$10,000,000 - $20,000,000'
      }
    };
  }

  /**
   * Get industry-specific recommendations
   */
  public getIndustryRecommendations(industry: string) {
    const integration = this.getIntegration(industry);
    if (!integration) return null;

    const recommendations = {
      'Agriculture': [
        'Focus on seasonal timing for crop planning',
        'Emphasize ROI through yield improvement',
        'Target large-scale operations first'
      ],
      'Aviation': [
        'Highlight safety and regulatory compliance',
        'Emphasize operational efficiency gains',
        'Target major airlines and airports'
      ],
      'Banking': [
        'Focus on regulatory compliance automation',
        'Emphasize customer experience improvement',
        'Target regional and community banks'
      ],
      'Construction': [
        'Highlight project timeline reduction',
        'Emphasize safety improvement',
        'Target general contractors and developers'
      ],
      'Healthcare': [
        'Focus on patient care improvement',
        'Emphasize HIPAA compliance',
        'Target hospitals and large practices'
      ],
      'Retail': [
        'Highlight customer experience enhancement',
        'Emphasize inventory optimization',
        'Target omnichannel retailers'
      ],
      'Real Estate': [
        'Focus on transaction efficiency',
        'Emphasize client relationship management',
        'Target high-volume agents and brokerages'
      ]
    };

    return recommendations[industry] || [
      'Focus on industry-specific pain points',
      'Emphasize ROI and efficiency gains',
      'Target decision makers and influencers'
    ];
  }
}

export default IndustryIntegrationManager;
