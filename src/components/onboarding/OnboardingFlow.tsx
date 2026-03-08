import { useState } from 'react';
import { GraduationCap, BookOpen, FlaskConical, Palette, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoImg from '@/assets/logo.jpg';

const CLASS_OPTIONS = [
  { value: '6', label: 'Class 6', labelBn: '৬ষ্ঠ শ্রেণি' },
  { value: '7', label: 'Class 7', labelBn: '৭ম শ্রেণি' },
  { value: '8', label: 'Class 8', labelBn: '৮ম শ্রেণি' },
  { value: '9', label: 'Class 9', labelBn: '৯ম শ্রেণি' },
  { value: '10', label: 'Class 10', labelBn: '১০ম শ্রেণি' },
  { value: '11', label: 'Class 11', labelBn: '১১শ শ্রেণি' },
  { value: '12', label: 'Class 12', labelBn: '১২শ শ্রেণি' },
  { value: 'other', label: 'Other', labelBn: 'অন্যান্য' },
];

const DIVISION_OPTIONS = [
  { value: 'science', label: 'Science', labelBn: 'বিজ্ঞান', icon: FlaskConical, color: 'bg-primary/10 text-primary border-primary/30' },
  { value: 'arts', label: 'Arts / Humanities', labelBn: 'মানবিক', icon: Palette, color: 'bg-accent/10 text-accent-foreground border-accent/30' },
  { value: 'commerce', label: 'Commerce', labelBn: 'ব্যবসায় শিক্ষা', icon: Briefcase, color: 'bg-info/10 text-info border-info/30' },
];

const NEEDS_DIVISION = ['9', '10', '11', '12'];

interface OnboardingFlowProps {
  displayName: string | null;
  onComplete: (studentClass: string, division: string | null) => void;
}

export function OnboardingFlow({ displayName, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<'class' | 'division'>('class');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  const handleClassSelect = (cls: string) => {
    setSelectedClass(cls);
    if (NEEDS_DIVISION.includes(cls)) {
      setStep('division');
    } else {
      onComplete(cls, null);
    }
  };

  const handleDivisionSelect = (div: string) => {
    setSelectedDivision(div);
  };

  const handleFinish = () => {
    if (selectedClass && selectedDivision) {
      onComplete(selectedClass, selectedDivision);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Logo & Welcome */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img src={logoImg} alt="Study Tracker" className="w-20 h-20 mx-auto rounded-2xl shadow-lg mb-4 object-cover" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-bengali">
            {displayName ? `স্বাগতম, ${displayName}! 🎉` : 'স্বাগতম! 🎉'}
          </h1>
          <p className="text-muted-foreground mt-1 font-bengali">
            {step === 'class' ? 'তুমি কোন ক্লাসে পড়ো?' : 'তোমার বিভাগ কোনটি?'}
          </p>
        </div>

        <div className="glass-card p-6">
          {step === 'class' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground font-bengali">ক্লাস সিলেক্ট করো</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {CLASS_OPTIONS.map((cls, i) => (
                  <button
                    key={cls.value}
                    onClick={() => handleClassSelect(cls.value)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                      "border-border hover:border-primary/50 bg-card",
                      `animate-fade-in`
                    )}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <p className="font-semibold text-foreground">{cls.label}</p>
                    <p className="text-sm text-muted-foreground font-bengali">{cls.labelBn}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'division' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground font-bengali">বিভাগ সিলেক্ট করো</h2>
              </div>
              <p className="text-sm text-muted-foreground font-bengali">
                ক্লাস {selectedClass} — তোমার বিভাগ কোনটি?
              </p>
              <div className="space-y-3">
                {DIVISION_OPTIONS.map((div, i) => {
                  const Icon = div.icon;
                  const isSelected = selectedDivision === div.value;
                  return (
                    <button
                      key={div.value}
                      onClick={() => handleDivisionSelect(div.value)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-200 hover:shadow-md",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/40 bg-card",
                        `animate-fade-in`
                      )}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", div.color)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">{div.label}</p>
                        <p className="text-sm text-muted-foreground font-bengali">{div.labelBn}</p>
                      </div>
                      {isSelected && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground text-sm">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => { setStep('class'); setSelectedDivision(null); }} className="flex-1 font-bengali">
                  পেছনে যাও
                </Button>
                <Button onClick={handleFinish} disabled={!selectedDivision} className="flex-1 gap-2 font-bengali">
                  শুরু করো <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 font-bengali">
          Study Tracker — তোমার পড়াশোনার সঙ্গী 📚
        </p>
      </div>
    </div>
  );
}
