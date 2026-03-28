import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, Flag, Calendar, Zap, Pencil, TrendingUp } from 'lucide-react';
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
        return { label: 'Mission', labelBn: 'মিশন', icon: Flag, color: 'bg-primary/10 text-primary border-primary/20', gradient: 'from-primary/5 to-transparent' };
      case 'weekly':
        return { label: 'Weekly', labelBn: 'সাপ্তাহিক', icon: Calendar, color: 'bg-warning/10 text-warning border-warning/20', gradient: 'from-warning/5 to-transparent' };
      case 'short':
        return { label: '3-Day', labelBn: '৩ দিন', icon: Zap, color: 'bg-success/10 text-success border-success/20', gradient: 'from-success/5 to-transparent' };
      default:
        return { label: 'Goal', labelBn: 'লক্ষ্য', icon: Flag, color: 'bg-muted text-muted-foreground border-muted', gradient: 'from-muted/5 to-transparent' };
    }
  };

  const typeInfo = getTypeInfo();
  const TypeIcon = typeInfo.icon;
  const urgency = goal.days_remaining <= 1 ? 'urgent' : goal.days_remaining <= 3 ? 'soon' : 'normal';

  return (
    <div className={cn(
      "glass-card p-5 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 group animate-slide-up",
      "bg-gradient-to-br", typeInfo.gradient,
      goal.is_completed && "opacity-60"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", typeInfo.color)}>
              <TypeIcon className="w-3 h-3" />
              {language === 'bn' ? typeInfo.labelBn : typeInfo.label}
            </div>
            {urgency === 'urgent' && !goal.is_completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium animate-pulse">
                🔥 {language === 'bn' ? 'জরুরি!' : 'Urgent!'}
              </span>
            )}
            {urgency === 'soon' && !goal.is_completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
                ⏰ {language === 'bn' ? 'শীঘ্রই' : 'Soon'}
              </span>
            )}
          </div>
          <h3 className={cn("font-semibold text-foreground text-lg", goal.is_completed && "line-through")}>
            {goal.title}
          </h3>
          {goal.title_bn && (
            <p className="text-sm text-muted-foreground font-bengali mt-1">{goal.title_bn}</p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(goal)} className="text-muted-foreground hover:text-primary">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(goal.id)} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Progress value={goal.progress} className="h-3" />
          {goal.progress > 0 && goal.progress < 100 && (
            <TrendingUp className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-bounce" />
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className={cn("text-muted-foreground font-bengali",
            urgency === 'urgent' && !goal.is_completed && "text-destructive font-medium"
          )}>
            {goal.days_remaining} {language === 'bn' ? 'দিন বাকি' : 'days left'}
          </span>
          <span className={cn("font-bold text-lg",
            goal.progress >= 100 ? "text-success" : goal.progress >= 75 ? "text-primary" : "text-foreground"
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
                className={cn("flex-1 text-xs font-medium",
                  value === 100 && goal.progress < 100 && "border-primary/50"
                )}
              >
                {value}%
              </Button>
            ))}
          </div>
        )}

        {goal.is_completed && (
          <div className="text-center py-1">
            <span className="text-sm text-success font-bengali font-medium">✅ {language === 'bn' ? 'সম্পন্ন!' : 'Completed!'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
