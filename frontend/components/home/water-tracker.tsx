'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GlassWater, Plus, RotateCcw } from 'lucide-react';

export default function WaterTracker() {
  const [glasses, setGlasses] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load saved value from localStorage after hydration to avoid mismatch
  useEffect(() => {
    const saved = localStorage.getItem('waterGlasses');
    if (saved) {
      setGlasses(parseInt(saved, 10));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('waterGlasses', glasses.toString());
    }
  }, [glasses, mounted]);

  const addGlass = () => {
    setGlasses(prev => Math.min(prev + 1, 8));
  };

  const resetTracker = () => {
    setGlasses(0);
  };

  const progressPercent = (glasses / 8) * 100;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100/50 text-sky-500 border border-sky-200/50">
            <GlassWater className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground font-headings tracking-tight text-base">Water Tracker</h3>
            <p className="text-xs text-muted-foreground">Stay hydrated throughout your cycle</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {glasses > 0 && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: -90 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetTracker}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}
          <span className="text-sm font-bold text-sky-600 font-headings bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100/50">
            {glasses}/8 Glasses
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-6 border border-gray-200/20">
        <motion.div 
          className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Grid of Water Drops */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1 justify-between">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              onClick={() => setGlasses(i + 1)}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer flex-1 aspect-square max-w-[32px] rounded-lg border flex items-center justify-center transition-all duration-200"
              style={{
                backgroundColor: i < glasses ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                borderColor: i < glasses ? 'rgba(56, 189, 248, 0.4)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <span 
                className="text-lg transition-transform duration-300 select-none"
                style={{
                  filter: i < glasses ? 'grayscale(0) drop-shadow(0 2px 4px rgba(56, 189, 248, 0.4))' : 'grayscale(1) opacity(0.35)'
                }}
              >
                💧
              </span>
            </motion.div>
          ))}
        </div>

        {/* Plus Quick Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addGlass}
          disabled={glasses >= 8}
          className="ml-3 p-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md shadow-sky-400/20 disabled:opacity-50 disabled:pointer-events-none hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}