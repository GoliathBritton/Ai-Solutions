'use client';

import React, { useState, useEffect } from 'react';
import { flyTokenManager, StakingInfo } from '@/lib/crypto/FLYTokenManager';

interface FLYTokenDashboardProps {
  userAddress: string;
}

export const FLYTokenDashboard: React.FC<FLYTokenDashboardProps> = ({ userAddress }) => {
  const [balance, setBalance] = useState<string>('0');
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [userAddress]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [balanceData, stakingData] = await Promise.all([
        flyTokenManager.getBalance(userAddress),
        flyTokenManager.getStakingInfo(userAddress)
      ]);
      
      setBalance(balanceData);
      setStakingInfo(stakingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">FLY Token Balance</h3>
        <div className="text-3xl font-bold text-blue-600">
          {parseFloat(balance).toLocaleString()} FLY
        </div>
        <p className="text-gray-500 mt-2">Available for staking and transactions</p>
      </div>

      {/* Staking Overview */}
      {stakingInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-medium text-gray-500">Total Staked</h4>
            <p className="text-2xl font-bold text-green-600">
              {parseFloat(stakingInfo.totalStaked).toLocaleString()} FLY
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-medium text-gray-500">Pending Rewards</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {parseFloat(stakingInfo.pendingRewards).toLocaleString()} FLY
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-medium text-gray-500">Total Claimed</h4>
            <p className="text-2xl font-bold text-blue-600">
              {parseFloat(stakingInfo.totalClaimed).toLocaleString()} FLY
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="text-sm font-medium text-gray-500">Active Stakes</h4>
            <p className="text-2xl font-bold text-purple-600">
              {stakingInfo.activeStakes}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {/* Implement stake modal */}}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Stake FLY
          </button>
          <button
            onClick={() => {/* Implement claim rewards */}}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Claim Rewards
          </button>
          <button
            onClick={() => {/* Implement governance */}}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Governance
          </button>
        </div>
      </div>
    </div>
  );
};

export default FLYTokenDashboard;
