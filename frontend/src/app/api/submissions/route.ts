import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = getServerSupabase();

// POST: Submit an answer
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, problem_id, answer, is_correct, time_taken } = body;

        if (!user_id || !problem_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error } = await supabase.from('submissions').insert({
            user_id,
            problem_id,
            answer,
            is_correct,
            time_taken,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }
}

// GET: Get solved problem IDs for a user
export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ data: [] });
    }

    try {
        const { data } = await supabase
            .from('submissions')
            .select('problem_id')
            .eq('user_id', userId)
            .eq('is_correct', true);

        return NextResponse.json({ data: data || [] });
    } catch {
        return NextResponse.json({ data: [] });
    }
}
