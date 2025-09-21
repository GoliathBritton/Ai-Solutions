# 📚 MetisAI API Documentation

**Version**: 1.0.0  
**Base URL**: `https://metisai.nuco.cloud/api`  
**Authentication**: Bearer Token (JWT)

---

## 🔐 **Authentication**

All API requests require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### **Authentication Endpoints**

#### **User Registration**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "full_name": "John Doe",
  "company": "Acme Corp"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2025-09-16T00:00:00Z"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": "2025-09-16T24:00:00Z"
    }
  }
}
```

#### **User Login**
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

#### **Password Reset**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

---

## ⚡ **Quantum AI Endpoints**

### **qdLLM (Quantum-Diffusion-LLM)**

#### **Generate Text**
```http
POST /api/quantum/qdllm/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Explain quantum computing in simple terms",
  "max_length": 500,
  "temperature": 0.8,
  "use_quantum": true,
  "model": "qdllm-v1.0"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Quantum computing is a revolutionary technology that uses quantum mechanical phenomena...",
    "method": "quantum",
    "confidence": 0.95,
    "processing_time": 1200,
    "tokens_used": 150,
    "cost": 0.05
  }
}
```

**Parameters:**
- `prompt` (string, required): Input text prompt
- `max_length` (integer, optional): Maximum response length (10-2000)
- `temperature` (float, optional): Creativity level (0.1-1.0)
- `use_quantum` (boolean, optional): Use quantum processing (default: true)
- `model` (string, optional): Model version (default: "qdllm-v1.0")

### **QNLP (Quantum Natural Language Processing)**

#### **Process Text**
```http
POST /api/quantum/qnlp/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "I love this product! It's amazing and works perfectly.",
  "task": "sentiment",
  "use_quantum": true,
  "reference_texts": [
    "This is a positive review",
    "I hate this product"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sentiment": {
      "label": "positive",
      "score": 0.92,
      "confidence": 0.95
    },
    "entities": [
      {
        "text": "product",
        "label": "PRODUCT",
        "confidence": 0.98
      }
    ],
    "method": "quantum",
    "processing_time": 800
  }
}
```

**Tasks Available:**
- `sentiment`: Sentiment analysis
- `entities`: Named entity recognition
- `classification`: Text classification
- `summarization`: Text summarization
- `translation`: Language translation

### **QTransform (Quantum Transformer)**

#### **Generate with Quantum Attention**
```http
POST /api/quantum/qtransform/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Write a business proposal for AI implementation",
  "context": "Technology company, 500 employees, B2B software",
  "max_length": 1000,
  "temperature": 0.7,
  "use_quantum": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Executive Summary: This proposal outlines the implementation of AI technology...",
    "attention_weights": [0.1, 0.3, 0.4, 0.2],
    "method": "quantum",
    "confidence": 0.88,
    "processing_time": 1500
  }
}
```

---

## 🔍 **MCP (Machine Content Protocol) Endpoints**

### **Verify Content**
```http
POST /api/mcp/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "The Earth is flat and vaccines cause autism",
  "sources": ["duckduckgo", "brave", "startpage"],
  "use_tor": true,
  "web3_verification": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verification": {
      "is_factual": false,
      "confidence": 0.95,
      "sources_checked": 15,
      "contradictory_sources": 12,
      "supporting_sources": 3
    },
    "sources": [
      {
        "url": "https://example.com",
        "title": "Scientific Evidence",
        "reliability": 0.9,
        "stance": "contradictory"
      }
    ],
    "tor_verification": true,
    "web3_hash": "0x1234...",
    "processing_time": 3000
  }
}
```

### **Multi-Source Search**
```http
GET /api/mcp/search?query=quantum+computing&sources=duckduckgo,brave&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "title": "Quantum Computing Explained",
        "url": "https://example.com",
        "snippet": "Quantum computing uses quantum mechanical phenomena...",
        "source": "duckduckgo",
        "reliability": 0.85,
        "timestamp": "2025-09-16T00:00:00Z"
      }
    ],
    "total_results": 150,
    "sources_used": ["duckduckgo", "brave"],
    "processing_time": 2000
  }
}
```

---

## 🤖 **QASC (Quantum Agentic Swarm Coding) Endpoints**

### **Generate Code**
```http
POST /api/qasc/code
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Create a React component for user authentication",
  "language": "typescript",
  "framework": "react",
  "use_quantum": true,
  "include_tests": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "import React, { useState } from 'react';\n\nexport const AuthComponent = () => {\n  // Component implementation\n};",
    "tests": "import { render, screen } from '@testing-library/react';\n// Test implementation",
    "documentation": "This component handles user authentication...",
    "method": "quantum",
    "confidence": 0.92,
    "processing_time": 2500,
    "suggestions": [
      "Add error handling",
      "Implement loading states",
      "Add accessibility features"
    ]
  }
}
```

### **Analyze Code**
```http
POST /api/qasc/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "analysis_type": "security"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "security_score": 0.95,
      "performance_score": 0.88,
      "maintainability_score": 0.92,
      "issues": [
        {
          "type": "warning",
          "message": "Consider adding input validation",
          "line": 1,
          "severity": "medium"
        }
      ]
    },
    "suggestions": [
      "Add JSDoc comments",
      "Implement error handling",
      "Add unit tests"
    ],
    "method": "quantum",
    "processing_time": 1200
  }
}
```

---

## 💰 **Business Endpoints**

### **Pricing Calculation**
```http
POST /api/pricing/calculate
Authorization: Bearer <token>
Content-Type: application/json

{
  "tier": "professional",
  "usage": {
    "api_calls": 25000,
    "quantum_processing": 1000,
    "mcp_verifications": 500,
    "qasc_tasks": 200
  },
  "custom_features": ["dedicated_support", "custom_algorithms"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "base_price": 299.00,
    "usage_overages": 45.50,
    "custom_features": 200.00,
    "total_monthly": 544.50,
    "setup_fee": 500.00,
    "breakdown": {
      "api_calls": 0.00,
      "quantum_processing": 15.00,
      "mcp_verifications": 7.50,
      "qasc_tasks": 23.00,
      "dedicated_support": 200.00
    }
  }
}
```

### **Create Subscription**
```http
POST /api/subscriptions/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "tier": "professional",
  "payment_method_id": "pm_1234567890",
  "billing_cycle": "monthly",
  "custom_features": ["dedicated_support"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "sub_1234567890",
      "tier": "professional",
      "status": "active",
      "current_period_start": "2025-09-16T00:00:00Z",
      "current_period_end": "2025-10-16T00:00:00Z",
      "amount": 299.00
    },
    "payment_method": {
      "id": "pm_1234567890",
      "type": "card",
      "last4": "4242"
    }
  }
}
```

### **Process Payment**
```http
POST /api/payments/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 299.00,
  "currency": "usd",
  "payment_method_id": "pm_1234567890",
  "description": "MetisAI Professional Plan"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "pi_1234567890",
      "amount": 299.00,
      "currency": "usd",
      "status": "succeeded",
      "created": "2025-09-16T00:00:00Z"
    },
    "invoice": {
      "id": "in_1234567890",
      "pdf_url": "https://metisai.nuco.cloud/invoices/in_1234567890.pdf"
    }
  }
}
```

---

## 📊 **Analytics Endpoints**

### **Usage Statistics**
```http
GET /api/analytics/usage?period=30d&granularity=day
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "total_api_calls": 15000,
    "quantum_requests": 5000,
    "mcp_verifications": 3000,
    "qasc_tasks": 2000,
    "daily_breakdown": [
      {
        "date": "2025-09-16",
        "api_calls": 500,
        "quantum_requests": 150,
        "mcp_verifications": 100,
        "qasc_tasks": 50
      }
    ],
    "cost_breakdown": {
      "total_cost": 45.50,
      "quantum_processing": 15.00,
      "mcp_verifications": 7.50,
      "qasc_tasks": 23.00
    }
  }
}
```

### **Performance Metrics**
```http
GET /api/analytics/performance?period=7d
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uptime": 99.9,
    "average_response_time": 245,
    "error_rate": 0.1,
    "quantum_efficiency": 92.5,
    "customer_satisfaction": 4.7,
    "api_availability": {
      "qdllm": 99.95,
      "qnlp": 99.90,
      "qtransform": 99.85,
      "mcp": 99.80,
      "qasc": 99.90
    }
  }
}
```

---

## 🔧 **Error Handling**

### **Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request parameters are invalid",
    "details": {
      "field": "prompt",
      "issue": "Required field is missing"
    },
    "request_id": "req_1234567890",
    "timestamp": "2025-09-16T00:00:00Z"
  }
}
```

### **Common Error Codes**
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `INVALID_REQUEST` (400): Invalid request parameters
- `RATE_LIMITED` (429): Rate limit exceeded
- `QUANTUM_ERROR` (500): Quantum processing error
- `PAYMENT_REQUIRED` (402): Payment required for feature

### **Rate Limits**
- **Free Tier**: 100 requests/hour
- **Starter Tier**: 1,000 requests/hour
- **Professional Tier**: 5,000 requests/hour
- **Enterprise Tier**: Unlimited

---

## 📝 **SDK Examples**

### **JavaScript/TypeScript**
```javascript
import { MetisAI } from '@metisai/sdk';

const client = new MetisAI({
  apiKey: 'your_api_key',
  baseUrl: 'https://metisai.nuco.cloud/api'
});

// Generate text with qdLLM
const response = await client.qdllm.generate({
  prompt: 'Explain quantum computing',
  maxLength: 500,
  temperature: 0.8
});

console.log(response.data.text);
```

### **Python**
```python
from metisai import MetisAI

client = MetisAI(
    api_key='your_api_key',
    base_url='https://metisai.nuco.cloud/api'
)

# Process text with QNLP
response = client.qnlp.process(
    text='I love this product!',
    task='sentiment'
)

print(response.data.sentiment.label)
```

### **cURL Examples**
```bash
# Generate text with qdLLM
curl -X POST https://metisai.nuco.cloud/api/quantum/qdllm/generate \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing",
    "max_length": 500,
    "temperature": 0.8
  }'
```

---

## 🔄 **Webhooks**

### **Webhook Events**
- `subscription.created`: New subscription created
- `subscription.updated`: Subscription updated
- `subscription.cancelled`: Subscription cancelled
- `payment.succeeded`: Payment successful
- `payment.failed`: Payment failed
- `usage.threshold`: Usage threshold reached
- `quantum.completed`: Quantum processing completed

### **Webhook Payload**
```json
{
  "id": "evt_1234567890",
  "type": "subscription.created",
  "created": "2025-09-16T00:00:00Z",
  "data": {
    "subscription": {
      "id": "sub_1234567890",
      "tier": "professional",
      "status": "active"
    }
  }
}
```

---

## 📚 **Additional Resources**

- [Getting Started Guide](getting-started.md)
- [Authentication Guide](authentication.md)
- [Rate Limiting Guide](rate-limiting.md)
- [Webhook Guide](webhooks.md)
- [SDK Documentation](sdk-documentation.md)
- [Changelog](changelog.md)

---

**API Version**: 1.0.0  
**Last Updated**: September 16, 2025  
**Support**: api-support@metisai.tech
