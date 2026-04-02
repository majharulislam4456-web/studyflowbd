import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Save, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { playStart, playPause, playSuccess } from '@/utils/sounds';
import { useGlobalStopwatch } from '@/contexts/StopwatchContext';
import type { Subject } from '@/hooks/useSupabaseData';

interface StopwatchProps {
  subjects: Subject[];
  onSaveSession: (data: { minutes: number; subjectId: string | null; notes: string }) => void;
}

export function Stopwatch({ subjects, onSaveSession }: StopwatchProps) {
  const { language } = useLanguage();
  const { time, isRunning, selectedSubject, notes, start, pause, reset, setSelectedSubject, setNotes, formattedTime } = useGlobalStopwatch();

  const handleStart = () => { playStart(); start(); };
  const handlePause = () => { playPause(); pause(); };
  const handleReset = () => { reset(); };

  const saveTime = () => {
    if (time >= 60) {
      playSuccess();
      onSaveSession({
        minutes: Math.floor(time / 60),
        subjectId: selectedSubject === 'none' ? null : selectedSubject,
        notes: notes.trim(),
      });
      reset();
    }
  };

  return (
    <div className="glass-card p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-accent/10 text-accent">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {language === 'bn' ? 'স্টপওয়াচ' : 'Stopwatch'}
          </h3>
          <p className="text-sm text-muted-foreground font-bengali">
            {language === 'bn' ? 'সময় ট্র্যাক করুন' : 'Track your time'}
          </p>
        </div>
        {isRunning && (
          <span className="ml-auto px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium animate-pulse">
            {language === 'bn' ? '● চলছে' : '● Running'}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-bengali text-sm">
          {language === 'bn' ? '📚 বিষয় নির্বাচন করুন' : '📚 Select Subject'}
        </Label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder={language === 'bn' ? 'বিষয় বেছে নিন' : 'Choose subject'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              {language === 'bn' ? 'সাধারণ পড়াশোনা' : 'General Study'}
            </SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {language === 'bn' && s.name_bn ? s.name_bn : s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <div className={cn(
          "text-5xl md:text-6xl font-mono font-bold text-center py-8",
          "bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl",
          "transition-all duration-300",
          isRunning && "animate-pulse-glow"
        )}>
          <span className={cn(
            "bg-clip-text text-transparent bg-gradient-to-r",
            isRunning ? "from-accent to-primary" : "from-foreground to-foreground"
          )}>
            {formattedTime}
          </span>
        </div>
        {isRunning && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={handleReset} className="rounded-full h-12 w-12">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button
          variant={isRunning ? "accent" : "gradient"}
          size="lg"
          onClick={isRunning ? handlePause : handleStart}
          className="rounded-full h-16 w-16 shadow-lg"
        >
          {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
        </Button>
        <Button variant="outline" size="icon" onClick={saveTime} disabled={time < 60} className="rounded-full h-12 w-12">
          <Save className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="font-bengali text-sm">
          {language === 'bn' ? '📝 কি পড়লাম / করলাম' : '📝 What did I study?'}
        </Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={language === 'bn' ? 'ছোট্ট নোট লিখো...' : 'Quick note...'}
          className="font-bengali resize-none"
          rows={2}
        />
      </div>

      <p className="text-center text-sm text-muted-foreground font-bengali">
        {time < 60
          ? (language === 'bn' ? '১ মিনিটের বেশি হলে সেভ করতে পারবেন' : 'Study for at least 1 min to save')
          : (language === 'bn' ? `${Math.floor(time / 60)} মিনিট সেভ করুন` : `Save ${Math.floor(time / 60)} minutes`)}
      </p>
    </div>
  );
}
