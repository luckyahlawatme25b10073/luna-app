'use client';

import { useState } from 'react';
import PinGate from '@/components/love/PinGate';
import LoveContent from '@/components/love/LoveContent';

export default function LovePage() {
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = () => {
    setUnlocked(true);
  };

  const handleLock = () => {
    setUnlocked(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {!unlocked ? (
        <PinGate onUnlock={handleUnlock} />
      ) : (
        <LoveContent onLock={handleLock} />
      )}
    </div>
  );
}