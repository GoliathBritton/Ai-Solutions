'use client'

import React, { useState, useEffect } from 'react'
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Youtube, 
  Music, 
  // Pinterest, 
  MessageCircle, 
  Gamepad2, 
  Send, 
  // Mastodon,
  // Threads,
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  Share2,
  MessageSquare,
  Eye,
  MousePointer,
  Bookmark,
  Calendar,
  Plus,
  Settings,
  RefreshCw
} from 'lucide-react'

interface SocialPlatform {
  id: string
  name: string
  icon: string
  color: string
  connected: boolean
  username?: string
  followers?: number
  engagement_rate?: number
  status?: string
}

interface PostContent {
  text: string
  images: string[]
  platforms: string[]
  scheduled_at?: string
}

interface AnalyticsData {
  overview: {
    total_followers: number
    total_posts: number
    average_engagement_rate: number
    total_reach: number
    total_revenue: number
  }
  platforms: Array<{
    platform: string
    followers: number
    engagement_rate: number
    posts: number
  }>
  top_posts: Array<{
    post_id: string
    platform: string
    content: string
    metrics: {
      likes: number
      shares: number
      comments: number
      views: number
    }
  }>
}

const SocialMediaDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'compose' | 'analytics' | 'schedule'>('overview')
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [postContent, setPostContent] = useState<PostContent>({
    text: '',
    images: [],
    platforms: [],
    scheduled_at: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchPlatforms()
    fetchAnalytics()
  }, [])

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/social/connect')
      const data = await response.json()
      
      if (data.success) {
        setPlatforms(data.data.platforms)
      }
    } catch (error) {
      console.error('Error fetching platforms:', error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/social/analytics')
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const connectPlatform = async (platformId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platformId,
          action: 'connect'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchPlatforms()
      }
    } catch (error) {
      console.error('Error connecting platform:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectPlatform = async (platformId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platformId,
          action: 'disconnect'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchPlatforms()
      }
    } catch (error) {
      console.error('Error disconnecting platform:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const publishPost = async () => {
    if (!postContent.text.trim() || postContent.platforms.length === 0) {
      alert('Please add content and select at least one platform')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/social/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postContent)
      })
      
      const data = await response.json()
      if (data.success) {
        alert(`Post published to ${data.data.successful_posts} platforms`)
        setPostContent({ text: '', images: [], platforms: [], scheduled_at: '' })
      }
    } catch (error) {
      console.error('Error publishing post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlatformIcon = (platformId: string) => {
    const icons: Record<string, React.ReactNode> = {
      twitter: <Twitter className="w-5 h-5" />,
      linkedin: <Linkedin className="w-5 h-5" />,
      facebook: <Facebook className="w-5 h-5" />,
      instagram: <Instagram className="w-5 h-5" />,
      youtube: <Youtube className="w-5 h-5" />,
      tiktok: <Music className="w-5 h-5" />,
      pinterest: <Pinterest className="w-5 h-5" />,
      reddit: <MessageCircle className="w-5 h-5" />,
      discord: <Gamepad2 className="w-5 h-5" />,
      telegram: <Send className="w-5 h-5" />,
      mastodon: <Mastodon className="w-5 h-5" />,
      threads: <Threads className="w-5 h-5" />
    }
    return icons[platformId] || <div className="w-5 h-5 bg-gray-300 rounded" />
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Social Media Dashboard
          </h1>
          <p className="text-gray-600">
            Manage all your social media accounts from one place
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'compose', label: 'Compose', icon: Plus },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'schedule', label: 'Schedule', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Followers</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(analytics.overview.total_followers)}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Posts</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.overview.total_posts}
                      </p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.overview.average_engagement_rate.toFixed(1)}%
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reach</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(analytics.overview.total_reach)}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Connected Platforms */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Connected Platforms</h2>
                <p className="text-gray-600">Manage your social media accounts</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      className={`border rounded-lg p-4 transition-colors ${
                        platform.connected
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: platform.color }}
                          >
                            {getPlatformIcon(platform.id)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{platform.name}</h3>
                            {platform.connected && platform.username && (
                              <p className="text-sm text-gray-600">@{platform.username}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {platform.connected ? (
                            <button
                              onClick={() => disconnectPlatform(platform.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                              disabled={isLoading}
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button
                              onClick={() => connectPlatform(platform.id)}
                              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                              disabled={isLoading}
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {platform.connected && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Followers</p>
                            <p className="font-medium">{formatNumber(platform.followers || 0)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Engagement</p>
                            <p className="font-medium">{(platform.engagement_rate || 0).toFixed(1)}%</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Create Post</h2>
                <p className="text-gray-600">Write and publish content across all platforms</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Platforms
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {platforms.filter(p => p.connected).map((platform) => (
                      <label
                        key={platform.id}
                        className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={postContent.platforms.includes(platform.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPostContent(prev => ({
                                ...prev,
                                platforms: [...prev.platforms, platform.id]
                              }))
                            } else {
                              setPostContent(prev => ({
                                ...prev,
                                platforms: prev.platforms.filter(p => p !== platform.id)
                              }))
                            }
                          }}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: platform.color }}
                        >
                          {getPlatformIcon(platform.id)}
                        </div>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Content Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={postContent.text}
                    onChange={(e) => setPostContent(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="What's on your mind?"
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {postContent.text.length}/280 characters
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2">Click to upload images or drag and drop</p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={postContent.scheduled_at}
                    onChange={(e) => setPostContent(prev => ({ ...prev, scheduled_at: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Publish Button */}
                <div className="flex justify-end">
                  <button
                    onClick={publishPost}
                    disabled={isLoading || !postContent.text.trim() || postContent.platforms.length === 0}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{postContent.scheduled_at ? 'Schedule Post' : 'Publish Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Platform Performance */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Platform Performance</h2>
                <p className="text-gray-600">Compare performance across platforms</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.platforms.map((platform) => (
                    <div key={platform.platform} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-purple-600">
                          {getPlatformIcon(platform.platform)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">{platform.platform}</h3>
                          <p className="text-sm text-gray-600">{platform.posts} posts</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Followers</p>
                          <p className="font-medium">{formatNumber(platform.followers)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className="font-medium">{platform.engagement_rate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Posts */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Top Performing Posts</h2>
                <p className="text-gray-600">Your best content across all platforms</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.top_posts.slice(0, 5).map((post, index) => (
                    <div key={post.post_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 line-clamp-2">{post.content}</p>
                          <p className="text-xs text-gray-500 capitalize">{post.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1 text-red-600">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(post.metrics.likes)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Share2 className="w-4 h-4" />
                          <span>{formatNumber(post.metrics.shares)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-green-600">
                          <MessageSquare className="w-4 h-4" />
                          <span>{formatNumber(post.metrics.comments)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-purple-600">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(post.metrics.views)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Scheduled Posts</h2>
                <p className="text-gray-600">Manage your scheduled content</p>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled posts</h3>
                  <p className="text-gray-600 mb-4">Schedule your first post to get started</p>
                  <button
                    onClick={() => setActiveTab('compose')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialMediaDashboard
