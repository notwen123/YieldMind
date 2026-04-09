-- Supabase Schema for YieldMind

-- 1. Agent Registry Table (Mirroring on-chain state for fast UI)
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id BIGINT UNIQUE, -- On-chain token ID
    name TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    current_pool TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Audit Logs Table (ERC-8004 Artifacts)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id BIGINT REFERENCES agents(agent_id),
    action TEXT NOT NULL, -- DEPOSIT_LP, OPEN_HEDGE, REBALANCE, EXIT
    asset TEXT,
    amount NUMERIC,
    delta_before NUMERIC,
    delta_after NUMERIC,
    apr NUMERIC,
    risk_score NUMERIC,
    signature TEXT NOT NULL,
    tx_hash TEXT,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Performance Snapshots
CREATE TABLE IF NOT EXISTS performance_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id BIGINT REFERENCES agents(agent_id),
    total_value_usd NUMERIC,
    net_pnl NUMERIC,
    realized_yield NUMERIC,
    hedging_cost NUMERIC,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Real-time Subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE agents;
