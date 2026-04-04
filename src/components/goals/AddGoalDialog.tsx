import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Goal } from '@/hooks/useSupabaseData';

interface AddGoalDialogProps {
  onAdd: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
}

export function AddGoalDialog({ onAdd }: AddGoalDialogProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const deadlineDate = deadline ? new Date(deadline) : null;
    const now = new Date();
    const daysTotal = deadlineDate ? Math.max(1, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 30;

    onAdd({
      title: title.trim(),
      title_bn: titleBn.trim() || null,
      type: daysTotal <= 3 ? 'short' : daysTotal <= 7 ? 'weekly' : 'mission',
      days_total: daysTotal,
      days_remaining: daysTotal,
      progress: 0,
      is_completed: false,
      deadline: deadline || null,
      description: description.trim() || null,
    });

    setTitle(''); setTitleBn(''); setDescription(''); setDeadline('');
    setOpen(false);
  };

  const isBn = language === 'bn';

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
          {language === 'en' && (
            <div className="space-y-2">
              <Label className="font-bengali">শিরোনাম (বাংলা)</Label>
              <Input
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="বাংলায় শিরোনাম (ঐচ্ছিক)"
                className="font-bengali"
              />
            </div>
          )}
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
