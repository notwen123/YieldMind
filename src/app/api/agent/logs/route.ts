import { NextResponse } from 'next/server';
import { getRecentAuditLogs } from '@/lib/supabase/db';

export async function GET() {
  try {
    const agentId = Number(process.env.AGENT_ID ?? 0);
    const rows = await getRecentAuditLogs(agentId, 20);

    // Shape rows into the AuditLog interface the dashboard expects
    const logs = rows.map((r: any) => ({
      id:        r.id,
      action:    r.action,
      timestamp: new Date(r.timestamp).toLocaleTimeString(),
      txHash:    r.tx_hash || '0x0000000000000000000000000000000000000000',
      status:    r.signature ? 'VALIDATED' : 'PENDING',
      details:   r.details || `${r.action} on ${r.asset ?? 'N/A'}`,
    }));

    return NextResponse.json(logs);
  } catch (err: any) {
    console.error('[/api/agent/logs]', err);
    return NextResponse.json([], { status: 500 });
  }
}
