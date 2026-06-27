'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, List, Smartphone, Sun, Trophy, User, Bell, Lock, ChevronDown } from 'lucide-react';
import { format, differenceInDays, startOfToday, startOfDay, addDays } from 'date-fns';

// Default data for love content
const DEFAULT_REASONS = [
  "Your smile lights up my darkest days",
  "The way you laugh at my silly jokes",
  "How you always know how to make me feel better",
  "Your kindness towards everyone you meet",
  "The way you look at me when you think I'm not watching",
  "Your incredible strength and resilience",
  "How you inspire me to be a better person every day",
  "Your passion for the things you love",
  "The way you hold my hand when we walk together",
  "Everything about you - you're perfect to me"
];

const DEFAULT_OCCASIONS = {
  sad: "When you're sad, remember that I'm here to hold you tight and remind you how amazing you are. Your tears are temporary, but our love is forever.",
  exhausted: "When you're exhausted, take a deep breath and know that I've got you. Rest now, my love - I'll take care of everything.",
  confidence: "When you need confidence, look in the mirror and see what I see: a beautiful, strong, capable woman who can conquer anything.",
  miss: "When you miss me, just close your eyes and feel my love wrapping around you like a warm hug. Distance means nothing when someone means everything.",
  doubt: "When you doubt yourself, remember all the things you've overcome. You are stronger than you know, and I believe in you more than you believe in yourself."
};

const DEFAULT_COMPLIMENTS = [
  "You have the most beautiful smile I've ever seen",
  "Your eyes sparkle like stars in the night sky",
  "You have an incredible sense of style",
  "Your laugh is contagious and makes my day brighter",
  "You're incredibly intelligent and insightful",
  "You have a heart of gold and touch everyone you meet",
  "Your voice is like music to my ears",
  "You're incredibly talented and creative",
  "You have amazing posture and carry yourself with grace",
  "Your skin has a natural glow that radiates health",
  "You have the most kissable lips",
  "Your hair is absolutely stunning today",
  "You have a wonderful sense of humor",
  "You're incredibly thoughtful and considerate",
  "Your hands are so soft and gentle",
  "You have an amazing ability to make people feel comfortable",
  "You're incredibly organized and efficient",
  "Your posture shows confidence and strength",
  "You have a beautiful neck and collarbone",
  "You're incredibly empathetic and understanding",
  "Your feet are adorable (I know it's weird, but I love them)",
  "You have a wonderful voice for singing",
  "You're incredibly disciplined and focused",
  "Your back has a beautiful shape when you move",
  "You're incredibly adventurous and open to new experiences",
  "You have a peaceful presence that calms everyone around you",
  "You're incredibly loyal and trustworthy",
  "Your shoulders are strong and capable",
  "You're incredibly supportive and encouraging",
  "You have a wonderful way with words",
  "You're incredibly patient and understanding",
  "Your knees are strong and allow you to move with grace",
  "You're incredibly romantic and passionate"
];

const DEFAULT_FLOWERS = ['🌸', '🌺', '🌻', '🌹', '🌷', '🪷', '💐', '🌼'];

export default function LoveContent({ onLock }: { onLock: () => void }) {
  const [reasons, setReasons] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<Record<string, string>>({});
  const [compliments, setCompliments] = useState<string[]>([]);
  const [flowers, setFlowers] = useState<string[]>([]);
  const [currentCompliment, setCurrentCompliment] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState<Date | null>(null);
  const [loveLetter, setLoveLetter] = useState<string>('');

  // Initialize localStorage defaults
  useEffect(() => {
    if (!localStorage.getItem('loveReasons')) {
      localStorage.setItem('loveReasons', JSON.stringify(DEFAULT_REASONS));
    }
    if (!localStorage.getItem('loveOccasions')) {
      localStorage.setItem('loveOccasions', JSON.stringify(DEFAULT_OCCASIONS));
    }
    if (!localStorage.getItem('loveCompliments')) {
      localStorage.setItem('loveCompliments', JSON.stringify(DEFAULT_COMPLIMENTS));
    }
    if (!localStorage.getItem('loveFlowers')) {
      localStorage.setItem('loveFlowers', JSON.stringify(DEFAULT_FLOWERS));
    }
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const storedReasons = localStorage.getItem('loveReasons');
    if (storedReasons) setReasons(JSON.parse(storedReasons));

    const storedOccasions = localStorage.getItem('loveOccasions');
    if (storedOccasions) setOccasions(JSON.parse(storedOccasions));

    const storedCompliments = localStorage.getItem('loveCompliments');
    if (storedCompliments) setCompliments(JSON.parse(storedCompliments));

    const storedFlowers = localStorage.getItem('loveFlowers');
    if (storedFlowers) setFlowers(JSON.parse(storedFlowers));
  }, []);

  // Calculate daily compliment based on day of year
  useEffect(() => {
    if (compliments.length === 0) return;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
    const index = dayOfYear % compliments.length;
    setCurrentCompliment(compliments[index]);
  }, [compliments]);

  // Format anniversary date for display
  const formatAnniversary = (date: Date | null) => {
    if (!date) return 'Not set';
    return format(date, 'MMM d, yyyy');
  };

  // Calculate days together
  const calculateDaysTogether = (date: Date | null) => {
    if (!date) return 0;
    const today = startOfToday();
    const start = startOfDay(date);
    return differenceInDays(today, start);
  };

  // Format years and days
  const formatDuration = (days: number) => {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    return { years, remainingDays };
  };

  // Get today's date for comparison
  const today = startOfToday();

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Header with lock button */}
      <div className="flex w-full items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-[var(--glass-border)]">
        <h1 className="text-xl font-bold text-foreground/90">Our Love Space</h1>
        <button
          onClick={onLock}
          className="p-2 rounded-full hover:bg-[var(--pink-primary)]/20 transition-colors"
          aria-label="Lock and return to PIN"
        >
          <Lock className="h-5 w-5 text-[var(--pink-primary)]" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative h-64 bg-gradient-to-b from-[var(--pink-primary)] to-[var(--pink-secondary)] rounded-xl p-6">
            {/* Floating hearts animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                    opacity: `${Math.random() * 0.5 + 0.2}`
                  }}
                >
                  ❤️
                </div>
              ))}
            </div>
            <div className="relative z-10 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">Just For You, My Love 🌙</h2>
              <p className="text-lg">Every moment with you is a treasure I hold close to my heart.</p>
            </div>
          </div>
        </motion.div>

        {/* Anniversary Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[var(--glass-border)]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground/90 mb-2">Our Journey Together</h3>
                <p className="text-2xl font-bold text-[var(--pink-primary)]">
                  {calculateDaysTogether(anniversaryDate)} days
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatAnniversary(anniversaryDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {`${formatDuration(calculateDaysTogether(anniversaryDate)).years} years and ${formatDuration(calculateDaysTogether(anniversaryDate)).remainingDays} days of being the luckiest`}
                </p>
              </div>
              <div className="text-center">
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20">
                  <Calendar className="h-4 w-4 text-[var(--pink-primary)]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Compliment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[var(--glass-border)]">
            <h3 className="font-semibold text-foreground/90 mb-4">Today's Compliment Just For You</h3>
            <div className="text-center">
              <p className="text-2xl font-italic text-[var(--green-accent)] mb-4">
                "{currentCompliment}"
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {flowers.map((flower, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-3xl"
                  >
                    {flower}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Love Letter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground/90">A Letter For You 💌</h3>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full flex items-center justify-center bg-[var(--pink-primary)]/20">
                  <Heart className="h-3 w-3" />
                </div>
                <span className="text-xs text-[var(--pink-primary)]">Editable in Settings</span>
              </div>
            </div>
            <div className="bg-white/90 rounded-xl p-4 border border-[var(--pink-primary)]/20">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {loveLetter}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reasons I Love You */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[var(--glass-border)]">
            <h3 className="font-semibold text-foreground/90 mb-6">10 Reasons I Love You</h3>
            <div className="space-y-4">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.05 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pink-primary)]/20 mb-0.5">
                    <span className="text-[var(--pink-primary)] font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{reason}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Open When... Letters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[var(--glass-border)]">
            <h3 className="font-semibold text-foreground/90 mb-6">Open When... Letters</h3>
            <div className="space-y-4">
              {Object.entries(occasions).map(([key, message]) => (
                <motion.div
                  key={key}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: Object.keys(occasions).indexOf(key) * 0.05 }}
                  className="border border-[var(--glass-border)] rounded-xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-[var(--pink-primary)]/20 cursor-pointer">
                    <span className="font-medium text-foreground/90">
                      Open When You {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <ChevronDown className="h-4 w-4 text-[var(--pink-primary)] transition-transform duration-200" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="pb-4 transition-all duration-300 ease-in-out"
                         style={{ height: 'auto' }}>
                      <div className="px-4 py-3">
                        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Virtual Flower Garden */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[var(--glass-border)] text-center">
            <h3 className="font-semibold text-foreground/90 mb-4">Virtual Flower Garden</h3>
            <p className="text-sm text-foreground/80 mb-6">Every flower is a thank you for being you</p>
            <div className="flex flex-wrap justify-center gap-4">
              {flowers.map((flower, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="inline-block"
                >
                  <div className="text-5xl">{flower}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}