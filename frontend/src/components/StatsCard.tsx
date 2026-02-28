export default function StatsCard({
    title,
    value,
    subtitle,
    icon,
    color = 'blue',
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color?: string;
}) {
    const colorMap: Record<string, string> = {
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
        green: 'from-green-500/20 to-green-600/5 border-green-500/20',
        yellow: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20',
        red: 'from-red-500/20 to-red-600/5 border-red-500/20',
        purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
        cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    };

    const textColor: Record<string, string> = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        yellow: 'text-yellow-400',
        red: 'text-red-400',
        purple: 'text-purple-400',
        cyan: 'text-cyan-400',
    };

    return (
        <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 ${colorMap[color]} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</p>
                    <p className={`mt-2 text-3xl font-bold animate-count-up ${textColor[color]}`}>{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{subtitle}</p>
                    )}
                </div>
                <span className="text-3xl opacity-80">{icon}</span>
            </div>
            {/* Decorative glow */}
            <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br ${colorMap[color]} opacity-20 blur-2xl`} />
        </div>
    );
}
