import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';

interface StopwatchContextType {
  time: number;
  isRunning: boolean;
  selectedSubject: string;
  notes: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSelectedSubject: (subject: string) => void;
  setNotes: (notes: string) => void;
  formattedTime: string;
}

const StopwatchContext = createContext<StopwatchContextType | null>(null);

export function StopwatchProvider({ children }: { children: ReactNode }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('none');
  const [notes, setNotes] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => { setIsRunning(false); setTime(0); setNotes(''); setSelectedSubject('none'); }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <StopwatchContext.Provider value={{
      time, isRunning, selectedSubject, notes,
      start, pause, reset,
      setSelectedSubject, setNotes,
      formattedTime: formatTime(time),
    }}>
      {children}
    </StopwatchContext.Provider>
  );
}

export function useGlobalStopwatch() {
  const context = useContext(StopwatchContext);
  if (!context) throw new Error('useGlobalStopwatch must be used within StopwatchProvider');
  return context;
}
