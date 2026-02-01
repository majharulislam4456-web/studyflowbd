import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';
import type { Subject } from '@/types/study';

interface SubjectCardProps {
  subject: Subject;
  onUpdateProgress: (id: string, completed: number) => void;
  onDelete: (id: string) => void;
}

export function SubjectCard({ subject, onUpdateProgress, onDelete }: SubjectCardProps) {
  const progress = (subject.completedChapters / subject.totalChapters) * 100;

  return (
    <div className="glass-card p-5 transition-smooth hover:shadow-lg group animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-md"
            style={{ 
              backgroundColor: `${subject.color}20`,
              color: subject.color 
            }}
          >
            {subject.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{subject.name}</h3>
            {subject.nameBn && (
              <p className="text-sm text-muted-foreground font-bengali">{subject.nameBn}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(subject.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Progress / <span className="font-bengali">অগ্রগতি</span>
          </span>
          <span className="font-medium text-foreground">
            {subject.completedChapters}/{subject.totalChapters} chapters
          </span>
        </div>

        <Progress 
          value={progress} 
          className="h-3"
          style={{
            ['--progress-color' as any]: subject.color
          }}
        />

        <div className="flex items-center justify-between pt-2">
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded-lg",
            progress === 100 
              ? "bg-success/20 text-success" 
              : progress >= 50 
                ? "bg-warning/20 text-warning" 
                : "bg-muted text-muted-foreground"
          )}>
            {progress.toFixed(0)}% Complete
          </span>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onUpdateProgress(subject.id, Math.max(0, subject.completedChapters - 1))}
              disabled={subject.completedChapters === 0}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Button
              variant="default"
              size="icon-sm"
              onClick={() => onUpdateProgress(subject.id, subject.completedChapters + 1)}
              disabled={subject.completedChapters >= subject.totalChapters}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
