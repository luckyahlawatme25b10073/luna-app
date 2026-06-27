// frontend/components/insights/cycle-stats.tsx
'use client';

import { motion } from 'framer-motion';
import { useUserData } from '@/hooks/useUserData';
import { useLogs } from '@/hooks/useLogs';
import { useEffect, useState } from 'react';

export default function CycleStats() {
  const { data: userData, loading } = useUserData();
  const { logs } = useLogs(365); // get a year of logs to count
  const [stats, setStats] = useState({
    avgCycle: 0,
    avgPeriod: 0,
    daysLogged: 0
  });

  useEffect(() => {
    if (!userData) return;
    const cycleLength = userData.cycleLength ?? 28;
    const periodLength = userData.periodLength ?? 5;
    const loggedDays = logs ? logs.length : 0;
    setStats({
      avgCycle: cycleLength,
      avgPeriod: periodLength,
      daysLogged: loggedDays
    });
  }, [userData, logs]);

  if (loading || !userData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 min-w-0"
      >
        <div className="text-center py-4">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20 mx-auto mb-2">
            <span className="text-[var(--pink-primary)]">⏳</span>
          </div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--glass-border)] text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20">
              <span className="text-[var(--pink-primary)]">🔁</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Average Cycle Length</p>
          <p className="text-lg font-semibold text-foreground/90">{stats.avgCycle} days</p>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--glass-border)] text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20">
              <span className="text-[var(--pink-primary)]">💧</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Period Duration</p>
          <p className="text-lg font-semibold text-foreground/90">{stats.avgPeriod} days</p>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[var(--glass-border)] text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20">
              <span className="text-[var(--pink-primary)]">📅</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-1">Days Logged</p>
          <p className="text-lg font-semibold text-foreground/90">{stats.daysLogged}</p>
        </div>
      </div>
    </motion.div>
  );
}