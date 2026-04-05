import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LiveClockProps {
  format?: '12h' | '24h';
  className?: string;
}

export function LiveClock({ format = '12h', className }: LiveClockProps) {
  const [now, setNow] = useState(new Date());
  const { language } = useLanguage();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const displayHours = format === '12h' ? (hours % 12 || 12) : hours;
  const ampm = format === '12h' ? (hours >= 12 ? 'PM' : 'AM') : '';
  const timeStr = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return (
    <div className={`flex items-center gap-1.5 bg-white/8 backdrop-blur-md rounded-full px-3 py-1 border border-white/10 ${className || ''}`}>
      <Clock className="w-3 h-3 text-white/40" />
      <span className="text-white/50 text-xs font-mono tabular-nums">{timeStr}</span>
      {ampm && <span className="text-white/30 text-[10px]">{ampm}</span>}
    </div>
  );
}
