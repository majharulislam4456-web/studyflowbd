import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { Goal } from '@/types/study';

interface AddGoalDialogProps {
  onAdd: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
}

export function AddGoalDialog({ onAdd }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [type, setType] = useState<'mission' | 'weekly' | 'short'>('weekly');

  const getDaysForType = (t: string) => {
    switch (t) {
      case 'mission': return 30;
      case 'weekly': return 7;
      case 'short': return 3;
      default: return 7;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const daysTotal = getDaysForType(type);

    onAdd({
      title: title.trim(),
      titleBn: titleBn.trim() || undefined,
      type,
      daysTotal,
      daysRemaining: daysTotal,
      progress: 0,
      isCompleted: false,
    });

    setTitle('');
    setTitleBn('');
    setType('weekly');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Goal / <span className="font-bengali">লক্ষ্য যোগ করুন</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Create New Goal / <span className="font-bengali">নতুন লক্ষ্য তৈরি করুন</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title (English)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Physics Syllabus"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="titleBn" className="font-bengali">লক্ষ্যের শিরোনাম (বাংলা)</Label>
            <Input
              id="titleBn"
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
          <Button type="submit" className="w-full" variant="gradient">
            Create Goal / <span className="font-bengali">লক্ষ্য তৈরি করুন</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
