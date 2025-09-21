"use client";

import React, { useState, useEffect } from 'react';

interface MCPDashboardProps {
  className?: string;
}

interface MCPStatus {
  enabled: boolean;
  totalSources: number;
  activeSources: number;
  torEnabled: boolean;
  web3Enabled: boolean;
  lastUpdate: string;
}

interface VerificationResult {
  query: string;
  consensus: {
    content: string;
    sources: string[];
    agreement: number;
    confidence: number;
  };
  sourceAnalysis: {
    totalSources: number;
    successfulSources: number;
    diversityScore: number;
  };
  biasAnalysis: {
    overallBias: number;
    politicalBias: number;
    commercialBias: number;
  };
  qualityScore: number;
  recommendations: string[];
}

export default function MCPDashboard({ className = "" }: MCPDashboardProps) {
  const [mcpStatus, setMcpStatus] = useState<MCPStatus | null>(null);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [query, setQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMCPStatus();
    loadRecentVerifications();
  }, []);

  const loadMCPStatus = async () => {
    try {
      const response = await fetch('/api/mcp/status');
      if (response.ok) {
        const data = await response.json();
        setMcpStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to load MCP status:', error);
    }
  };

  const loadRecentVerifications = async () => {
    try {
      const response = await fetch('/api/mcp/history');
      if (response.ok) {
        const data = await response.json();
        setVerificationResults(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load verification history:', error);
    }
  };

  const handleVerification = async () => {
    if (!query.trim()) return;

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/mcp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          options: {
            includeTor: true,
            includeWeb3: true,
            maxResults: 10
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationResults(prev => [data.data.verificationResult, ...prev.slice(0, 9)]);
        setQuery("");
      } else {
        setError(data.error?.message || 'Verification failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  const getBiasColor = (bias: number) => {
    if (bias < 0.3) return 'text-green-400';
    if (bias < 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 0.8) return 'text-green-400';
    if (quality >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Machine Content Protocol (MCP)
        </h2>
        <p className="text-gray-400">
          Decentralized, unbiased information verification and processing
        </p>
      </div>

      {/* MCP Status */}
      {mcpStatus && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">System Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{mcpStatus.totalSources}</div>
              <div className="text-sm text-gray-400">Total Sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{mcpStatus.activeSources}</div>
              <div className="text-sm text-gray-400">Active Sources</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${mcpStatus.torEnabled ? 'text-green-400' : 'text-red-400'}`}>
                {mcpStatus.torEnabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-gray-400">TOR Network</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${mcpStatus.web3Enabled ? 'text-green-400' : 'text-red-400'}`}>
                {mcpStatus.web3Enabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-gray-400">Web3 Integration</div>
            </div>
          </div>
        </div>
      )}

      {/* Query Interface */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Verify Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter your query for multi-source verification:
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What information would you like to verify?"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <button
            onClick={handleVerification}
            disabled={isVerifying || !query.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify Information'}
          </button>
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Verification Results */}
      {verificationResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Recent Verifications</h3>
          {verificationResults.map((result, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium text-white">{result.query}</h4>
                <div className={`text-sm font-medium ${getQualityColor(result.qualityScore)}`}>
                  Quality: {(result.qualityScore * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-2">Consensus Result:</p>
                <p className="text-white bg-gray-700/50 rounded-lg p-3 text-sm">
                  {result.consensus.content}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Source Analysis</div>
                  <div className="text-white">
                    {result.sourceAnalysis.successfulSources}/{result.sourceAnalysis.totalSources} sources
                  </div>
                  <div className="text-sm text-gray-400">
                    Diversity: {(result.sourceAnalysis.diversityScore * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Bias Analysis</div>
                  <div className={`${getBiasColor(result.biasAnalysis.overallBias)}`}>
                    Overall: {(result.biasAnalysis.overallBias * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    Political: {(result.biasAnalysis.politicalBias * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Consensus</div>
                  <div className="text-white">
                    Agreement: {(result.consensus.agreement * 100).toFixed(1)}%
                  </div>
                  <div className="text-white">
                    Confidence: {(result.consensus.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {result.recommendations.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">Recommendations:</div>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="text-sm text-yellow-400 flex items-start">
                        <span className="mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {verificationResults.length === 0 && !isVerifying && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No verifications yet</div>
          <div className="text-gray-500 text-sm">
            Enter a query above to start verifying information across multiple sources
          </div>
        </div>
      )}
    </div>
  );
}
