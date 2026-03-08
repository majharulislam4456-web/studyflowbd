import { PenTool } from 'lucide-react';
import { StudyLoggerPanel } from '@/components/logger/StudyLoggerPanel';
import { StudySessionList } from '@/components/logger/StudySessionList';
import { Stopwatch } from '@/components/logger/Stopwatch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Subject, StudySession } from '@/hooks/useSupabaseData';
import { useLanguage } from '@/contexts/LanguageContext';
import { filterCurrentWeekSessions, getWeekStartSaturday, getWeekEndFriday } from '@/utils/weekUtils';
import { format } from 'date-fns';

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

  // Only show current week sessions (Sat-Fri)
  const weekSessions = filterCurrentWeekSessions(sessions);
  const weekStart = getWeekStartSaturday();
  const weekEnd = getWeekEndFriday();

  const handleStopwatchSave = (data: { minutes: number; subjectId: string | null; notes: string }) => {
    addSession({
      subject_id: data.subjectId,
      duration: data.minutes,
      session_date: new Date().toISOString(),
      notes: data.notes || (language === 'bn' ? 'স্টপওয়াচ থেকে লগ করা হয়েছে' : 'Logged from stopwatch'),
    });
  };

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
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="font-bengali">
                {language === 'bn' ? '✍️ ম্যানুয়াল' : '✍️ Manual'}
              </TabsTrigger>
              <TabsTrigger value="stopwatch" className="font-bengali">
                {language === 'bn' ? '⏱️ স্টপওয়াচ' : '⏱️ Stopwatch'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="mt-4">
              <StudyLoggerPanel
                subjects={subjects}
                onAddSession={addSession}
                getTodayStudyTime={getTodayStudyTime}
                getWeekStudyTime={getWeekStudyTime}
              />
            </TabsContent>
            
            <TabsContent value="stopwatch" className="mt-4">
              <Stopwatch subjects={subjects} onSaveSession={handleStopwatchSave} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground font-bengali">
              {language === 'bn' ? 'এই সপ্তাহের সেশন' : "This Week's Sessions"}
            </h3>
            <span className="text-xs text-muted-foreground font-bengali">
              {format(weekStart, 'dd/MM')} - {format(weekEnd, 'dd/MM')}
              {' '}({language === 'bn' ? 'শনি-শুক্র' : 'Sat-Fri'})
            </span>
          </div>
          <StudySessionList
            sessions={weekSessions}
            subjects={subjects}
            onUpdate={updateSession}
            onDelete={deleteSession}
          />
        </div>
      </div>
    </div>
  );
}
