'use client';

import { motion } from 'framer-motion';
import { useLogs } from '@/hooks/useLogs';
import { useEffect, useState } from 'react';

export default function SymptomBars() {
  const { logs, loading } = useLogs(30);
  const [symptomData, setSymptomData] = useState<Array<{ name: string; count: number }>>([]);

  useEffect(() => {
    if (!logs) return;
    // Count symptom frequencies
    const counts: Record<string, number> = {};
    logs.forEach(log => {
      if (Array.isArray(log.symptoms)) {
        log.symptoms.forEach((s: string) => {
          counts[s] = (counts[s] || 0) + 1;
        });
      }
    });
    // Convert to array and sort descending
    const sorted = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // top 6
    setSymptomData(sorted);
  }, [logs]);

  if (loading) {
    return (
      <div className="h-48 w-full rounded-2xl glass-card flex items-center justify-center text-sm text-muted-foreground">
        Loading symptoms...
      </div>
    );
  }

  const maxCount = Math.max(...symptomData.map(d => d.count), 1);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-foreground font-headings tracking-tight">Top Symptoms</h3>
        <p className="text-xs text-muted-foreground">Last 30 days</p>
      </div>
      <div className="space-y-3">
        {symptomData.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No logged symptoms found.</p>
        ) : (
          symptomData.map((item, idx) => {
            const percent = (item.count / maxCount) * 100;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-20 text-right text-xs font-semibold text-gray-600 capitalize truncate">
                  {item.name}
                </div>
                <div className="flex-1 h-2.5 bg-pink-100/30 rounded-full overflow-hidden border border-pink-200/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                  />
                </div>
                <div className="w-8 text-left text-xs font-bold text-gray-700 font-headings">
                  {item.count}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}