# MetisAI Environment Setup Guide

## 🔧 Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Quantum Computing (Dynex) - REQUIRED
DYNEX_API_KEY=your_dynex_api_key
DYNEX_NETWORK=mainnet

# Payment Processing (Stripe) - REQUIRED
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Third-party Services - OPTIONAL
DUCKDUCKGO_API_KEY=your_duckduckgo_key
BRAVE_SEARCH_API_KEY=your_brave_search_key
TOR_PROXY_URL=your_tor_proxy_url

# Web3 Integration - OPTIONAL
IPFS_GATEWAY_URL=your_ipfs_gateway
ARWEAVE_WALLET_KEY=your_arweave_key
FILECOIN_RPC_URL=your_filecoin_rpc

# Development
NODE_ENV=development
```

## 📋 Setup Instructions

### 1. Supabase Setup
1. Go to https://supabase.com/dashboard
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon public key
5. Copy the service_role secret key

### 2. Dynex Setup
1. Go to https://dynexcoin.org
2. Create an account and get API key
3. Set network to mainnet for production

### 3. Stripe Setup
1. Go to https://stripe.com/dashboard
2. Create account and get API keys
3. Set up webhook endpoints

### 4. Optional Services
- **DuckDuckGo**: Get API key from https://duckduckgo.com/api
- **Brave Search**: Get API key from https://brave.com/search/api
- **TOR**: Set up TOR proxy server
- **Web3**: Configure IPFS, Arweave, and Filecoin

## ✅ Verification

After setting up environment variables, run:
```bash
npm run build
node comprehensive-test-suite.js
```

This will verify that all configurations are working correctly.
