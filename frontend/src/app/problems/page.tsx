'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ProblemTable from '@/components/ProblemTable';
import { sampleProblems } from '@/data/sampleProblems';
import { useAuth } from '@/lib/auth';

interface SupaProblem {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    category_id: number;
    answer_type: string;
    options: string[] | null;
    correct_answer: string;
    explanation: string;
    constraints_info: string;
    examples: { input: string; output: string }[];
    acceptance_rate: number;
    categories: { name: string; slug: string };
}

function ProblemsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read filter state from URL params (persists across navigation)
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const currentPage = parseInt(searchParams.get('page') || '1');

    const [problems, setProblems] = useState<ReturnType<typeof mapProblem>[]>([]);
    const [total, setTotal] = useState(0);
    const [isLive, setIsLive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set());
    const perPage = 15;
    const { user } = useAuth();

    // Helper to update URL params
    const updateParams = useCallback((updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        router.replace(`/problems?${params.toString()}`, { scroll: false });
    }, [searchParams, router]);

    function mapProblem(p: SupaProblem) {
        return {
            id: p.id,
            title: p.title,
            description: p.description,
            difficulty: p.difficulty,
            category: p.categories?.name || '',
            category_slug: p.categories?.slug || '',
            answer_type: p.answer_type,
            options: p.options,
            correct_answer: p.correct_answer,
            explanation: p.explanation,
            constraints_info: p.constraints_info,
            examples: p.examples || [],
            acceptance_rate: p.acceptance_rate,
            solved: solvedIds.has(p.id),
        };
    }

    // Fetch user's solved problems
    useEffect(() => {
        if (!user) return;
        const fetchSolved = async () => {
            try {
                const res = await fetch('/api/submissions', {
                    headers: { 'x-user-id': user.id },
                });
                const json = await res.json();
                if (json.data) setSolvedIds(new Set(json.data.map((s: { problem_id: number }) => s.problem_id)));
            } catch {
                // Silently fail
            }
        };
        fetchSolved();
    }, [user]);

    // Fetch problems via server-side API route (bypasses CORS)
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const params = new URLSearchParams();
                if (search) params.set('search', search);
                if (difficulty) params.set('difficulty', difficulty);
                if (category) params.set('category', category);
                params.set('page', String(currentPage));
                params.set('perPage', String(perPage));

                const res = await fetch(`/api/problems?${params.toString()}`);
                const json = await res.json();

                if (res.ok && json.data) {
                    let mapped = (json.data as SupaProblem[]).map(mapProblem);
                    if (status === 'solved') mapped = mapped.filter(p => p.solved);
                    if (status === 'unsolved') mapped = mapped.filter(p => !p.solved);
                    setProblems(mapped);
                    setTotal(json.count || json.data.length);
                    setIsLive(true);
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setProblems(sampleProblems as any);
                    setTotal(sampleProblems.length);
                    setIsLive(false);
                }
            } catch {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setProblems(sampleProblems as any);
                setTotal(sampleProblems.length);
                setIsLive(false);
            }
            setLoading(false);
        };
        fetchProblems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, difficulty, category, status, currentPage, solvedIds]);

    const totalPages = Math.ceil(total / perPage);

    const stats = useMemo(() => {
        return {
            total,
            solved: solvedIds.size,
        };
    }, [total, solvedIds]);

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Title & Stats Bar */}
            <div className="mb-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Problems</h1>
                    {isLive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-easy)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-easy)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-easy)] animate-pulse" />
                            Live
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    <span>Total: <strong className="text-[var(--color-text-primary)]">{stats.total}</strong></span>
                    {user && <span className="text-[var(--color-success)]">Solved: {stats.solved}/{stats.total}</span>}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <Sidebar
                    difficulty={difficulty}
                    category={category}
                    status={status}
                    onDifficultyChange={(v) => updateParams({ difficulty: v, page: '' })}
                    onCategoryChange={(v) => updateParams({ category: v, page: '' })}
                    onStatusChange={(v) => updateParams({ status: v, page: '' })}
                />

                <div className="flex-1 animate-fade-in">
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={search}
                                onChange={(e) => updateParams({ search: e.target.value, page: '' })}
                                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                            />
                        </div>
                    </div>

                    <p className="mb-3 text-xs text-[var(--color-text-muted)]">
                        {loading ? 'Loading...' : `Showing ${problems.length} of ${total} problems`}
                    </p>

                    <ProblemTable problems={problems} />

                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => updateParams({ page: String(currentPage - 1) })}
                                className="flex h-9 items-center rounded-lg border border-[var(--color-border)] px-3 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40 transition-all"
                            >
                                ← Prev
                            </button>
                            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => updateParams({ page: String(i + 1) })}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${currentPage === i + 1
                                        ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-blue-500/20'
                                        : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => updateParams({ page: String(currentPage + 1) })}
                                className="flex h-9 items-center rounded-lg border border-[var(--color-border)] px-3 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40 transition-all"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProblemsPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
            </div>
        }>
            <ProblemsContent />
        </Suspense>
    );
}
