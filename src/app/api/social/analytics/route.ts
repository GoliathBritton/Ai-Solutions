import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface AnalyticsQuery {
  platforms?: string[]
  date_range?: {
    start: string
    end: string
  }
  metrics?: string[]
  group_by?: 'day' | 'week' | 'month'
}

interface PlatformMetrics {
  platform: string
  followers: number
  following: number
  posts: number
  engagement_rate: number
  reach: number
  impressions: number
  likes: number
  shares: number
  comments: number
  clicks: number
  saves: number
  profile_views: number
  website_clicks: number
  email_signups: number
  conversions: number
  revenue: number
}

interface PostAnalytics {
  post_id: string
  platform: string
  content: string
  posted_at: string
  metrics: {
    likes: number
    shares: number
    comments: number
    views: number
    clicks: number
    saves: number
    engagement_rate: number
    reach: number
    impressions: number
  }
  performance_score: number
  best_performing: boolean
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const platforms = searchParams.get('platforms')?.split(',') || []
    const startDate = searchParams.get('start_date') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get('end_date') || new Date().toISOString()
    const groupBy = searchParams.get('group_by') || 'day'

    // Get user's connected social accounts
    const { data: connectedAccounts } = await supabase
      .from('social_accounts')
      .select('platform, username, display_name, avatar_url, connected_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .in('platform', platforms.length > 0 ? platforms : ['twitter', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok', 'pinterest', 'reddit', 'discord', 'telegram', 'mastodon', 'threads'])

    if (!connectedAccounts || connectedAccounts.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_CONNECTIONS', message: 'No connected social accounts found' } },
        { status: 400 }
      )
    }

    // Get analytics data for each platform
    const platformMetrics: PlatformMetrics[] = []
    const postAnalytics: PostAnalytics[] = []

    for (const account of connectedAccounts) {
      try {
        const metrics = await getPlatformAnalytics(account.platform, account.username, startDate, endDate)
        platformMetrics.push(metrics)

        const posts = await getPostAnalytics(account.platform, account.username, startDate, endDate)
        postAnalytics.push(...posts)
      } catch (error) {
        console.error(`Error fetching analytics for ${account.platform}:`, error)
      }
    }

    // Calculate overall metrics
    const overallMetrics = calculateOverallMetrics(platformMetrics)
    const topPosts = postAnalytics
      .sort((a, b) => b.performance_score - a.performance_score)
      .slice(0, 10)

    // Get time series data
    const timeSeriesData = await getTimeSeriesData(supabase, user.id, startDate, endDate, groupBy)

    return NextResponse.json({
      success: true,
      data: {
        overview: overallMetrics,
        platforms: platformMetrics,
        posts: postAnalytics,
        top_posts: topPosts,
        time_series: timeSeriesData,
        date_range: {
          start: startDate,
          end: endDate
        },
        total_platforms: connectedAccounts.length,
        total_posts: postAnalytics.length
      }
    })

  } catch (error) {
    console.error('Error fetching social analytics:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch social analytics' } },
      { status: 500 }
    )
  }
}

async function getPlatformAnalytics(platform: string, username: string, startDate: string, endDate: string): Promise<PlatformMetrics> {
  // This would integrate with each platform's analytics API
  // For now, returning mock data with realistic values
  
  const baseMetrics = {
    followers: Math.floor(Math.random() * 10000) + 1000,
    following: Math.floor(Math.random() * 1000) + 100,
    posts: Math.floor(Math.random() * 100) + 10,
    engagement_rate: Math.random() * 5 + 1, // 1-6%
    reach: Math.floor(Math.random() * 50000) + 5000,
    impressions: Math.floor(Math.random() * 100000) + 10000,
    likes: Math.floor(Math.random() * 5000) + 500,
    shares: Math.floor(Math.random() * 500) + 50,
    comments: Math.floor(Math.random() * 1000) + 100,
    clicks: Math.floor(Math.random() * 2000) + 200,
    saves: Math.floor(Math.random() * 500) + 50,
    profile_views: Math.floor(Math.random() * 2000) + 200,
    website_clicks: Math.floor(Math.random() * 1000) + 100,
    email_signups: Math.floor(Math.random() * 100) + 10,
    conversions: Math.floor(Math.random() * 50) + 5,
    revenue: Math.floor(Math.random() * 5000) + 500
  }

  // Platform-specific adjustments
  switch (platform) {
    case 'twitter':
      return {
        ...baseMetrics,
        platform: 'twitter',
        engagement_rate: baseMetrics.engagement_rate * 1.2, // Twitter typically has higher engagement
        shares: baseMetrics.shares * 2 // More retweets
      }
    case 'linkedin':
      return {
        ...baseMetrics,
        platform: 'linkedin',
        engagement_rate: baseMetrics.engagement_rate * 0.8, // LinkedIn has lower but more valuable engagement
        comments: baseMetrics.comments * 1.5 // More professional discussions
      }
    case 'instagram':
      return {
        ...baseMetrics,
        platform: 'instagram',
        engagement_rate: baseMetrics.engagement_rate * 1.5, // Instagram has high engagement
        saves: baseMetrics.saves * 3 // More saves on Instagram
      }
    case 'youtube':
      return {
        ...baseMetrics,
        platform: 'youtube',
        views: baseMetrics.impressions * 0.8, // YouTube focuses on views
        comments: baseMetrics.comments * 2 // More comments on videos
      }
    case 'tiktok':
      return {
        ...baseMetrics,
        platform: 'tiktok',
        engagement_rate: baseMetrics.engagement_rate * 2, // TikTok has very high engagement
        views: baseMetrics.impressions * 1.2
      }
    default:
      return {
        ...baseMetrics,
        platform
      }
  }
}

async function getPostAnalytics(platform: string, username: string, startDate: string, endDate: string): Promise<PostAnalytics[]> {
  // This would fetch actual post analytics from each platform
  // For now, returning mock data
  
  const posts: PostAnalytics[] = []
  const postCount = Math.floor(Math.random() * 20) + 5

  for (let i = 0; i < postCount; i++) {
    const likes = Math.floor(Math.random() * 1000) + 10
    const shares = Math.floor(Math.random() * 100) + 1
    const comments = Math.floor(Math.random() * 200) + 5
    const views = Math.floor(Math.random() * 5000) + 100
    const clicks = Math.floor(Math.random() * 100) + 5
    const saves = Math.floor(Math.random() * 50) + 1

    const engagement = likes + shares + comments + clicks + saves
    const engagementRate = (engagement / views) * 100

    posts.push({
      post_id: `${platform}_${Date.now()}_${i}`,
      platform,
      content: `Sample post content ${i + 1}`,
      posted_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: {
        likes,
        shares,
        comments,
        views,
        clicks,
        saves,
        engagement_rate: engagementRate,
        reach: views * 1.2,
        impressions: views * 1.5
      },
      performance_score: engagementRate * (views / 1000),
      best_performing: i === 0 // First post is "best performing"
    })
  }

  return posts
}

function calculateOverallMetrics(platformMetrics: PlatformMetrics[]) {
  return {
    total_followers: platformMetrics.reduce((sum, p) => sum + p.followers, 0),
    total_following: platformMetrics.reduce((sum, p) => sum + p.following, 0),
    total_posts: platformMetrics.reduce((sum, p) => sum + p.posts, 0),
    average_engagement_rate: platformMetrics.reduce((sum, p) => sum + p.engagement_rate, 0) / platformMetrics.length,
    total_reach: platformMetrics.reduce((sum, p) => sum + p.reach, 0),
    total_impressions: platformMetrics.reduce((sum, p) => sum + p.impressions, 0),
    total_likes: platformMetrics.reduce((sum, p) => sum + p.likes, 0),
    total_shares: platformMetrics.reduce((sum, p) => sum + p.shares, 0),
    total_comments: platformMetrics.reduce((sum, p) => sum + p.comments, 0),
    total_clicks: platformMetrics.reduce((sum, p) => sum + p.clicks, 0),
    total_saves: platformMetrics.reduce((sum, p) => sum + p.saves, 0),
    total_profile_views: platformMetrics.reduce((sum, p) => sum + p.profile_views, 0),
    total_website_clicks: platformMetrics.reduce((sum, p) => sum + p.website_clicks, 0),
    total_email_signups: platformMetrics.reduce((sum, p) => sum + p.email_signups, 0),
    total_conversions: platformMetrics.reduce((sum, p) => sum + p.conversions, 0),
    total_revenue: platformMetrics.reduce((sum, p) => sum + p.revenue, 0)
  }
}

async function getTimeSeriesData(supabase: any, userId: string, startDate: string, endDate: string, groupBy: string) {
  // This would fetch time series data from the database
  // For now, returning mock data
  
  const timeSeries = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const interval = groupBy === 'day' ? 24 * 60 * 60 * 1000 : 
                   groupBy === 'week' ? 7 * 24 * 60 * 60 * 1000 : 
                   30 * 24 * 60 * 60 * 1000

  for (let date = start; date <= end; date = new Date(date.getTime() + interval)) {
    timeSeries.push({
      date: date.toISOString().split('T')[0],
      followers: Math.floor(Math.random() * 100) + 50,
      posts: Math.floor(Math.random() * 5) + 1,
      engagement: Math.floor(Math.random() * 1000) + 100,
      reach: Math.floor(Math.random() * 5000) + 500,
      impressions: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 500) + 50,
      shares: Math.floor(Math.random() * 50) + 5,
      comments: Math.floor(Math.random() * 100) + 10,
      clicks: Math.floor(Math.random() * 200) + 20,
      revenue: Math.floor(Math.random() * 100) + 10
    })
  }

  return timeSeries
}
