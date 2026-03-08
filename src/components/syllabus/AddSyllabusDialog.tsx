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
import { FolderPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddSyllabusDialogProps {
  onAdd: (syllabus: { name: string; name_bn: string | null; description: string | null; color: string }) => void;
}

const colors = [
  'hsl(168 65% 35%)',
  'hsl(38 92% 55%)',
  'hsl(145 65% 42%)',
  'hsl(200 85% 50%)',
  'hsl(280 70% 50%)',
  'hsl(340 75% 55%)',
];

export function AddSyllabusDialog({ onAdd }: AddSyllabusDialogProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      name_bn: nameBn.trim() || null,
      description: description.trim() || null,
      color: selectedColor,
    });

    setName('');
    setNameBn('');
    setDescription('');
    setSelectedColor(colors[0]);
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
      <DialogContent className="sm:max-w-md">
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
          <Button type="submit" className="w-full" variant="gradient">
            {language === 'bn' ? 'সিলেবাস তৈরি করুন' : 'Create Syllabus'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
