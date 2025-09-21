'use client';

import React, { useState, useEffect } from 'react';
import { flyTokenManager, Proposal } from '@/lib/crypto/FLYTokenManager';

interface GovernanceInterfaceProps {
  userAddress: string;
}

export const GovernanceInterface: React.FC<GovernanceInterfaceProps> = ({ userAddress }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    ipfsHash: ''
  });

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setLoading(true);
      const proposalsData = await flyTokenManager.getProposals();
      setProposals(proposalsData);
    } catch (err) {
      setError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async () => {
    if (!newProposal.title || !newProposal.description) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await flyTokenManager.createProposal(
        newProposal.title,
        newProposal.description,
        newProposal.ipfsHash
      );
      
      setShowCreateModal(false);
      setNewProposal({ title: '', description: '', ipfsHash: '' });
      await loadProposals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: number, support: number) => {
    try {
      setLoading(true);
      await flyTokenManager.vote(proposalId, support, 'Voting on proposal');
      await loadProposals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  const getProposalStatus = (proposal: Proposal) => {
    const now = Math.floor(Date.now() / 1000);
    
    if (proposal.canceled) return 'Canceled';
    if (proposal.executed) return 'Executed';
    if (now < proposal.voteStart) return 'Pending';
    if (now < proposal.voteEnd) return 'Active';
    if (now < proposal.executionTime) return 'Succeeded';
    return 'Expired';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Succeeded': return 'text-blue-600 bg-blue-100';
      case 'Executed': return 'text-purple-600 bg-purple-100';
      case 'Canceled': return 'text-red-600 bg-red-100';
      case 'Expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const canVote = (proposal: Proposal) => {
    const now = Math.floor(Date.now() / 1000);
    return now >= proposal.voteStart && now <= proposal.voteEnd && !proposal.canceled && !proposal.executed;
  };

  if (loading && proposals.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Governance</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Proposal
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const status = getProposalStatus(proposal);
          const canVoteNow = canVote(proposal);
          
          return (
            <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{proposal.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">For Votes</p>
                  <p className="text-lg font-semibold text-green-600">
                    {parseFloat(proposal.forVotes).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Against Votes</p>
                  <p className="text-lg font-semibold text-red-600">
                    {parseFloat(proposal.againstVotes).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Abstain Votes</p>
                  <p className="text-lg font-semibold text-gray-600">
                    {parseFloat(proposal.abstainVotes).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                <p>Voting Period: {new Date(proposal.voteStart * 1000).toLocaleDateString()} - {new Date(proposal.voteEnd * 1000).toLocaleDateString()}</p>
                <p>Proposer: {proposal.proposer}</p>
              </div>
              
              {canVoteNow && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVote(proposal.id, 1)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Vote For
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, 0)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Vote Against
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, 2)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Abstain
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Proposal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter proposal title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Enter detailed proposal description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IPFS Hash (Optional)
                  </label>
                  <input
                    type="text"
                    value={newProposal.ipfsHash}
                    onChange={(e) => setNewProposal({ ...newProposal, ipfsHash: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter IPFS hash for additional details"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProposal}
                  disabled={loading || !newProposal.title || !newProposal.description}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Proposal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernanceInterface;
