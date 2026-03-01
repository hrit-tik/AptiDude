import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = getServerSupabase();

export async function GET() {
    try {
        // Get all profiles with their submission stats
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, created_at');

        if (!profiles || profiles.length === 0) {
            return NextResponse.json({ data: [] });
        }

        // Get submission stats for all users
        const { data: submissions } = await supabase
            .from('submissions')
            .select('user_id, is_correct');

        // Aggregate stats per user
        const statsMap = new Map<string, { solved: number; attempts: number }>();
        if (submissions) {
            for (const s of submissions) {
                const curr = statsMap.get(s.user_id) || { solved: 0, attempts: 0 };
                curr.attempts++;
                if (s.is_correct) curr.solved++;
                statsMap.set(s.user_id, curr);
            }
        }

        // Build leaderboard
        const leaderboard = profiles
            .map((p) => {
                const stats = statsMap.get(p.id) || { solved: 0, attempts: 0 };
                return {
                    username: p.username,
                    avatar_url: p.avatar_url,
                    joined: p.created_at,
                    solved: stats.solved,
                    attempts: stats.attempts,
                    accuracy: stats.attempts > 0 ? Math.round((stats.solved / stats.attempts) * 100) : 0,
                };
            })
            .filter((u) => u.attempts > 0) // Only show users who have attempted
            .sort((a, b) => b.solved - a.solved || b.accuracy - a.accuracy);

        return NextResponse.json(
            { data: leaderboard },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
    } catch {
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
