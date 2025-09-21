/**
 * Stripe Integration for MetisAI Payment Processing
 * Secure payment processing with your Stripe credentials
 */

import Stripe from 'stripe';

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  currency: string;
  mode: 'test' | 'live';
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  metadata: Record<string, string>;
}

export class StripeIntegration {
  private stripe: Stripe;
  private config: StripeConfig;

  constructor() {
    this.config = {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_51RRxKJIBjkVTRTABnqeJXU74UTxWoBzSByXS0Nsidf4O40LqfzB2uQjDtr02OMGRSzxyXM9OGhpf83oQ8SF3jDvA00r1R1AmrR',
      secretKey: process.env.STRIPE_SECRET_KEY || 'sk_live_YOUR_STRIPE_SECRET_KEY_HERE',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_YOUR_STRIPE_WEBHOOK_SECRET_HERE',
      currency: 'usd',
      mode: 'live'
    };

    // Initialize Stripe with your credentials
    this.stripe = new Stripe(this.config.secretKey, {
      apiVersion: '2023-10-16',
      appInfo: {
        name: 'MetisAI',
        version: '1.0.0'
      }
    });
  }

  /**
   * Create a payment intent for subscription
   */
  async createPaymentIntent(
    amount: number,
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: this.config.currency,
        customer: customerId,
        metadata: {
          platform: 'MetisAI',
          service: 'AI Sales Platform',
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true
        }
      });

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert back to dollars
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret || '',
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Create a customer in Stripe
   */
  async createCustomer(
    email: string,
    name: string,
    phone?: string,
    address?: any
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        phone,
        address,
        metadata: {
          platform: 'MetisAI',
          source: 'AI Sales Platform'
        }
      });

      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Create a subscription for recurring billing
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: {
          platform: 'MetisAI',
          service: 'AI Sales Platform',
          ...metadata
        },
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Create Stripe products and prices for our pricing tiers
   */
  async setupPricingProducts(): Promise<{
    starter: Stripe.Price;
    professional: Stripe.Price;
    enterprise: Stripe.Price;
  }> {
    try {
      // Create products
      const starterProduct = await this.stripe.products.create({
        name: 'MetisAI Starter',
        description: 'Perfect for small businesses and individual agents',
        metadata: {
          tier: 'starter',
          maxLeads: '1000',
          maxCalls: '500',
          maxPersonas: '1'
        }
      });

      const professionalProduct = await this.stripe.products.create({
        name: 'MetisAI Professional',
        description: 'Ideal for growing businesses and sales teams',
        metadata: {
          tier: 'professional',
          maxLeads: '5000',
          maxCalls: '2500',
          maxPersonas: '3'
        }
      });

      const enterpriseProduct = await this.stripe.products.create({
        name: 'MetisAI Enterprise',
        description: 'For large organizations and multi-industry operations',
        metadata: {
          tier: 'enterprise',
          maxLeads: '25000',
          maxCalls: '12500',
          maxPersonas: '10'
        }
      });

      // Create prices
      const starterPrice = await this.stripe.prices.create({
        product: starterProduct.id,
        unit_amount: 29700, // $297 in cents
        currency: 'usd',
        recurring: { interval: 'month' },
        metadata: {
          tier: 'starter'
        }
      });

      const professionalPrice = await this.stripe.prices.create({
        product: professionalProduct.id,
        unit_amount: 99700, // $997 in cents
        currency: 'usd',
        recurring: { interval: 'month' },
        metadata: {
          tier: 'professional'
        }
      });

      const enterprisePrice = await this.stripe.prices.create({
        product: enterpriseProduct.id,
        unit_amount: 299700, // $2,997 in cents
        currency: 'usd',
        recurring: { interval: 'month' },
        metadata: {
          tier: 'enterprise'
        }
      });

      return {
        starter: starterPrice,
        professional: professionalPrice,
        enterprise: enterprisePrice
      };
    } catch (error) {
      console.error('Error setting up pricing products:', error);
      throw new Error('Failed to setup pricing products');
    }
  }

  /**
   * Handle successful payment
   */
  async handleSuccessfulPayment(paymentIntentId: string): Promise<{
    success: boolean;
    customerId: string;
    subscriptionId?: string;
    amount: number;
  }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          customerId: paymentIntent.customer as string,
          subscriptionId: paymentIntent.metadata?.subscriptionId,
          amount: paymentIntent.amount / 100
        };
      }

      return {
        success: false,
        customerId: '',
        amount: 0
      };
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw new Error('Failed to handle payment');
    }
  }

  /**
   * Get customer's payment methods
   */
  async getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Error getting customer payment methods:', error);
      throw new Error('Failed to get payment methods');
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw new Error('Failed to get subscription');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret
      );
      return event;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      throw new Error('Invalid webhook signature');
    }
  }

  /**
   * Get payment configuration for frontend
   */
  getPaymentConfig(): {
    publishableKey: string;
    currency: string;
    mode: string;
  } {
    return {
      publishableKey: this.config.publishableKey,
      currency: this.config.currency,
      mode: this.config.mode
    };
  }
}

export default StripeIntegration;
