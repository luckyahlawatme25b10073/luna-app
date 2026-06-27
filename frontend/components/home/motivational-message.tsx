'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sparkles } from 'lucide-react';

const messages = [
  "Your cycle is a reflection of your incredible strength and resilience.",
  "Every phase of your cycle brings its own unique wisdom and power.",
  "You are beautifully designed, exactly as you are, in every phase.",
  "Your body knows exactly what to do - trust its wisdom.",
  "Self-care during your cycle isn't selfish, it's essential.",
  "You deserve rest, nourishment, and kindness, especially during your cycle.",
  "Your sensitivity is a superpower that connects you to your intuition.",
  "Honoring your cycle is an act of self-love and rebellion.",
];

export default function MotivationalMessage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card p-8 text-center"
    >
      <div className="flex items-center justify-center mb-4">
        <Moon className="h-6 w-6 text-[var(--pink-primary)] mr-2" />
        <Sparkles className="h-6 w-6 text-[var(--pink-secondary)] ml-2" />
      </div>
      <p className="text-lg font-medium text-foreground/90">
        {messages[index]}
      </p>
    </motion.div>
  );
}