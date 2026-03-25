import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Bell, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay } from 'date-fns';
import { bn } from 'date-fns/locale';
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
  examReminders: ExamReminder[];
}

const DAY_LABELS_BN = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

export function CalendarView({ sessions, subjects, routines, examReminders }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month to align with day of week
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

  // Events for a given date
  const getEventsForDate = (date: Date) => {
    const dayOfWeek = getDay(date);
    const dateStr = format(date, 'yyyy-MM-dd');

    const daySessions = sessions.filter(s => {
      const sd = format(new Date(s.session_date), 'yyyy-MM-dd');
      return sd === dateStr;
    });

    const dayRoutines = routines.filter(r => r.day_of_week === dayOfWeek);

    const dayExams = examReminders.filter(e => {
      const ed = format(new Date(e.exam_date), 'yyyy-MM-dd');
      return ed === dateStr;
    });

    return { sessions: daySessions, routines: dayRoutines, exams: dayExams };
  };

  const hasEvents = (date: Date) => {
    const e = getEventsForDate(date);
    return e.sessions.length > 0 || e.routines.length > 0 || e.exams.length > 0;
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : null;

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h}ঘ ${m}মি`;
    return `${m}মি`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-bengali">📆 ক্যালেন্ডার</h2>
        <p className="text-muted-foreground text-sm font-bengali">মাসিক স্টাডি সেশন, পরীক্ষা ও রুটিন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(m => subMonths(m, 1))}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <CardTitle className="text-lg font-bengali">
                {format(currentMonth, 'MMMM yyyy', { locale: bn })}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(m => addMonths(m, 1))}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_LABELS_BN.map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2 font-bengali">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for padding */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {days.map(day => {
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const events = getEventsForDate(day);
                const hasAny = events.sessions.length > 0 || events.routines.length > 0 || events.exams.length > 0;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative",
                      isToday && "ring-2 ring-primary",
                      isSelected && "bg-primary text-primary-foreground",
                      !isSelected && "hover:bg-accent",
                    )}
                  >
                    <span className={cn("text-xs sm:text-sm", isSelected && "font-bold")}>
                      {format(day, 'd')}
                    </span>
                    {hasAny && !isSelected && (
                      <div className="flex gap-0.5 mt-0.5">
                        {events.sessions.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        {events.exams.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-destructive" />}
                        {events.routines.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground/40" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-primary" /><span className="font-bengali">সেশন</span></div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-destructive" /><span className="font-bengali">পরীক্ষা</span></div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-accent-foreground/40" /><span className="font-bengali">রুটিন</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: selected date details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bengali">
              {selectedDate
                ? format(selectedDate, 'd MMMM yyyy', { locale: bn })
                : 'একটি তারিখ বাছাই করুন'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedDate && (
              <p className="text-sm text-muted-foreground text-center py-8 font-bengali">
                ক্যালেন্ডার থেকে তারিখ ক্লিক করুন
              </p>
            )}

            {selectedDate && selectedEvents && (
              <>
                {/* Exams */}
                {selectedEvents.exams.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 text-destructive font-bengali">
                      <Bell className="w-4 h-4" /> পরীক্ষা
                    </h4>
                    {selectedEvents.exams.map(exam => (
                      <div key={exam.id} className="p-2 rounded-lg bg-destructive/10 text-sm mb-1">
                        {exam.title_bn || exam.title}
                      </div>
                    ))}
                  </div>
                )}

                {/* Sessions */}
                {selectedEvents.sessions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-2 font-bengali">
                      <BookOpen className="w-4 h-4 text-primary" /> স্টাডি সেশন
                    </h4>
                    {selectedEvents.sessions.map(s => (
                      <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 text-sm mb-1">
                        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: getSubjectColor(s.subject_id) }} />
                        <div>
                          <p className="font-medium">{getSubjectName(s.subject_id)}</p>
                          <p className="text-xs text-muted-foreground font-bengali">{formatDuration(s.duration)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Routines */}
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
                        <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg bg-accent/50 text-sm mb-1">
                          <div className="w-1 h-8 rounded-full" style={{ backgroundColor: getSubjectColor(r.subject_id) }} />
                          <div>
                            <p className="font-medium">{getSubjectName(r.subject_id)}</p>
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
