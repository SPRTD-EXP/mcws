import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

/** Browser client — uses anon key, respects RLS */
export function createBrowserSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** Server client — uses anon key for read-only server queries */
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** Service role client — bypasses RLS, for webhook inserts only */
export function createServiceSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}
