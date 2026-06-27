'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export const useUserData = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      try {
        const res = await apiFetch('/auth/me');
        const user = res?.user;
        if (user) {
          // Always write fresh server data to localStorage
          localStorage.setItem('userData', JSON.stringify(user));
          return user;
        }
      } catch (err) {
        console.warn('Failed to fetch user data from server, falling back to cache:', err);
      }

      // Local storage fallback (used when offline or during network errors)
      const saved = localStorage.getItem('userData');
      if (saved) {
        try {
          return JSON.parse(saved);
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
    keepPreviousData: true,
  });

  const updateUserData = (newData: Partial<any>) => {
    queryClient.setQueryData(['userData'], (prev: any) => {
      const updated = { ...(prev || {}), ...newData };
      localStorage.setItem('userData', JSON.stringify(updated));
      return updated;
    });
  };

  return { data: data ?? null, updateUserData, loading: isLoading };
};