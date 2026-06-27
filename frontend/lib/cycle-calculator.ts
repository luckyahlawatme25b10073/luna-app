// src/lib/cycle-calculator.ts
import { subDays, addDays, startOfDay, endOfDay, differenceInDays } from 'date-fns';

export type CycleDay = {
  date: Date;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  dayInCycle: number;
  isFertile: boolean;
  isOvulation: boolean;
  isPeriod: boolean;
};

export type CyclePrediction = {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  ovulationDate: Date;
  currentPhase: CycleDay['phase'];
  daysUntilNextPeriod: number;
  daysUntilOvulation: number;
};

export class CycleCalculator {
  /**
   * Calculate cycle details for a given date based on last period start and average cycle length
   */
  static getCycleDay(
    date: Date,
    lastPeriodStart: Date,
    cycleLength: number = 28,
    periodLength: number = 5
  ): CycleDay {
    const startOfCycle = startOfDay(lastPeriodStart);
    const targetDay = startOfDay(date);
    const daysSinceLastPeriod = differenceInDays(targetDay, startOfCycle);

    // Handle dates before last period (shouldn't happen in practice, but handle gracefully)
    const dayInCycle = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength;
    const dayNumber = dayInCycle + 1; // 1-indexed day of cycle

    let phase: CycleDay['phase'];
    let isFertile = false;
    let isOvulation = false;
    let isPeriod = false;

    // Menstrual phase (period)
    if (dayNumber <= periodLength) {
      phase = 'menstrual';
      isPeriod = true;
    }
    // Follicular phase (after period until ovulation)
    else if (dayNumber < 14) { // Assuming ovulation around day 14
      phase = 'follicular';
    }
    // Ovulatory phase (ovulation day)
    else if (dayNumber === 14) {
      phase = 'ovulatory';
      isOvulation = true;
      isFertile = true;
    }
    // Luteal phase (after ovulation until next period)
    else {
      phase = 'luteal';
    }

    // Fertile window: 5 days before ovulation through ovulation day
    if (dayNumber >= 9 && dayNumber <= 14) {
      isFertile = true;
    }

    return {
      date: targetDay,
      phase,
      dayInCycle: dayNumber,
      isFertile,
      isOvulation,
      isPeriod
    };
  }

  /**
   * Predict next period, fertile window, and ovulation based on last period and cycle length
   */
  static predictCycle(
    lastPeriodStart: Date,
    cycleLength: number = 28,
    periodLength: number = 5
  ): CyclePrediction {
    const start = startOfDay(lastPeriodStart);

    // Next period starts after one full cycle
    const nextPeriodStart = addDays(start, cycleLength);
    const nextPeriodEnd = addDays(nextPeriodStart, periodLength - 1);

    // Ovulation typically occurs mid-cycle
    const ovulationDate = addDays(start, 14); // Simplified - day 14 of cycle

    // Fertile window: 5 days before ovulation through ovulation day
    const fertileWindowStart = subDays(ovulationDate, 5);
    const fertileWindowEnd = ovulationDate;

    // Current phase based on today
    const today = startOfDay(new Date());
    const currentDay = this.getCycleDay(today, lastPeriodStart, cycleLength, periodLength);

    // Days until next period
    const daysUntilNextPeriod = differenceInDays(nextPeriodStart, today);

    // Days until ovulation
    const daysUntilOvulation = differenceInDays(ovulationDate, today);

    return {
      nextPeriodStart,
      nextPeriodEnd,
      fertileWindowStart,
      fertileWindowEnd,
      ovulationDate,
      currentPhase: currentDay.phase,
      daysUntilNextPeriod: Math.max(0, daysUntilNextPeriod),
      daysUntilOvulation: Math.max(0, daysUntilOvulation)
    };
  }

  /**
   * Get phase-specific information
   */
  static getPhaseInfo(phase: CycleDay['phase']) {
    // This would import from phase-data, but to avoid circular deps we define simplified version here
    const phaseInfo: Record<CycleDay['phase'], {
      name: string;
      description: string;
      color: string;
    }> = {
      menstrual: {
        name: 'Menstrual',
        description: 'Your period - time for rest and reflection',
        color: '#F8BBD0'
      },
      follicular: {
        name: 'Follicular',
        description: 'Energy building - time for new beginnings',
        color: '#F48FB1'
      },
      ovulatory: {
        name: 'Ovulatory',
        description: 'Peak fertility and energy',
        color: '#A8C5A0'
      },
      luteal: {
        name: 'Luteal',
        description: 'Preparing for next cycle - focus on self-care',
        color: '#E91E63'
      }
    };

    return phaseInfo[phase];
  }
}