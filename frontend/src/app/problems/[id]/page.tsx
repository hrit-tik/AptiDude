'use client';

import { useState, useRef, use, useEffect } from 'react';
import { sampleProblems } from '@/data/sampleProblems';
import DifficultyBadge from '@/components/DifficultyBadge';
import CategoryTag from '@/components/CategoryTag';
import Timer from '@/components/Timer';
import { getSupabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/auth';

interface Problem {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    category_slug: string;
    answer_type: string;
    options: string[] | null;
    correct_answer: string;
    explanation: string;
    constraints_info: string | null;
    examples: { input: string; output: string }[];
    acceptance_rate: number;
}

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [numericalAnswer, setNumericalAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showTimer, setShowTimer] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const timeRef = useRef(0);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await fetch(`/api/problems/${id}`);
                const json = await res.json();

                if (res.ok && json.data) {
                    const data = json.data;
                    setProblem({
                        id: data.id,
                        title: data.title,
                        description: data.description,
                        difficulty: data.difficulty,
                        category: data.categories?.name || '',
                        category_slug: data.categories?.slug || '',
                        answer_type: data.answer_type,
                        options: data.options,
                        correct_answer: data.correct_answer,
                        explanation: data.explanation,
                        constraints_info: data.constraints_info,
                        examples: data.examples || [],
                        acceptance_rate: data.acceptance_rate,
                    });
                    setIsLive(true);
                } else {
                    const sample = sampleProblems.find((p) => p.id === parseInt(id)) || null;
                    setProblem(sample);
                }
            } catch {
                const sample = sampleProblems.find((p) => p.id === parseInt(id)) || null;
                setProblem(sample);
            }
            setLoading(false);
        };
        fetchProblem();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent mx-auto" />
                    <p className="mt-3 text-sm text-[var(--color-text-muted)]">Loading problem...</p>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <span className="text-6xl">🔍</span>
                    <h2 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">Problem not found</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">The problem you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async () => {
        const answer = problem.answer_type === 'mcq' ? selectedAnswer : numericalAnswer;
        if (!answer) return;
        setSubmitting(true);

        const correct = answer.toString().trim().toLowerCase() === problem.correct_answer.trim().toLowerCase();
        setIsCorrect(correct);

        // Submit via API route if logged in
        if (user && isLive) {
            try {
                await fetch('/api/submissions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: user.id,
                        problem_id: problem.id,
                        answer,
                        is_correct: correct,
                        time_taken: timeRef.current,
                    }),
                });
            } catch {
                // Submission save failed - still show result to user
            }
        }

        setSubmitted(true);
        setSubmitting(false);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Panel - Question */}
                <div className="flex-1 animate-fade-in">
                    <div className="glass-card p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="text-[var(--color-text-muted)] text-sm font-mono">#{problem.id}</span>
                            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{problem.title}</h1>
                            {isLive && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-easy)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-easy)]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-easy)] animate-pulse" />
                                    Live
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <DifficultyBadge difficulty={problem.difficulty} />
                            <CategoryTag category={problem.category} slug={problem.category_slug} />
                            <span className="text-xs text-[var(--color-text-muted)]">
                                Acceptance: {problem.acceptance_rate}%
                            </span>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Description</h2>
                            <div className="text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap">{problem.description}</div>
                        </div>

                        {problem.examples && problem.examples.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Examples</h2>
                                <div className="space-y-3">
                                    {problem.examples.map((ex, i) => (
                                        <div key={i} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
                                            <div className="text-sm">
                                                <span className="text-[var(--color-text-muted)]">Input: </span>
                                                <span className="text-[var(--color-text-primary)] font-mono">{ex.input}</span>
                                            </div>
                                            <div className="text-sm mt-1">
                                                <span className="text-[var(--color-text-muted)]">Output: </span>
                                                <span className="text-[var(--color-accent)] font-mono font-semibold">{ex.output}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {problem.constraints_info && (
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Constraints</h2>
                                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 text-sm text-[var(--color-text-primary)]">{problem.constraints_info}</div>
                            </div>
                        )}

                        {submitted && (
                            <div className={`rounded-lg border p-4 animate-fade-in ${isCorrect
                                ? 'border-[var(--color-easy)]/30 bg-[var(--color-easy)]/10'
                                : 'border-[var(--color-hard)]/30 bg-[var(--color-hard)]/10'
                                }`}>
                                <h2 className="text-sm font-semibold mb-2">
                                    {isCorrect ? <span className="text-[var(--color-easy)]">✅ Correct!</span> : <span className="text-[var(--color-hard)]">❌ Incorrect</span>}
                                </h2>
                                {!isCorrect && (
                                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                                        Correct answer: <strong className="text-[var(--color-accent)]">{problem.correct_answer}</strong>
                                    </p>
                                )}
                                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                                    <strong>Explanation: </strong>{problem.explanation}
                                </p>
                                {!user && <p className="text-xs text-[var(--color-text-muted)] mt-2">💡 Sign in to save your progress!</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Answer */}
                <div className="lg:w-[400px] shrink-0 animate-slide-in">
                    <div className="glass-card p-6 lg:sticky lg:top-20">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Your Answer</h2>
                            <button onClick={() => setShowTimer(!showTimer)} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">
                                {showTimer ? 'Hide Timer' : 'Show Timer'}
                            </button>
                        </div>

                        {showTimer && <div className="mb-5"><Timer onTimeUpdate={(t) => (timeRef.current = t)} /></div>}

                        {problem.answer_type === 'mcq' && problem.options ? (
                            <div className="space-y-2 mb-5">
                                {problem.options.map((option, i) => (
                                    <button
                                        key={i} disabled={submitted}
                                        onClick={() => setSelectedAnswer(option)}
                                        className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-left transition-all ${submitted && option === problem.correct_answer
                                            ? 'border-[var(--color-easy)] bg-[var(--color-easy)]/10 text-[var(--color-easy)]'
                                            : submitted && option === selectedAnswer && !isCorrect
                                                ? 'border-[var(--color-hard)] bg-[var(--color-hard)]/10 text-[var(--color-hard)]'
                                                : selectedAnswer === option
                                                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                                                    : 'border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-border-light)] hover:bg-[var(--color-bg-hover)]'
                                            }`}
                                    >
                                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${selectedAnswer === option ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-bg-primary)] text-[var(--color-text-muted)]'}`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-5">
                                <input type="text" placeholder="Enter your answer..." value={numericalAnswer}
                                    onChange={(e) => setNumericalAnswer(e.target.value)} disabled={submitted}
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-50"
                                />
                            </div>
                        )}

                        {!submitted ? (
                            <button onClick={handleSubmit} disabled={(!selectedAnswer && !numericalAnswer) || submitting}
                                className="w-full rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-[var(--color-accent-hover)] hover:shadow-blue-500/40 disabled:opacity-40 disabled:shadow-none transition-all"
                            >
                                {submitting ? 'Submitting...' : 'Submit Answer'}
                            </button>
                        ) : (
                            <button onClick={() => { setSubmitted(false); setSelectedAnswer(''); setNumericalAnswer(''); setIsCorrect(false); }}
                                className="w-full rounded-lg border border-[var(--color-accent)] py-3 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all"
                            >
                                Try Again
                            </button>
                        )}

                        <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                <span>💬</span><span>Discussion</span>
                                <span className="ml-auto rounded-full bg-[var(--color-bg-primary)] px-2 py-0.5 text-xs">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
