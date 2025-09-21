/**
 * PayPal Integration for MetisAI Payment Processing
 * Secure payment processing with your PayPal credentials
 */

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  businessEmail: string;
  mode: 'sandbox' | 'live';
  currency: string;
}

export interface PayPalOrder {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  amount: number;
  currency: string;
  payerId?: string;
  approvalUrl?: string;
  executeUrl?: string;
}

export interface PayPalSubscription {
  id: string;
  status: 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  planId: string;
  subscriberId: string;
  startTime: string;
  nextBillingTime?: string;
}

export class PayPalIntegration {
  private config: PayPalConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      clientId: process.env.PAYPAL_CLIENT_ID || 'ARbHoAvcE25ruW5AoK414FTnkW_ufJWWiPwPgHyyU7ypOyDLIRKvNpoaEOGyV4j8U6Wxvtk-3OjA-LxK',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'ARbHoAvcE25ruW5AoK414FTnkW_ufJWWiPwPgHyyU7ypOyDLIRKvNpoaEOGyV4j8U6Wxvtk-3OjA-LxK',
      businessEmail: process.env.PAYPAL_BUSINESS_EMAIL || 'sb-dgk9m29775091@business.example.com',
      mode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox',
      currency: 'USD'
    };

    this.baseUrl = this.config.mode === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  /**
   * Get PayPal access token
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`PayPal auth failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting PayPal access token:', error);
      throw new Error('Failed to get PayPal access token');
    }
  }

  /**
   * Create a PayPal order for one-time payment
   */
  async createOrder(
    amount: number,
    description: string,
    returnUrl: string,
    cancelUrl: string,
    customId?: string
  ): Promise<PayPalOrder> {
    try {
      const accessToken = await this.getAccessToken();

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: this.config.currency,
            value: amount.toFixed(2)
          },
          description: description,
          custom_id: customId || `metisai_${Date.now()}`
        }],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'MetisAI',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW'
        }
      };

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `metisai_${Date.now()}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`PayPal order creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        status: data.status,
        amount: parseFloat(data.purchase_units[0].amount.value),
        currency: data.purchase_units[0].amount.currency_code,
        approvalUrl: data.links.find((link: any) => link.rel === 'approve')?.href,
        executeUrl: data.links.find((link: any) => link.rel === 'capture')?.href
      };
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  /**
   * Capture a PayPal order
   */
  async captureOrder(orderId: string): Promise<{
    success: boolean;
    transactionId: string;
    amount: number;
    status: string;
  }> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `metisai_capture_${Date.now()}`
        }
      });

      if (!response.ok) {
        throw new Error(`PayPal capture failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'COMPLETED') {
        const transaction = data.purchase_units[0].payments.captures[0];
        return {
          success: true,
          transactionId: transaction.id,
          amount: parseFloat(transaction.amount.value),
          status: data.status
        };
      }

      return {
        success: false,
        transactionId: '',
        amount: 0,
        status: data.status
      };
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw new Error('Failed to capture PayPal order');
    }
  }

  /**
   * Create a subscription plan
   */
  async createSubscriptionPlan(
    name: string,
    description: string,
    price: number,
    interval: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
  ): Promise<string> {
    try {
      const accessToken = await this.getAccessToken();

      const planData = {
        product_id: `metisai_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        name: name,
        description: description,
        status: 'ACTIVE',
        billing_cycles: [{
          frequency: {
            interval_unit: interval,
            interval_count: 1
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // Unlimited
          pricing_scheme: {
            fixed_price: {
              value: price.toFixed(2),
              currency_code: this.config.currency
            }
          }
        }],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3
        }
      };

      const response = await fetch(`${this.baseUrl}/v1/billing/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `metisai_plan_${Date.now()}`
        },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        throw new Error(`PayPal plan creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating PayPal subscription plan:', error);
      throw new Error('Failed to create subscription plan');
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(
    planId: string,
    subscriberEmail: string,
    returnUrl: string,
    cancelUrl: string
  ): Promise<PayPalSubscription> {
    try {
      const accessToken = await this.getAccessToken();

      const subscriptionData = {
        plan_id: planId,
        subscriber: {
          email_address: subscriberEmail
        },
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'MetisAI',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW'
        }
      };

      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `metisai_sub_${Date.now()}`
        },
        body: JSON.stringify(subscriptionData)
      });

      if (!response.ok) {
        throw new Error(`PayPal subscription creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        status: data.status,
        planId: data.plan_id,
        subscriberId: data.subscriber.payer_id,
        startTime: data.start_time,
        nextBillingTime: data.billing_info?.next_billing_time
      };
    } catch (error) {
      console.error('Error creating PayPal subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<PayPalSubscription> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`PayPal subscription retrieval failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        status: data.status,
        planId: data.plan_id,
        subscriberId: data.subscriber.payer_id,
        startTime: data.start_time,
        nextBillingTime: data.billing_info?.next_billing_time
      };
    } catch (error) {
      console.error('Error getting PayPal subscription:', error);
      throw new Error('Failed to get subscription');
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();

      const cancelData = {
        reason: reason || 'Customer requested cancellation'
      };

      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(cancelData)
      });

      return response.ok;
    } catch (error) {
      console.error('Error canceling PayPal subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get PayPal configuration for frontend
   */
  getPayPalConfig(): {
    clientId: string;
    currency: string;
    mode: string;
    businessEmail: string;
  } {
    return {
      clientId: this.config.clientId,
      currency: this.config.currency,
      mode: this.config.mode,
      businessEmail: this.config.businessEmail
    };
  }

  /**
   * Verify PayPal webhook
   */
  async verifyWebhook(
    headers: Record<string, string>,
    body: string,
    webhookId: string
  ): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();

      const verificationData = {
        auth_algo: headers['paypal-auth-algo'],
        cert_id: headers['paypal-cert-id'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body)
      };

      const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(verificationData)
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('Error verifying PayPal webhook:', error);
      return false;
    }
  }
}

export default PayPalIntegration;
