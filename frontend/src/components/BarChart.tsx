'use client';

interface BarData {
    label: string;
    value: number;
    color: string;
}

export default function BarChart({
    data,
    title,
    maxValue,
}: {
    data: BarData[];
    title?: string;
    maxValue?: number;
}) {
    const max = maxValue || Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="glass-card p-5">
            {title && (
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">{title}</h3>
            )}
            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                                {item.label}
                            </span>
                            <span className="text-xs font-bold text-[var(--color-text-primary)]">{item.value}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-[var(--color-bg-primary)] overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${(item.value / max) * 100}%`,
                                    background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                                    animationDelay: `${i * 150}ms`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
