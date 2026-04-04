import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { BookOpen, Timer, Target, TrendingUp, Sparkles, Flame, Trophy, Bell } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { SubjectCard } from '@/components/syllabus/SubjectCard';
import { EditSubjectDialog } from '@/components/syllabus/EditSubjectDialog';
import { GoalCard } from '@/components/goals/GoalCard';
import { EditGoalDialog } from '@/components/goals/EditGoalDialog';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import { EditQuoteDialog } from '@/components/quotes/EditQuoteDialog';
import { TodoList, type Todo } from '@/components/todo/TodoList';
import { DailyTaskList, type DailyTask } from '@/components/dashboard/DailyTaskList';
import { WeeklyStudyChart } from '@/components/dashboard/WeeklyStudyChart';
import { DashboardSettings, useDashboardConfig } from '@/components/settings/DashboardSettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateStreak } from '@/utils/streak';
import { differenceInSeconds } from 'date-fns';
import type { Subject, Goal, Quote, StudySession, Syllabus } from '@/hooks/useSupabaseData';

const DEFAULT_QUOTES: Quote[] = [
  { id: 'default-1', user_id: '', text: 'সফলতা চূড়ান্ত নয়, ব্যর্থতা মারাত্মক নয়: চালিয়ে যাওয়ার সাহসই গুরুত্বপূর্ণ।', author: 'Winston Churchill', is_bengali: true, created_at: '' },
  { id: 'default-2', user_id: '', text: 'শিক্ষার শেকড়ের স্বাদ তিক্ত হলেও এর ফল মিষ্টি।', author: 'Aristotle', is_bengali: true, created_at: '' },
  { id: 'default-3', user_id: '', text: 'তুমি যদি স্বপ্ন দেখতে পারো, তুমি তা করতেও পারো।', author: 'Walt Disney', is_bengali: true, created_at: '' },
  { id: 'default-4', user_id: '', text: 'কঠোর পরিশ্রম প্রতিভাকে হারায় যখন প্রতিভা কঠোর পরিশ্রম করে না।', author: 'Tim Notke', is_bengali: true, created_at: '' },
  { id: 'default-5', user_id: '', text: 'আজকের পড়াশোনা আগামীর সাফল্য।', author: '', is_bengali: true, created_at: '' },
  { id: 'default-6', user_id: '', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', is_bengali: false, created_at: '' },
  { id: 'default-7', user_id: '', text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela', is_bengali: false, created_at: '' },
];

interface ExamReminder {
  id: string;
  title: string;
  title_bn: string | null;
  exam_date: string;
}

interface DashboardViewProps {
  subjects: Subject[];
  syllabuses: Syllabus[];
  goals: Goal[];
  quotes: Quote[];
  todos: Todo[];
  dailyTasks: DailyTask[];
  sessions: StudySession[];
  examReminders: ExamReminder[];
  getTodayStudyTime: () => number;
  getWeekStudyTime: () => number;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  addDailyTask: (task: Omit<DailyTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDailyTask: (id: string, updates: Partial<DailyTask>) => Promise<void>;
  deleteDailyTask: (id: string) => Promise<void>;
}

function UpcomingExamCountdown({ reminder }: { reminder: ExamReminder }) {
  const [now, setNow] = useState(new Date());
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const examDate = new Date(reminder.exam_date);
  const totalSecs = differenceInSeconds(examDate, now);
  if (totalSecs <= 0) return null;

  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const boxes = [
    { value: days.toString().padStart(2, '0'), label: t('days') },
    { value: hours.toString().padStart(2, '0'), label: t('hours') },
    { value: mins.toString().padStart(2, '0'), label: t('minutes') },
    { value: secs.toString().padStart(2, '0'), label: t('seconds') },
  ];

  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="relative">
        <div className="text-center mb-4">
          <p className="text-xs font-semibold text-primary font-bengali flex items-center justify-center gap-2 uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" />
            {t('nextExam')}: {reminder.title_bn || reminder.title}
          </p>
        </div>
        <div className="flex justify-center gap-3">
          {boxes.map((box, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl border border-border/80 bg-background/60 flex items-center justify-center">
                <span className="text-xl font-bold text-foreground tabular-nums">{box.value}</span>
              </div>
              <span className="text-[9px] font-semibold text-muted-foreground mt-1.5 uppercase tracking-widest">{box.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardView({
  subjects, syllabuses, goals, quotes, todos, dailyTasks, sessions, examReminders,
  getTodayStudyTime, getWeekStudyTime,
  updateSubject, deleteSubject, updateGoal, deleteGoal,
  updateQuote, deleteQuote, updateTodo,
  addDailyTask, updateDailyTask, deleteDailyTask,
}: DashboardViewProps) {
  const { t, language } = useLanguage();
  const { config, updateConfig } = useDashboardConfig();
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [editQuote, setEditQuote] = useState<Quote | null>(null);

  const todayTime = getTodayStudyTime();
  const weekTime = getWeekStudyTime();

  const dashboardSubjects = config.selectedSyllabusIds.length > 0
    ? subjects.filter(s => s.syllabus_id && config.selectedSyllabusIds.includes(s.syllabus_id))
    : subjects;
  
  const totalChapters = dashboardSubjects.reduce((acc, s) => acc + s.total_chapters, 0);
  const completedChapters = dashboardSubjects.reduce((acc, s) => acc + s.completed_chapters, 0);
  const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const activeGoals = goals.filter(g => !g.is_completed);
  const completedGoals = goals.filter(g => g.is_completed);
  const currentStreak = calculateStreak(sessions);

  const upcomingExam = useMemo(() => {
    const now = new Date();
    return examReminders
      .filter(r => new Date(r.exam_date) > now)
      .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())[0] || null;
  }, [examReminders]);

  const featuredQuote = useMemo(() => {
    const allQuotes = quotes.length > 0 ? quotes : DEFAULT_QUOTES;
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % allQuotes.length;
    return allQuotes[dayIndex];
  }, [quotes]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}${t('minute')}`;
    return `${hours}${t('hour')} ${mins}${t('minute')}`;
  };

  const topSubjects = [...dashboardSubjects]
    .sort((a, b) => {
      const priorityDiff = ((b as any).priority || 0) - ((a as any).priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return (b.completed_chapters / b.total_chapters) - (a.completed_chapters / a.total_chapters);
    })
    .slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('morningGreeting');
    if (hour < 17) return t('afternoonGreeting');
    if (hour < 21) return t('eveningGreeting');
    return t('nightGreeting');
  };

  return (
    <div className="page-container">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-bengali tracking-tight">
              {getGreeting()}
            </h1>
            {completedGoals.length > 0 && (
              <Trophy className="w-5 h-5 text-accent animate-bounce" />
            )}
          </div>
          <p className="text-sm text-muted-foreground font-bengali flex items-center gap-2">
            {t('whatsPlan')}
          </p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-card border border-border/60" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <Flame className="w-3.5 h-3.5 text-destructive" />
            <span className="font-bengali">
              {currentStreak > 0 
                ? `${currentStreak} ${t('dayStreak')} 🔥`
                : t('startStudying')
              }
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <DashboardSettings syllabuses={syllabuses} config={config} onUpdateConfig={updateConfig} />
          <div className="relative">
            <ProgressRing progress={overallProgress} size={90} strokeWidth={7}>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground tabular-nums">{overallProgress.toFixed(0)}%</p>
                <p className="text-[9px] text-muted-foreground font-bengali uppercase tracking-wider">
                  {t('overall')}
                </p>
              </div>
            </ProgressRing>
          </div>
        </div>
      </div>

      {/* Weekly Study Chart */}
      {config.showWeeklyChart && <WeeklyStudyChart sessions={sessions} />}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={t('totalSubjects')} value={dashboardSubjects.length}
          subtitle={`${completedChapters}/${totalChapters} ${t('chapters')}`}
          icon={BookOpen}
        />
        <StatsCard title={t('todayStudyTime')} value={formatTime(todayTime)}
          icon={Timer} iconClassName="bg-accent/10 text-accent"
        />
        <StatsCard title={t('activeGoals')}
          value={activeGoals.length}
          subtitle={`${completedGoals.length} ${t('completed')}`}
          icon={Target} iconClassName="bg-success/10 text-success"
        />
        <StatsCard title={t('weekStudyTime')} value={formatTime(weekTime)}
          icon={TrendingUp} trend={{ value: 12, isPositive: true }}
          iconClassName="bg-info/10 text-info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="section-header">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground uppercase tracking-wider font-bengali">
                {t('yourSubjects')}
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {topSubjects.map((subject, index) => (
                <div key={subject.id} className={`stagger-${index + 1}`}>
                  <SubjectCard subject={subject}
                    onUpdateProgress={(id, completed) => updateSubject(id, { completed_chapters: completed })}
                    onDelete={deleteSubject} onEdit={setEditSubject}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Motivation */}
          {config.showQuotes && featuredQuote && (
            <div className="space-y-3">
              <h2 className="section-header">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider font-bengali">
                  {t('dailyMotivation')}
                </span>
              </h2>
              {featuredQuote.id.startsWith('default-') ? (
                <div className="glass-card p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                  <div className="relative">
                    <p className={cn("text-lg font-medium leading-relaxed", featuredQuote.is_bengali ? "font-bengali" : "")}>
                      "{featuredQuote.text}"
                    </p>
                    {featuredQuote.author && (
                      <p className="mt-3 text-xs text-muted-foreground font-medium">— {featuredQuote.author}</p>
                    )}
                  </div>
                </div>
              ) : (
                <QuoteCard quote={featuredQuote} onDelete={deleteQuote} onEdit={setEditQuote} featured />
              )}
            </div>
          )}

          {/* Upcoming Exam Countdown */}
          {upcomingExam && <UpcomingExamCountdown reminder={upcomingExam} />}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {config.showDailyTasks && (
            <div className="glass-card p-5">
              <DailyTaskList dailyTasks={dailyTasks} addDailyTask={addDailyTask} updateDailyTask={updateDailyTask} deleteDailyTask={deleteDailyTask} />
            </div>
          )}

          {config.showTodos && (
            <div className="glass-card p-5">
              <TodoList todos={todos} addTodo={async () => {}} updateTodo={updateTodo} deleteTodo={async () => {}} compact />
            </div>
          )}

          {config.showGoals && (
            <div className="space-y-4">
              <h2 className="section-header">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider font-bengali">
                  {t('activeGoals')}
                </span>
              </h2>
              {activeGoals.slice(0, 2).map((goal) => (
                <GoalCard key={goal.id} goal={goal} milestones={[]}
                  onUpdateProgress={(id, progress) => updateGoal(id, { progress, is_completed: progress >= 100 })}
                  onDelete={deleteGoal} onEdit={setEditGoal}
                  onAddMilestone={() => {}} onUpdateMilestone={() => {}} onDeleteMilestone={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <EditSubjectDialog subject={editSubject} open={!!editSubject} onOpenChange={(open) => !open && setEditSubject(null)} onSave={updateSubject} />
      <EditGoalDialog goal={editGoal} open={!!editGoal} onOpenChange={(open) => !open && setEditGoal(null)} onSave={updateGoal} />
      <EditQuoteDialog quote={editQuote} open={!!editQuote} onOpenChange={(open) => !open && setEditQuote(null)} onSave={updateQuote} />
    </div>
  );
}
