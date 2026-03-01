import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client that bypasses RLS using the service_role key.
// Falls back to anon key if service_role key is not available.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function getServerSupabase() {
    return createClient(supabaseUrl, serviceRoleKey || anonKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
