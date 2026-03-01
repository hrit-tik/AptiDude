'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, profile, loading, signOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const navLinks = [
        { href: '/problems', label: 'Problems', icon: '📋' },
        { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
        { href: '/progress', label: 'Progress', icon: '📊' },
        { href: '/profile', label: 'Profile', icon: '👤' },
    ];

    return (
        <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/95 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/problems" className="flex items-center gap-2.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                        A
                    </div>
                    <span className="text-xl font-bold gradient-text hidden sm:block">AptiDude</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href || pathname?.startsWith(link.href + '/')
                                ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                                }`}
                        >
                            <span className="text-base">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Search Toggle */}
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-all"
                    >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>

                    {/* Auth Button */}
                    {!loading && user ? (
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:block text-sm text-[var(--color-text-secondary)]">
                                {profile?.username || user.email?.split('@')[0]}
                            </span>
                            <button
                                onClick={signOut}
                                className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : !loading ? (
                        <Link
                            href="/login"
                            className="flex h-9 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                        >
                            Sign In
                        </Link>
                    ) : null}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-all md:hidden"
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search Bar (expandable) */}
            {searchOpen && (
                <div className="border-t border-[var(--color-border)] px-4 py-3 animate-fade-in">
                    <div className="mx-auto max-w-2xl">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search problems..."
                            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
                        />
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="border-t border-[var(--color-border)] md:hidden animate-fade-in">
                    <div className="space-y-1 px-4 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
