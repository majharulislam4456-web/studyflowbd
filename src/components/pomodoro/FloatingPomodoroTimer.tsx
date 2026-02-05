 import { Button } from '@/components/ui/button';
 import { ProgressRing } from '@/components/dashboard/ProgressRing';
 import { Play, Pause, X, Brain, Coffee, Maximize2 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 interface FloatingPomodoroTimerProps {
   phase: 'focus' | 'break' | 'longBreak' | 'idle';
   formattedTime: string;
   isRunning: boolean;
   progress: number;
   onStart: () => void;
   onPause: () => void;
   onClose: () => void;
   onExpand: () => void;
 }
 
 export function FloatingPomodoroTimer({
   phase,
   formattedTime,
   isRunning,
   progress,
   onStart,
   onPause,
   onClose,
   onExpand,
 }: FloatingPomodoroTimerProps) {
   const { language } = useLanguage();
   
   const getPhaseInfo = () => {
     switch (phase) {
       case 'focus':
         return { icon: Brain, color: 'text-primary', label: language === 'bn' ? 'ফোকাস' : 'Focus' };
       case 'break':
         return { icon: Coffee, color: 'text-success', label: language === 'bn' ? 'বিরতি' : 'Break' };
       case 'longBreak':
         return { icon: Coffee, color: 'text-warning', label: language === 'bn' ? 'দীর্ঘ বিরতি' : 'Long Break' };
       default:
         return { icon: Brain, color: 'text-muted-foreground', label: language === 'bn' ? 'প্রস্তুত' : 'Ready' };
     }
   };
 
   const phaseInfo = getPhaseInfo();
   const PhaseIcon = phaseInfo.icon;
 
   return (
     <div className={cn(
       "fixed bottom-20 md:bottom-6 right-4 z-50",
       "glass-card shadow-2xl p-3",
       "animate-scale-in",
       "flex items-center gap-3"
     )}>
       {/* Mini Progress Ring */}
       <ProgressRing progress={progress} size={48} strokeWidth={4}>
         <PhaseIcon className={cn("w-4 h-4", phaseInfo.color)} />
       </ProgressRing>
       
       {/* Time and Phase */}
       <div className="text-center min-w-[60px]">
         <p className="text-lg font-bold text-foreground">{formattedTime}</p>
         <p className={cn("text-xs font-bengali", phaseInfo.color)}>{phaseInfo.label}</p>
       </div>
       
       {/* Controls */}
       <div className="flex items-center gap-1">
         <Button
           variant={isRunning ? "accent" : "gradient"}
           size="icon-sm"
           onClick={isRunning ? onPause : onStart}
           className="rounded-full"
         >
           {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
         </Button>
         
         <Button
           variant="ghost"
           size="icon-sm"
           onClick={onExpand}
           className="text-muted-foreground"
         >
           <Maximize2 className="w-3 h-3" />
         </Button>
         
         <Button
           variant="ghost"
           size="icon-sm"
           onClick={onClose}
           className="text-muted-foreground hover:text-destructive"
         >
           <X className="w-3 h-3" />
         </Button>
       </div>
     </div>
   );
 }