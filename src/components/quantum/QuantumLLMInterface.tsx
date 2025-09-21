"use client";

import React, { useState, useCallback } from "react";

interface QuantumLLMProps {
  className?: string;
}

interface GenerationResult {
  text: string;
  method: "quantum" | "classical";
  confidence: number;
  processingTime: number;
}

/**
 * Quantum LLM Interface Component
 * Provides UI for interacting with qdLLM, QNLP, and QTransformers
 */
export default function QuantumLLMInterface({ className }: QuantumLLMProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [selectedModel, setSelectedModel] = useState<"qdllm" | "qnlp" | "qtransform">("qdllm");
  const [useQuantum, setUseQuantum] = useState(true);
  const [maxLength, setMaxLength] = useState(100);
  const [temperature, setTemperature] = useState(0.8);

  const getApiEndpoint = (model: string) => {
    switch (model) {
      case "qdllm":
        return "/api/quantum/qdllm/generate";
      case "qnlp":
        return "/api/quantum/qnlp/process";
      case "qtransform":
        return "/api/quantum/qtransform/generate";
      default:
        return "/api/quantum/qdllm/generate";
    }
  };

  const getRequestBody = (model: string) => {
    const baseBody = {
      prompt: prompt,
      max_length: maxLength,
      temperature: temperature,
      use_quantum: useQuantum,
    };

    switch (model) {
      case "qnlp":
        return {
          text: prompt,
          task: "sentiment",
          reference_texts: [
            "Quantum computing is the future of technology.",
            "Artificial intelligence will transform our world.",
            "Machine learning algorithms are becoming more sophisticated.",
          ],
          use_quantum: useQuantum,
        };
      case "qdllm":
      case "qtransform":
      default:
        return baseBody;
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const endpoint = getApiEndpoint(selectedModel);
      const requestBody = getRequestBody(selectedModel);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      if (data.success) {
        setResult(data.data);
      } else {
        throw new Error(data.error?.message || 'Generation failed');
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setResult({
        text: `Error: ${error instanceof Error ? error.message : 'Failed to generate text. Please try again.'}`,
        method: "classical",
        confidence: 0,
        processingTime: 0,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedModel, useQuantum, maxLength, temperature, getApiEndpoint, getRequestBody]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Quantum LLM Interface
        </h2>
        <p className="text-gray-400">
          Experience the power of quantum-enhanced language models
        </p>
      </div>

      {/* Model Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Model
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "qdllm", name: "qdLLM", desc: "Quantum Diffusion LLM" },
              { id: "qnlp", name: "QNLP", desc: "Quantum NLP" },
              { id: "qtransform", name: "QTransform", desc: "Quantum Transformer" },
            ].map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id as "qdllm" | "qnlp" | "qtransform")}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedModel === model.id
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="font-semibold">{model.name}</div>
                <div className="text-xs opacity-75">{model.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quantum Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Enable Quantum Processing
          </label>
          <button
            onClick={() => setUseQuantum(!useQuantum)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useQuantum ? "bg-purple-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useQuantum ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        {/* Parameters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Length: {maxLength}
            </label>
            <input
              type="range"
              min="10"
              max="500"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Temperature: {temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating with Quantum Processing...</span>
          </div>
        ) : (
          `Generate with ${selectedModel.toUpperCase()}`
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Generated Text</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span
                  className={`px-2 py-1 rounded ${
                    result.method === "quantum"
                      ? "bg-purple-600/20 text-purple-300"
                      : "bg-gray-600/20 text-gray-300"
                  }`}
                >
                  {result.method === "quantum" ? "Quantum" : "Classical"}
                </span>
                <span>Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                <span>Time: {result.processingTime.toFixed(2)}s</span>
              </div>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap">
              {result.text}
            </div>
          </div>
        </div>
      )}

      {/* Quantum Status */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              useQuantum ? "bg-green-400" : "bg-yellow-400"
            }`}
          />
          <span className="text-gray-300">
            {useQuantum
              ? "Quantum processing enabled - leveraging Dynex neuromorphic computing"
              : "Classical processing mode - using standard algorithms"}
          </span>
        </div>
      </div>
    </div>
  );
}
