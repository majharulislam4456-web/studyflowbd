import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import type { Subject } from '@/hooks/useSupabaseData';
import type { Note } from '@/components/views/NotesView';

interface AddNoteDialogProps {
  subjects: Subject[];
  onAdd: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function AddNoteDialog({ subjects, onAdd }: AddNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState<string>('');

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onAdd({
      title: title.trim(),
      title_bn: null,
      content: content.trim(),
      subject_id: subjectId || null,
    });
    setTitle('');
    setContent('');
    setSubjectId('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          <span>নতুন নোট</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bengali">নতুন নোট যোগ করো</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="font-bengali">শিরোনাম *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="নোটের শিরোনাম..." />
          </div>
          <div>
            <Label className="font-bengali">বিষয়</Label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
            >
              <option value="">সাধারণ / General</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="font-bengali">নোট লেখো</Label>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="তোমার নোট এখানে লেখো..."
              rows={8}
            />
          </div>
          <Button onClick={handleSubmit} disabled={!title.trim()} className="w-full font-bengali">
            সেভ করো
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
