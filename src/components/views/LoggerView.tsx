import { PenTool } from 'lucide-react';
import { StudyLoggerPanel } from '@/components/logger/StudyLoggerPanel';
import type { Subject, StudySession } from '@/types/study';

interface LoggerViewProps {
  subjects: Subject[];
  addSession: (session: Omit<StudySession, 'id'>) => void;
  getTodayStudyTime: () => number;
  getWeekStudyTime: () => number;
}

export function LoggerView({
  subjects,
  addSession,
  getTodayStudyTime,
  getWeekStudyTime,
}: LoggerViewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <PenTool className="w-8 h-8 text-primary" />
          Study Logger
        </h1>
        <p className="text-muted-foreground mt-1 font-bengali">
          স্টাডি লগার - আপনার পড়াশোনার সময় রেকর্ড করুন
        </p>
      </div>

      <div className="max-w-lg">
        <StudyLoggerPanel
          subjects={subjects}
          onAddSession={addSession}
          getTodayStudyTime={getTodayStudyTime}
          getWeekStudyTime={getWeekStudyTime}
        />
      </div>
    </div>
  );
}
