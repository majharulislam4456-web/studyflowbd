import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ThemeColorSelectorProps {
  currentColor: string;
  onSelect: (color: string) => void;
}

const themeColors = [
  { id: 'teal', name: 'Teal', namebn: 'টিল', hue: '168' },
  { id: 'blue', name: 'Blue', namebn: 'নীল', hue: '221' },
  { id: 'purple', name: 'Purple', namebn: 'বেগুনি', hue: '262' },
  { id: 'pink', name: 'Pink', namebn: 'গোলাপি', hue: '330' },
  { id: 'orange', name: 'Orange', namebn: 'কমলা', hue: '25' },
  { id: 'green', name: 'Green', namebn: 'সবুজ', hue: '142' },
  { id: 'red', name: 'Red', namebn: 'লাল', hue: '0' },
  { id: 'amber', name: 'Amber', namebn: 'অ্যাম্বার', hue: '45' },
];

export function ThemeColorSelector({ currentColor, onSelect }: ThemeColorSelectorProps) {
  const { t, language } = useLanguage();

  const applyThemeColor = (hue: string) => {
    document.documentElement.style.setProperty('--primary', `${hue} 65% 35%`);
    document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
    document.documentElement.style.setProperty('--accent', `${hue} 30% 90%`);
  };

  const handleSelect = (color: typeof themeColors[0]) => {
    applyThemeColor(color.hue);
    onSelect(color.id);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium font-bengali">{t('themeColor')}</h4>
      <div className="grid grid-cols-4 gap-3">
        {themeColors.map((color) => {
          const isSelected = currentColor === color.id;
          return (
            <button
              key={color.id}
              onClick={() => handleSelect(color)}
              className={cn(
                "flex flex-col items-center gap-2 p-2 rounded-lg transition-all",
                "hover:bg-muted",
                isSelected && "ring-2 ring-primary"
              )}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `hsl(${color.hue} 65% 45%)` }}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
              <span className="text-xs font-bengali">
                {language === 'bn' ? color.namebn : color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function initializeThemeColor(colorId: string) {
  const color = themeColors.find(c => c.id === colorId);
  if (color) {
    document.documentElement.style.setProperty('--primary', `${color.hue} 65% 35%`);
    document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
    document.documentElement.style.setProperty('--accent', `${color.hue} 30% 90%`);
  }
}
