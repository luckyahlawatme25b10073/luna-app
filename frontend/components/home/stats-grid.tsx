'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Flame, Sparkles } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { useCycle } from '@/hooks/useCycle';

export default function StatsGrid() {
  const { data: userData } = useUserData();
  const { data: cycleData } = useCycle();

  const cycleLength = userData?.cycleLength ?? 28;
  const periodLength = userData?.periodLength ?? 5;

  const nextPeriodFormatted = cycleData?.nextPeriodStart
    ? new Date(cycleData.nextPeriodStart).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : 'Not logged';

  const nextOvulationFormatted = cycleData?.ovulationDate
    ? new Date(cycleData.ovulationDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : 'Not logged';

  const items = [
    {
      title: 'Average Cycle',
      value: `${cycleLength} days`,
      desc: 'Based on your logs',
      icon: TrendingUp,
      color: 'text-pink-500 bg-pink-50/50 border-pink-100/50',
      delay: 0.1
    },
    {
      title: 'Period Length',
      value: `${periodLength} days`,
      desc: 'Average duration',
      icon: Calendar,
      color: 'text-rose-500 bg-rose-50/50 border-rose-100/50',
      delay: 0.2
    },
    {
      title: 'Next Period',
      value: nextPeriodFormatted,
      desc: 'Predicted start date',
      icon: Flame,
      color: 'text-amber-500 bg-amber-50/50 border-amber-100/50',
      delay: 0.3
    },
    {
      title: 'Next Ovulation',
      value: nextOvulationFormatted,
      desc: 'High fertility prediction',
      icon: Sparkles,
      color: 'text-emerald-500 bg-emerald-50/50 border-emerald-100/50',
      delay: 0.4
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: item.delay }}
            className="glass-card p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground font-headings tracking-tight">
                  {item.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${item.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-xl md:text-2xl font-extrabold text-foreground/90 font-headings tracking-tight">
                {item.value}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-medium">
              {item.desc}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}