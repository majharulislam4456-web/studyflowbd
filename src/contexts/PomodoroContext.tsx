import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { getRandomMessage, showBrowserNotification, requestNotificationPermission } from '@/utils/congratulations';
import { playTimerAlarm } from '@/utils/sounds';

export interface PomodoroSettings {
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmSound: string;
  volume: number;
  browserNotification: boolean;
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
  settings: PomodoroSettings;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  enableNotifications: () => Promise<boolean>;
  setFocusDuration: (minutes: number) => void;
  updateSettings: (updates: Partial<PomodoroSettings>) => void;
}

const defaultSettings: PomodoroSettings = {
  focusDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  alarmSound: 'digital',
  volume: 100,
  browserNotification: false,
};

const PomodoroContext = createContext<PomodoroContextType | null>(null);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    try {
      const saved = localStorage.getItem('pomodoroSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch { return defaultSettings; }
  });
  const [phase, setPhase] = useState<PomodoroPhase>('idle');
  const [focusDuration, setFocusDurationState] = useState(settings.focusDuration);
  const [timeRemaining, setTimeRemaining] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<PomodoroSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('pomodoroSettings', JSON.stringify(next));
      return next;
    });
  }, []);

  const getDuration = useCallback((currentPhase: PomodoroPhase) => {
    switch (currentPhase) {
      case 'focus': return focusDuration * 60;
      case 'break': return settings.breakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
      default: return focusDuration * 60;
    }
  }, [focusDuration, settings.breakDuration, settings.longBreakDuration]);

  const enableNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    updateSettings({ browserNotification: granted });
    return granted;
  }, [updateSettings]);

  const showPhaseNotification = useCallback((completedPhase: PomodoroPhase, language: 'en' | 'bn' = 'bn') => {
    if (!notificationsEnabled && !settings.browserNotification) return;
    if (completedPhase === 'focus') {
      const message = getRandomMessage('pomodoroFocusComplete', language);
      showBrowserNotification(language === 'bn' ? 'ফোকাস সেশন শেষ!' : 'Focus Session Complete!', message);
    } else if (completedPhase === 'break' || completedPhase === 'longBreak') {
      const message = getRandomMessage('pomodoroBreakComplete', language);
      showBrowserNotification(language === 'bn' ? 'বিরতি শেষ!' : 'Break Complete!', message);
    }
  }, [notificationsEnabled, settings.browserNotification]);

  const start = useCallback(() => {
    if (phase === 'idle') {
      setPhase('focus');
      setTimeRemaining(getDuration('focus'));
    }
    setIsRunning(true);
  }, [phase, getDuration]);

  const pause = useCallback(() => { setIsRunning(false); }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPhase('idle');
    setTimeRemaining(focusDuration * 60);
    setCompletedSessions(0);
    setIsMinimized(false);
  }, [focusDuration]);

  const setFocusDuration = useCallback((minutes: number) => {
    setFocusDurationState(minutes);
    if (phase === 'idle') setTimeRemaining(minutes * 60);
  }, [phase]);

  const skip = useCallback(() => {
    playTimerAlarm();
    showPhaseNotification(phase);
    
    if (phase === 'focus') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      const isLongBreak = newCompleted % settings.sessionsBeforeLongBreak === 0;
      const nextPhase = isLongBreak ? 'longBreak' : 'break';
      setPhase(nextPhase);
      setTimeRemaining(getDuration(nextPhase));
      if (settings.autoStartBreaks) setIsRunning(true);
      else setIsRunning(false);
    } else {
      setPhase('focus');
      setTimeRemaining(getDuration('focus'));
      if (settings.autoStartPomodoros) setIsRunning(true);
      else setIsRunning(false);
    }
  }, [phase, completedSessions, getDuration, showPhaseNotification, settings]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (timeRemaining === 0 && isRunning) {
      skip();
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeRemaining, skip]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = phase !== 'idle'
    ? ((getDuration(phase) - timeRemaining) / getDuration(phase)) * 100
    : 0;

  return (
    <PomodoroContext.Provider value={{
      phase, timeRemaining, formattedTime: formatTime(timeRemaining),
      isRunning, completedSessions, progress, isMinimized, notificationsEnabled,
      focusDuration, settings,
      start, pause, reset, skip,
      minimize: () => setIsMinimized(true),
      maximize: () => setIsMinimized(false),
      close: () => { setIsMinimized(false); setIsRunning(false); },
      enableNotifications, setFocusDuration, updateSettings,
    }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function useGlobalPomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) throw new Error('useGlobalPomodoro must be used within a PomodoroProvider');
  return context;
}
