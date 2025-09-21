import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface SocialPlatform {
  id: string
  name: string
  icon: string
  color: string
  authUrl: string
  scopes: string[]
  features: string[]
  status: 'available' | 'maintenance' | 'deprecated'
}

const SUPPORTED_PLATFORMS: SocialPlatform[] = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    color: '#1DA1F2',
    authUrl: '/api/social/auth/twitter',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'follows.read', 'follows.write'],
    features: ['post', 'schedule', 'analytics', 'engagement', 'automation'],
    status: 'available'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0077B5',
    authUrl: '/api/social/auth/linkedin',
    scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
    features: ['post', 'schedule', 'analytics', 'networking', 'automation'],
    status: 'available'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    authUrl: '/api/social/auth/facebook',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    features: ['post', 'schedule', 'analytics', 'engagement', 'automation'],
    status: 'available'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    authUrl: '/api/social/auth/instagram',
    scopes: ['user_profile', 'user_media', 'instagram_basic'],
    features: ['post', 'schedule', 'analytics', 'stories', 'automation'],
    status: 'available'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    authUrl: '/api/social/auth/youtube',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'],
    features: ['upload', 'schedule', 'analytics', 'monetization', 'automation'],
    status: 'available'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    authUrl: '/api/social/auth/tiktok',
    scopes: ['user.info.basic', 'video.publish'],
    features: ['post', 'schedule', 'analytics', 'trends', 'automation'],
    status: 'available'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: '📌',
    color: '#BD081C',
    authUrl: '/api/social/auth/pinterest',
    scopes: ['pins:read', 'pins:write', 'boards:read', 'boards:write'],
    features: ['pin', 'schedule', 'analytics', 'boards', 'automation'],
    status: 'available'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🤖',
    color: '#FF4500',
    authUrl: '/api/social/auth/reddit',
    scopes: ['identity', 'submit', 'read', 'edit'],
    features: ['post', 'schedule', 'analytics', 'moderation', 'automation'],
    status: 'available'
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '🎮',
    color: '#5865F2',
    authUrl: '/api/social/auth/discord',
    scopes: ['identify', 'guilds', 'messages.read', 'messages.write'],
    features: ['message', 'schedule', 'analytics', 'community', 'automation'],
    status: 'available'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '✈️',
    color: '#0088CC',
    authUrl: '/api/social/auth/telegram',
    scopes: ['bot', 'user'],
    features: ['message', 'schedule', 'analytics', 'channels', 'automation'],
    status: 'available'
  },
  {
    id: 'mastodon',
    name: 'Mastodon',
    icon: '🐘',
    color: '#6364FF',
    authUrl: '/api/social/auth/mastodon',
    scopes: ['read', 'write', 'follow', 'push'],
    features: ['toot', 'schedule', 'analytics', 'federation', 'automation'],
    status: 'available'
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: '🧵',
    color: '#000000',
    authUrl: '/api/social/auth/threads',
    scopes: ['threads_basic', 'threads_content_publish'],
    features: ['post', 'schedule', 'analytics', 'engagement', 'automation'],
    status: 'available'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    // Get user's connected accounts
    const { data: connectedAccounts } = await supabase
      .from('social_accounts')
      .select('platform, username, display_name, avatar_url, connected_at, status')
      .eq('user_id', user.id)

    // Map connected accounts to platforms
    const connectedPlatforms = connectedAccounts?.reduce((acc, account) => {
      acc[account.platform] = {
        connected: true,
        username: account.username,
        display_name: account.display_name,
        avatar_url: account.avatar_url,
        connected_at: account.connected_at,
        status: account.status
      }
      return acc
    }, {} as Record<string, any>) || {}

    // Enhance platform data with connection status
    const platformsWithStatus = SUPPORTED_PLATFORMS.map(platform => ({
      ...platform,
      connected: connectedPlatforms[platform.id]?.connected || false,
      connection_info: connectedPlatforms[platform.id] || null
    }))

    return NextResponse.json({
      success: true,
      data: {
        platforms: platformsWithStatus,
        total_platforms: SUPPORTED_PLATFORMS.length,
        connected_platforms: Object.keys(connectedPlatforms).length
      }
    })

  } catch (error) {
    console.error('Error fetching social platforms:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch social platforms' } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const { platform, action, data } = await request.json()

    if (!platform || !action) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Platform and action are required' } },
        { status: 400 }
      )
    }

    switch (action) {
      case 'connect':
        return await handleConnect(supabase, user.id, platform, data)
      case 'disconnect':
        return await handleDisconnect(supabase, user.id, platform)
      case 'refresh':
        return await handleRefresh(supabase, user.id, platform)
      default:
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error handling social platform action:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to handle social platform action' } },
      { status: 500 }
    )
  }
}

async function handleConnect(supabase: any, userId: string, platform: string, data: any) {
  try {
    // Store connection data
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform,
        username: data.username,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        token_expires_at: data.token_expires_at,
        scopes: data.scopes,
        status: 'active',
        connected_at: new Date().toISOString()
      })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        platform,
        status: 'connected',
        message: `Successfully connected to ${platform}`
      }
    })

  } catch (error) {
    console.error('Error connecting to platform:', error)
    return NextResponse.json(
      { success: false, error: { code: 'CONNECTION_FAILED', message: 'Failed to connect to platform' } },
      { status: 500 }
    )
  }
}

async function handleDisconnect(supabase: any, userId: string, platform: string) {
  try {
    const { error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('user_id', userId)
      .eq('platform', platform)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        platform,
        status: 'disconnected',
        message: `Successfully disconnected from ${platform}`
      }
    })

  } catch (error) {
    console.error('Error disconnecting from platform:', error)
    return NextResponse.json(
      { success: false, error: { code: 'DISCONNECTION_FAILED', message: 'Failed to disconnect from platform' } },
      { status: 500 }
    )
  }
}

async function handleRefresh(supabase: any, userId: string, platform: string) {
  try {
    // Get current connection
    const { data: account } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .single()

    if (!account) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_CONNECTED', message: 'Platform not connected' } },
        { status: 404 }
      )
    }

    // Refresh token logic would go here
    // This would call the platform's refresh token endpoint

    return NextResponse.json({
      success: true,
      data: {
        platform,
        status: 'refreshed',
        message: `Successfully refreshed ${platform} connection`
      }
    })

  } catch (error) {
    console.error('Error refreshing platform connection:', error)
    return NextResponse.json(
      { success: false, error: { code: 'REFRESH_FAILED', message: 'Failed to refresh platform connection' } },
      { status: 500 }
    )
  }
}
