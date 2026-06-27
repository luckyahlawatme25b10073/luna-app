// src/components/home/phase-info.tsx
'use client';

import { motion } from 'framer-motion';
import { Moon, HeartPulse } from 'lucide-react';
import { PHASE_DATA } from '@/lib/phase-data';
import { useUserData } from '@/hooks/useUserData';
import { CycleCalculator } from '@/lib/cycle-calculator';
import { useState, useEffect } from 'react';

export default function PhaseInfo() {
  const { data: userData, loading: userLoading } = useUserData();
  const [phaseInfo, setPhaseInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading || !userData) {
      return;
    }

    const lastPeriodStart = new Date(userData.lastPeriodStart || Date.now() - 28 * 24 * 60 * 60 * 1000);
    const cycleLength = userData.cycleLength || 28;
    const periodLength = userData.periodLength || 5;

    const today = new Date();
    const cycleDay = CycleCalculator.getCycleDay(today, lastPeriodStart, cycleLength, periodLength);
    const phase = cycleDay.phase;
    const phaseData = PHASE_DATA[phase];

    setPhaseInfo({
      ...phaseData,
      dayInCycle: cycleDay.dayInCycle
    });
    setLoading(false);
  }, [userData, userLoading]);

  if (loading || userLoading || !phaseInfo) {
    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[var(--glass-border)]"
      >
        <div className="text-center py-8">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20 mx-auto mb-4">
            <span className="text-[var(--pink-primary)]">⏳</span>
          </div>
          <p className="text-muted-foreground">Loading your cycle phase...</p>
        </div>
      </motion.div>
    );
  }

  // Determine greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
      ? 'Good afternoon'
      : 'Good evening';

  // Get user name from settings or default
  const userName = userData?.name?.split(' ')[0] || 'there';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20">
            {/* Phase emoji */}
            <span className="text-[var(--pink-primary)] text-xl">{phaseInfo.emoji}</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {greeting}, <span className="font-accent italic text-pink-500 text-base">{userName}</span> 🌸
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--pink-primary)]/20">
          <Moon className="h-4 w-4" />
          <span className="text-xs font-semibold text-[var(--pink-primary)] uppercase tracking-wider font-headings">Day {phaseInfo.dayInCycle}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-foreground/90 mb-1 flex items-center gap-2 font-headings tracking-tight">
          {phaseInfo.emoji} <span className="capitalize text-lg">{phaseInfo.name}</span>
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{phaseInfo.description}</p>
      </div>

      {/* What your boyfriend can do today */}
      <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
        <h4 className="font-medium text-foreground/80 mb-2 flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-[var(--pink-secondary)]" />
          What your boyfriend can do today ❤️
        </h4>
        <p className="text-sm text-muted-leading-relaxed">
          {phaseInfo.boyfriendTips?.[0] || 'Show extra love and patience. Offer a massage or make her favorite tea.'}
        </p>
      </div>
    </motion.div>
  );
}