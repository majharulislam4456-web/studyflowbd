import { useAppSettings } from '@/hooks/useAppSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const FLAGS: { key: string; label: string }[] = [
  { key: 'quotes', label: 'অনুপ্রেরণা সেকশন' },
  { key: 'tips', label: 'টিপস ও রিসোর্স' },
  { key: 'ai', label: 'AI সহকারী' },
  { key: 'pomodoro', label: 'পোমোডোরো টাইমার' },
  { key: 'studyWithMe', label: 'Study With Me' },
];

export function FeatureFlagsPanel() {
  const { settings, update } = useAppSettings();
  if (!settings) return null;
  const features = settings.features || {};

  const toggle = async (key: string, val: boolean) => {
    try {
      await update({ features: { ...features, [key]: val } });
      toast({ title: 'সংরক্ষিত হয়েছে' });
    } catch (e: any) {
      toast({ title: 'সমস্যা', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-bold font-bengali mb-1">⚙️ ফিচার নিয়ন্ত্রণ</h2>
      <p className="text-xs text-muted-foreground font-bengali mb-4">সকল ব্যবহারকারীর জন্য চালু/বন্ধ করুন।</p>
      <div className="space-y-3">
        {FLAGS.map(f => (
          <div key={f.key} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <Label className="font-bengali">{f.label}</Label>
            <Switch checked={features[f.key] !== false} onCheckedChange={v => toggle(f.key, v)} />
          </div>
        ))}
      </div>
    </div>
  );
}