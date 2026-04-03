import { BarChart3 } from 'lucide-react';
import { StudyAnalytics } from './StudyAnalytics';
import type { StudySession, Subject } from '@/hooks/useSupabaseData';

interface AnalyticsViewProps {
  sessions: StudySession[];
  subjects: Subject[];
}

export function AnalyticsView({ sessions, subjects }: AnalyticsViewProps) {
  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          Analytics
        </h1>
        <p className="page-subtitle">
          পরিসংখ্যান - আপনার পড়াশোনার বিশ্লেষণ দেখুন
        </p>
      </div>

      <StudyAnalytics sessions={sessions} subjects={subjects} />
    </div>
  );
}
