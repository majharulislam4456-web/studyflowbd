import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { playStart, playPause, playSuccess, playClick } from '@/utils/sounds';

interface StopwatchProps {
  onSaveTime: (minutes: number) => void;
}

export function Stopwatch({ onSaveTime }: StopwatchProps) {
  const { language } = useLanguage();
  const [time, setTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      playStart();
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    playPause();
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setTime(0);
  }, [pause]);

  const saveTime = useCallback(() => {
    if (time >= 60) {
      playSuccess();
      const minutes = Math.floor(time / 60);
      onSaveTime(minutes);
      reset();
    }
  }, [time, onSaveTime, reset]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-accent/10 text-accent">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {language === 'bn' ? 'স্টপওয়াচ' : 'Stopwatch'}
          </h3>
          <p className="text-sm text-muted-foreground font-bengali">
            {language === 'bn' ? 'সময় ট্র্যাক করুন' : 'Track your time'}
          </p>
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div 
          className={cn(
            "text-5xl md:text-6xl font-mono font-bold text-center py-8",
            "bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl",
            "transition-all duration-300",
            isRunning && "animate-pulse-glow"
          )}
        >
          <span className={cn(
            "bg-clip-text text-transparent bg-gradient-to-r",
            isRunning ? "from-accent to-primary" : "from-foreground to-foreground"
          )}>
            {formatTime(time)}
          </span>
        </div>
        
        {/* Running indicator */}
        {isRunning && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success animate-pulse" />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="rounded-full h-12 w-12"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant={isRunning ? "accent" : "gradient"}
          size="lg"
          onClick={isRunning ? pause : start}
          className="rounded-full h-16 w-16 shadow-lg"
        >
          {isRunning ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={saveTime}
          disabled={time < 60}
          className="rounded-full h-12 w-12"
        >
          <Save className="w-5 h-5" />
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-muted-foreground font-bengali">
        {time < 60 
          ? (language === 'bn' ? '১ মিনিটের বেশি হলে সেভ করতে পারবেন' : 'Study for at least 1 min to save')
          : (language === 'bn' ? `${Math.floor(time / 60)} মিনিট সেভ করুন` : `Save ${Math.floor(time / 60)} minutes`)
        }
      </p>
    </div>
  );
}
