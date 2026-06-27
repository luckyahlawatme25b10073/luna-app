'use client';

import { useRouter } from 'next/navigation';
import { useUserData } from '@/hooks/useUserData';
import { CycleCalculator } from '@/lib/cycle-calculator';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { motion } from 'framer-motion';

type Props = {
  currentDate: Date;
  className?: string;
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ currentDate, className = '' }: Props) {
  const router = useRouter();
  const { data: userData } = useUserData();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Range of dates for logs query
  const startOfMonthDate = new Date(year, month, 1);
  const endOfMonthDate = new Date(year, month + 1, 0);

  // Fetch logs for current month range to show logging indicators
  const { data: rangeLogs } = useQuery({
    queryKey: ['logs-range', year, month],
    queryFn: () =>
      apiFetch(`/logs?from=${startOfMonthDate.toISOString()}&to=${endOfMonthDate.toISOString()}`)
        .then((res) => res.logs)
        .catch(() => []), // Fallback to empty array if unauthenticated/offline
    refetchOnWindowFocus: false,
  });

  // Fast set lookup for log existence: "YYYY-MM-DD"
  const logsLookup = new Set(
    (rangeLogs || []).map((log: any) => {
      const d = new Date(log.date);
      return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    })
  );

  const lastPeriodStart = userData?.lastPeriodStart
    ? new Date(userData.lastPeriodStart)
    : new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
  const cycleLength = userData?.cycleLength ?? 28;
  const periodLength = userData?.periodLength ?? 5;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const gridDays: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month's trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    gridDays.push({
      date: new Date(year, month - 1, prevMonthTotalDays - i),
      isCurrentMonth: false,
    });
  }

  // Current month's days
  for (let i = 1; i <= totalDays; i++) {
    gridDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Next month's leading days
  const remainingSlots = 42 - gridDays.length;
  for (let i = 1; i <= remainingSlots; i++) {
    gridDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const handleDayClick = (date: Date) => {
    // Navigate to log page with selected date query param formatted YYYY-MM-DD
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localIso = new Date(date.getTime() - tzOffset).toISOString().split('T')[0];
    router.push(`/log?date=${localIso}`);
  };

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  return (
    <div className={`p-6 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg ${className}`}>
      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-pink-400 tracking-wider font-jakarta uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 gap-2">
        {gridDays.map(({ date, isCurrentMonth }, idx) => {
          const isToday =
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();

          // Calculate cycle predictions using cycle calculator
          const cycleDay = CycleCalculator.getCycleDay(date, lastPeriodStart, cycleLength, periodLength);

          // Format lookup key in UTC (matching rangeLogs mapping)
          const searchKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const hasLog = logsLookup.has(searchKey);

          let dayStyle = 'bg-white/30 border-transparent text-gray-700 hover:bg-white/60';
          let borderStyle = 'border-transparent';

          if (cycleDay.isPeriod) {
            dayStyle = 'bg-rose-100/80 text-rose-700 border-rose-200/80 hover:bg-rose-200/60';
          } else if (cycleDay.isOvulation) {
            dayStyle = 'bg-emerald-100/80 text-emerald-700 border-emerald-200/80 hover:bg-emerald-200/60 font-bold';
          } else if (cycleDay.isFertile) {
            dayStyle = 'bg-pink-50/70 text-pink-600 border-pink-200/60 border-dashed hover:bg-pink-100/50';
          }

          if (isToday) {
            borderStyle = 'border-2 border-[var(--pink-primary)]/50 shadow-sm scale-[1.02] z-10';
          }

          return (
            <motion.button
              key={idx}
              onClick={() => handleDayClick(date)}
              whileHover={{ scale: isCurrentMonth ? 1.05 : 1 }}
              whileTap={{ scale: isCurrentMonth ? 0.95 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              disabled={!isCurrentMonth} // Only click days of current month for clean UI navigation
              className={`aspect-square flex flex-col items-center justify-between p-1.5 rounded-xl border text-sm font-semibold transition-all duration-200 relative ${dayStyle} ${borderStyle} ${
                !isCurrentMonth ? 'opacity-25 cursor-default hover:bg-white/30' : ''
              }`}
            >
              {/* Day Number */}
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs sm:text-sm font-bold ${
                isToday 
                  ? 'bg-[var(--pink-primary)] text-white shadow-sm ring-2 ring-[var(--pink-primary)]/20' 
                  : 'font-semibold'
              }`}>
                {date.getDate()}
              </span>

              {/* Status indicators */}
              <div className="flex items-center justify-center gap-1 h-2">
                {cycleDay.isOvulation && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Predicted Ovulation Day" />
                )}
                {hasLog && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--pink-secondary)]" title="Daily Log Saved" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-pink-100/60 text-xs text-gray-500 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-rose-100 border border-rose-200" />
          <span>Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-pink-50 border border-pink-200 border-dashed" />
          <span>Fertile Window</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-200" />
          <span>Predicted Ovulation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[var(--pink-primary)]" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--pink-secondary)]" />
          <span>Logged Day</span>
        </div>
      </div>
    </div>
  );
}