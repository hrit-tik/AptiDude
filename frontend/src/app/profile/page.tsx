'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Stats {
    total_solved: number;
    total_attempts: number;
    accuracy: number;
    rank: number;
    difficulty_distribution: { difficulty: string; count: number }[];
    category_distribution: { name: string; slug: string; count: number }[];
}

interface Badge { name: string; description: string; icon: string; }

export default function ProfilePage() {
    const { user, profile, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { setLoading(false); return; }

        const fetchData = async () => {
            try {
                const res = await fetch('/api/profile', {
                    headers: { 'x-user-id': user.id },
                });
                const json = await res.json();

                if (res.ok) {
                    if (json.stats) setStats(json.stats);
                    if (json.badges) {
                        setBadges(json.badges.map((ub: Record<string, unknown>) => {
                            const b = ub.badges as Badge;
                            return { name: b.name, description: b.description, icon: b.icon };
                        }));
                    }
                }
            } catch {
                // Silently fail
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

    if (!user || !profile) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center glass-card p-8">
                    <span className="text-5xl">👤</span>
                    <h2 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">Sign in to view profile</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Create an account to track your progress.</p>
                    <Link href="/login" className="mt-4 inline-block rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white">Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Profile Header */}
            <div className="glass-card p-6 mb-6 animate-fade-in">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl shadow-lg">
                        {profile.username[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{profile.username}</h1>
                        <p className="text-sm text-[var(--color-text-secondary)]">{profile.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[var(--color-text-muted)]">
                                Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            {profile.role === 'admin' && (
                                <span className="rounded-full bg-[var(--color-accent)]/20 px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">Admin</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--color-accent)]">{stats?.total_solved || 0}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Solved</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--color-easy)]">{stats?.accuracy || 0}%</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Accuracy</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--color-medium)]">{stats?.total_attempts || 0}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Attempts</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--color-quant)]">#{stats?.rank || '-'}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Rank</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty Breakdown */}
                <div className="glass-card p-6 animate-fade-in">
                    <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Difficulty Breakdown</h2>
                    <div className="space-y-3">
                        {(stats?.difficulty_distribution || []).map((d) => (
                            <div key={d.difficulty} className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${d.difficulty === 'Easy' ? 'text-[var(--color-easy)]' : d.difficulty === 'Medium' ? 'text-[var(--color-medium)]' : 'text-[var(--color-hard)]'}`}>
                                    {d.difficulty}
                                </span>
                                <span className="text-sm text-[var(--color-text-primary)]">{d.count} solved</span>
                            </div>
                        ))}
                        {(!stats?.difficulty_distribution || stats.difficulty_distribution.length === 0) && (
                            <p className="text-sm text-[var(--color-text-muted)]">Start solving to see your distribution!</p>
                        )}
                    </div>
                </div>

                {/* Badges */}
                <div className="glass-card p-6 animate-fade-in">
                    <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Badges</h2>
                    {badges.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {badges.map((b, i) => (
                                <div key={i} className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] p-3">
                                    <span className="text-2xl">{b.icon}</span>
                                    <div>
                                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{b.name}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{b.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-text-muted)]">No badges earned yet. Keep solving! 💪</p>
                    )}
                </div>
            </div>
        </div>
    );
}
