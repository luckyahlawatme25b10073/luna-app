'use client';

import { useState, useEffect } from 'react';

type UserSettings = {
  theme: string;
  notifications: { reminders: boolean };
  lastPeriodStart?: string;
  cycleLength?: number;
  periodLength?: number;
  name?: string;
};

export const useSettings = () => {
  const [data, setData] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem('userSettings');
      if (saved) {
        setData(JSON.parse(saved));
      } else {
        // Default settings
        const defaults = {
          theme: 'light',
          notifications: { reminders: true }
        };
        setData(defaults);
        localStorage.setItem('userSettings', JSON.stringify(defaults));
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  // Function to update settings in localStorage
  const updateSettings = (newData: Partial<any>) => {
    setData(prev => {
      const updated = {
        theme: 'light',
        notifications: { reminders: true },
        ...(prev || {}),
        ...newData
      } as UserSettings;
      localStorage.setItem('userSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return { data, updateSettings, loading };
};