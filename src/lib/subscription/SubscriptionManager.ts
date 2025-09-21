/**
 * MetisAI Subscription Management System
 * Handles subscription lifecycle, billing, and usage tracking
 */

export interface Subscription {
  id: string;
  userId: string;
  organizationId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'suspended' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  paymentMethod: PaymentMethod;
  billingAddress: BillingAddress;
  usage: UsageMetrics;
  limits: SubscriptionLimits;
  features: SubscriptionFeatures;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  monthlyPrice: number;
  annualPrice: number;
  includedOperations: number;
  maxUsers: number;
  features: string[];
  limitations: string[];
  overageRate: number;
  setupFee: number;
  consultingHours: number;
  supportLevel: string;
  sla: string;
  contractLength: number;
  earlyTerminationFee: number;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'wire_transfer' | 'crypto';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  status: 'active' | 'expired' | 'failed';
}

export interface BillingAddress {
  company: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId?: string;
  vatNumber?: string;
}

export interface UsageMetrics {
  currentPeriod: {
    operations: number;
    algorithms: string[];
    users: number;
    storage: number; // GB
    apiCalls: number;
  };
  previousPeriod: {
    operations: number;
    algorithms: string[];
    users: number;
    storage: number;
    apiCalls: number;
  };
  lifetime: {
    operations: number;
    algorithms: string[];
    users: number;
    storage: number;
    apiCalls: number;
  };
  lastUpdated: string;
}

export interface SubscriptionLimits {
  maxOperations: number;
  maxUsers: number;
  maxAlgorithms: number;
  maxStorage: number; // GB
  maxApiCalls: number;
  maxConcurrentRequests: number;
  dataRetentionDays: number;
  supportTickets: number;
  consultingHours: number;
}

export interface SubscriptionFeatures {
  algorithms: string[];
  integrations: string[];
  support: string[];
  analytics: string[];
  customizations: string[];
  whiteLabel: boolean;
  sso: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  customSla: boolean;
}

export interface BillingCycle {
  id: string;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  subtotal: number;
  taxes: number;
  fees: number;
  discounts: number;
  total: number;
  currency: string;
  invoiceNumber: string;
  paymentMethod: string;
  dueDate: string;
  paidDate?: string;
  items: BillingItem[];
}

export interface BillingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: 'subscription' | 'usage' | 'overage' | 'setup' | 'consulting' | 'addon';
  algorithmId?: string;
  period: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  taxes: number;
  fees: number;
  discounts: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paidDate?: string;
  items: BillingItem[];
  pdfUrl: string;
  paymentUrl: string;
}

export interface UsageAlert {
  id: string;
  subscriptionId: string;
  type: 'usage' | 'billing' | 'limit' | 'expiry';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold: number;
  currentValue: number;
  isRead: boolean;
  createdAt: string;
  actionRequired: boolean;
  actionUrl?: string;
}

export class SubscriptionManager {
  private subscriptions: Map<string, Subscription>;
  private billingCycles: Map<string, BillingCycle>;
  private invoices: Map<string, Invoice>;
  private usageAlerts: Map<string, UsageAlert>;

  constructor() {
    this.subscriptions = new Map();
    this.billingCycles = new Map();
    this.invoices = new Map();
    this.usageAlerts = new Map();
  }

  /**
   * Create new subscription
   */
  async createSubscription(
    userId: string,
    organizationId: string,
    planId: string,
    paymentMethod: PaymentMethod,
    billingAddress: BillingAddress,
    options: CreateSubscriptionOptions = {}
  ): Promise<Subscription> {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const plan = this.getSubscriptionPlan(planId);
    
    if (!plan) {
      throw new Error(`Subscription plan ${planId} not found`);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.contractLength);

    const subscription: Subscription = {
      id: subscriptionId,
      userId,
      organizationId,
      plan,
      status: 'pending',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      nextBillingDate: this.calculateNextBillingDate(startDate, options.billingCycle || 'monthly'),
      autoRenew: options.autoRenew !== false,
      paymentMethod,
      billingAddress,
      usage: this.initializeUsageMetrics(),
      limits: this.getSubscriptionLimits(plan),
      features: this.getSubscriptionFeatures(plan),
      createdAt: startDate.toISOString(),
      updatedAt: startDate.toISOString()
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Process initial payment
    await this.processPayment(subscriptionId, plan.setupFee + (options.billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice));

    // Update status to active
    subscription.status = 'active';
    subscription.updatedAt = new Date().toISOString();

    return subscription;
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(
    subscriptionId: string,
    newPlanId: string,
    effectiveDate?: string
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const newPlan = this.getSubscriptionPlan(newPlanId);
    if (!newPlan) {
      throw new Error(`Subscription plan ${newPlanId} not found`);
    }

    const effective = effectiveDate ? new Date(effectiveDate) : new Date();
    
    // Calculate proration
    const proration = this.calculateProration(subscription, newPlan, effective);
    
    // Update subscription
    subscription.plan = newPlan;
    subscription.limits = this.getSubscriptionLimits(newPlan);
    subscription.features = this.getSubscriptionFeatures(newPlan);
    subscription.updatedAt = new Date().toISOString();

    // Create billing adjustment if needed
    if (proration !== 0) {
      await this.createBillingAdjustment(subscriptionId, proration, 'Plan upgrade proration');
    }

    return subscription;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    reason: string,
    effectiveDate?: string
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const effective = effectiveDate ? new Date(effectiveDate) : new Date();
    
    // Calculate early termination fee
    const terminationFee = this.calculateEarlyTerminationFee(subscription, effective);
    
    if (terminationFee > 0) {
      await this.createBillingAdjustment(subscriptionId, terminationFee, 'Early termination fee');
    }

    subscription.status = 'cancelled';
    subscription.endDate = effective.toISOString();
    subscription.updatedAt = new Date().toISOString();

    return subscription;
  }

  /**
   * Process billing cycle
   */
  async processBillingCycle(subscriptionId: string): Promise<BillingCycle> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const billingCycleId = `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startDate = new Date(subscription.nextBillingDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Calculate usage and overages
    const usage = await this.calculateUsage(subscriptionId, startDate, endDate);
    const overage = this.calculateOverage(subscription, usage);
    
    // Calculate costs
    const subtotal = subscription.plan.monthlyPrice + overage.totalCost;
    const taxes = this.calculateTaxes(subtotal, subscription.billingAddress);
    const fees = this.calculateFees(subtotal);
    const discounts = this.calculateDiscounts(subscription, usage);
    const total = subtotal + taxes + fees - discounts;

    const billingCycle: BillingCycle = {
      id: billingCycleId,
      subscriptionId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'processing',
      subtotal,
      taxes,
      fees,
      discounts,
      total,
      currency: 'USD',
      invoiceNumber: this.generateInvoiceNumber(),
      paymentMethod: subscription.paymentMethod.id,
      dueDate: endDate.toISOString(),
      items: this.generateBillingItems(subscription, usage, overage)
    };

    this.billingCycles.set(billingCycleId, billingCycle);

    // Process payment
    const paymentResult = await this.processPayment(subscriptionId, total);
    
    if (paymentResult.success) {
      billingCycle.status = 'completed';
      billingCycle.paidDate = new Date().toISOString();
      subscription.nextBillingDate = this.calculateNextBillingDate(endDate, 'monthly');
    } else {
      billingCycle.status = 'failed';
      subscription.status = 'suspended';
    }

    subscription.updatedAt = new Date().toISOString();

    return billingCycle;
  }

  /**
   * Get subscription by ID
   */
  getSubscription(subscriptionId: string): Subscription | undefined {
    return this.subscriptions.get(subscriptionId);
  }

  /**
   * Get subscriptions by user
   */
  getSubscriptionsByUser(userId: string): Subscription[] {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId);
  }

  /**
   * Get subscriptions by organization
   */
  getSubscriptionsByOrganization(organizationId: string): Subscription[] {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.organizationId === organizationId);
  }

  /**
   * Track usage
   */
  async trackUsage(
    subscriptionId: string,
    algorithmId: string,
    operations: number,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    // Update usage metrics
    subscription.usage.currentPeriod.operations += operations;
    if (!subscription.usage.currentPeriod.algorithms.includes(algorithmId)) {
      subscription.usage.currentPeriod.algorithms.push(algorithmId);
    }
    subscription.usage.lifetime.operations += operations;
    if (!subscription.usage.lifetime.algorithms.includes(algorithmId)) {
      subscription.usage.lifetime.algorithms.push(algorithmId);
    }
    subscription.usage.lastUpdated = new Date().toISOString();

    // Check for usage alerts
    await this.checkUsageAlerts(subscription);

    subscription.updatedAt = new Date().toISOString();
  }

  /**
   * Get usage alerts
   */
  getUsageAlerts(subscriptionId: string): UsageAlert[] {
    return Array.from(this.usageAlerts.values())
      .filter(alert => alert.subscriptionId === subscriptionId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get billing history
   */
  getBillingHistory(subscriptionId: string): BillingCycle[] {
    return Array.from(this.billingCycles.values())
      .filter(cycle => cycle.subscriptionId === subscriptionId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  /**
   * Generate invoice
   */
  async generateInvoice(billingCycleId: string): Promise<Invoice> {
    const billingCycle = this.billingCycles.get(billingCycleId);
    if (!billingCycle) {
      throw new Error(`Billing cycle ${billingCycleId} not found`);
    }

    const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invoice: Invoice = {
      id: invoiceId,
      subscriptionId: billingCycle.subscriptionId,
      invoiceNumber: billingCycle.invoiceNumber,
      issueDate: new Date().toISOString(),
      dueDate: billingCycle.dueDate,
      status: 'draft',
      subtotal: billingCycle.subtotal,
      taxes: billingCycle.taxes,
      fees: billingCycle.fees,
      discounts: billingCycle.discounts,
      total: billingCycle.total,
      currency: billingCycle.currency,
      paymentMethod: billingCycle.paymentMethod,
      paidDate: billingCycle.paidDate,
      items: billingCycle.items,
      pdfUrl: `/invoices/${invoiceId}.pdf`,
      paymentUrl: `/payments/${invoiceId}`
    };

    this.invoices.set(invoiceId, invoice);

    return invoice;
  }

  private getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
    // This would typically fetch from a database
    const plans: Record<string, SubscriptionPlan> = {
      'starter': {
        id: 'starter',
        name: 'Starter',
        tier: 'starter',
        monthlyPrice: 5000,
        annualPrice: 50000,
        includedOperations: 10000,
        maxUsers: 5,
        features: ['Basic QUBO algorithms', 'Standard support'],
        limitations: ['Limited algorithms', 'No custom development'],
        overageRate: 2.0,
        setupFee: 10000,
        consultingHours: 5,
        supportLevel: 'basic',
        sla: '99.5% uptime',
        contractLength: 12,
        earlyTerminationFee: 5000
      },
      'professional': {
        id: 'professional',
        name: 'Professional',
        tier: 'professional',
        monthlyPrice: 15000,
        annualPrice: 150000,
        includedOperations: 50000,
        maxUsers: 25,
        features: ['All QUBO algorithms', 'Priority support'],
        limitations: ['Limited custom development'],
        overageRate: 1.8,
        setupFee: 25000,
        consultingHours: 20,
        supportLevel: 'standard',
        sla: '99.7% uptime',
        contractLength: 12,
        earlyTerminationFee: 15000
      },
      'enterprise': {
        id: 'enterprise',
        name: 'Enterprise',
        tier: 'enterprise',
        monthlyPrice: 50000,
        annualPrice: 500000,
        includedOperations: 200000,
        maxUsers: 100,
        features: ['All algorithms', 'Custom development', 'Dedicated support'],
        limitations: [],
        overageRate: 1.5,
        setupFee: 100000,
        consultingHours: 100,
        supportLevel: 'enterprise',
        sla: '99.9% uptime',
        contractLength: 24,
        earlyTerminationFee: 50000
      }
    };

    return plans[planId];
  }

  private initializeUsageMetrics(): UsageMetrics {
    return {
      currentPeriod: {
        operations: 0,
        algorithms: [],
        users: 0,
        storage: 0,
        apiCalls: 0
      },
      previousPeriod: {
        operations: 0,
        algorithms: [],
        users: 0,
        storage: 0,
        apiCalls: 0
      },
      lifetime: {
        operations: 0,
        algorithms: [],
        users: 0,
        storage: 0,
        apiCalls: 0
      },
      lastUpdated: new Date().toISOString()
    };
  }

  private getSubscriptionLimits(plan: SubscriptionPlan): SubscriptionLimits {
    return {
      maxOperations: plan.includedOperations,
      maxUsers: plan.maxUsers,
      maxAlgorithms: plan.features.includes('All QUBO algorithms') ? 999 : 5,
      maxStorage: plan.tier === 'enterprise' ? 1000 : 100,
      maxApiCalls: plan.tier === 'enterprise' ? 1000000 : 100000,
      maxConcurrentRequests: plan.tier === 'enterprise' ? 100 : 10,
      dataRetentionDays: plan.tier === 'enterprise' ? 365 : 90,
      supportTickets: plan.tier === 'enterprise' ? 999 : 10,
      consultingHours: plan.consultingHours
    };
  }

  private getSubscriptionFeatures(plan: SubscriptionPlan): SubscriptionFeatures {
    return {
      algorithms: plan.features.includes('All QUBO algorithms') 
        ? ['qubo_portfolio_optimization', 'qubo_vehicle_routing', 'qubo_machine_learning', 'qubo_energy_optimization', 'qubo_drug_discovery']
        : ['qubo_portfolio_optimization', 'qubo_vehicle_routing'],
      integrations: plan.tier === 'enterprise' ? ['API', 'Webhooks', 'SSO', 'Custom'] : ['API'],
      support: plan.features.filter(f => f.includes('support')),
      analytics: plan.tier === 'enterprise' ? ['Advanced', 'Custom', 'Real-time'] : ['Basic'],
      customizations: plan.tier === 'enterprise' ? ['Full', 'Custom algorithms', 'White-label'] : ['Limited'],
      whiteLabel: plan.tier === 'enterprise',
      sso: plan.tier === 'enterprise',
      apiAccess: true,
      webhooks: plan.tier !== 'starter',
      customSla: plan.tier === 'enterprise'
    };
  }

  private calculateNextBillingDate(startDate: Date, billingCycle: string): string {
    const nextDate = new Date(startDate);
    if (billingCycle === 'annual') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return nextDate.toISOString();
  }

  private async processPayment(subscriptionId: string, amount: number): Promise<{ success: boolean; transactionId?: string }> {
    // Mock payment processing
    return { success: true, transactionId: `txn_${Date.now()}` };
  }

  private calculateProration(subscription: Subscription, newPlan: SubscriptionPlan, effectiveDate: Date): number {
    // Simplified proration calculation
    const remainingDays = Math.ceil((new Date(subscription.endDate).getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((new Date(subscription.endDate).getTime() - new Date(subscription.startDate).getTime()) / (1000 * 60 * 60 * 24));
    
    const currentPlanValue = subscription.plan.monthlyPrice * (remainingDays / totalDays);
    const newPlanValue = newPlan.monthlyPrice * (remainingDays / totalDays);
    
    return newPlanValue - currentPlanValue;
  }

  private calculateEarlyTerminationFee(subscription: Subscription, effectiveDate: Date): number {
    const remainingMonths = Math.ceil((new Date(subscription.endDate).getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return subscription.plan.earlyTerminationFee * (remainingMonths / subscription.plan.contractLength);
  }

  private async calculateUsage(subscriptionId: string, startDate: Date, endDate: Date): Promise<UsageMetrics> {
    // Mock usage calculation
    return {
      currentPeriod: {
        operations: 15000,
        algorithms: ['qubo_portfolio_optimization', 'qubo_vehicle_routing'],
        users: 8,
        storage: 25,
        apiCalls: 50000
      },
      previousPeriod: {
        operations: 12000,
        algorithms: ['qubo_portfolio_optimization'],
        users: 6,
        storage: 20,
        apiCalls: 40000
      },
      lifetime: {
        operations: 50000,
        algorithms: ['qubo_portfolio_optimization', 'qubo_vehicle_routing'],
        users: 8,
        storage: 25,
        apiCalls: 150000
      },
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateOverage(subscription: Subscription, usage: UsageMetrics): { totalCost: number; breakdown: any } {
    const overageOperations = Math.max(0, usage.currentPeriod.operations - subscription.limits.maxOperations);
    const overageRate = subscription.plan.overageRate;
    const operationPrice = 0.50; // Base operation price
    
    const overageCost = overageOperations * operationPrice * overageRate;
    
    return {
      totalCost: overageCost,
      breakdown: {
        overageOperations,
        operationPrice,
        overageRate,
        overageCost
      }
    };
  }

  private calculateTaxes(subtotal: number, billingAddress: BillingAddress): number {
    // Simplified tax calculation
    const taxRates: Record<string, number> = {
      'US': 0.08,
      'CA': 0.13,
      'EU': 0.20,
      'UK': 0.20
    };
    
    const taxRate = taxRates[billingAddress.country] || 0.08;
    return subtotal * taxRate;
  }

  private calculateFees(subtotal: number): number {
    // Processing fees
    return subtotal * 0.029 + 0.30; // 2.9% + $0.30
  }

  private calculateDiscounts(subscription: Subscription, usage: UsageMetrics): number {
    // Volume discounts
    if (usage.currentPeriod.operations >= 100000) {
      return subscription.plan.monthlyPrice * 0.1; // 10% discount
    }
    return 0;
  }

  private generateBillingItems(subscription: Subscription, usage: UsageMetrics, overage: any): BillingItem[] {
    const items: BillingItem[] = [
      {
        id: 'subscription',
        description: `${subscription.plan.name} Plan`,
        quantity: 1,
        unitPrice: subscription.plan.monthlyPrice,
        totalPrice: subscription.plan.monthlyPrice,
        type: 'subscription',
        period: 'monthly'
      }
    ];

    if (overage.totalCost > 0) {
      items.push({
        id: 'overage',
        description: `Overage (${overage.breakdown.overageOperations} operations)`,
        quantity: overage.breakdown.overageOperations,
        unitPrice: overage.breakdown.operationPrice * overage.breakdown.overageRate,
        totalPrice: overage.totalCost,
        type: 'overage',
        period: 'monthly'
      });
    }

    return items;
  }

  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }

  private async createBillingAdjustment(subscriptionId: string, amount: number, description: string): Promise<void> {
    // Create billing adjustment
  }

  private async checkUsageAlerts(subscription: Subscription): Promise<void> {
    const usage = subscription.usage.currentPeriod;
    const limits = subscription.limits;

    // Check operation usage
    if (usage.operations > limits.maxOperations * 0.8) {
      await this.createUsageAlert(subscription.id, 'usage', 'high', 
        `You've used ${usage.operations} operations (${Math.round(usage.operations / limits.maxOperations * 100)}% of your limit)`,
        limits.maxOperations, usage.operations
      );
    }

    // Check user limit
    if (usage.users > limits.maxUsers * 0.9) {
      await this.createUsageAlert(subscription.id, 'limit', 'critical',
        `You're approaching your user limit (${usage.users}/${limits.maxUsers})`,
        limits.maxUsers, usage.users
      );
    }
  }

  private async createUsageAlert(
    subscriptionId: string,
    type: string,
    severity: string,
    message: string,
    threshold: number,
    currentValue: number
  ): Promise<void> {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alert: UsageAlert = {
      id: alertId,
      subscriptionId,
      type: type as any,
      severity: severity as any,
      message,
      threshold,
      currentValue,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionRequired: severity === 'critical'
    };

    this.usageAlerts.set(alertId, alert);
  }
}

export interface CreateSubscriptionOptions {
  billingCycle?: 'monthly' | 'quarterly' | 'annually';
  autoRenew?: boolean;
  customPricing?: any;
  trialPeriod?: number; // days
}
