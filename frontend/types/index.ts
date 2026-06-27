// frontend/types/index.ts
export type Message = {
  id: string;
  text: string;
  isUser: boolean;
  createdAt: Date;
};

export type Log = {
  id: string;
  userId: string;
  date: string; // ISO date string
  flow: number | null; // 0 to 4
  mood: string | null;
  symptoms: string[];
  energy: number; // 1 to 5
  pain: number; // 0 to 5
  weight?: number | null;
  sleep?: number | null;
  temperature?: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

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
  currentPhase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  daysUntilNextPeriod: number;
  daysUntilOvulation: number;
};