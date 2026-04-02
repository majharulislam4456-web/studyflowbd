import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, Settings, LogOut, Mail, Info, Shield, Moon, Sun, 
  Languages, Lock, Upload, Flame, GraduationCap, Star, Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AboutApp } from '@/components/about/AboutApp';
import { AvatarSelector, getAvatarDisplay } from './AvatarSelector';
import { ThemeColorSelector, initializeThemeColor } from './ThemeColorSelector';
import type { Profile, StudySession } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateStreak } from '@/utils/streak';
import logoImg from '@/assets/logo.png';

interface ProfileViewProps {
  profile: Profile | null;
  sessions: StudySession[];
  onUpdateProfile: (updates: Partial<Profile>) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const CLASS_LABELS: Record<string, string> = {
  '6': '৬ষ্ঠ শ্রেণি', '7': '৭ম শ্রেণি', '8': '৮ম শ্রেণি',
  '9': '৯ম শ্রেণি', '10': '১০ম শ্রেণি', '11': '১১শ শ্রেণি', '12': '১২শ শ্রেণি',
  'other': 'অন্যান্য',
};

const DIVISION_LABELS: Record<string, string> = {
  'science': 'বিজ্ঞান', 'arts': 'মানবিক', 'commerce': 'ব্যবসায় শিক্ষা',
};

export function ProfileView({ profile, sessions, onUpdateProfile, isDark, toggleTheme }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [dream, setDream] = useState((profile as any)?.dream || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useState(() => {
    if ((profile as any)?.theme_color) {
      initializeThemeColor((profile as any).theme_color);
    }
  });

  const handleSave = () => {
    onUpdateProfile({ display_name: displayName.trim() || null, dream: dream.trim() || null } as any);
    setEditOpen(false);
  };

  const handleAvatarSelect = (avatarUrl: string) => onUpdateProfile({ avatar_url: avatarUrl });
  const handleThemeColorSelect = (colorId: string) => onUpdateProfile({ theme_color: colorId } as any);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      onUpdateProfile({ avatar_url: publicUrl });
      toast({ title: t('saved') });
    } catch {
      toast({ title: t('error'), variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (profile?.display_name) return profile.display_name.slice(0, 2).toUpperCase();
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return 'U';
  };

  const avatarDisplay = getAvatarDisplay(profile?.avatar_url);
  const currentStreak = calculateStreak(sessions);
  const studentClass = (profile as any)?.student_class;
  const division = (profile as any)?.division;
  const profileDream = (profile as any)?.dream;
  const needsDivision = ['9', '10', '11', '12'].includes(studentClass);

  const renderAvatar = (size: 'sm' | 'lg' = 'lg') => {
    const sizeClass = size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';
    const iconSize = size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
    const textSize = size === 'lg' ? 'text-3xl' : 'text-xl';

    if (avatarDisplay?.type === 'icon') {
      const Icon = avatarDisplay.icon;
      return (
        <div className={cn(sizeClass, "rounded-full flex items-center justify-center ring-4 ring-primary/20", avatarDisplay.color)}>
          <Icon className={cn(iconSize, "text-white")} />
        </div>
      );
    }

    return (
      <Avatar className={cn(sizeClass, "ring-4 ring-primary/20")}>
        <AvatarImage src={avatarDisplay?.url || undefined} />
        <AvatarFallback className={cn("bg-primary/10 text-primary font-semibold", textSize)}>
          {getInitials()}
        </AvatarFallback>
      </Avatar>
    );
  };

  const menuItems = [
    { icon: Settings, label: t('settings'), onClick: () => setEditOpen(true), color: 'text-foreground' },
    { icon: Languages, label: language === 'bn' ? 'English' : 'বাংলা', onClick: () => setLanguage(language === 'bn' ? 'en' : 'bn'), color: 'text-foreground' },
    { icon: isDark ? Sun : Moon, label: isDark ? t('lightMode') : t('darkMode'), onClick: toggleTheme, color: 'text-foreground' },
    { icon: Lock, label: t('security'), onClick: () => setSecurityOpen(true), color: 'text-foreground' },
    { icon: Info, label: t('aboutApp'), onClick: () => setAboutOpen(true), color: 'text-primary' },
    { icon: LogOut, label: t('logout'), onClick: signOut, color: 'text-destructive' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          {t('profile')}
        </h1>
        <p className="text-muted-foreground mt-1 font-bengali">
          {language === 'bn' ? 'আপনার অ্যাকাউন্ট সেটিংস' : 'Your account settings'}
        </p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center gap-5 mb-6">
            {renderAvatar('lg')}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                {profile?.display_name || user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-xs text-success font-bengali">
                  {language === 'bn' ? 'ভেরিফাইড অ্যাকাউন্ট' : 'Verified Account'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {/* Class */}
            <div className="text-center p-3 rounded-xl bg-background/60 border border-border/50">
              <GraduationCap className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-bold text-foreground font-bengali">
                {studentClass ? (CLASS_LABELS[studentClass] || studentClass) : '—'}
              </p>
              <p className="text-[10px] text-muted-foreground font-bengali">
                {language === 'bn' ? 'ক্লাস' : 'Class'}
              </p>
            </div>

            {/* Streak / Division */}
            <div className="text-center p-3 rounded-xl bg-background/60 border border-border/50">
              {needsDivision && division ? (
                <>
                  <Star className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-sm font-bold text-foreground font-bengali">
                    {DIVISION_LABELS[division] || division}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bengali">
                    {language === 'bn' ? 'বিভাগ' : 'Division'}
                  </p>
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5 mx-auto mb-1 text-destructive" />
                  <p className="text-sm font-bold text-foreground">
                    {currentStreak} {language === 'bn' ? 'দিন' : 'days'}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bengali">
                    {language === 'bn' ? 'স্ট্রিক 🔥' : 'Streak 🔥'}
                  </p>
                </>
              )}
            </div>

            {/* Dream */}
            <div className="text-center p-3 rounded-xl bg-background/60 border border-border/50">
              <Heart className="w-5 h-5 mx-auto mb-1 text-destructive" />
              <p className="text-sm font-bold text-foreground font-bengali truncate">
                {profileDream || '—'}
              </p>
              <p className="text-[10px] text-muted-foreground font-bengali">
                {language === 'bn' ? 'ড্রিম' : 'Dream'}
              </p>
            </div>
          </div>

          {/* Active days if division shown in middle */}
          {needsDivision && division && (
            <div className="mt-3 text-center p-2 rounded-lg bg-gradient-to-r from-destructive/10 to-accent/10 border border-destructive/20">
              <div className="flex items-center justify-center gap-2">
                <Flame className="w-4 h-4 text-destructive" />
                <span className="text-sm font-bold font-bengali">
                  {currentStreak} {language === 'bn' ? 'দিন স্ট্রিক 🔥' : 'day streak 🔥'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="glass-card overflow-hidden">
          {menuItems.map((item, index) => (
            <button key={index} onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-all duration-200",
                index !== menuItems.length - 1 && "border-b border-border"
              )}
            >
              <div className={cn("p-2 rounded-lg", item.color === 'text-destructive' ? 'bg-destructive/10' : 'bg-muted')}>
                <item.icon className={cn("w-5 h-5", item.color)} />
              </div>
              <p className={cn("font-medium font-bengali flex-1 text-left", item.color)}>{item.label}</p>
            </button>
          ))}
        </div>

        {/* App Info */}
        <div className="glass-card p-4 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <img src={logoImg} alt="Study Tracker" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <span className="text-sm font-bold text-foreground">Study Tracker</span>
              <p className="text-[10px] text-muted-foreground font-bengali">স্টাডি ট্র্যাকার</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{t('version')} 5.0</p>
            <p className="font-bengali">{t('createdBy')}: মাজহারুল ইসলাম</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bengali">{t('settings')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              {renderAvatar('lg')}
              <div className="flex gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 mr-1" />
                  {uploading ? t('loading') : t('uploadPhoto')}
                </Button>
                <AvatarSelector currentAvatar={profile?.avatar_url} onSelect={handleAvatarSelect} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName" className="font-bengali">{t('name')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'} className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dream" className="font-bengali flex items-center gap-2">
                <Heart className="w-4 h-4 text-destructive" />
                {language === 'bn' ? 'তোমার ড্রিম কি?' : 'What is your dream?'}
              </Label>
              <Input id="dream" value={dream} onChange={(e) => setDream(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: ডাক্তার, ইঞ্জিনিয়ার, বিসিএস ক্যাডার...' : 'e.g. Doctor, Engineer, BCS Cadre...'}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bengali">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={user?.email || ''} disabled className="pl-10 bg-muted" />
              </div>
            </div>

            <ThemeColorSelector currentColor={(profile as any)?.theme_color || 'teal'} onSelect={handleThemeColorSelect} />

            <Button onClick={handleSave} className="w-full" variant="gradient">
              <span className="font-bengali">{t('save')}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Dialog */}
      <Dialog open={securityOpen} onOpenChange={setSecurityOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bengali flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('security')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-success" />
                <div>
                  <p className="font-medium text-success">
                    {language === 'bn' ? 'অ্যাকাউন্ট সুরক্ষিত' : 'Account Secure'}
                  </p>
                  <p className="text-sm text-muted-foreground font-bengali">
                    {language === 'bn' ? 'আপনার অ্যাকাউন্ট RLS দ্বারা সুরক্ষিত' : 'Your account is protected by RLS'}
                  </p>
                </div>
              </div>
            </div>

            <PasswordChangeSection language={language} />

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="font-bengali">{t('twoFactorAuth')}</span>
              </div>
              <Button variant="outline" size="sm" disabled>
                {language === 'bn' ? 'শীঘ্রই আসছে' : 'Coming Soon'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AboutApp open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}

function PasswordChangeSection({ language }: { language: string }) {
  const [isChanging, setIsChanging] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: language === 'bn' ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: language === 'bn' ? '✅ পাসওয়ার্ড পরিবর্তন হয়েছে!' : '✅ Password changed!' });
      setIsChanging(false);
      setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      toast({ title: err.message || 'Error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!isChanging) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <span className="font-bengali">{language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsChanging(true)}>
          {language === 'bn' ? 'পরিবর্তন' : 'Change'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold font-bengali">{language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsChanging(false)}>✕</Button>
      </div>
      <Input type="password" placeholder={language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
      <Input type="password" placeholder={language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      <Button onClick={handleChangePassword} className="w-full" disabled={loading || !newPassword || !confirmPassword}>
        {loading ? (language === 'bn' ? 'পরিবর্তন হচ্ছে...' : 'Changing...') : (language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Update Password')}
      </Button>
    </div>
  );
}
