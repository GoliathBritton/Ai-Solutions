'use client';

import React, { useState, useEffect } from 'react';
import { flyTokenManager } from '@/lib/crypto/FLYTokenManager';

interface StakingInterfaceProps {
  userAddress: string;
}

interface StakeOption {
  id: number;
  name: string;
  lockPeriod: number;
  multiplier: number;
  apy: number;
}

export const StakingInterface: React.FC<StakingInterfaceProps> = ({ userAddress }) => {
  const [stakeOptions, setStakeOptions] = useState<StakeOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [autoCompound, setAutoCompound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadStakeOptions();
  }, []);

  const loadStakeOptions = async () => {
    try {
      // Mock data - in real implementation, this would come from the contract
      const options: StakeOption[] = [
        {
          id: 0,
          name: 'Flexible',
          lockPeriod: 30,
          multiplier: 100,
          apy: 12
        },
        {
          id: 1,
          name: 'Short Term',
          lockPeriod: 90,
          multiplier: 120,
          apy: 14.4
        },
        {
          id: 2,
          name: 'Medium Term',
          lockPeriod: 180,
          multiplier: 150,
          apy: 18
        },
        {
          id: 3,
          name: 'Long Term',
          lockPeriod: 365,
          multiplier: 200,
          apy: 24
        },
        {
          id: 4,
          name: 'Ultra Long',
          lockPeriod: 730,
          multiplier: 300,
          apy: 36
        }
      ];
      setStakeOptions(options);
    } catch (err) {
      setError('Failed to load stake options');
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await flyTokenManager.stake(stakeAmount, selectedOption, autoCompound);
      
      setSuccess('Successfully staked FLY tokens!');
      setStakeAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stake tokens');
    } finally {
      setLoading(false);
    }
  };

  const selectedStakeOption = stakeOptions[selectedOption];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Stake FLY Tokens</h2>
        
        {/* Stake Options */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose Staking Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stakeOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedOption === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{option.name}</h4>
                    <p className="text-sm text-gray-500">{option.lockPeriod} days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{option.apy}% APY</p>
                    <p className="text-xs text-gray-500">{option.multiplier / 100}x multiplier</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stake Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Stake (FLY)
          </label>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        {/* Auto Compound */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoCompound}
              onChange={(e) => setAutoCompound(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              Enable auto-compounding (reinvest rewards automatically)
            </span>
          </label>
        </div>

        {/* Selected Option Summary */}
        {selectedStakeOption && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Staking Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Period:</span>
                <span className="ml-2 font-medium">{selectedStakeOption.lockPeriod} days</span>
              </div>
              <div>
                <span className="text-gray-500">APY:</span>
                <span className="ml-2 font-medium text-green-600">{selectedStakeOption.apy}%</span>
              </div>
              <div>
                <span className="text-gray-500">Multiplier:</span>
                <span className="ml-2 font-medium">{selectedStakeOption.multiplier / 100}x</span>
              </div>
              <div>
                <span className="text-gray-500">Auto-compound:</span>
                <span className="ml-2 font-medium">{autoCompound ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Stake Button */}
        <button
          onClick={handleStake}
          disabled={loading || !stakeAmount || parseFloat(stakeAmount) <= 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Staking...' : 'Stake FLY Tokens'}
        </button>

        {/* Terms and Conditions */}
        <div className="mt-4 text-xs text-gray-500">
          <p>
            By staking FLY tokens, you agree to lock them for the selected period. 
            Early unstaking is not allowed. Rewards are calculated based on the staking period and multiplier.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StakingInterface;
