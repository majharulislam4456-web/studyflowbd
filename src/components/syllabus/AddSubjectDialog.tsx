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
import { Plus } from 'lucide-react';
import type { Subject } from '@/types/study';

interface AddSubjectDialogProps {
  onAdd: (subject: Omit<Subject, 'id'>) => void;
}

const colors = [
  'hsl(168 65% 35%)',
  'hsl(38 92% 55%)',
  'hsl(145 65% 42%)',
  'hsl(200 85% 50%)',
  'hsl(280 70% 50%)',
  'hsl(340 75% 55%)',
];

export function AddSubjectDialog({ onAdd }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [totalChapters, setTotalChapters] = useState('10');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !totalChapters) return;

    onAdd({
      name: name.trim(),
      nameBn: nameBn.trim() || undefined,
      totalChapters: parseInt(totalChapters),
      completedChapters: 0,
      color: selectedColor,
    });

    setName('');
    setNameBn('');
    setTotalChapters('10');
    setSelectedColor(colors[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Subject / <span className="font-bengali">বিষয় যোগ করুন</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add New Subject / <span className="font-bengali">নতুন বিষয় যোগ করুন</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name (English)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nameBn" className="font-bengali">বিষয়ের নাম (বাংলা)</Label>
            <Input
              id="nameBn"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="যেমন: গণিত"
              className="font-bengali"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chapters">Total Chapters / <span className="font-bengali">মোট অধ্যায়</span></Label>
            <Input
              id="chapters"
              type="number"
              min="1"
              max="100"
              value={totalChapters}
              onChange={(e) => setTotalChapters(e.target.value)}
              required
            />
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
            Add Subject / <span className="font-bengali">যোগ করুন</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
