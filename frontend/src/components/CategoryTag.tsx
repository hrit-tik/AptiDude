export default function CategoryTag({ category, slug }: { category: string; slug?: string }) {
    const colorMap: Record<string, string> = {
        quant: 'bg-[var(--color-quant)]/15 text-[var(--color-quant)]',
        logical: 'bg-[var(--color-logical)]/15 text-[var(--color-logical)]',
        di: 'bg-[var(--color-di)]/15 text-[var(--color-di)]',
        verbal: 'bg-[var(--color-verbal)]/15 text-[var(--color-verbal)]',
    };

    const shortName: Record<string, string> = {
        'Quantitative Aptitude': 'Quant',
        'Logical Reasoning': 'Logic',
        'Data Interpretation': 'DI',
        'Verbal Ability': 'Verbal',
    };

    const resolvedSlug = slug || Object.entries(shortName).find(([k]) => k === category)?.[1]?.toLowerCase() || 'quant';

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colorMap[resolvedSlug] || colorMap.quant}`}>
            {shortName[category] || category}
        </span>
    );
}
