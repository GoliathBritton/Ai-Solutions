"use client";

import React, { useState, useEffect } from 'react';
import { IndustryIntegrationManager } from '../../lib/ai-personas/IndustryIntegration';
import { industryPersonas } from '../../lib/ai-personas/IndustryPersonas';
import { industryCampaigns } from '../../lib/ai-personas/IndustryCampaigns';

const IndustrySalesDashboard: React.FC = () => {
  const [industryManager] = useState(() => new IndustryIntegrationManager());
  const [activeTab, setActiveTab] = useState<'overview' | 'industries' | 'personas' | 'campaigns' | 'analytics'>('overview');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [databaseSummary, setDatabaseSummary] = useState<any>(null);

  useEffect(() => {
    loadIndustryData();
  }, []);

  const loadIndustryData = () => {
    const allIntegrations = industryManager.getAllIntegrations();
    setIntegrations(allIntegrations);
    setDatabaseSummary(industryManager.getDatabaseSummary());
  };

  const getIndustryMetrics = (industry: string) => {
    return industryManager.getIndustryMetrics(industry);
  };

  const getIndustryRecommendations = (industry: string) => {
    return industryManager.getIndustryRecommendations(industry);
  };

  const getLaunchRoadmap = () => {
    return industryManager.getLaunchRoadmap();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-metisai-blue to-metisai-green p-6 rounded-lg text-white">
        <h2 className="text-3xl font-bold mb-4">Multi-Industry AI Sales Empire</h2>
        <p className="text-lg mb-4">Comprehensive AI sales system for 30+ industries with specialized personas and campaigns</p>
        
        {databaseSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-2xl font-bold">{databaseSummary.totalIndustries}</div>
              <div className="text-sm">Industries</div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-2xl font-bold">{databaseSummary.totalLeads}</div>
              <div className="text-sm">Total Leads</div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-2xl font-bold">{databaseSummary.totalValue}</div>
              <div className="text-sm">Estimated Value</div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="text-2xl font-bold">{databaseSummary.estimatedAnnualRevenue}</div>
              <div className="text-sm">Annual Revenue</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-metisai-dark-blue p-6 rounded-lg">
          <h3 className="text-xl font-bold text-metisai-green mb-4">High Priority Industries</h3>
          {databaseSummary && (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">{databaseSummary.highPriorityIndustries}</div>
              <div className="text-sm text-gray-300">Ready for immediate launch</div>
            </div>
          )}
        </div>

        <div className="bg-metisai-dark-blue p-6 rounded-lg">
          <h3 className="text-xl font-bold text-metisai-green mb-4">Ready to Launch</h3>
          {databaseSummary && (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">{databaseSummary.readyToLaunch}</div>
              <div className="text-sm text-gray-300">Industries ready now</div>
            </div>
          )}
        </div>

        <div className="bg-metisai-dark-blue p-6 rounded-lg">
          <h3 className="text-xl font-bold text-metisai-green mb-4">Average Conversion</h3>
          {databaseSummary && (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">{databaseSummary.averageConversionRate}</div>
              <div className="text-sm text-gray-300">Across all industries</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-metisai-dark-blue p-6 rounded-lg">
        <h3 className="text-xl font-bold text-metisai-green mb-4">Launch Roadmap</h3>
        <div className="space-y-4">
          {getLaunchRoadmap() && Object.entries(getLaunchRoadmap()).map(([phaseKey, phase]: [string, any]) => (
            <div key={phaseKey} className="border border-metisai-light-blue p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-white">{phase.name}</h4>
                <span className="text-metisai-green font-bold">{phase.timeline}</span>
              </div>
              <div className="text-sm text-gray-300 mb-2">
                {phase.industries.length} industries • Expected Revenue: {phase.expectedRevenue}
              </div>
              <div className="flex flex-wrap gap-2">
                {phase.industries.slice(0, 5).map((industry: any, index: number) => (
                  <span key={index} className="bg-metisai-blue px-2 py-1 rounded text-xs text-white">
                    {industry.industry}
                  </span>
                ))}
                {phase.industries.length > 5 && (
                  <span className="text-gray-400 text-xs">+{phase.industries.length - 5} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIndustries = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Industry Overview</h2>
        <div className="flex gap-2">
          <select 
            value={selectedIndustry} 
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-metisai-dark-blue border border-metisai-light-blue rounded px-3 py-2 text-white"
          >
            <option value="">All Industries</option>
            {integrations.map(integration => (
              <option key={integration.industry} value={integration.industry}>
                {integration.industry}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations
          .filter(integration => !selectedIndustry || integration.industry === selectedIndustry)
          .map(integration => {
            const metrics = getIndustryMetrics(integration.industry);
            return (
              <div key={integration.industry} className="bg-metisai-dark-blue p-6 rounded-lg border border-metisai-light-blue">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white">{integration.industry}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    integration.priority === 'high' ? 'bg-red-600' :
                    integration.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                  } text-white`}>
                    {integration.priority}
                  </span>
                </div>

                {metrics && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Persona:</span>
                      <span className="text-white">{metrics.persona}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Leads:</span>
                      <span className="text-metisai-green">{metrics.totalLeads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Value:</span>
                      <span className="text-metisai-green">{metrics.estimatedValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Conversion:</span>
                      <span className="text-metisai-green">{metrics.conversionRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Deal Size:</span>
                      <span className="text-metisai-green">{metrics.averageDealSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sales Cycle:</span>
                      <span className="text-white">{metrics.salesCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Campaigns:</span>
                      <span className="text-white">{metrics.campaigns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        metrics.status === 'completed' ? 'bg-green-600' :
                        metrics.status === 'ready' ? 'bg-blue-600' :
                        metrics.status === 'in-progress' ? 'bg-yellow-600' : 'bg-gray-600'
                      } text-white`}>
                        {metrics.status}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-metisai-light-blue">
                  <button 
                    className="w-full bg-metisai-gradient text-white py-2 px-4 rounded hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setSelectedIndustry(integration.industry);
                      setActiveTab('personas');
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

  const renderPersonas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          AI Personas {selectedIndustry && `- ${selectedIndustry}`}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industryPersonas
          .filter(persona => !selectedIndustry || persona.industry === selectedIndustry)
          .map(persona => (
            <div key={persona.id} className="bg-metisai-dark-blue p-6 rounded-lg border border-metisai-light-blue">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-metisai-gradient">{persona.name}</h3>
                <p className="text-metisai-green font-semibold">{persona.role}</p>
                <p className="text-gray-300 text-sm mt-1">{persona.industry}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.expertise.slice(0, 4).map((skill, index) => (
                      <span key={index} className="bg-metisai-blue px-2 py-1 rounded text-xs text-white">
                        {skill}
                      </span>
                    ))}
                    {persona.expertise.length > 4 && (
                      <span className="text-gray-400 text-xs">+{persona.expertise.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Deal Size:</span>
                  <span className="text-metisai-green">{persona.averageDealSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sales Cycle:</span>
                  <span className="text-white">{persona.salesCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tone:</span>
                  <span className="text-white capitalize">{persona.tone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-metisai-light-blue">
                <p className="text-sm text-gray-300 mb-3">{persona.description}</p>
                <button className="w-full bg-metisai-gradient text-white py-2 px-4 rounded hover:opacity-90 transition-opacity">
                  Launch Campaign
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Campaigns {selectedIndustry && `- ${selectedIndustry}`}
        </h2>
      </div>

      <div className="space-y-6">
        {industryCampaigns
          .filter(campaign => !selectedIndustry || campaign.industry === selectedIndustry)
          .map(campaign => (
            <div key={campaign.campaignName} className="bg-metisai-dark-blue p-6 rounded-lg border border-metisai-light-blue">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-metisai-gradient">{campaign.campaignName}</h3>
                  <p className="text-metisai-green">{campaign.industry}</p>
                </div>
                <div className="text-right">
                  <div className="text-metisai-green font-bold">{campaign.estimatedConversionRate}</div>
                  <div className="text-sm text-gray-300">Conversion Rate</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Primary Goal:</h4>
                  <p className="text-gray-300 text-sm mb-4">{campaign.primaryGoal}</p>

                  <h4 className="text-white font-semibold mb-2">Key Messages:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {campaign.keyMessages.map((message, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-metisai-green mr-2">•</span>
                        {message}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-2">Value Propositions:</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {campaign.valueProps.map((prop, index) => (
                      <span key={index} className="bg-metisai-blue px-2 py-1 rounded text-xs text-white">
                        {prop}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-white font-semibold mb-2">Metrics:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-300">Deal Size:</span>
                      <div className="text-metisai-green font-semibold">{campaign.averageDealSize}</div>
                    </div>
                    <div>
                      <span className="text-gray-300">Sales Cycle:</span>
                      <div className="text-white">{campaign.salesCycle}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-metisai-light-blue">
                <button className="bg-metisai-gradient text-white py-2 px-6 rounded hover:opacity-90 transition-opacity">
                  Launch Campaign
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Industry Analytics</h2>
      
      {databaseSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-metisai-dark-blue p-6 rounded-lg">
            <h3 className="text-lg font-bold text-metisai-green mb-2">Total Industries</h3>
            <div className="text-3xl font-bold text-white">{databaseSummary.totalIndustries}</div>
          </div>
          <div className="bg-metisai-dark-blue p-6 rounded-lg">
            <h3 className="text-lg font-bold text-metisai-green mb-2">Total Leads</h3>
            <div className="text-3xl font-bold text-white">{databaseSummary.totalLeads}</div>
          </div>
          <div className="bg-metisai-dark-blue p-6 rounded-lg">
            <h3 className="text-lg font-bold text-metisai-green mb-2">Total Value</h3>
            <div className="text-3xl font-bold text-white">{databaseSummary.totalValue}</div>
          </div>
          <div className="bg-metisai-dark-blue p-6 rounded-lg">
            <h3 className="text-lg font-bold text-metisai-green mb-2">Annual Revenue</h3>
            <div className="text-3xl font-bold text-white">{databaseSummary.estimatedAnnualRevenue}</div>
          </div>
        </div>
      )}

      <div className="bg-metisai-dark-blue p-6 rounded-lg">
        <h3 className="text-xl font-bold text-metisai-green mb-4">Industry Performance</h3>
        <div className="space-y-4">
          {integrations.slice(0, 10).map(integration => {
            const metrics = getIndustryMetrics(integration.industry);
            return (
              <div key={integration.industry} className="flex justify-between items-center p-4 bg-metisai-blue rounded">
                <div>
                  <div className="text-white font-semibold">{integration.industry}</div>
                  <div className="text-gray-300 text-sm">{metrics?.persona}</div>
                </div>
                <div className="text-right">
                  <div className="text-metisai-green font-bold">{metrics?.totalLeads}</div>
                  <div className="text-gray-300 text-sm">leads</div>
                </div>
                <div className="text-right">
                  <div className="text-metisai-green font-bold">{metrics?.estimatedValue}</div>
                  <div className="text-gray-300 text-sm">value</div>
                </div>
                <div className="text-right">
                  <div className="text-metisai-green font-bold">{metrics?.conversionRate}</div>
                  <div className="text-gray-300 text-sm">conversion</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-metisai-dark-blue p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-metisai-gradient mb-2">Multi-Industry AI Sales Empire</h1>
          <p className="text-gray-300">Comprehensive AI sales system for 30+ industries with specialized personas and campaigns</p>
        </div>

        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'industries', label: 'Industries' },
            { id: 'personas', label: 'AI Personas' },
            { id: 'campaigns', label: 'Campaigns' },
            { id: 'analytics', label: 'Analytics' }
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

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'industries' && renderIndustries()}
        {activeTab === 'personas' && renderPersonas()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default IndustrySalesDashboard;
