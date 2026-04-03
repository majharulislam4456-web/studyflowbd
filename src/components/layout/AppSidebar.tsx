import { LayoutDashboard, BookOpen, Timer, Target, PenTool, Sparkles, BarChart3, Moon, Sun, ChevronLeft, User, BellRing, Brain, FileText, CalendarDays, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Profile } from '@/hooks/useSupabaseData';
import logoImg from '@/assets/logo.png';

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  profile: Profile | null;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { id: 'syllabus', label: 'Syllabus', labelBn: 'সিলেবাস', icon: BookOpen },
  { id: 'pomodoro', label: 'Focus Timer', labelBn: 'ফোকাস টাইমার', icon: Timer },
  { id: 'goals', label: 'Goals', labelBn: 'লক্ষ্য', icon: Target },
  { id: 'logger', label: 'Study Log', labelBn: 'স্টাডি লগ', icon: PenTool },
  { id: 'analytics', label: 'Analytics', labelBn: 'পরিসংখ্যান', icon: BarChart3 },
  { id: 'notes', label: 'Notes', labelBn: 'নোটস', icon: FileText },
  { id: 'reminders', label: 'Reminders', labelBn: 'রিমাইন্ডার', icon: BellRing },
  { id: 'timetable', label: 'Timetable', labelBn: 'রুটিন', icon: CalendarDays },
  { id: 'calendar', label: 'Calendar', labelBn: 'ক্যালেন্ডার', icon: Calendar },
  { id: 'studywithme', label: 'Study With Me', labelBn: 'একসাথে পড়ি', icon: Brain },
  { id: 'quotes', label: 'Motivation', labelBn: 'অনুপ্রেরণা', icon: Sparkles },
];

export function AppSidebar({
  activeTab, setActiveTab, isDark, toggleTheme, isCollapsed, setIsCollapsed, profile
}: AppSidebarProps) {
  const getInitials = () => {
    if (profile?.display_name) return profile.display_name.slice(0, 2).toUpperCase();
    return 'U';
  };

  return (
    <aside className={cn(
      "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[72px]" : "w-60"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Study Tracker" className="w-9 h-9 rounded-xl object-cover" />
            <div>
              <h1 className="font-bold text-base text-sidebar-foreground tracking-tight">Study Tracker</h1>
              <p className="text-[10px] text-muted-foreground font-bengali -mt-0.5">স্টাডি ট্র্যাকার</p>
            </div>
          </div>
        ) : (
          <img src={logoImg} alt="Study Tracker" className="w-9 h-9 mx-auto rounded-xl object-cover" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
              activeTab === item.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn(
              "w-[18px] h-[18px] flex-shrink-0",
              activeTab !== item.id && "group-hover:text-primary"
            )} />
            {!isCollapsed && (
              <span className="text-[13px] font-medium truncate">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
            activeTab === 'profile'
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
        >
          <Avatar className="w-7 h-7">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <span className="text-[13px] font-medium truncate flex-1 text-left">
              {profile?.display_name || 'Profile'}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="flex-1 h-9 text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
