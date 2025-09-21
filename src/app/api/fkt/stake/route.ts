import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { FLYFOXKnowledgeToken } from '@/lib/token/FLYFOXKnowledgeToken'

// FKT Configuration
const fktConfig = {
  tokenAddress: process.env.FKT_TOKEN_ADDRESS || '0x1234567890123456789012345678901234567890',
  stakingContract: process.env.FKT_STAKING_CONTRACT || '0x1234567890123456789012345678901234567890',
  governanceContract: process.env.FKT_GOVERNANCE_CONTRACT || '0x1234567890123456789012345678901234567890',
  rewardPool: process.env.FKT_REWARD_POOL || '0x1234567890123456789012345678901234567890',
  minStake: '100',
  rewardRate: 0.1,
  inflationRate: 0.05,
  burnRate: 0.02,
  maxSupply: '100000000',
  initialSupply: '10000000'
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
    const { amount, duration, userAddress } = body

    if (!amount || !duration || !userAddress) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Amount, duration, and userAddress are required' } },
        { status: 400 }
      )
    }

    // Initialize FKT
    const fkt = new FLYFOXKnowledgeToken(fktConfig)

    // Stake tokens
    const stakingInfo = await fkt.stakeTokens(amount, duration, userAddress)

    // Log usage for analytics
    console.log(`FKT staking - User: ${user.id}, Amount: ${amount}, Duration: ${duration}`)

    return NextResponse.json({
      success: true,
      data: {
        stakingInfo,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('FKT staking error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FKT_ERROR', 
          message: 'FKT staking failed',
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')

    if (!userAddress) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'userAddress is required' } },
        { status: 400 }
      )
    }

    // Initialize FKT
    const fkt = new FLYFOXKnowledgeToken(fktConfig)

    // Get user's staking positions
    const stakingPositions = await fkt.getUserStakingPositions(userAddress)

    return NextResponse.json({
      success: true,
      data: {
        stakingPositions,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('FKT staking positions error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FKT_ERROR', 
          message: 'Failed to get staking positions',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    )
  }
}
