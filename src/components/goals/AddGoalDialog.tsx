import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Goal } from '@/hooks/useSupabaseData';

interface AddGoalDialogProps {
  onAdd: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
}

const GOAL_TEMPLATES = [
  { title: 'Exam Preparation', titleBn: 'পরীক্ষার প্রস্তুতি', days: 30, emoji: '📝' },
  { title: 'Finish Syllabus', titleBn: 'সিলেবাস শেষ করা', days: 60, emoji: '📚' },
  { title: 'Learn New Subject', titleBn: 'নতুন বিষয় শেখা', days: 14, emoji: '🎓' },
  { title: 'Daily Practice', titleBn: 'প্রতিদিন অনুশীলন', days: 7, emoji: '💪' },
];

export function AddGoalDialog({ onAdd }: AddGoalDialogProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const isBn = language === 'bn';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    submitGoal(title.trim(), description.trim() || null, deadline);
  };

  const submitGoal = (goalTitle: string, goalDesc: string | null, goalDeadline: string) => {
    const deadlineDate = goalDeadline ? new Date(goalDeadline) : null;
    const now = new Date();
    const daysTotal = deadlineDate ? Math.max(1, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 30;

    onAdd({
      title: goalTitle,
      title_bn: null,
      type: daysTotal <= 3 ? 'short' : daysTotal <= 7 ? 'weekly' : 'mission',
      days_total: daysTotal,
      days_remaining: daysTotal,
      progress: 0,
      is_completed: false,
      deadline: goalDeadline || null,
      description: goalDesc,
    });

    setTitle(''); setDescription(''); setDeadline('');
    setOpen(false);
  };

  const handleTemplate = (template: typeof GOAL_TEMPLATES[0]) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + template.days);
    const deadlineStr = futureDate.toISOString().split('T')[0];
    
    submitGoal(
      isBn ? template.titleBn : template.title,
      null,
      deadlineStr
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          {isBn ? 'লক্ষ্য যোগ করুন' : 'Add Goal'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bengali">
            {isBn ? 'নতুন লক্ষ্য তৈরি করুন' : 'Create New Goal'}
          </DialogTitle>
        </DialogHeader>

        {/* Quick Templates */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            {isBn ? 'দ্রুত টেমপ্লেট' : 'Quick Templates'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {GOAL_TEMPLATES.map((tpl) => (
              <button
                key={tpl.title}
                onClick={() => handleTemplate(tpl)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all text-left hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-lg">{tpl.emoji}</span>
                <span className="text-xs font-medium font-bengali">
                  {isBn ? tpl.titleBn : tpl.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">
              {isBn ? 'অথবা কাস্টম' : 'or custom'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{isBn ? 'লক্ষ্যের শিরোনাম' : 'Goal Title'}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isBn ? 'যেমন: বিসিএস প্রিপারেশন' : 'e.g., BCS Preparation'}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{isBn ? 'বিবরণ (ঐচ্ছিক)' : 'Description (optional)'}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isBn ? 'লক্ষ্য সম্পর্কে বিস্তারিত...' : 'Details about this goal...'}
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {isBn ? 'ডেডলাইন' : 'Deadline'}
            </Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground font-bengali">
              {isBn ? 'ডেডলাইন না দিলে ৩০ দিন ধরা হবে' : 'Defaults to 30 days if no deadline set'}
            </p>
          </div>
          <Button type="submit" className="w-full" variant="gradient">
            {isBn ? 'লক্ষ্য তৈরি করুন' : 'Create Goal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
