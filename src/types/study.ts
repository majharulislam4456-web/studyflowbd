export interface Subject {
  id: string;
  name: string;
  nameBn?: string;
  totalChapters: number;
  completedChapters: number;
  color: string;
  icon?: string;
}

export interface Goal {
  id: string;
  title: string;
  titleBn?: string;
  type: 'mission' | 'weekly' | 'short';
  daysTotal: number;
  daysRemaining: number;
  progress: number;
  isCompleted: boolean;
  createdAt: Date;
}

export interface StudySession {
  id: string;
  subjectId: string;
  duration: number; // in minutes
  date: Date;
  notes?: string;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  isBengali: boolean;
}

export interface PomodoroSettings {
  focusDuration: number; // in minutes
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}
