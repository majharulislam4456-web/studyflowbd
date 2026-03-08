import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Minimize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { TimerPresets } from './TimerPresets';
import clockFace from '@/assets/clock-face.png';
import { playStart, playPause, playClick } from '@/utils/sounds';

export function PomodoroTimer() {
  const pomodoro = useGlobalPomodoro();
  const {
    phase,
    formattedTime,
    isRunning,
    completedSessions,
    progress,
    focusDuration,
    start,
    pause,
    reset,
    skip,
    minimize,
    setFocusDuration,
  } = pomodoro;

  const getPhaseInfo = () => {
    switch (phase) {
      case 'focus':
        return { 
          label: 'Focus Mode', 
          labelBn: 'ফোকাস মোড', 
          icon: Brain,
          color: 'text-primary',
          bgGradient: 'from-primary/20 to-primary/5'
        };
      case 'break':
        return { 
          label: 'Chill Time', 
          labelBn: 'রিল্যাক্স', 
          icon: Coffee,
          color: 'text-success',
          bgGradient: 'from-success/20 to-success/5'
        };
      case 'longBreak':
        return { 
          label: 'Power Break', 
          labelBn: 'পাওয়ার ব্রেক', 
          icon: Sparkles,
          color: 'text-warning',
          bgGradient: 'from-warning/20 to-warning/5'
        };
      default:
        return { 
          label: 'Ready to Grind', 
          labelBn: 'শুরু করো!', 
          icon: Brain,
          color: 'text-muted-foreground',
          bgGradient: 'from-muted/30 to-muted/10'
        };
    }
  };

  const phaseInfo = getPhaseInfo();
  const PhaseIcon = phaseInfo.icon;

  return (
    <div className={cn(
      "glass-card p-6 md:p-8 flex flex-col items-center justify-center space-y-6 animate-fade-in",
      "bg-gradient-to-br", phaseInfo.bgGradient
    )}>
      {/* Phase indicator with emoji */}
      <div className={cn("flex items-center gap-3 px-4 py-2 rounded-full bg-background/50 backdrop-blur", phaseInfo.color)}>
        <PhaseIcon className="w-5 h-5" />
        <div className="text-center">
          <span className="text-lg font-bold">{phaseInfo.label}</span>
          <span className="text-sm opacity-80 font-bengali ml-2">{phaseInfo.labelBn}</span>
        </div>
      </div>

      {/* Duration presets - only show when idle */}
      {phase === 'idle' && (
        <TimerPresets 
          selectedDuration={focusDuration}
          onSelectDuration={setFocusDuration}
        />
      )}

      {/* Aesthetic Clock Timer */}
      <div className="relative">
        {/* Clock background */}
        <div 
          className={cn(
            "w-56 h-56 md:w-64 md:h-64 rounded-full relative",
            "flex items-center justify-center",
            "shadow-2xl transition-all duration-500",
            isRunning && phase === 'focus' && "animate-pulse-glow"
          )}
        >
          {/* Clock face image */}
          <img 
            src={clockFace} 
            alt="Clock" 
            className="absolute inset-0 w-full h-full rounded-full opacity-20 dark:opacity-10"
          />
          
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-muted/30"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className={cn(
                "transition-all duration-500",
                phase === 'focus' ? 'text-primary' : 
                phase === 'break' ? 'text-success' : 
                phase === 'longBreak' ? 'text-warning' : 'text-muted'
              )}
              style={{
                strokeDasharray: `${2 * Math.PI * 45}%`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}%`,
              }}
            />
          </svg>
          
          {/* Time display */}
          <div className="text-center z-10">
            <p className={cn(
              "text-4xl md:text-5xl font-bold tracking-tight",
              "bg-clip-text text-transparent",
              "bg-gradient-to-br from-foreground via-foreground to-foreground/70"
            )}>
              {formattedTime}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Session #{completedSessions + 1}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        {isRunning && (
          <>
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary animate-ping opacity-50" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-accent animate-bounce" />
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="rounded-full h-12 w-12 transition-transform hover:scale-110"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant={isRunning ? "accent" : "gradient"}
          size="lg"
          onClick={isRunning ? pause : start}
          className={cn(
            "rounded-full w-20 h-20 shadow-xl transition-all",
            "hover:scale-105 active:scale-95",
            isRunning && "animate-pulse"
          )}
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={skip}
          disabled={phase === 'idle'}
          className="rounded-full h-12 w-12 transition-transform hover:scale-110"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Minimize button */}
      {(isRunning || phase !== 'idle') && (
        <Button
          variant="ghost"
          size="sm"
          onClick={minimize}
          className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
          <span className="font-bengali">মিনিমাইজ</span>
        </Button>
      )}

      {/* Session progress dots with animation */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-muted/30">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              i < (completedSessions % 4) 
                ? "bg-primary scale-110 shadow-lg shadow-primary/30" 
                : "bg-muted"
            )}
          />
        ))}
        <span className="text-sm ml-2 font-bengali">
          {completedSessions} সেশন ✨
        </span>
      </div>
    </div>
  );
}
