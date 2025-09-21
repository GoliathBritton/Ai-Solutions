import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SubscriptionManager } from '@/lib/subscription/SubscriptionManager';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      subscriptionTier, 
      selectedAlgorithms, 
      selectedAutomations,
      consultingHours,
      setupRequired,
      paymentMethod 
    } = body;

    const subscriptionManager = new SubscriptionManager();
    
    // Create subscription
    const subscription = await subscriptionManager.createSubscription({
      id: '',
      userId: user.id,
      tier: subscriptionTier,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      selectedAlgorithms,
      selectedAutomations,
      consultingHours,
      setupRequired,
      paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Subscription created successfully'
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
