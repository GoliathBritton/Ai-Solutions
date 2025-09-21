-- MetisAI Database Schema
-- This file contains the complete database schema for the MetisAI platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    company TEXT,
    role TEXT DEFAULT 'user',
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QUBO Algorithms Catalog
CREATE TABLE IF NOT EXISTS public.qubo_algorithms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    complexity TEXT NOT NULL CHECK (complexity IN ('basic', 'intermediate', 'advanced', 'expert')),
    price DECIMAL(10,2) NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    requirements JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QUBO Automations Catalog
CREATE TABLE IF NOT EXISTS public.qubo_automations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    complexity TEXT NOT NULL CHECK (complexity IN ('basic', 'intermediate', 'advanced', 'expert')),
    price DECIMAL(10,2) NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    requirements JSONB NOT NULL DEFAULT '[]',
    deployment_type TEXT NOT NULL CHECK (deployment_type IN ('cloud', 'on-premise', 'hybrid')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'basic', 'professional', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'cancelled', 'expired')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    selected_algorithms JSONB DEFAULT '[]',
    selected_automations JSONB DEFAULT '[]',
    consulting_hours INTEGER DEFAULT 0,
    setup_required BOOLEAN DEFAULT false,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Records
CREATE TABLE IF NOT EXISTS public.usage_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    subscription_id UUID REFERENCES public.subscriptions(id),
    service_type TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    usage_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
    payment_method TEXT NOT NULL,
    subscription_id UUID REFERENCES public.subscriptions(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace Items
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    complexity TEXT NOT NULL CHECK (complexity IN ('basic', 'intermediate', 'advanced', 'expert')),
    price DECIMAL(10,2) NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    requirements JSONB NOT NULL DEFAULT '[]',
    deployment_type TEXT NOT NULL CHECK (deployment_type IN ('cloud', 'on-premise', 'hybrid')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deployment Requests
CREATE TABLE IF NOT EXISTS public.deployment_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    item_id UUID REFERENCES public.marketplace_items(id) NOT NULL,
    deployment_type TEXT NOT NULL CHECK (deployment_type IN ('cloud', 'on-premise', 'hybrid')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'deployed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    item_id UUID REFERENCES public.marketplace_items(id) NOT NULL,
    deployment_request_id UUID REFERENCES public.deployment_requests(id),
    payment_method TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MCP Verification Records
CREATE TABLE IF NOT EXISTS public.mcp_verifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    query TEXT NOT NULL,
    sources JSONB NOT NULL DEFAULT '[]',
    consensus_score DECIMAL(3,2) NOT NULL,
    bias_analysis JSONB NOT NULL DEFAULT '{}',
    blockchain_verification JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QASC Coding Tasks
CREATE TABLE IF NOT EXISTS public.qasc_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    task_description TEXT NOT NULL,
    complexity TEXT NOT NULL CHECK (complexity IN ('basic', 'intermediate', 'advanced', 'expert')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FKT Staking Records
CREATE TABLE IF NOT EXISTS public.fkt_staking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    staking_period INTEGER NOT NULL, -- in days
    apy DECIMAL(5,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FKT Contribution Records
CREATE TABLE IF NOT EXISTS public.fkt_contributions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    contribution_type TEXT NOT NULL CHECK (contribution_type IN ('data', 'verification', 'feedback', 'development')),
    description TEXT NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON public.usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_date ON public.usage_records(usage_date);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_mcp_verifications_user_id ON public.mcp_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_qasc_tasks_user_id ON public.qasc_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_fkt_staking_user_id ON public.fkt_staking(user_id);
CREATE INDEX IF NOT EXISTS idx_fkt_contributions_user_id ON public.fkt_contributions(user_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qasc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fkt_staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fkt_contributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage records" ON public.usage_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own MCP verifications" ON public.mcp_verifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own QASC tasks" ON public.qasc_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own FKT staking" ON public.fkt_staking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own FKT contributions" ON public.fkt_contributions
    FOR SELECT USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO public.qubo_algorithms (name, description, category, complexity, price, features, requirements) VALUES
('Quantum Portfolio Optimization', 'Advanced portfolio optimization using quantum annealing for financial markets', 'finance', 'expert', 9999.99, '["Real-time optimization", "Risk analysis", "Multi-asset support"]', '["Quantum hardware access", "Financial data feeds"]'),
('Supply Chain Optimization', 'Quantum-enhanced supply chain optimization for logistics and manufacturing', 'logistics', 'advanced', 4999.99, '["Multi-constraint optimization", "Real-time updates", "Cost minimization"]', '["Supply chain data", "API integration"]'),
('Drug Discovery Algorithm', 'Quantum molecular simulation for pharmaceutical research', 'healthcare', 'expert', 14999.99, '["Molecular modeling", "Drug interaction analysis", "Clinical trial optimization"]', '["Chemical databases", "High-performance computing"]'),
('Traffic Flow Optimization', 'Urban traffic optimization using quantum algorithms', 'urban-planning', 'intermediate', 2999.99, '["Real-time traffic data", "Route optimization", "Emission reduction"]', '["Traffic sensors", "City infrastructure data"]'),
('Energy Grid Optimization', 'Smart grid optimization for renewable energy distribution', 'energy', 'advanced', 7999.99, '["Renewable integration", "Load balancing", "Predictive analytics"]', '["Grid data", "Weather forecasts"]');

INSERT INTO public.qubo_automations (name, description, category, complexity, price, features, requirements, deployment_type) VALUES
('Automated Trading Bot', 'Quantum-enhanced trading automation with real-time market analysis', 'finance', 'expert', 19999.99, '["Real-time trading", "Risk management", "Portfolio rebalancing"]', '["Trading API access", "Market data feeds"]', 'cloud'),
('Smart Manufacturing Controller', 'Automated production line optimization using quantum algorithms', 'manufacturing', 'advanced', 9999.99, '["Production optimization", "Quality control", "Predictive maintenance"]', '["IoT sensors", "Production data"]', 'hybrid'),
('Autonomous Vehicle Routing', 'Quantum-powered routing system for autonomous vehicles', 'transportation', 'expert', 24999.99, '["Real-time routing", "Traffic prediction", "Safety optimization"]', '["Vehicle sensors", "Traffic data"]', 'on-premise'),
('Smart City Management', 'Comprehensive urban management system with quantum optimization', 'urban-planning', 'advanced', 14999.99, '["Resource optimization", "Citizen services", "Environmental monitoring"]', '["City infrastructure", "Citizen data"]', 'hybrid'),
('Healthcare Diagnosis Assistant', 'AI-powered medical diagnosis with quantum-enhanced accuracy', 'healthcare', 'expert', 29999.99, '["Medical imaging analysis", "Symptom analysis", "Treatment recommendations"]', '["Medical databases", "Patient data"]', 'cloud');

-- Create functions for common operations
CREATE OR REPLACE FUNCTION public.get_user_subscription(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    tier TEXT,
    status TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    selected_algorithms JSONB,
    selected_automations JSONB,
    consulting_hours INTEGER,
    setup_required BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.tier,
        s.status,
        s.start_date,
        s.end_date,
        s.selected_algorithms,
        s.selected_automations,
        s.consulting_hours,
        s.setup_required
    FROM public.subscriptions s
    WHERE s.user_id = p_user_id
    AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_usage_statistics(p_user_id UUID, p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    service_type TEXT,
    total_usage INTEGER,
    daily_average DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ur.service_type,
        SUM(ur.usage_count)::INTEGER as total_usage,
        AVG(ur.usage_count) as daily_average
    FROM public.usage_records ur
    WHERE ur.user_id = p_user_id
    AND ur.usage_date BETWEEN p_start_date AND p_end_date
    GROUP BY ur.service_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
