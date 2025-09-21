import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { QuantumMarketplace } from '@/lib/marketplace/QuantumMarketplace';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { itemId, deploymentType, paymentMethod } = body;

    const marketplace = new QuantumMarketplace();
    
    // Create deployment request
    const deploymentRequest = await marketplace.createDeploymentRequest({
      id: '',
      userId: user.id,
      itemId,
      deploymentType,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Process purchase
    const purchase = await marketplace.processPurchase({
      userId: user.id,
      itemId,
      deploymentRequestId: deploymentRequest.id,
      paymentMethod,
      amount: 0, // Will be calculated by marketplace
      status: 'pending'
    });

    return NextResponse.json({
      success: true,
      purchase,
      deploymentRequest,
      message: 'Purchase initiated successfully'
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
