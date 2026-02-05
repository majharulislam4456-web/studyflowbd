import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
 import { GraduationCap, BookOpen, Stethoscope, Wrench, Atom, Palette, Code, Briefcase, Scale, Shield, Building2, Landmark, Heart, Plane, Calculator, Microscope } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar?: string | null;
  onSelect: (avatarUrl: string) => void;
}

const avatarOptions = [
 // Popular future professions for students
   { id: 'bcs_cadre', icon: Shield, color: 'bg-emerald-600', key: 'bcsCadre' },
   { id: 'doctor', icon: Stethoscope, color: 'bg-red-500', key: 'doctor' },
   { id: 'engineer', icon: Wrench, color: 'bg-orange-500', key: 'engineer' },
   { id: 'lawyer', icon: Scale, color: 'bg-indigo-600', key: 'lawyer' },
   { id: 'banker', icon: Building2, color: 'bg-blue-600', key: 'banker' },
   { id: 'judge', icon: Landmark, color: 'bg-purple-700', key: 'judge' },
   { id: 'teacher', icon: BookOpen, color: 'bg-green-500', key: 'teacher' },
   { id: 'scientist', icon: Microscope, color: 'bg-purple-500', key: 'scientist' },
   { id: 'pilot', icon: Plane, color: 'bg-sky-500', key: 'pilot' },
   { id: 'nurse', icon: Heart, color: 'bg-pink-500', key: 'nurse' },
   { id: 'accountant', icon: Calculator, color: 'bg-slate-600', key: 'accountant' },
   { id: 'developer', icon: Code, color: 'bg-teal-500', key: 'developer' },
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
        
         <div className="grid grid-cols-4 gap-3 py-4 max-h-[400px] overflow-y-auto">
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
