"use client";

import React, { useState, useEffect } from 'react';
import { PaymentSystem } from '../../lib/payments/PaymentSystem';

const PricingDashboard: React.FC = () => {
  const [paymentSystem] = useState(() => new PaymentSystem());
  const [activeTab, setActiveTab] = useState<'tiers' | 'industries' | 'calculator' | 'enterprise'>('tiers');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Real Estate');
  const [selectedTier, setSelectedTier] = useState<string>('professional');
  const [leads, setLeads] = useState<number>(5000);
  const [calls, setCalls] = useState<number>(2500);
  const [companySize, setCompanySize] = useState<'small' | 'medium' | 'large' | 'enterprise'>('medium');

  const [pricingTiers, setPricingTiers] = useState<any[]>([]);
  const [industryPricing, setIndustryPricing] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [calculatedPricing, setCalculatedPricing] = useState<any>(null);
  const [pricingProposal, setPricingProposal] = useState<any>(null);

  useEffect(() => {
    loadPricingData();
  }, []);

  useEffect(() => {
    if (selectedIndustry && selectedTier) {
      calculatePricing();
    }
  }, [selectedIndustry, selectedTier, leads, calls]);

  useEffect(() => {
    if (selectedIndustry && companySize) {
      generateProposal();
    }
  }, [selectedIndustry, companySize, leads, calls]);

  const loadPricingData = () => {
    setPricingTiers(paymentSystem.getPricingTiers());
    setIndustryPricing(paymentSystem.getIndustryPricing());
    setPaymentMethods(paymentSystem.getPaymentMethods());
  };

  const calculatePricing = () => {
    try {
      const pricing = paymentSystem.calculatePricing(selectedIndustry, selectedTier, leads, calls);
      setCalculatedPricing(pricing);
    } catch (error) {
      console.error('Error calculating pricing:', error);
    }
  };

  const generateProposal = () => {
    try {
      const proposal = paymentSystem.generatePricingProposal(
        selectedIndustry,
        companySize,
        leads,
        calls
      );
      setPricingProposal(proposal);
    } catch (error) {
      console.error('Error generating proposal:', error);
    }
  };

  const renderPricingTiers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Pricing Tiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricingTiers.map(tier => (
          <div key={tier.id} className={`p-6 rounded-lg border-2 ${
            tier.id === 'professional' ? 'border-metisai-green bg-metisai-blue' : 'border-metisai-light-blue bg-metisai-dark-blue'
          }`}>
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-metisai-gradient">{tier.name}</h3>
              <div className="text-3xl font-bold text-white mt-2">
                {tier.price === 0 ? 'Custom' : `$${tier.price}`}
                {tier.price > 0 && <span className="text-sm text-gray-300">/{tier.billingCycle}</span>}
              </div>
              <p className="text-gray-300 text-sm mt-2">{tier.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">AI Personas:</span>
                <span className="text-white">{tier.maxPersonas === -1 ? 'Unlimited' : tier.maxPersonas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Leads/Month:</span>
                <span className="text-white">{tier.maxLeads === -1 ? 'Unlimited' : tier.maxLeads.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">AI Calls/Month:</span>
                <span className="text-white">{tier.maxCalls === -1 ? 'Unlimited' : tier.maxCalls.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Support:</span>
                <span className="text-white capitalize">{tier.support}</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">Key Features:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {tier.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-metisai-green mr-2">✓</span>
                    {feature}
                  </li>
                ))}
                {tier.features.length > 4 && (
                  <li className="text-gray-400">+{tier.features.length - 4} more features</li>
                )}
              </ul>
            </div>

            <button className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${
              tier.id === 'professional' 
                ? 'bg-metisai-gradient text-white hover:opacity-90'
                : 'bg-metisai-blue text-white hover:bg-metisai-light-blue'
            }`}>
              {tier.id === 'custom' ? 'Contact Sales' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIndustryPricing = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Industry-Specific Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {industryPricing.map(industry => (
          <div key={industry.industry} className="bg-metisai-dark-blue p-6 rounded-lg border border-metisai-light-blue">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-metisai-gradient">{industry.industry}</h3>
              <span className="text-metisai-green font-bold">${industry.basePrice}/mo</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Pricing Model:</span>
                <span className="text-white capitalize">{industry.pricingModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Deal Size Range:</span>
                <span className="text-white">${industry.minDealSize.toLocaleString()} - ${industry.maxDealSize.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Multiplier:</span>
                <span className="text-white">{industry.multiplier}x</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-metisai-light-blue">
              <h4 className="text-white font-semibold mb-2">Payment Methods:</h4>
              <div className="flex flex-wrap gap-2">
                {industry.paymentMethods.map((method, index) => (
                  <span key={index} className="bg-metisai-blue px-2 py-1 rounded text-xs text-white">
                    {method.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2">Contract Terms:</h4>
              <div className="flex flex-wrap gap-2">
                {industry.contractTerms.map((term, index) => (
                  <span key={index} className="bg-metisai-green px-2 py-1 rounded text-xs text-metisai-dark-blue">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPricingCalculator = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Pricing Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-metisai-dark-blue p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-4">Configure Your Plan</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">Industry</label>
              <select 
                value={selectedIndustry} 
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full p-3 bg-metisai-blue border border-metisai-light-blue rounded text-white"
              >
                {industryPricing.map(industry => (
                  <option key={industry.industry} value={industry.industry}>
                    {industry.industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Pricing Tier</label>
              <select 
                value={selectedTier} 
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full p-3 bg-metisai-blue border border-metisai-light-blue rounded text-white"
              >
                {pricingTiers.filter(tier => tier.id !== 'custom').map(tier => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name} - ${tier.price}/mo
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Expected Leads/Month</label>
              <input 
                type="number" 
                value={leads} 
                onChange={(e) => setLeads(parseInt(e.target.value) || 0)}
                className="w-full p-3 bg-metisai-blue border border-metisai-light-blue rounded text-white"
                min="0"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Expected AI Calls/Month</label>
              <input 
                type="number" 
                value={calls} 
                onChange={(e) => setCalls(parseInt(e.target.value) || 0)}
                className="w-full p-3 bg-metisai-blue border border-metisai-light-blue rounded text-white"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-metisai-dark-blue p-6 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-4">Pricing Breakdown</h3>
          
          {calculatedPricing && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Base Price:</span>
                <span className="text-white">${calculatedPricing.basePrice.toLocaleString()}</span>
              </div>
              
              {calculatedPricing.leadCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Extra Leads:</span>
                  <span className="text-white">${calculatedPricing.leadCost.toLocaleString()}</span>
                </div>
              )}
              
              {calculatedPricing.callCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Extra Calls:</span>
                  <span className="text-white">${calculatedPricing.callCost.toLocaleString()}</span>
                </div>
              )}
              
              {calculatedPricing.savings > 0 && (
                <div className="flex justify-between">
                  <span className="text-metisai-green">Annual Savings:</span>
                  <span className="text-metisai-green">-${calculatedPricing.savings.toLocaleString()}</span>
                </div>
              )}
              
              <div className="border-t border-metisai-light-blue pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total Monthly Cost:</span>
                  <span className="text-metisai-green">${calculatedPricing.totalCost.toLocaleString()}</span>
                </div>
              </div>

              {calculatedPricing.recommendedTier !== selectedTier && (
                <div className="mt-4 p-4 bg-metisai-blue rounded-lg">
                  <p className="text-white text-sm">
                    💡 We recommend the <strong>{calculatedPricing.recommendedTier}</strong> tier for your usage.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {pricingProposal && (
        <div className="bg-metisai-dark-blue p-6 rounded-lg mt-6">
          <h3 className="text-lg font-bold text-white mb-4">Custom Pricing Proposal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-metisai-green font-semibold mb-2">Recommended Plan</h4>
              <div className="text-2xl font-bold text-white">{pricingProposal.recommendedTier}</div>
              <div className="text-gray-300">Best fit for your needs</div>
            </div>
            
            <div>
              <h4 className="text-metisai-green font-semibold mb-2">Monthly Cost</h4>
              <div className="text-2xl font-bold text-white">${pricingProposal.monthlyCost.toLocaleString()}</div>
              <div className="text-gray-300">Starting price</div>
            </div>
            
            <div>
              <h4 className="text-metisai-green font-semibold mb-2">Annual Cost</h4>
              <div className="text-2xl font-bold text-white">${pricingProposal.annualCost.toLocaleString()}</div>
              <div className="text-gray-300">Save ${pricingProposal.savings.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-white font-semibold mb-3">Payment Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingProposal.paymentOptions.map((option, index) => (
                <div key={index} className="bg-metisai-blue p-4 rounded-lg">
                  <h5 className="text-white font-semibold mb-2">{option.method}</h5>
                  <div className="text-metisai-green font-bold text-lg mb-2">${option.cost.toLocaleString()}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-metisai-green mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEnterprisePricing = () => {
    const enterprisePricing = paymentSystem.getEnterprisePricing();
    const flyTokenPricing = paymentSystem.getFLYTokenPricing();

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Enterprise & Custom Pricing</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-metisai-dark-blue p-6 rounded-lg">
            <h3 className="text-lg font-bold text-metisai-gradient mb-4">Enterprise Solutions</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Minimum Commitment:</span>
                <span className="text-white">${enterprisePricing.minimumCommitment.toLocaleString()}/year</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Implementation:</span>
                <span className="text-white">${enterprisePricing.implementationCost.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Training:</span>
                <span className="text-white">${enterprisePricing.trainingCost.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Premium Support:</span>
                <span className="text-white">${enterprisePricing.supportCost.toLocaleString()}/month</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Volume Discounts</h4>
              <div className="space-y-2">
                {enterprisePricing.volumeDiscounts.map((discount, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-300">${discount.volume.toLocaleString()}+</span>
                    <span className="text-metisai-green">{discount.discount}% off</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-metisai-dark-blue p-6 rounded-lg">
            <h3 className="text-lg font-bold text-metisai-gradient mb-4">FLY Token Benefits</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Token Price:</span>
                <span className="text-white">${flyTokenPricing.tokenPrice}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Payment Discount:</span>
                <span className="text-metisai-green">{flyTokenPricing.discountPercentage}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Staking Rewards:</span>
                <span className="text-metisai-green">{flyTokenPricing.stakingRewards}% APY</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Payment Benefits</h4>
              <ul className="space-y-2">
                {flyTokenPricing.paymentBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-300">
                    <span className="text-metisai-green mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-metisai-dark-blue p-6 rounded-lg">
          <h3 className="text-lg font-bold text-metisai-gradient mb-4">Custom Enterprise Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3">Custom Development</h4>
              <ul className="space-y-2">
                {enterprisePricing.customFeatures.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-300">
                    <span className="text-metisai-green mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Additional Features</h4>
              <ul className="space-y-2">
                {enterprisePricing.customFeatures.slice(4).map((feature, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-300">
                    <span className="text-metisai-green mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-metisai-dark-blue p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-metisai-gradient mb-2">Pricing & Payment System</h1>
          <p className="text-gray-300">Flexible pricing for all 31 industries with multiple payment options</p>
        </div>

        <div className="flex space-x-1 mb-8">
          {[
            { id: 'tiers', label: 'Pricing Tiers' },
            { id: 'industries', label: 'Industry Pricing' },
            { id: 'calculator', label: 'Pricing Calculator' },
            { id: 'enterprise', label: 'Enterprise' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-metisai-gradient text-white'
                  : 'bg-metisai-blue text-gray-300 hover:bg-metisai-light-blue hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'tiers' && renderPricingTiers()}
        {activeTab === 'industries' && renderIndustryPricing()}
        {activeTab === 'calculator' && renderPricingCalculator()}
        {activeTab === 'enterprise' && renderEnterprisePricing()}
      </div>
    </div>
  );
};

export default PricingDashboard;
