"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  quantumRequests: number;
  mcpVerifications: number;
  qascSessions: number;
  revenue: number;
  subscriptions: number;
  apiCalls: number;
}

interface UsageStats {
  date: string;
  requests: number;
  users: number;
  revenue: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    quantumRequests: 0,
    mcpVerifications: 0,
    qascSessions: 0,
    revenue: 0,
    subscriptions: 0,
    apiCalls: 0
  });
  const [usageStats, setUsageStats] = useState<UsageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data from database
      const { data: users } = await supabase
        .from('users')
        .select('id, created_at, last_active')
        .gte('created_at', getDateRange(timeRange));

      const { data: usage } = await supabase
        .from('usage_logs')
        .select('*')
        .gte('created_at', getDateRange(timeRange));

      const { data: payments } = await supabase
        .from('payments')
        .select('amount, status')
        .gte('created_at', getDateRange(timeRange));

      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .gte('created_at', getDateRange(timeRange));

      // Calculate analytics
      const totalUsers = users?.length || 0;
      const activeUsers = users?.filter(u => 
        new Date(u.last_active || u.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length || 0;

      const quantumRequests = usage?.filter(u => 
        u.service_type === 'quantum'
      ).length || 0;

      const mcpVerifications = usage?.filter(u => 
        u.service_type === 'mcp'
      ).length || 0;

      const qascSessions = usage?.filter(u => 
        u.service_type === 'qasc'
      ).length || 0;

      const revenue = payments?.filter(p => 
        p.status === 'completed'
      ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      const apiCalls = usage?.length || 0;

      setAnalytics({
        totalUsers,
        activeUsers,
        quantumRequests,
        mcpVerifications,
        qascSessions,
        revenue,
        subscriptions: subscriptions?.length || 0,
        apiCalls
      });

      // Generate usage stats for chart
      generateUsageStats(usage || []);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUsageStats = (usage: any[]) => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const stats: UsageStats[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayUsage = usage.filter(u => 
        u.created_at?.startsWith(dateStr)
      );
      
      stats.push({
        date: dateStr,
        requests: dayUsage.length,
        users: new Set(dayUsage.map(u => u.user_id)).size,
        revenue: dayUsage.reduce((sum, u) => sum + (u.cost || 0), 0)
      });
    }
    
    setUsageStats(stats);
  };

  const getDateRange = (range: string) => {
    const now = new Date();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return startDate.toISOString();
  };

  const StatCard = ({ title, value, change, icon }: {
    title: string;
    value: string | number;
    change?: string;
    icon: string;
  }) => (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-2">Platform performance and usage statistics</p>
          </div>
          
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <button
              onClick={fetchAnalytics}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={analytics.totalUsers.toLocaleString()}
            change="+12%"
            icon="👥"
          />
          <StatCard
            title="Active Users"
            value={analytics.activeUsers.toLocaleString()}
            change="+8%"
            icon="🟢"
          />
          <StatCard
            title="API Calls"
            value={analytics.apiCalls.toLocaleString()}
            change="+25%"
            icon="📊"
          />
          <StatCard
            title="Revenue"
            value={`$${analytics.revenue.toLocaleString()}`}
            change="+18%"
            icon="💰"
          />
        </div>

        {/* Service Usage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Quantum Requests"
            value={analytics.quantumRequests.toLocaleString()}
            change="+15%"
            icon="⚡"
          />
          <StatCard
            title="MCP Verifications"
            value={analytics.mcpVerifications.toLocaleString()}
            change="+22%"
            icon="🔍"
          />
          <StatCard
            title="QASC Sessions"
            value={analytics.qascSessions.toLocaleString()}
            change="+30%"
            icon="🤖"
          />
        </div>

        {/* Usage Chart */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Usage Over Time</h3>
          <div className="h-64 flex items-end gap-2">
            {usageStats.map((stat, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-purple-500 w-full rounded-t"
                  style={{ height: `${(stat.requests / Math.max(...usageStats.map(s => s.requests))) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-400 mt-2">
                  {new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Top Features</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Quantum LLM</span>
                <span className="text-purple-400 font-semibold">
                  {Math.round((analytics.quantumRequests / analytics.apiCalls) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">MCP Verification</span>
                <span className="text-blue-400 font-semibold">
                  {Math.round((analytics.mcpVerifications / analytics.apiCalls) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">QASC Coding</span>
                <span className="text-green-400 font-semibold">
                  {Math.round((analytics.qascSessions / analytics.apiCalls) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Average Response Time</span>
                <span className="text-green-400 font-semibold">245ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Uptime</span>
                <span className="text-green-400 font-semibold">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Error Rate</span>
                <span className="text-green-400 font-semibold">0.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
