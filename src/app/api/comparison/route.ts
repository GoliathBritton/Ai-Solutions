import { NextRequest, NextResponse } from 'next/server';
import { LLMComparisonEngine } from '../../../lib/comparison/LLMComparisonEngine';

export async function GET(request: NextRequest) {
  try {
    const comparisonEngine = new LLMComparisonEngine();
    
    // Get all models
    const allModels = comparisonEngine.getAllModels();
    
    // Get MetisAI model
    const metisAI = comparisonEngine.getMetisAI();
    
    // Get all comparisons
    const comparisons = comparisonEngine.compareAll();
    
    // Generate comparison report
    const report = comparisonEngine.generateComparisonReport();
    
    // Convert Map to Object for JSON serialization
    const comparisonsObject: Record<string, any> = {};
    comparisons.forEach((value, key) => {
      comparisonsObject[key] = value;
    });
    
    return NextResponse.json({
      success: true,
      data: {
        allModels,
        metisAI,
        comparisons: comparisonsObject,
        report
      }
    });
    
  } catch (error) {
    console.error('Error in comparison API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate comparison data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { llmId } = body;
    
    if (!llmId) {
      return NextResponse.json(
        { success: false, error: 'LLM ID is required' },
        { status: 400 }
      );
    }
    
    const comparisonEngine = new LLMComparisonEngine();
    const detailedComparison = comparisonEngine.getDetailedComparison(llmId);
    
    return NextResponse.json({
      success: true,
      data: detailedComparison
    });
    
  } catch (error) {
    console.error('Error in detailed comparison API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate detailed comparison',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
