/**
 * Comprehensive Payment System for Multi-Industry AI Sales Platform
 * Handles payments across all 31 industries with flexible pricing models
 */

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  features: string[];
  industries: string[];
  maxLeads: number;
  maxCalls: number;
  maxPersonas: number;
  support: 'basic' | 'standard' | 'premium' | 'enterprise';
}

export interface IndustryPricing {
  industry: string;
  basePrice: number;
  multiplier: number;
  minDealSize: number;
  maxDealSize: number;
  pricingModel: 'subscription' | 'per-lead' | 'per-call' | 'commission' | 'hybrid';
  paymentMethods: string[];
  contractTerms: string[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'bank_transfer' | 'cryptocurrency' | 'wire_transfer' | 'check';
  processingFee: number;
  supported: boolean;
  minAmount: number;
  maxAmount: number;
}

export class PaymentSystem {
  private stripeApiKey: string;
  private paypalClientId: string;
  private cryptoWallets: string[];
  private bankAccounts: string[];

  constructor() {
    this.stripeApiKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    this.paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
    this.cryptoWallets = [
      'FLY Token (Primary)',
      'Ethereum (ETH)',
      'Bitcoin (BTC)',
      'USDC (Stablecoin)',
      'Polygon (MATIC)'
    ];
    this.bankAccounts = [
      'Wire Transfer',
      'ACH Transfer',
      'International Wire',
      'Check Payment'
    ];
  }

  /**
   * Get comprehensive pricing tiers
   */
  getPricingTiers(): PricingTier[] {
    return [
      {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for small businesses and individual agents',
        price: 297,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          '1 AI Persona',
          '1,000 leads per month',
          '500 AI calls per month',
          'Basic analytics',
          'Email support',
          '1 industry specialization'
        ],
        industries: ['Real Estate', 'Retail', 'Food & Beverage'],
        maxLeads: 1000,
        maxCalls: 500,
        maxPersonas: 1,
        support: 'basic'
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Ideal for growing businesses and sales teams',
        price: 997,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          '3 AI Personas',
          '5,000 leads per month',
          '2,500 AI calls per month',
          'Advanced analytics',
          'Priority support',
          '3 industry specializations',
          'Custom campaigns',
          'CRM integration'
        ],
        industries: ['Healthcare', 'Construction', 'Banking', 'Insurance', 'Legal'],
        maxLeads: 5000,
        maxCalls: 2500,
        maxPersonas: 3,
        support: 'standard'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations and multi-industry operations',
        price: 2997,
        currency: 'USD',
        billingCycle: 'monthly',
        features: [
          '10 AI Personas',
          '25,000 leads per month',
          '12,500 AI calls per month',
          'Premium analytics',
          '24/7 support',
          'All 31 industries',
          'Custom integrations',
          'Dedicated account manager',
          'White-label options'
        ],
        industries: ['All Industries'],
        maxLeads: 25000,
        maxCalls: 12500,
        maxPersonas: 10,
        support: 'premium'
      },
      {
        id: 'custom',
        name: 'Custom',
        description: 'Tailored solutions for specific enterprise needs',
        price: 0, // Custom pricing
        currency: 'USD',
        billingCycle: 'annually',
        features: [
          'Unlimited AI Personas',
          'Unlimited leads',
          'Unlimited AI calls',
          'Custom analytics',
          'Dedicated support team',
          'All 31 industries',
          'Custom development',
          'On-premise deployment',
          'SLA guarantees'
        ],
        industries: ['All Industries'],
        maxLeads: -1, // Unlimited
        maxCalls: -1, // Unlimited
        maxPersonas: -1, // Unlimited
        support: 'enterprise'
      }
    ];
  }

  /**
   * Get industry-specific pricing
   */
  getIndustryPricing(): IndustryPricing[] {
    return [
      {
        industry: 'Real Estate',
        basePrice: 297,
        multiplier: 1.0,
        minDealSize: 10000,
        maxDealSize: 250000,
        pricingModel: 'hybrid',
        paymentMethods: ['credit_card', 'bank_transfer', 'cryptocurrency'],
        contractTerms: ['Monthly', 'Quarterly', 'Annual']
      },
      {
        industry: 'Healthcare',
        basePrice: 997,
        multiplier: 1.5,
        minDealSize: 50000,
        maxDealSize: 2000000,
        pricingModel: 'subscription',
        paymentMethods: ['credit_card', 'wire_transfer', 'check'],
        contractTerms: ['Annual', 'Multi-year']
      },
      {
        industry: 'Banking',
        basePrice: 2997,
        multiplier: 2.0,
        minDealSize: 100000,
        maxDealSize: 2000000,
        pricingModel: 'subscription',
        paymentMethods: ['wire_transfer', 'check'],
        contractTerms: ['Annual', 'Multi-year']
      },
      {
        industry: 'Construction',
        basePrice: 697,
        multiplier: 1.2,
        minDealSize: 25000,
        maxDealSize: 500000,
        pricingModel: 'hybrid',
        paymentMethods: ['credit_card', 'bank_transfer', 'cryptocurrency'],
        contractTerms: ['Monthly', 'Quarterly', 'Annual']
      },
      {
        industry: 'Retail',
        basePrice: 497,
        multiplier: 1.0,
        minDealSize: 15000,
        maxDealSize: 500000,
        pricingModel: 'per-lead',
        paymentMethods: ['credit_card', 'cryptocurrency'],
        contractTerms: ['Monthly', 'Quarterly']
      },
      {
        industry: 'Aviation',
        basePrice: 1997,
        multiplier: 2.5,
        minDealSize: 50000,
        maxDealSize: 500000,
        pricingModel: 'subscription',
        paymentMethods: ['wire_transfer', 'check'],
        contractTerms: ['Annual', 'Multi-year']
      },
      {
        industry: 'Energy & Utilities',
        basePrice: 3997,
        multiplier: 3.0,
        minDealSize: 100000,
        maxDealSize: 5000000,
        pricingModel: 'subscription',
        paymentMethods: ['wire_transfer', 'check'],
        contractTerms: ['Annual', 'Multi-year']
      },
      {
        industry: 'Oil & Gas',
        basePrice: 4997,
        multiplier: 3.5,
        minDealSize: 100000,
        maxDealSize: 5000000,
        pricingModel: 'subscription',
        paymentMethods: ['wire_transfer', 'check'],
        contractTerms: ['Annual', 'Multi-year']
      },
      {
        industry: 'Telecommunications',
        basePrice: 2997,
        multiplier: 2.0,
        minDealSize: 100000,
        maxDealSize: 5000000,
        pricingModel: 'subscription',
        paymentMethods: ['wire_transfer', 'check'],
        contractTerms: ['Annual', 'Multi-year']
      },
      {
        industry: 'Gaming',
        basePrice: 697,
        multiplier: 1.3,
        minDealSize: 25000,
        maxDealSize: 500000,
        pricingModel: 'per-call',
        paymentMethods: ['credit_card', 'cryptocurrency'],
        contractTerms: ['Monthly', 'Quarterly']
      }
    ];
  }

  /**
   * Get supported payment methods
   */
  getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'credit_card',
        name: 'Credit/Debit Card',
        type: 'credit_card',
        processingFee: 2.9,
        supported: true,
        minAmount: 10,
        maxAmount: 50000
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer (ACH)',
        type: 'bank_transfer',
        processingFee: 0.8,
        supported: true,
        minAmount: 100,
        maxAmount: 100000
      },
      {
        id: 'wire_transfer',
        name: 'Wire Transfer',
        type: 'wire_transfer',
        processingFee: 25,
        supported: true,
        minAmount: 1000,
        maxAmount: 10000000
      },
      {
        id: 'cryptocurrency',
        name: 'Cryptocurrency (FLY Token)',
        type: 'cryptocurrency',
        processingFee: 0.5,
        supported: true,
        minAmount: 50,
        maxAmount: 5000000
      },
      {
        id: 'check',
        name: 'Check Payment',
        type: 'check',
        processingFee: 0,
        supported: true,
        minAmount: 500,
        maxAmount: 10000000
      }
    ];
  }

  /**
   * Calculate pricing for specific industry and tier
   */
  calculatePricing(industry: string, tier: string, leads: number, calls: number): {
    basePrice: number;
    leadCost: number;
    callCost: number;
    totalCost: number;
    savings: number;
    recommendedTier: string;
  } {
    const industryPricing = this.getIndustryPricing().find(p => p.industry === industry);
    const tierPricing = this.getPricingTiers().find(t => t.id === tier);

    if (!industryPricing || !tierPricing) {
      throw new Error('Invalid industry or tier');
    }

    const basePrice = tierPricing.price * industryPricing.multiplier;
    const leadCost = Math.max(0, leads - tierPricing.maxLeads) * 0.10; // $0.10 per extra lead
    const callCost = Math.max(0, calls - tierPricing.maxCalls) * 0.25; // $0.25 per extra call
    const totalCost = basePrice + leadCost + callCost;

    // Calculate savings for annual billing
    const annualSavings = tierPricing.billingCycle === 'monthly' ? totalCost * 0.20 : 0;
    const finalCost = totalCost - annualSavings;

    // Recommend best tier
    let recommendedTier = 'starter';
    if (leads > 20000 || calls > 10000) recommendedTier = 'enterprise';
    else if (leads > 4000 || calls > 2000) recommendedTier = 'professional';

    return {
      basePrice: Math.round(basePrice),
      leadCost: Math.round(leadCost),
      callCost: Math.round(callCost),
      totalCost: Math.round(finalCost),
      savings: Math.round(annualSavings),
      recommendedTier
    };
  }

  /**
   * Get commission-based pricing for high-value deals
   */
  getCommissionPricing(industry: string, dealSize: number): {
    commissionRate: number;
    minimumCommission: number;
    maximumCommission: number;
    estimatedCommission: number;
  } {
    const commissionRates: Record<string, number> = {
      'Real Estate': 0.05, // 5%
      'Healthcare': 0.03, // 3%
      'Banking': 0.02, // 2%
      'Construction': 0.04, // 4%
      'Retail': 0.06, // 6%
      'Aviation': 0.02, // 2%
      'Energy & Utilities': 0.015, // 1.5%
      'Oil & Gas': 0.01, // 1%
      'Telecommunications': 0.02, // 2%
      'Gaming': 0.05 // 5%
    };

    const rate = commissionRates[industry] || 0.04; // Default 4%
    const estimatedCommission = dealSize * rate;
    const minimumCommission = 1000; // $1,000 minimum
    const maximumCommission = 100000; // $100,000 maximum

    return {
      commissionRate: rate,
      minimumCommission,
      maximumCommission,
      estimatedCommission: Math.min(Math.max(estimatedCommission, minimumCommission), maximumCommission)
    };
  }

  /**
   * Get FLY Token pricing and benefits
   */
  getFLYTokenPricing(): {
    tokenPrice: number;
    discountPercentage: number;
    stakingRewards: number;
    governanceBenefits: string[];
    paymentBenefits: string[];
  } {
    return {
      tokenPrice: 0.50, // $0.50 per FLY token
      discountPercentage: 20, // 20% discount for FLY payments
      stakingRewards: 12, // 12% APY staking rewards
      governanceBenefits: [
        'Vote on platform decisions',
        'Propose new features',
        'Access to exclusive features',
        'Priority customer support'
      ],
      paymentBenefits: [
        '20% discount on all services',
        'No processing fees',
        'Instant settlement',
        'Global accessibility',
        'Privacy protection'
      ]
    };
  }

  /**
   * Get enterprise custom pricing options
   */
  getEnterprisePricing(): {
    minimumCommitment: number;
    volumeDiscounts: Array<{ volume: number; discount: number }>;
    customFeatures: string[];
    implementationCost: number;
    trainingCost: number;
    supportCost: number;
  } {
    return {
      minimumCommitment: 50000, // $50,000 minimum annual commitment
      volumeDiscounts: [
        { volume: 100000, discount: 10 }, // 10% off $100K+
        { volume: 250000, discount: 15 }, // 15% off $250K+
        { volume: 500000, discount: 20 }, // 20% off $500K+
        { volume: 1000000, discount: 25 } // 25% off $1M+
      ],
      customFeatures: [
        'Custom AI persona development',
        'White-label platform',
        'On-premise deployment',
        'Custom integrations',
        'Dedicated infrastructure',
        'SLA guarantees',
        'Custom reporting'
      ],
      implementationCost: 10000, // $10,000 implementation fee
      trainingCost: 5000, // $5,000 training fee
      supportCost: 2000 // $2,000/month premium support
    };
  }

  /**
   * Generate pricing proposal for client
   */
  generatePricingProposal(
    industry: string,
    companySize: 'small' | 'medium' | 'large' | 'enterprise',
    expectedLeads: number,
    expectedCalls: number,
    dealSize?: number
  ): {
    recommendedTier: string;
    monthlyCost: number;
    annualCost: number;
    savings: number;
    roi: number;
    paymentOptions: Array<{ method: string; cost: number; benefits: string[] }>;
    nextSteps: string[];
  } {
    // Determine recommended tier based on usage
    let recommendedTier = 'starter';
    if (companySize === 'enterprise' || expectedLeads > 20000) {
      recommendedTier = 'custom';
    } else if (companySize === 'large' || expectedLeads > 4000) {
      recommendedTier = 'enterprise';
    } else if (companySize === 'medium' || expectedLeads > 1000) {
      recommendedTier = 'professional';
    }

    const pricing = this.calculatePricing(industry, recommendedTier, expectedLeads, expectedCalls);
    
    // Calculate ROI based on deal size
    let roi = 0;
    if (dealSize) {
      const commission = this.getCommissionPricing(industry, dealSize);
      roi = (commission.estimatedCommission / pricing.totalCost) * 100;
    }

    const paymentOptions = [
      {
        method: 'Monthly Credit Card',
        cost: pricing.totalCost,
        benefits: ['Immediate access', 'Flexible billing', 'Easy cancellation']
      },
      {
        method: 'Annual Payment',
        cost: pricing.totalCost * 10, // 2 months free
        benefits: ['20% savings', 'Priority support', 'Free setup']
      },
      {
        method: 'FLY Token Payment',
        cost: pricing.totalCost * 0.8, // 20% discount
        benefits: ['20% discount', 'No processing fees', 'Governance rights']
      }
    ];

    const nextSteps = [
      'Schedule demo with industry specialist',
      'Review custom pricing options',
      'Set up payment method',
      'Begin onboarding process',
      'Launch first campaign'
    ];

    return {
      recommendedTier,
      monthlyCost: pricing.totalCost,
      annualCost: pricing.totalCost * 10, // 2 months free
      savings: pricing.savings,
      roi,
      paymentOptions,
      nextSteps
    };
  }
}

export default PaymentSystem;
