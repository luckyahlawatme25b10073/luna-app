// frontend/components/insights/mood-timeline.tsx
'use client';

import { motion } from 'framer-motion';
import { useLogs } from '@/hooks/useLogs';
import { useEffect, useRef, useState } from 'react';

interface Log {
  date: string;
  mood: string | null;
}

const MOOD_EMOJI: Record<string, string> = {
  HAPPY: '😊',
  NEUTRAL: '😐',
  SAD: '😢',
  ANXIOUS: '😰',
  EXCITED: '🤩',
  TIRED: '😴',
};

export default function MoodTimeline() {
  const { logs, loading } = useLogs(30);
  const containerRef = useRef<HTMLDivElement>(null);
  const [squares, setSquares] = useState<Array<{ date: string; emoji: string; hasLog: boolean; }>>([]);

  useEffect(() => {
    if (!logs) return;
    // Prepare data for last 30 days
    const today = new Date();
    const days: Array<{ date: string; emoji: string; hasLog: boolean }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const log = logs.find((l: any) => l.date.startsWith(dateStr));
      const emoji = log && log.mood ? MOOD_EMOJI[log.mood] : '·';
      days.push({
        date: dateStr,
        emoji,
        hasLog: !!log
      });
    }
    setSquares(days);
  }, [logs]);

  // Animate squares on appear
  useEffect(() => {
    if (!containerRef.current) return;
    const ref = containerRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && ref) {
          const squares = Array.from(ref.children);
          squares.forEach((el, idx) => {
            (el as HTMLElement).style.opacity = '0';
            (el as HTMLElement).style.transform = 'translateY(20px)';
            setTimeout(() => {
              (el as HTMLElement).style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              (el as HTMLElement).style.opacity = '1';
              (el as HTMLElement).style.transform = 'translateY(0)';
            }, idx * 50);
          });
        }
      });
    }, { threshold: 0.1 });
    observer.observe(ref);
    return () => { observer.unobserve(ref); };
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-96 w-full rounded-xl bg-white/80 backdrop-blur-sm border border-[var(--glass-border)] flex items-center justify-center"
      >
        Loading...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-foreground font-headings tracking-tight">30-Day Mood Timeline</h3>
        <p className="text-xs text-muted-foreground">Each square = one day</p>
      </div>
      {squares.length === 0 || squares.every(s => !s.hasLog) ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          No mood logs recorded in the last 30 days.
        </div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-7 gap-2">
          {squares.map((sq, idx) => (
            <div
              key={idx}
              className="w-6 h-6 flex items-center justify-center rounded text-sm transition-all"
              style={{
                background: sq.hasLog ? 'rgba(244, 143, 177, 0.2)' : 'rgba(0, 0, 0, 0.03)',
                color: sq.hasLog ? 'var(--pink-secondary)' : '#ccc',
                border: sq.hasLog ? '1px solid rgba(244, 143, 177, 0.3)' : '1px dashed rgba(244, 143, 177, 0.15)'
              }}
              title={`${sq.date}: ${sq.hasLog ? sq.emoji : 'No log'}`}
            >
              {sq.emoji}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}