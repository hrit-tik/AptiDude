'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface ProblemForm {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category_slug: string;
    answer_type: 'mcq' | 'numerical';
    options: string[];
    correct_answer: string;
    explanation: string;
    constraints_info: string;
}

const emptyForm: ProblemForm = {
    title: '', description: '', difficulty: 'Easy', category_slug: 'quant',
    answer_type: 'mcq', options: ['', '', '', ''], correct_answer: '',
    explanation: '', constraints_info: '',
};

export default function AdminPage() {
    const { user, profile, isAdmin, loading: authLoading } = useAuth();
    const [form, setForm] = useState<ProblemForm>({ ...emptyForm });
    const [jsonImport, setJsonImport] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [tab, setTab] = useState<'add' | 'import'>('add');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<{ problems: number; users: number; submissions: number } | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);

    useEffect(() => {
        if (authLoading) return;
        const supabase = getSupabase();

        const fetchStats = async () => {
            const { count: probCount } = await supabase.from('problems').select('id', { count: 'exact', head: true });
            const { count: userCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
            const { count: subCount } = await supabase.from('submissions').select('id', { count: 'exact', head: true });
            setStats({ problems: probCount || 0, users: userCount || 0, submissions: subCount || 0 });

            const { data: catData } = await supabase.from('categories').select('*');
            if (catData) setCategories(catData);
        };
        fetchStats();
    }, [authLoading]);

    // Gate: must be admin
    if (authLoading) {
        return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" /></div>;
    }

    if (!user || !isAdmin) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center glass-card p-8">
                    <span className="text-5xl">🔒</span>
                    <h2 className="mt-4 text-xl font-bold text-[var(--color-text-primary)]">Admin Access Required</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        {!user ? 'Please sign in with an admin account.' : 'Your account does not have admin privileges.'}
                    </p>
                    {!user && <Link href="/login" className="mt-4 inline-block rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white">Sign In</Link>}
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const supabase = getSupabase();
        const cat = categories.find(c => c.slug === form.category_slug);
        if (!cat) { setMessage({ type: 'error', text: '❌ Invalid category' }); setLoading(false); return; }

        const { error } = await supabase.from('problems').insert({
            title: form.title,
            description: form.description,
            difficulty: form.difficulty,
            category_id: cat.id,
            answer_type: form.answer_type,
            options: form.answer_type === 'mcq' ? form.options.filter(o => o.trim()) : null,
            correct_answer: form.correct_answer,
            explanation: form.explanation || null,
            constraints_info: form.constraints_info || null,
            examples: [],
            acceptance_rate: Math.floor(Math.random() * 40 + 40),
        });

        if (error) {
            setMessage({ type: 'error', text: `❌ ${error.message}` });
        } else {
            setMessage({ type: 'success', text: `✅ "${form.title}" added successfully!` });
            setForm({ ...emptyForm });
            if (stats) setStats({ ...stats, problems: stats.problems + 1 });
        }
        setLoading(false);
    };

    const handleBulkImport = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const parsed = JSON.parse(jsonImport);
            const problems = Array.isArray(parsed) ? parsed : parsed.problems;
            if (!Array.isArray(problems)) throw new Error('JSON must be an array or { "problems": [...] }');

            const supabase = getSupabase();
            let imported = 0;
            const errors: string[] = [];

            for (const p of problems) {
                const cat = categories.find(c => c.slug === (p.category_slug || p.category));
                if (!cat) { errors.push(`Skipped "${p.title}": invalid category`); continue; }

                const { error } = await supabase.from('problems').insert({
                    title: p.title,
                    description: p.description,
                    difficulty: p.difficulty,
                    category_id: cat.id,
                    answer_type: p.answer_type || 'mcq',
                    options: p.options || null,
                    correct_answer: p.correct_answer,
                    explanation: p.explanation || null,
                    constraints_info: p.constraints_info || null,
                    examples: p.examples || [],
                    acceptance_rate: p.acceptance_rate || Math.floor(Math.random() * 40 + 40),
                });

                if (error) errors.push(`"${p.title}": ${error.message}`);
                else imported++;
            }

            setMessage({
                type: imported > 0 ? 'success' : 'error',
                text: `✅ Imported ${imported}/${problems.length}.${errors.length ? ' Errors: ' + errors.join('; ') : ''}`,
            });
            if (imported > 0) setJsonImport('');
        } catch (err) {
            setMessage({ type: 'error', text: `❌ ${err instanceof Error ? err.message : 'Import failed'}` });
        }
        setLoading(false);
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 animate-fade-in">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Admin Panel</h1>
                <p className="text-sm text-[var(--color-text-secondary)]">Add and manage aptitude questions</p>
            </div>

            {stats && (
                <div className="grid grid-cols-3 gap-4 mb-6 stagger-children">
                    <div className="glass-card p-4 text-center">
                        <p className="text-2xl font-bold text-[var(--color-accent)]">{stats.problems}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Total Questions</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <p className="text-2xl font-bold text-[var(--color-easy)]">{stats.users}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Users</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <p className="text-2xl font-bold text-[var(--color-quant)]">{stats.submissions}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Submissions</p>
                    </div>
                </div>
            )}

            {message && (
                <div className={`mb-4 rounded-lg border px-4 py-3 text-sm animate-fade-in ${message.type === 'success' ? 'border-[var(--color-easy)]/30 bg-[var(--color-easy)]/10 text-[var(--color-easy)]' : 'border-[var(--color-hard)]/30 bg-[var(--color-hard)]/10 text-[var(--color-hard)]'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-2 mb-6">
                <button onClick={() => setTab('add')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'add' ? 'bg-[var(--color-accent)] text-white' : 'border border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}>
                    ➕ Add Question
                </button>
                <button onClick={() => setTab('import')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'import' ? 'bg-[var(--color-accent)] text-white' : 'border border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}>
                    📥 Bulk Import JSON
                </button>
            </div>

            {tab === 'add' && (
                <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Title *</label>
                            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Question title"
                                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Difficulty *</label>
                                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as ProblemForm['difficulty'] })}
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]">
                                    <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Category *</label>
                                <select value={form.category_slug} onChange={(e) => setForm({ ...form, category_slug: e.target.value })}
                                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]">
                                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Question Description *</label>
                        <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Full question text..."
                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] resize-y" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Answer Type *</label>
                            <select value={form.answer_type} onChange={(e) => setForm({ ...form, answer_type: e.target.value as 'mcq' | 'numerical' })}
                                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]">
                                <option value="mcq">Multiple Choice (MCQ)</option><option value="numerical">Numerical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Correct Answer *</label>
                            <input type="text" required value={form.correct_answer} onChange={(e) => setForm({ ...form, correct_answer: e.target.value })} placeholder="Exact correct answer"
                                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]" />
                        </div>
                    </div>
                    {form.answer_type === 'mcq' && (
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Options</label>
                            <div className="grid grid-cols-2 gap-2">
                                {form.options.map((opt, i) => (
                                    <input key={i} type="text" value={opt} onChange={(e) => { const o = [...form.options]; o[i] = e.target.value; setForm({ ...form, options: o }); }}
                                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]" />
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Explanation</label>
                        <textarea rows={3} value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} placeholder="Detailed explanation..."
                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] resize-y" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-all">
                        {loading ? 'Adding...' : 'Add Question'}
                    </button>
                </form>
            )}

            {tab === 'import' && (
                <div className="glass-card p-6 space-y-4 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Paste JSON</label>
                        <textarea rows={12} value={jsonImport} onChange={(e) => setJsonImport(e.target.value)}
                            placeholder={`[\n  {\n    "title": "Question Title",\n    "description": "Full question",\n    "difficulty": "Easy",\n    "category_slug": "quant",\n    "answer_type": "mcq",\n    "options": ["A", "B", "C", "D"],\n    "correct_answer": "A",\n    "explanation": "Explanation"\n  }\n]`}
                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] font-mono resize-y" />
                    </div>
                    <button onClick={handleBulkImport} disabled={loading || !jsonImport.trim()}
                        className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-all">
                        {loading ? 'Importing...' : 'Import Questions'}
                    </button>
                </div>
            )}
        </div>
    );
}
