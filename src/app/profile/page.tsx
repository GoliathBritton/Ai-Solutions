"use client";

import { useAuth } from '@/contexts/AuthContext'
import MetisAILogo from '@/components/MetisAILogo'

export default function Profile() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
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
          <p className="text-gray-400 mt-2">Please sign in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <MetisAILogo size={80} tagline="User Profile" />
          <h1 className="text-3xl font-bold text-white mt-6">Profile</h1>
          <p className="text-gray-400 mt-2">Manage your MetisAI account</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    User ID
                  </label>
                  <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white font-mono text-sm">
                    {user.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Account Created
                  </label>
                  <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Sign In
                  </label>
                  <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Quantum AI Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">Quantum Processing</h3>
                    <p className="text-sm text-gray-400">Access to quantum-enhanced models</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">Dynex Integration</h3>
                    <p className="text-sm text-gray-400">Neuromorphic computing access</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Connected</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">API Access</h3>
                    <p className="text-sm text-gray-400">Quantum model endpoints</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                Generate API Key
              </button>
              <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                View Usage Stats
              </button>
              <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                Download Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
