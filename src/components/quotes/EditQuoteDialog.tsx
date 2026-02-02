import { useState, useEffect } from 'react';
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
} from '@/components/ui/dialog';
import type { Quote } from '@/hooks/useSupabaseData';

interface EditQuoteDialogProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Quote>) => void;
}

export function EditQuoteDialog({ quote, open, onOpenChange, onSave }: EditQuoteDialogProps) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [isBengali, setIsBengali] = useState(true);

  useEffect(() => {
    if (quote) {
      setText(quote.text);
      setAuthor(quote.author || '');
      setIsBengali(quote.is_bengali);
    }
  }, [quote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !text.trim()) return;

    onSave(quote.id, {
      text: text.trim(),
      author: author.trim() || null,
      is_bengali: isBengali,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit Quote / <span className="font-bengali">উক্তি সম্পাদনা</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-text">
              Quote Text / <span className="font-bengali">উক্তির লেখা</span>
            </Label>
            <Textarea
              id="edit-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isBengali ? "আপনার উক্তি লিখুন..." : "Enter your quote..."}
              className={isBengali ? "font-bengali" : ""}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-author">
              Author (optional) / <span className="font-bengali">লেখক (ঐচ্ছিক)</span>
            </Label>
            <Input
              id="edit-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={isBengali ? "লেখকের নাম" : "Author name"}
              className={isBengali ? "font-bengali" : ""}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-isBengali" className="cursor-pointer">
              Bengali Quote / <span className="font-bengali">বাংলা উক্তি</span>
            </Label>
            <Switch
              id="edit-isBengali"
              checked={isBengali}
              onCheckedChange={setIsBengali}
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
