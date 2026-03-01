import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = getServerSupabase();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { data, error } = await supabase
        .from('problems')
        .select('*, categories(name, slug)')
        .eq('id', parseInt(id))
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
        { data },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
}
