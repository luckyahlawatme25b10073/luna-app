'use client';

import { useCycle } from '@/hooks/useCycle';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictionPanel() {
  const { data: cycleData, loading } = useCycle();

  if (loading || !cycleData) {
    return (
      <div className="p-6 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4">
        <Skeleton className="h-6 w-32 bg-pink-100" />
        <Skeleton className="h-20 w-full bg-pink-50" />
        <Skeleton className="h-20 w-full bg-pink-50" />
      </div>
    );
  }

  const { nextPeriodStart, ovulationDate, daysUntilNextPeriod, daysUntilOvulation, isFertile } = cycleData;

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-6 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-6"
    >
      <div className="flex items-center gap-2 text-[var(--pink-primary)] font-bold">
        <Sparkles className="w-5 h-5" />
        <h2 className="font-jakarta text-sm tracking-wider uppercase">Predictions</h2>
      </div>

      <div className="space-y-4">
        {/* Next Period Prediction */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100/60">
          <div className="p-3 rounded-xl bg-rose-100/80 text-rose-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-rose-500 font-bold uppercase tracking-wider">Next Period</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {formatDate(nextPeriodStart)}
            </p>
          </div>
          <span className="text-xs bg-rose-100/70 text-rose-700 font-bold px-3 py-1.5 rounded-full">
            In {daysUntilNextPeriod} d
          </span>
        </div>

        {/* Next Ovulation Prediction */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
          <div className="p-3 rounded-xl bg-emerald-100/80 text-emerald-600">
            <Heart className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Next Ovulation</p>
            <p className="text-sm font-semibold text-gray-800 truncate">
              {formatDate(ovulationDate)}
            </p>
          </div>
          <span className="text-xs bg-emerald-100/70 text-emerald-700 font-bold px-3 py-1.5 rounded-full">
            In {daysUntilOvulation} d
          </span>
        </div>

        {/* Fertility Window Status */}
        <div className={`p-4 rounded-2xl border text-center transition-all ${
          isFertile 
            ? 'bg-pink-50/60 border-pink-200 text-pink-700 font-bold' 
            : 'bg-gray-50/60 border-gray-150 text-gray-500'
        }`}>
          <p className="text-xs uppercase tracking-wider mb-1 font-bold">Fertility Window</p>
          <p className="text-sm font-extrabold font-jakarta">
            {isFertile ? '💖 Highly Fertile Today' : '🍃 Low Fertility Today'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}