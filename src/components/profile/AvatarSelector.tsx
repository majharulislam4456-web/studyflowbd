import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { GraduationCap, BookOpen, Stethoscope, Wrench, Atom, Palette, Code, Briefcase } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar?: string | null;
  onSelect: (avatarUrl: string) => void;
}

const avatarOptions = [
  { id: 'student', icon: GraduationCap, color: 'bg-blue-500', key: 'student' },
  { id: 'teacher', icon: BookOpen, color: 'bg-green-500', key: 'teacher' },
  { id: 'doctor', icon: Stethoscope, color: 'bg-red-500', key: 'doctor' },
  { id: 'engineer', icon: Wrench, color: 'bg-orange-500', key: 'engineer' },
  { id: 'scientist', icon: Atom, color: 'bg-purple-500', key: 'scientist' },
  { id: 'artist', icon: Palette, color: 'bg-pink-500', key: 'artist' },
  { id: 'developer', icon: Code, color: 'bg-teal-500', key: 'developer' },
  { id: 'entrepreneur', icon: Briefcase, color: 'bg-amber-500', key: 'entrepreneur' },
];

export function AvatarSelector({ currentAvatar, onSelect }: AvatarSelectorProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(currentAvatar || null);

  const handleSelect = (avatarId: string) => {
    setSelected(avatarId);
  };

  const handleSave = () => {
    if (selected) {
      onSelect(`avatar:${selected}`);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t('chooseAvatar')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bengali">{t('chooseAvatar')}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-4 py-4">
          {avatarOptions.map((avatar) => {
            const Icon = avatar.icon;
            const isSelected = selected === avatar.id || currentAvatar === `avatar:${avatar.id}`;
            
            return (
              <button
                key={avatar.id}
                onClick={() => handleSelect(avatar.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                  "hover:scale-105 hover:shadow-lg",
                  isSelected 
                    ? "ring-2 ring-primary bg-primary/10" 
                    : "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  avatar.color
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bengali text-center">{t(avatar.key)}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!selected}>
            {t('save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function getAvatarDisplay(avatarUrl: string | null | undefined) {
  if (!avatarUrl) return null;
  
  if (avatarUrl.startsWith('avatar:')) {
    const avatarId = avatarUrl.replace('avatar:', '');
    const avatar = avatarOptions.find(a => a.id === avatarId);
    if (avatar) {
      return {
        type: 'icon' as const,
        icon: avatar.icon,
        color: avatar.color,
      };
    }
  }
  
  return {
    type: 'image' as const,
    url: avatarUrl,
  };
}
