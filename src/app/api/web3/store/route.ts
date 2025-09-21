import { NextRequest, NextResponse } from 'next/server';
import { web3Maximization } from '@/lib/web3/Web3Maximization';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, sources, options = {} } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (!sources || !Array.isArray(sources)) {
      return NextResponse.json(
        { error: 'Sources is required and must be an array' },
        { status: 400 }
      );
    }

    // Store knowledge on decentralized storage
    const knowledge = await web3Maximization.storeKnowledge(content, sources, options);

    return NextResponse.json({
      success: true,
      knowledge: {
        id: knowledge.id,
        hash: knowledge.hash,
        storage: knowledge.storage,
        verification: knowledge.verification,
        timestamp: knowledge.timestamp
      }
    });

  } catch (error) {
    console.error('Web3 storage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const knowledgeId = searchParams.get('id');

    if (knowledgeId) {
      // Get specific knowledge
      const knowledge = await web3Maximization.retrieveKnowledge(knowledgeId);
      if (!knowledge) {
        return NextResponse.json(
          { error: 'Knowledge not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        knowledge
      });
    } else {
      // Get Web3 statistics
      const stats = web3Maximization.getWeb3Stats();
      return NextResponse.json({
        success: true,
        stats
      });
    }

  } catch (error) {
    console.error('Web3 storage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
