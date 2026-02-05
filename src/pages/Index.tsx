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
 import { FloatingPomodoroTimer } from '@/components/pomodoro/FloatingPomodoroTimer';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
   const pomodoro = useGlobalPomodoro();
  
  const {
    subjects,
    goals,
    quotes,
    sessions,
    todos,
    profile,
    loading: dataLoading,
    addSubject,
    updateSubject,
    deleteSubject,
    addGoal,
    updateGoal,
    deleteGoal,
    addSession,
     updateSession,
     deleteSession,
    addQuote,
    updateQuote,
    deleteQuote,
    addTodo,
    updateTodo,
    deleteTodo,
    updateProfile,
    getTodayStudyTime,
    getWeekStudyTime,
  } = useSupabaseData();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading... / <span className="font-bengali">লোড হচ্ছে...</span></p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            subjects={subjects}
            goals={goals}
            quotes={quotes}
            todos={todos}
            getTodayStudyTime={getTodayStudyTime}
            getWeekStudyTime={getWeekStudyTime}
            updateSubject={updateSubject}
            deleteSubject={deleteSubject}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
            updateQuote={updateQuote}
            deleteQuote={deleteQuote}
            updateTodo={updateTodo}
          />
        );
      case 'syllabus':
        return (
          <SyllabusView
            subjects={subjects}
            addSubject={addSubject}
            updateSubject={updateSubject}
            deleteSubject={deleteSubject}
          />
        );
      case 'pomodoro':
        return <PomodoroView />;
      case 'goals':
        return (
          <GoalsView
            goals={goals}
            todos={todos}
            addGoal={addGoal}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
            addTodo={addTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
          />
        );
      case 'logger':
        return (
          <LoggerView
            subjects={subjects}
             sessions={sessions}
            addSession={addSession}
             updateSession={updateSession}
             deleteSession={deleteSession}
            getTodayStudyTime={getTodayStudyTime}
            getWeekStudyTime={getWeekStudyTime}
          />
        );
      case 'quotes':
        return (
          <QuotesView
            quotes={quotes}
            addQuote={addQuote}
            updateQuote={updateQuote}
            deleteQuote={deleteQuote}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            sessions={sessions}
            subjects={subjects}
          />
        );
      case 'profile':
        return (
          <ProfileView
            profile={profile}
            onUpdateProfile={updateProfile}
            isDark={isDark}
            toggleTheme={toggleTheme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        profile={profile}
      />

      {/* Main Content */}
      <main className={cn(
        "flex-1 min-h-screen",
        "pb-24 md:pb-0" // Padding for mobile nav
      )}>
        {/* Mobile Header */}
        <MobileHeader 
          isDark={isDark} 
          toggleTheme={toggleTheme}
          setActiveTab={setActiveTab}
        />

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
 
       {/* Floating Pomodoro Timer */}
       {pomodoro.isMinimized && (pomodoro.isRunning || pomodoro.phase !== 'idle') && (
         <FloatingPomodoroTimer
           phase={pomodoro.phase}
           formattedTime={pomodoro.formattedTime}
           isRunning={pomodoro.isRunning}
           progress={pomodoro.progress}
           onStart={pomodoro.start}
           onPause={pomodoro.pause}
           onClose={pomodoro.close}
           onExpand={() => {
             pomodoro.maximize();
             setActiveTab('pomodoro');
           }}
         />
       )}
    </div>
  );
};

export default Index;
