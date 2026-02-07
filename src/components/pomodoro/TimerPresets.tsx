import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Zap, Flame, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimerPresetsProps {
  selectedDuration: number;
  onSelectDuration: (minutes: number) => void;
}

const presets = [
  { minutes: 25, icon: Timer, label: 'Classic', labelBn: 'ক্লাসিক', color: 'text-primary' },
  { minutes: 45, icon: Zap, label: 'Power', labelBn: 'পাওয়ার', color: 'text-accent' },
  { minutes: 60, icon: Flame, label: 'Beast', labelBn: 'বীস্ট', color: 'text-destructive' },
];

export function TimerPresets({ selectedDuration, onSelectDuration }: TimerPresetsProps) {
  const { language } = useLanguage();
  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomSubmit = () => {
    const mins = parseInt(customMinutes);
    if (mins >= 5 && mins <= 120) {
      onSelectDuration(mins);
      setShowCustom(false);
      setCustomMinutes('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex gap-2 justify-center flex-wrap">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedDuration === preset.minutes;
          return (
            <Button
              key={preset.minutes}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelectDuration(preset.minutes)}
              className={cn(
                "flex-col h-auto py-3 px-4 gap-1 transition-all duration-300",
                isSelected && "scale-105 shadow-lg",
                !isSelected && "hover:scale-102"
              )}
            >
              <Icon className={cn("w-5 h-5", !isSelected && preset.color)} />
              <span className="text-lg font-bold">{preset.minutes}</span>
              <span className="text-xs opacity-80">
                {language === 'bn' ? preset.labelBn : preset.label}
              </span>
            </Button>
          );
        })}
        
        {/* Custom button */}
        <Button
          variant={showCustom || !presets.some(p => p.minutes === selectedDuration) ? "default" : "outline"}
          onClick={() => setShowCustom(!showCustom)}
          className={cn(
            "flex-col h-auto py-3 px-4 gap-1 transition-all duration-300",
            (showCustom || !presets.some(p => p.minutes === selectedDuration)) && "scale-105 shadow-lg"
          )}
        >
          <Clock className="w-5 h-5" />
          <span className="text-lg font-bold">
            {!presets.some(p => p.minutes === selectedDuration) ? selectedDuration : '?'}
          </span>
          <span className="text-xs opacity-80">
            {language === 'bn' ? 'কাস্টম' : 'Custom'}
          </span>
        </Button>
      </div>

      {/* Custom input */}
      {showCustom && (
        <div className="flex gap-2 justify-center animate-fade-in">
          <Input
            type="number"
            min="5"
            max="120"
            placeholder={language === 'bn' ? '৫-১২০ মিনিট' : '5-120 mins'}
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            className="w-32 text-center"
          />
          <Button onClick={handleCustomSubmit} size="sm">
            {language === 'bn' ? 'সেট' : 'Set'}
          </Button>
        </div>
      )}
    </div>
  );
}
