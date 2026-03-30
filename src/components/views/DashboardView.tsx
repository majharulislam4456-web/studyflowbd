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
  const { language } = useLanguage();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const examDate = new Date(reminder.exam_date);
  const totalSecs = differenceInSeconds(examDate, now);
  if (totalSecs <= 0) return null;

  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const boxes = [
    { value: days.toString().padStart(2, '0'), label: language === 'bn' ? 'দিন' : 'DAYS' },
    { value: hours.toString().padStart(2, '0'), label: language === 'bn' ? 'ঘণ্টা' : 'HOURS' },
    { value: mins.toString().padStart(2, '0'), label: language === 'bn' ? 'মিনিট' : 'MINS' },
    { value: secs.toString().padStart(2, '0'), label: language === 'bn' ? 'সেকেন্ড' : 'SECS' },
  ];

  return (
    <div className="glass-card p-5 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="text-center mb-4">
        <p className="text-sm font-semibold text-primary font-bengali flex items-center justify-center gap-2">
          <Bell className="w-4 h-4" />
          {language === 'bn' ? 'আসন্ন পরীক্ষা:' : 'Next Exam:'} {reminder.title_bn || reminder.title}
        </p>
      </div>
      <div className="flex justify-center gap-3">
        {boxes.map((box, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl border-2 border-primary/30 bg-background/80 flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-foreground tabular-nums">{box.value}</span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">{box.label}</span>
          </div>
        ))}
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

  // Find nearest upcoming exam
  const upcomingExam = useMemo(() => {
    const now = new Date();
    return examReminders
      .filter(r => new Date(r.exam_date) > now)
      .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())[0] || null;
  }, [examReminders]);

  // Pick one quote per day consistently, use defaults if no user quotes
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="relative">
          {todayTime > 60 && (
            <div className="absolute -top-2 -left-6 animate-float">
              <Flame className="w-6 h-6 text-destructive" />
            </div>
          )}
          {completedGoals.length > 0 && (
            <div className="absolute -top-2 -right-2 animate-bounce">
              <Trophy className="w-5 h-5 text-warning" />
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-foreground font-bengali">
            {getGreeting()}
          </h1>
           <p className="text-muted-foreground mt-1 font-bengali flex items-center gap-2">
            {t('whatsPlan')}
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </p>
          
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 text-sm border border-primary/10">
            <Flame className="w-4 h-4 text-destructive" />
            <span className="font-bengali font-semibold">
              {currentStreak > 0 
                ? `${currentStreak} ${t('dayStreak')} 🔥`
                : t('startStudying')
              }
            </span>
          </div>
          {currentStreak === 0 && (
            <p className="text-xs text-muted-foreground mt-1 font-bengali">
              {t('streakHint')}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <DashboardSettings syllabuses={syllabuses} config={config} onUpdateConfig={updateConfig} />
          <div className="relative group">
            <ProgressRing progress={overallProgress} size={100} strokeWidth={8}>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{overallProgress.toFixed(0)}%</p>
                <p className="text-[10px] text-muted-foreground font-bengali">
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
        {/* Left column - subjects + motivation + upcoming exam */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 font-bengali">
              <BookOpen className="w-5 h-5 text-primary" />
              {t('yourSubjects')}
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

          {/* Motivation below subjects */}
          {config.showQuotes && featuredQuote && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground font-bengali">
                ✨ {t('dailyMotivation')}
              </h2>
              {featuredQuote.id.startsWith('default-') ? (
                <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-accent/5 animate-glow-pulse relative overflow-hidden">
                  <p className={cn("text-xl font-medium leading-relaxed", featuredQuote.is_bengali ? "font-bengali" : "")}>
                    "{featuredQuote.text}"
                  </p>
                  {featuredQuote.author && (
                    <p className="mt-4 text-sm text-muted-foreground">— {featuredQuote.author}</p>
                  )}
                </div>
              ) : (
                <QuoteCard quote={featuredQuote} onDelete={deleteQuote} onEdit={setEditQuote} featured />
              )}
            </div>
          )}

          {/* Upcoming Exam Countdown */}
          {upcomingExam && (
            <UpcomingExamCountdown reminder={upcomingExam} />
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {config.showDailyTasks && (
            <div className="glass-card p-4">
              <DailyTaskList dailyTasks={dailyTasks} addDailyTask={addDailyTask} updateDailyTask={updateDailyTask} deleteDailyTask={deleteDailyTask} />
            </div>
          )}

          {config.showTodos && (
            <div className="glass-card p-4">
              <TodoList todos={todos} addTodo={async () => {}} updateTodo={updateTodo} deleteTodo={async () => {}} compact />
            </div>
          )}

          {config.showGoals && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 font-bengali">
                <Target className="w-5 h-5 text-primary" />
                {language === 'bn' ? 'সক্রিয় লক্ষ্য' : 'Active Goals'}
              </h2>
              {activeGoals.slice(0, 2).map((goal) => (
                <GoalCard key={goal.id} goal={goal}
                  onUpdateProgress={(id, progress) => updateGoal(id, { progress, is_completed: progress >= 100 })}
                  onDelete={deleteGoal} onEdit={setEditGoal}
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
