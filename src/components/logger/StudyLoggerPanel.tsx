import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, BookOpen, Plus } from 'lucide-react';
import type { Subject, StudySession } from '@/types/study';

interface StudyLoggerPanelProps {
  subjects: Subject[];
  onAddSession: (session: Omit<StudySession, 'id'>) => void;
  getTodayStudyTime: () => number;
  getWeekStudyTime: () => number;
}

export function StudyLoggerPanel({ 
  subjects, 
  onAddSession,
  getTodayStudyTime,
  getWeekStudyTime
}: StudyLoggerPanelProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [duration, setDuration] = useState('30');

  const handleLog = () => {
    if (!selectedSubject || !duration) return;

    onAddSession({
      subjectId: selectedSubject,
      duration: parseInt(duration),
      date: new Date(),
    });

    setDuration('30');
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
            Log Study Session
          </h3>
          <p className="text-sm text-muted-foreground font-bengali">
            স্টাডি সেশন লগ করুন
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Subject / <span className="font-bengali">বিষয়</span></Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} {subject.nameBn && `/ ${subject.nameBn}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Duration (minutes) / <span className="font-bengali">সময়কাল (মিনিট)</span></Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="5"
              max="480"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-1">
              {[15, 30, 45, 60].map((mins) => (
                <Button
                  key={mins}
                  variant={duration === String(mins) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDuration(String(mins))}
                  className="px-3"
                >
                  {mins}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleLog} 
          variant="gradient" 
          className="w-full gap-2"
          disabled={!selectedSubject || !duration}
        >
          <Plus className="w-4 h-4" />
          Log Session / <span className="font-bengali">লগ করুন</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center p-4 rounded-xl bg-muted/50">
          <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{formatTime(todayTime)}</p>
          <p className="text-xs text-muted-foreground">
            Today / <span className="font-bengali">আজ</span>
          </p>
        </div>
        <div className="text-center p-4 rounded-xl bg-muted/50">
          <Clock className="w-5 h-5 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-foreground">{formatTime(weekTime)}</p>
          <p className="text-xs text-muted-foreground">
            This Week / <span className="font-bengali">এই সপ্তাহ</span>
          </p>
        </div>
      </div>
    </div>
  );
}
