import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = getServerSupabase();

export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        // Fetch stats
        const { data: statsData } = await supabase.rpc('get_user_stats', { p_user_id: userId });

        // Fetch heatmap
        const { data: heatmapData } = await supabase.rpc('get_heatmap_data', { p_user_id: userId });

        // Fetch recent submissions
        const { data: recentData } = await supabase
            .from('submissions')
            .select('is_correct, submitted_at, problems(title, difficulty)')
            .eq('user_id', userId)
            .order('submitted_at', { ascending: false })
            .limit(10);

        return NextResponse.json({
            stats: statsData || null,
            heatmap: heatmapData || [],
            recent: recentData || [],
        });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch progress data' }, { status: 500 });
    }
}
