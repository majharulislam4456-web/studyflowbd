import { useState } from 'react';
 import { BookOpen, Timer, Target, TrendingUp, Star } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { SubjectCard } from '@/components/syllabus/SubjectCard';
import { EditSubjectDialog } from '@/components/syllabus/EditSubjectDialog';
import { GoalCard } from '@/components/goals/GoalCard';
import { EditGoalDialog } from '@/components/goals/EditGoalDialog';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { EditQuoteDialog } from '@/components/quotes/EditQuoteDialog';
import { TodoList, type Todo } from '@/components/todo/TodoList';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Subject, Goal, Quote } from '@/hooks/useSupabaseData';

interface DashboardViewProps {
  subjects: Subject[];
  goals: Goal[];
  quotes: Quote[];
  todos: Todo[];
  getTodayStudyTime: () => number;
  getWeekStudyTime: () => number;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
}

export function DashboardView({
  subjects,
  goals,
  quotes,
  todos,
  getTodayStudyTime,
  getWeekStudyTime,
  updateSubject,
  deleteSubject,
  updateGoal,
  deleteGoal,
  updateQuote,
  deleteQuote,
  updateTodo,
}: DashboardViewProps) {
  const { t, language } = useLanguage();
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [editQuote, setEditQuote] = useState<Quote | null>(null);

  const todayTime = getTodayStudyTime();
  const weekTime = getWeekStudyTime();
  
  const totalChapters = subjects.reduce((acc, s) => acc + s.total_chapters, 0);
  const completedChapters = subjects.reduce((acc, s) => acc + s.completed_chapters, 0);
  const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const activeGoals = goals.filter(g => !g.is_completed);
  const completedGoals = goals.filter(g => g.is_completed);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}${language === 'bn' ? 'মি' : 'm'}`;
    return `${hours}${language === 'bn' ? 'ঘ' : 'h'} ${mins}${language === 'bn' ? 'মি' : 'm'}`;
  };

  // Get a random quote for featured display
  const featuredQuote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : null;

   // Get top priority subjects first, then by progress
   const topSubjects = [...subjects]
     .sort((a, b) => {
       const priorityDiff = ((b as any).priority || 0) - ((a as any).priority || 0);
       if (priorityDiff !== 0) return priorityDiff;
       return (b.completed_chapters / b.total_chapters) - (a.completed_chapters / a.total_chapters);
     })
     .slice(0, 4);
 
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-bengali">
            {language === 'bn' ? 'স্বাগতম!' : 'Welcome back!'}
          </h1>
          <p className="text-muted-foreground mt-1 font-bengali">
            {language === 'bn' ? 'আপনার অগ্রগতি ট্র্যাক করুন এবং ফোকাসড থাকুন' : 'Track your progress and stay focused'}
          </p>
        </div>
        
        {/* Overall Progress Ring */}
        <div className="flex items-center gap-6">
          <ProgressRing progress={overallProgress} size={100} strokeWidth={8}>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{overallProgress.toFixed(0)}%</p>
              <p className="text-[10px] text-muted-foreground font-bengali">
                {language === 'bn' ? 'সম্পূর্ণ' : 'Overall'}
              </p>
            </div>
          </ProgressRing>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={t('subjects')}
          value={subjects.length}
          subtitle={`${completedChapters}/${totalChapters} ${language === 'bn' ? 'অধ্যায়' : 'chapters'}`}
          icon={BookOpen}
        />
        <StatsCard
          title={t('todayStudyTime')}
          value={formatTime(todayTime)}
          icon={Timer}
          iconClassName="bg-accent/10 text-accent"
        />
        <StatsCard
          title={language === 'bn' ? 'সক্রিয় লক্ষ্য' : 'Active Goals'}
          value={activeGoals.length}
          subtitle={`${completedGoals.length} ${language === 'bn' ? 'সম্পন্ন' : 'completed'}`}
          icon={Target}
          iconClassName="bg-success/10 text-success"
        />
        <StatsCard
          title={t('weekStudyTime')}
          value={formatTime(weekTime)}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          iconClassName="bg-info/10 text-info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subjects Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 font-bengali">
            <BookOpen className="w-5 h-5 text-primary" />
            {language === 'bn' ? 'আপনার বিষয়সমূহ' : 'Your Subjects'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
             {topSubjects.map((subject, index) => (
              <div key={subject.id} className={`stagger-${index + 1}`}>
                <SubjectCard
                  subject={subject}
                  onUpdateProgress={(id, completed) => updateSubject(id, { completed_chapters: completed })}
                  onDelete={deleteSubject}
                  onEdit={setEditSubject}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Goals, Tasks & Quote Column */}
        <div className="space-y-6">
          {/* Today's Tasks */}
          <div className="glass-card p-4">
            <TodoList
              todos={todos}
              addTodo={async () => {}}
              updateTodo={updateTodo}
              deleteTodo={async () => {}}
              compact
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 font-bengali">
              <Target className="w-5 h-5 text-primary" />
              {language === 'bn' ? 'সক্রিয় লক্ষ্য' : 'Active Goals'}
            </h2>
            {activeGoals.slice(0, 2).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={(id, progress) => updateGoal(id, { progress, is_completed: progress >= 100 })}
                onDelete={deleteGoal}
                onEdit={setEditGoal}
              />
            ))}
          </div>

          {/* Featured Quote */}
          {featuredQuote && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground font-bengali">
                {language === 'bn' ? 'দৈনিক অনুপ্রেরণা' : 'Daily Motivation'}
              </h2>
              <QuoteCard 
                quote={featuredQuote} 
                onDelete={deleteQuote} 
                onEdit={setEditQuote}
                featured 
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialogs */}
      <EditSubjectDialog
        subject={editSubject}
        open={!!editSubject}
        onOpenChange={(open) => !open && setEditSubject(null)}
        onSave={updateSubject}
      />
      <EditGoalDialog
        goal={editGoal}
        open={!!editGoal}
        onOpenChange={(open) => !open && setEditGoal(null)}
        onSave={updateGoal}
      />
      <EditQuoteDialog
        quote={editQuote}
        open={!!editQuote}
        onOpenChange={(open) => !open && setEditQuote(null)}
        onSave={updateQuote}
      />
    </div>
  );
}
