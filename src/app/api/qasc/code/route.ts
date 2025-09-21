import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { QuantumAgenticSwarmCoding } from '@/lib/qasc/QuantumAgenticSwarmCoding'

// QASC Configuration
const qascConfig = {
  quantumEnabled: true,
  swarmSize: 10,
  collaborationMode: 'hybrid' as const,
  quantumOptimization: true,
  consensusThreshold: 0.8,
  learningRate: 0.1,
  maxIterations: 100
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { task, options = {} } = body

    if (!task) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Task is required' } },
        { status: 400 }
      )
    }

    // Initialize QASC
    const qasc = new QuantumAgenticSwarmCoding(qascConfig)

    // Create coding task
    const codingTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      description: task.description || 'Generate code solution',
      requirements: task.requirements || [],
      priority: task.priority || 'medium',
      complexity: task.complexity || 5,
      estimatedTime: task.estimatedTime || 30,
      assignedAgents: [],
      status: 'pending' as const,
      quantumOptimization: task.quantumOptimization !== false
    }

    // Process coding task through QASC
    const consensus = await qasc.processCodingTask(codingTask)
    
    // Get swarm status
    const swarmStatus = qasc.getSwarmStatus()

    // Log usage for analytics
    console.log(`QASC coding - User: ${user.id}, Task: ${codingTask.id}, Consensus: ${consensus.confidence}`)

    return NextResponse.json({
      success: true,
      data: {
        task: codingTask,
        consensus,
        swarmStatus,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('QASC coding error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'QASC_ERROR', 
          message: 'QASC coding failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    // Initialize QASC
    const qasc = new QuantumAgenticSwarmCoding(qascConfig)

    // Get swarm status
    const swarmStatus = qasc.getSwarmStatus()

    return NextResponse.json({
      success: true,
      data: {
        swarmStatus,
        config: qascConfig,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('QASC status error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'QASC_ERROR', 
          message: 'Failed to get QASC status',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    )
  }
}
