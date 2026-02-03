import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  GraduationCap, 
  Target, 
  Clock, 
  BookOpen, 
  BarChart3, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Play,
  Heart,
  Code2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AboutAppProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const features = [
  {
    icon: BookOpen,
    title: 'সিলেবাস ট্র্যাকার',
    titleEn: 'Syllabus Tracker',
    description: 'আপনার সকল বিষয়ের অধ্যায়গুলো ট্র্যাক করুন। কতটা শেষ হয়েছে, কতটা বাকি - সব এক জায়গায়।',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Target,
    title: 'গোল সেটিং',
    titleEn: 'Goal Setting',
    description: '৩০ দিনের মিশন বা ছোট সাপ্তাহিক গোল সেট করুন। প্রতিদিন নিজেকে চ্যালেঞ্জ করুন।',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Clock,
    title: 'পমোডোরো টাইমার',
    titleEn: 'Pomodoro Timer',
    description: 'ফোকাসড স্টাডি সেশনের জন্য পমোডোরো টেকনিক ব্যবহার করুন। ২৫ মিনিট পড়া, ৫ মিনিট বিরতি।',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    icon: BarChart3,
    title: 'স্টাডি অ্যানালিটিক্স',
    titleEn: 'Study Analytics',
    description: 'আপনার পড়াশোনার পরিসংখ্যান দেখুন। দৈনিক, সাপ্তাহিক ও বিষয়ভিত্তিক বিশ্লেষণ।',
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    icon: Sparkles,
    title: 'মোটিভেশন',
    titleEn: 'Motivation',
    description: 'অনুপ্রেরণামূলক উক্তি সংগ্রহ করুন। বাংলা ও ইংরেজি দুই ভাষায়ই যোগ করতে পারবেন।',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

const tourSteps = [
  {
    title: 'স্বাগতম! 🎉',
    description: 'StudyFlow BD-তে আপনাকে স্বাগতম! এই অ্যাপ আপনার পড়াশোনাকে আরো সংগঠিত ও কার্যকর করতে সাহায্য করবে।',
    tip: 'আপনার সব ডাটা ক্লাউডে সেভ থাকে, তাই যেকোনো ডিভাইস থেকে অ্যাক্সেস করতে পারবেন!',
  },
  {
    title: 'সিলেবাস ট্র্যাক করুন 📚',
    description: 'প্রতিটি বিষয়ের জন্য মোট অধ্যায় সংখ্যা দিন। যত পড়বেন, তত মার্ক করুন কমপ্লিট।',
    tip: 'বিষয়ের নাম বাংলা ও ইংরেজি দুইটাই দিতে পারবেন!',
  },
  {
    title: 'গোল সেট করুন 🎯',
    description: 'মিশন হলো ৩০ দিনের বড় গোল। সাপ্তাহিক গোল হলো ৩-৭ দিনের ছোট টার্গেট।',
    tip: 'ছোট ছোট গোল দিয়ে শুরু করুন, বড় গোলে যাওয়ার আগে!',
  },
  {
    title: 'পমোডোরো ব্যবহার করুন ⏱️',
    description: 'টাইমার চালু করুন এবং ফোকাস মোডে যান। ডিসট্র্যাকশন ছাড়া পড়াশোনা করুন।',
    tip: 'প্রতি ৪টি পমোডোরোর পর একটা বড় বিরতি নিন!',
  },
  {
    title: 'সময় লগ করুন 📝',
    description: 'প্রতিদিন কতক্ষণ পড়লেন তা লগ করুন। বিষয় সিলেক্ট করলে বিষয়ভিত্তিক ট্র্যাকিং হবে।',
    tip: 'নিয়মিত লগ করলে অ্যানালিটিক্সে সুন্দর গ্রাফ দেখতে পাবেন!',
  },
  {
    title: 'শুরু করুন! 🚀',
    description: 'আপনি প্রস্তুত! এখন সিলেবাস যোগ করে শুরু করুন। শুভকামনা!',
    tip: 'প্রতিদিন ছোট ছোট অগ্রগতিই বড় সাফল্যের চাবিকাঠি!',
  },
];

export function AboutApp({ open, onOpenChange }: AboutAppProps) {
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const handleStartTour = () => {
    setShowTour(true);
    setTourStep(0);
  };

  const handleNextStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      setShowTour(false);
      onOpenChange(false);
    }
  };

  const handlePrevStep = () => {
    if (tourStep > 0) {
      setTourStep(prev => prev - 1);
    }
  };

  if (showTour) {
    const currentStep = tourSteps[tourStep];
    return (
      <Dialog open={open} onOpenChange={(o) => { if (!o) setShowTour(false); onOpenChange(o); }}>
        <DialogContent className="sm:max-w-lg">
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex gap-1">
              {tourSteps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i <= tourStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Content */}
            <div className="text-center py-6">
              <div className="text-5xl mb-4">
                {['🎉', '📚', '🎯', '⏱️', '📝', '🚀'][tourStep]}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3 font-bengali">
                {currentStep.title}
              </h2>
              <p className="text-muted-foreground font-bengali mb-4">
                {currentStep.description}
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="text-sm text-primary font-bengali">
                  💡 টিপ: {currentStep.tip}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevStep}
                disabled={tourStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="font-bengali">আগে</span>
              </Button>
              <Button
                onClick={handleNextStep}
                variant="gradient"
                className="gap-2"
              >
                <span className="font-bengali">
                  {tourStep === tourSteps.length - 1 ? 'শুরু করুন!' : 'পরে'}
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
            <GraduationCap className="w-8 h-8 text-primary" />
            <span>StudyFlow BD</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* App Description */}
          <div className="glass-card p-4 bg-gradient-to-br from-primary/5 to-accent/5">
            <p className="text-foreground font-bengali leading-relaxed">
              <strong>StudyFlow BD</strong> হলো বাংলাদেশি শিক্ষার্থীদের জন্য তৈরি একটি পূর্ণাঙ্গ স্টাডি ম্যানেজমেন্ট অ্যাপ। 
              এই অ্যাপ দিয়ে আপনি আপনার পড়াশোনার সিলেবাস ট্র্যাক করতে পারবেন, গোল সেট করতে পারবেন, 
              পমোডোরো টেকনিক ব্যবহার করতে পারবেন এবং আপনার প্রতিদিনের অগ্রগতি বিশ্লেষণ করতে পারবেন।
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 font-bengali">✨ ফিচারসমূহ</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={cn('p-2 rounded-lg h-fit', feature.bgColor)}>
                    <feature.icon className={cn('w-5 h-5', feature.color)} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground font-bengali">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-bengali">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* App Tour Button */}
          <Button
            onClick={handleStartTour}
            variant="gradient"
            className="w-full gap-2"
            size="lg"
          >
            <Play className="w-5 h-5" />
            <span className="font-bengali">অ্যাপ টিউটোরিয়াল দেখুন</span>
          </Button>

          {/* Credits */}
          <div className="text-center pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span className="font-bengali">তৈরি করা হয়েছে</span>
              <Heart className="w-4 h-4 text-destructive" />
              <span className="font-bengali">দিয়ে</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <Code2 className="w-3 h-3" />
              <span>StudyFlow BD v1.0</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
