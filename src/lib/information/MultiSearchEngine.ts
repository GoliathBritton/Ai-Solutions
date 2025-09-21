/**
 * Multi-Search Engine Integration
 * Integrates alternative search engines for unbiased information gathering
 * @author MetisAI Team
 */

export interface SearchResult {
  title: string;
  description: string;
  url: string;
  source: string;
  timestamp: number;
  credibility: number;
  biasScore: number;
}

export interface SearchProvider {
  name: string;
  api: string;
  features: string[];
  weight: number;
  enabled: boolean;
}

export class MultiSearchEngine {
  private providers: SearchProvider[] = [
    {
      name: "DuckDuckGo",
      api: "DuckDuckGo API",
      features: ["Privacy-focused", "No user tracking", "Instant answers"],
      weight: 0.25,
      enabled: true
    },
    {
      name: "Brave Search",
      api: "Brave Search API",
      features: ["Independent index", "Privacy-preserving", "Web3 integration"],
      weight: 0.25,
      enabled: true
    },
    {
      name: "Startpage",
      api: "Startpage Google Proxy",
      features: ["Google results without tracking", "Privacy protection"],
      weight: 0.20,
      enabled: true
    },
    {
      name: "Searx",
      api: "Self-hosted Searx instance",
      features: ["Meta-search aggregator", "Open source", "Customizable"],
      weight: 0.15,
      enabled: true
    },
    {
      name: "Yacy",
      api: "P2P Search API",
      features: ["Decentralized search", "No central control", "Community-powered"],
      weight: 0.15,
      enabled: true
    }
  ];

  private biasDetection = new BiasDetectionEngine();
  private credibilityScoring = new CredibilityScoringEngine();

  /**
   * Search across multiple providers and aggregate results
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const enabledProviders = this.providers.filter(p => p.enabled);
    const searchPromises = enabledProviders.map(provider => 
      this.searchProvider(provider, query, options)
    );

    try {
      const results = await Promise.allSettled(searchPromises);
      const validResults = results
        .filter((result): result is PromiseFulfilledResult<SearchResult[]> => 
          result.status === 'fulfilled'
        )
        .map(result => result.value)
        .flat();

      return this.aggregateResults(validResults, query);
    } catch (error) {
      console.error('Multi-search error:', error);
      return [];
    }
  }

  /**
   * Search using a specific provider
   */
  private async searchProvider(
    provider: SearchProvider, 
    query: string, 
    options: SearchOptions
  ): Promise<SearchResult[]> {
    switch (provider.name) {
      case 'DuckDuckGo':
        return this.searchDuckDuckGo(query, options);
      case 'Brave Search':
        return this.searchBrave(query, options);
      case 'Startpage':
        return this.searchStartpage(query, options);
      case 'Searx':
        return this.searchSearx(query, options);
      case 'Yacy':
        return this.searchYacy(query, options);
      default:
        return [];
    }
  }

  /**
   * DuckDuckGo search implementation
   */
  private async searchDuckDuckGo(query: string, options: SearchOptions): Promise<SearchResult[]> {
    try {
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
      const data = await response.json();
      
      return data.Results?.map((result: any) => ({
        title: result.Text,
        description: result.Text,
        url: result.FirstURL,
        source: 'DuckDuckGo',
        timestamp: Date.now(),
        credibility: this.credibilityScoring.score(result.FirstURL),
        biasScore: this.biasDetection.analyze(result.Text)
      })) || [];
    } catch (error) {
      console.error('DuckDuckGo search error:', error);
      return [];
    }
  }

  /**
   * Brave Search implementation
   */
  private async searchBrave(query: string, options: SearchOptions): Promise<SearchResult[]> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_BRAVE_API_KEY;
      if (!apiKey) throw new Error('Brave API key not configured');

      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'X-Subscription-Token': apiKey
        }
      });
      const data = await response.json();
      
      return data.web?.results?.map((result: any) => ({
        title: result.title,
        description: result.description,
        url: result.url,
        source: 'Brave Search',
        timestamp: Date.now(),
        credibility: this.credibilityScoring.score(result.url),
        biasScore: this.biasDetection.analyze(result.description)
      })) || [];
    } catch (error) {
      console.error('Brave search error:', error);
      return [];
    }
  }

  /**
   * Startpage search implementation
   */
  private async searchStartpage(query: string, options: SearchOptions): Promise<SearchResult[]> {
    try {
      // Startpage doesn't have a public API, so we'll use a proxy approach
      const response = await fetch(`/api/search/startpage?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      return data.results?.map((result: any) => ({
        title: result.title,
        description: result.description,
        url: result.url,
        source: 'Startpage',
        timestamp: Date.now(),
        credibility: this.credibilityScoring.score(result.url),
        biasScore: this.biasDetection.analyze(result.description)
      })) || [];
    } catch (error) {
      console.error('Startpage search error:', error);
      return [];
    }
  }

  /**
   * Searx search implementation
   */
  private async searchSearx(query: string, options: SearchOptions): Promise<SearchResult[]> {
    try {
      const searxUrl = process.env.NEXT_PUBLIC_SEARX_URL || 'https://searx.example.com';
      const response = await fetch(`${searxUrl}/search?q=${encodeURIComponent(query)}&format=json`);
      const data = await response.json();
      
      return data.results?.map((result: any) => ({
        title: result.title,
        description: result.content,
        url: result.url,
        source: 'Searx',
        timestamp: Date.now(),
        credibility: this.credibilityScoring.score(result.url),
        biasScore: this.biasDetection.analyze(result.content)
      })) || [];
    } catch (error) {
      console.error('Searx search error:', error);
      return [];
    }
  }

  /**
   * Yacy P2P search implementation
   */
  private async searchYacy(query: string, options: SearchOptions): Promise<SearchResult[]> {
    try {
      const yacyUrl = process.env.NEXT_PUBLIC_YACY_URL || 'http://localhost:8090';
      const response = await fetch(`${yacyUrl}/yacysearch.json?query=${encodeURIComponent(query)}&maximumRecords=10`);
      const data = await response.json();
      
      return data.channels?.[0]?.items?.map((result: any) => ({
        title: result.title,
        description: result.description,
        url: result.link,
        source: 'Yacy',
        timestamp: Date.now(),
        credibility: this.credibilityScoring.score(result.link),
        biasScore: this.biasDetection.analyze(result.description)
      })) || [];
    } catch (error) {
      console.error('Yacy search error:', error);
      return [];
    }
  }

  /**
   * Aggregate results from multiple providers
   */
  private aggregateResults(results: SearchResult[], query: string): SearchResult[] {
    // Remove duplicates based on URL
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.url === result.url)
    );

    // Apply consensus algorithm
    const consensusResults = this.applyConsensusAlgorithm(uniqueResults, query);

    // Sort by credibility and relevance
    return consensusResults.sort((a, b) => {
      const scoreA = (a.credibility * 0.6) + ((1 - a.biasScore) * 0.4);
      const scoreB = (b.credibility * 0.6) + ((1 - b.biasScore) * 0.4);
      return scoreB - scoreA;
    });
  }

  /**
   * Apply consensus algorithm to determine result reliability
   */
  private applyConsensusAlgorithm(results: SearchResult[], query: string): SearchResult[] {
    const consensusThreshold = 0.7;
    const consensusResults: SearchResult[] = [];

    for (const result of results) {
      // Find similar results from other sources
      const similarResults = results.filter(r => 
        r.url !== result.url && 
        this.calculateSimilarity(result.title, r.title) > 0.8
      );

      // Calculate consensus score
      const consensusScore = similarResults.length / (this.providers.length - 1);
      
      if (consensusScore >= consensusThreshold) {
        consensusResults.push({
          ...result,
          credibility: Math.min(result.credibility + (consensusScore * 0.2), 1.0)
        });
      }
    }

    return consensusResults;
  }

  /**
   * Calculate similarity between two strings
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Enable/disable search providers
   */
  setProviderEnabled(providerName: string, enabled: boolean): void {
    const provider = this.providers.find(p => p.name === providerName);
    if (provider) {
      provider.enabled = enabled;
    }
  }

  /**
   * Get provider statistics
   */
  getProviderStats(): Record<string, any> {
    return this.providers.reduce((stats, provider) => {
      stats[provider.name] = {
        enabled: provider.enabled,
        weight: provider.weight,
        features: provider.features
      };
      return stats;
    }, {} as Record<string, any>);
  }
}

/**
 * Bias Detection Engine
 */
class BiasDetectionEngine {
  private politicalKeywords = {
    left: ['progressive', 'liberal', 'democrat', 'socialist', 'left-wing'],
    right: ['conservative', 'republican', 'libertarian', 'right-wing', 'traditional'],
    center: ['moderate', 'centrist', 'bipartisan', 'independent']
  };

  private commercialKeywords = ['sponsored', 'advertisement', 'promoted', 'paid', 'affiliate'];

  analyze(text: string): number {
    const lowerText = text.toLowerCase();
    let biasScore = 0;

    // Political bias detection
    const politicalBias = this.detectPoliticalBias(lowerText);
    biasScore += politicalBias * 0.4;

    // Commercial bias detection
    const commercialBias = this.detectCommercialBias(lowerText);
    biasScore += commercialBias * 0.3;

    // Language bias detection
    const languageBias = this.detectLanguageBias(lowerText);
    biasScore += languageBias * 0.3;

    return Math.min(biasScore, 1.0);
  }

  private detectPoliticalBias(text: string): number {
    let leftCount = 0;
    let rightCount = 0;
    let centerCount = 0;

    this.politicalKeywords.left.forEach(keyword => {
      if (text.includes(keyword)) leftCount++;
    });

    this.politicalKeywords.right.forEach(keyword => {
      if (text.includes(keyword)) rightCount++;
    });

    this.politicalKeywords.center.forEach(keyword => {
      if (text.includes(keyword)) centerCount++;
    });

    const total = leftCount + rightCount + centerCount;
    if (total === 0) return 0;

    const maxCount = Math.max(leftCount, rightCount);
    return maxCount / total;
  }

  private detectCommercialBias(text: string): number {
    let commercialCount = 0;
    this.commercialKeywords.forEach(keyword => {
      if (text.includes(keyword)) commercialCount++;
    });

    return Math.min(commercialCount / 5, 1.0);
  }

  private detectLanguageBias(text: string): number {
    // Detect emotional language, superlatives, etc.
    const emotionalWords = ['amazing', 'incredible', 'terrible', 'awful', 'fantastic', 'horrible'];
    const superlatives = ['best', 'worst', 'most', 'least', 'always', 'never'];
    
    let biasCount = 0;
    [...emotionalWords, ...superlatives].forEach(word => {
      if (text.includes(word)) biasCount++;
    });

    return Math.min(biasCount / 10, 1.0);
  }
}

/**
 * Credibility Scoring Engine
 */
class CredibilityScoringEngine {
  private trustedDomains = [
    'gov', 'edu', 'org', 'wikipedia.org', 'reuters.com', 'ap.org',
    'bbc.com', 'npr.org', 'pbs.org', 'nature.com', 'science.org'
  ];

  private untrustedDomains = [
    'blogspot.com', 'wordpress.com', 'tumblr.com', 'medium.com'
  ];

  score(url: string): number {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Check trusted domains
      for (const trustedDomain of this.trustedDomains) {
        if (domain.includes(trustedDomain)) {
          return 0.9;
        }
      }

      // Check untrusted domains
      for (const untrustedDomain of this.untrustedDomains) {
        if (domain.includes(untrustedDomain)) {
          return 0.3;
        }
      }

      // Default credibility based on domain characteristics
      if (domain.includes('.gov') || domain.includes('.edu')) {
        return 0.95;
      } else if (domain.includes('.org')) {
        return 0.8;
      } else if (domain.includes('.com')) {
        return 0.6;
      } else {
        return 0.5;
      }
    } catch (error) {
      return 0.5; // Default score for invalid URLs
    }
  }
}

export interface SearchOptions {
  maxResults?: number;
  language?: string;
  region?: string;
  timeRange?: 'day' | 'week' | 'month' | 'year';
  safeSearch?: boolean;
}

export const multiSearchEngine = new MultiSearchEngine();
