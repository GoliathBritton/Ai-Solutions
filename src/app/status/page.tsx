"use client";

import React, { useState, useEffect } from 'react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastIncident?: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  impact: 'minor' | 'major' | 'critical';
  startTime: string;
  endTime?: string;
  updates: Array<{
    time: string;
    message: string;
  }>;
}

const StatusPage: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Services',
      status: 'operational',
      uptime: 99.9,
      responseTime: 245
    },
    {
      name: 'Quantum Processing',
      status: 'operational',
      uptime: 99.8,
      responseTime: 1200
    },
    {
      name: 'Authentication',
      status: 'operational',
      uptime: 99.95,
      responseTime: 180
    },
    {
      name: 'Payment Processing',
      status: 'operational',
      uptime: 99.9,
      responseTime: 320
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: 99.9,
      responseTime: 95
    },
    {
      name: 'CDN',
      status: 'operational',
      uptime: 99.99,
      responseTime: 45
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In a real implementation, this would fetch from your status API
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'outage': return 'text-red-400';
      case 'maintenance': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '✅';
      case 'degraded': return '⚠️';
      case 'outage': return '❌';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'minor': return 'bg-yellow-900 text-yellow-300';
      case 'major': return 'bg-orange-900 text-orange-300';
      case 'critical': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">MetisAI Status</h1>
          <p className="text-xl text-gray-300 mb-6">
            Real-time status of our quantum AI platform and services
          </p>
          
          {/* Overall Status */}
          <div className="inline-flex items-center space-x-3 bg-gray-800/50 rounded-lg px-6 py-3 border border-gray-700">
            <span className="text-2xl">{getStatusIcon(overallStatus)}</span>
            <span className={`text-xl font-semibold ${getStatusColor(overallStatus)}`}>
              All Systems Operational
            </span>
          </div>
          
          <p className="text-gray-400 text-sm mt-4">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>

        {/* Services Status */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Service Status</h2>
          <div className="grid gap-4">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getStatusIcon(service.status)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                      <p className={`text-sm ${getStatusColor(service.status)}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{service.uptime}% uptime</div>
                    <div className="text-gray-400 text-sm">{service.responseTime}ms avg response</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Overall Uptime</h3>
            <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
            <p className="text-gray-400 text-sm">Last 30 days</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Average Response Time</h3>
            <div className="text-3xl font-bold text-blue-400 mb-2">245ms</div>
            <p className="text-gray-400 text-sm">Last 24 hours</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Active Users</h3>
            <div className="text-3xl font-bold text-purple-400 mb-2">12,847</div>
            <p className="text-gray-400 text-sm">Currently online</p>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Incidents</h2>
          {incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{incident.title}</h3>
                      <p className="text-gray-300 mb-2">{incident.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Started: {new Date(incident.startTime).toLocaleString()}</span>
                        {incident.endTime && (
                          <span>Resolved: {new Date(incident.endTime).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded text-xs ${getImpactColor(incident.impact)}`}>
                        {incident.impact.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">
                        {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {incident.updates.length > 0 && (
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Updates</h4>
                      <div className="space-y-2">
                        {incident.updates.map((update, index) => (
                          <div key={index} className="text-sm text-gray-300">
                            <span className="text-gray-400">
                              {new Date(update.time).toLocaleString()}
                            </span>
                            <span className="ml-2">{update.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Recent Incidents</h3>
              <p className="text-gray-400">
                All systems are running smoothly. We'll post updates here if any issues arise.
              </p>
            </div>
          )}
        </div>

        {/* Maintenance Schedule */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Scheduled Maintenance</h2>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Scheduled Maintenance</h3>
              <p className="text-gray-400">
                We don't have any maintenance windows scheduled at this time. 
                We'll notify you in advance if any maintenance is planned.
              </p>
            </div>
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-6">
            Subscribe to status updates to be notified of any incidents or maintenance windows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            You can also follow us on Twitter for real-time updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
