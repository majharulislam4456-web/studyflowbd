import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Clock, BookOpen, Plus, Zap, Flame } from 'lucide-react';
import type { Subject, StudySession } from '@/hooks/useSupabaseData';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { playSuccess } from '@/utils/sounds';

interface StudyLoggerPanelProps {
  subjects: Subject[];
  onAddSession: (session: Omit<StudySession, 'id' | 'user_id' | 'created_at'>) => void;
  getTodayStudyTime: () => number;
  getWeekStudyTime: () => number;
  sessions?: StudySession[];
}

const QUICK_LOG_OPTIONS = [
  { minutes: 15, emoji: '⚡', label: '15m' },
  { minutes: 30, emoji: '📖', label: '30m' },
  { minutes: 60, emoji: '🔥', label: '1h' },
  { minutes: 120, emoji: '💪', label: '2h' },
];

const CELEBRATION_EMOJIS = ['🔥', '💪', '🎯', '⭐', '🚀', '✨', '🏆', '👏'];

export function StudyLoggerPanel({
  subjects,
  onAddSession,
  getTodayStudyTime,
  getWeekStudyTime,
  sessions = [],
}: StudyLoggerPanelProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [selectedSubject, setSelectedSubject] = useState('general');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');

  const handleLog = () => {
    if (!duration) return;
    playSuccess();

    onAddSession({
      subject_id: selectedSubject === 'general' ? null : selectedSubject,
      duration: parseInt(duration),
      session_date: new Date().toISOString(),
      notes: notes.trim() || null
    });

    const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
    toast.success(`${emoji} ${isBn ? `${duration} মিনিট লগ হয়েছে!` : `${duration} min logged!`}`);

    setDuration('30');
    setNotes('');
  };

  const handleQuickLog = (minutes: number) => {
    playSuccess();
    onAddSession({
      subject_id: selectedSubject === 'general' ? null : selectedSubject,
      duration: minutes,
      session_date: new Date().toISOString(),
      notes: null
    });

    const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
    toast.success(`${emoji} ${isBn ? `${minutes} মিনিট লগ হয়েছে!` : `${minutes} min logged!`}`);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const todayTime = getTodayStudyTime();
  const weekTime = getWeekStudyTime();

  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {isBn ? 'স্টাডি সেশন লগ' : 'Log Study Session'}
          </h3>
          <p className="text-sm text-muted-foreground font-bengali">
            {isBn ? 'দ্রুত লগ করুন বা বিস্তারিত দিন' : 'Quick log or add details'}
          </p>
        </div>
      </div>

      {/* Quick Log Buttons */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-primary" />
          {isBn ? 'এক ট্যাপে লগ' : 'One-tap log'}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_LOG_OPTIONS.map((opt) => (
            <button
              key={opt.minutes}
              onClick={() => handleQuickLog(opt.minutes)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-lg">{opt.emoji}</span>
              <span className="text-xs font-semibold text-foreground">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs text-muted-foreground">
            {isBn ? 'অথবা বিস্তারিত' : 'or detailed'}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>{isBn ? 'বিষয়' : 'Subject'}</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder={isBn ? 'বিষয় নির্বাচন করুন' : 'Select subject'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">{isBn ? 'সাধারণ পড়াশোনা' : 'General Study'}</SelectItem>
              {subjects.map((subject) =>
              <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} {subject.name_bn && `/ ${subject.name_bn}`}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{isBn ? 'সময়কাল (মিনিট)' : 'Duration (minutes)'}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="5"
              max="480"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex-1" />
            
            <div className="flex gap-1">
              {[15, 30, 45, 60].map((mins) =>
              <Button
                key={mins}
                variant={duration === String(mins) ? "default" : "outline"}
                size="sm"
                onClick={() => setDuration(String(mins))}
                className="px-3">
                  {mins}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{isBn ? 'কী পড়লাম' : 'What did you study?'}</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={isBn ? 'কী পড়েছেন লিখুন...' : 'Write what you studied...'}
            rows={2}
            className="resize-none" />
        </div>

        <Button
          onClick={handleLog}
          variant="gradient"
          className="w-full gap-2"
          disabled={!duration}>
          <Plus className="w-4 h-4" />
          {isBn ? 'সেশন লগ করুন' : 'Log Session'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center p-4 rounded-xl bg-muted/50">
          <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{formatTime(todayTime)}</p>
          <p className="text-xs text-muted-foreground">
            {isBn ? 'আজ' : 'Today'}
          </p>
        </div>
        <div className="text-center p-4 rounded-xl bg-muted/50">
          <Flame className="w-5 h-5 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-foreground">{formatTime(weekTime)}</p>
          <p className="text-xs text-muted-foreground">
            {isBn ? 'এই সপ্তাহ' : 'This Week'}
          </p>
        </div>
      </div>
    </div>);
}
