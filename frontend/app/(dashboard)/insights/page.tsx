// frontend/app/(dashboard)/insights/page.tsx
'use client';

import CycleChart from '@/components/insights/cycle-chart';
import MoodTimeline from '@/components/insights/mood-timeline';
import SymptomBars from '@/components/insights/symptom-bars';
import EnergyPainChart from '@/components/insights/energy-pain-chart';
import InsightsSummary from '@/components/insights/insights-summary';
import { useCycle } from '@/hooks/useCycle';

export default function InsightsPage() {
  const { data: cycleData, loading } = useCycle();

  const formattedChartData = cycleData ? {
    dayInCycle: cycleData.dayInCycle,
    phase: cycleData.phase,
    daysUntilNextPeriod: cycleData.daysUntilNextPeriod,
    nextPeriodStart: new Date(cycleData.nextPeriodStart),
    ovulationDate: new Date(cycleData.ovulationDate),
    daysUntilOvulation: cycleData.daysUntilOvulation
  } : undefined;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Charts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="glass-card p-6">
          <CycleChart data={formattedChartData} loading={loading} />
        </div>
        <div className="glass-card p-6">
          <EnergyPainChart />
        </div>
      </div>
      
      {/* Middle Timelines */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="glass-card p-6">
          <MoodTimeline />
        </div>
        <div className="glass-card p-6">
          <SymptomBars />
        </div>
      </div>
      
      {/* Bottom Insights */}
      <div className="glass-card p-6">
        <InsightsSummary />
      </div>
    </div>
  );
}