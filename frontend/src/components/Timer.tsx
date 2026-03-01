'use client';

import { useState, useEffect, useRef } from 'react';

export default function Timer({ onTimeUpdate, stopped = false }: { onTimeUpdate?: (seconds: number) => void; stopped?: boolean }) {
    const [seconds, setSeconds] = useState(0);
    const [running, setRunning] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Stop the timer when submission happens
    useEffect(() => {
        if (stopped) setRunning(false);
    }, [stopped]);

    useEffect(() => {
        if (running && !stopped) {
            intervalRef.current = setInterval(() => {
                setSeconds((s) => {
                    const newVal = s + 1;
                    onTimeUpdate?.(newVal);
                    return newVal;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, stopped, onTimeUpdate]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2">
            <span className="text-lg font-mono font-bold text-[var(--color-text-primary)]">
                {formatTime(seconds)}
            </span>
            <button
                onClick={() => setRunning(!running)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all ${running
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                title={running ? 'Pause' : 'Resume'}
            >
                {running ? '⏸' : '▶'}
            </button>
            <button
                onClick={() => { setSeconds(0); setRunning(true); }}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-bg-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all"
                title="Reset"
            >
                ↻
            </button>
        </div>
    );
}
