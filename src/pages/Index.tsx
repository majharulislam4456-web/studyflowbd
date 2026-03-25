import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { DashboardView } from '@/components/views/DashboardView';
import { SyllabusView } from '@/components/views/SyllabusView';
import { PomodoroView } from '@/components/views/PomodoroView';
import { GoalsView } from '@/components/views/GoalsView';
import { LoggerView } from '@/components/views/LoggerView';
import { QuotesView } from '@/components/views/QuotesView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { ProfileView } from '@/components/profile/ProfileView';
import { ExamReminderView } from '@/components/reminders/ExamReminderView';
import { StudyWithMeView } from '@/components/views/StudyWithMeView';
import { NotesView } from '@/components/views/NotesView';
import { TimetableView } from '@/components/views/TimetableView';
import { FlashcardView } from '@/components/views/FlashcardView';
import { CalendarView } from '@/components/views/CalendarView';
import { FloatingPomodoroTimer } from '@/components/pomodoro/FloatingPomodoroTimer';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { applyDailyTheme } from '@/utils/dailyTheme';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const pomodoro = useGlobalPomodoro();

  // Apply daily auto-theme on mount
  useEffect(() => {
    applyDailyTheme();
  }, []);
  
  const {
    subjects, syllabuses, goals, quotes, sessions, todos, dailyTasks, notes, routines, profile,
    loading: dataLoading,
    addSyllabus, updateSyllabus, deleteSyllabus,
    addSubject, updateSubject, deleteSubject,
    addGoal, updateGoal, deleteGoal,
    addSession, updateSession, deleteSession,
    addQuote, updateQuote, deleteQuote,
    addTodo, updateTodo, deleteTodo,
    addDailyTask, updateDailyTask, deleteDailyTask,
    addNote, updateNote, deleteNote,
    addRoutine, deleteRoutine,
    updateProfile, getTodayStudyTime, getWeekStudyTime,
  } = useSupabaseData();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-bengali">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Show onboarding if no student_class set
  const needsOnboarding = profile && !(profile as any).student_class;

  const handleOnboardingComplete = async (studentClass: string, division: string | null) => {
    await updateProfile({ student_class: studentClass, division } as any);
  };

  if (needsOnboarding) {
    return (
      <OnboardingFlow
        displayName={profile?.display_name || null}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            subjects={subjects} syllabuses={syllabuses} goals={goals} quotes={quotes}
            todos={todos} dailyTasks={dailyTasks} sessions={sessions}
            getTodayStudyTime={getTodayStudyTime} getWeekStudyTime={getWeekStudyTime}
            updateSubject={updateSubject} deleteSubject={deleteSubject}
            updateGoal={updateGoal} deleteGoal={deleteGoal}
            updateQuote={updateQuote} deleteQuote={deleteQuote}
            updateTodo={updateTodo}
            addDailyTask={addDailyTask} updateDailyTask={updateDailyTask} deleteDailyTask={deleteDailyTask}
          />
        );
      case 'syllabus':
        return (
          <SyllabusView subjects={subjects} syllabuses={syllabuses}
            addSubject={addSubject} updateSubject={updateSubject} deleteSubject={deleteSubject}
            addSyllabus={addSyllabus} updateSyllabus={updateSyllabus} deleteSyllabus={deleteSyllabus}
          />
        );
      case 'pomodoro': return <PomodoroView />;
      case 'goals':
        return (
          <GoalsView goals={goals} todos={todos}
            addGoal={addGoal} updateGoal={updateGoal} deleteGoal={deleteGoal}
            addTodo={addTodo} updateTodo={updateTodo} deleteTodo={deleteTodo}
          />
        );
      case 'logger':
        return (
          <LoggerView subjects={subjects} sessions={sessions}
            addSession={addSession} updateSession={updateSession} deleteSession={deleteSession}
            getTodayStudyTime={getTodayStudyTime} getWeekStudyTime={getWeekStudyTime}
          />
        );
      case 'quotes':
        return <QuotesView quotes={quotes} addQuote={addQuote} updateQuote={updateQuote} deleteQuote={deleteQuote} />;
      case 'analytics':
        return <AnalyticsView sessions={sessions} subjects={subjects} />;
      case 'reminders':
        return <ExamReminderView />;
      case 'studywithme':
        return <StudyWithMeView />;
      case 'notes':
        return <NotesView notes={notes} subjects={subjects} addNote={addNote} updateNote={updateNote} deleteNote={deleteNote} />;
      case 'timetable':
        return <TimetableView routines={routines} subjects={subjects} addRoutine={addRoutine} deleteRoutine={deleteRoutine} />;
      case 'profile':
        return <ProfileView profile={profile} onUpdateProfile={updateProfile} isDark={isDark} toggleTheme={toggleTheme} />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} isDark={isDark} toggleTheme={toggleTheme} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} profile={profile} />
      <main className={cn("flex-1 min-h-screen", "pb-24 md:pb-0")}>
        <MobileHeader isDark={isDark} toggleTheme={toggleTheme} setActiveTab={setActiveTab} />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{renderView()}</div>
      </main>
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      {pomodoro.isMinimized && (pomodoro.isRunning || pomodoro.phase !== 'idle') && (
        <FloatingPomodoroTimer
          phase={pomodoro.phase} formattedTime={pomodoro.formattedTime}
          isRunning={pomodoro.isRunning} progress={pomodoro.progress}
          onStart={pomodoro.start} onPause={pomodoro.pause} onClose={pomodoro.close}
          onExpand={() => { pomodoro.maximize(); setActiveTab('pomodoro'); }}
        />
      )}
    </div>
  );
};

export default Index;
