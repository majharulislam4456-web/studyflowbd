import { useState, useRef } from 'react';
import { Settings, User, Languages, Moon, Sun, Lock, Upload, Info, Palette, Bell, Timer, LogOut, Heart, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AvatarSelector, getAvatarDisplay } from '@/components/profile/AvatarSelector';
import { ThemeColorSelector, initializeThemeColor } from '@/components/profile/ThemeColorSelector';
import { AboutApp } from '@/components/about/AboutApp';
import type { Profile, StudySession } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateStreak } from '@/utils/streak';

interface SettingsViewProps {
  profile: Profile | null;
  sessions: StudySession[];
  onUpdateProfile: (updates: Partial<Profile>) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function SettingsView({ profile, sessions, onUpdateProfile, isDark, toggleTheme }: SettingsViewProps) {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const isBn = language === 'bn';

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [dream, setDream] = useState((profile as any)?.dream || '');
  const [uploading, setUploading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarDisplay = getAvatarDisplay(profile?.avatar_url);

  useState(() => {
    if ((profile as any)?.theme_color) initializeThemeColor((profile as any).theme_color);
  });

  const handleSave = () => {
    onUpdateProfile({ display_name: displayName.trim() || null, dream: dream.trim() || null } as any);
  };

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
    } finally { setUploading(false); }
  };

  const getInitials = () => {
    if (profile?.display_name) return profile.display_name.slice(0, 2).toUpperCase();
    return 'U';
  };

  const renderAvatar = () => {
    if (avatarDisplay?.type === 'icon') {
      const Icon = avatarDisplay.icon;
      return (
        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center ring-4 ring-primary/20", avatarDisplay.color)}>
          <Icon className="w-10 h-10 text-white" />
        </div>
      );
    }
    return (
      <Avatar className="w-20 h-20 ring-4 ring-primary/20">
        <AvatarImage src={avatarDisplay?.url || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">{getInitials()}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <div className="p-2 rounded-xl bg-primary/10">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            {isBn ? 'সেটিংস' : 'Settings'}
          </h1>
          <p className="page-subtitle">{isBn ? 'অ্যাপ কনফিগারেশন পরিচালনা করুন' : 'Manage app configuration'}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            {isBn ? 'প্রোফাইল' : 'Profile'}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            {isBn ? 'থিম' : 'Appearance'}
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" />
            {isBn ? 'সাধারণ' : 'General'}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="glass-card p-6 max-w-lg">
            <div className="flex items-center gap-4 mb-6">
              {renderAvatar()}
              <div>
                <h2 className="text-xl font-bold text-foreground">{profile?.display_name || user?.email?.split('@')[0]}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 mr-1" />
                  {uploading ? t('loading') : t('uploadPhoto')}
                </Button>
                <AvatarSelector currentAvatar={profile?.avatar_url} onSelect={(url) => onUpdateProfile({ avatar_url: url })} />
              </div>

              <div className="space-y-2">
                <Label>{isBn ? 'নাম' : 'Name'}</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={isBn ? 'আপনার নাম' : 'Your name'} />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-destructive" />
                  {isBn ? 'তোমার ড্রিম' : 'Your Dream'}
                </Label>
                <Input value={dream} onChange={(e) => setDream(e.target.value)} placeholder={isBn ? 'যেমন: ডাক্তার, ইঞ্জিনিয়ার...' : 'e.g. Doctor, Engineer...'} />
              </div>

              <Button onClick={handleSave} variant="gradient" className="w-full">{t('save')}</Button>
            </div>
          </div>

          {/* Security */}
          <div className="glass-card p-6 max-w-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              {isBn ? 'নিরাপত্তা' : 'Security'}
            </h3>
            <PasswordChangeSection language={language} />
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="glass-card p-6 max-w-lg space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isDark ? (isBn ? 'ডার্ক মোড' : 'Dark Mode') : (isBn ? 'লাইট মোড' : 'Light Mode')}</p>
                <p className="text-sm text-muted-foreground">{isBn ? 'থিম পরিবর্তন করুন' : 'Toggle theme'}</p>
              </div>
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>

            <ThemeColorSelector currentColor={(profile as any)?.theme_color || 'teal'} onSelect={(id) => onUpdateProfile({ theme_color: id } as any)} />
          </div>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="glass-card p-6 max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{isBn ? 'ভাষা' : 'Language'}</p>
                  <p className="text-sm text-muted-foreground">{isBn ? 'বর্তমান: বাংলা' : 'Current: English'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}>
                {language === 'bn' ? 'English' : 'বাংলা'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-primary" />
                <p className="font-medium">{isBn ? 'অ্যাপ সম্পর্কে' : 'About App'}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setAboutOpen(true)}>
                {isBn ? 'দেখুন' : 'View'}
              </Button>
            </div>

            <Button variant="destructive" className="w-full mt-4 gap-2" onClick={signOut}>
              <LogOut className="w-4 h-4" />
              {t('logout')}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

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
  const isBn = language === 'bn';

  const handleChange = async () => {
    if (newPassword !== confirmPassword) { toast({ title: isBn ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match', variant: 'destructive' }); return; }
    if (newPassword.length < 6) { toast({ title: isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর' : 'Min 6 characters', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: isBn ? '✅ পাসওয়ার্ড পরিবর্তন হয়েছে!' : '✅ Password changed!' });
      setIsChanging(false); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) { toast({ title: err.message, variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  if (!isChanging) {
    return (
      <Button variant="outline" onClick={() => setIsChanging(true)} className="gap-2">
        <Lock className="w-4 h-4" />
        {isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={isBn ? 'নতুন পাসওয়ার্ড' : 'New password'} />
      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm password'} />
      <div className="flex gap-2">
        <Button onClick={handleChange} disabled={loading}>{isBn ? 'সংরক্ষণ' : 'Save'}</Button>
        <Button variant="outline" onClick={() => setIsChanging(false)}>{isBn ? 'বাতিল' : 'Cancel'}</Button>
      </div>
    </div>
  );
}
