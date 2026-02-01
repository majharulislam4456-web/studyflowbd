import { Button } from '@/components/ui/button';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePomodoro } from '@/hooks/usePomodoro';

export function PomodoroTimer() {
  const {
    phase,
    formattedTime,
    isRunning,
    completedSessions,
    progress,
    start,
    pause,
    reset,
    skip,
  } = usePomodoro();

  const getPhaseInfo = () => {
    switch (phase) {
      case 'focus':
        return { 
          label: 'Focus Time', 
          labelBn: 'ফোকাস সময়', 
          icon: Brain,
          color: 'text-primary' 
        };
      case 'break':
        return { 
          label: 'Short Break', 
          labelBn: 'ছোট বিরতি', 
          icon: Coffee,
          color: 'text-success' 
        };
      case 'longBreak':
        return { 
          label: 'Long Break', 
          labelBn: 'দীর্ঘ বিরতি', 
          icon: Coffee,
          color: 'text-warning' 
        };
      default:
        return { 
          label: 'Ready to Focus', 
          labelBn: 'ফোকাস করতে প্রস্তুত', 
          icon: Brain,
          color: 'text-muted-foreground' 
        };
    }
  };

  const phaseInfo = getPhaseInfo();
  const PhaseIcon = phaseInfo.icon;

  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center space-y-8 animate-fade-in">
      {/* Phase indicator */}
      <div className={cn("flex items-center gap-3", phaseInfo.color)}>
        <PhaseIcon className="w-6 h-6" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">{phaseInfo.label}</h2>
          <p className="text-sm opacity-80 font-bengali">{phaseInfo.labelBn}</p>
        </div>
      </div>

      {/* Timer display */}
      <ProgressRing 
        progress={progress} 
        size={240} 
        strokeWidth={12}
        className={cn(
          "transition-all duration-300",
          isRunning && phase === 'focus' && "animate-pulse-glow"
        )}
      >
        <div className="text-center">
          <p className="text-5xl font-bold tracking-tight text-foreground">
            {formattedTime}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Session {completedSessions + 1}
          </p>
        </div>
      </ProgressRing>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon-lg"
          onClick={reset}
          className="rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant={isRunning ? "accent" : "gradient"}
          size="xl"
          onClick={isRunning ? pause : start}
          className="rounded-full w-20 h-20 shadow-lg"
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon-lg"
          onClick={skip}
          disabled={phase === 'idle'}
          className="rounded-full"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Session info */}
      <div className="flex items-center gap-2 text-muted-foreground">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              i < (completedSessions % 4) ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
        <span className="text-sm ml-2">
          {completedSessions} sessions completed / <span className="font-bengali">সেশন সম্পন্ন</span>
        </span>
      </div>
    </div>
  );
}
