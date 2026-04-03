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
        return { label: 'Mission', labelBn: 'মিশন', icon: Flag, color: 'text-primary', bg: 'bg-primary/8', border: 'border-primary/20' };
      case 'weekly':
        return { label: 'Weekly', labelBn: 'সাপ্তাহিক', icon: Calendar, color: 'text-warning', bg: 'bg-warning/8', border: 'border-warning/20' };
      case 'short':
        return { label: '3-Day', labelBn: '৩ দিন', icon: Zap, color: 'text-success', bg: 'bg-success/8', border: 'border-success/20' };
      default:
        return { label: 'Goal', labelBn: 'লক্ষ্য', icon: Flag, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-muted' };
    }
  };

  const typeInfo = getTypeInfo();
  const TypeIcon = typeInfo.icon;
  const urgency = goal.days_remaining <= 1 ? 'urgent' : goal.days_remaining <= 3 ? 'soon' : 'normal';

  return (
    <div className={cn(
      "glass-card p-5 group animate-slide-up relative overflow-hidden",
      goal.is_completed && "opacity-60"
    )}>
      {/* Type color accent */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-2xl",
        goal.type === 'mission' ? 'bg-primary' : goal.type === 'weekly' ? 'bg-warning' : 'bg-success'
      )} />

      <div className="flex items-start justify-between mb-4 pt-1">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
              typeInfo.bg, typeInfo.color, typeInfo.border
            )}>
              <TypeIcon className="w-3 h-3" />
              {language === 'bn' ? typeInfo.labelBn : typeInfo.label}
            </div>
            {urgency === 'urgent' && !goal.is_completed && (
              <span className="badge-destructive text-[11px] animate-pulse">
                🔥 {language === 'bn' ? 'জরুরি!' : 'Urgent!'}
              </span>
            )}
            {urgency === 'soon' && !goal.is_completed && (
              <span className="badge-warning text-[11px]">
                ⏰ {language === 'bn' ? 'শীঘ্রই' : 'Soon'}
              </span>
            )}
          </div>
          <h3 className={cn(
            "font-semibold text-foreground text-base leading-snug",
            goal.is_completed && "line-through"
          )}>
            {goal.title}
          </h3>
          {goal.title_bn && (
            <p className="text-xs text-muted-foreground font-bengali mt-1">{goal.title_bn}</p>
          )}
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(goal)} className="text-muted-foreground hover:text-primary">
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(goal.id)} className="text-destructive/70 hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Progress value={goal.progress} className="h-2" />
          {goal.progress > 0 && goal.progress < 100 && (
            <TrendingUp className="absolute -top-1 -right-1 w-3.5 h-3.5 text-primary animate-bounce" />
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className={cn(
            "text-xs text-muted-foreground font-bengali",
            urgency === 'urgent' && !goal.is_completed && "text-destructive font-medium"
          )}>
            {goal.days_remaining} {language === 'bn' ? 'দিন বাকি' : 'days left'}
          </span>
          <span className={cn(
            "font-bold text-base tabular-nums",
            goal.progress >= 100 ? "text-success" : goal.progress >= 75 ? "text-primary" : "text-foreground"
          )}>
            {goal.progress}%
          </span>
        </div>

        {!goal.is_completed && (
          <div className="flex gap-1.5 pt-1">
            {[25, 50, 75, 100].map((value) => (
              <Button
                key={value}
                variant={goal.progress >= value ? "default" : "outline"}
                size="sm"
                onClick={() => handleProgressUpdate(goal.id, value)}
                className={cn(
                  "flex-1 text-[11px] font-semibold h-8 rounded-lg",
                  value === 100 && goal.progress < 100 && "border-primary/40"
                )}
              >
                {value}%
              </Button>
            ))}
          </div>
        )}

        {goal.is_completed && (
          <div className="text-center py-1">
            <span className="badge-success text-xs">✅ {language === 'bn' ? 'সম্পন্ন!' : 'Completed!'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
