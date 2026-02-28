export default function DifficultyBadge({ difficulty }: { difficulty: string }) {
    const colorMap: Record<string, string> = {
        Easy: 'bg-[var(--color-easy)]/15 text-[var(--color-easy)] border-[var(--color-easy)]/30',
        Medium: 'bg-[var(--color-medium)]/15 text-[var(--color-medium)] border-[var(--color-medium)]/30',
        Hard: 'bg-[var(--color-hard)]/15 text-[var(--color-hard)] border-[var(--color-hard)]/30',
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorMap[difficulty] || ''}`}>
            {difficulty}
        </span>
    );
}
