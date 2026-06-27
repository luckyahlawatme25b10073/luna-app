'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

const DEFAULT_PIN = '1234';

export default function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const { data: userData } = useUserData();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animation for the shaking effect on error
  const shakeAnimation = useAnimation();

  // Handle pin input change
  const handleDigitPress = (digit: string) => {
    if (pinInput.length < 4 && !loading) {
      setPinInput(prev => prev + digit);
      // Reset error when typing
      if (error) setError(false);
    }
  };

  const handleBackspace = () => {
    if (!loading && pinInput.length > 0) {
      setPinInput(prev => prev.slice(0, -1));
      // Reset error when typing
      if (error) setError(false);
    }
  };

  const handleSubmit = async () => {
    if (pinInput.length !== 4) return;
    setLoading(true);

    const correctPin = userData?.lovePin ?? DEFAULT_PIN;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (pinInput === correctPin) {
      setSuccess(true);
      // Trigger confetti
      // Note: We'll need to import confetti from 'canvas-confetti' or create a simple effect
      // For now, we'll use a simple timeout and then unlock
      setTimeout(() => {
        setLoading(false);
        onUnlock();
      }, 1500);
    } else {
      setError(true);
      // Shake animation
      if (typeof window !== 'undefined') {
        // We'll use a simple shake via state for now due to complexity of animation in SSR
        // In a real app, we'd use framer-motion or a CSS animation
        setTimeout(() => {
          setError(false); // Reset error after shake animation
        }, 500);
      }
      setLoading(false);
      setPinInput('');
    }
  };

  // Clear error when input changes
  useEffect(() => {
    if (error && pinInput.length > 0) {
      setError(false);
    }
  }, [pinInput]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] p-4"
    >
      {/* Animated bouncing heart */}
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mb-12"
      >
        <Heart className="h-12 w-12 text-[var(--pink-primary)] mb-4" />
        <motion.h1
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-2xl font-bold text-foreground/90"
        >
          Our Little Secret
        </motion.h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your PIN to unlock 💕
        </p>
      </motion.div>

      {/* PIN Input Dots */}
      <div className="flex space-x-2 mb-6">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8 }}
            animate={{ scale: pinInput.length > index ? 1 : 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-6 h-6 flex items-center justify-center"
          >
            <div
              className={`w-4 h-4 rounded-full ${
                pinInput.length > index
                  ? 'bg-[var(--pink-primary)]'
                  : 'bg-[var(--pink-primary)]/20'
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 text-sm text-red-500 animate-pulse">
          Incorrect PIN. Try again.
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-8 w-8 rounded-full bg-[var(--pink-primary)]/20 flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-sm text-foreground/80">Access granted! Unlocking...</p>
        </div>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <motion.button
            key={num}
            onClick={() => handleDigitPress(String(num))}
            disabled={loading}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-[var(--glass-border)] ${loading ? 'opacity-50' : ''} hover:shadow-md`}
          >
            <span className="text-lg font-semibold text-foreground">{num}</span>
          </motion.button>
        ))}
        <motion.button
          onClick={handleBackspace}
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-[var(--glass-border)] ${loading ? 'opacity-50' : ''} hover:shadow-md"
        >
          <span className="text-lg font-semibold text-foreground">←</span>
        </motion.button>
        <motion.button
          key={0}
          onClick={() => handleDigitPress('0')}
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-[var(--glass-border)] ${loading ? 'opacity-50' : ''} hover:shadow-md`}
        >
          <span className="text-lg font-semibold text-foreground">0</span>
        </motion.button>
        <motion.button
          onClick={handleSubmit}
          disabled={loading || pinInput.length < 4}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--pink-primary)] to-[var(--pink-secondary)] text-white ${loading ? 'opacity-50' : ''} hover:opacity-90`}
        >
          OK
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-6 flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-[var(--pink-primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-foreground/80">Verifying...</span>
        </div>
      )}
    </motion.div>
  );
}