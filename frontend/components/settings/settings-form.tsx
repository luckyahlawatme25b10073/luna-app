'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useUserData } from '@/hooks/useUserData';
import { useSettings } from '@/hooks/useSettings';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, ShieldCheck, Trash2, ArrowUpDown, Zap, LogOut } from 'lucide-react';

export default function SettingsForm() {
  const { data: userData, updateUserData: updateUserDataLocal, loading: userLoading } = useUserData();
  const { data: settingsData, updateSettings: updateSettingsDataLocal, loading: settingsLoading } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Helper: convert ISO timestamp → YYYY-MM-DD without timezone shift
  const toDateInputValue = (val: string | null | undefined): string => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Initialize form state from the hooks
  const [formState, setFormState] = useState<any>(() => {
    if (!userData || !settingsData) return {};
    return {
      // User data
      name: userData.name ?? '',
      cycleLength: userData.cycleLength ?? 28,
      periodLength: userData.periodLength ?? 5,
      lastPeriodStart: toDateInputValue(userData.lastPeriodStart),
      anniversary: toDateInputValue(userData.anniversary),
      lovePin: userData.lovePin ?? '',
      // Settings data
      theme: settingsData.theme ?? 'light',
      notificationsReminder: (settingsData.notifications || {}).reminders ?? true
    };
  });

  // Watch userData changes independently — always repopulate period date & profile
  useEffect(() => {
    if (userData) {
      setFormState((prev: any) => ({
        ...prev,
        name: userData.name ?? '',
        cycleLength: userData.cycleLength ?? 28,
        periodLength: userData.periodLength ?? 5,
        lastPeriodStart: toDateInputValue(userData.lastPeriodStart),
        anniversary: toDateInputValue(userData.anniversary),
        lovePin: userData.lovePin ?? '',
      }));
    }
  }, [userData]);

  // Watch settingsData changes independently
  useEffect(() => {
    if (settingsData) {
      setFormState((prev: any) => ({
        ...prev,
        theme: settingsData.theme ?? 'light',
        notificationsReminder: (settingsData.notifications || {}).reminders ?? true,
      }));
    }
  }, [settingsData]);

  // Function to save user data to localStorage and backend
  const handleUserDataChange = async (field: string, value: any) => {
    // Update local state immediately for responsive UI
    setFormState((prev: any) => ({ ...prev, [field]: value }));

    // Optimistically update localStorage for userData
    updateUserDataLocal({
      [field]: value === '' ? null : value
    });

    // Update backend and sync cache with actual server response
    try {
      const res = await apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          [field]: value === '' ? null : value
        })
      });

      // Sync React Query cache & localStorage with exact server-returned values
      if (res?.user) {
        updateUserDataLocal(res.user);
        // Update date fields in form to reflect server-parsed values (avoids drift)
        setFormState((prev: any) => ({
          ...prev,
          lastPeriodStart: toDateInputValue(res.user.lastPeriodStart),
          anniversary: toDateInputValue(res.user.anniversary),
        }));
      }

      toast.success('Saved!');
    } catch (err) {
      console.error('Error updating user data:', err);
      toast.error('Failed to save settings');
    }
  };

  // Function to save settings data to localStorage and backend
  const handleSettingsDataChange = async (field: string, value: any) => {
    // Update local state
    setFormState((prev: any) => ({ ...prev, [field]: value }));

    // Prepare the update object for localStorage and backend
    let updateObj: any = {};
    if (field === 'notificationsReminder') {
      updateObj.notifications = {
        ...(settingsData?.notifications || {}),
        reminders: value
      };
    } else {
      updateObj[field] = value;
    }

    // Update localStorage for settingsData
    updateSettingsDataLocal(updateObj);

    // Update backend
    try {
      await apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify(updateObj)
      });

      toast.success('Settings saved');
    } catch (err) {
      console.error('Error updating settings data:', err);
      toast.error('Failed to save settings');
    }
  };

  // Handle submit for the entire form (we don't have a submit button because we save on change, but we keep it for consistency)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // We are saving on change, so this is just a fallback
    setIsLoading(true);
    try {
      // We would send the entire form state to both endpoints, but we are already doing it on change.
      // So we just show a success toast.
      toast.success('All settings saved');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Data management functions
  const handleExportData = () => {
    // Combine userData and settingsData for export
    const loveReasons = localStorage.getItem('loveReasons');
    const loveOccasions = localStorage.getItem('loveOccasions');
    const loveCompliments = localStorage.getItem('loveCompliments');
    const loveFlowers = localStorage.getItem('loveFlowers');

    const dataToExport = {
      user: userData,
      settings: settingsData,
      // We can also include love data if we want, but it's stored separately in localStorage
      love: {
        reasons: loveReasons ? JSON.parse(loveReasons) : [],
        occasions: loveOccasions ? JSON.parse(loveOccasions) : {},
        compliments: loveCompliments ? JSON.parse(loveCompliments) : [],
        flowers: loveFlowers ? JSON.parse(loveFlowers) : []
      }
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'luna-data.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') return;
        const data = JSON.parse(result);
        // Validate data structure
        if (data.user && data.settings) {
          // Update userData
          updateUserDataLocal(data.user);
          // Update settingsData
          updateSettingsDataLocal(data.settings);
          // Update love data if present
          if (data.love) {
            if (data.love.reasons) localStorage.setItem('loveReasons', JSON.stringify(data.love.reasons));
            if (data.love.occasions) localStorage.setItem('loveOccasions', JSON.stringify(data.love.occasions));
            if (data.love.compliments) localStorage.setItem('loveCompliments', JSON.stringify(data.love.compliments));
            if (data.love.flowers) localStorage.setItem('loveFlowers', JSON.stringify(data.love.flowers));
          }
          // Reload to reflect changes
          window.location.reload();
        } else {
          throw new Error('Invalid data format');
        }
        toast.success('Data imported successfully');
      } catch (err) {
        console.error('Error importing data:', err);
        toast.error('Failed to import data: invalid file');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      // Always clear all local storage keys and redirect
      localStorage.removeItem('userData');
      localStorage.removeItem('userSettings');
      window.location.href = '/login';
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      // Clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('userSettings');
      localStorage.removeItem('loveReasons');
      localStorage.removeItem('loveOccasions');
      localStorage.removeItem('loveCompliments');
      localStorage.removeItem('loveFlowers');
      // Reload to reset state
      window.location.reload();
      toast.success('All data cleared');
    }
  };

  if (userLoading || settingsLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex space-x-4">
          <div className="h-4 w-4 border-2 border-[var(--pink-primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--pink-primary)]">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Personal Section */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground/90">Personal</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              value={formState.name || ''}
              onChange={(e) => handleUserDataChange('name', e.target.value)}
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lovePin">Partner PIN (4 Digits)</Label>
            <Input
              id="lovePin"
              type="text"
              maxLength={4}
              value={formState.lovePin || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ''); // keep only numbers
                if (val.length <= 4) {
                  handleUserDataChange('lovePin', val);
                }
              }}
              placeholder="1234"
              disabled={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Cycle Settings Section */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground/90">Cycle Settings</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
            <Input
              id="cycleLength"
              type="number"
              value={formState.cycleLength}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 21 && val <= 45) {
                  handleUserDataChange('cycleLength', val);
                }
              }}
              min={21}
              max={45}
              placeholder="28"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Typical range: 21-45 days
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodLength">Period Duration (days)</Label>
            <Input
              id="periodLength"
              type="number"
              value={formState.periodLength}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 2 && val <= 10) {
                  handleUserDataChange('periodLength', val);
                }
              }}
              min={2}
              max={10}
              placeholder="5"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Typical range: 2-10 days
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastPeriodStart">Last Period Start</Label>
            <Input
              id="lastPeriodStart"
              type="date"
              value={formState.lastPeriodStart || ''}
              onChange={(e) => handleUserDataChange('lastPeriodStart', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="anniversary">Anniversary Date</Label>
            <Input
              id="anniversary"
              type="date"
              value={formState.anniversary || ''}
              onChange={(e) => handleUserDataChange('anniversary', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      </section>


      {/* Data Management Section */}
      <section className="space-y-4">
        <h3 className="font-semibold text-foreground/90">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleExportData}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-[var(--glass-border)] hover:shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" /> Export Data
            </button>
            <input
              type="file"
              accept=".json"
              id="importFile"
              className="hidden"
              onChange={handleImportData}
              disabled={isLoading}
            />
            <label
              htmlFor="importFile"
              className="flex-1 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-[var(--glass-border)] hover:shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" /> Import Data
            </label>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-[var(--glass-border)] hover:shadow-md transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <LogOut className="h-4 w-4 text-[var(--pink-primary)]" /> Log Out
          </button>
          <button
            type="button"
            onClick={handleClearData}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Trash2 className="h-4 w-4" /> Clear All Data
          </button>
        </div>
      </section>

      {/* Submit Button (optional, since we save on change) */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      {/* Confirmation Modal for Clearing Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-semibold text-foreground/90 mb-4">Clear All Data</h3>
            <p className="text-sm text-foreground/80 mb-6">
              Are you sure you want to delete all your data? This includes your cycle logs, settings, and love section data. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowClearConfirm(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearData}
                variant="destructive"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}