import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        // Fetch stats
        const { data: statsData } = await supabase.rpc('get_user_stats', { p_user_id: userId });

        // Fetch badges
        const { data: badgeData } = await supabase
            .from('user_badges')
            .select('badges(name, description, icon)')
            .eq('user_id', userId);

        // Fetch profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        return NextResponse.json({
            stats: statsData || null,
            badges: badgeData || [],
            profile: profileData || null,
        });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }
}
