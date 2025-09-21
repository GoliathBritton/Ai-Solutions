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
    const algorithms = await catalog.getAllAlgorithms();
    
    return NextResponse.json({ 
      success: true, 
      algorithms,
      total: algorithms.length 
    });
  } catch (error) {
    console.error('Error fetching algorithms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch algorithms' },
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
    const { name, description, category, complexity, price, features, requirements } = body;

    const catalog = new QUBOCatalog();
    const algorithm = await catalog.addAlgorithm({
      name,
      description,
      category: { id: category, name: category, description: '', icon: '', subcategories: [] },
      complexity,
      useCases: [],
      performance: {
        speedup: 1.0,
        accuracy: 0.9,
        scalability: 0.8,
        energyEfficiency: 0.85,
        reliability: 0.9,
        benchmarks: []
      },
      pricing: {
        basePrice: price,
        usagePrice: price * 0.1,
        setupFee: price * 0.2,
        consultingFee: 200,
        enterprisePrice: price * 2,
        overageRate: 1.5,
        minimumCommitment: 1,
        volumeDiscounts: []
      },
      requirements: {
        minQubits: 8,
        maxQubits: 64,
        coherenceTime: 50,
        gateFidelity: 0.95,
        connectivity: 'linear',
        specialHardware: [],
        softwareDependencies: []
      },
      documentation: {
        apiReference: '',
        tutorials: [],
        whitepapers: [],
        caseStudies: [],
        videoGuides: [],
        communityForum: ''
      },
      examples: [],
      status: 'available',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      quantumAdvantage: 0.5,
      classicalEquivalent: 'Classical Algorithm',
      enterpriseFeatures: []
    });

    return NextResponse.json({ 
      success: true, 
      algorithm 
    });
  } catch (error) {
    console.error('Error creating algorithm:', error);
    return NextResponse.json(
      { error: 'Failed to create algorithm' },
      { status: 500 }
    );
  }
}
