"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface BillingData {
  currentPlan: {
    name: string;
    price: number;
    status: string;
    nextBilling: string;
  };
  usage: {
    requests: number;
    limit: number;
    overage: number;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    downloadUrl: string;
  }>;
  paymentMethods: Array<{
    id: string;
    type: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
  }>;
}

const BillingDashboard: React.FC = () => {
  const [billing, setBilling] = useState<BillingData>({
    currentPlan: {
      name: 'Professional',
      price: 99.99,
      status: 'active',
      nextBilling: '2024-10-16'
    },
    usage: {
      requests: 7500,
      limit: 10000,
      overage: 0
    },
    invoices: [],
    paymentMethods: []
  });
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscription data
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, pricing_tiers(*)')
        .eq('status', 'active')
        .single();

      // Fetch usage data
      const { data: usage } = await supabase
        .from('usage_logs')
        .select('*')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      // Fetch invoices
      const { data: invoices } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch payment methods
      const { data: paymentMethods } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (subscription) {
        setBilling(prev => ({
          ...prev,
          currentPlan: {
            name: subscription.pricing_tiers?.name || 'Professional',
            price: subscription.pricing_tiers?.price || 99.99,
            status: subscription.status,
            nextBilling: subscription.next_billing_date || '2024-10-16'
          },
          usage: {
            requests: usage?.length || 0,
            limit: subscription.pricing_tiers?.max_requests || 10000,
            overage: Math.max(0, (usage?.length || 0) - (subscription.pricing_tiers?.max_requests || 10000))
          },
          invoices: invoices?.map(inv => ({
            id: inv.id,
            date: inv.created_at,
            amount: inv.amount,
            status: inv.status,
            downloadUrl: `#`
          })) || [],
          paymentMethods: paymentMethods?.map(pm => ({
            id: pm.id,
            type: pm.type,
            last4: pm.last_four_digits,
            expiry: pm.expiry_month + '/' + pm.expiry_year,
            isDefault: pm.is_default
          })) || []
        }));
      }
      
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planName: string) => {
    try {
      // Implement upgrade logic
      console.log(`Upgrading to ${planName}`);
      setShowUpgrade(false);
    } catch (error) {
      console.error('Error upgrading plan:', error);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Implement invoice download
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const handleUpdatePaymentMethod = () => {
    // Implement payment method update
    console.log('Updating payment method');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Billing & Usage</h1>
            <p className="text-gray-400 mt-2">Manage your subscription and payment methods</p>
          </div>
          
          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Current Plan */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Current Plan</h2>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">{billing.currentPlan.name}</h3>
              <p className="text-gray-400">${billing.currentPlan.price}/month</p>
              <p className="text-sm text-green-400 mt-1">
                Status: {billing.currentPlan.status.charAt(0).toUpperCase() + billing.currentPlan.status.slice(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Next billing date</p>
              <p className="text-white font-semibold">
                {new Date(billing.currentPlan.nextBilling).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">API Requests</span>
                  <span className="text-white font-semibold">
                    {billing.usage.requests.toLocaleString()} / {billing.usage.limit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(billing.usage.requests / billing.usage.limit) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {billing.usage.overage > 0 && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm">
                    Overage: {billing.usage.overage.toLocaleString()} requests
                  </p>
                  <p className="text-red-300 text-xs mt-1">
                    Additional charges may apply
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {billing.paymentMethods.length > 0 ? (
                billing.paymentMethods.map((method) => (
                  <div key={method.id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                        💳
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {method.type.toUpperCase()} •••• {method.last4}
                        </p>
                        <p className="text-gray-400 text-sm">Expires {method.expiry}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="bg-green-600 text-green-100 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No payment methods on file</p>
              )}
              
              <button
                onClick={handleUpdatePaymentMethod}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Add Payment Method
              </button>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Invoices</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-300 py-3">Date</th>
                  <th className="text-left text-gray-300 py-3">Amount</th>
                  <th className="text-left text-gray-300 py-3">Status</th>
                  <th className="text-left text-gray-300 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {billing.invoices.length > 0 ? (
                  billing.invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-700/50">
                      <td className="py-3 text-white">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-white font-semibold">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          invoice.status === 'completed' 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgrade && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Upgrade Plan</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleUpgrade('Professional')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Professional - $99.99/month
                </button>
                <button
                  onClick={() => handleUpgrade('Enterprise')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Enterprise - $299.99/month
                </button>
              </div>
              <button
                onClick={() => setShowUpgrade(false)}
                className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingDashboard;
