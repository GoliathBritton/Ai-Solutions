import { NextRequest, NextResponse } from 'next/server';
import { multiSearchEngine } from '@/lib/information/MultiSearchEngine';

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

    // Search across multiple providers
    const results = await multiSearchEngine.search(query, options);

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Multi-search API error:', error);
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
    const language = searchParams.get('language');
    const region = searchParams.get('region');
    const timeRange = searchParams.get('timeRange') as 'day' | 'week' | 'month' | 'year' | undefined;
    const safeSearch = searchParams.get('safeSearch') === 'true';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const options = {
      maxResults: maxResults ? parseInt(maxResults) : undefined,
      language: language || undefined,
      region: region || undefined,
      timeRange,
      safeSearch
    };

    // Search across multiple providers
    const results = await multiSearchEngine.search(query, options);

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Multi-search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
