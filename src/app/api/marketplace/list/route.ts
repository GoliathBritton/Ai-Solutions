import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { QuantumMarketplace } from '@/lib/marketplace/QuantumMarketplace';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const complexity = searchParams.get('complexity');
    const priceRange = searchParams.get('priceRange');

    const marketplace = new QuantumMarketplace();
    const items = await marketplace.getMarketplaceItems({
      category,
      complexity,
      priceRange
    });
    
    return NextResponse.json({
      success: true,
      items,
      total: items.length,
      filters: {
        category,
        complexity,
        priceRange
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace items' },
      { status: 500 }
    );
  }
}
