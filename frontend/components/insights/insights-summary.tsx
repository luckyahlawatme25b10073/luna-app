// frontend/components/insights/insights-summary.tsx
'use client';

import { motion } from 'framer-motion';
import { useCycle } from '@/hooks/useCycle';
import { useLogs } from '@/hooks/useLogs';
import { PHASE_DATA } from '@/lib/phase-data';
import { useEffect, useState } from 'react';

export default function InsightsSummary() {
  const { data: cycleData, loading: cycleLoading } = useCycle();
  const { logs, loading: logsLoading } = useLogs(30);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    const newInsights: string[] = [];
    if (cycleData && cycleData.phase) {
      const phaseName = cycleData.phase.charAt(0).toUpperCase() + cycleData.phase.slice(1);
      const phaseInfo = PHASE_DATA[cycleData.phase as keyof typeof PHASE_DATA];
      newInsights.push(`You're currently in the ${phaseName} phase (day ${cycleData.dayInCycle}).`);
      if (phaseInfo && phaseInfo.tips?.[0]) {
        newInsights.push(`Tip: ${phaseInfo.tips[0]}`);
      }
    }
    if (logs && logs.length > 0) {
      const moodCounts: Record<string, number> = {};
      logs.forEach(l => {
        if (l.mood) moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
      });
      const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (topMood) {
        newInsights.push(`Your most frequent mood this month: ${topMood}.`);
      }
      const totalSymptoms = logs.reduce((sum, l) => sum + (Array.isArray(l.symptoms) ? l.symptoms.length : 0), 0);
      newInsights.push(`You've logged ${totalSymptoms} symptoms in the last 30 days.`);
    }
    setInsights(newInsights);
  }, [cycleData, logs]);

  if (cycleLoading || logsLoading) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground font-medium">
        Loading insights...
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-foreground font-headings tracking-tight mb-4">Key Insights</h3>
      {insights.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          Log today's symptoms to generate custom cycle insights.
        </div>
      ) : (
        <div className="space-y-3.5">
          {insights.map((text, idx) => (
            <div key={idx} className="flex items-start">
              <div className="flex h-4 w-4 items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
              </div>
              <p className="text-xs font-medium text-gray-700 ml-2.5 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}