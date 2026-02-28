'use client';

import { useMemo } from 'react';

interface HeatmapData {
    date: string;
    count: number;
    correct: number;
}

export default function CalendarHeatmap({ data }: { data: HeatmapData[] }) {
    const { weeks, months } = useMemo(() => {
        const dataMap = new Map(data.map((d) => [d.date, d]));
        const today = new Date();
        const days: { date: string; count: number; dayOfWeek: number }[] = [];

        // Generate last 365 days
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const entry = dataMap.get(dateStr);
            days.push({
                date: dateStr,
                count: entry?.count || 0,
                dayOfWeek: d.getDay(),
            });
        }

        // Group into weeks
        const weeks: typeof days[] = [];
        let currentWeek: typeof days = [];

        // Pad first week
        const firstDay = days[0];
        for (let i = 0; i < firstDay.dayOfWeek; i++) {
            currentWeek.push({ date: '', count: -1, dayOfWeek: i });
        }

        for (const day of days) {
            if (day.dayOfWeek === 0 && currentWeek.length > 0) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentWeek.push(day);
        }
        if (currentWeek.length > 0) weeks.push(currentWeek);

        // Get month labels
        const months: { label: string; col: number }[] = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let lastMonth = -1;

        weeks.forEach((week, i) => {
            const validDay = week.find((d) => d.date !== '');
            if (validDay) {
                const month = new Date(validDay.date).getMonth();
                if (month !== lastMonth) {
                    months.push({ label: monthNames[month], col: i });
                    lastMonth = month;
                }
            }
        });

        return { weeks, months };
    }, [data]);

    const getColor = (count: number) => {
        if (count < 0) return 'transparent';
        if (count === 0) return 'rgba(255,255,255,0.04)';
        if (count <= 2) return 'rgba(34,197,94,0.3)';
        if (count <= 4) return 'rgba(34,197,94,0.5)';
        if (count <= 6) return 'rgba(34,197,94,0.7)';
        return 'rgba(34,197,94,0.9)';
    };

    const totalContributions = data.reduce((sum, d) => sum + d.count, 0);

    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {totalContributions} submissions in the last year
                </h3>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block">
                    {/* Month labels */}
                    <div className="flex mb-1 text-[10px] text-[var(--color-text-muted)]" style={{ paddingLeft: '28px' }}>
                        {months.map((m, i) => (
                            <span key={i} style={{ position: 'relative', left: `${m.col * 14}px` }} className="absolute">
                                {m.label}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-0.5 mt-5">
                        {/* Day labels */}
                        <div className="flex flex-col gap-0.5 mr-1 text-[10px] text-[var(--color-text-muted)]">
                            <span className="h-[12px]"></span>
                            <span className="h-[12px] leading-[12px]">Mon</span>
                            <span className="h-[12px]"></span>
                            <span className="h-[12px] leading-[12px]">Wed</span>
                            <span className="h-[12px]"></span>
                            <span className="h-[12px] leading-[12px]">Fri</span>
                            <span className="h-[12px]"></span>
                        </div>

                        {/* Grid */}
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-0.5">
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        className="heatmap-cell"
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: getColor(day.count),
                                        }}
                                        title={day.date ? `${day.date}: ${day.count} submissions` : ''}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-[var(--color-text-muted)]">
                        <span>Less</span>
                        {[0, 2, 4, 6, 8].map((v) => (
                            <div
                                key={v}
                                className="heatmap-cell"
                                style={{ width: '12px', height: '12px', backgroundColor: getColor(v) }}
                            />
                        ))}
                        <span>More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
