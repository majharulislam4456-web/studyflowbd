import { useState } from 'react';
import { Target, Flag, Calendar, Zap, CheckCircle2, ListTodo } from 'lucide-react';
import { GoalCard } from '@/components/goals/GoalCard';
import { AddGoalDialog } from '@/components/goals/AddGoalDialog';
import { EditGoalDialog } from '@/components/goals/EditGoalDialog';
import { TodoList, type Todo } from '@/components/todo/TodoList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Goal } from '@/hooks/useSupabaseData';

interface GoalsViewProps {
  goals: Goal[];
  todos: Todo[];
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export function GoalsView({
  goals, todos, addGoal, updateGoal, deleteGoal, addTodo, updateTodo, deleteTodo,
}: GoalsViewProps) {
  const { t, language } = useLanguage();
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  
  const missions = goals.filter(g => g.type === 'mission' && !g.is_completed);
  const weekly = goals.filter(g => g.type === 'weekly' && !g.is_completed);
  const shortTerm = goals.filter(g => g.type === 'short' && !g.is_completed);
  const completed = goals.filter(g => g.is_completed);

  const handleUpdateProgress = (id: string, progress: number) => {
    updateGoal(id, { progress, is_completed: progress >= 100 });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <div className="p-2 rounded-xl bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            {language === 'bn' ? 'লক্ষ্য ব্যবস্থাপক' : 'Goal Manager'}
          </h1>
          <p className="page-subtitle">
            {language === 'bn' ? 'আপনার লক্ষ্যসমূহ ট্র্যাক করুন' : 'Track your goals'}
          </p>
        </div>
        <AddGoalDialog onAdd={addGoal} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { icon: Flag, value: missions.length, label: t('mission'), color: 'text-primary', bg: 'bg-primary/8' },
          { icon: Calendar, value: weekly.length, label: t('weekly'), color: 'text-warning', bg: 'bg-warning/8' },
          { icon: Zap, value: shortTerm.length, label: t('shortTerm'), color: 'text-success', bg: 'bg-success/8' },
          { icon: ListTodo, value: todos.filter(t => !t.is_completed).length, label: t('todoList'), color: 'text-info', bg: 'bg-info/8' },
          { icon: CheckCircle2, value: completed.length, label: t('completed'), color: 'text-muted-foreground', bg: 'bg-muted' },
        ].map((stat, i) => (
          <div key={i} className="stat-card p-4 text-center">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} mx-auto mb-2 flex items-center justify-center`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground font-bengali mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="goals" className="font-bengali">{t('goals')}</TabsTrigger>
          <TabsTrigger value="todos" className="font-bengali">{t('todoList')}</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="all">{language === 'bn' ? 'সব' : 'All'}</TabsTrigger>
              <TabsTrigger value="missions">{language === 'bn' ? 'মিশন' : 'Missions'}</TabsTrigger>
              <TabsTrigger value="weekly">{language === 'bn' ? 'সাপ্তাহিক' : 'Weekly'}</TabsTrigger>
              <TabsTrigger value="short">{language === 'bn' ? 'স্বল্প' : 'Short'}</TabsTrigger>
            </TabsList>

            {[
              { value: 'all', items: goals.filter(g => !g.is_completed) },
              { value: 'missions', items: missions },
              { value: 'weekly', items: weekly },
              { value: 'short', items: shortTerm },
            ].map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tab.items.map((goal) => (
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
            ))}
          </Tabs>

          {goals.filter(g => !g.is_completed).length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1 font-bengali">
                {language === 'bn' ? 'কোনো সক্রিয় লক্ষ্য নেই' : 'No active goals'}
              </h3>
              <p className="text-sm text-muted-foreground font-bengali">
                {language === 'bn' ? 'অনুপ্রাণিত থাকতে প্রথম লক্ষ্য তৈরি করুন' : 'Create your first goal to stay motivated'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="todos">
          <div className="glass-card p-6">
            <TodoList
              todos={todos}
              addTodo={addTodo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
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
