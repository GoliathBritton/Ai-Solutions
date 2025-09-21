"use client";

import React, { useState, useEffect } from 'react';
import { QUBOCatalog } from '@/lib/quantum/QUBOCatalog';
import { DynamicPricing } from '@/lib/pricing/DynamicPricing';
import { QuantumMarketplace } from '@/lib/marketplace/QuantumMarketplace';

interface PremiumPricingDashboardProps {
  className?: string;
}

interface PricingTier {
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
  supportLevel: string;
  sla: string;
  contractLength: number;
  earlyTerminationFee: number;
}

interface AlgorithmPricing {
  id: string;
  name: string;
  basePrice: number;
  usagePrice: number;
  setupFee: number;
  consultingFee: number;
  enterprisePrice: number;
  overageRate: number;
  minimumCommitment: number;
  volumeDiscounts: Array<{
    minOperations: number;
    discountRate: number;
    description: string;
  }>;
}

export default function PremiumPricingDashboard({ className = "" }: PremiumPricingDashboardProps) {
  const [quboCatalog] = useState(new QUBOCatalog());
  const [dynamicPricing] = useState(new DynamicPricing());
  const [marketplace] = useState(new QuantumMarketplace());
  
  const [selectedTier, setSelectedTier] = useState<string>('professional');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);
  const [monthlyOperations, setMonthlyOperations] = useState(50000);
  const [isAnnual, setIsAnnual] = useState(false);
  const [includeConsulting, setIncludeConsulting] = useState(false);
  const [consultingHours, setConsultingHours] = useState(20);
  const [includeSetup, setIncludeSetup] = useState(true);
  
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [algorithms, setAlgorithms] = useState<AlgorithmPricing[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [breakdown, setBreakdown] = useState<any>({});

  useEffect(() => {
    loadPricingData();
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [selectedTier, selectedAlgorithms, monthlyOperations, isAnnual, includeConsulting, consultingHours, includeSetup]);

  const loadPricingData = () => {
    const tiers = dynamicPricing.getAllPricingTiers();
    setPricingTiers(tiers);
    
    const catalogAlgorithms = quboCatalog.getAllAlgorithms();
    const algorithmPricing = catalogAlgorithms.map(alg => ({
      id: alg.id,
      name: alg.name,
      basePrice: alg.pricing.basePrice,
      usagePrice: alg.pricing.usagePrice,
      setupFee: alg.pricing.setupFee,
      consultingFee: alg.pricing.consultingFee,
      enterprisePrice: alg.pricing.enterprisePrice,
      overageRate: alg.pricing.overageRate,
      minimumCommitment: alg.pricing.minimumCommitment,
      volumeDiscounts: alg.pricing.volumeDiscounts
    }));
    setAlgorithms(algorithmPricing);
  };

  const calculateTotalCost = () => {
    const tier = pricingTiers.find(t => t.id === selectedTier);
    if (!tier) return;

    let total = 0;
    const costBreakdown: any = {
      subscription: 0,
      algorithms: 0,
      setup: 0,
      consulting: 0,
      overage: 0,
      discounts: 0
    };

    // Subscription cost
    const subscriptionCost = isAnnual ? tier.annualPrice : tier.monthlyPrice;
    costBreakdown.subscription = subscriptionCost;
    total += subscriptionCost;

    // Algorithm costs
    let algorithmCost = 0;
    selectedAlgorithms.forEach(algorithmId => {
      const algorithm = algorithms.find(a => a.id === algorithmId);
      if (algorithm) {
        const algorithmPrice = selectedTier === 'custom' ? algorithm.enterprisePrice : algorithm.basePrice;
        algorithmCost += algorithmPrice;
      }
    });
    costBreakdown.algorithms = algorithmCost;
    total += algorithmCost;

    // Setup fees
    if (includeSetup) {
      let setupCost = 0;
      selectedAlgorithms.forEach(algorithmId => {
        const algorithm = algorithms.find(a => a.id === algorithmId);
        if (algorithm) {
          setupCost += algorithm.setupFee;
        }
      });
      costBreakdown.setup = setupCost;
      total += setupCost;
    }

    // Consulting fees
    if (includeConsulting) {
      const consultingCost = consultingHours * 500; // Base consulting rate
      costBreakdown.consulting = consultingCost;
      total += consultingCost;
    }

    // Overage calculation
    const includedOperations = tier.includedOperations;
    if (monthlyOperations > includedOperations) {
      const overageOperations = monthlyOperations - includedOperations;
      const overageRate = tier.overageRate;
      const operationPrice = 0.30; // Base operation price
      const overageCost = overageOperations * operationPrice * overageRate;
      costBreakdown.overage = overageCost;
      total += overageCost;
    }

    // Volume discounts
    const volumeDiscount = dynamicPricing.getVolumeDiscount(monthlyOperations, selectedTier);
    if (volumeDiscount > 0) {
      const discountAmount = total * volumeDiscount;
      costBreakdown.discounts = discountAmount;
      total -= discountAmount;
    }

    setTotalCost(total);
    setBreakdown(costBreakdown);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case 'starter': return 'border-gray-500 bg-gray-800';
      case 'professional': return 'border-blue-500 bg-blue-900/20';
      case 'enterprise': return 'border-purple-500 bg-purple-900/20';
      case 'custom': return 'border-gold-500 bg-gold-900/20';
      default: return 'border-gray-500 bg-gray-800';
    }
  };

  const getTierBadge = (tierId: string) => {
    switch (tierId) {
      case 'starter': return 'Basic';
      case 'professional': return 'Popular';
      case 'enterprise': return 'Advanced';
      case 'custom': return 'Premium';
      default: return '';
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Premium Quantum Pricing
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Access the world's most advanced quantum algorithms with our premium pricing structure. 
          Choose from flexible subscription tiers or custom enterprise solutions.
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
              selectedTier === tier.id 
                ? 'border-purple-500 bg-purple-900/30 shadow-2xl' 
                : getTierColor(tier.id)
            }`}
            onClick={() => setSelectedTier(tier.id)}
          >
            {tier.id !== 'starter' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {getTierBadge(tier.id)}
                </span>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-gray-400 mb-6">{tier.description}</p>
              
              <div className="mb-6">
                <div className="text-4xl font-bold text-white">
                  {tier.id === 'custom' ? 'Custom' : formatCurrency(isAnnual ? tier.annualPrice : tier.monthlyPrice)}
                </div>
                {tier.id !== 'custom' && (
                  <div className="text-gray-400">
                    {isAnnual ? 'per year' : 'per month'}
                    {isAnnual && (
                      <div className="text-green-400 text-sm mt-1">
                        Save {formatCurrency(tier.monthlyPrice * 12 - tier.annualPrice)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Operations</span>
                  <span className="text-white font-medium">
                    {tier.includedOperations.toLocaleString()}/month
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Users</span>
                  <span className="text-white font-medium">
                    {tier.maxUsers === 0 ? 'Unlimited' : tier.maxUsers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Support</span>
                  <span className="text-white font-medium capitalize">{tier.supportLevel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">SLA</span>
                  <span className="text-white font-medium">{tier.sla}</span>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                {tier.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
                {tier.features.length > 4 && (
                  <li className="text-gray-500">+{tier.features.length - 4} more features</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Algorithm Selection */}
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6">Select Quantum Algorithms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedAlgorithms.includes(algorithm.id)
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
              }`}
              onClick={() => {
                if (selectedAlgorithms.includes(algorithm.id)) {
                  setSelectedAlgorithms(selectedAlgorithms.filter(id => id !== algorithm.id));
                } else {
                  setSelectedAlgorithms([...selectedAlgorithms, algorithm.id]);
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">{algorithm.name}</h4>
                <span className="text-purple-400 font-bold">
                  {formatCurrency(selectedTier === 'custom' ? algorithm.enterprisePrice : algorithm.basePrice)}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Setup: {formatCurrency(algorithm.setupFee)} | 
                Usage: {formatCurrency(algorithm.usagePrice)}/1K ops
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Configuration */}
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6">Usage Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-medium text-white mb-4">
              Monthly Operations
            </label>
            <input
              type="range"
              min="1000"
              max="1000000"
              step="1000"
              value={monthlyOperations}
              onChange={(e) => setMonthlyOperations(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>1K</span>
              <span className="text-white font-medium">{monthlyOperations.toLocaleString()}</span>
              <span>1M</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="annual"
                checked={isAnnual}
                onChange={(e) => setIsAnnual(e.target.checked)}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="annual" className="text-white">
                Annual billing (Save 17%)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="consulting"
                checked={includeConsulting}
                onChange={(e) => setIncludeConsulting(e.target.checked)}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="consulting" className="text-white">
                Include consulting hours
              </label>
            </div>

            {includeConsulting && (
              <div className="ml-7">
                <label className="block text-sm text-gray-300 mb-2">Consulting Hours</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={consultingHours}
                  onChange={(e) => setConsultingHours(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="setup"
                checked={includeSetup}
                onChange={(e) => setIncludeSetup(e.target.checked)}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="setup" className="text-white">
                Include setup fees
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-6">Cost Breakdown</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-300">Subscription</span>
            <span className="text-white font-medium">{formatCurrency(breakdown.subscription || 0)}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-300">Algorithms ({selectedAlgorithms.length})</span>
            <span className="text-white font-medium">{formatCurrency(breakdown.algorithms || 0)}</span>
          </div>
          
          {includeSetup && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Setup Fees</span>
              <span className="text-white font-medium">{formatCurrency(breakdown.setup || 0)}</span>
            </div>
          )}
          
          {includeConsulting && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Consulting ({consultingHours} hours)</span>
              <span className="text-white font-medium">{formatCurrency(breakdown.consulting || 0)}</span>
            </div>
          )}
          
          {(breakdown.overage || 0) > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Overage</span>
              <span className="text-white font-medium">{formatCurrency(breakdown.overage || 0)}</span>
            </div>
          )}
          
          {(breakdown.discounts || 0) > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-green-400">Volume Discount</span>
              <span className="text-green-400 font-medium">-{formatCurrency(breakdown.discounts || 0)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-4 text-xl font-bold">
            <span className="text-white">Total {isAnnual ? '(Annual)' : '(Monthly)'}</span>
            <span className="text-purple-400">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
            Start Your Premium Subscription
          </button>
          <p className="text-gray-400 text-sm mt-4">
            30-day money-back guarantee • Cancel anytime • Enterprise support included
          </p>
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-6">Enterprise Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h4 className="text-lg font-semibold text-white mb-2">Enterprise Security</h4>
            <p className="text-gray-400">SOC 2, ISO 27001, and custom security protocols</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-lg font-semibold text-white mb-2">Dedicated Support</h4>
            <p className="text-gray-400">24/7 dedicated support with 4-hour response time</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-semibold text-white mb-2">Custom Solutions</h4>
            <p className="text-gray-400">Tailored algorithms and white-label solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
