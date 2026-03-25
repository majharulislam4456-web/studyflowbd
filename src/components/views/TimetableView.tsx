import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Clock, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Subject } from '@/hooks/useSupabaseData';

export interface StudyRoutine {
  id: string;
  user_id: string;
  subject_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

interface TimetableViewProps {
  routines: StudyRoutine[];
  subjects: Subject[];
  addRoutine: (routine: Omit<StudyRoutine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
}

const DAYS = [
  { value: 6, label: 'Saturday', labelBn: 'শনিবার' },
  { value: 0, label: 'Sunday', labelBn: 'রবিবার' },
  { value: 1, label: 'Monday', labelBn: 'সোমবার' },
  { value: 2, label: 'Tuesday', labelBn: 'মঙ্গলবার' },
  { value: 3, label: 'Wednesday', labelBn: 'বুধবার' },
  { value: 4, label: 'Thursday', labelBn: 'বৃহস্পতিবার' },
  { value: 5, label: 'Friday', labelBn: 'শুক্রবার' },
];

const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6; // 6 AM to 10 PM
  return `${hour.toString().padStart(2, '0')}:00`;
});

export function TimetableView({ routines, subjects, addRoutine, deleteRoutine }: TimetableViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(6);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');

  const handleAdd = async () => {
    if (!selectedSubject || !startTime || !endTime) return;
    await addRoutine({
      subject_id: selectedSubject,
      day_of_week: selectedDay,
      start_time: startTime,
      end_time: endTime,
    });
    setDialogOpen(false);
    setSelectedSubject('');
    setStartTime('08:00');
    setEndTime('09:00');
  };

  const getSubjectName = (subjectId: string | null) => {
    if (!subjectId) return 'Unknown';
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name_bn || subject?.name || 'Unknown';
  };

  const getSubjectColor = (subjectId: string | null) => {
    if (!subjectId) return 'hsl(var(--primary))';
    return subjects.find(s => s.id === subjectId)?.color || 'hsl(var(--primary))';
  };

  const getRoutinesForDay = (dayValue: number) => {
    return routines
      .filter(r => r.day_of_week === dayValue)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${ampm}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-bengali">📅 সাপ্তাহিক রুটিন</h2>
          <p className="text-muted-foreground text-sm font-bengali">দিন ও সময় অনুযায়ী পড়ার রুটিন তৈরি করুন</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="font-bengali">রুটিন যোগ করুন</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bengali">নতুন রুটিন যোগ করুন</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label className="font-bengali">দিন</Label>
                <Select value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        <span className="font-bengali">{day.labelBn}</span>
                        <span className="text-muted-foreground ml-2 text-xs">({day.label})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-bengali">সাবজেক্ট</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="সাবজেক্ট বাছাই করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span>{subject.name_bn || subject.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-bengali">শুরুর সময়</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  <Label className="font-bengali">শেষের সময়</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>

              <Button onClick={handleAdd} className="w-full font-bengali" disabled={!selectedSubject}>
                যোগ করুন
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map(day => {
          const dayRoutines = getRoutinesForDay(day.value);
          return (
            <Card key={day.value} className="overflow-hidden">
              <CardHeader className="pb-3 bg-primary/5">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="font-bengali">{day.labelBn}</span>
                  <span className="text-xs text-muted-foreground">({day.label})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 min-h-[100px]">
                {dayRoutines.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4 font-bengali">কোনো রুটিন নেই</p>
                ) : (
                  dayRoutines.map(routine => (
                    <div
                      key={routine.id}
                      className="flex items-center gap-2 p-2.5 rounded-lg border border-border/50 bg-card group hover:shadow-sm transition-shadow"
                    >
                      <div
                        className="w-1 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getSubjectColor(routine.subject_id) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {getSubjectName(routine.subject_id)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(routine.start_time)} - {formatTime(routine.end_time)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => deleteRoutine(routine.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
