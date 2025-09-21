"use client";

import React, { useState, useEffect } from 'react';
import { AIPersonaManager } from '../../lib/ai-personas/AIPersonas';
import { ConversationalAI } from '../../lib/ai-personas/ConversationalAI';
import { LeadManagementSystem } from '../../lib/lead-management/LeadManagementSystem';
import { VoiceAIIntegration } from '../../lib/voice-ai/VoiceAIIntegration';

interface AISalesDashboardProps {
  className?: string;
}

const AISalesDashboard: React.FC<AISalesDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'personas' | 'campaigns' | 'calls' | 'analytics'>('leads');
  const [personaManager] = useState(() => new AIPersonaManager());
  const [conversationalAI] = useState(() => new ConversationalAI());
  const [leadSystem] = useState(() => new LeadManagementSystem());
  const [voiceAI] = useState(() => new VoiceAIIntegration({
    provider: 'twilio',
    apiKey: process.env.NEXT_PUBLIC_TWILIO_API_KEY || '',
    apiSecret: process.env.NEXT_PUBLIC_TWILIO_API_SECRET || '',
    phoneNumber: process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER || '',
    webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_URL || '',
    recordingEnabled: true,
    transcriptionEnabled: true,
    realTimeProcessing: true
  }));

  const [leads, setLeads] = useState<any[]>([]);
  const [personas, setPersonas] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>('sarah-enterprise');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvMapping, setCsvMapping] = useState<any>({});
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load personas
    setPersonas(personaManager.getAllPersonas());
    
    // Load leads
    setLeads(leadSystem.getAllLeads());
    
    // Load campaigns
    setCampaigns(leadSystem.getAllCampaigns());
    
    // Load active calls
    setActiveCalls(voiceAI.getActiveCalls());
    
    // Load analytics
    setAnalytics(leadSystem.getLeadAnalytics());
  };

  const handleCsvImport = async () => {
    if (!csvFile) return;
    
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('sourceName', 'Real Estate Commercial Leads');
      formData.append('mapping', JSON.stringify(csvMapping));
      
      const response = await fetch('/api/leads/import-csv', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Successfully imported ${result.data.imported} leads!`);
        loadData(); // Reload data
        setCsvFile(null);
      } else {
        alert(`Import failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import CSV file');
    } finally {
      setIsImporting(false);
    }
  };

  const initiateCall = async (leadId: string) => {
    const lead = leadSystem.getLead(leadId);
    if (!lead || !lead.phone) {
      alert('Lead not found or no phone number available');
      return;
    }
    
    try {
      const result = await voiceAI.initiateCall(leadId, selectedPersona, lead.phone, 'Sales outreach');
      
      if (result.success) {
        alert(`Call initiated successfully! Call ID: ${result.callId}`);
        loadData(); // Reload data
      } else {
        alert(`Call failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Call error:', error);
      alert('Failed to initiate call');
    }
  };

  const startConversation = async (leadId: string, conversationType: 'cold-call' | 'warm-lead' | 'demo-presentation') => {
    const lead = leadSystem.getLead(leadId);
    if (!lead) {
      alert('Lead not found');
      return;
    }
    
    try {
      const context = await conversationalAI.startConversation(
        lead,
        selectedPersona,
        conversationType,
        'phone'
      );
      
      alert('Conversation started successfully!');
      console.log('Conversation context:', context);
    } catch (error) {
      console.error('Conversation error:', error);
      alert('Failed to start conversation');
    }
  };

  const renderLeadsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-metisai-blue">Lead Management</h2>
        <div className="flex gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="bg-metisai-green text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 transition-colors"
          >
            Import CSV
          </label>
          {csvFile && (
            <button
              onClick={handleCsvImport}
              disabled={isImporting}
              className="bg-metisai-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Process Import'}
            </button>
          )}
        </div>
      </div>

      {csvFile && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">CSV Mapping Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name Field</label>
              <input
                type="text"
                value={csvMapping.name || ''}
                onChange={(e) => setCsvMapping({...csvMapping, name: e.target.value})}
                placeholder="Contact Person"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Field</label>
              <input
                type="text"
                value={csvMapping.company || ''}
                onChange={(e) => setCsvMapping({...csvMapping, company: e.target.value})}
                placeholder="Company Name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Field</label>
              <input
                type="text"
                value={csvMapping.email || ''}
                onChange={(e) => setCsvMapping({...csvMapping, email: e.target.value})}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Field</label>
              <input
                type="text"
                value={csvMapping.phone || ''}
                onChange={(e) => setCsvMapping({...csvMapping, phone: e.target.value})}
                placeholder="Phone"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-metisai-dark-blue text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Industry</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{lead.name}</td>
                  <td className="p-3">{lead.company}</td>
                  <td className="p-3">{lead.industry}</td>
                  <td className="p-3">{lead.email}</td>
                  <td className="p-3">{lead.phone}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {leadSystem.getLeadStatus(lead.id)?.status || 'new'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => initiateCall(lead.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Call
                      </button>
                      <button
                        onClick={() => startConversation(lead.id, 'cold-call')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPersonasTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-metisai-blue">AI Personas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
              selectedPersona === persona.id ? 'ring-2 ring-metisai-blue' : ''
            }`}
            onClick={() => setSelectedPersona(persona.id)}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-metisai-gradient rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {persona.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-bold text-metisai-blue">{persona.name}</h3>
              <p className="text-gray-600 mb-2">{persona.role}</p>
              <p className="text-sm text-gray-500 mb-4">{persona.personality}</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Expertise:</h4>
                <div className="flex flex-wrap gap-1">
                  {persona.expertise.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">Voice Profile:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Gender: {persona.voiceProfile.gender}</div>
                  <div>Tone: {persona.voiceProfile.tone}</div>
                  <div>Rate: {persona.voiceProfile.speakingRate}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedPersona && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-metisai-blue mb-4">
            {personas.find(p => p.id === selectedPersona)?.name} - Scripts
          </h3>
          <div className="space-y-4">
            {Object.entries(personas.find(p => p.id === selectedPersona)?.scripts || {}).map(([key, script]) => (
              <div key={key}>
                <h4 className="font-semibold text-sm text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {script as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-metisai-blue">Campaigns</h2>
        <button className="bg-metisai-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          Create Campaign
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-metisai-blue mb-2">{campaign.name}</h3>
            <p className="text-gray-600 mb-4">{campaign.type}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Response Rate:</span>
                <span className="text-sm font-semibold">{campaign.results.responseRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Conversion Rate:</span>
                <span className="text-sm font-semibold">{campaign.results.conversionRate.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                Run
              </button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCallsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-metisai-blue">Active Calls</h2>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-metisai-dark-blue text-white">
              <tr>
                <th className="p-3 text-left">Lead</th>
                <th className="p-3 text-left">Persona</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeCalls.map((call) => (
                <tr key={call.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {leadSystem.getLead(call.leadId)?.name || 'Unknown'}
                  </td>
                  <td className="p-3">
                    {personas.find(p => p.id === call.personaId)?.name || 'Unknown'}
                  </td>
                  <td className="p-3">{call.phoneNumber}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      call.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                      call.status === 'ringing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {call.duration ? `${Math.floor(call.duration / 60000)}:${((call.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}` : 'N/A'}
                  </td>
                  <td className="p-3">
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      End
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-metisai-blue">Analytics Dashboard</h2>
      
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-metisai-blue mb-2">Total Leads</h3>
            <p className="text-3xl font-bold text-metisai-green">{analytics.totalLeads}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-metisai-blue mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-metisai-green">{analytics.conversionRate.toFixed(1)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-metisai-blue mb-2">Average Deal Size</h3>
            <p className="text-3xl font-bold text-metisai-green">${analytics.averageDealSize.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-metisai-blue mb-2">Active Campaigns</h3>
            <p className="text-3xl font-bold text-metisai-green">{campaigns.filter(c => c.status === 'active').length}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-metisai-blue mb-4">Leads by Status</h3>
          {analytics?.byStatus && Object.entries(analytics.byStatus).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center py-2 border-b">
              <span className="capitalize">{status.replace('-', ' ')}</span>
              <span className="font-semibold">{count as number}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-metisai-blue mb-4">Leads by Industry</h3>
          {analytics?.byIndustry && Object.entries(analytics.byIndustry).map(([industry, count]) => (
            <div key={industry} className="flex justify-between items-center py-2 border-b">
              <span className="capitalize">{industry}</span>
              <span className="font-semibold">{count as number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 min-h-screen ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-metisai-blue">AI Sales Dashboard</h1>
            <div className="text-sm text-gray-600">
              Managing {leads.length} leads with {personas.length} AI personas
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'leads', label: 'Leads', icon: '👥' },
              { id: 'personas', label: 'Personas', icon: '🤖' },
              { id: 'campaigns', label: 'Campaigns', icon: '📧' },
              { id: 'calls', label: 'Calls', icon: '📞' },
              { id: 'analytics', label: 'Analytics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-metisai-blue text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          {activeTab === 'leads' && renderLeadsTab()}
          {activeTab === 'personas' && renderPersonasTab()}
          {activeTab === 'campaigns' && renderCampaignsTab()}
          {activeTab === 'calls' && renderCallsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>
    </div>
  );
};

export default AISalesDashboard;
