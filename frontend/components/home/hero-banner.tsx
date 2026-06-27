'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useCycle } from '@/hooks/useCycle';
import { useUserData } from '@/hooks/useUserData';
import { PHASE_DATA, PhaseId } from '@/lib/phase-data';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeroBanner() {
  const { data: cycleData, loading } = useCycle();
  const { data: userData } = useUserData();

  if (loading || !cycleData) {
    return (
      <div className="min-h-[400px] bg-gradient-to-b from-[var(--pink-primary)] to-[var(--pink-secondary)] rounded-2xl p-8 flex flex-col items-center justify-center">
        <Skeleton className="mb-4 w-48 h-48 rounded-full" />
        <Skeleton className="mb-2 w-32 h-4 rounded-full" />
        <Skeleton className="mb-2 w-24 h-4 rounded-full" />
        <Skeleton className="mb-2 w-20 h-4 rounded-full" />
        <Skeleton className="w-16 h-4 rounded-full" />
      </div>
    );
  }

  const { dayInCycle, phase, daysUntilNextPeriod, nextPeriodStart, ovulationDate, daysUntilOvulation } = cycleData;
  const phaseInfo = PHASE_DATA[phase as PhaseId];

  // Get greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
      ? 'Good afternoon'
      : 'Good evening';

  // Get user name from settings
  const userName = userData?.name?.split(' ')[0] || 'there';
  const cycleLength = userData?.cycleLength ?? 28;
  const radius = 70;
  const strokeDasharray = 2 * Math.PI * radius; // 439.8
  const progressPercent = Math.min(dayInCycle, cycleLength) / cycleLength;
  const strokeDashoffset = strokeDasharray - progressPercent * strokeDasharray;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative overflow-hidden glass-card p-6 md:p-8"
    >
      {/* Background soft color tint overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-10 transition-colors duration-500" 
        style={{
          background: `radial-gradient(circle at 75% 50%, ${phaseInfo.color} 0%, transparent 60%)`
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Bento Column: Info */}
        <div className="space-y-5">
          {/* Header Row */}
          <div>
            <p className="text-[10px] text-pink-500 tracking-widest font-bold uppercase font-headings mb-1">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground/90 font-headings tracking-tight">
              {greeting}, <span className="font-accent italic text-[var(--pink-secondary)]">{userName}</span> 🌸
            </h1>
          </div>

          {/* Active Phase Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-100/50 bg-pink-50/40 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: phaseInfo.color }} />
            <span className="text-xs font-bold text-gray-700 tracking-wider font-headings uppercase">
              {phaseInfo.name} Phase
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground/90 leading-relaxed font-medium">
            Your body is in the <span className="text-gray-800 font-bold capitalize">{phaseInfo.name}</span> phase. {phaseInfo.description}
          </p>

          {/* Bento stats row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/40 border border-white/60 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-headings">Cycle Day</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-800 font-headings">{dayInCycle}</span>
                <span className="text-xs text-gray-500 font-semibold">/ {cycleLength}</span>
              </div>
            </div>
            <div className="bg-white/40 border border-white/60 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-headings">Next Period</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-800 font-headings">{daysUntilNextPeriod}</span>
                <span className="text-xs text-gray-500 font-semibold">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Bento Column: Circular Tracker & Bouncing Moon */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Main Visual Circle */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
            {/* Glowing Backdrop Aura */}
            <div 
              className="absolute inset-4 rounded-full filter blur-[24px] opacity-35 animate-pulse-glow"
              style={{
                background: `radial-gradient(circle, ${phaseInfo.color} 0%, transparent 75%)`,
                boxShadow: `0 0 40px ${phaseInfo.color}`
              }}
            />

            {/* Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Tracker Ring Track */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-pink-100/30"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Tracker Ring Progress */}
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: strokeDasharray }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                strokeLinecap="round"
                style={{ stroke: phaseInfo.color }}
              />
            </svg>

            {/* Center Moon Illustration */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.1 }}
            >
              <Moon 
                className="w-16 h-16 md:w-20 md:h-20 text-gray-800 cursor-pointer"
                style={{ filter: `drop-shadow(0 0 20px ${phaseInfo.color}a0)` }}
              />
            </motion.div>
          </div>

          {/* Small cycle days layout indicator below progress ring */}
          <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest font-headings">
            Cycle Progress: {Math.round(progressPercent * 100)}%
          </p>
        </div>

      </div>
    </motion.div>
  );
}