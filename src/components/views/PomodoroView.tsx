import { Timer, Coffee, Brain, Zap, Bell, BellOff } from 'lucide-react';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function PomodoroView() {
  const { notificationsEnabled, enableNotifications } = useGlobalPomodoro();
  const { language } = useLanguage();
  const { toast } = useToast();

  const handleEnableNotifications = async () => {
    const granted = await enableNotifications();
    if (granted) {
      toast({
        title: language === 'bn' ? '🔔 নোটিফিকেশন চালু হয়েছে!' : '🔔 Notifications enabled!',
        duration: 3000,
      });
    } else {
      toast({
        title: language === 'bn' ? '❌ নোটিফিকেশন ব্লক করা আছে' : '❌ Notifications blocked',
        description: language === 'bn' 
          ? 'ব্রাউজার সেটিংস থেকে অনুমতি দিন' 
          : 'Please allow in browser settings',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
          <Timer className="w-8 h-8 text-primary" />
          Focus Timer
        </h1>
        <p className="text-muted-foreground mt-2 font-bengali">
          ফোকাস টাইমার - পোমোডোরো টেকনিক দিয়ে মনোযোগ বাড়ান
        </p>
        
        {/* Notification Toggle */}
        <div className="mt-4">
          <Button
            variant={notificationsEnabled ? "outline" : "default"}
            size="sm"
            onClick={handleEnableNotifications}
            className="gap-2"
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-4 h-4" />
                <span className="font-bengali">
                  {language === 'bn' ? 'নোটিফিকেশন চালু আছে' : 'Notifications On'}
                </span>
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4" />
                <span className="font-bengali">
                  {language === 'bn' ? 'নোটিফিকেশন চালু করুন' : 'Enable Notifications'}
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

      {/* Tips */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-semibold text-center text-foreground mb-6 text-xl font-bengali">
          {language === 'bn' ? 'কিভাবে কাজ করে' : 'How it works'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Focus</h3>
            <p className="text-sm text-muted-foreground font-bengali">
              ২৫ মিনিট মনোযোগ দিয়ে পড়াশোনা করুন
            </p>
          </div>
          <div className="glass-card p-5 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 mx-auto rounded-xl bg-success/10 text-success flex items-center justify-center mb-3">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Break</h3>
            <p className="text-sm text-muted-foreground font-bengali">
              ৫ মিনিট বিশ্রাম নিন
            </p>
          </div>
          <div className="glass-card p-5 text-center hover:scale-105 transition-transform">
            <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Repeat</h3>
            <p className="text-sm text-muted-foreground font-bengali">
              ৪ সেশন পর দীর্ঘ বিরতি নিন
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
