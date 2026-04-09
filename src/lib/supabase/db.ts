/**
 * Server-side DB helpers using the centralized supabaseAdmin client.
 * All logic in here is for agents and server components.
 */
import { supabaseAdmin } from './client';

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export interface AuditLogRow {
  agent_id: number;
  action: string;
  asset?: string;
  amount?: number;
  delta_before?: number;
  delta_after?: number;
  apr?: number;
  risk_score?: number;
  signature: string;
  tx_hash?: string;
  details?: string;
}

export async function insertAuditLog(row: AuditLogRow) {
  const { data, error } = await supabaseAdmin.from('audit_logs').insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function getRecentAuditLogs(agentId: number, limit = 20) {
  const { data, error } = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .eq('agent_id', agentId)
    .order('timestamp', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

// ─── Performance Stats ────────────────────────────────────────────────────────

export interface PerfStatRow {
  agent_id: number;
  total_value_usd?: number;
  net_pnl?: number;
  realized_yield?: number;
  hedging_cost?: number;
}

export async function insertPerfStat(row: PerfStatRow) {
  const { data, error } = await supabaseAdmin.from('performance_stats').insert(row).select().single();
  if (error) throw error;
  return data;
}

// ─── Agent heartbeat ─────────────────────────────────────────────────────────

export async function upsertAgent(agentId: number, patch: Partial<{
  name: string;
  wallet_address: string;
  current_pool: string;
  is_active: boolean;
}>) {
  const { error } = await supabaseAdmin
    .from('agents')
    .upsert({ agent_id: agentId, ...patch, last_heartbeat: new Date().toISOString() }, {
      onConflict: 'agent_id',
    });
  if (error) throw error;
}
