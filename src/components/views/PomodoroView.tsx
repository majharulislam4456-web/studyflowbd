import { Timer, Coffee, Brain, Zap } from 'lucide-react';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';

export function PomodoroView() {
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
      </div>

      {/* Timer */}
      <div className="max-w-md mx-auto">
        <PomodoroTimer />
      </div>

      {/* Tips */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-center text-foreground mb-6">
          How it works / <span className="font-bengali">কিভাবে কাজ করে</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Focus</h3>
            <p className="text-sm text-muted-foreground font-bengali">
              ২৫ মিনিট মনোযোগ দিয়ে পড়াশোনা করুন
            </p>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-success/10 text-success flex items-center justify-center mb-3">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Break</h3>
            <p className="text-sm text-muted-foreground font-bengali">
              ৫ মিনিট বিশ্রাম নিন
            </p>
          </div>
          <div className="glass-card p-5 text-center">
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
