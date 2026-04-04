import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, Flag, Calendar, Pencil, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { MilestoneList } from '@/components/goals/MilestoneList';
import type { Goal, Milestone } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRandomMessage } from '@/utils/congratulations';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  milestones: Milestone[];
  onUpdateProgress: (id: string, progress: number) => void;
  onDelete: (id: string) => void;
  onEdit: (goal: Goal) => void;
  onAddMilestone: (milestone: Omit<Milestone, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onUpdateMilestone: (id: string, updates: Partial<Milestone>) => void;
  onDeleteMilestone: (id: string) => void;
}

export function GoalCard({ goal, milestones, onUpdateProgress, onDelete, onEdit, onAddMilestone, onUpdateMilestone, onDeleteMilestone }: GoalCardProps) {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [showMilestones, setShowMilestones] = useState(false);
  const isBn = language === 'bn';

  const handleProgressUpdate = (id: string, progress: number) => {
    const wasComplete = goal.is_completed;
    onUpdateProgress(id, progress);
    if (progress >= 100 && !wasComplete) {
      setTimeout(() => {
        const message = getRandomMessage('goalComplete', language);
        toast({ title: message, duration: 5000 });
      }, 300);
    }
  };

  const daysLeft = goal.deadline 
    ? Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : goal.days_remaining;

  const urgency = daysLeft <= 1 ? 'urgent' : daysLeft <= 3 ? 'soon' : 'normal';

  const milestoneProgress = milestones.length > 0
    ? Math.round((milestones.filter(m => m.is_completed).length / milestones.length) * 100)
    : null;

  const displayProgress = milestoneProgress !== null ? milestoneProgress : goal.progress;

  return (
    <div className={cn(
      "glass-card p-5 group animate-slide-up relative overflow-hidden",
      goal.is_completed && "opacity-60"
    )}>
      {/* Color accent */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-2xl",
        goal.type === 'mission' ? 'bg-primary' : goal.type === 'weekly' ? 'bg-warning' : 'bg-success'
      )} />

      <div className="flex items-start justify-between mb-3 pt-1">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {urgency === 'urgent' && !goal.is_completed && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold animate-pulse">
                🔥 {isBn ? 'জরুরি!' : 'Urgent!'}
              </span>
            )}
            {urgency === 'soon' && !goal.is_completed && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-warning/10 text-warning font-semibold">
                ⏰ {isBn ? 'শীঘ্রই' : 'Soon'}
              </span>
            )}
          </div>
          <h3 className={cn("font-semibold text-foreground text-base leading-snug", goal.is_completed && "line-through")}>
            {isBn && goal.title_bn ? goal.title_bn : goal.title}
          </h3>
          {goal.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{goal.description}</p>
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
          <Progress value={displayProgress} className="h-2" />
          {displayProgress > 0 && displayProgress < 100 && (
            <TrendingUp className="absolute -top-1 -right-1 w-3.5 h-3.5 text-primary animate-bounce" />
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {goal.deadline && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(goal.deadline).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            <span className={cn(
              "text-xs text-muted-foreground",
              urgency === 'urgent' && !goal.is_completed && "text-destructive font-medium"
            )}>
              {daysLeft} {isBn ? 'দিন বাকি' : 'days left'}
            </span>
          </div>
          <span className={cn(
            "font-bold text-base tabular-nums",
            displayProgress >= 100 ? "text-success" : displayProgress >= 75 ? "text-primary" : "text-foreground"
          )}>
            {displayProgress}%
          </span>
        </div>

        {/* Progress buttons */}
        {!goal.is_completed && milestones.length === 0 && (
          <div className="flex gap-1.5 pt-1">
            {[25, 50, 75, 100].map((value) => (
              <Button key={value} variant={displayProgress >= value ? "default" : "outline"} size="sm"
                onClick={() => handleProgressUpdate(goal.id, value)}
                className="flex-1 text-[11px] font-semibold h-8 rounded-lg">
                {value}%
              </Button>
            ))}
          </div>
        )}

        {/* Milestones toggle */}
        <button onClick={() => setShowMilestones(!showMilestones)}
          className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
          {showMilestones ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {isBn ? 'মাইলস্টোন' : 'Milestones'} ({milestones.length})
        </button>

        {showMilestones && (
          <MilestoneList
            goalId={goal.id}
            milestones={milestones}
            onAdd={onAddMilestone}
            onUpdate={onUpdateMilestone}
            onDelete={onDeleteMilestone}
          />
        )}

        {goal.is_completed && (
          <div className="text-center py-1">
            <span className="text-xs px-3 py-1 rounded-full bg-success/10 text-success font-semibold">
              ✅ {isBn ? 'সম্পন্ন!' : 'Completed!'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
