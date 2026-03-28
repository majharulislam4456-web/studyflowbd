import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Target, 
  Clock, 
  BookOpen, 
  BarChart3, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Heart,
  Code2,
  Flame,
  ListChecks,
  Calendar,
  Palette,
  Languages,
  Bell,
  Shield,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import logoImg from '@/assets/logo.jpg';

interface AboutAppProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const features = [
  {
    icon: FolderOpen,
    title: 'মাল্টি সিলেবাস',
    titleEn: 'Multi Syllabus',
    description: 'একাধিক সিলেবাস তৈরি করুন (HSC, Admission, BCS ইত্যাদি)। প্রতিটি সিলেবাসে আলাদা বিষয় ও অধ্যায় ট্র্যাক করুন।',
    descEn: 'Create multiple syllabuses (HSC, Admission, BCS etc). Track separate subjects and chapters for each.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: BookOpen,
    title: 'সিলেবাস ট্র্যাকার',
    titleEn: 'Syllabus Tracker',
    description: 'প্রতিটি বিষয়ের অধ্যায় ট্র্যাক করুন। প্রায়োরিটি সেট করুন এবং রং দিয়ে আলাদা করুন।',
    descEn: 'Track chapters for each subject. Set priority and color-code them.',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: Target,
    title: 'গোল সেটিং ও টু-ডু',
    titleEn: 'Goals & To-Do',
    description: 'মিশন (৩০ দিন), সাপ্তাহিক (৭ দিন), স্বল্পমেয়াদী (৩ দিন) গোল সেট করুন। স্পেশাল ও ডেইলি টাস্ক ম্যানেজ করুন।',
    descEn: 'Set Mission (30d), Weekly (7d), Short-term (3d) goals. Manage special & daily tasks.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Clock,
    title: 'পমোডোরো ও স্টপওয়াচ',
    titleEn: 'Pomodoro & Stopwatch',
    description: 'ফোকাসড স্টাডির জন্য পমোডোরো টাইমার এবং ফ্রি-ফর্ম স্টপওয়াচ। বিষয় সিলেক্ট ও নোট রাখুন।',
    descEn: 'Pomodoro timer for focused study and free-form stopwatch. Select subject & add notes.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    icon: Flame,
    title: 'স্ট্রিক সিস্টেম',
    titleEn: 'Streak System',
    description: 'প্রতিদিন স্টাডি লগ করলে স্ট্রিক বাড়বে। একদিন মিস করলে ০ থেকে শুরু! নিজেকে চ্যালেঞ্জ করুন।',
    descEn: 'Log study daily to increase streak. Miss one day and it resets to 0! Challenge yourself.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: BarChart3,
    title: 'স্টাডি অ্যানালিটিক্স',
    titleEn: 'Study Analytics',
    description: 'শনি-শুক্র সাইকেলে দৈনিক, সাপ্তাহিক ও বিষয়ভিত্তিক বিশ্লেষণ। প্রতি শনিবারে রিসেট হয়।',
    descEn: 'Sat-Fri cycle analytics: daily, weekly & subject-wise analysis. Resets every Saturday.',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: Sparkles,
    title: 'মোটিভেশন ও কোটস',
    titleEn: 'Motivation & Quotes',
    description: 'অনুপ্রেরণামূলক উক্তি সংগ্রহ করুন। বাংলা ও ইংরেজি দুই ভাষায়ই যোগ করুন।',
    descEn: 'Collect motivational quotes in both Bengali and English.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Palette,
    title: 'ডেইলি অটো থিম',
    titleEn: 'Daily Auto Theme',
    description: 'প্রতিদিন অ্যাপের থিম রঙ স্বয়ংক্রিয়ভাবে পরিবর্তন হয়। ডার্ক/লাইট মোড সাপোর্ট।',
    descEn: 'App theme color changes automatically every day. Dark/Light mode support.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Languages,
    title: 'বাংলা-ইংরেজি সাপোর্ট',
    titleEn: 'Bengali-English Support',
    description: 'সম্পূর্ণ অ্যাপ বাংলা ও ইংরেজি দুই ভাষায় ব্যবহার করুন। ভাষা অনুযায়ী অটো ট্রান্সলেট।',
    descEn: 'Use the entire app in both Bengali and English. Auto-translate based on language.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Bell,
    title: 'সাউন্ড ইফেক্ট',
    titleEn: 'Sound Effects',
    description: 'বাটন ক্লিক, টাস্ক কমপ্লিট, টাইমার অ্যালার্ম - সব জায়গায় ইন্টারেক্টিভ সাউন্ড।',
    descEn: 'Button clicks, task completion, timer alarm - interactive sounds everywhere.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    icon: Shield,
    title: 'ক্লাউড সিকিউরিটি',
    titleEn: 'Cloud Security',
    description: 'সব ডাটা ক্লাউডে এনক্রিপ্টেড। যেকোনো ডিভাইস থেকে নিরাপদে অ্যাক্সেস করুন।',
    descEn: 'All data encrypted in cloud. Access securely from any device.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: ListChecks,
    title: 'ড্যাশবোর্ড কাস্টমাইজ',
    titleEn: 'Dashboard Customize',
    description: 'ড্যাশবোর্ডে কোন সিলেবাস দেখাবে, কোন সেকশন অন/অফ - সব নিজের মতো করুন।',
    descEn: 'Choose which syllabuses and sections to show on your dashboard.',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: FolderOpen,
    title: 'Google Keep নোটস',
    titleEn: 'Keep-Style Notes',
    description: 'Pin, কালার, চেকলিস্ট, আর্কাইভ সহ Google Keep স্টাইলে নোট রাখুন। ভিউ ও এডিট মোড আলাদা।',
    descEn: 'Pin, color, checklist, archive — Google Keep style notes with separate view & edit modes.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Calendar,
    title: 'টাইমটেবিল ও ক্যালেন্ডার',
    titleEn: 'Timetable & Calendar',
    description: 'সাপ্তাহিক স্টাডি রুটিন সেট করুন এবং ক্যালেন্ডারে সেশন, পরীক্ষা ও রুটিন দেখুন। দিনের স্কেজুল ম্যানেজ করুন।',
    descEn: 'Set weekly study routines and view sessions, exams & schedules on calendar.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Bell,
    title: 'কাউন্টডাউন রিমাইন্ডার',
    titleEn: 'Countdown Reminders',
    description: 'পরীক্ষার রিমাইন্ডারে লাইভ কাউন্টডাউন টাইমার দেখুন। কত সময় বাকি তা রিয়েলটাইমে।',
    descEn: 'Live countdown timer on exam reminders. See exactly how much time remains.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
];

const tourSteps = [
  {
    title: 'স্বাগতম! 🎉',
    titleEn: 'Welcome! 🎉',
    description: 'Study Tracker-এ আপনাকে স্বাগতম! এই অ্যাপ আপনার পড়াশোনাকে সংগঠিত ও কার্যকর করবে।',
    descEn: 'Welcome to Study Tracker! This app will organize and enhance your study routine.',
    tip: 'আপনার সব ডাটা ক্লাউডে সেভ থাকে, যেকোনো ডিভাইস থেকে অ্যাক্সেস করুন!',
    tipEn: 'All your data is saved in cloud, access from any device!',
    benefit: 'ফ্রি ক্লাউড স্টোরেজ ও মাল্টি-ডিভাইস সাপোর্ট।',
    benefitEn: 'Free cloud storage & multi-device support.',
  },
  {
    title: 'মাল্টি সিলেবাস 📚',
    titleEn: 'Multi Syllabus 📚',
    description: 'সিলেবাস পেজে "নতুন সিলেবাস" বাটনে ক্লিক করে HSC, Admission, BCS ইত্যাদি আলাদা সিলেবাস তৈরি করুন। প্রতিটিতে বিষয় যোগ করুন।',
    descEn: 'Click "New Syllabus" to create separate syllabuses. Add subjects to each one.',
    tip: 'ড্যাশবোর্ড সেটিংস থেকে বেছে নিন কোন সিলেবাসের প্রগ্রেস দেখতে চান!',
    tipEn: 'Choose which syllabus progress to show from Dashboard Settings!',
    benefit: 'একসাথে একাধিক পরীক্ষার প্রস্তুতি ট্র্যাক করুন।',
    benefitEn: 'Track preparation for multiple exams simultaneously.',
  },
  {
    title: 'গোল ও টাস্ক 🎯',
    titleEn: 'Goals & Tasks 🎯',
    description: 'মিশন, সাপ্তাহিক ও স্বল্পমেয়াদী গোল সেট করুন। স্পেশাল টাস্ক ও ডেইলি টাস্ক আলাদাভাবে ম্যানেজ করুন।',
    descEn: 'Set mission, weekly & short-term goals. Manage special and daily tasks separately.',
    tip: 'ডেইলি টাস্ক প্রতিদিন অটো রিসেট হয়, তাই রুটিন কাজ এখানে দিন!',
    tipEn: 'Daily tasks auto-reset every day, put routine work here!',
    benefit: 'ছোট ছোট টার্গেট পূরণে বড় সাফল্য আসে।',
    benefitEn: 'Achieving small targets leads to big success.',
  },
  {
    title: 'স্টাডি লগ ও স্ট্রিক 🔥',
    titleEn: 'Study Log & Streak 🔥',
    description: 'স্টপওয়াচ দিয়ে পড়ার সময় ট্র্যাক করুন। বিষয় সিলেক্ট করুন, নোট লিখুন। প্রতিদিন লগ করলে স্ট্রিক বাড়বে!',
    descEn: 'Track study time with stopwatch. Select subject, add notes. Log daily to build streak!',
    tip: 'একদিনও মিস করবেন না! স্ট্রিক ০ থেকে শুরু হবে!',
    tipEn: "Don't miss a single day! Streak resets to 0!",
    benefit: 'নিয়মিত পড়ার অভ্যাস তৈরি করুন।',
    benefitEn: 'Build a consistent study habit.',
  },
  {
    title: 'পমোডোরো টাইমার ⏱️',
    titleEn: 'Pomodoro Timer ⏱️',
    description: '২৫ মিনিট ফোকাস, ৫ মিনিট বিরতি। ৪টি সেশনের পর বড় বিরতি। টাইমার মিনিমাইজ করে অন্য পেজেও ব্যবহার করুন।',
    descEn: '25 min focus, 5 min break. Long break after 4 sessions. Minimize timer to use on other pages.',
    tip: 'ফোকাস মোডে ফোন দূরে রাখুন!',
    tipEn: 'Keep your phone away in focus mode!',
    benefit: 'বৈজ্ঞানিকভাবে প্রমাণিত মনোযোগ বাড়ানোর টেকনিক।',
    benefitEn: 'Scientifically proven technique to improve focus.',
  },
  {
    title: 'অ্যানালিটিক্স ও কাস্টমাইজ 📊',
    titleEn: 'Analytics & Customize 📊',
    description: 'শনি-শুক্র সাইকেলে সব পরিসংখ্যান দেখুন। ড্যাশবোর্ড সেটিংস থেকে কাস্টমাইজ করুন। প্রতিদিন থিম অটো বদলায়!',
    descEn: 'View Sat-Fri cycle stats. Customize dashboard settings. Theme auto-changes daily!',
    tip: 'প্রোফাইল থেকে ভাষা, থিম ও অবতার পরিবর্তন করুন!',
    tipEn: 'Change language, theme & avatar from Profile!',
    benefit: 'নিজের মতো করে অ্যাপ সাজান।',
    benefitEn: 'Personalize the app to your liking.',
  },
  {
    title: 'শুরু করুন! 🚀',
    titleEn: 'Get Started! 🚀',
    description: 'আপনি প্রস্তুত! এখন সিলেবাস তৈরি করে, বিষয় যোগ করে শুরু করুন। প্রতিদিন পড়ুন, লগ করুন, এগিয়ে যান!',
    descEn: "You're ready! Create a syllabus, add subjects, and start. Study daily, log it, move forward!",
    tip: 'প্রতিদিন ছোট ছোট অগ্রগতিই বড় সাফল্যের চাবিকাঠি!',
    tipEn: 'Small daily progress is the key to big success!',
    benefit: '🎯 টার্গেট → 📚 পড়া → 📝 লগ → 📊 বিশ্লেষণ → 🏆 সফলতা',
    benefitEn: '🎯 Target → 📚 Study → 📝 Log → 📊 Analyze → 🏆 Success',
  },
];

export function AboutApp({ open, onOpenChange }: AboutAppProps) {
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const handleStartTour = () => { setShowTour(true); setTourStep(0); };
  const handleNextStep = () => {
    if (tourStep < tourSteps.length - 1) setTourStep(prev => prev + 1);
    else { setShowTour(false); onOpenChange(false); }
  };
  const handlePrevStep = () => { if (tourStep > 0) setTourStep(prev => prev - 1); };

  if (showTour) {
    const step = tourSteps[tourStep];
    return (
      <Dialog open={open} onOpenChange={(o) => { if (!o) setShowTour(false); onOpenChange(o); }}>
        <DialogContent className="sm:max-w-lg">
          <div className="space-y-6">
            <div className="flex gap-1">
              {tourSteps.map((_, i) => (
                <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= tourStep ? "bg-primary" : "bg-muted")} />
              ))}
            </div>

            <div className="text-center py-4">
              <div className="text-5xl mb-4">
                {['🎉', '📚', '🎯', '🔥', '⏱️', '📊', '🚀'][tourStep]}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3 font-bengali">
                {isBn ? step.title : step.titleEn}
              </h2>
              <p className="text-muted-foreground font-bengali mb-4 leading-relaxed">
                {isBn ? step.description : step.descEn}
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
                <p className="text-sm text-primary font-bengali">
                  💡 {isBn ? 'টিপ' : 'Tip'}: {isBn ? step.tip : step.tipEn}
                </p>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                <p className="text-sm text-success font-bengali">
                  ✅ {isBn ? 'লাভ' : 'Benefit'}: {isBn ? step.benefit : step.benefitEn}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handlePrevStep} disabled={tourStep === 0} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span className="font-bengali">{isBn ? 'আগে' : 'Back'}</span>
              </Button>
              <span className="text-xs text-muted-foreground self-center">{tourStep + 1}/{tourSteps.length}</span>
              <Button onClick={handleNextStep} variant="gradient" className="gap-2">
                <span className="font-bengali">
                  {tourStep === tourSteps.length - 1 ? (isBn ? 'শুরু করুন!' : 'Start!') : (isBn ? 'পরে' : 'Next')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <img src={logoImg} alt="Study Tracker" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <span>Study Tracker</span>
              <p className="text-xs text-muted-foreground font-normal font-bengali">স্টাডি ট্র্যাকার</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="glass-card p-4 bg-gradient-to-br from-primary/5 to-accent/5">
            <p className="text-foreground font-bengali leading-relaxed">
              {isBn 
                ? <><strong>Study Tracker</strong> হলো বাংলাদেশি শিক্ষার্থীদের জন্য তৈরি একটি পূর্ণাঙ্গ স্টাডি ম্যানেজমেন্ট অ্যাপ। মাল্টি সিলেবাস, স্ট্রিক সিস্টেম, পমোডোরো টাইমার, টাইমটেবিল, ড্যাশবোর্ড কাস্টমাইজেশন, ডেইলি অটো থিম সহ ১৫+ ফিচার। এই অ্যাপে Google Gemini AI ও NotebookLM ব্যবহার করা হয়েছে।</>
                : <><strong>Study Tracker</strong> is a complete study management app for Bangladeshi students with 15+ features including multi-syllabus, streak system, pomodoro, timetable, and more. Powered by Google Gemini AI & NotebookLM.</>
              }
            </p>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 font-bengali">
              ✨ {isBn ? 'ফিচারসমূহ' : 'Features'} ({features.length})
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                  <div className={cn('p-2 rounded-lg h-fit', feature.bgColor)}>
                    <feature.icon className={cn('w-5 h-5', feature.color)} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground font-bengali text-sm">
                      {isBn ? feature.title : feature.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground font-bengali leading-relaxed">
                      {isBn ? feature.description : feature.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tour Button */}
          <Button onClick={handleStartTour} variant="gradient" className="w-full gap-2" size="lg">
            <Play className="w-5 h-5" />
            <span className="font-bengali">{isBn ? 'অ্যাপ টিউটোরিয়াল দেখুন' : 'View App Tutorial'}</span>
          </Button>

          {/* Credits */}
          <div className="text-center pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="font-bengali">{isBn ? 'তৈরি করেছেন' : 'Created by'}</span>
              <Heart className="w-4 h-4 text-destructive animate-pulse" />
            </div>
            <p className="text-foreground font-semibold mt-1 font-bengali">মাজহারুল ইসলাম</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <Code2 className="w-3 h-3" />
              <span>Study Tracker v4.8.6</span>
              <span className="ml-2 font-bengali">• {features.length}+ ফিচার</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {isBn ? 'সর্বশেষ আপডেট: মার্চ ২০২৬' : 'Last updated: March 2026'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
