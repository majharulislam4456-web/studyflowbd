import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useStudyData } from '@/hooks/useStudyData';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { DashboardView } from '@/components/views/DashboardView';
import { SyllabusView } from '@/components/views/SyllabusView';
import { PomodoroView } from '@/components/views/PomodoroView';
import { GoalsView } from '@/components/views/GoalsView';
import { LoggerView } from '@/components/views/LoggerView';
import { QuotesView } from '@/components/views/QuotesView';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const {
    subjects,
    goals,
    quotes,
    updateSubjectProgress,
    addSubject,
    deleteSubject,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    addSession,
    addQuote,
    deleteQuote,
    getTodayStudyTime,
    getWeekStudyTime,
  } = useStudyData();

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            subjects={subjects}
            goals={goals}
            quotes={quotes}
            getTodayStudyTime={getTodayStudyTime}
            getWeekStudyTime={getWeekStudyTime}
            updateSubjectProgress={updateSubjectProgress}
            deleteSubject={deleteSubject}
            updateGoalProgress={updateGoalProgress}
            deleteGoal={deleteGoal}
            deleteQuote={deleteQuote}
          />
        );
      case 'syllabus':
        return (
          <SyllabusView
            subjects={subjects}
            addSubject={addSubject}
            updateSubjectProgress={updateSubjectProgress}
            deleteSubject={deleteSubject}
          />
        );
      case 'pomodoro':
        return <PomodoroView />;
      case 'goals':
        return (
          <GoalsView
            goals={goals}
            addGoal={addGoal}
            updateGoalProgress={updateGoalProgress}
            deleteGoal={deleteGoal}
          />
        );
      case 'logger':
        return (
          <LoggerView
            subjects={subjects}
            addSession={addSession}
            getTodayStudyTime={getTodayStudyTime}
            getWeekStudyTime={getWeekStudyTime}
          />
        );
      case 'quotes':
        return (
          <QuotesView
            quotes={quotes}
            addQuote={addQuote}
            deleteQuote={deleteQuote}
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
    </div>
  );
};

export default Index;
