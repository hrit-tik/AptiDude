'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

interface LeaderboardEntry {
    username: string;
    avatar_url: string | null;
    joined: string;
    solved: number;
    attempts: number;
    accuracy: number;
}

export default function LeaderboardPage() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, profile } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                const json = await res.json();
                if (res.ok && json.data) {
                    setEntries(json.data);
                }
            } catch {
                // Silently fail
            }
            setLoading(false);
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
            </div>
        );
    }

    const getRankEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getRankStyle = (rank: number) => {
        if (rank === 1) return 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30';
        if (rank === 2) return 'from-slate-300/20 to-slate-400/10 border-slate-400/30';
        if (rank === 3) return 'from-orange-500/20 to-amber-600/10 border-orange-600/30';
        return 'from-transparent to-transparent border-[var(--color-border)]';
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 animate-fade-in">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                    🏆 Leaderboard
                </h1>
                <p className="text-sm text-[var(--color-text-secondary)]">
                    Top performers ranked by problems solved
                </p>
            </div>

            {entries.length === 0 ? (
                <div className="glass-card p-8 text-center animate-fade-in">
                    <span className="text-5xl">🏅</span>
                    <h2 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">No rankings yet</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        Start solving problems to appear on the leaderboard!
                    </p>
                </div>
            ) : (
                <div className="space-y-2 stagger-children">
                    {entries.map((entry, i) => {
                        const rank = i + 1;
                        const isCurrentUser = profile?.username === entry.username;

                        return (
                            <div
                                key={entry.username}
                                className={`glass-card border bg-gradient-to-r ${getRankStyle(rank)} p-4 transition-all hover:scale-[1.01] animate-fade-in ${isCurrentUser ? 'ring-2 ring-[var(--color-accent)]/50' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Rank */}
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${rank <= 3 ? 'text-2xl' : 'text-sm text-[var(--color-text-muted)]'}`}>
                                        {getRankEmoji(rank)}
                                    </div>

                                    {/* Avatar */}
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm shadow-lg">
                                        {entry.username[0]?.toUpperCase() || '?'}
                                    </div>

                                    {/* Username */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${isCurrentUser ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
                                            {entry.username}
                                            {isCurrentUser && (
                                                <span className="ml-2 text-xs font-normal text-[var(--color-accent)]">(You)</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            Joined {new Date(entry.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 text-center">
                                        <div>
                                            <p className="text-lg font-bold text-[var(--color-accent)]">{entry.solved}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">Solved</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-[var(--color-easy)]">{entry.accuracy}%</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">Accuracy</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-lg font-bold text-[var(--color-text-secondary)]">{entry.attempts}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">Attempts</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
