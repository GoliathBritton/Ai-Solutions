# MetisAI Platform API Documentation

## 🚀 Overview

The MetisAI Platform provides a comprehensive API for quantum-enhanced language processing, featuring three main quantum models: qdLLM, QNLP, and QTransform.

## 🔗 Base URL

```
Production: https://api.metisai.com
Development: http://localhost:3000
```

## 🔐 Authentication

All API endpoints require authentication using Supabase JWT tokens.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📊 Quantum Models

### 1. qdLLM (Quantum-Diffusion-LLM)

#### Generate Text
```http
POST /api/quantum/qdllm/generate
```

**Request Body:**
```json
{
  "prompt": "The future of artificial intelligence lies in",
  "max_length": 100,
  "temperature": 0.8,
  "use_quantum": true,
  "num_diffusion_steps": 10
}
```

**Response:**
```json
{
  "text": "The future of artificial intelligence lies in quantum computing and neuromorphic processing...",
  "method": "quantum",
  "confidence": 0.92,
  "processing_time": 2.34,
  "model": "qdLLM",
  "quantum_available": true
}
```

### 2. QNLP (Quantum Natural Language Processing)

#### Process Text
```http
POST /api/quantum/qnlp/process
```

**Request Body:**
```json
{
  "text": "The future of quantum computing is incredibly exciting and promising.",
  "task": "sentiment",
  "reference_texts": [
    "Quantum computers will revolutionize technology.",
    "I love classical computing approaches."
  ],
  "use_quantum": true
}
```

**Response:**
```json
{
  "text": "QNLP Analysis Results:\n\nSimilar Texts: [...]\nSentiment: Positive 0.85, Negative 0.15\n...",
  "method": "quantum",
  "confidence": 0.88,
  "processing_time": 1.67,
  "model": "QNLP",
  "analysis": {
    "similarity": {...},
    "sentiment": {...},
    "classification": {...}
  }
}
```

### 3. QTransform (Quantum Transformer)

#### Generate with Quantum Attention
```http
POST /api/quantum/qtransform/generate
```

**Request Body:**
```json
{
  "prompt": "The future of artificial intelligence",
  "max_length": 100,
  "temperature": 0.8,
  "use_quantum": true
}
```

**Response:**
```json
{
  "text": "The future of artificial intelligence is being revolutionized by quantum computing...",
  "method": "quantum",
  "confidence": 0.94,
  "processing_time": 3.12,
  "model": "QTransform",
  "quantum_available": true
}
```

## 🎛️ Parameters

### Common Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | required | Input text prompt |
| `max_length` | integer | 100 | Maximum response length |
| `temperature` | float | 0.8 | Sampling temperature (0.1-2.0) |
| `use_quantum` | boolean | true | Enable quantum processing |

### qdLLM Specific

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `num_diffusion_steps` | integer | 10 | Number of diffusion steps |
| `quantum_threshold` | float | 0.7 | Threshold for quantum processing |

### QNLP Specific

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `task` | string | "similarity" | Processing task (similarity/sentiment/classification) |
| `reference_texts` | array | [] | Reference texts for similarity search |

## 📈 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "text": "Generated or processed text",
    "method": "quantum|classical",
    "confidence": 0.85,
    "processing_time": 2.34,
    "model": "qdLLM|QNLP|QTransform",
    "quantum_available": true
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "QUANTUM_ERROR",
    "message": "Quantum processing failed",
    "details": "Dynex SDK connection timeout"
  }
}
```

## 🔄 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 429 | Rate Limited |
| 500 | Internal Server Error |
| 503 | Quantum Service Unavailable |

## 🚦 Rate Limiting

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1000 requests/hour
- **Enterprise**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 🔧 SDK Examples

### JavaScript/TypeScript
```javascript
import { MetisAI } from '@metisai/sdk'

const client = new MetisAI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.metisai.com'
})

// Generate text with qdLLM
const response = await client.qdllm.generate({
  prompt: "The future of AI is",
  max_length: 100,
  use_quantum: true
})

console.log(response.data.text)
```

### Python
```python
from metisai import MetisAI

client = MetisAI(api_key='your-api-key')

# Process text with QNLP
response = client.qnlp.process(
    text="The future of quantum computing is exciting",
    task="sentiment",
    use_quantum=True
)

print(response.data.analysis)
```

### cURL
```bash
curl -X POST https://api.metisai.com/api/quantum/qdllm/generate \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "The future of AI is",
    "max_length": 100,
    "use_quantum": true
  }'
```

## 🧪 Testing

### Test Quantum Processing
```bash
# Test qdLLM
curl -X POST http://localhost:3000/api/quantum/qdllm/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test prompt", "use_quantum": true}'

# Test QNLP
curl -X POST http://localhost:3000/api/quantum/qnlp/process \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test text", "task": "sentiment"}'

# Test QTransform
curl -X POST http://localhost:3000/api/quantum/qtransform/generate \
  -H "Authorization: Bearer test-token" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test prompt", "use_quantum": true}'
```

## 📊 Monitoring

### Metrics Available
- Request count per model
- Quantum vs classical usage
- Average processing time
- Confidence scores
- Error rates
- User activity

### Dashboard
Access the monitoring dashboard at:
```
https://dashboard.metisai.com
```

## 🆘 Support

### Documentation
- [API Reference](https://docs.metisai.com/api)
- [SDK Documentation](https://docs.metisai.com/sdk)
- [Examples](https://github.com/metisai/examples)

### Community
- [Discord](https://discord.gg/metisai)
- [GitHub](https://github.com/metisai/platform)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/metisai)

### Support
- Email: support@metisai.com
- Status Page: https://status.metisai.com
- Emergency: +1-800-METISAI

---

**MetisAI Platform** - *Quantum-Enhanced AI for the Future* ⚡🧠🔄
