import { NextRequest, NextResponse } from 'next/server';
import { torIntegrationService } from '@/lib/information/TorIntegration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, options = {} } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Query through TOR network
    const results = await torIntegrationService.queryThroughTor(query, options);

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('TOR search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = searchParams.get('maxResults');
    const category = searchParams.get('category');
    const safetyLevel = searchParams.get('safetyLevel') as 'low' | 'medium' | 'high' | undefined;
    const includeUnverified = searchParams.get('includeUnverified') === 'true';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const options = {
      maxResults: maxResults ? parseInt(maxResults) : undefined,
      category: category || undefined,
      safetyLevel,
      includeUnverified
    };

    // Query through TOR network
    const results = await torIntegrationService.queryThroughTor(query, options);

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('TOR search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
