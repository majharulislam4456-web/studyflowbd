import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Milestone } from '@/hooks/useSupabaseData';

interface MilestoneListProps {
  goalId: string;
  milestones: Milestone[];
  onAdd: (milestone: Omit<Milestone, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onUpdate: (id: string, updates: Partial<Milestone>) => void;
  onDelete: (id: string) => void;
}

export function MilestoneList({ goalId, milestones, onAdd, onUpdate, onDelete }: MilestoneListProps) {
  const { language } = useLanguage();
  const [newTitle, setNewTitle] = useState('');
  const isBn = language === 'bn';

  const goalMilestones = milestones
    .filter(m => m.goal_id === goalId)
    .sort((a, b) => a.sort_order - b.sort_order);

  const completedCount = goalMilestones.filter(m => m.is_completed).length;
  const progress = goalMilestones.length > 0 ? Math.round((completedCount / goalMilestones.length) * 100) : 0;

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAdd({
      goal_id: goalId,
      title: newTitle.trim(),
      title_bn: null,
      is_completed: false,
      sort_order: goalMilestones.length,
    });
    setNewTitle('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {isBn ? 'মাইলস্টোন' : 'Milestones'} ({completedCount}/{goalMilestones.length})
        </p>
        {goalMilestones.length > 0 && (
          <span className="text-xs font-bold text-primary">{progress}%</span>
        )}
      </div>

      {goalMilestones.map((m) => (
        <div key={m.id} className={cn(
          "flex items-center gap-2 p-2 rounded-lg bg-muted/30 group transition-all",
          m.is_completed && "opacity-60"
        )}>
          <Checkbox
            checked={m.is_completed}
            onCheckedChange={(checked) => onUpdate(m.id, { is_completed: !!checked })}
          />
          <span className={cn("text-sm flex-1", m.is_completed && "line-through text-muted-foreground")}>
            {isBn && m.title_bn ? m.title_bn : m.title}
          </span>
          <Button
            variant="ghost" size="icon"
            onClick={() => onDelete(m.id)}
            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder={isBn ? 'নতুন মাইলস্টোন...' : 'New milestone...'}
          className="h-8 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button size="sm" variant="outline" onClick={handleAdd} className="h-8 px-2">
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
