'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Log } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { Calendar, Smile, ShieldAlert, Heart, BatteryCharging, Sparkles, MessageSquare, Scale, Moon } from 'lucide-react';

type Props = {
  initialData?: Log;
  isLoading: boolean;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
};

const flows = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Light' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Heavy' },
  { value: 4, label: 'Very Heavy' },
];

const moods = [
  { id: 'HAPPY', emoji: '😊', label: 'Happy' },
  { id: 'SAD', emoji: '😢', label: 'Sad' },
  { id: 'CALM', emoji: '😌', label: 'Calm' },
  { id: 'ANXIOUS', emoji: '😰', label: 'Anxious' },
  { id: 'ANGRY', emoji: '😤', label: 'Angry' },
  { id: 'TIRED', emoji: '😴', label: 'Tired' },
  { id: 'LOVED', emoji: '🥰', label: 'Loved' },
  { id: 'NEUTRAL', emoji: '😐', label: 'Neutral' },
];

const symptomOptions = [
  { id: 'cramps', label: 'Cramps' },
  { id: 'bloating', label: 'Bloating' },
  { id: 'headache', label: 'Headache' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'back_pain', label: 'Back Pain' },
  { id: 'breast_tenderness', label: 'Breast Tenderness' },
  { id: 'acne', label: 'Acne' },
  { id: 'mood_swings', label: 'Mood Swings' },
  { id: 'food_cravings', label: 'Food Cravings' },
  { id: 'insomnia', label: 'Insomnia' },
  { id: 'constipation', label: 'Constipation' },
  { id: 'spotting', label: 'Spotting' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

export default function LogForm({ initialData, isLoading, onSave, isSaving }: Props) {
  const [flow, setFlow] = useState<number | null>(0);
  const [mood, setMood] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [energy, setEnergy] = useState<number>(3);
  const [pain, setPain] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [sleep, setSleep] = useState<number>(7);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state with incoming initialData
  useEffect(() => {
    if (initialData) {
      setFlow(initialData.flow !== undefined ? initialData.flow : 0);
      setMood(initialData.mood || null);
      setSymptoms(initialData.symptoms || []);
      setEnergy(initialData.energy || 3);
      setPain(initialData.pain !== undefined && initialData.pain !== null ? initialData.pain : 0);
      setNotes(initialData.notes || '');
      setWeight(initialData.weight ? String(initialData.weight) : '');
      setSleep(initialData.sleep !== undefined && initialData.sleep !== null ? initialData.sleep : 7);
    } else {
      // Defaults
      setFlow(0);
      setMood(null);
      setSymptoms([]);
      setEnergy(3);
      setPain(0);
      setNotes('');
      setWeight('');
      setSleep(7);
    }
  }, [initialData]);

  // Handle textarea autosize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [notes]);

  const toggleSymptom = (id: string) => {
    setSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave({
        flow,
        mood,
        symptoms,
        energy,
        pain,
        notes,
        weight: weight ? parseFloat(weight) : null,
        sleep,
      });

      // Confetti trigger
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F472B6', '#EC4899', '#FB7185', '#FDA4AF'],
      });

      toast.success('✨ Log saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save log.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/70 border border-white/40 shadow-sm space-y-4">
            <Skeleton className="h-6 w-32 bg-pink-100" />
            <Skeleton className="h-10 w-full bg-pink-50" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 pb-24"
      >
        {/* 1. FLOW INTENSITY */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4"
        >
          <div className="flex items-center gap-2 text-[var(--pink-primary)] font-bold">
            <Calendar className="w-5 h-5" />
            <h2>FLOW INTENSITY</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {flows.map((item) => {
              const isSelected = flow === item.value;
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setFlow(item.value)}
                  className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-[0_4px_14px_rgba(244,63,94,0.4)] border-transparent scale-[1.03]'
                      : 'border border-pink-100 text-pink-700 bg-white/50 hover:bg-pink-50/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 2. MOOD SELECTOR */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4"
        >
          <div className="flex items-center gap-2 text-[var(--pink-primary)] font-bold">
            <Smile className="w-5 h-5" />
            <h2>MOOD SELECTOR</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {moods.map((item) => {
              const isSelected = mood === item.id;
              return (
                <motion.button
                  type="button"
                  key={item.id}
                  onClick={() => setMood(item.id)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                    isSelected
                      ? 'border-2 border-pink-400 bg-pink-50/80 shadow-md scale-[1.05]'
                      : 'border border-transparent bg-white/30 hover:bg-white/50'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow-sm">{item.emoji}</span>
                  <span className="text-xs font-semibold mt-2 text-pink-700">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* 3. SYMPTOMS */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4"
        >
          <div className="flex items-center gap-2 text-[var(--pink-primary)] font-bold">
            <ShieldAlert className="w-5 h-5" />
            <h2>SYMPTOMS</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {symptomOptions.map((item) => {
              const isSelected = symptoms.includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleSymptom(item.id)}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-sm scale-[1.02]'
                      : 'border border-pink-100 text-pink-700 bg-white/40 hover:bg-pink-50/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 4. ENERGY LEVEL */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between text-[var(--pink-primary)] font-bold">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-5 h-5" />
              <h2>ENERGY LEVEL</h2>
            </div>
            <span className="text-lg bg-pink-100/70 text-pink-700 px-3 py-1 rounded-full text-xs">
              ⚡ {energy} / 5
            </span>
          </div>
          <div className="pt-2">
            <input
              type="range"
              min="1"
              max="5"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--pink-primary) 0%, var(--pink-primary) ${
                  ((energy - 1) / 4) * 100
                }%, #fbcfe8 ${((energy - 1) / 4) * 100}%, #fbcfe8 100%)`,
              }}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-[var(--pink-primary)] focus:outline-none transition-all duration-200"
            />
            <div className="flex justify-between text-xs text-pink-600/70 mt-2 font-medium">
              <span>Very Low</span>
              <span>Average</span>
              <span>Super Energetic</span>
            </div>
          </div>
        </motion.div>

        {/* 5. PAIN LEVEL */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between text-[var(--pink-primary)] font-bold">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <h2>PAIN LEVEL</h2>
            </div>
            <span className="text-lg bg-pink-100/70 text-pink-700 px-3 py-1 rounded-full text-xs">
              💥 {pain} / 5
            </span>
          </div>
          <div className="pt-2">
            <input
              type="range"
              min="0"
              max="5"
              value={pain}
              onChange={(e) => setPain(parseInt(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--pink-primary) 0%, var(--pink-primary) ${
                  (pain / 5) * 100
                }%, #fbcfe8 ${(pain / 5) * 100}%, #fbcfe8 100%)`,
              }}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-[var(--pink-primary)] focus:outline-none transition-all duration-200"
            />
            <div className="flex justify-between text-xs text-pink-600/70 mt-2 font-medium">
              <span>No Pain</span>
              <span>Mild</span>
              <span>Severe</span>
            </div>
          </div>
        </motion.div>

        {/* 6. NOTES */}
        <motion.div
          variants={itemVariants}
          className="p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between text-[var(--pink-primary)] font-bold">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h2>NOTES</h2>
            </div>
            <span className="text-xs font-semibold text-pink-400">
              {notes.length} / 500
            </span>
          </div>
          <textarea
            ref={textareaRef}
            maxLength={500}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your day..."
            className="w-full p-4 rounded-xl border border-pink-100 bg-white/50 placeholder-pink-300/80 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none overflow-hidden transition-all duration-300"
          />
        </motion.div>

        {/* 7 & 8. WEIGHT & SLEEP */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WEIGHT */}
          <div className="p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-[var(--pink-primary)] font-bold">
              <Scale className="w-5 h-5" />
              <h2>WEIGHT</h2>
            </div>
            <div className="flex items-center">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 58.5"
                className="rounded-xl border-pink-100 bg-white/50 text-pink-900 focus:ring-2 focus:ring-pink-300"
              />
              <span className="ml-3 font-semibold text-pink-600">kg</span>
            </div>
          </div>

          {/* SLEEP */}
          <div className="p-6 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md shadow-lg space-y-4">
            <div className="flex items-center justify-between text-[var(--pink-primary)] font-bold">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                <h2>SLEEP</h2>
              </div>
              <span className="text-lg bg-pink-100/70 text-pink-700 px-3 py-1 rounded-full text-xs">
                💤 {sleep} hrs
              </span>
            </div>
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="12"
                value={sleep}
                onChange={(e) => setSleep(parseInt(e.target.value))}
                style={{
                  background: `linear-gradient(to right, var(--pink-primary) 0%, var(--pink-primary) ${
                    (sleep / 12) * 100
                  }%, #fbcfe8 ${(sleep / 12) * 100}%, #fbcfe8 100%)`,
                }}
                className="w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-[var(--pink-primary)] focus:outline-none transition-all duration-200"
              />
              <div className="flex justify-between text-xs text-pink-600/70 mt-2 font-medium">
                <span>0 hrs</span>
                <span>6 hrs</span>
                <span>12 hrs</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SAVE BUTTON */}
        <motion.div variants={itemVariants} className="pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full py-6 rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-500 shadow-[0_6px_20px_rgba(244,63,94,0.45)] hover:shadow-[0_8px_25px_rgba(244,63,94,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 border-none"
          >
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
            {isSaving ? 'Saving Log...' : 'Save Today\'s Log'}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}