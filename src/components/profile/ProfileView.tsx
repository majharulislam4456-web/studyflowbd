import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  Settings, 
  LogOut, 
  Mail, 
  Info, 
  Shield,
  Moon,
  Sun,
  Smartphone,
  Languages,
  Palette,
  Camera,
  Lock,
  Upload
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AboutApp } from '@/components/about/AboutApp';
import { AvatarSelector, getAvatarDisplay } from './AvatarSelector';
import { ThemeColorSelector, initializeThemeColor } from './ThemeColorSelector';
import type { Profile } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewProps {
  profile: Profile | null;
  onUpdateProfile: (updates: Partial<Profile>) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function ProfileView({ profile, onUpdateProfile, isDark, toggleTheme }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize theme color from profile
  useState(() => {
    if ((profile as any)?.theme_color) {
      initializeThemeColor((profile as any).theme_color);
    }
  });

  const handleSave = () => {
    onUpdateProfile({ display_name: displayName.trim() || null });
    setEditOpen(false);
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    onUpdateProfile({ avatar_url: avatarUrl });
  };

  const handleThemeColorSelect = (colorId: string) => {
    onUpdateProfile({ theme_color: colorId } as any);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      onUpdateProfile({ avatar_url: publicUrl });
      toast({ title: t('saved') });
    } catch (error) {
      toast({ title: t('error'), variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const avatarDisplay = getAvatarDisplay(profile?.avatar_url);

  const renderAvatar = (size: 'sm' | 'lg' = 'lg') => {
    const sizeClass = size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';
    const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
    const textSize = size === 'lg' ? 'text-2xl' : 'text-xl';

    if (avatarDisplay?.type === 'icon') {
      const Icon = avatarDisplay.icon;
      return (
        <div className={cn(sizeClass, "rounded-full flex items-center justify-center", avatarDisplay.color)}>
          <Icon className={cn(iconSize, "text-white")} />
        </div>
      );
    }

    return (
      <Avatar className={sizeClass}>
        <AvatarImage src={avatarDisplay?.url || undefined} />
        <AvatarFallback className={cn("bg-primary/10 text-primary font-semibold", textSize)}>
          {getInitials()}
        </AvatarFallback>
      </Avatar>
    );
  };

  const menuItems = [
    {
      icon: Settings,
      label: t('settings'),
      onClick: () => setEditOpen(true),
      color: 'text-foreground',
    },
    {
      icon: Languages,
      label: language === 'bn' ? 'English' : 'বাংলা',
      onClick: () => setLanguage(language === 'bn' ? 'en' : 'bn'),
      color: 'text-foreground',
    },
    {
      icon: isDark ? Sun : Moon,
      label: isDark ? t('lightMode') : t('darkMode'),
      onClick: toggleTheme,
      color: 'text-foreground',
    },
    {
      icon: Lock,
      label: t('security'),
      onClick: () => setSecurityOpen(true),
      color: 'text-foreground',
    },
    {
      icon: Info,
      label: t('aboutApp'),
      onClick: () => setAboutOpen(true),
      color: 'text-primary',
    },
    {
      icon: LogOut,
      label: t('logout'),
      onClick: signOut,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
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
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            {renderAvatar('lg')}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                {profile?.display_name || user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-xs text-success font-bengali">
                  {language === 'bn' ? 'ভেরিফাইড অ্যাকাউন্ট' : 'Verified Account'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/50">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {new Date(profile?.created_at || Date.now()).toLocaleDateString(
                  language === 'bn' ? 'bn-BD' : 'en-US', 
                  { month: 'short', year: 'numeric' }
                )}
              </p>
              <p className="text-xs text-muted-foreground font-bengali">
                {language === 'bn' ? 'যোগদান' : 'Joined'}
              </p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-lg font-bold text-foreground">🇧🇩</p>
              <p className="text-xs text-muted-foreground font-bengali">
                {language === 'bn' ? 'অঞ্চল' : 'Region'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">Pro</p>
              <p className="text-xs text-muted-foreground font-bengali">
                {language === 'bn' ? 'প্ল্যান' : 'Plan'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="glass-card overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                index !== menuItems.length - 1 && "border-b border-border"
              )}
            >
              <item.icon className={cn("w-5 h-5", item.color)} />
              <p className={cn("font-medium font-bengali flex-1 text-left", item.color)}>{item.label}</p>
            </button>
          ))}
        </div>

        {/* App Info */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">StudyFlow BD</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{t('version')} 2.0.0</p>
            <p className="font-bengali">{t('createdBy')}: মাজহারুল ইসলাম</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bengali">
              {t('settings')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              {renderAvatar('lg')}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {uploading ? t('loading') : t('uploadPhoto')}
                </Button>
                <AvatarSelector 
                  currentAvatar={profile?.avatar_url} 
                  onSelect={handleAvatarSelect}
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="font-bengali">
                {t('name')}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="font-bengali">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            {/* Theme Color */}
            <ThemeColorSelector 
              currentColor={(profile as any)?.theme_color || 'teal'}
              onSelect={handleThemeColorSelect}
            />

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
                    {language === 'bn' 
                      ? 'আপনার অ্যাকাউন্ট RLS দ্বারা সুরক্ষিত' 
                      : 'Your account is protected by RLS'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-bengali">{t('changePassword')}</span>
                </div>
                <Button variant="outline" size="sm" disabled>
                  {language === 'bn' ? 'শীঘ্রই আসছে' : 'Coming Soon'}
                </Button>
              </div>
              
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

            <p className="text-xs text-muted-foreground text-center font-bengali">
              {language === 'bn' 
                ? 'আপনার ডাটা এনক্রিপ্টেড এবং সুরক্ষিত' 
                : 'Your data is encrypted and secure'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* About App Dialog */}
      <AboutApp open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}
