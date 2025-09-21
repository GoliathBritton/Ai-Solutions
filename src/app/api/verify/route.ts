import { NextRequest, NextResponse } from 'next/server';
import { informationVerificationEngine } from '@/lib/information/InformationVerificationEngine';

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

    // Verify information across multiple sources
    const verificationTask = await informationVerificationEngine.verifyInformation(query, options);

    return NextResponse.json({
      success: true,
      taskId: verificationTask.id,
      status: verificationTask.status,
      consensus: verificationTask.consensus,
      results: verificationTask.results,
      timestamp: verificationTask.timestamp
    });

  } catch (error) {
    console.error('Verification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (taskId) {
      // Get specific verification task
      const task = informationVerificationEngine.getTask(taskId);
      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        task
      });
    } else {
      // Get all verification tasks
      const tasks = informationVerificationEngine.getAllTasks();
      return NextResponse.json({
        success: true,
        tasks
      });
    }

  } catch (error) {
    console.error('Verification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
