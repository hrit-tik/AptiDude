'use client';

import Link from 'next/link';
import DifficultyBadge from './DifficultyBadge';
import CategoryTag from './CategoryTag';
import { Problem } from '@/lib/types';

export default function ProblemTable({ problems }: { problems: Problem[] }) {
    return (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_120px_100px_80px] md:grid-cols-[50px_1fr_140px_120px_90px] items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <span>Status</span>
                <span>Title</span>
                <span className="hidden sm:block">Category</span>
                <span>Acceptance</span>
                <span>Difficulty</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[var(--color-border)]">
                {problems.map((problem, index) => (
                    <Link
                        key={problem.id}
                        href={`/problems/${problem.id}`}
                        className="problem-row grid grid-cols-[40px_1fr_120px_100px_80px] md:grid-cols-[50px_1fr_140px_120px_90px] items-center gap-2 px-4 py-3.5 text-sm"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        {/* Status */}
                        <span className="flex justify-center">
                            {problem.solved ? (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-easy)]/20 text-[var(--color-easy)]">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                            ) : (
                                <span className="h-5 w-5 rounded-full border-2 border-[var(--color-border)]" />
                            )}
                        </span>

                        {/* Title */}
                        <span className="font-medium text-[var(--color-text-primary)] truncate">
                            <span className="text-[var(--color-text-muted)] mr-2">{problem.id}.</span>
                            {problem.title}
                        </span>

                        {/* Category */}
                        <span className="hidden sm:block">
                            <CategoryTag category={problem.category} slug={problem.category_slug} />
                        </span>

                        {/* Acceptance */}
                        <span className="text-[var(--color-text-secondary)]">
                            {problem.acceptance_rate}%
                        </span>

                        {/* Difficulty */}
                        <DifficultyBadge difficulty={problem.difficulty} />
                    </Link>
                ))}
            </div>

            {problems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                    <span className="text-4xl mb-3">🔍</span>
                    <p className="text-sm">No problems found matching your filters.</p>
                </div>
            )}
        </div>
    );
}
