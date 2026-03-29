import { LayoutDashboard, BookOpen, Timer, Target, PenTool, Sparkles, BarChart3, Moon, Sun, ChevronLeft, User, BellRing, Brain, FileText, CalendarDays, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Profile } from '@/hooks/useSupabaseData';
import logoImg from '@/assets/logo.jpg';

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  profile: Profile | null;
}
const navItems = [{
  id: 'dashboard',
  label: 'Dashboard',
  labelBn: 'ড্যাশবোর্ড',
  icon: LayoutDashboard
}, {
  id: 'syllabus',
  label: 'Syllabus',
  labelBn: 'সিলেবাস',
  icon: BookOpen
}, {
  id: 'pomodoro',
  label: 'Focus Timer',
  labelBn: 'ফোকাস টাইমার',
  icon: Timer
}, {
  id: 'goals',
  label: 'Goals',
  labelBn: 'লক্ষ্য',
  icon: Target
}, {
  id: 'logger',
  label: 'Study Log',
  labelBn: 'স্টাডি লগ',
  icon: PenTool
}, {
  id: 'analytics',
  label: 'Analytics',
  labelBn: 'পরিসংখ্যান',
  icon: BarChart3
}, {
  id: 'notes',
  label: 'Notes',
  labelBn: 'নোটস',
  icon: FileText
}, {
  id: 'reminders',
  label: 'Reminders',
  labelBn: 'রিমাইন্ডার',
  icon: BellRing
}, {
  id: 'timetable',
  label: 'Timetable',
  labelBn: 'রুটিন',
  icon: CalendarDays
}, {
  id: 'calendar',
  label: 'Calendar',
  labelBn: 'ক্যালেন্ডার',
  icon: Calendar
}, {
  id: 'studywithme',
  label: 'Study With Me',
  labelBn: 'একসাথে পড়ি',
  icon: Brain
}, {
  id: 'quotes',
  label: 'Motivation',
  labelBn: 'অনুপ্রেরণা',
  icon: Sparkles
}];
export function AppSidebar({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  isCollapsed,
  setIsCollapsed,
  profile
}: AppSidebarProps) {
  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    return 'U';
  };
  return <aside className={cn("hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300", isCollapsed ? "w-20" : "w-64")}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && <div className="flex items-center gap-3">
            <img src={logoImg} alt="Study Tracker" className="w-10 h-10 rounded-xl shadow-md object-cover" />
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">Study Tracker</h1>
              <p className="text-xs text-muted-foreground font-bengali">স্টাডি ট্র্যাকার</p>
            </div>
          </div>}
        {isCollapsed && <img src={logoImg} alt="Study Tracker" className="w-10 h-10 mx-auto rounded-xl shadow-md object-cover" />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group", activeTab === item.id ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" : "text-sidebar-foreground hover:bg-sidebar-accent")}>
            <item.icon className={cn("w-5 h-5 flex-shrink-0", activeTab === item.id ? "" : "group-hover:text-primary")} />
            {!isCollapsed && <div className="text-left">
                <span className="block text-sm font-medium text-center mx-[2px]">{item.label}</span>
                <span className="block text-xs opacity-70 font-bengali">{item.labelBn}</span>
              </div>}
          </button>)}
      </nav>

      {/* Profile & Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <button onClick={() => setActiveTab('profile')} className={cn("w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200", activeTab === 'profile' ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" : "text-sidebar-foreground hover:bg-sidebar-accent")}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && <div className="text-left flex-1 min-w-0">
              <span className="block text-sm font-medium truncate">
                {profile?.display_name || 'Profile'}
              </span>
              <span className="block text-xs opacity-70 font-bengali">প্রোফাইল</span>
            </div>}
        </button>

        <Button variant="ghost" size={isCollapsed ? "icon" : "default"} onClick={toggleTheme} className={cn("w-full justify-start", isCollapsed && "justify-center")}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!isCollapsed && <span className="ml-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="w-full">
          <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>
    </aside>;
}
