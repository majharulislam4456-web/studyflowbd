import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Subject } from '@/hooks/useSupabaseData';

interface EditSubjectDialogProps {
  subject: Subject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Subject>) => void;
}

const colors = [
  'hsl(168 65% 35%)',
  'hsl(38 92% 55%)',
  'hsl(145 65% 42%)',
  'hsl(200 85% 50%)',
  'hsl(280 70% 50%)',
  'hsl(340 75% 55%)',
];

export function EditSubjectDialog({ subject, open, onOpenChange, onSave }: EditSubjectDialogProps) {
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [totalChapters, setTotalChapters] = useState('10');
  const [completedChapters, setCompletedChapters] = useState('0');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setNameBn(subject.name_bn || '');
      setTotalChapters(String(subject.total_chapters));
      setCompletedChapters(String(subject.completed_chapters));
      setSelectedColor(subject.color);
    }
  }, [subject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !name.trim() || !totalChapters) return;

    onSave(subject.id, {
      name: name.trim(),
      name_bn: nameBn.trim() || null,
      total_chapters: parseInt(totalChapters),
      completed_chapters: Math.min(parseInt(completedChapters), parseInt(totalChapters)),
      color: selectedColor,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit Subject / <span className="font-bengali">বিষয় সম্পাদনা</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Subject Name (English)</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-nameBn" className="font-bengali">বিষয়ের নাম (বাংলা)</Label>
            <Input
              id="edit-nameBn"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="যেমন: গণিত"
              className="font-bengali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-total">Total Chapters</Label>
              <Input
                id="edit-total"
                type="number"
                min="1"
                max="100"
                value={totalChapters}
                onChange={(e) => setTotalChapters(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-completed">Completed</Label>
              <Input
                id="edit-completed"
                type="number"
                min="0"
                max={totalChapters}
                value={completedChapters}
                onChange={(e) => setCompletedChapters(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Color / <span className="font-bengali">রং</span></Label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" variant="gradient">
            Save Changes / <span className="font-bengali">পরিবর্তন সংরক্ষণ করুন</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
