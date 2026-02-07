import { Timer, Coffee, Brain, Zap, Bell, BellOff, Sparkles, Rocket, Target } from 'lucide-react';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function PomodoroView() {
  const { notificationsEnabled, enableNotifications, completedSessions } = useGlobalPomodoro();
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleEnableNotifications = async () => {
    const granted = await enableNotifications();
    if (granted) {
      toast({
        title: language === 'bn' ? '🔔 নোটিফিকেশন চালু!' : '🔔 Notifications enabled!',
        duration: 3000,
      });
    } else {
      toast({
        title: language === 'bn' ? '❌ নোটিফিকেশন ব্লক' : '❌ Notifications blocked',
        description: language === 'bn' 
          ? 'ব্রাউজার সেটিংস থেকে অনুমতি দাও' 
          : 'Please allow in browser settings',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  // Fun motivational quotes for teens
  const motivationalQuotes = [
    { en: "You got this! 💪", bn: "তুমি পারবে! 💪" },
    { en: "Grind now, shine later ✨", bn: "এখন পড়ো, পরে চমকাও ✨" },
    { en: "Level up your brain 🧠", bn: "ব্রেইন আপগ্রেড করো 🧠" },
    { en: "Boss mode activated 🔥", bn: "বস মোড অন 🔥" },
  ];
  
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Engaging Header */}
      <div className="text-center max-w-2xl mx-auto relative">
        {/* Floating decorations */}
        <div className="absolute -top-4 -left-4 w-8 h-8 text-accent animate-float opacity-60">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="absolute -top-2 -right-8 w-6 h-6 text-primary animate-bounce opacity-60">
          <Rocket className="w-full h-full" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <Timer className="w-8 h-8 text-primary animate-pulse" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            Focus Timer
          </span>
        </h1>
        
        {/* Dynamic subtitle based on sessions */}
        <p className="text-muted-foreground mt-2 font-bengali text-lg">
          {completedSessions === 0 
            ? (language === 'bn' ? 'আজকের যাত্রা শুরু করো! 🚀' : "Let's start today's journey! 🚀")
            : completedSessions < 4 
            ? (language === 'bn' ? `${completedSessions}টা সেশন ডান! দারুণ! 🔥` : `${completedSessions} sessions done! Amazing! 🔥`)
            : (language === 'bn' ? 'তুমি তো লিজেন্ড! 👑' : "You're a legend! 👑")
          }
        </p>
        
        {/* Motivational quote */}
        <div className={cn(
          "mt-4 inline-block px-4 py-2 rounded-full",
          "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10",
          "border border-primary/20"
        )}>
          <span className="text-sm font-medium">
            {language === 'bn' ? randomQuote.bn : randomQuote.en}
          </span>
        </div>
        
        {/* Notification Toggle */}
        <div className="mt-4">
          <Button
            variant={notificationsEnabled ? "outline" : "default"}
            size="sm"
            onClick={handleEnableNotifications}
            className="gap-2 transition-all hover:scale-105"
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-4 h-4" />
                <span className="font-bengali">
                  {language === 'bn' ? '🔔 চালু আছে' : '🔔 Notifications On'}
                </span>
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4" />
                <span className="font-bengali">
                  {language === 'bn' ? 'নোটিফিকেশন চালু করো' : 'Enable Notifications'}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Timer */}
      <div className="max-w-md mx-auto">
        <PomodoroTimer />
      </div>

      {/* Fun Tips Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-bold text-center text-foreground mb-6 text-xl">
          <span className="font-bengali">{language === 'bn' ? '🎮 কিভাবে খেলবে' : '🎮 How to Play'}</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className={cn(
              "w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3",
              "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground",
              "group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow"
            )}>
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground mb-1 text-lg">🧠 Focus</h3>
            <p className="text-sm text-muted-foreground font-bengali">
              {language === 'bn' ? 'মাথা খাটাও, ফোন রাখো!' : 'Use your brain, ditch the phone!'}
            </p>
          </div>
          
          <div className="glass-card p-5 text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className={cn(
              "w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3",
              "bg-gradient-to-br from-success to-success/60 text-success-foreground",
              "group-hover:shadow-lg group-hover:shadow-success/30 transition-shadow"
            )}>
              <Coffee className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground mb-1 text-lg">☕ Chill</h3>
            <p className="text-sm text-muted-foreground font-bengali">
              {language === 'bn' ? '৫ মিনিট রিল্যাক্স করো' : '5 min to recharge'}
            </p>
          </div>
          
          <div className="glass-card p-5 text-center group hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className={cn(
              "w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3",
              "bg-gradient-to-br from-accent to-accent/60 text-accent-foreground",
              "group-hover:shadow-lg group-hover:shadow-accent/30 transition-shadow"
            )}>
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground mb-1 text-lg">⚡ Repeat</h3>
            <p className="text-sm text-muted-foreground font-bengali">
              {language === 'bn' ? '৪ সেশনে পাওয়ার ব্রেক!' : '4 sessions = Power break!'}
            </p>
          </div>
        </div>
      </div>

      {/* Achievement hint */}
      {completedSessions > 0 && (
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-bengali">
              {language === 'bn' 
                ? `আজকে ${completedSessions * 25}+ মিনিট ফোকাস! 🎯` 
                : `${completedSessions * 25}+ mins focused today! 🎯`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
