'use client';

import { useState } from 'react';
import CalendarHeader from '@/components/calendar/calendar-header';
import CalendarGrid from '@/components/calendar/calendar-grid';
import PredictionPanel from '@/components/calendar/prediction-panel';
import CycleStats from '@/components/calendar/cycle-stats';
import { motion } from 'framer-motion';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-1 py-4 md:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-800 font-jakarta">
            Cycle Calendar 🌙
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your cycle history and future predictions</p>
        </div>
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarGrid currentDate={currentDate} />
        </div>
        <div className="space-y-6">
          <PredictionPanel />
          <CycleStats />
        </div>
      </div>
    </div>
  );
}