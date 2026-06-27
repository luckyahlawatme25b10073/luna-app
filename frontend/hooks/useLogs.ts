'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Log } from '@/types';

export const useLogs = (days = 30) => {
  const today = new Date();
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - days);

  const fromStr = fromDate.toISOString();
  const toStr = today.toISOString();

  const { data: logs, isLoading } = useQuery<Log[]>({
    queryKey: ['logs', days],
    queryFn: async () => {
      try {
        const response = await apiFetch(`/logs?from=${encodeURIComponent(fromStr)}&to=${encodeURIComponent(toStr)}`);
        return response.logs || [];
      } catch (err) {
        console.error('Failed to fetch real logs from server:', err);
        return [];
      }
    },
    staleTime: 10 * 1000, // Cache fresh for 10 seconds
  });

  return { logs: logs || [], loading: isLoading };
};