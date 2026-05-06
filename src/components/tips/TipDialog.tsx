import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Tip } from '@/hooks/useTips';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tip: Tip | null;
  onSubmit: (data: { title: string; content: string; link_url: string | null; category: string }) => void | Promise<void>;
  categories: { id: string; label: string }[];
}

export function TipDialog({ open, onOpenChange, tip, onSubmit, categories }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [category, setCategory] = useState('study');

  useEffect(() => {
    if (open) {
      setTitle(tip?.title ?? '');
      setContent(tip?.content ?? '');
      setLinkUrl(tip?.link_url ?? '');
      setCategory(tip?.category ?? 'study');
    }
  }, [open, tip]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      link_url: linkUrl.trim() || null,
      category,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bengali">{tip ? 'টিপ এডিট করুন' : 'নতুন টিপ যোগ করুন'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="font-bengali text-xs">শিরোনাম</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="যেমন: পড়া মনে রাখার সহজ কৌশল" className="font-bengali" />
          </div>
          <div>
            <Label className="font-bengali text-xs">বিবরণ</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} rows={5} placeholder="বিস্তারিত লিখুন..." className="font-bengali" />
          </div>
          <div>
            <Label className="font-bengali text-xs">রিসোর্স লিংক (ঐচ্ছিক)</Label>
            <Input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." type="url" />
          </div>
          <div>
            <Label className="font-bengali text-xs">ক্যাটেগরি</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="font-bengali"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id} className="font-bengali">{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-bengali">বাতিল</Button>
          <Button onClick={handleSave} disabled={!title.trim() || !content.trim()} className="font-bengali">সংরক্ষণ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}