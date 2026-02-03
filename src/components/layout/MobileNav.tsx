import { 
  LayoutDashboard, 
  BookOpen, 
  Timer, 
  Target, 
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
  { id: 'pomodoro', label: 'Focus', icon: Timer },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'analytics', label: 'Stats', icon: BarChart3 },
];

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
              activeTab === item.id 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform",
              activeTab === item.id && "scale-110"
            )} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
