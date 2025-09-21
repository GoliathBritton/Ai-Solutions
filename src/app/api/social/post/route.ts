import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface PostContent {
  text?: string
  images?: string[]
  videos?: string[]
  links?: string[]
  hashtags?: string[]
  mentions?: string[]
  location?: {
    name: string
    coordinates?: { lat: number; lng: number }
  }
  scheduled_at?: string
  platforms: string[]
}

interface PostResult {
  platform: string
  success: boolean
  post_id?: string
  url?: string
  error?: string
  metrics?: {
    likes?: number
    shares?: number
    comments?: number
    views?: number
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

    const content: PostContent = await request.json()

    if (!content.platforms || content.platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'At least one platform is required' } },
        { status: 400 }
      )
    }

    // Get user's connected social accounts
    const { data: connectedAccounts } = await supabase
      .from('social_accounts')
      .select('platform, access_token, refresh_token, token_expires_at, scopes')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .in('platform', content.platforms)

    if (!connectedAccounts || connectedAccounts.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_CONNECTIONS', message: 'No connected social accounts found' } },
        { status: 400 }
      )
    }

    // Process post for each platform
    const results: PostResult[] = []
    
    for (const account of connectedAccounts) {
      try {
        const result = await postToPlatform(account, content)
        results.push(result)
      } catch (error) {
        results.push({
          platform: account.platform,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Store post in database
    const { data: postRecord } = await supabase
      .from('social_posts')
      .insert({
        user_id: user.id,
        content: content.text || '',
        platforms: content.platforms,
        scheduled_at: content.scheduled_at || new Date().toISOString(),
        status: 'published',
        results: results
      })
      .select()
      .single()

    return NextResponse.json({
      success: true,
      data: {
        post_id: postRecord?.id,
        results,
        total_platforms: content.platforms.length,
        successful_posts: results.filter(r => r.success).length,
        failed_posts: results.filter(r => !r.success).length
      }
    })

  } catch (error) {
    console.error('Error posting to social media:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to post to social media' } },
      { status: 500 }
    )
  }
}

async function postToPlatform(account: any, content: PostContent): Promise<PostResult> {
  const { platform, access_token } = account

  switch (platform) {
    case 'twitter':
      return await postToTwitter(access_token, content)
    case 'linkedin':
      return await postToLinkedIn(access_token, content)
    case 'facebook':
      return await postToFacebook(access_token, content)
    case 'instagram':
      return await postToInstagram(access_token, content)
    case 'youtube':
      return await postToYouTube(access_token, content)
    case 'tiktok':
      return await postToTikTok(access_token, content)
    case 'pinterest':
      return await postToPinterest(access_token, content)
    case 'reddit':
      return await postToReddit(access_token, content)
    case 'discord':
      return await postToDiscord(access_token, content)
    case 'telegram':
      return await postToTelegram(access_token, content)
    case 'mastodon':
      return await postToMastodon(access_token, content)
    case 'threads':
      return await postToThreads(access_token, content)
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

async function postToTwitter(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Twitter API v2 implementation
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: formatTwitterContent(content)
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || 'Twitter API error')
    }

    return {
      platform: 'twitter',
      success: true,
      post_id: data.data.id,
      url: `https://twitter.com/user/status/${data.data.id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'twitter',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToLinkedIn(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // LinkedIn API implementation
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        author: 'urn:li:person:YOUR_PERSON_ID', // This would be fetched from user profile
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: formatLinkedInContent(content)
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'LinkedIn API error')
    }

    return {
      platform: 'linkedin',
      success: true,
      post_id: data.id,
      url: `https://www.linkedin.com/feed/update/${data.id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'linkedin',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToFacebook(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Facebook Graph API implementation
    const response = await fetch(`https://graph.facebook.com/v18.0/me/feed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: formatFacebookContent(content)
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Facebook API error')
    }

    return {
      platform: 'facebook',
      success: true,
      post_id: data.id,
      url: `https://www.facebook.com/permalink.php?story_fbid=${data.id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'facebook',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToInstagram(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Instagram Basic Display API implementation
    // Note: Instagram posting requires Instagram Business API
    const response = await fetch('https://graph.instagram.com/v18.0/me/media', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: content.images?.[0] || '',
        caption: formatInstagramContent(content)
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Instagram API error')
    }

    return {
      platform: 'instagram',
      success: true,
      post_id: data.id,
      url: `https://www.instagram.com/p/${data.id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'instagram',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToYouTube(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // YouTube Data API implementation
    const response = await fetch('https://www.googleapis.com/youtube/v3/videos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        snippet: {
          title: content.text?.substring(0, 100) || 'MetisAI Generated Content',
          description: formatYouTubeContent(content),
          tags: content.hashtags || []
        },
        status: {
          privacyStatus: 'public'
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API error')
    }

    return {
      platform: 'youtube',
      success: true,
      post_id: data.id,
      url: `https://www.youtube.com/watch?v=${data.id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0,
        views: 0
      }
    }
  } catch (error) {
    return {
      platform: 'youtube',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToTikTok(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // TikTok for Business API implementation
    const response = await fetch('https://open-api.tiktok.com/v2/post/publish/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_info: {
          title: content.text?.substring(0, 100) || 'MetisAI Generated Content',
          description: formatTikTokContent(content),
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'TikTok API error')
    }

    return {
      platform: 'tiktok',
      success: true,
      post_id: data.data.publish_id,
      url: `https://www.tiktok.com/@user/video/${data.data.publish_id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0,
        views: 0
      }
    }
  } catch (error) {
    return {
      platform: 'tiktok',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToPinterest(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Pinterest API implementation
    const response = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        board_id: 'YOUR_BOARD_ID', // This would be fetched from user's boards
        title: content.text?.substring(0, 100) || 'MetisAI Pin',
        description: formatPinterestContent(content),
        media_source: {
          source_type: 'image_url',
          url: content.images?.[0] || ''
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Pinterest API error')
    }

    return {
      platform: 'pinterest',
      success: true,
      post_id: data.id,
      url: `https://www.pinterest.com/pin/${data.id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'pinterest',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToReddit(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Reddit API implementation
    const response = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'MetisAI/1.0'
      },
      body: new URLSearchParams({
        sr: 'test', // Subreddit - this would be configurable
        kind: 'self',
        title: content.text?.substring(0, 300) || 'MetisAI Post',
        text: formatRedditContent(content),
        api_type: 'json'
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Reddit API error')
    }

    return {
      platform: 'reddit',
      success: true,
      post_id: data.json.data.id,
      url: `https://www.reddit.com${data.json.data.permalink}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'reddit',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToDiscord(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Discord API implementation
    const response = await fetch(`https://discord.com/api/v10/channels/YOUR_CHANNEL_ID/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: formatDiscordContent(content),
        embeds: content.links?.map(link => ({
          title: 'Link',
          url: link,
          color: 0x5865F2
        }))
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Discord API error')
    }

    return {
      platform: 'discord',
      success: true,
      post_id: data.id,
      url: `https://discord.com/channels/YOUR_GUILD_ID/YOUR_CHANNEL_ID/${data.id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'discord',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToTelegram(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Telegram Bot API implementation
    const response = await fetch(`https://api.telegram.org/bot${accessToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: 'YOUR_CHAT_ID', // This would be configurable
        text: formatTelegramContent(content),
        parse_mode: 'Markdown'
      })
    })

    const data = await response.json()

    if (!data.ok) {
      throw new Error(data.description || 'Telegram API error')
    }

    return {
      platform: 'telegram',
      success: true,
      post_id: data.result.message_id.toString(),
      url: `https://t.me/YOUR_CHANNEL/${data.result.message_id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'telegram',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToMastodon(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Mastodon API implementation
    const response = await fetch('https://mastodon.social/api/v1/statuses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: formatMastodonContent(content),
        visibility: 'public'
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Mastodon API error')
    }

    return {
      platform: 'mastodon',
      success: true,
      post_id: data.id,
      url: data.url,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'mastodon',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function postToThreads(accessToken: string, content: PostContent): Promise<PostResult> {
  try {
    // Threads API implementation (Meta's Threads)
    const response = await fetch('https://graph.threads.net/v1.0/me/media', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: content.images?.[0] || '',
        caption: formatThreadsContent(content)
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Threads API error')
    }

    return {
      platform: 'threads',
      success: true,
      post_id: data.id,
      url: `https://www.threads.net/@user/post/${data.id}`,
      metrics: {
        likes: 0,
        shares: 0,
        comments: 0
      }
    }
  } catch (error) {
    return {
      platform: 'threads',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Content formatting functions for each platform
function formatTwitterContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += ' ' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  if (content.mentions) {
    text += ' ' + content.mentions.map(mention => `@${mention}`).join(' ')
  }
  return text.substring(0, 280) // Twitter character limit
}

function formatLinkedInContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatFacebookContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatInstagramContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatYouTubeContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatTikTokContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += ' ' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatPinterestContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += ' ' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatRedditContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatDiscordContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatTelegramContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatMastodonContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}

function formatThreadsContent(content: PostContent): string {
  let text = content.text || ''
  if (content.hashtags) {
    text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ')
  }
  return text
}
