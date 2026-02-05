import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, Flag, Calendar, Zap, Pencil } from 'lucide-react';
import type { Goal } from '@/hooks/useSupabaseData';
 import { useToast } from '@/hooks/use-toast';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { getRandomMessage } from '@/utils/congratulations';

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (id: string, progress: number) => void;
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
}

export function GoalCard({ goal, onUpdateProgress, onDelete, onEdit }: GoalCardProps) {
   const { toast } = useToast();
   const { language } = useLanguage();
 
   const handleProgressUpdate = (id: string, progress: number) => {
     const wasComplete = goal.is_completed;
     const willBeComplete = progress >= 100;
     
     onUpdateProgress(id, progress);
     
     if (willBeComplete && !wasComplete) {
       setTimeout(() => {
         const message = getRandomMessage('goalComplete', language);
         toast({ title: message, duration: 5000 });
       }, 300);
     }
   };
 
  const getTypeInfo = () => {
    switch (goal.type) {
      case 'mission':
        return { 
          label: 'Mission', 
          labelBn: 'মিশন',
          icon: Flag, 
          color: 'bg-primary/10 text-primary border-primary/20' 
        };
      case 'weekly':
        return { 
          label: 'Weekly', 
          labelBn: 'সাপ্তাহিক',
          icon: Calendar, 
          color: 'bg-warning/10 text-warning border-warning/20' 
        };
      case 'short':
        return { 
          label: '3-Day', 
          labelBn: '৩ দিন',
          icon: Zap, 
          color: 'bg-success/10 text-success border-success/20' 
        };
    }
  };

  const typeInfo = getTypeInfo();
  const TypeIcon = typeInfo.icon;

  return (
    <div className={cn(
       "glass-card p-5 transition-all hover:shadow-lg group animate-fade-in",
       "hover:scale-[1.02]",
       goal.is_completed && "opacity-60 scale-100"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mb-3",
            typeInfo.color
          )}>
            <TypeIcon className="w-3 h-3" />
            {typeInfo.label} / <span className="font-bengali">{typeInfo.labelBn}</span>
          </div>
          <h3 className={cn(
            "font-semibold text-foreground",
            goal.is_completed && "line-through"
          )}>
            {goal.title}
          </h3>
          {goal.title_bn && (
            <p className="text-sm text-muted-foreground font-bengali mt-1">
              {goal.title_bn}
            </p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(goal)}
            className="text-muted-foreground hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(goal.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Progress value={goal.progress} className="h-2" />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {goal.days_remaining} days left / <span className="font-bengali">দিন বাকি</span>
          </span>
          <span className={cn(
            "font-medium",
            goal.progress >= 100 ? "text-success" : "text-foreground"
          )}>
            {goal.progress}%
          </span>
        </div>

        {!goal.is_completed && (
          <div className="flex gap-2 pt-2">
            {[25, 50, 75, 100].map((value) => (
              <Button
                key={value}
                variant={goal.progress >= value ? "default" : "outline"}
                size="sm"
                 onClick={() => handleProgressUpdate(goal.id, value)}
                className="flex-1 text-xs"
              >
                {value}%
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
