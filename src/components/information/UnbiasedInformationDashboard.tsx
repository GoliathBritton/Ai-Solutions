'use client';

import React, { useState, useEffect } from 'react';
import { informationVerificationEngine, VerificationTask } from '@/lib/information/InformationVerificationEngine';

interface UnbiasedInformationDashboardProps {
  userAddress: string;
}

export const UnbiasedInformationDashboard: React.FC<UnbiasedInformationDashboardProps> = ({ userAddress }) => {
  const [query, setQuery] = useState<string>('');
  const [verificationTask, setVerificationTask] = useState<VerificationTask | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/verify');
      const data = await response.json();
      if (data.success) {
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to load metrics:', err);
    }
  };

  const handleVerify = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, options: {} })
      });

      const data = await response.json();
      if (data.success) {
        setVerificationTask(data);
        await loadMetrics();
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Failed to verify information');
    } finally {
      setLoading(false);
    }
  };

  const getConsensusColor = (consensus: boolean) => {
    return consensus ? 'text-green-600' : 'text-red-600';
  };

  const getBiasLevelColor = (biasLevel: string) => {
    switch (biasLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Unbiased Information Verification</h2>
        <p className="text-gray-600 mb-6">
          Verify information across multiple sources including search engines, TOR network, and Web3 knowledge base
        </p>

        {/* Search Form */}
        <div className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query for verification..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
          />
          <button
            onClick={handleVerify}
            disabled={loading || !query.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Verification Results */}
      {verificationTask && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Results</h3>
          
          {/* Consensus Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Consensus</p>
              <p className={`text-lg font-semibold ${getConsensusColor(verificationTask.consensus.consensus)}`}>
                {verificationTask.consensus.consensus ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Confidence</p>
              <p className="text-lg font-semibold text-blue-600">
                {(verificationTask.consensus.confidence * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Sources</p>
              <p className="text-lg font-semibold text-purple-600">
                {verificationTask.consensus.sources}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Bias Level</p>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getBiasLevelColor(verificationTask.consensus.biasLevel)}`}>
                {verificationTask.consensus.biasLevel}
              </span>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-700">Source Results</h4>
            {verificationTask.results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-gray-900">
                    {(result.result as any).title || 'Search Result'}
                  </h5>
                  <div className="flex space-x-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {result.source}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {(result.credibility * 100).toFixed(0)}% credible
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {(result.result as any).description || 'No description available'}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Accuracy: {(result.accuracy * 100).toFixed(1)}%</span>
                  <span>Bias: {(result.biasScore * 100).toFixed(1)}%</span>
                  <span>{(result.result as any).url || 'No URL'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics */}
      {metrics && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Verifications</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.totalVerifications}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {((metrics.successfulVerifications / metrics.totalVerifications) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Source Diversity</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.sourceDiversity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Information Sources */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Search Engines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• DuckDuckGo (Privacy-focused)</li>
              <li>• Brave Search (Independent index)</li>
              <li>• Startpage (Google proxy)</li>
              <li>• Searx (Meta-search)</li>
              <li>• Yacy (P2P search)</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">TOR Network</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Anonymous web access</li>
              <li>• Censorship circumvention</li>
              <li>• Dark web monitoring</li>
              <li>• Privacy protection</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Web3 Knowledge</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• IPFS storage</li>
              <li>• Arweave permanent storage</li>
              <li>• Filecoin distributed storage</li>
              <li>• Blockchain verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnbiasedInformationDashboard;
