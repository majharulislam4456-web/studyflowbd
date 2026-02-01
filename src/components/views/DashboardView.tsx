import { BookOpen, Timer, Target, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { SubjectCard } from '@/components/syllabus/SubjectCard';
import { GoalCard } from '@/components/goals/GoalCard';
import { QuoteCard } from '@/components/quotes/QuoteCard';
import type { Subject, Goal, Quote } from '@/types/study';

interface DashboardViewProps {
  subjects: Subject[];
  goals: Goal[];
  quotes: Quote[];
  getTodayStudyTime: () => number;
  getWeekStudyTime: () => number;
  updateSubjectProgress: (id: string, completed: number) => void;
  deleteSubject: (id: string) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  deleteGoal: (id: string) => void;
  deleteQuote: (id: string) => void;
}

export function DashboardView({
  subjects,
  goals,
  quotes,
  getTodayStudyTime,
  getWeekStudyTime,
  updateSubjectProgress,
  deleteSubject,
  updateGoalProgress,
  deleteGoal,
  deleteQuote,
}: DashboardViewProps) {
  const todayTime = getTodayStudyTime();
  const weekTime = getWeekStudyTime();
  
  const totalChapters = subjects.reduce((acc, s) => acc + s.totalChapters, 0);
  const completedChapters = subjects.reduce((acc, s) => acc + s.completedChapters, 0);
  const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  // Get a random quote for featured display
  const featuredQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back! / <span className="font-bengali">স্বাগতম!</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and stay focused / <span className="font-bengali">আপনার অগ্রগতি ট্র্যাক করুন</span>
          </p>
        </div>
        
        {/* Overall Progress Ring */}
        <div className="flex items-center gap-6">
          <ProgressRing progress={overallProgress} size={100} strokeWidth={8}>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{overallProgress.toFixed(0)}%</p>
              <p className="text-[10px] text-muted-foreground">Overall</p>
            </div>
          </ProgressRing>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Subjects"
          titleBn="বিষয়"
          value={subjects.length}
          subtitle={`${completedChapters}/${totalChapters} chapters`}
          icon={BookOpen}
        />
        <StatsCard
          title="Today's Study"
          titleBn="আজকের পড়াশোনা"
          value={formatTime(todayTime)}
          icon={Timer}
          iconClassName="bg-accent/10 text-accent"
        />
        <StatsCard
          title="Active Goals"
          titleBn="সক্রিয় লক্ষ্য"
          value={activeGoals.length}
          subtitle={`${completedGoals.length} completed`}
          icon={Target}
          iconClassName="bg-success/10 text-success"
        />
        <StatsCard
          title="Weekly Study"
          titleBn="সাপ্তাহিক পড়াশোনা"
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
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Your Subjects / <span className="font-bengali">আপনার বিষয়সমূহ</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {subjects.slice(0, 4).map((subject, index) => (
              <div key={subject.id} className={`stagger-${index + 1}`}>
                <SubjectCard
                  subject={subject}
                  onUpdateProgress={updateSubjectProgress}
                  onDelete={deleteSubject}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Goals & Quote Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Active Goals / <span className="font-bengali">সক্রিয় লক্ষ্য</span>
            </h2>
            {activeGoals.slice(0, 2).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={updateGoalProgress}
                onDelete={deleteGoal}
              />
            ))}
          </div>

          {/* Featured Quote */}
          {featuredQuote && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Daily Motivation / <span className="font-bengali">দৈনিক অনুপ্রেরণা</span>
              </h2>
              <QuoteCard quote={featuredQuote} onDelete={deleteQuote} featured />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
