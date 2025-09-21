/**
 * FLY Token Manager
 * Frontend integration for FLY token operations
 * @author MetisAI Team
 */

import { ethers } from 'ethers';
import { FLYTokenABI } from './abis/FLYTokenABI';
import { FLYGovernanceABI } from './abis/FLYGovernanceABI';
import { FLYStakingABI } from './abis/FLYStakingABI';
import { FLYDeFiABI } from './abis/FLYDeFiABI';
import { AIModelNFTABI } from './abis/AIModelNFTABI';
import { DataNFTABI } from './abis/DataNFTABI';
import { FLYBridgeABI } from './abis/FLYBridgeABI';
import { ComplianceEngineABI } from './abis/ComplianceEngineABI';

// Contract addresses (update with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  FLYToken: process.env.NEXT_PUBLIC_FLY_TOKEN_ADDRESS || '0x...',
  FLYGovernance: process.env.NEXT_PUBLIC_FLY_GOVERNANCE_ADDRESS || '0x...',
  FLYStaking: process.env.NEXT_PUBLIC_FLY_STAKING_ADDRESS || '0x...',
  FLYDeFi: process.env.NEXT_PUBLIC_FLY_DEFI_ADDRESS || '0x...',
  AIModelNFT: process.env.NEXT_PUBLIC_AI_MODEL_NFT_ADDRESS || '0x...',
  DataNFT: process.env.NEXT_PUBLIC_DATA_NFT_ADDRESS || '0x...',
  FLYBridge: process.env.NEXT_PUBLIC_FLY_BRIDGE_ADDRESS || '0x...',
  ComplianceEngine: process.env.NEXT_PUBLIC_COMPLIANCE_ENGINE_ADDRESS || '0x...'
};

// Network configuration
const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/...',
    explorer: 'https://etherscan.io'
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com'
  },
  bsc: {
    chainId: 56,
    name: 'BSC',
    rpcUrl: process.env.NEXT_PUBLIC_BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com'
  }
};

export class FLYTokenManager {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: any = {};

  constructor() {
    this.initializeProvider();
  }

  /**
   * Initialize Web3 provider
   */
  private async initializeProvider() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.signer = this.provider.getSigner();
      this.initializeContracts();
    }
  }

  /**
   * Initialize contract instances
   */
  private initializeContracts() {
    if (!this.signer) return;

    this.contracts = {
      FLYToken: new ethers.Contract(CONTRACT_ADDRESSES.FLYToken, FLYTokenABI, this.signer),
      FLYGovernance: new ethers.Contract(CONTRACT_ADDRESSES.FLYGovernance, FLYGovernanceABI, this.signer),
      FLYStaking: new ethers.Contract(CONTRACT_ADDRESSES.FLYStaking, FLYStakingABI, this.signer),
      FLYDeFi: new ethers.Contract(CONTRACT_ADDRESSES.FLYDeFi, FLYDeFiABI, this.signer),
      AIModelNFT: new ethers.Contract(CONTRACT_ADDRESSES.AIModelNFT, AIModelNFTABI, this.signer),
      DataNFT: new ethers.Contract(CONTRACT_ADDRESSES.DataNFT, DataNFTABI, this.signer),
      FLYBridge: new ethers.Contract(CONTRACT_ADDRESSES.FLYBridge, FLYBridgeABI, this.signer),
      ComplianceEngine: new ethers.Contract(CONTRACT_ADDRESSES.ComplianceEngine, ComplianceEngineABI, this.signer)
    };
  }

  /**
   * Connect wallet
   */
  async connectWallet(): Promise<string> {
    if (!(window as any).ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      await this.initializeProvider();
      return accounts[0];
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
  }

  /**
   * Get user's FLY token balance
   */
  async getBalance(address: string): Promise<string> {
    if (!this.contracts.FLYToken) throw new Error('Contract not initialized');
    
    const balance = await this.contracts.FLYToken.balanceOf(address);
    return ethers.formatEther(balance);
  }

  /**
   * Get user's staking information
   */
  async getStakingInfo(address: string) {
    if (!this.contracts.FLYStaking) throw new Error('Contract not initialized');
    
    const userInfo = await this.contracts.FLYStaking.getUserStakeInfo(address);
    const totalRewards = await this.contracts.FLYStaking.calculateTotalRewards(address);
    const activeStakes = await this.contracts.FLYStaking.getUserActiveStakes(address);
    
    return {
      totalStaked: ethers.formatEther(userInfo.totalStaked),
      totalRewards: ethers.formatEther(userInfo.totalRewards),
      totalClaimed: ethers.formatEther(userInfo.totalClaimed),
      activeStakes: activeStakes.length,
      pendingRewards: ethers.formatEther(totalRewards)
    };
  }

  /**
   * Stake FLY tokens
   */
  async stake(amount: string, optionIndex: number, autoCompound: boolean = false) {
    if (!this.contracts.FLYStaking) throw new Error('Contract not initialized');
    
    const amountWei = ethers.parseEther(amount);
    const tx = await this.contracts.FLYStaking.stake(amountWei, optionIndex, autoCompound);
    return await tx.wait();
  }

  /**
   * Unstake FLY tokens
   */
  async unstake(stakeId: number) {
    if (!this.contracts.FLYStaking) throw new Error('Contract not initialized');
    
    const tx = await this.contracts.FLYStaking.unstake(stakeId);
    return await tx.wait();
  }

  /**
   * Claim staking rewards
   */
  async claimRewards(stakeId: number) {
    if (!this.contracts.FLYStaking) throw new Error('Contract not initialized');
    
    const tx = await this.contracts.FLYStaking.claimRewards(stakeId);
    return await tx.wait();
  }

  /**
   * Get governance proposals
   */
  async getProposals() {
    if (!this.contracts.FLYGovernance) throw new Error('Contract not initialized');
    
    const proposalCount = await this.contracts.FLYGovernance.getProposalCount();
    const proposals = [];
    
    for (let i = 0; i < proposalCount; i++) {
      const proposal = await this.contracts.FLYGovernance.getProposal(i);
      proposals.push(proposal);
    }
    
    return proposals;
  }

  /**
   * Create governance proposal
   */
  async createProposal(title: string, description: string, ipfsHash: string) {
    if (!this.contracts.FLYGovernance) throw new Error('Contract not initialized');
    
    const tx = await this.contracts.FLYGovernance.propose(title, description, ipfsHash);
    return await tx.wait();
  }

  /**
   * Vote on proposal
   */
  async vote(proposalId: number, support: number, reason: string) {
    if (!this.contracts.FLYGovernance) throw new Error('Contract not initialized');
    
    const tx = await this.contracts.FLYGovernance.castVote(proposalId, support, reason);
    return await tx.wait();
  }

  /**
   * Get DeFi pools
   */
  async getPools() {
    if (!this.contracts.FLYDeFi) throw new Error('Contract not initialized');
    
    // Implementation depends on specific pool structure
    // This is a placeholder for the actual implementation
    return [];
  }

  /**
   * Add liquidity to pool
   */
  async addLiquidity(poolId: number, amount: string) {
    if (!this.contracts.FLYDeFi) throw new Error('Contract not initialized');
    
    const amountWei = ethers.parseEther(amount);
    const tx = await this.contracts.FLYDeFi.addLiquidity(poolId, amountWei);
    return await tx.wait();
  }

  /**
   * Mint AI model NFT
   */
  async mintAIModel(
    name: string,
    description: string,
    ipfsHash: string,
    trainingCost: string,
    accuracy: number,
    royaltyPercentage: number,
    tags: string[]
  ) {
    if (!this.contracts.AIModelNFT) throw new Error('Contract not initialized');
    
    const trainingCostWei = ethers.parseEther(trainingCost);
    const tx = await this.contracts.AIModelNFT.mintModel(
      name,
      description,
      ipfsHash,
      trainingCostWei,
      accuracy,
      royaltyPercentage,
      tags
    );
    return await tx.wait();
  }

  /**
   * Use AI model
   */
  async useAIModel(tokenId: number, purpose: string, value: string) {
    if (!this.contracts.AIModelNFT) throw new Error('Contract not initialized');
    
    const tx = await this.contracts.AIModelNFT.useModel(tokenId, purpose, { value });
    return await tx.wait();
  }

  /**
   * Mint data NFT
   */
  async mintDataNFT(
    name: string,
    description: string,
    ipfsHash: string,
    size: number,
    price: string,
    tags: string[],
    dataType: string
  ) {
    if (!this.contracts.DataNFT) throw new Error('Contract not initialized');
    
    const priceWei = ethers.parseEther(price);
    const tx = await this.contracts.DataNFT.mintDataset(
      name,
      description,
      ipfsHash,
      size,
      priceWei,
      tags,
      dataType
    );
    return await tx.wait();
  }

  /**
   * Use data NFT
   */
  async useDataNFT(tokenId: number, purpose: string, value: string) {
    if (!this.contracts.DataNFT) throw new Error('Contract not initialized');
    
    const tx = await this.contracts.DataNFT.useDataset(tokenId, purpose, { value });
    return await tx.wait();
  }

  /**
   * Bridge tokens to another chain
   */
  async bridgeTokens(amount: string, targetChainId: number, targetAddress: string) {
    if (!this.contracts.FLYBridge) throw new Error('Contract not initialized');
    
    const amountWei = ethers.parseEther(amount);
    const targetAddressBytes32 = ethers.encodeBytes32String(targetAddress);
    const tx = await this.contracts.FLYBridge.lockTokens(amountWei, targetChainId, targetAddressBytes32);
    return await tx.wait();
  }

  /**
   * Check compliance status
   */
  async checkCompliance(from: string, to: string, amount: string, purpose: string) {
    if (!this.contracts.ComplianceEngine) throw new Error('Contract not initialized');
    
    const amountWei = ethers.parseEther(amount);
    const result = await this.contracts.ComplianceEngine.checkCompliance(from, to, amountWei, purpose);
    return result;
  }

  /**
   * Get KYC information
   */
  async getKYCInfo(address: string) {
    if (!this.contracts.ComplianceEngine) throw new Error('Contract not initialized');
    
    const kycInfo = await this.contracts.ComplianceEngine.getKYCInfo(address);
    return kycInfo;
  }

  /**
   * Get AML record
   */
  async getAMLRecord(address: string) {
    if (!this.contracts.ComplianceEngine) throw new Error('Contract not initialized');
    
    const amlRecord = await this.contracts.ComplianceEngine.getAMLRecord(address);
    return amlRecord;
  }

  /**
   * Get network information
   */
  getNetworkInfo(chainId: number) {
    const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
    return network || null;
  }

  /**
   * Switch network
   */
  async switchNetwork(chainId: number) {
    if (!(window as any).ethereum) throw new Error('MetaMask not installed');
    
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      // If network doesn't exist, add it
      const network = this.getNetworkInfo(chainId);
      if (network) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: network.name,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.explorer]
          }]
        });
      }
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(address: string, limit: number = 10) {
    // Implementation would depend on the specific blockchain explorer API
    // This is a placeholder for the actual implementation
    return [];
  }

  /**
   * Get token price
   */
  async getTokenPrice(): Promise<number> {
    // Implementation would depend on the specific price oracle
    // This is a placeholder for the actual implementation
    return 0;
  }

  /**
   * Get total value locked (TVL)
   */
  async getTVL(): Promise<string> {
    if (!this.contracts.FLYStaking) throw new Error('Contract not initialized');
    
    const totalStaked = await this.contracts.FLYStaking.totalStaked();
    return ethers.formatEther(totalStaked);
  }

  /**
   * Get staking APY
   */
  async getStakingAPY(): Promise<number> {
    if (!this.contracts.FLYStaking) throw new Error('Contract not initialized');
    
    const baseAPY = await this.contracts.FLYStaking.BASE_APY();
    return baseAPY.toNumber() / 100; // Convert to percentage
  }
}

// Export singleton instance
export const flyTokenManager = new FLYTokenManager();

// Export types
export interface StakingInfo {
  totalStaked: string;
  totalRewards: string;
  totalClaimed: string;
  activeStakes: number;
  pendingRewards: string;
}

export interface Proposal {
  id: number;
  proposer: string;
  title: string;
  description: string;
  voteStart: number;
  voteEnd: number;
  executionTime: number;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  executed: boolean;
  canceled: boolean;
  ipfsHash: string;
}

export interface PoolInfo {
  id: number;
  tokenA: string;
  tokenB: string;
  name: string;
  totalLiquidity: string;
  rewardRate: number;
  totalRewards: string;
  distributedRewards: string;
  active: boolean;
  startTime: number;
  endTime: number;
}

export interface KYCInfo {
  user: string;
  verified: boolean;
  level: number;
  expiry: number;
  country: string;
  documentHash: string;
  timestamp: number;
}

export interface AMLRecord {
  user: string;
  riskScore: number;
  highRisk: boolean;
  lastUpdate: number;
  flags: string[];
}
