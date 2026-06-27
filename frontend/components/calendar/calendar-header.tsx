'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export default function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: Props) {
  const monthYearString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm px-4 py-2 rounded-2xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevMonth}
        className="h-8 w-8 rounded-lg hover:bg-pink-50 text-pink-500 hover:text-pink-600 active:scale-95 transition-transform"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-base font-bold text-gray-800 min-w-[120px] text-center font-jakarta">
        {monthYearString}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        className="h-8 w-8 rounded-lg hover:bg-pink-50 text-pink-500 hover:text-pink-600 active:scale-95 transition-transform"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}