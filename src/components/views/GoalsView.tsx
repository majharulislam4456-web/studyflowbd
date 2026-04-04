import { useState } from 'react';
import { Target, Flag, Calendar, CheckCircle2, Plus } from 'lucide-react';
import { GoalCard } from '@/components/goals/GoalCard';
import { AddGoalDialog } from '@/components/goals/AddGoalDialog';
import { EditGoalDialog } from '@/components/goals/EditGoalDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Goal, Milestone } from '@/hooks/useSupabaseData';

interface GoalsViewProps {
  goals: Goal[];
  milestones: Milestone[];
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addMilestone: (milestone: Omit<Milestone, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
}

export function GoalsView({
  goals, milestones, addGoal, updateGoal, deleteGoal,
  addMilestone, updateMilestone, deleteMilestone,
}: GoalsViewProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  
  const activeGoals = goals.filter(g => !g.is_completed);
  const completed = goals.filter(g => g.is_completed);

  const handleUpdateProgress = (id: string, progress: number) => {
    updateGoal(id, { progress, is_completed: progress >= 100 });
  };

  // Auto-calculate progress from milestones
  const getGoalProgress = (goalId: string) => {
    const goalMilestones = milestones.filter(m => m.goal_id === goalId);
    if (goalMilestones.length === 0) return null;
    const completed = goalMilestones.filter(m => m.is_completed).length;
    return Math.round((completed / goalMilestones.length) * 100);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <div className="p-2 rounded-xl bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            {isBn ? 'লক্ষ্য ব্যবস্থাপক' : 'Goal Manager'}
          </h1>
          <p className="page-subtitle">
            {isBn ? 'আপনার লক্ষ্যসমূহ ট্র্যাক করুন' : 'Track your goals & milestones'}
          </p>
        </div>
        <AddGoalDialog onAdd={addGoal} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card p-4 text-center">
          <div className="w-9 h-9 rounded-xl bg-primary/8 text-primary mx-auto mb-2 flex items-center justify-center">
            <Flag className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{activeGoals.length}</p>
          <p className="text-[11px] text-muted-foreground font-bengali">{isBn ? 'সক্রিয়' : 'Active'}</p>
        </div>
        <div className="stat-card p-4 text-center">
          <div className="w-9 h-9 rounded-xl bg-success/8 text-success mx-auto mb-2 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{completed.length}</p>
          <p className="text-[11px] text-muted-foreground font-bengali">{isBn ? 'সম্পন্ন' : 'Completed'}</p>
        </div>
        <div className="stat-card p-4 text-center">
          <div className="w-9 h-9 rounded-xl bg-warning/8 text-warning mx-auto mb-2 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{milestones.filter(m => !m.is_completed).length}</p>
          <p className="text-[11px] text-muted-foreground font-bengali">{isBn ? 'মাইলস্টোন' : 'Milestones'}</p>
        </div>
      </div>

      {/* Goals Grid */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="active">{isBn ? 'সক্রিয়' : 'Active'} ({activeGoals.length})</TabsTrigger>
          <TabsTrigger value="completed">{isBn ? 'সম্পন্ন' : 'Completed'} ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeGoals.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1 font-bengali">
                {isBn ? 'কোনো সক্রিয় লক্ষ্য নেই' : 'No active goals'}
              </h3>
              <p className="text-sm text-muted-foreground font-bengali">
                {isBn ? 'প্রথম লক্ষ্য তৈরি করুন' : 'Create your first goal'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  milestones={milestones.filter(m => m.goal_id === goal.id)}
                  onUpdateProgress={handleUpdateProgress}
                  onDelete={deleteGoal}
                  onEdit={setEditGoal}
                  onAddMilestone={addMilestone}
                  onUpdateMilestone={updateMilestone}
                  onDeleteMilestone={deleteMilestone}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                milestones={milestones.filter(m => m.goal_id === goal.id)}
                onUpdateProgress={handleUpdateProgress}
                onDelete={deleteGoal}
                onEdit={setEditGoal}
                onAddMilestone={addMilestone}
                onUpdateMilestone={updateMilestone}
                onDeleteMilestone={deleteMilestone}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <EditGoalDialog
        goal={editGoal}
        open={!!editGoal}
        onOpenChange={(open) => !open && setEditGoal(null)}
        onSave={updateGoal}
      />
    </div>
  );
}
