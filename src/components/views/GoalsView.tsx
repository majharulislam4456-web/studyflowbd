import { useState } from 'react';
import { Target, Flag, Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { GoalCard } from '@/components/goals/GoalCard';
import { AddGoalDialog } from '@/components/goals/AddGoalDialog';
import { EditGoalDialog } from '@/components/goals/EditGoalDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Goal } from '@/hooks/useSupabaseData';

interface GoalsViewProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

export function GoalsView({
  goals,
  addGoal,
  updateGoal,
  deleteGoal,
}: GoalsViewProps) {
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  
  const missions = goals.filter(g => g.type === 'mission' && !g.is_completed);
  const weekly = goals.filter(g => g.type === 'weekly' && !g.is_completed);
  const shortTerm = goals.filter(g => g.type === 'short' && !g.is_completed);
  const completed = goals.filter(g => g.is_completed);

  const handleUpdateProgress = (id: string, progress: number) => {
    updateGoal(id, { progress, is_completed: progress >= 100 });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Goal Manager
          </h1>
          <p className="text-muted-foreground mt-1 font-bengali">
            লক্ষ্য ব্যবস্থাপক - আপনার লক্ষ্যসমূহ ট্র্যাক করুন
          </p>
        </div>
        <AddGoalDialog onAdd={addGoal} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <Flag className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{missions.length}</p>
          <p className="text-xs text-muted-foreground">Missions / <span className="font-bengali">মিশন</span></p>
        </div>
        <div className="glass-card p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-warning" />
          <p className="text-2xl font-bold text-foreground">{weekly.length}</p>
          <p className="text-xs text-muted-foreground">Weekly / <span className="font-bengali">সাপ্তাহিক</span></p>
        </div>
        <div className="glass-card p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-success" />
          <p className="text-2xl font-bold text-foreground">{shortTerm.length}</p>
          <p className="text-xs text-muted-foreground">Short-term / <span className="font-bengali">স্বল্পমেয়াদী</span></p>
        </div>
        <div className="glass-card p-4 text-center">
          <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-2xl font-bold text-foreground">{completed.length}</p>
          <p className="text-xs text-muted-foreground">Completed / <span className="font-bengali">সম্পন্ন</span></p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="missions">Missions</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="short">Short</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.filter(g => !g.is_completed).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleUpdateProgress}
                onDelete={deleteGoal}
                onEdit={setEditGoal}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="missions" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleUpdateProgress}
                onDelete={deleteGoal}
                onEdit={setEditGoal}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weekly.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleUpdateProgress}
                onDelete={deleteGoal}
                onEdit={setEditGoal}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="short" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shortTerm.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleUpdateProgress}
                onDelete={deleteGoal}
                onEdit={setEditGoal}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {goals.filter(g => !g.is_completed).length === 0 && (
        <div className="text-center py-16">
          <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No active goals / <span className="font-bengali">কোনো সক্রিয় লক্ষ্য নেই</span>
          </h3>
          <p className="text-muted-foreground">
            Create your first goal to stay motivated / <span className="font-bengali">অনুপ্রাণিত থাকতে প্রথম লক্ষ্য তৈরি করুন</span>
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <EditGoalDialog
        goal={editGoal}
        open={!!editGoal}
        onOpenChange={(open) => !open && setEditGoal(null)}
        onSave={updateGoal}
      />
    </div>
  );
}
