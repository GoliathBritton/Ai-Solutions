import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DynamicPricing } from '@/lib/pricing/DynamicPricing';

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
      usage, 
      selectedAlgorithms, 
      selectedAutomations,
      consultingHours,
      setupRequired 
    } = body;

    const pricing = new DynamicPricing();
    
    // Calculate base subscription cost
    const baseCost = pricing.calculateSubscriptionCost(subscriptionTier);
    
    // Calculate overage costs
    const overageCost = pricing.calculateOverageCost(subscriptionTier, usage);
    
    // Calculate algorithm costs
    const algorithmCost = pricing.calculateAlgorithmCost(selectedAlgorithms);
    
    // Calculate automation costs
    const automationCost = pricing.calculateAutomationCost(selectedAutomations);
    
    // Calculate consulting costs
    const consultingCost = pricing.calculateConsultingCost(consultingHours);
    
    // Calculate setup fees
    const setupCost = pricing.calculateSetupFee(setupRequired);
    
    // Calculate total cost
    const totalCost = baseCost + overageCost + algorithmCost + automationCost + consultingCost + setupCost;
    
    // Calculate discounts
    const discounts = pricing.calculateDiscounts({
      subscriptionTier,
      totalCost,
      selectedAlgorithms: selectedAlgorithms.length,
      selectedAutomations: selectedAutomations.length
    });
    
    const finalCost = totalCost - discounts;

    return NextResponse.json({
      success: true,
      pricing: {
        baseCost,
        overageCost,
        algorithmCost,
        automationCost,
        consultingCost,
        setupCost,
        discounts,
        totalCost,
        finalCost
      },
      breakdown: {
        subscriptionTier,
        usage,
        selectedAlgorithms: selectedAlgorithms.length,
        selectedAutomations: selectedAutomations.length,
        consultingHours,
        setupRequired
      }
    });
  } catch (error) {
    console.error('Error calculating pricing:', error);
    return NextResponse.json(
      { error: 'Failed to calculate pricing' },
      { status: 500 }
    );
  }
}
