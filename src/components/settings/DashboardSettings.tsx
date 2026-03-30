import { useState, useEffect } from 'react';
import { Settings, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export interface Syllabus {
  id: string;
  name: string;
  name_bn: string | null;
  color: string;
}

export interface DashboardConfig {
  selectedSyllabusIds: string[];
  showWeeklyChart: boolean;
  showGoals: boolean;
  showDailyTasks: boolean;
  showQuotes: boolean;
  showTodos: boolean;
}

const DEFAULT_CONFIG: DashboardConfig = {
  selectedSyllabusIds: [], // empty means show all
  showWeeklyChart: true,
  showGoals: true,
  showDailyTasks: true,
  showQuotes: true,
  showTodos: true,
};

function loadConfig(): DashboardConfig {
  try {
    const saved = localStorage.getItem('dashboard_config');
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_CONFIG;
}

function saveConfig(config: DashboardConfig) {
  localStorage.setItem('dashboard_config', JSON.stringify(config));
}

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(loadConfig);

  const updateConfig = (updates: Partial<DashboardConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...updates };
      saveConfig(next);
      return next;
    });
  };

  return { config, updateConfig };
}

interface DashboardSettingsProps {
  syllabuses: Syllabus[];
  config: DashboardConfig;
  onUpdateConfig: (updates: Partial<DashboardConfig>) => void;
}

export function DashboardSettings({ syllabuses, config, onUpdateConfig }: DashboardSettingsProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const selectAll = () => {
    onUpdateConfig({ selectedSyllabusIds: [] });
  };

  const selectSyllabus = (id: string) => {
    onUpdateConfig({ selectedSyllabusIds: [id] });
  };

  const isSyllabusSelected = (id: string) => {
    return config.selectedSyllabusIds.length === 1 && config.selectedSyllabusIds[0] === id;
  };

  const isAllSelected = config.selectedSyllabusIds.length === 0;

  const sections = [
    { key: 'showWeeklyChart' as const, label: language === 'bn' ? 'সাপ্তাহিক চার্ট' : 'Weekly Chart' },
    { key: 'showGoals' as const, label: language === 'bn' ? 'লক্ষ্য' : 'Goals' },
    { key: 'showDailyTasks' as const, label: language === 'bn' ? 'দৈনিক কাজ' : 'Daily Tasks' },
    { key: 'showQuotes' as const, label: language === 'bn' ? 'অনুপ্রেরণা' : 'Quotes' },
    { key: 'showTodos' as const, label: language === 'bn' ? 'টু-ডু লিস্ট' : 'Todo List' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bengali flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {language === 'bn' ? 'ড্যাশবোর্ড কাস্টমাইজ' : 'Customize Dashboard'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Syllabus selection */}
          {syllabuses.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground font-bengali">
                {language === 'bn' ? '📚 কোন বিষয়ের অগ্রগতি দেখাবে' : '📚 Show progress from'}
              </h3>
              <div className="space-y-2">
                {/* All subjects option - always present */}
                <button
                  onClick={selectAll}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border transition-all",
                    isAllSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30 opacity-60"
                  )}
                >
                  <div className="w-4 h-4 rounded-full flex-shrink-0 bg-primary" />
                  <span className="flex-1 text-left text-sm font-medium font-bengali">
                    {language === 'bn' ? 'সব বিষয়' : 'All Subjects'}
                  </span>
                  {isAllSelected && <Check className="w-4 h-4 text-primary" />}
                </button>
                {/* Individual syllabuses */}
                {syllabuses.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectSyllabus(s.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border transition-all",
                      isSyllabusSelected(s.id)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/30 opacity-60"
                    )}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="flex-1 text-left text-sm font-medium">
                      {language === 'bn' && s.name_bn ? s.name_bn : s.name}
                    </span>
                    {isSyllabusSelected(s.id) && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section toggles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground font-bengali">
              {language === 'bn' ? '🎨 কোন সেকশন দেখাবে' : '🎨 Visible sections'}
            </h3>
            <div className="space-y-3">
              {sections.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="font-bengali">{label}</Label>
                  <Switch
                    checked={config[key]}
                    onCheckedChange={(val) => onUpdateConfig({ [key]: val })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
