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
  const progress = subject.completed_chapters / subject.total_chapters * 100;
  const {
    toast
  } = useToast();
  const {
    language
  } = useLanguage();
  const isPriority = (subject as any).priority > 0;
  const handleProgressUpdate = (id: string, newCompleted: number) => {
    const wasComplete = subject.completed_chapters === subject.total_chapters;
    const willBeComplete = newCompleted === subject.total_chapters;
    const isIncrement = newCompleted > subject.completed_chapters;
    onUpdateProgress(id, newCompleted);

    // Show congratulation messages
    if (isIncrement) {
      const message = getRandomMessage('chapterComplete', language);
      toast({
        title: message,
        duration: 3000
      });
      if (willBeComplete && !wasComplete) {
        setTimeout(() => {
          const subjectDoneMessage = getRandomMessage('subjectComplete', language);
          toast({
            title: subjectDoneMessage,
            duration: 5000
          });
        }, 1500);
      }
    }
  };
  return <div className={cn("glass-card p-5 transition-all hover:shadow-lg group animate-fade-in", "hover:scale-[1.02]", isPriority && "ring-2 ring-primary/50")}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-md" style={{
          backgroundColor: `${subject.color}20`,
          color: subject.color
        }}>
            {subject.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{subject.name}</h3>
            {subject.name_bn && <p className="text-sm text-muted-foreground font-bengali">{subject.name_bn}</p>}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           {onTogglePriority && <Button variant="ghost" size="icon-sm" onClick={() => onTogglePriority(subject.id, isPriority ? 0 : 1)} className={cn("text-muted-foreground", isPriority && "text-amber-500")} title={isPriority ? 'Remove from top' : 'Show at top'}>
               {isPriority ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
             </Button>}
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(subject)} className="text-muted-foreground hover:text-primary">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(subject.id)} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Progress  
  
          </span>
          <span className="font-medium text-foreground">
            {subject.completed_chapters}/{subject.total_chapters} chapters
          </span>
        </div>

        <Progress value={progress} className="h-3" />

        <div className="flex items-center justify-between pt-2">
          <span className={cn("text-sm font-medium px-2 py-1 rounded-lg", progress === 100 ? "bg-success/20 text-success" : progress >= 50 ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground")}>
            {progress.toFixed(0)}% Complete
          </span>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" onClick={() => handleProgressUpdate(subject.id, Math.max(0, subject.completed_chapters - 1))} disabled={subject.completed_chapters === 0}>
              <Minus className="w-3 h-3" />
            </Button>
            <Button variant="default" size="icon-sm" onClick={() => handleProgressUpdate(subject.id, subject.completed_chapters + 1)} disabled={subject.completed_chapters >= subject.total_chapters}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}