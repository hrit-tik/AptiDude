'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const { error } = await signUp(email, password, username);
        if (error) {
            setError(error);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/problems'), 1500);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="glass-card p-8">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
                            A
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Create Account</h1>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Start your aptitude journey</p>
                    </div>

                    {success && (
                        <div className="mb-4 rounded-lg border border-[var(--color-easy)]/30 bg-[var(--color-easy)]/10 px-4 py-3 text-sm text-[var(--color-easy)] animate-fade-in">
                            ✅ Account created! Redirecting...
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-lg border border-[var(--color-hard)]/30 bg-[var(--color-hard)]/10 px-4 py-3 text-sm text-[var(--color-hard)] animate-fade-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Username</label>
                            <input
                                type="text" required value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                placeholder="aptive_pro"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                            <input
                                type="email" required value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Password</label>
                            <input
                                type="password" required value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit" disabled={loading || success}
                            className="w-full rounded-lg bg-[var(--color-accent)] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-[var(--color-accent-hover)] hover:shadow-blue-500/40 disabled:opacity-50 transition-all"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[var(--color-accent)] hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
