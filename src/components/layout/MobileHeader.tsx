import { BookOpen, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
}

export function MobileHeader({ isDark, toggleTheme, setActiveTab }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-base text-foreground">StudyFlow</h1>
            <p className="text-[10px] text-muted-foreground font-bengali">স্টাডিফ্লো</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Menu className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setActiveTab('logger')}>
                Study Log / স্টাডি লগ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('quotes')}>
                Motivation / অনুপ্রেরণা
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
