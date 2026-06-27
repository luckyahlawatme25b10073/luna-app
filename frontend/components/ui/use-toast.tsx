import React from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';

export const toast = sonnerToast;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-50">
      {children}
      <Toaster
        position="top-right"
        closeButton={false}
        duration={3000}
      />
    </div>
  );
}