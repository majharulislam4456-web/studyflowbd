import { PenTool } from 'lucide-react';
import { StudyLoggerPanel } from '@/components/logger/StudyLoggerPanel';
 import { StudySessionList } from '@/components/logger/StudySessionList';
 import type { Subject, StudySession } from '@/hooks/useSupabaseData';
 import { useLanguage } from '@/contexts/LanguageContext';

interface LoggerViewProps {
  subjects: Subject[];
   sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id' | 'user_id' | 'created_at'>) => void;
   updateSession: (id: string, duration: number) => void;
   deleteSession: (id: string) => void;
  getTodayStudyTime: () => number;
  getWeekStudyTime: () => number;
}

export function LoggerView({
  subjects,
   sessions,
  addSession,
   updateSession,
   deleteSession,
  getTodayStudyTime,
  getWeekStudyTime,
}: LoggerViewProps) {
   const { language } = useLanguage();
 
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <PenTool className="w-8 h-8 text-primary" />
           {language === 'bn' ? 'স্টাডি লগার' : 'Study Logger'}
        </h1>
        <p className="text-muted-foreground mt-1 font-bengali">
           {language === 'bn' ? 'আপনার পড়াশোনার সময় রেকর্ড করুন' : 'Record your study time'}
        </p>
      </div>

       <div className="grid lg:grid-cols-2 gap-6">
         <div className="space-y-6">
           <StudyLoggerPanel
             subjects={subjects}
             onAddSession={addSession}
             getTodayStudyTime={getTodayStudyTime}
             getWeekStudyTime={getWeekStudyTime}
           />
         </div>
         
         <div className="glass-card p-6 space-y-4">
           <h3 className="font-semibold text-foreground font-bengali">
             {language === 'bn' ? 'সাম্প্রতিক সেশন' : 'Recent Sessions'}
           </h3>
           <StudySessionList
             sessions={sessions}
             subjects={subjects}
             onUpdate={updateSession}
             onDelete={deleteSession}
           />
         </div>
      </div>
    </div>
  );
}
