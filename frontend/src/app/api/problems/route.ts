import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = getServerSupabase();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '15');

    let query = supabase
        .from('problems')
        .select('*, categories(name, slug)', { count: 'exact' });

    if (difficulty) query = query.eq('difficulty', difficulty);
    if (category) query = query.eq('categories.slug', category);
    if (search) query = query.ilike('title', `%${search}%`);

    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1).order('id', { ascending: true });

    const { data, count, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
        { data: data || [], count: count || 0 },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
}
