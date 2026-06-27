'use client';

import { motion } from 'framer-motion';
import { getDailyAffirmation } from '@/lib/affirmations';

export default function DailyAffirmation() {
  const affirmation = getDailyAffirmation();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20">
            <span className="text-[var(--pink-primary)] text-xl">✨</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Today's Affirmation</h3>
          </div>
        </div>
      </div>
      <p className="text-lg font-medium text-foreground/90 italic">
        “{affirmation}”
      </p>
    </motion.div>
  );
}