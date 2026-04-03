import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, Pencil, Star, StarOff } from 'lucide-react';
import type { Subject } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRandomMessage } from '@/utils/congratulations';

interface SubjectCardProps {
  subject: Subject;
  onUpdateProgress: (id: string, completed: number) => void;
  onDelete: (id: string) => void;
  onEdit: (subject: Subject) => void;
  onTogglePriority?: (id: string, priority: number) => void;
}

export function SubjectCard({
  subject,
  onUpdateProgress,
  onDelete,
  onEdit,
  onTogglePriority
}: SubjectCardProps) {
  const progress = subject.total_chapters > 0 
    ? (subject.completed_chapters / subject.total_chapters) * 100 
    : 0;
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const isPriority = (subject as any).priority > 0;

  const handleProgressUpdate = (id: string, newCompleted: number) => {
    const wasComplete = subject.completed_chapters === subject.total_chapters;
    const willBeComplete = newCompleted === subject.total_chapters;
    const isIncrement = newCompleted > subject.completed_chapters;
    onUpdateProgress(id, newCompleted);

    if (isIncrement) {
      const message = getRandomMessage('chapterComplete', language);
      toast({ title: message, duration: 3000 });
      if (willBeComplete && !wasComplete) {
        setTimeout(() => {
          const subjectDoneMessage = getRandomMessage('subjectComplete', language);
          toast({ title: subjectDoneMessage, duration: 5000 });
        }, 1500);
      }
    }
  };

  return (
    <div className={cn(
      "glass-card p-5 group animate-slide-up relative overflow-hidden",
      isPriority && "ring-2 ring-primary/40"
    )}>
      {/* Colored accent bar */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: subject.color }}
      />

      <div className="flex items-start justify-between mb-4 pt-1">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold"
            style={{
              backgroundColor: `${subject.color}15`,
              color: subject.color,
              border: `1px solid ${subject.color}30`
            }}
          >
            {subject.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-tight">{subject.name}</h3>
            {subject.name_bn && (
              <p className="text-xs text-muted-foreground font-bengali mt-0.5">{subject.name_bn}</p>
            )}
          </div>
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {onTogglePriority && (
            <Button 
              variant="ghost" size="icon-sm" 
              onClick={() => onTogglePriority(subject.id, isPriority ? 0 : 1)} 
              className={cn("text-muted-foreground", isPriority && "text-accent")}
            >
              {isPriority ? <Star className="w-3.5 h-3.5 fill-current" /> : <StarOff className="w-3.5 h-3.5" />}
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(subject)} className="text-muted-foreground hover:text-primary">
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(subject.id)} className="text-destructive/70 hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{language === 'bn' ? 'অগ্রগতি' : 'Progress'}</span>
          <span className="font-medium text-foreground">
            {subject.completed_chapters}/{subject.total_chapters} {language === 'bn' ? 'অধ্যায়' : 'ch'}
          </span>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex items-center justify-between pt-1">
          <span className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-lg",
            progress === 100 
              ? "bg-success/10 text-success" 
              : progress >= 50 
                ? "bg-primary/10 text-primary" 
                : "bg-muted text-muted-foreground"
          )}>
            {progress.toFixed(0)}%
          </span>
          
          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" size="icon-sm" 
              onClick={() => handleProgressUpdate(subject.id, Math.max(0, subject.completed_chapters - 1))} 
              disabled={subject.completed_chapters === 0}
              className="h-7 w-7 rounded-lg"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Button 
              variant="default" size="icon-sm" 
              onClick={() => handleProgressUpdate(subject.id, subject.completed_chapters + 1)} 
              disabled={subject.completed_chapters >= subject.total_chapters}
              className="h-7 w-7 rounded-lg"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
