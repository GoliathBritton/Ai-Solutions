import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { QUBOCatalog } from '@/lib/quantum/QUBOCatalog';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const catalog = new QUBOCatalog();
    const automations = await catalog.getAllAutomations();
    
    return NextResponse.json({ 
      success: true, 
      automations,
      total: automations.length 
    });
  } catch (error) {
    console.error('Error fetching automations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, complexity, price, features, requirements, deploymentType } = body;

    const catalog = new QUBOCatalog();
    const automation = await catalog.addAutomation({
      id: '',
      name,
      description,
      category,
      complexity,
      price,
      features,
      requirements,
      deploymentType,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      automation 
    });
  } catch (error) {
    console.error('Error creating automation:', error);
    return NextResponse.json(
      { error: 'Failed to create automation' },
      { status: 500 }
    );
  }
}
