"use client";

import React, { useState, useEffect } from 'react';
import { LLMComparisonEngine, LLMModel, ComparisonMetrics } from '../../lib/comparison/LLMComparisonEngine';

const LLMComparisonDashboard: React.FC = () => {
  const [comparisonEngine] = useState(new LLMComparisonEngine());
  const [selectedLLM, setSelectedLLM] = useState<string>('gpt-4');
  const [comparisons, setComparisons] = useState<Map<string, ComparisonMetrics>>(new Map());
  const [allModels, setAllModels] = useState<LLMModel[]>([]);
  const [metisAI, setMetisAI] = useState<LLMModel | null>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeComparison = async () => {
      try {
        const models = comparisonEngine.getAllModels();
        const metisAIModel = comparisonEngine.getMetisAI();
        const comparisonResults = comparisonEngine.compareAll();
        const comparisonReport = comparisonEngine.generateComparisonReport();

        setAllModels(models);
        setMetisAI(metisAIModel);
        setComparisons(comparisonResults);
        setReport(comparisonReport);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing comparison:', error);
        setLoading(false);
      }
    };

    initializeComparison();
  }, [comparisonEngine]);

  const getDetailedComparison = (llmId: string) => {
    try {
      return comparisonEngine.getDetailedComparison(llmId);
    } catch (error) {
      console.error('Error getting detailed comparison:', error);
      return null;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-green-300';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 60) return 'text-yellow-300';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-yellow-400';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-metisai-dark-blue">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-metisai-green mx-auto mb-4"></div>
          <p className="text-metisai-blue text-xl">Loading LLM Comparison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-metisai-dark-blue text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-metisai-blue to-metisai-green p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">MetisAI vs All LLMs</h1>
          <p className="text-xl mb-6">
            Dynamic technical comparison showing MetisAI's quantum-enhanced superiority
          </p>
          {report && (
            <div className="bg-metisai-dark-blue/50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3 text-metisai-gradient">Comparison Summary</h3>
              <p className="text-lg mb-4">{report.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-metisai-green">{report.totalModels}</div>
                  <div className="text-sm">Total Models Compared</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-metisai-green">{report.averageAdvantage.toFixed(1)}%</div>
                  <div className="text-sm">Average Advantage</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-metisai-green">$150B+</div>
                  <div className="text-sm">Market Opportunity</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Model Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Select LLM for Detailed Comparison</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allModels.slice(1).map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedLLM(model.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedLLM === model.id
                    ? 'border-metisai-green bg-metisai-green/20'
                    : 'border-metisai-blue hover:border-metisai-light-blue'
                }`}
              >
                <div className="font-bold">{model.name}</div>
                <div className="text-sm text-gray-300">{model.provider}</div>
                {comparisons.has(model.id) && (
                  <div className={`text-sm font-bold mt-2 ${getScoreColor(comparisons.get(model.id)!.overallScore)}`}>
                    {comparisons.get(model.id)!.overallScore.toFixed(1)}% vs MetisAI
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Comparison */}
        {selectedLLM && (
          <div className="mb-8">
            {(() => {
              const detailed = getDetailedComparison(selectedLLM);
              if (!detailed) return null;

              return (
                <div className="bg-metisai-blue rounded-lg p-6">
                  <h2 className="text-3xl font-bold mb-6 text-center">
                    MetisAI vs {detailed.competitor.name}
                  </h2>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* MetisAI */}
                    <div className="bg-metisai-dark-blue p-6 rounded-lg">
                      <h3 className="text-2xl font-bold mb-4 text-metisai-gradient">MetisAI Quantum-Enhanced</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Accuracy</span>
                            <span className={getScoreColor(detailed.metisAI.performance.accuracy)}>
                              {detailed.metisAI.performance.accuracy}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(detailed.metisAI.performance.accuracy)}`}
                              style={{ width: `${detailed.metisAI.performance.accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Speed</span>
                            <span className={getScoreColor(detailed.metisAI.performance.speed)}>
                              {detailed.metisAI.performance.speed}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(detailed.metisAI.performance.speed)}`}
                              style={{ width: `${detailed.metisAI.performance.speed}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Efficiency</span>
                            <span className={getScoreColor(detailed.metisAI.performance.efficiency)}>
                              {detailed.metisAI.performance.efficiency}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(detailed.metisAI.performance.efficiency)}`}
                              style={{ width: `${detailed.metisAI.performance.efficiency}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Reliability</span>
                            <span className={getScoreColor(detailed.metisAI.performance.reliability)}>
                              {detailed.metisAI.performance.reliability}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(detailed.metisAI.performance.reliability)}`}
                              style={{ width: `${detailed.metisAI.performance.reliability}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Competitor */}
                    <div className="bg-metisai-dark-blue p-6 rounded-lg">
                      <h3 className="text-2xl font-bold mb-4 text-gray-300">{detailed.competitor.name}</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Accuracy</span>
                            <span className={getScoreColor(detailed.competitor.performance.accuracy)}>
                              {detailed.competitor.performance.accuracy}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(detailed.competitor.performance.accuracy)}`}
                              style={{ width: `${detailed.competitor.performance.accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Speed</span>
                            <span className={getScoreColor(detailed.competitor.performance.speed)}>
                              {detailed.competitor.performance.speed}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(detailed.competitor.performance.speed)}`}
                              style={{ width: `${detailed.competitor.performance.speed}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Efficiency</span>
                            <span className={getScoreColor(detailed.competitor.performance.efficiency)}>
                              {detailed.competitor.performance.efficiency}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(detailed.competitor.performance.efficiency)}`}
                              style={{ width: `${detailed.competitor.performance.efficiency}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Reliability</span>
                            <span className={getScoreColor(detailed.competitor.performance.reliability)}>
                              {detailed.competitor.performance.reliability}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getScoreBarColor(detailed.competitor.performance.reliability)}`}
                              style={{ width: `${detailed.competitor.performance.reliability}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comparison Metrics */}
                  <div className="bg-metisai-dark-blue rounded-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">MetisAI Advantage Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-metisai-green mb-2">
                          {detailed.metrics.technicalSuperiority.toFixed(1)}%
                        </div>
                        <div className="text-sm">Technical Superiority</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-metisai-green mb-2">
                          {detailed.metrics.performanceAdvantage.toFixed(1)}%
                        </div>
                        <div className="text-sm">Performance Advantage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-metisai-green mb-2">
                          {detailed.metrics.overallScore.toFixed(1)}%
                        </div>
                        <div className="text-sm">Overall Advantage</div>
                      </div>
                    </div>
                  </div>

                  {/* Advantages and Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-metisai-dark-blue rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4 text-metisai-green">MetisAI Advantages</h3>
                      <ul className="space-y-2">
                        {detailed.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-metisai-green mr-2">✓</span>
                            <span className="text-sm">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-metisai-dark-blue rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-4 text-metisai-green">Recommendations</h3>
                      <ul className="space-y-2">
                        {detailed.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-metisai-green mr-2">→</span>
                            <span className="text-sm">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* All Models Overview */}
        <div className="bg-metisai-blue rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">All Models Performance Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-metisai-light-blue">
                  <th className="pb-3">Model</th>
                  <th className="pb-3">Provider</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Parameters</th>
                  <th className="pb-3">Context Length</th>
                  <th className="pb-3">Monthly Price</th>
                  <th className="pb-3">MetisAI Advantage</th>
                </tr>
              </thead>
              <tbody>
                {allModels.map((model) => (
                  <tr key={model.id} className="border-b border-metisai-light-blue/30">
                    <td className="py-3">
                      <div className="font-bold">{model.name}</div>
                      {model.id === 'metisai-quantum' && (
                        <span className="text-xs bg-metisai-green text-metisai-dark-blue px-2 py-1 rounded">
                          QUANTUM-ENHANCED
                        </span>
                      )}
                    </td>
                    <td className="py-3">{model.provider}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        model.type === 'quantum-enhanced' 
                          ? 'bg-metisai-green text-metisai-dark-blue' 
                          : 'bg-gray-600 text-gray-200'
                      }`}>
                        {model.type}
                      </span>
                    </td>
                    <td className="py-3">{formatNumber(model.parameters)}</td>
                    <td className="py-3">{formatNumber(model.contextLength)}</td>
                    <td className="py-3">
                      {model.pricing.monthly === 0 ? 'Free' : `$${model.pricing.monthly}`}
                    </td>
                    <td className="py-3">
                      {model.id === 'metisai-quantum' ? (
                        <span className="text-metisai-green font-bold">MetisAI</span>
                      ) : comparisons.has(model.id) ? (
                        <span className={getScoreColor(comparisons.get(model.id)!.overallScore)}>
                          {comparisons.get(model.id)!.overallScore.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMComparisonDashboard;
