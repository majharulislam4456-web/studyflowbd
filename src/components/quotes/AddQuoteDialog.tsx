import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import type { Quote } from '@/types/study';

interface AddQuoteDialogProps {
  onAdd: (quote: Omit<Quote, 'id'>) => void;
}

export function AddQuoteDialog({ onAdd }: AddQuoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [isBengali, setIsBengali] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd({
      text: text.trim(),
      author: author.trim() || undefined,
      isBengali,
    });

    setText('');
    setAuthor('');
    setIsBengali(true);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Quote / <span className="font-bengali">উক্তি যোগ করুন</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Add Motivational Quote / <span className="font-bengali">অনুপ্রেরণামূলক উক্তি যোগ করুন</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">
              Quote Text / <span className="font-bengali">উক্তির লেখা</span>
            </Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isBengali ? "আপনার উক্তি লিখুন..." : "Enter your quote..."}
              className={isBengali ? "font-bengali" : ""}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">
              Author (optional) / <span className="font-bengali">লেখক (ঐচ্ছিক)</span>
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={isBengali ? "লেখকের নাম" : "Author name"}
              className={isBengali ? "font-bengali" : ""}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isBengali" className="cursor-pointer">
              Bengali Quote / <span className="font-bengali">বাংলা উক্তি</span>
            </Label>
            <Switch
              id="isBengali"
              checked={isBengali}
              onCheckedChange={setIsBengali}
            />
          </div>
          <Button type="submit" className="w-full" variant="gradient">
            Add Quote / <span className="font-bengali">যোগ করুন</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
