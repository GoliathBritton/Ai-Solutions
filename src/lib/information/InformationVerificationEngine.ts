/**
 * Information Verification Engine
 * Multi-source cross-validation with bias detection and truth consensus
 * @author MetisAI Team
 */

import { multiSearchEngine, SearchResult } from './MultiSearchEngine';
import { torIntegrationService, TorSearchResult } from './TorIntegration';
import { web3Maximization, Web3Knowledge } from '../web3/Web3Maximization';
import { flyTokenManager } from '../crypto/FLYTokenManager';

export interface VerificationTask {
  id: string;
  query: string;
  timestamp: number;
  difficulty: number;
  validators: string[];
  results: VerificationResult[];
  consensus: ConsensusResult;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface VerificationResult {
  source: string;
  result: SearchResult | TorSearchResult;
  credibility: number;
  biasScore: number;
  accuracy: number;
  timestamp: number;
  validator?: string;
}

export interface ConsensusResult {
  consensus: boolean;
  confidence: number;
  sources: number;
  agreement: number;
  biasLevel: 'low' | 'medium' | 'high';
  blockchainProof?: string;
}

export interface VerificationMetrics {
  totalVerifications: number;
  successfulVerifications: number;
  averageAccuracy: number;
  averageBiasScore: number;
  sourceDiversity: number;
  consensusRate: number;
}

export class InformationVerificationEngine {
  private verificationTasks: Map<string, VerificationTask> = new Map();
  private metrics: VerificationMetrics = {
    totalVerifications: 0,
    successfulVerifications: 0,
    averageAccuracy: 0,
    averageBiasScore: 0,
    sourceDiversity: 0,
    consensusRate: 0
  };

  /**
   * Verify information across multiple sources
   */
  async verifyInformation(
    query: string, 
    options: VerificationOptions = {}
  ): Promise<VerificationTask> {
    const taskId = this.generateTaskId(query);
    const task: VerificationTask = {
      id: taskId,
      query,
      timestamp: Date.now(),
      difficulty: this.calculateDifficulty(query),
      validators: [],
      results: [],
      consensus: {
        consensus: false,
        confidence: 0,
        sources: 0,
        agreement: 0,
        biasLevel: 'low'
      },
      status: 'pending'
    };

    this.verificationTasks.set(taskId, task);
    await this.executeVerification(task, options);
    
    return task;
  }

  /**
   * Execute verification process
   */
  private async executeVerification(
    task: VerificationTask, 
    options: VerificationOptions
  ): Promise<void> {
    try {
      task.status = 'in_progress';

      // Parallel verification across all sources
      const verificationPromises = [
        this.verifyWithSearchEngines(task.query, options),
        this.verifyWithTor(task.query, options),
        this.verifyWithWeb3(task.query, options),
        this.verifyWithValidators(task, options)
      ];

      const results = await Promise.allSettled(verificationPromises);
      
      // Process results
      const allResults: VerificationResult[] = [];
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value);
        }
      });

      task.results = allResults;
      task.consensus = this.calculateConsensus(allResults);
      task.status = 'completed';

      // Update metrics
      this.updateMetrics(task);

      // Store verified knowledge in Web3
      if (task.consensus.consensus) {
        await this.storeVerifiedKnowledge(task);
      }

      // Distribute rewards to validators
      if (task.validators.length > 0) {
        await this.distributeValidatorRewards(task);
      }

    } catch (error) {
      console.error('Verification failed:', error);
      task.status = 'failed';
    }
  }

  /**
   * Verify with search engines
   */
  private async verifyWithSearchEngines(
    query: string, 
    options: VerificationOptions
  ): Promise<VerificationResult[]> {
    const searchResults = await multiSearchEngine.search(query, {
      maxResults: options.maxResults || 10,
      language: options.language,
      region: options.region,
      timeRange: options.timeRange,
      safeSearch: options.safeSearch
    });

    return searchResults.map(result => ({
      source: 'search_engines',
      result: result as SearchResult,
      credibility: result.credibility,
      biasScore: result.biasScore,
      accuracy: this.calculateAccuracy(result),
      timestamp: Date.now()
    }));
  }

  /**
   * Verify with TOR network
   */
  private async verifyWithTor(
    query: string, 
    options: VerificationOptions
  ): Promise<VerificationResult[]> {
    const torResults = await torIntegrationService.queryThroughTor(query, {
      maxResults: options.maxResults || 5,
      category: options.category,
      safetyLevel: options.safetyLevel || 'medium',
      includeUnverified: options.includeUnverified || false
    });

    return torResults.map(result => ({
      source: 'tor_network',
      result: result as TorSearchResult,
      credibility: result.credibility,
      biasScore: 1 - result.safetyScore, // Convert safety score to bias score
      accuracy: this.calculateAccuracy(result),
      timestamp: Date.now()
    }));
  }

  /**
   * Verify with Web3 knowledge base
   */
  private async verifyWithWeb3(
    query: string, 
    options: VerificationOptions
  ): Promise<VerificationResult[]> {
    // Search existing Web3 knowledge
    const existingKnowledge = await this.searchWeb3Knowledge(query);
    
    return existingKnowledge.map(knowledge => ({
      source: 'web3_knowledge',
      result: {
        title: knowledge.id,
        description: knowledge.content,
        url: `web3://${knowledge.hash}`,
        source: 'web3',
        timestamp: knowledge.timestamp,
        credibility: knowledge.verification.confidence,
        biasScore: 0.1 // Web3 knowledge has low bias
      } as SearchResult,
      credibility: knowledge.verification.confidence,
      biasScore: 0.1,
      accuracy: knowledge.verification.consensus,
      timestamp: Date.now()
    }));
  }

  /**
   * Verify with human validators
   */
  private async verifyWithValidators(
    task: VerificationTask, 
    options: VerificationOptions
  ): Promise<VerificationResult[]> {
    // Get available validators
    const validators = await this.getAvailableValidators();
    task.validators = validators;

    // Create validation tasks for validators
    const validationPromises = validators.map(validator => 
      this.createValidationTask(validator, task)
    );

    const results = await Promise.allSettled(validationPromises);
    const validResults = results
      .filter((result): result is PromiseFulfilledResult<VerificationResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    return validResults;
  }

  /**
   * Search Web3 knowledge base
   */
  private async searchWeb3Knowledge(query: string): Promise<Web3Knowledge[]> {
    // In a real implementation, this would search the Web3 knowledge base
    // For now, we'll return empty array
    return [];
  }

  /**
   * Get available validators
   */
  private async getAvailableValidators(): Promise<string[]> {
    // In a real implementation, this would query the validator registry
    // For now, we'll return mock validators
    return ['validator1', 'validator2', 'validator3'];
  }

  /**
   * Create validation task for a validator
   */
  private async createValidationTask(
    validator: string, 
    task: VerificationTask
  ): Promise<VerificationResult> {
    // In a real implementation, this would create actual validation tasks
    // For now, we'll simulate validation
    return {
      source: 'human_validator',
      result: {
        title: `Validation for: ${task.query}`,
        description: `Human validation result from ${validator}`,
        url: `validator://${validator}/${task.id}`,
        source: 'validator',
        timestamp: Date.now(),
        credibility: 0.8,
        biasScore: 0.2
      } as SearchResult,
      credibility: 0.8,
      biasScore: 0.2,
      accuracy: 0.85,
      timestamp: Date.now(),
      validator
    };
  }

  /**
   * Calculate consensus from verification results
   */
  private calculateConsensus(results: VerificationResult[]): ConsensusResult {
    if (results.length === 0) {
      return {
        consensus: false,
        confidence: 0,
        sources: 0,
        agreement: 0,
        biasLevel: 'high'
      };
    }

    // Calculate average metrics
    const avgCredibility = results.reduce((sum, r) => sum + r.credibility, 0) / results.length;
    const avgBiasScore = results.reduce((sum, r) => sum + r.biasScore, 0) / results.length;
    const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;

    // Calculate agreement (how many results agree)
    const agreement = this.calculateAgreement(results);

    // Determine consensus
    const consensus = avgCredibility > 0.7 && avgBiasScore < 0.3 && agreement > 0.6;

    // Determine bias level
    let biasLevel: 'low' | 'medium' | 'high' = 'low';
    if (avgBiasScore > 0.6) biasLevel = 'high';
    else if (avgBiasScore > 0.3) biasLevel = 'medium';

    return {
      consensus,
      confidence: avgCredibility,
      sources: results.length,
      agreement,
      biasLevel,
      blockchainProof: consensus ? this.generateBlockchainProof(results) : undefined
    };
  }

  /**
   * Calculate agreement between results
   */
  private calculateAgreement(results: VerificationResult[]): number {
    if (results.length < 2) return 1.0;

    let agreements = 0;
    let totalComparisons = 0;

    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        const similarity = this.calculateResultSimilarity(results[i], results[j]);
        if (similarity > 0.8) agreements++;
        totalComparisons++;
      }
    }

    return totalComparisons > 0 ? agreements / totalComparisons : 0;
  }

  /**
   * Calculate similarity between two results
   */
  private calculateResultSimilarity(result1: VerificationResult, result2: VerificationResult): number {
    const title1 = (result1.result as SearchResult).title || '';
    const title2 = (result2.result as SearchResult).title || '';
    const desc1 = (result1.result as SearchResult).description || '';
    const desc2 = (result2.result as SearchResult).description || '';

    const titleSimilarity = this.calculateTextSimilarity(title1, title2);
    const descSimilarity = this.calculateTextSimilarity(desc1, desc2);

    return (titleSimilarity + descSimilarity) / 2;
  }

  /**
   * Calculate text similarity
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  /**
   * Calculate accuracy of a result
   */
  private calculateAccuracy(result: SearchResult | TorSearchResult): number {
    // In a real implementation, this would use more sophisticated accuracy calculation
    return result.credibility * (1 - ((result.result as any).biasScore || 0));
  }

  /**
   * Calculate task difficulty
   */
  private calculateDifficulty(query: string): number {
    // Simple difficulty calculation based on query length and complexity
    const length = query.length;
    const wordCount = query.split(/\s+/).length;
    const complexity = query.match(/[?!@#$%^&*()_+=\[\]{}|;':",./<>?]/g)?.length || 0;
    
    return Math.min((length * 0.1) + (wordCount * 0.2) + (complexity * 0.3), 10);
  }

  /**
   * Generate blockchain proof
   */
  private generateBlockchainProof(results: VerificationResult[]): string {
    const proofData = {
      results: results.length,
      timestamp: Date.now(),
      consensus: true
    };
    
    return `0x${Buffer.from(JSON.stringify(proofData)).toString('hex')}`;
  }

  /**
   * Generate task ID
   */
  private generateTaskId(query: string): string {
    const hash = Buffer.from(query).toString('hex').substr(0, 16);
    return `verification_${hash}_${Date.now()}`;
  }

  /**
   * Store verified knowledge in Web3
   */
  private async storeVerifiedKnowledge(task: VerificationTask): Promise<void> {
    if (!task.consensus.consensus) return;

    const content = this.generateKnowledgeContent(task);
    const sources = task.results.map(r => r.source);

    await web3Maximization.storeKnowledge(content, sources);
  }

  /**
   * Generate knowledge content from verification task
   */
  private generateKnowledgeContent(task: VerificationTask): string {
    const results = task.results.map(r => ({
      source: r.source,
      title: (r.result as SearchResult).title,
      description: (r.result as SearchResult).description,
      credibility: r.credibility,
      accuracy: r.accuracy
    }));

    return JSON.stringify({
      query: task.query,
      consensus: task.consensus,
      results,
      timestamp: task.timestamp
    });
  }

  /**
   * Distribute rewards to validators
   */
  private async distributeValidatorRewards(task: VerificationTask): Promise<void> {
    if (task.validators.length === 0) return;

    const totalReward = task.difficulty * 10; // FLY tokens
    const individualReward = totalReward / task.validators.length;

    for (const validator of task.validators) {
      try {
        // await flyTokenManager.mintRewards(validator, individualReward, 'Verification reward');
      } catch (error) {
        console.error(`Failed to reward validator ${validator}:`, error);
      }
    }
  }

  /**
   * Update verification metrics
   */
  private updateMetrics(task: VerificationTask): void {
    this.metrics.totalVerifications++;
    
    if (task.consensus.consensus) {
      this.metrics.successfulVerifications++;
    }

    // Update averages
    const totalTasks = this.verificationTasks.size;
    this.metrics.averageAccuracy = this.calculateAverageAccuracy();
    this.metrics.averageBiasScore = this.calculateAverageBiasScore();
    this.metrics.sourceDiversity = this.calculateSourceDiversity();
    this.metrics.consensusRate = this.metrics.successfulVerifications / this.metrics.totalVerifications;
  }

  /**
   * Calculate average accuracy
   */
  private calculateAverageAccuracy(): number {
    const allResults = Array.from(this.verificationTasks.values())
      .flatMap(task => task.results);
    
    if (allResults.length === 0) return 0;
    
    return allResults.reduce((sum, result) => sum + result.accuracy, 0) / allResults.length;
  }

  /**
   * Calculate average bias score
   */
  private calculateAverageBiasScore(): number {
    const allResults = Array.from(this.verificationTasks.values())
      .flatMap(task => task.results);
    
    if (allResults.length === 0) return 0;
    
    return allResults.reduce((sum, result) => sum + result.biasScore, 0) / allResults.length;
  }

  /**
   * Calculate source diversity
   */
  private calculateSourceDiversity(): number {
    const allSources = Array.from(this.verificationTasks.values())
      .flatMap(task => task.results)
      .map(result => result.source);
    
    const uniqueSources = new Set(allSources);
    return uniqueSources.size;
  }

  /**
   * Get verification metrics
   */
  getMetrics(): VerificationMetrics {
    return { ...this.metrics };
  }

  /**
   * Get verification task
   */
  getTask(taskId: string): VerificationTask | undefined {
    return this.verificationTasks.get(taskId);
  }

  /**
   * Get all verification tasks
   */
  getAllTasks(): VerificationTask[] {
    return Array.from(this.verificationTasks.values());
  }
}

export interface VerificationOptions {
  maxResults?: number;
  language?: string;
  region?: string;
  timeRange?: 'day' | 'week' | 'month' | 'year';
  safeSearch?: boolean;
  category?: string;
  safetyLevel?: 'low' | 'medium' | 'high';
  includeUnverified?: boolean;
}

export const informationVerificationEngine = new InformationVerificationEngine();
