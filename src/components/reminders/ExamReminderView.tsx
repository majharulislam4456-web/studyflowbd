import { useState, useEffect, useCallback, useMemo } from 'react';
import { Bell, BellRing, Plus, Trash2, Calendar, Clock, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { playTimerAlarm, playSuccess } from '@/utils/sounds';
import { format, formatDistanceToNow, isPast, differenceInSeconds } from 'date-fns';
import { bn } from 'date-fns/locale';

interface ExamReminder {
  id: string;
  user_id: string;
  title: string;
  title_bn: string | null;
  exam_date: string;
  reminder_minutes_before: number;
  reminder_type: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function ExamReminderView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [reminders, setReminders] = useState<ExamReminder[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('09:00');
  const [reminderMinutes, setReminderMinutes] = useState('60');
  const [reminderType, setReminderType] = useState('exam');
  const [notes, setNotes] = useState('');

  const fetchReminders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('exam_reminders')
      .select('*')
      .order('exam_date', { ascending: true });
    if (data) setReminders(data as ExamReminder[]);
  }, [user]);

  useEffect(() => { fetchReminders(); }, [fetchReminders]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach(r => {
        if (!r.is_active) return;
        const examTime = new Date(r.exam_date);
        const reminderTime = new Date(examTime.getTime() - r.reminder_minutes_before * 60000);
        const diff = Math.abs(now.getTime() - reminderTime.getTime());
        if (diff < 60000) {
          playTimerAlarm();
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(r.reminder_type === 'revision' ? '📖 Revision Reminder!' : '📝 Exam Reminder!', {
              body: `${r.title} - ${format(examTime, 'PPp')}`,
              icon: '/logo.jpg',
            });
          }
          toast({
            title: r.reminder_type === 'revision' ? '📖 রিভিশন রিমাইন্ডার!' : '📝 পরীক্ষার রিমাইন্ডার!',
            description: `${r.title} - ${formatDistanceToNow(examTime, { addSuffix: true, locale: language === 'bn' ? bn : undefined })}`,
          });
        }
      });
    };
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders, toast, language]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  const handleAdd = async () => {
    if (!user || !title || !examDate) return;
    await requestNotificationPermission();
    const dateTime = new Date(`${examDate}T${examTime}`);
    const { data, error } = await supabase
      .from('exam_reminders')
      .insert({
        user_id: user.id,
        title,
        title_bn: titleBn || null,
        exam_date: dateTime.toISOString(),
        reminder_minutes_before: parseInt(reminderMinutes),
        reminder_type: reminderType,
        notes: notes || null,
      } as any)
      .select()
      .single();
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    if (data) {
      setReminders(prev => [...prev, data as ExamReminder].sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()));
      playSuccess();
      setTitle(''); setTitleBn(''); setExamDate(''); setExamTime('09:00'); setNotes('');
      setOpen(false);
      toast({ title: language === 'bn' ? '✅ রিমাইন্ডার সেট হয়েছে!' : '✅ Reminder set!' });
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('exam_reminders').update({ is_active: active } as any).eq('id', id);
    setReminders(prev => prev.map(r => r.id === id ? { ...r, is_active: active } : r));
  };

  const deleteReminder = async (id: string) => {
    await supabase.from('exam_reminders').delete().eq('id', id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const upcomingReminders = reminders.filter(r => !isPast(new Date(r.exam_date)));
  const pastReminders = reminders.filter(r => isPast(new Date(r.exam_date)));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 font-bengali">
            <BellRing className="w-6 h-6 text-primary" />
            {language === 'bn' ? 'রিমাইন্ডার ও অ্যালার্ম' : 'Reminders & Alarms'}
          </h1>
          <p className="text-muted-foreground text-sm font-bengali mt-1">
            {language === 'bn' ? 'পরীক্ষা ও রিভিশনের রিমাইন্ডার সেট করুন' : 'Set exam & revision reminders'}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {language === 'bn' ? 'নতুন রিমাইন্ডার' : 'New Reminder'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-bengali">
                {language === 'bn' ? '🔔 রিমাইন্ডার যোগ করুন' : '🔔 Add Reminder'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">📝 {language === 'bn' ? 'পরীক্ষা' : 'Exam'}</SelectItem>
                  <SelectItem value="revision">📖 {language === 'bn' ? 'রিভিশন' : 'Revision'}</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder={language === 'bn' ? 'শিরোনাম' : 'Title'} value={title} onChange={e => setTitle(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-bengali mb-1 block">{language === 'bn' ? 'তারিখ' : 'Date'}</label>
                  <Input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-bengali mb-1 block">{language === 'bn' ? 'সময়' : 'Time'}</label>
                  <Input type="time" value={examTime} onChange={e => setExamTime(e.target.value)} />
                </div>
              </div>
              <Select value={reminderMinutes} onValueChange={setReminderMinutes}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">{language === 'bn' ? '১৫ মিনিট আগে' : '15 min before'}</SelectItem>
                  <SelectItem value="30">{language === 'bn' ? '৩০ মিনিট আগে' : '30 min before'}</SelectItem>
                  <SelectItem value="60">{language === 'bn' ? '১ ঘণ্টা আগে' : '1 hour before'}</SelectItem>
                  <SelectItem value="120">{language === 'bn' ? '২ ঘণ্টা আগে' : '2 hours before'}</SelectItem>
                  <SelectItem value="1440">{language === 'bn' ? '১ দিন আগে' : '1 day before'}</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder={language === 'bn' ? 'নোট (ঐচ্ছিক)' : 'Notes (optional)'} value={notes} onChange={e => setNotes(e.target.value)} className="font-bengali" />
              <Button onClick={handleAdd} className="w-full" disabled={!title || !examDate}>
                {language === 'bn' ? 'রিমাইন্ডার সেট করুন 🔔' : 'Set Reminder 🔔'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming with big countdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground font-bengali flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {language === 'bn' ? 'আসন্ন রিমাইন্ডার' : 'Upcoming'}
        </h2>
        {upcomingReminders.length === 0 && (
          <Card className="p-6 text-center text-muted-foreground font-bengali">
            {language === 'bn' ? 'কোনো আসন্ন রিমাইন্ডার নেই' : 'No upcoming reminders'}
          </Card>
        )}
        {upcomingReminders.map(r => (
          <ReminderCardEnhanced key={r.id} reminder={r} language={language} onToggle={toggleActive} onDelete={deleteReminder} />
        ))}
      </div>

      {/* Past */}
      {pastReminders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-muted-foreground font-bengali flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {language === 'bn' ? 'পূর্ববর্তী' : 'Past'}
          </h2>
          {pastReminders.slice(0, 5).map(r => (
            <ReminderCardEnhanced key={r.id} reminder={r} language={language} onToggle={toggleActive} onDelete={deleteReminder} isPast />
          ))}
        </div>
      )}
    </div>
  );
}

function ReminderCardEnhanced({ reminder, language, onToggle, onDelete, isPast }: {
  reminder: ExamReminder;
  language: string;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  isPast?: boolean;
}) {
  const examDate = new Date(reminder.exam_date);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (isPast) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [isPast]);

  const countdown = useMemo(() => {
    if (isPast) return null;
    const totalSecs = differenceInSeconds(examDate, now);
    if (totalSecs <= 0) return null;
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return { days, hours, mins, secs };
  }, [examDate, now, isPast]);

  const boxes = countdown ? [
    { value: countdown.days.toString().padStart(2, '0'), label: language === 'bn' ? 'দিন' : 'DAYS' },
    { value: countdown.hours.toString().padStart(2, '0'), label: language === 'bn' ? 'ঘণ্টা' : 'HOURS' },
    { value: countdown.mins.toString().padStart(2, '0'), label: language === 'bn' ? 'মিনিট' : 'MINS' },
    { value: countdown.secs.toString().padStart(2, '0'), label: language === 'bn' ? 'সেকেন্ড' : 'SECS' },
  ] : null;

  return (
    <Card className={`overflow-hidden transition-all ${isPast ? 'opacity-60' : 'hover:shadow-lg'} ${!reminder.is_active ? 'opacity-40' : ''}`}>
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${reminder.reminder_type === 'revision' ? 'bg-accent/20' : 'bg-primary/20'}`}>
            {reminder.reminder_type === 'revision' ? '📖' : '📝'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground text-lg">{reminder.title}</p>
            {reminder.title_bn && <p className="text-sm text-muted-foreground font-bengali">{reminder.title_bn}</p>}
            <Badge variant="outline" className="text-xs mt-1">
              {format(examDate, 'dd MMM yyyy, hh:mm a')}
            </Badge>
            {reminder.notes && <p className="text-xs text-muted-foreground mt-1 font-bengali">{reminder.notes}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isPast && <Switch checked={reminder.is_active} onCheckedChange={(checked) => onToggle(reminder.id, checked)} />}
          <Button variant="ghost" size="icon" onClick={() => onDelete(reminder.id)} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Big countdown boxes */}
      {!isPast && boxes && (
        <div className="px-4 pb-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <div className="flex justify-center gap-3">
              {boxes.map((box, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-primary/30 bg-background flex items-center justify-center shadow-sm">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">{box.value}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground mt-1.5 uppercase tracking-wider">{box.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isPast && (
        <div className="px-4 pb-4">
          <Badge variant="secondary" className="font-bengali">
            {language === 'bn' ? '✅ সম্পন্ন' : '✅ Done'}
          </Badge>
        </div>
      )}
    </Card>
  );
}
