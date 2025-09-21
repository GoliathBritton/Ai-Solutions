# 👨‍💻 MetisAI Developer Guide

**Version**: 1.0.0  
**Platform**: https://metisai.nuco.cloud  
**Last Updated**: September 16, 2025

---

## 🚀 **Getting Started**

### **Overview**

MetisAI provides a comprehensive API and SDK ecosystem for integrating quantum-enhanced AI capabilities into your applications. This guide covers everything you need to know to build with MetisAI.

### **What You'll Learn**

- How to authenticate with the MetisAI API
- How to integrate quantum AI models
- How to handle responses and errors
- How to optimize performance and costs
- How to build production-ready applications

---

## 🔐 **Authentication**

### **API Keys**

1. **Get Your API Key**
   - Sign up for a MetisAI account
   - Go to Settings > API Keys
   - Generate a new API key
   - Copy and store securely

2. **Using API Keys**
   ```javascript
   const client = new MetisAI({
     apiKey: 'your_api_key_here'
   });
   ```

### **JWT Tokens**

For user-specific operations, use JWT tokens:

```javascript
// Get JWT token after login
const token = await client.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Use token for authenticated requests
const client = new MetisAI({
  token: token.access_token
});
```

---

## 📦 **SDK Installation**

### **JavaScript/TypeScript**

```bash
npm install @metisai/sdk
```

```javascript
import { MetisAI } from '@metisai/sdk';

const client = new MetisAI({
  apiKey: 'your_api_key',
  baseUrl: 'https://metisai.nuco.cloud/api'
});
```

### **Python**

```bash
pip install metisai-sdk
```

```python
from metisai import MetisAI

client = MetisAI(
    api_key='your_api_key',
    base_url='https://metisai.nuco.cloud/api'
)
```

### **cURL**

```bash
curl -X POST https://metisai.nuco.cloud/api/quantum/qdllm/generate \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello world"}'
```

---

## ⚡ **Quantum AI Models**

### **qdLLM (Quantum-Diffusion-LLM)**

#### **Basic Usage**

```javascript
const response = await client.qdllm.generate({
  prompt: 'Explain quantum computing in simple terms',
  maxLength: 500,
  temperature: 0.8,
  useQuantum: true
});

console.log(response.data.text);
```

#### **Advanced Configuration**

```javascript
const response = await client.qdllm.generate({
  prompt: 'Write a business proposal',
  maxLength: 1000,
  temperature: 0.7,
  useQuantum: true,
  model: 'qdllm-v1.0',
  context: 'Technology company, B2B software',
  style: 'professional',
  language: 'en'
});
```

#### **Streaming Responses**

```javascript
const stream = await client.qdllm.generateStream({
  prompt: 'Write a long article about AI',
  maxLength: 2000
});

for await (const chunk of stream) {
  console.log(chunk.text);
}
```

### **QNLP (Quantum Natural Language Processing)**

#### **Sentiment Analysis**

```javascript
const response = await client.qnlp.process({
  text: 'I love this product! It works perfectly.',
  task: 'sentiment',
  useQuantum: true
});

console.log(response.data.sentiment);
// { label: 'positive', score: 0.92, confidence: 0.95 }
```

#### **Named Entity Recognition**

```javascript
const response = await client.qnlp.process({
  text: 'Apple Inc. is located in Cupertino, California.',
  task: 'entities',
  useQuantum: true
});

console.log(response.data.entities);
// [
//   { text: 'Apple Inc.', label: 'ORGANIZATION', confidence: 0.98 },
//   { text: 'Cupertino', label: 'LOCATION', confidence: 0.95 },
//   { text: 'California', label: 'LOCATION', confidence: 0.97 }
// ]
```

#### **Text Classification**

```javascript
const response = await client.qnlp.process({
  text: 'The stock market is performing well today.',
  task: 'classification',
  categories: ['finance', 'technology', 'sports'],
  useQuantum: true
});

console.log(response.data.classification);
// { category: 'finance', confidence: 0.89 }
```

### **QTransform (Quantum Transformer)**

#### **Context-Aware Generation**

```javascript
const response = await client.qtransform.generate({
  prompt: 'Write a conclusion for this research paper',
  context: 'This paper presents a novel approach to quantum machine learning...',
  maxLength: 500,
  useQuantum: true
});
```

#### **Multi-Modal Processing**

```javascript
const response = await client.qtransform.process({
  text: 'Analyze this document and extract key insights',
  document: 'path/to/document.pdf',
  task: 'analysis',
  useQuantum: true
});
```

---

## 🔍 **MCP (Machine Content Protocol)**

### **Content Verification**

```javascript
const response = await client.mcp.verify({
  content: 'The Earth is round and vaccines are safe.',
  sources: ['duckduckgo', 'brave', 'startpage'],
  useTor: true,
  web3Verification: true
});

console.log(response.data.verification);
// {
//   isFactual: true,
//   confidence: 0.95,
//   sourcesChecked: 15,
//   contradictorySources: 2,
//   supportingSources: 13
// }
```

### **Multi-Source Search**

```javascript
const response = await client.mcp.search({
  query: 'quantum computing applications',
  sources: ['duckduckgo', 'brave'],
  limit: 10,
  useTor: true
});

console.log(response.data.results);
```

### **Bias Detection**

```javascript
const response = await client.mcp.detectBias({
  content: 'This product is the best in the market.',
  analysisType: 'commercial',
  useQuantum: true
});

console.log(response.data.bias);
// {
//   biasLevel: 'medium',
//   biasType: 'commercial',
//   confidence: 0.87,
//   suggestions: ['Add supporting evidence', 'Include competitor analysis']
// }
```

---

## 🤖 **QASC (Quantum Agentic Swarm Coding)**

### **Code Generation**

```javascript
const response = await client.qasc.generateCode({
  prompt: 'Create a React component for user authentication',
  language: 'typescript',
  framework: 'react',
  includeTests: true,
  useQuantum: true
});

console.log(response.data.code);
console.log(response.data.tests);
console.log(response.data.documentation);
```

### **Code Analysis**

```javascript
const response = await client.qasc.analyzeCode({
  code: `
    function add(a, b) {
      return a + b;
    }
  `,
  language: 'javascript',
  analysisType: 'security',
  useQuantum: true
});

console.log(response.data.analysis);
// {
//   securityScore: 0.95,
//   performanceScore: 0.88,
//   maintainabilityScore: 0.92,
//   issues: [...],
//   suggestions: [...]
// }
```

### **Code Optimization**

```javascript
const response = await client.qasc.optimizeCode({
  code: 'your_code_here',
  language: 'python',
  optimizationType: 'performance',
  useQuantum: true
});

console.log(response.data.optimizedCode);
console.log(response.data.improvements);
```

---

## 💰 **Billing and Usage**

### **Usage Tracking**

```javascript
// Get current usage
const usage = await client.billing.getUsage({
  period: 'current_month'
});

console.log(usage.data);
// {
//   apiCalls: 15000,
//   quantumRequests: 5000,
//   mcpVerifications: 3000,
//   qascTasks: 2000,
//   totalCost: 45.50
// }
```

### **Pricing Calculation**

```javascript
const pricing = await client.billing.calculatePrice({
  tier: 'professional',
  usage: {
    apiCalls: 25000,
    quantumProcessing: 1000,
    mcpVerifications: 500,
    qascTasks: 200
  }
});

console.log(pricing.data.totalMonthly);
```

### **Subscription Management**

```javascript
// Create subscription
const subscription = await client.billing.createSubscription({
  tier: 'professional',
  paymentMethodId: 'pm_1234567890',
  billingCycle: 'monthly'
});

// Update subscription
await client.billing.updateSubscription({
  subscriptionId: 'sub_1234567890',
  tier: 'enterprise'
});

// Cancel subscription
await client.billing.cancelSubscription({
  subscriptionId: 'sub_1234567890'
});
```

---

## 🔧 **Error Handling**

### **Basic Error Handling**

```javascript
try {
  const response = await client.qdllm.generate({
    prompt: 'Hello world'
  });
} catch (error) {
  if (error.code === 'RATE_LIMITED') {
    console.log('Rate limit exceeded. Please try again later.');
  } else if (error.code === 'INVALID_REQUEST') {
    console.log('Invalid request parameters:', error.details);
  } else {
    console.log('Unexpected error:', error.message);
  }
}
```

### **Retry Logic**

```javascript
async function generateWithRetry(prompt, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.qdllm.generate({ prompt });
    } catch (error) {
      if (error.code === 'RATE_LIMITED' && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}
```

### **Error Types**

- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `INVALID_REQUEST` (400): Invalid request parameters
- `RATE_LIMITED` (429): Rate limit exceeded
- `QUANTUM_ERROR` (500): Quantum processing error
- `PAYMENT_REQUIRED` (402): Payment required for feature

---

## 📊 **Performance Optimization**

### **Caching**

```javascript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

async function generateWithCache(prompt) {
  const cacheKey = `qdllm:${prompt}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const response = await client.qdllm.generate({ prompt });
  cache.set(cacheKey, response);
  return response;
}
```

### **Batch Processing**

```javascript
async function batchGenerate(prompts) {
  const batchSize = 10;
  const results = [];
  
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    const batchPromises = batch.map(prompt => 
      client.qdllm.generate({ prompt })
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}
```

### **Rate Limiting**

```javascript
class RateLimiter {
  constructor(requestsPerSecond = 10) {
    this.requestsPerSecond = requestsPerSecond;
    this.queue = [];
    this.processing = false;
  }
  
  async execute(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
      
      await new Promise(resolve => 
        setTimeout(resolve, 1000 / this.requestsPerSecond)
      );
    }
    
    this.processing = false;
  }
}

const rateLimiter = new RateLimiter(5); // 5 requests per second
```

---

## 🔒 **Security Best Practices**

### **API Key Management**

```javascript
// Use environment variables
const client = new MetisAI({
  apiKey: process.env.METISAI_API_KEY
});

// Rotate keys regularly
async function rotateApiKey() {
  const newKey = await client.auth.rotateApiKey();
  process.env.METISAI_API_KEY = newKey;
}
```

### **Input Validation**

```javascript
function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }
  
  if (prompt.length > 10000) {
    throw new Error('Prompt too long. Maximum 10,000 characters.');
  }
  
  // Check for malicious content
  if (containsMaliciousContent(prompt)) {
    throw new Error('Prompt contains potentially harmful content');
  }
  
  return true;
}
```

### **Secure Data Handling**

```javascript
// Encrypt sensitive data
const crypto = require('crypto');

function encryptData(data, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Use HTTPS only
const client = new MetisAI({
  apiKey: process.env.METISAI_API_KEY,
  baseUrl: 'https://metisai.nuco.cloud/api', // Always use HTTPS
  timeout: 30000
});
```

---

## 🧪 **Testing**

### **Unit Tests**

```javascript
import { MetisAI } from '@metisai/sdk';
import { jest } from '@jest/globals';

describe('MetisAI SDK', () => {
  let client;
  
  beforeEach(() => {
    client = new MetisAI({
      apiKey: 'test_api_key',
      baseUrl: 'https://api.test.metisai.com'
    });
  });
  
  test('should generate text with qdLLM', async () => {
    const mockResponse = {
      success: true,
      data: {
        text: 'Generated text',
        method: 'quantum',
        confidence: 0.95
      }
    };
    
    jest.spyOn(client.qdllm, 'generate').mockResolvedValue(mockResponse);
    
    const result = await client.qdllm.generate({
      prompt: 'Test prompt'
    });
    
    expect(result.data.text).toBe('Generated text');
    expect(result.data.method).toBe('quantum');
  });
});
```

### **Integration Tests**

```javascript
describe('MetisAI Integration', () => {
  test('should handle real API calls', async () => {
    const client = new MetisAI({
      apiKey: process.env.METISAI_API_KEY
    });
    
    const response = await client.qdllm.generate({
      prompt: 'Hello world',
      maxLength: 100
    });
    
    expect(response.success).toBe(true);
    expect(response.data.text).toBeDefined();
  });
});
```

---

## 📚 **Examples and Tutorials**

### **Complete Application Example**

```javascript
import { MetisAI } from '@metisai/sdk';
import express from 'express';

const app = express();
const client = new MetisAI({
  apiKey: process.env.METISAI_API_KEY
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, maxLength = 500, temperature = 0.8 } = req.body;
    
    const response = await client.qdllm.generate({
      prompt,
      maxLength,
      temperature,
      useQuantum: true
    });
    
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### **React Component Example**

```jsx
import React, { useState } from 'react';
import { MetisAI } from '@metisai/sdk';

const client = new MetisAI({
  apiKey: process.env.REACT_APP_METISAI_API_KEY
});

function TextGenerator() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  
  const generateText = async () => {
    setLoading(true);
    try {
      const response = await client.qdllm.generate({
        prompt,
        maxLength: 500,
        temperature: 0.8,
        useQuantum: true
      });
      setResult(response.data.text);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <button onClick={generateText} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {result && <div>{result}</div>}
    </div>
  );
}

export default TextGenerator;
```

---

## 📞 **Support and Resources**

### **Getting Help**

- **Documentation**: https://docs.metisai.tech
- **API Reference**: https://api.metisai.tech/docs
- **Community**: https://community.metisai.tech
- **Support**: support@metisai.tech

### **Additional Resources**

- [API Documentation](API_DOCUMENTATION.md)
- [User Guide](USER_GUIDE.md)
- [Integration Examples](INTEGRATION_EXAMPLES.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

---

**Happy coding with MetisAI! 🚀**
