import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a lazy-loaded Supabase client to avoid build errors with placeholder env vars
let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
    if (_supabase) return _supabase;

    if (!supabaseUrl || !supabaseAnonKey ||
        supabaseUrl === 'your_supabase_project_url' ||
        supabaseAnonKey === 'your_supabase_anon_key') {
        throw new Error(
            'Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
        );
    }

    _supabase = createClient(supabaseUrl, supabaseAnonKey);
    return _supabase;
}

/**
 * Returns a Supabase client with administrative privileges (bypasses RLS).
 * Only for server-side use. Falls back to anon client if service key is missing.
 */
export function getSupabaseAdminClient(): SupabaseClient {
    if (_supabaseAdmin) return _supabaseAdmin;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Admin operations may fail.');
        return getSupabaseClient();
    }

    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    return _supabaseAdmin;
}

// Export the clients
export const supabase = getSupabaseClient();
export const supabaseAdmin = getSupabaseAdminClient();
