'use client';

import { useUserData } from '@/hooks/useUserData';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CycleStats() {
  const { data: userData, loading } = useUserData();

  if (loading || !userData) {
    return (
      <div className="p-6 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4">
        <Skeleton className="h-6 w-32 bg-pink-100" />
        <Skeleton className="h-16 w-full bg-pink-50" />
        <Skeleton className="h-16 w-full bg-pink-50" />
      </div>
    );
  }

  const cycleLength = userData.cycleLength ?? 28;
  const periodLength = userData.periodLength ?? 5;

  // Use UTC parts to avoid timezone-based date shifting (e.g. IST UTC+5:30)
  const formatUTCDate = (val: string | null | undefined) => {
    if (!val) return 'Not set';
    const d = new Date(val);
    if (isNaN(d.getTime())) return 'Not set';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'   // render the UTC calendar date exactly as stored
    });
  };

  const lastPeriodStart = formatUTCDate(userData.lastPeriodStart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
      className="p-6 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-5"
    >
      <div className="flex items-center gap-2 text-[var(--pink-primary)] font-bold">
        <Activity className="w-5 h-5" />
        <h2 className="font-jakarta text-sm tracking-wider uppercase">Cycle Statistics</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Cycle Length Stat */}
        <div className="p-4 rounded-2xl bg-white/40 border border-pink-50">
          <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider mb-1">Avg Cycle</p>
          <p className="text-xl font-extrabold text-gray-800 font-jakarta">
            {cycleLength} <span className="text-xs font-semibold text-gray-500">days</span>
          </p>
        </div>

        {/* Period Length Stat */}
        <div className="p-4 rounded-2xl bg-white/40 border border-pink-50">
          <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider mb-1">Avg Period</p>
          <p className="text-xl font-extrabold text-gray-800 font-jakarta">
            {periodLength} <span className="text-xs font-semibold text-gray-500">days</span>
          </p>
        </div>
      </div>

      {/* Last Period Start */}
      <div className="p-4 rounded-2xl bg-white/40 border border-pink-50 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider mb-0.5">Last Period Start</p>
          <p className="text-sm font-bold text-gray-800">{lastPeriodStart}</p>
        </div>
        <div className="p-2 rounded-xl bg-pink-50 text-pink-500">
          <RefreshCw className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}