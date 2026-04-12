/**
 * Server-only Supabase admin client.
 * Import ONLY from API routes and server components — never from client components.
 */
import { createClient } from '@supabase/supabase-js';

export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server env vars missing');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Convenience singleton for API routes
export const supabaseAdmin = getAdminClient();
