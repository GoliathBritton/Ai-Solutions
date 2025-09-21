/**
 * MetisAI Dynamic Pricing Structure
 * Premium subscription-based pricing with overages, upsells, and consulting
 */

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  includedOperations: number;
  maxUsers: number;
  features: string[];
  limitations: string[];
  overageRate: number;
  setupFee: number;
  consultingHours: number;
  supportLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
  sla: string;
  contractLength: number; // months
  earlyTerminationFee: number;
}

export interface SubscriptionPlan {
  id: string;
  tier: PricingTier;
  startDate: string;
  endDate: string;
  status: 'active' | 'suspended' | 'cancelled' | 'expired';
  autoRenew: boolean;
  paymentMethod: string;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  customPricing: CustomPricing | null;
}

export interface CustomPricing {
  basePrice: number;
  operationPrice: number;
  setupFee: number;
  consultingRate: number;
  overageMultiplier: number;
  volumeDiscounts: VolumeDiscount[];
  customFeatures: string[];
  negotiatedTerms: string[];
}

export interface VolumeDiscount {
  minOperations: number;
  discountRate: number;
  description: string;
  applicableTiers: string[];
}

export interface OverageCalculation {
  algorithmId: string;
  includedOperations: number;
  usedOperations: number;
  overageOperations: number;
  overageRate: number;
  overageCost: number;
  totalCost: number;
}

export interface UpsellOpportunity {
  id: string;
  type: 'algorithm' | 'feature' | 'service' | 'support';
  name: string;
  description: string;
  currentValue: number;
  upsellValue: number;
  roi: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  recommended: boolean;
  discount: number;
  expirationDate: string;
}

export interface ConsultingService {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  minimumHours: number;
  maximumHours: number;
  category: 'setup' | 'optimization' | 'training' | 'support' | 'custom';
  expertise: string[];
  deliverables: string[];
  estimatedDuration: number; // hours
  prerequisites: string[];
}

export interface SetupFee {
  algorithmId: string;
  baseFee: number;
  complexityMultiplier: number;
  urgencyMultiplier: number;
  customizations: number;
  totalFee: number;
  breakdown: SetupFeeBreakdown;
}

export interface SetupFeeBreakdown {
  baseSetup: number;
  complexityFee: number;
  urgencyFee: number;
  customizationFee: number;
  consultingFee: number;
  trainingFee: number;
  documentationFee: number;
}

export class DynamicPricing {
  private pricingTiers: Map<string, PricingTier>;
  private consultingServices: Map<string, ConsultingService>;
  private volumeDiscounts: VolumeDiscount[];

  constructor() {
    this.pricingTiers = new Map();
    this.consultingServices = new Map();
    this.volumeDiscounts = [];
    this.initializePricing();
  }

  private initializePricing() {
    this.initializePricingTiers();
    this.initializeConsultingServices();
    this.initializeVolumeDiscounts();
  }

  private initializePricingTiers() {
    const tiers: PricingTier[] = [
      {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for small teams getting started with quantum optimization',
        monthlyPrice: 5000,
        annualPrice: 50000,
        includedOperations: 10000,
        maxUsers: 5,
        features: [
          'Basic QUBO algorithms',
          'Standard support',
          'Community forum access',
          'Basic documentation',
          'Email support'
        ],
        limitations: [
          'Limited to basic algorithms',
          'No custom development',
          'Standard SLA only',
          'No dedicated support'
        ],
        overageRate: 2.0,
        setupFee: 10000,
        consultingHours: 5,
        supportLevel: 'basic',
        sla: '99.5% uptime, 24h response',
        contractLength: 12,
        earlyTerminationFee: 5000
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Advanced quantum algorithms for growing businesses',
        monthlyPrice: 15000,
        annualPrice: 150000,
        includedOperations: 50000,
        maxUsers: 25,
        features: [
          'All QUBO algorithms',
          'Priority support',
          'Advanced documentation',
          'Phone & email support',
          'Custom integrations',
          'Performance monitoring',
          'Basic consulting included'
        ],
        limitations: [
          'Limited custom development',
          'Standard consulting rates',
          'No dedicated account manager'
        ],
        overageRate: 1.8,
        setupFee: 25000,
        consultingHours: 20,
        supportLevel: 'standard',
        sla: '99.7% uptime, 12h response',
        contractLength: 12,
        earlyTerminationFee: 15000
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Full-scale quantum optimization for large organizations',
        monthlyPrice: 50000,
        annualPrice: 500000,
        includedOperations: 200000,
        maxUsers: 100,
        features: [
          'All QUBO algorithms',
          'Custom algorithm development',
          'Dedicated account manager',
          '24/7 premium support',
          'Custom SLA',
          'On-site consulting',
          'Training programs',
          'Custom integrations',
          'Advanced analytics',
          'White-label options'
        ],
        limitations: [
          'Minimum 2-year commitment',
          'Custom pricing only'
        ],
        overageRate: 1.5,
        setupFee: 100000,
        consultingHours: 100,
        supportLevel: 'enterprise',
        sla: '99.9% uptime, 4h response',
        contractLength: 24,
        earlyTerminationFee: 50000
      },
      {
        id: 'custom',
        name: 'Custom Enterprise',
        description: 'Fully customized quantum solutions for Fortune 500 companies',
        monthlyPrice: 0, // Custom pricing
        annualPrice: 0, // Custom pricing
        includedOperations: 0, // Custom
        maxUsers: 0, // Unlimited
        features: [
          'Everything in Enterprise',
          'Fully custom algorithms',
          'Dedicated quantum team',
          'On-premise deployment',
          'Custom hardware integration',
          'Regulatory compliance',
          'Custom training programs',
          'Dedicated support team',
          'Custom SLA terms',
          'White-label solutions'
        ],
        limitations: [],
        overageRate: 1.0, // Negotiated
        setupFee: 0, // Custom
        consultingHours: 0, // Unlimited
        supportLevel: 'enterprise',
        sla: 'Custom SLA',
        contractLength: 36,
        earlyTerminationFee: 0 // Negotiated
      }
    ];

    tiers.forEach(tier => {
      this.pricingTiers.set(tier.id, tier);
    });
  }

  private initializeConsultingServices() {
    const services: ConsultingService[] = [
      {
        id: 'quantum_setup',
        name: 'Quantum Algorithm Setup',
        description: 'Complete setup and configuration of quantum algorithms for your specific use case',
        hourlyRate: 500,
        minimumHours: 8,
        maximumHours: 40,
        category: 'setup',
        expertise: ['Quantum Computing', 'QUBO Optimization', 'Algorithm Design'],
        deliverables: [
          'Algorithm configuration',
          'Performance optimization',
          'Integration documentation',
          'Training materials'
        ],
        estimatedDuration: 16,
        prerequisites: ['Clear use case definition', 'Data preparation', 'Infrastructure setup']
      },
      {
        id: 'performance_optimization',
        name: 'Performance Optimization',
        description: 'Optimize existing quantum algorithms for maximum performance and efficiency',
        hourlyRate: 600,
        minimumHours: 4,
        maximumHours: 24,
        category: 'optimization',
        expertise: ['Quantum Optimization', 'Performance Tuning', 'Algorithm Analysis'],
        deliverables: [
          'Performance analysis report',
          'Optimization recommendations',
          'Code improvements',
          'Benchmarking results'
        ],
        estimatedDuration: 12,
        prerequisites: ['Existing algorithm implementation', 'Performance metrics', 'Access to quantum hardware']
      },
      {
        id: 'quantum_training',
        name: 'Quantum Computing Training',
        description: 'Comprehensive training program for your team on quantum computing and QUBO optimization',
        hourlyRate: 400,
        minimumHours: 16,
        maximumHours: 80,
        category: 'training',
        expertise: ['Quantum Computing', 'QUBO Theory', 'Practical Applications'],
        deliverables: [
          'Custom training curriculum',
          'Hands-on workshops',
          'Certification program',
          'Ongoing support materials'
        ],
        estimatedDuration: 40,
        prerequisites: ['Team size definition', 'Skill level assessment', 'Training objectives']
      },
      {
        id: 'custom_algorithm',
        name: 'Custom Algorithm Development',
        description: 'Development of completely custom quantum algorithms for unique business requirements',
        hourlyRate: 750,
        minimumHours: 40,
        maximumHours: 200,
        category: 'custom',
        expertise: ['Quantum Algorithm Design', 'QUBO Formulation', 'Custom Development'],
        deliverables: [
          'Custom algorithm implementation',
          'Comprehensive testing',
          'Performance validation',
          'Integration support',
          'Documentation and training'
        ],
        estimatedDuration: 120,
        prerequisites: ['Detailed requirements', 'Domain expertise', 'Data access', 'Hardware specifications']
      },
      {
        id: 'enterprise_integration',
        name: 'Enterprise Integration',
        description: 'Full-scale integration of quantum algorithms into existing enterprise systems',
        hourlyRate: 650,
        minimumHours: 20,
        maximumHours: 100,
        category: 'setup',
        expertise: ['Enterprise Architecture', 'System Integration', 'Quantum Computing'],
        deliverables: [
          'Integration architecture',
          'System modifications',
          'Data pipeline setup',
          'Testing and validation',
          'Go-live support'
        ],
        estimatedDuration: 60,
        prerequisites: ['System architecture documentation', 'Integration requirements', 'Testing environment']
      }
    ];

    services.forEach(service => {
      this.consultingServices.set(service.id, service);
    });
  }

  private initializeVolumeDiscounts() {
    this.volumeDiscounts = [
      {
        minOperations: 100000,
        discountRate: 0.1,
        description: '10% discount for 100K+ operations',
        applicableTiers: ['professional', 'enterprise', 'custom']
      },
      {
        minOperations: 500000,
        discountRate: 0.2,
        description: '20% discount for 500K+ operations',
        applicableTiers: ['enterprise', 'custom']
      },
      {
        minOperations: 1000000,
        discountRate: 0.3,
        description: '30% discount for 1M+ operations',
        applicableTiers: ['custom']
      },
      {
        minOperations: 5000000,
        discountRate: 0.4,
        description: '40% discount for 5M+ operations',
        applicableTiers: ['custom']
      }
    ];
  }

  /**
   * Calculate subscription cost
   */
  calculateSubscriptionCost(
    tierId: string,
    operations: number,
    isAnnual: boolean = false,
    customPricing?: CustomPricing
  ): number {
    const tier = this.pricingTiers.get(tierId);
    if (!tier) return 0;

    let basePrice = isAnnual ? tier.annualPrice : tier.monthlyPrice;
    
    if (customPricing) {
      basePrice = customPricing.basePrice;
    }

    // Calculate overage
    const overageOperations = Math.max(0, operations - tier.includedOperations);
    const overageRate = customPricing?.overageMultiplier || tier.overageRate;
    const operationPrice = customPricing?.operationPrice || this.getOperationPrice(tierId);
    
    const overageCost = overageOperations * operationPrice * overageRate;
    
    // Apply volume discounts
    const discount = this.getVolumeDiscount(operations, tierId);
    const discountedOverage = overageCost * (1 - discount);
    
    return basePrice + discountedOverage;
  }

  /**
   * Calculate setup fee
   */
  calculateSetupFee(
    algorithmId: string,
    complexity: 'basic' | 'intermediate' | 'advanced' | 'expert' | 'enterprise',
    urgency: 'standard' | 'expedited' | 'rush' | 'critical',
    customizations: number = 0,
    includeConsulting: boolean = false,
    consultingHours: number = 0
  ): SetupFee {
    const baseFee = this.getBaseSetupFee(algorithmId);
    const complexityMultiplier = this.getComplexityMultiplier(complexity);
    const urgencyMultiplier = this.getUrgencyMultiplier(urgency);
    
    const breakdown: SetupFeeBreakdown = {
      baseSetup: baseFee,
      complexityFee: baseFee * (complexityMultiplier - 1),
      urgencyFee: baseFee * (urgencyMultiplier - 1),
      customizationFee: customizations * 1000,
      consultingFee: includeConsulting ? consultingHours * 500 : 0,
      trainingFee: baseFee * 0.1,
      documentationFee: baseFee * 0.05
    };
    
    const totalFee = Object.values(breakdown).reduce((sum, fee) => sum + fee, 0);
    
    return {
      algorithmId,
      baseFee,
      complexityMultiplier,
      urgencyMultiplier,
      customizations,
      totalFee,
      breakdown
    };
  }

  /**
   * Get upsell opportunities
   */
  getUpsellOpportunities(
    currentTier: string,
    usage: number,
    algorithms: string[]
  ): UpsellOpportunity[] {
    const opportunities: UpsellOpportunity[] = [];
    
    // Tier upgrades
    if (currentTier === 'starter' && usage > 8000) {
      opportunities.push({
        id: 'upgrade_professional',
        type: 'feature',
        name: 'Upgrade to Professional',
        description: 'Get 5x more operations and advanced features',
        currentValue: 5000,
        upsellValue: 15000,
        roi: 200,
        urgency: 'high',
        recommended: true,
        discount: 0.1,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    if (currentTier === 'professional' && usage > 45000) {
      opportunities.push({
        id: 'upgrade_enterprise',
        type: 'feature',
        name: 'Upgrade to Enterprise',
        description: 'Unlimited operations and dedicated support',
        currentValue: 15000,
        upsellValue: 50000,
        roi: 233,
        urgency: 'medium',
        recommended: true,
        discount: 0.15,
        expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Algorithm additions
    if (!algorithms.includes('qubo_drug_discovery')) {
      opportunities.push({
        id: 'add_drug_discovery',
        type: 'algorithm',
        name: 'Add Drug Discovery Algorithm',
        description: 'Revolutionary quantum drug discovery capabilities',
        currentValue: 0,
        upsellValue: 50000,
        roi: 300,
        urgency: 'medium',
        recommended: true,
        discount: 0.2,
        expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    // Consulting services
    opportunities.push({
      id: 'add_consulting',
      type: 'service',
      name: 'Add Consulting Package',
      description: 'Expert quantum consulting and optimization',
      currentValue: 0,
      upsellValue: 25000,
      roi: 150,
      urgency: 'low',
      recommended: false,
      discount: 0.1,
      expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    return opportunities.sort((a, b) => b.roi - a.roi);
  }

  /**
   * Calculate overage cost
   */
  calculateOverage(
    algorithmId: string,
    includedOperations: number,
    usedOperations: number,
    tierId: string
  ): OverageCalculation {
    const overageOperations = Math.max(0, usedOperations - includedOperations);
    const tier = this.pricingTiers.get(tierId);
    const overageRate = tier?.overageRate || 2.0;
    const operationPrice = this.getOperationPrice(tierId);
    
    const overageCost = overageOperations * operationPrice * overageRate;
    const totalCost = (usedOperations * operationPrice) + overageCost;
    
    return {
      algorithmId,
      includedOperations,
      usedOperations,
      overageOperations,
      overageRate,
      overageCost,
      totalCost
    };
  }

  /**
   * Get all pricing tiers
   */
  getAllPricingTiers(): PricingTier[] {
    return Array.from(this.pricingTiers.values());
  }

  /**
   * Get pricing tier by ID
   */
  getPricingTier(tierId: string): PricingTier | undefined {
    return this.pricingTiers.get(tierId);
  }

  /**
   * Get all consulting services
   */
  getAllConsultingServices(): ConsultingService[] {
    return Array.from(this.consultingServices.values());
  }

  /**
   * Get consulting service by ID
   */
  getConsultingService(serviceId: string): ConsultingService | undefined {
    return this.consultingServices.get(serviceId);
  }

  /**
   * Get volume discount for operations
   */
  getVolumeDiscount(operations: number, tierId: string): number {
    const applicableDiscounts = this.volumeDiscounts.filter(
      discount => operations >= discount.minOperations && 
      discount.applicableTiers.includes(tierId)
    );
    
    return applicableDiscounts.length > 0 
      ? Math.max(...applicableDiscounts.map(d => d.discountRate))
      : 0;
  }

  private getBaseSetupFee(algorithmId: string): number {
    const baseFees: Record<string, number> = {
      'qubo_portfolio_optimization': 50000,
      'qubo_vehicle_routing': 35000,
      'qubo_machine_learning': 45000,
      'qubo_energy_optimization': 75000,
      'qubo_drug_discovery': 100000
    };
    
    return baseFees[algorithmId] || 25000;
  }

  private getComplexityMultiplier(complexity: string): number {
    const multipliers: Record<string, number> = {
      'basic': 1.0,
      'intermediate': 1.2,
      'advanced': 1.5,
      'expert': 2.0,
      'enterprise': 3.0
    };
    
    return multipliers[complexity] || 1.0;
  }

  private getUrgencyMultiplier(urgency: string): number {
    const multipliers: Record<string, number> = {
      'standard': 1.0,
      'expedited': 1.3,
      'rush': 1.8,
      'critical': 2.5
    };
    
    return multipliers[urgency] || 1.0;
  }

  private getOperationPrice(tierId: string): number {
    const prices: Record<string, number> = {
      'starter': 0.50,
      'professional': 0.30,
      'enterprise': 0.20,
      'custom': 0.15
    };
    
    return prices[tierId] || 0.50;
  }
}
