import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { getRandomMessage, showBrowserNotification, requestNotificationPermission } from '@/utils/congratulations';
import { playTimerAlarm } from '@/utils/sounds';

export interface PomodoroSettings {
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

type PomodoroPhase = 'focus' | 'break' | 'longBreak' | 'idle';

interface PomodoroContextType {
  phase: PomodoroPhase;
  timeRemaining: number;
  formattedTime: string;
  isRunning: boolean;
  completedSessions: number;
  progress: number;
  isMinimized: boolean;
  notificationsEnabled: boolean;
  focusDuration: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  enableNotifications: () => Promise<boolean>;
  setFocusDuration: (minutes: number) => void;
}

const defaultSettings: PomodoroSettings = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

const PomodoroContext = createContext<PomodoroContextType | null>(null);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<PomodoroPhase>('idle');
  const [focusDuration, setFocusDurationState] = useState(defaultSettings.focusDuration);
  const [timeRemaining, setTimeRemaining] = useState(defaultSettings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const getDuration = useCallback((currentPhase: PomodoroPhase) => {
    switch (currentPhase) {
      case 'focus':
        return focusDuration * 60;
      case 'break':
        return defaultSettings.breakDuration * 60;
      case 'longBreak':
        return defaultSettings.longBreakDuration * 60;
      default:
        return focusDuration * 60;
    }
  }, []);

  const playAlarm = useCallback(() => {
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

  const enableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    return granted;
  }, []);

  const showPhaseNotification = useCallback((completedPhase: PomodoroPhase, language: 'en' | 'bn' = 'bn') => {
    if (!notificationsEnabled) return;
    
    if (completedPhase === 'focus') {
      const message = getRandomMessage('pomodoroFocusComplete', language);
      showBrowserNotification(
        language === 'bn' ? 'ফোকাস সেশন শেষ!' : 'Focus Session Complete!',
        message
      );
    } else if (completedPhase === 'break' || completedPhase === 'longBreak') {
      const message = getRandomMessage('pomodoroBreakComplete', language);
      showBrowserNotification(
        language === 'bn' ? 'বিরতি শেষ!' : 'Break Complete!',
        message
      );
    }
  }, [notificationsEnabled]);

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
    setTimeRemaining(focusDuration * 60);
    setCompletedSessions(0);
    setIsMinimized(false);
  }, [focusDuration]);

  const setFocusDuration = useCallback((minutes: number) => {
    setFocusDurationState(minutes);
    if (phase === 'idle') {
      setTimeRemaining(minutes * 60);
    }
  }, [phase]);

  const skip = useCallback(() => {
    playAlarm();
    showPhaseNotification(phase);
    
    if (phase === 'focus') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      
      if (newCompleted % defaultSettings.sessionsBeforeLongBreak === 0) {
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
  }, [phase, completedSessions, getDuration, playAlarm, showPhaseNotification]);

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

  const minimize = () => setIsMinimized(true);
  const maximize = () => setIsMinimized(false);
  const close = () => {
    setIsMinimized(false);
    setIsRunning(false);
  };

  return (
    <PomodoroContext.Provider
      value={{
        phase,
        timeRemaining,
        formattedTime: formatTime(timeRemaining),
        isRunning,
        completedSessions,
        progress,
        isMinimized,
        notificationsEnabled,
        focusDuration,
        start,
        pause,
        reset,
        skip,
        minimize,
        maximize,
        close,
        enableNotifications,
        setFocusDuration,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function useGlobalPomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('useGlobalPomodoro must be used within a PomodoroProvider');
  }
  return context;
}
