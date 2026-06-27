import { useEffect, useState } from 'react';
import { CycleCalculator } from '@/lib/cycle-calculator';
import { useUserData } from './useUserData';

export const useCycle = () => {
  const { data: userData, loading: userLoading } = useUserData();
  const [cycleData, setCycleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading || !userData) {
      return;
    }

    const lastPeriodStart = new Date(userData.lastPeriodStart || Date.now());
    const cycleLength = userData.cycleLength ?? 28;
    const periodLength = userData.periodLength ?? 5;

    const today = new Date();
    const cycleDay = CycleCalculator.getCycleDay(today, lastPeriodStart, cycleLength, periodLength);
    const prediction = CycleCalculator.predictCycle(lastPeriodStart, cycleLength, periodLength);

    setCycleData({
      ...cycleDay,
      ...prediction,
      daysUntilNextPeriod: prediction.daysUntilNextPeriod,
      daysUntilOvulation: prediction.daysUntilOvulation
    });
    setLoading(false);
  }, [userData, userLoading]);

  return { data: cycleData, loading };
};