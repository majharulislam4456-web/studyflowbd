import { FESTIVAL_THEMES } from '@/lib/festivalThemes';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from '@/hooks/use-toast';

export function ThemeControlPanel() {
  const { settings, update } = useAppSettings();

  const handleSelect = async (id: string) => {
    try {
      await update({ active_theme: id });
      toast({ title: 'থিম পরিবর্তন হয়েছে', description: 'সব ব্যবহারকারীর কাছে এখন এই থিম দেখাবে।' });
    } catch (e: any) {
      toast({ title: 'সমস্যা', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-bold font-bengali mb-1">🎨 ফেস্টিভাল থিম</h2>
      <p className="text-xs text-muted-foreground font-bengali mb-4">আপনি যে থিম বাছাই করবেন সেটাই সব ব্যবহারকারী দেখবে।</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {FESTIVAL_THEMES.map(t => {
          const active = settings?.active_theme === t.id;
          return (
            <button key={t.id} onClick={() => handleSelect(t.id)}
              className={cn(
                "relative rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.02]",
                active ? "border-primary bg-primary/10" : "border-border bg-muted/20"
              )}>
              <div className="text-3xl mb-2">{t.emoji}</div>
              <div className="font-bengali text-sm font-semibold">{t.name}</div>
              <div className="flex gap-1 mt-2">
                <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${t.primary})` }} />
                <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${t.accent})` }} />
              </div>
              {active && <Check className="absolute top-2 right-2 w-4 h-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}