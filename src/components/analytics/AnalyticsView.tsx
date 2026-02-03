import { BarChart3 } from 'lucide-react';
import { StudyAnalytics } from './StudyAnalytics';
import type { StudySession, Subject } from '@/hooks/useSupabaseData';

interface AnalyticsViewProps {
  sessions: StudySession[];
  subjects: Subject[];
}

export function AnalyticsView({ sessions, subjects }: AnalyticsViewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1 font-bengali">
          পরিসংখ্যান - আপনার পড়াশোনার বিশ্লেষণ দেখুন
        </p>
      </div>

      <StudyAnalytics sessions={sessions} subjects={subjects} />
    </div>
  );
}
