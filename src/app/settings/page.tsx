"use client";

import { useAuth } from '@/contexts/AuthContext'
import MetisAILogo from '@/components/MetisAILogo'

export default function Settings() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <MetisAILogo size={80} tagline="Quantum Enhanced AI Platform" />
          <h1 className="text-2xl font-bold text-white mt-6">Access Denied</h1>
          <p className="text-gray-400 mt-2">Please sign in to view settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <MetisAILogo size={80} tagline="Settings" />
          <h1 className="text-3xl font-bold text-white mt-6">Settings</h1>
          <p className="text-gray-400 mt-2">Configure your MetisAI experience</p>
        </div>

        <div className="space-y-8">
          {/* Quantum Processing Settings */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Quantum Processing</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Enable Quantum Processing</h3>
                  <p className="text-sm text-gray-400">Use quantum-enhanced models for better performance</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Dynex Integration</h3>
                  <p className="text-sm text-gray-400">Connect to neuromorphic computing platform</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Model Preferences */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Model Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Model
                </label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option value="qdllm">qdLLM (Quantum Diffusion LLM)</option>
                  <option value="qnlp">QNLP (Quantum Natural Language Processing)</option>
                  <option value="qtransform">QTransform (Quantum Transformer)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Temperature
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  defaultValue="0.8"
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Conservative (0.1)</span>
                  <span>Creative (2.0)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Response Length
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  defaultValue="200"
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Short (50)</span>
                  <span>Long (1000)</span>
                </div>
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">API Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value="sk-metisai-••••••••••••••••••••••••••••••••"
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  />
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">
                    Copy
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">
                    Regenerate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rate Limit
                </label>
                <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                  1000 requests per hour
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                Save Settings
              </button>
              <button className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                Export Data
              </button>
              <button className="w-full px-4 py-2 border border-red-600 text-red-300 rounded-lg hover:bg-red-600/20 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
