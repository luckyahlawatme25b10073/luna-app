'use client';

import { motion } from 'framer-motion';
import HeroBanner from '@/components/home/hero-banner';
import StatsGrid from '@/components/home/stats-grid';
import DailyAffirmation from '@/components/home/daily-affirmation';
import QuickActions from '@/components/home/quick-actions';
import PhaseInfo from '@/components/home/phase-info';
import WaterTracker from '@/components/home/water-tracker';

export default function HomePage() {
  return (
    <section className="space-y-6 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <HeroBanner />
      </motion.div>

      {/* Bento Stats Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
      >
        <StatsGrid />
      </motion.div>

      {/* Main Grid: Phase Info (Wide) + Affirmation & Water Tracker (Sidebar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="md:col-span-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
        >
          <PhaseInfo />
        </motion.div>
        
        <motion.div
          className="flex flex-col gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.45 }}
        >
          <DailyAffirmation />
          <WaterTracker />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
      >
        <QuickActions />
      </motion.div>
    </section>
  );
}