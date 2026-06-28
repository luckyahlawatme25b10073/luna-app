'use client';

import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  profilePhoto?: string | null;
  cycleLength: number;
  periodLength: number;
  lastPeriodStart?: string | null;
  anniversary?: string | null;
  lovePin?: string | null;
  apiKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useUserData = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<User | null>({
    queryKey: ['userData'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/auth/me');
        const user = res?.user;
        if (user) {
          // Always write fresh server data to localStorage
          localStorage.setItem('userData', JSON.stringify(user));
          return user as User;
        }
      } catch (err) {
        console.warn('Failed to fetch user data from server, falling back to cache:', err);
      }

      // Local storage fallback (used when offline or during network errors)
      const saved = localStorage.getItem('userData');
      if (saved) {
        try {
          return JSON.parse(saved) as User;
        } catch {
          // ignore parsing error
        }
      }

      // Return null — don't return defaults which could overwrite real DB data
      return null;
    },
    // Always refetch on mount so login always loads fresh data from DB
    staleTime: 0,
    // Keep previous data while refetching so UI doesn't flash
    placeholderData: keepPreviousData,
  });

  const updateUserData = (newData: Partial<User>) => {
    queryClient.setQueryData<User | null>(['userData'], (prev) => {
      const updated = { ...(prev || {}), ...newData } as User;
      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  };

  return { data: (data ?? null) as User | null, updateUserData, loading: isLoading };
};