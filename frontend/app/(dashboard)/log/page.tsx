'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import LogForm from '@/components/log/log-form';
import { toast } from 'sonner';

export default function LogPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const queryClient = useQueryClient();

  const today = new Date();
  const dateObj = dateParam ? new Date(dateParam) : today;
  // Normalize date to UTC midnight for consistent daily storage
  const normalizedDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  const dateIsoString = normalizedDate.toISOString();

  // Fetch log for the selected date
  const { data: log, isLoading } = useQuery({
    queryKey: ['log', dateIsoString],
    queryFn: () =>
      apiFetch(`/logs/${encodeURIComponent(dateIsoString)}`)
        .then((res) => res.log)
        .catch((err) => {
          if (err.message?.includes('Log not found')) {
            return null; // Return null if no log exists for this date yet
          }
          throw err;
        }),
  });

  // Mutate log (PUT) with optimistic updates
  const saveMutation = useMutation({
    mutationFn: (newData: any) =>
      apiFetch(`/logs/${encodeURIComponent(dateIsoString)}`, {
        method: 'PUT',
        body: JSON.stringify(newData),
      }).then((res) => res.log),
    onMutate: async (newLogData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['log', dateIsoString] });

      // Snapshot previous value
      const previousLog = queryClient.getQueryData(['log', dateIsoString]);

      // Optimistically update
      queryClient.setQueryData(['log', dateIsoString], {
        ...(previousLog as any),
        ...newLogData,
        id: (previousLog as any)?.id || 'temp-id',
        userId: (previousLog as any)?.userId || 'user-id',
        createdAt: (previousLog as any)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return { previousLog };
    },
    onError: (err, newLogData, context) => {
      // Rollback to snapshotted state
      queryClient.setQueryData(['log', dateIsoString], context?.previousLog);
      toast.error('Failed to save log. Please try again.');
    },
    onSuccess: (savedLog) => {
      queryClient.setQueryData(['log', dateIsoString], savedLog);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['log', dateIsoString] });
    },
  });

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSave = async (formData: any) => {
    // Inject the normalized date into payload to pass backend Zod validation
    const payload = {
      ...formData,
      date: dateIsoString,
    };
    await saveMutation.mutateAsync(payload);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-1 py-4 md:py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--pink-primary)] tracking-tight">
            {formattedDate}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {log ? '✨ Editing existing log' : '✍️ Log your symptoms and wellness metrics'}
          </p>
        </div>
        {log && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 animate-pulse">
            Edit Mode
          </span>
        )}
      </div>

      <LogForm
        initialData={log || undefined}
        isLoading={isLoading}
        onSave={handleSave}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}