import { useState, useEffect, useCallback, useRef } from 'react';
import type { PomodoroSettings } from '@/types/study';

type PomodoroPhase = 'focus' | 'break' | 'longBreak' | 'idle';

const defaultSettings: PomodoroSettings = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

export function usePomodoro(settings: PomodoroSettings = defaultSettings) {
  const [phase, setPhase] = useState<PomodoroPhase>('idle');
  const [timeRemaining, setTimeRemaining] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getDuration = useCallback((currentPhase: PomodoroPhase) => {
    switch (currentPhase) {
      case 'focus':
        return settings.focusDuration * 60;
      case 'break':
        return settings.breakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      default:
        return settings.focusDuration * 60;
    }
  }, [settings]);

  const playAlarm = useCallback(() => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  const start = useCallback(() => {
    if (phase === 'idle') {
      setPhase('focus');
      setTimeRemaining(getDuration('focus'));
    }
    setIsRunning(true);
  }, [phase, getDuration]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPhase('idle');
    setTimeRemaining(settings.focusDuration * 60);
    setCompletedSessions(0);
  }, [settings.focusDuration]);

  const skip = useCallback(() => {
    playAlarm();
    
    if (phase === 'focus') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      
      if (newCompleted % settings.sessionsBeforeLongBreak === 0) {
        setPhase('longBreak');
        setTimeRemaining(getDuration('longBreak'));
      } else {
        setPhase('break');
        setTimeRemaining(getDuration('break'));
      }
    } else {
      setPhase('focus');
      setTimeRemaining(getDuration('focus'));
    }
  }, [phase, completedSessions, settings.sessionsBeforeLongBreak, getDuration, playAlarm]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      skip();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, skip]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = phase !== 'idle' 
    ? ((getDuration(phase) - timeRemaining) / getDuration(phase)) * 100 
    : 0;

  return {
    phase,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    completedSessions,
    progress,
    start,
    pause,
    reset,
    skip,
  };
}
