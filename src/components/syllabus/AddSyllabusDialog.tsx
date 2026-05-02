import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FolderPlus, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Subject } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';

interface AddSyllabusDialogProps {
  onAdd: (syllabus: { name: string; name_bn: string | null; description: string | null; color: string }) => void;
  existingSubjects?: Subject[];
  onAddSubject?: (subject: Omit<Subject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<any> | void;
}

const colors = [
  'hsl(168 65% 35%)',
  'hsl(38 92% 55%)',
  'hsl(145 65% 42%)',
  'hsl(200 85% 50%)',
  'hsl(280 70% 50%)',
  'hsl(340 75% 55%)',
];

export function AddSyllabusDialog({ onAdd, existingSubjects = [], onAddSubject }: AddSyllabusDialogProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  // subject_id -> chapters (string for input)
  const [picked, setPicked] = useState<Record<string, string>>({});

  // Deduplicate subjects by name (so same subject across syllabuses isn't shown twice)
  const uniqueSubjects = Array.from(
    new Map(existingSubjects.map(s => [(s.name || '').toLowerCase().trim(), s])).values()
  );

  const togglePick = (s: Subject) => {
    setPicked(prev => {
      const next = { ...prev };
      if (next[s.id] !== undefined) delete next[s.id];
      else next[s.id] = String(s.total_chapters || 10);
      return next;
    });
  };

  const reset = () => {
    setName(''); setNameBn(''); setDescription('');
    setSelectedColor(colors[0]); setPicked({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onAdd({
      name: name.trim(),
      name_bn: nameBn.trim() || null,
      description: description.trim() || null,
      color: selectedColor,
    });

    // Note: parent assigns the new syllabus_id automatically via active tab on next add.
    // Here we just create copies as standalone subjects under the new syllabus context once active.
    // Since we don't get back the new syllabus id synchronously, copies are created without syllabus_id;
    // SyllabusView's handleAddSubject attaches activeSyllabusId. Caller should handle activation.
    if (onAddSubject) {
      for (const id of Object.keys(picked)) {
        const src = uniqueSubjects.find(s => s.id === id);
        if (!src) continue;
        const total = Math.max(1, parseInt(picked[id] || '10', 10) || 10);
        await onAddSubject({
          name: src.name,
          name_bn: src.name_bn,
          total_chapters: total,
          completed_chapters: 0,
          color: src.color,
        } as any);
      }
    }

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderPlus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন সিলেবাস' : 'New Syllabus'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bengali">
            {language === 'bn' ? 'নতুন সিলেবাস তৈরি করুন' : 'Create New Syllabus'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Syllabus Name (English)</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., HSC 2025, Admission Prep"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bengali">সিলেবাসের নাম (বাংলা)</Label>
            <Input
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              placeholder="যেমন: এইচএসসি ২০২৫"
              className="font-bengali"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bengali">{language === 'bn' ? 'বিবরণ' : 'Description'}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'bn' ? 'সিলেবাসের বিবরণ...' : 'Brief description...'}
              className="font-bengali"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>{language === 'bn' ? 'রং' : 'Color'}</Label>
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

          {uniqueSubjects.length > 0 && onAddSubject && (
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="font-bengali">
                {language === 'bn'
                  ? '📚 অন্য সিলেবাস থেকে বিষয় কপি করুন (ঐচ্ছিক)'
                  : '📚 Copy subjects from other syllabuses (optional)'}
              </Label>
              <p className="text-xs text-muted-foreground font-bengali">
                {language === 'bn'
                  ? 'বিষয় সিলেক্ট করে এই সিলেবাসের জন্য অধ্যায় সংখ্যা দিন'
                  : 'Pick subjects and set chapter count for this syllabus'}
              </p>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {uniqueSubjects.map((s) => {
                  const isPicked = picked[s.id] !== undefined;
                  return (
                    <div
                      key={s.id}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded-lg border transition-all',
                        isPicked ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => togglePick(s)}
                        className="flex items-center gap-2 flex-1 min-w-0 text-left"
                      >
                        <div
                          className={cn(
                            'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                            isPicked ? 'bg-primary border-primary' : 'border-muted-foreground/40'
                          )}
                        >
                          {isPicked && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-sm truncate font-bengali">
                          {language === 'bn' && s.name_bn ? s.name_bn : s.name}
                        </span>
                      </button>
                      {isPicked && (
                        <Input
                          type="number"
                          min={1}
                          max={200}
                          value={picked[s.id]}
                          onChange={(e) =>
                            setPicked((p) => ({ ...p, [s.id]: e.target.value }))
                          }
                          className="w-16 h-8 text-xs"
                          placeholder="অধ্যায়"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" variant="gradient">
            {language === 'bn' ? 'সিলেবাস তৈরি করুন' : 'Create Syllabus'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
