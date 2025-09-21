import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SubscriptionManager } from '@/lib/subscription/SubscriptionManager';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptionManager = new SubscriptionManager();
    const subscription = await subscriptionManager.getUserSubscription(user.id);
    
    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: null,
        message: 'No active subscription found'
      });
    }

    // Get usage statistics
    const usage = await subscriptionManager.getUsageStatistics(user.id);
    
    return NextResponse.json({
      success: true,
      subscription,
      usage,
      message: 'Subscription status retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}
