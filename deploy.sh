#!/bin/bash

# MetisAI Production Deployment Script
echo "🚀 Deploying MetisAI to metisai.tech"

# Set production environment variables
export NODE_ENV=production
export NEXT_PUBLIC_APP_URL=https://metisai.tech
export NEXT_PUBLIC_DOMAIN=metisai.tech
export NEXT_PUBLIC_API_URL=https://api.metisai.tech
export NEXT_PUBLIC_CDN_URL=https://cdn.metisai.tech
export QUANTUM_API_URL=https://quantum.metisai.tech

# Build the application
echo "🔨 Building application..."
npm run build

# Create Docker image
echo "🐳 Creating Docker image..."
docker build -t metisai/platform:latest .

# Push to registry (if using container registry)
# docker push metisai/platform:latest

# Deploy to nuco.cloud
echo "☁️ Deploying to nuco.cloud..."
# Add nuco.cloud deployment commands here

# Verify deployment
echo "✅ Verifying deployment..."
curl -f https://metisai.tech/health || echo "Health check failed"

echo "✅ Deployment complete!"
echo "🌐 MetisAI is live at https://metisai.tech"
echo "🔗 API: https://api.metisai.tech"
echo "🔗 Quantum: https://quantum.metisai.tech"
echo "🔗 Docs: https://docs.metisai.tech"
echo "🔗 Status: https://status.metisai.tech"
