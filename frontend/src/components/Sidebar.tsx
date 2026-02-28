'use client';

interface SidebarProps {
    difficulty: string;
    category: string;
    status: string;
    onDifficultyChange: (v: string) => void;
    onCategoryChange: (v: string) => void;
    onStatusChange: (v: string) => void;
}

export default function Sidebar({
    difficulty, category, status,
    onDifficultyChange, onCategoryChange, onStatusChange,
}: SidebarProps) {
    const FilterSection = ({
        title,
        options,
        value,
        onChange,
    }: {
        title: string;
        options: { label: string; value: string; color?: string }[];
        value: string;
        onChange: (v: string) => void;
    }) => (
        <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                {title}
            </h3>
            <div className="space-y-0.5">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(value === opt.value ? '' : opt.value)}
                        className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${value === opt.value
                                ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                            }`}
                    >
                        {opt.color && (
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: opt.color }} />
                        )}
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <aside className="w-full lg:w-60 shrink-0">
            <div className="glass-card p-4 space-y-5 lg:sticky lg:top-20">
                <FilterSection
                    title="Difficulty"
                    value={difficulty}
                    onChange={onDifficultyChange}
                    options={[
                        { label: 'Easy', value: 'Easy', color: 'var(--color-easy)' },
                        { label: 'Medium', value: 'Medium', color: 'var(--color-medium)' },
                        { label: 'Hard', value: 'Hard', color: 'var(--color-hard)' },
                    ]}
                />

                <FilterSection
                    title="Category"
                    value={category}
                    onChange={onCategoryChange}
                    options={[
                        { label: 'Quant', value: 'quant', color: 'var(--color-quant)' },
                        { label: 'Logical', value: 'logical', color: 'var(--color-logical)' },
                        { label: 'Data Interp.', value: 'di', color: 'var(--color-di)' },
                        { label: 'Verbal', value: 'verbal', color: 'var(--color-verbal)' },
                    ]}
                />

                <FilterSection
                    title="Status"
                    value={status}
                    onChange={onStatusChange}
                    options={[
                        { label: '✅ Solved', value: 'solved' },
                        { label: '⬜ Unsolved', value: 'unsolved' },
                    ]}
                />

                {(difficulty || category || status) && (
                    <button
                        onClick={() => {
                            onDifficultyChange('');
                            onCategoryChange('');
                            onStatusChange('');
                        }}
                        className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] transition-all"
                    >
                        Clear all filters
                    </button>
                )}
            </div>
        </aside>
    );
}
