import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Bell, CalendarDays, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay, isToday as isDateToday } from 'date-fns';
import { bn } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { StudySession, Subject } from '@/hooks/useSupabaseData';
import type { StudyRoutine } from '@/components/views/TimetableView';

interface ExamReminder {
  id: string;
  title: string;
  title_bn: string | null;
  exam_date: string;
}

interface CalendarViewProps {
  sessions: StudySession[];
  subjects: Subject[];
  routines: StudyRoutine[];
  examReminders?: ExamReminder[];
}

const DAY_LABELS_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

export function CalendarView({ sessions, subjects, routines }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [examReminders, setExamReminders] = useState<ExamReminder[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase.from('exam_reminders').select('id, title, title_bn, exam_date')
      .eq('user_id', user.id)
      .then(({ data }) => { if (data) setExamReminders(data); });
  }, [user]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const getSubjectName = (id: string | null) => {
    if (!id) return 'Unknown';
    const s = subjects.find(s => s.id === id);
    return s?.name_bn || s?.name || 'Unknown';
  };

  const getSubjectColor = (id: string | null) => {
    if (!id) return 'hsl(var(--primary))';
    return subjects.find(s => s.id === id)?.color || 'hsl(var(--primary))';
  };

  const getEventsForDate = (date: Date) => {
    const dayOfWeek = getDay(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySessions = sessions.filter(s => format(new Date(s.session_date), 'yyyy-MM-dd') === dateStr);
    const dayRoutines = routines.filter(r => r.day_of_week === dayOfWeek);
    const dayExams = examReminders.filter(e => format(new Date(e.exam_date), 'yyyy-MM-dd') === dateStr);
    return { sessions: daySessions, routines: dayRoutines, exams: dayExams };
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : null;

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}ঘ ${m}মি`;
    return `${m}মি`;
  };

  // Total study time for a date
  const getStudyMins = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return sessions.filter(s => format(new Date(s.session_date), 'yyyy-MM-dd') === dateStr).reduce((a, s) => a + s.duration, 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-bengali flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          📆 ক্যালেন্ডার
        </h2>
        <p className="text-muted-foreground text-sm font-bengali">মাসিক স্টাডি সেশন, পরীক্ষা ও রুটিন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(m => subMonths(m, 1))}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-xl font-bengali font-bold">
                {format(currentMonth, 'MMMM yyyy', { locale: bn })}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(m => addMonths(m, 1))}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-3">
              {DAY_LABELS_BN.map(d => (
                <div key={d} className="text-center text-xs font-bold text-primary py-2 font-bengali uppercase tracking-wider">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {days.map(day => {
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const events = getEventsForDate(day);
                const hasAny = events.sessions.length > 0 || events.routines.length > 0 || events.exams.length > 0;
                const studyMins = getStudyMins(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all relative group",
                      isToday && !isSelected && "ring-2 ring-primary bg-primary/5",
                      isSelected && "bg-primary text-primary-foreground shadow-lg scale-105",
                      !isSelected && !isToday && "hover:bg-accent/50 hover:shadow-sm",
                    )}
                  >
                    <span className={cn("text-xs sm:text-sm font-medium", isSelected && "font-bold text-primary-foreground")}>
                      {format(day, 'd')}
                    </span>
                    {hasAny && !isSelected && (
                      <div className="flex gap-0.5 mt-0.5">
                        {events.sessions.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                        {events.exams.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-destructive" />}
                        {events.routines.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground/40" />}
                      </div>
                    )}
                    {isSelected && hasAny && (
                      <div className="flex gap-0.5 mt-0.5">
                        {events.sessions.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                        {events.exams.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/70" />}
                      </div>
                    )}
                    {/* Study time tooltip on hover */}
                    {studyMins > 0 && !isSelected && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-foreground text-background text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-10 shadow-lg">
                        {formatDuration(studyMins)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary" /><span className="font-bengali">সেশন</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-destructive" /><span className="font-bengali">পরীক্ষা</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-accent-foreground/40" /><span className="font-bengali">রুটিন</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardTitle className="text-base font-bengali flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              {selectedDate
                ? format(selectedDate, 'd MMMM yyyy', { locale: bn })
                : 'একটি তারিখ বাছাই করুন'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {!selectedDate && (
              <p className="text-sm text-muted-foreground text-center py-8 font-bengali">
                ক্যালেন্ডার থেকে তারিখ ক্লিক করুন
              </p>
            )}

            {selectedDate && selectedEvents && (
              <>
                {selectedEvents.exams.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-destructive font-bengali">
                      <Bell className="w-4 h-4" /> পরীক্ষা
                    </h4>
                    {selectedEvents.exams.map(exam => (
                      <div key={exam.id} className="p-3 rounded-xl bg-destructive/10 text-sm mb-1.5 border border-destructive/20 font-medium">
                        {exam.title_bn || exam.title}
                      </div>
                    ))}
                  </div>
                )}

                {selectedEvents.sessions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 font-bengali">
                      <BookOpen className="w-4 h-4 text-primary" /> স্টাডি সেশন
                    </h4>
                    {selectedEvents.sessions.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 text-sm mb-1.5 border border-primary/10">
                        <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: getSubjectColor(s.subject_id) }} />
                        <div>
                          <p className="font-semibold">{getSubjectName(s.subject_id)}</p>
                          <p className="text-xs text-muted-foreground font-bengali">{formatDuration(s.duration)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedEvents.routines.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 font-bengali">
                      <CalendarDays className="w-4 h-4" /> রুটিন
                    </h4>
                    {selectedEvents.routines.map(r => {
                      const formatTime = (t: string) => {
                        const [h, m] = t.split(':');
                        const hr = parseInt(h);
                        return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
                      };
                      return (
                        <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 text-sm mb-1.5 border border-accent/30">
                          <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: getSubjectColor(r.subject_id) }} />
                          <div>
                            <p className="font-semibold">{getSubjectName(r.subject_id)}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {formatTime(r.start_time)} - {formatTime(r.end_time)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedEvents.sessions.length === 0 && selectedEvents.routines.length === 0 && selectedEvents.exams.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8 font-bengali">
                    এই তারিখে কোনো ইভেন্ট নেই
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
