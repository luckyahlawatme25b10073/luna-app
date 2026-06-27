import SettingsForm from '@/components/settings/settings-form';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
      <h1 className="text-2xl font-bold text-foreground/90 mb-4">Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Manage your preferences and data. Changes are saved instantly.
      </p>
      <SettingsForm />
    </div>
  );
}