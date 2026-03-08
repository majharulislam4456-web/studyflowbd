import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Subject } from '@/hooks/useSupabaseData';
import type { Note } from '@/components/views/NotesView';

interface EditNoteDialogProps {
  note: Note;
  subjects: Subject[];
  onUpdate: (id: string, updates: Partial<Note>) => Promise<void>;
  onClose: () => void;
}

export function EditNoteDialog({ note, subjects, onUpdate, onClose }: EditNoteDialogProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [subjectId, setSubjectId] = useState(note.subject_id || '');

  const handleSave = async () => {
    if (!title.trim()) return;
    await onUpdate(note.id, {
      title: title.trim(),
      content: content.trim(),
      subject_id: subjectId || null,
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-bengali">নোট এডিট করো</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="font-bengali">শিরোনাম</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
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
            <Label className="font-bengali">নোট</Label>
            <Textarea value={content} onChange={e => setContent(e.target.value)} rows={10} />
          </div>
          <Button onClick={handleSave} disabled={!title.trim()} className="w-full font-bengali">
            আপডেট করো
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
