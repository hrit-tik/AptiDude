'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabaseClient';
import StatsCard from '@/components/StatsCard';
import CalendarHeatmap from '@/components/CalendarHeatmap';
import BarChart from '@/components/BarChart';
import Link from 'next/link';

interface Stats {
    total_solved: number;
    total_attempts: number;
    accuracy: number;
    rank: number;
    difficulty_distribution: { difficulty: string; count: number }[];
    category_distribution: { name: string; slug: string; count: number }[];
}

interface HeatmapDay { date: string; count: number; correct: number; }

export default function ProgressPage() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [heatmap, setHeatmap] = useState<HeatmapDay[]>([]);
    const [recent, setRecent] = useState<{ title: string; difficulty: string; is_correct: boolean; submitted_at: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { setLoading(false); return; }

        const supabase = getSupabase();

        const fetchData = async () => {
            // Fetch stats using the database function
            const { data: statsData } = await supabase.rpc('get_user_stats', { p_user_id: user.id });
            if (statsData) setStats(statsData);

            // Fetch heatmap
            const { data: heatmapData } = await supabase.rpc('get_heatmap_data', { p_user_id: user.id });
            if (heatmapData) setHeatmap(heatmapData);

            // Fetch recent submissions
            const { data: recentData } = await supabase
                .from('submissions')
                .select('is_correct, submitted_at, problems(title, difficulty)')
                .eq('user_id', user.id)
                .order('submitted_at', { ascending: false })
                .limit(10);

            if (recentData) {
                setRecent(recentData.map((s: Record<string, unknown>) => {
                    const prob = s.problems as { title: string; difficulty: string } | null;
                    return {
                        title: prob?.title || 'Unknown',
                        difficulty: prob?.difficulty || 'Easy',
                        is_correct: s.is_correct as boolean,
                        submitted_at: s.submitted_at as string,
                    };
                }));
            }
            setLoading(false);
        };
        fetchData();
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center glass-card p-8">
                    <span className="text-5xl">📊</span>
                    <h2 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">Sign in to track progress</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Create an account to save your submissions and view stats.</p>
                    <Link href="/login" className="mt-4 inline-block rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white">Sign In</Link>
                </div>
            </div>
        );
    }

    const difficultyData = stats?.difficulty_distribution?.map(d => ({
        label: d.difficulty,
        value: d.count,
        color: d.difficulty === 'Easy' ? 'var(--color-easy)' : d.difficulty === 'Medium' ? 'var(--color-medium)' : 'var(--color-hard)',
    })) || [];

    const categoryData = stats?.category_distribution?.map(c => ({
        label: c.name,
        value: c.count,
        color: c.slug === 'quant' ? 'var(--color-quant)' : c.slug === 'logical' ? 'var(--color-logical)' : c.slug === 'di' ? 'var(--color-di)' : 'var(--color-verbal)',
    })) || [];

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 animate-fade-in">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Your Progress</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">Track your aptitude journey</p>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 stagger-children">
                <StatsCard title="Problems Solved" value={stats?.total_solved || 0} icon="✅" />
                <StatsCard title="Total Attempts" value={stats?.total_attempts || 0} icon="📝" />
                <StatsCard title="Accuracy" value={`${stats?.accuracy || 0}%`} icon="🎯" />
                <StatsCard title="Rank" value={`#${stats?.rank || '-'}`} icon="🏆" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Heatmap */}
                <div className="glass-card p-6 animate-fade-in">
                    <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Activity Calendar</h2>
                    <CalendarHeatmap data={heatmap.map(h => ({ date: h.date, count: h.count, correct: h.correct }))} />
                </div>

                {/* Difficulty Distribution */}
                <div className="glass-card p-6 animate-fade-in">
                    <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">By Difficulty</h2>
                    <BarChart data={difficultyData} />
                </div>

                {/* Category Distribution */}
                <div className="glass-card p-6 animate-fade-in">
                    <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">By Category</h2>
                    <BarChart data={categoryData} />
                </div>

                {/* Recent Attempts */}
                <div className="glass-card p-6 animate-fade-in">
                    <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Recent Activity</h2>
                    {recent.length > 0 ? (
                        <div className="space-y-2">
                            {recent.map((r, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] px-3 py-2">
                                    <span className="text-lg">{r.is_correct ? '✅' : '❌'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{r.title}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            {new Date(r.submitted_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-medium ${r.difficulty === 'Easy' ? 'text-[var(--color-easy)]' : r.difficulty === 'Medium' ? 'text-[var(--color-medium)]' : 'text-[var(--color-hard)]'}`}>
                                        {r.difficulty}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-text-muted)]">No submissions yet. Start solving problems!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
