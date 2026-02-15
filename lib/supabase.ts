import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a lazy-loaded Supabase client to avoid build errors with placeholder env vars
let _supabase: SupabaseClient | null = null;

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

// Export the Supabase client directly
export const supabase = getSupabaseClient();
