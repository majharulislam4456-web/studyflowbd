import { Button } from '@/components/ui/button';
import { Play, Pause, X, Timer, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGlobalStopwatch } from '@/contexts/StopwatchContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface FloatingStopwatchProps {
  onExpand: () => void;
}

export function FloatingStopwatch({ onExpand }: FloatingStopwatchProps) {
  const { formattedTime, isRunning, start, pause, reset } = useGlobalStopwatch();
  const { language } = useLanguage();

  return (
    <div className={cn(
      "fixed bottom-20 md:bottom-6 left-4 z-50",
      "glass-card shadow-2xl p-3",
      "animate-scale-in",
      "flex items-center gap-3"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        isRunning ? "bg-green-500/20 text-green-500" : "bg-primary/20 text-primary"
      )}>
        <Timer className="w-5 h-5" />
      </div>
      
      <div className="text-center min-w-[70px]">
        <p className="text-lg font-mono font-bold text-foreground">{formattedTime}</p>
        <p className="text-[10px] text-muted-foreground font-bengali">
          {isRunning 
            ? (language === 'bn' ? 'চলছে...' : 'Running...') 
            : (language === 'bn' ? 'বিরতি' : 'Paused')}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant={isRunning ? "accent" : "gradient"}
          size="icon-sm"
          onClick={isRunning ? pause : start}
          className="rounded-full"
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </Button>
        
        <Button variant="ghost" size="icon-sm" onClick={onExpand} className="text-muted-foreground">
          <Maximize2 className="w-3 h-3" />
        </Button>
        
        <Button variant="ghost" size="icon-sm" onClick={reset} className="text-muted-foreground hover:text-destructive">
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
