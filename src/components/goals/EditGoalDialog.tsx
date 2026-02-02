import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Goal } from '@/hooks/useSupabaseData';

interface EditGoalDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Goal>) => void;
}

export function EditGoalDialog({ goal, open, onOpenChange, onSave }: EditGoalDialogProps) {
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [type, setType] = useState<'mission' | 'weekly' | 'short'>('weekly');
  const [progress, setProgress] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(7);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTitleBn(goal.title_bn || '');
      setType(goal.type);
      setProgress(goal.progress);
      setDaysRemaining(goal.days_remaining);
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !title.trim()) return;

    const getDaysForType = (t: string) => {
      switch (t) {
        case 'mission': return 30;
        case 'weekly': return 7;
        case 'short': return 3;
        default: return 7;
      }
    };

    onSave(goal.id, {
      title: title.trim(),
      title_bn: titleBn.trim() || null,
      type,
      days_total: getDaysForType(type),
      days_remaining: Math.min(daysRemaining, getDaysForType(type)),
      progress,
      is_completed: progress >= 100,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit Goal / <span className="font-bengali">লক্ষ্য সম্পাদনা</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Goal Title (English)</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Physics Syllabus"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-titleBn" className="font-bengali">লক্ষ্যের শিরোনাম (বাংলা)</Label>
            <Input
              id="edit-titleBn"
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="যেমন: পদার্থবিজ্ঞান সিলেবাস সম্পূর্ণ করুন"
              className="font-bengali"
            />
          </div>
          <div className="space-y-2">
            <Label>Goal Type / <span className="font-bengali">লক্ষ্যের ধরন</span></Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mission">
                  Mission (30 days) / <span className="font-bengali">মিশন (৩০ দিন)</span>
                </SelectItem>
                <SelectItem value="weekly">
                  Weekly (7 days) / <span className="font-bengali">সাপ্তাহিক (৭ দিন)</span>
                </SelectItem>
                <SelectItem value="short">
                  Short-term (3 days) / <span className="font-bengali">স্বল্পমেয়াদী (৩ দিন)</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Progress: {progress}%</Label>
            <Slider
              value={[progress]}
              onValueChange={(v) => setProgress(v[0])}
              max={100}
              step={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-days">Days Remaining / <span className="font-bengali">বাকি দিন</span></Label>
            <Input
              id="edit-days"
              type="number"
              min="0"
              max={type === 'mission' ? 30 : type === 'weekly' ? 7 : 3}
              value={daysRemaining}
              onChange={(e) => setDaysRemaining(parseInt(e.target.value) || 0)}
              required
            />
          </div>
          <Button type="submit" className="w-full" variant="gradient">
            Save Changes / <span className="font-bengali">পরিবর্তন সংরক্ষণ করুন</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
