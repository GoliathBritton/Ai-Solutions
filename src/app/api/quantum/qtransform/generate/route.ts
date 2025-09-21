import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PythonShell } from 'python-shell'
import path from 'path'

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
    const { prompt, max_length = 100, temperature = 0.8, use_quantum = true } = body

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Prompt is required' } },
        { status: 400 }
      )
    }

    // Prepare Python script execution
    const pythonScript = path.join(process.cwd(), 'src/lib/quantum/qtransform_interface.py')
    const options = {
      mode: 'text' as const,
      pythonPath: 'python',
      pythonOptions: ['-u'],
      scriptPath: path.join(process.cwd(), 'src/lib/quantum/'),
      args: [
        prompt,
        max_length.toString(),
        temperature.toString(),
        use_quantum.toString(),
      ],
    }

    // Execute quantum processing
    const results = await new Promise<string[]>((resolve, reject) => {
      PythonShell.run(pythonScript, options)
        .then(results => {
          resolve(results || [])
        })
        .catch(err => {
          console.error('Python execution error:', err)
          reject(err)
        })
    })

    // Parse result
    const resultData = JSON.parse(results[0])

    // Log usage for analytics
    console.log(`QTransform generation - User: ${user.id}, Method: ${resultData.method}, Time: ${resultData.processingTime}s`)

    return NextResponse.json({
      success: true,
      data: resultData
    })

  } catch (error) {
    console.error('QTransform generation error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'QUANTUM_ERROR', 
          message: 'Quantum processing failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    )
  }
}
