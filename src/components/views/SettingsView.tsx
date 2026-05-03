import { useState, useRef, useEffect } from 'react';
import {
  Settings, Languages, Moon, Sun, Palette, Info, LogOut, User, Mail, Heart,
  Lock, Shield, Upload, ChevronRight, Bell, UserCog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeColorSelector, initializeThemeColor } from '@/components/profile/ThemeColorSelector';
import { AvatarSelector, getAvatarDisplay } from '@/components/profile/AvatarSelector';
import { AboutApp } from '@/components/about/AboutApp';
import { ParentShareSettings } from '@/components/settings/ParentShareSettings';
import type { Profile, StudySession } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SettingsViewProps {
  profile: Profile | null;
  sessions: StudySession[];
  onUpdateProfile: (updates: Partial<Profile>) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function SettingsView({ profile, onUpdateProfile, isDark, toggleTheme }: SettingsViewProps) {
  const { user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const isBn = language === 'bn';
  const [aboutOpen, setAboutOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);

  useEffect(() => {
    if ((profile as any)?.theme_color) initializeThemeColor((profile as any).theme_color);
  }, [profile]);

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
          <p className="page-subtitle">{isBn ? 'অ্যাকাউন্ট ও অ্যাপ কনফিগার করুন' : 'Configure your account and app'}</p>
        </div>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="account" className="gap-2">
            <UserCog className="w-4 h-4" />
            {isBn ? 'অ্যাকাউন্ট' : 'Account'}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            {isBn ? 'থিম' : 'Appearance'}
          </TabsTrigger>
          <TabsTrigger value="parent" className="gap-2">
            <Bell className="w-4 h-4" />
            {isBn ? 'অভিভাবক' : 'Parent'}
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Info className="w-4 h-4" />
            {isBn ? 'সাধারণ' : 'General'}
          </TabsTrigger>
        </TabsList>

        {/* Account Tab — Edit profile + security */}
        <TabsContent value="account" className="space-y-6">
          <AccountSection profile={profile} onUpdateProfile={onUpdateProfile} />
          <SettingRow
            icon={Lock}
            iconColor="text-warning"
            iconBg="bg-warning/10"
            title={isBn ? 'নিরাপত্তা ও পাসওয়ার্ড' : 'Security & Password'}
            desc={isBn ? 'পাসওয়ার্ড পরিবর্তন এবং অ্যাকাউন্ট সুরক্ষা' : 'Change password and account security'}
            onClick={() => setSecurityOpen(true)}
          />
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <div className="glass-card p-6 max-w-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl", isDark ? "bg-accent/20" : "bg-warning/10")}>
                  {isDark ? <Moon className="w-5 h-5 text-accent-foreground" /> : <Sun className="w-5 h-5 text-warning" />}
                </div>
                <div>
                  <p className="font-semibold">{isDark ? (isBn ? 'ডার্ক মোড' : 'Dark Mode') : (isBn ? 'লাইট মোড' : 'Light Mode')}</p>
                  <p className="text-xs text-muted-foreground">{isBn ? 'থিম পরিবর্তন করুন' : 'Toggle theme'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {isDark ? (isBn ? 'লাইট' : 'Light') : (isBn ? 'ডার্ক' : 'Dark')}
              </Button>
            </div>
            <div className="pt-4">
              <ThemeColorSelector currentColor={(profile as any)?.theme_color || 'teal'} onSelect={(id) => onUpdateProfile({ theme_color: id } as any)} />
            </div>
          </div>
        </TabsContent>

        {/* Parent Tab */}
        <TabsContent value="parent" className="space-y-6">
          <ParentShareSettings />
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-3">
          <div className="max-w-2xl space-y-3">
            <SettingRow
              icon={Languages}
              iconColor="text-primary"
              iconBg="bg-primary/10"
              title={isBn ? 'ভাষা' : 'Language'}
              desc={isBn ? 'বর্তমান: বাংলা' : 'Current: English'}
              action={
                <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}>
                  {language === 'bn' ? 'English' : 'বাংলা'}
                </Button>
              }
            />
            <SettingRow
              icon={Info}
              iconColor="text-primary"
              iconBg="bg-primary/10"
              title={isBn ? 'অ্যাপ সম্পর্কে' : 'About App'}
              desc={isBn ? 'সংস্করণ ও ডেভেলপার তথ্য' : 'Version and developer info'}
              onClick={() => setAboutOpen(true)}
            />
            <div className="glass-card p-4">
              <Button variant="destructive" className="w-full gap-2" onClick={signOut}>
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <SecurityDialog open={securityOpen} onOpenChange={setSecurityOpen} language={language} />
      <AboutApp open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}

function SettingRow({
  icon: Icon, iconColor, iconBg, title, desc, onClick, action,
}: {
  icon: any; iconColor: string; iconBg: string; title: string; desc: string; onClick?: () => void; action?: React.ReactNode;
}) {
  const Wrapper: any = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "glass-card w-full p-4 max-w-2xl flex items-center gap-4 text-left transition-all",
        onClick && "hover:bg-muted/40 hover:scale-[1.005] cursor-pointer"
      )}
    >
      <div className={cn("p-2.5 rounded-xl flex-shrink-0", iconBg)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground font-bengali truncate">{title}</p>
        <p className="text-xs text-muted-foreground font-bengali truncate">{desc}</p>
      </div>
      {action || (onClick && <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />)}
    </Wrapper>
  );
}

function AccountSection({ profile, onUpdateProfile }: { profile: Profile | null; onUpdateProfile: (u: Partial<Profile>) => void; }) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const isBn = language === 'bn';
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [dream, setDream] = useState((profile as any)?.dream || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarDisplay = getAvatarDisplay(profile?.avatar_url);
  const getInitials = () => {
    if (profile?.display_name) return profile.display_name.slice(0, 2).toUpperCase();
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return 'U';
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
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdateProfile({ display_name: displayName.trim() || null, dream: dream.trim() || null } as any);
    toast({ title: t('saved') });
    setSaving(false);
  };

  const renderAvatar = () => {
    if (avatarDisplay?.type === 'icon') {
      const Icon = avatarDisplay.icon;
      return (
        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center ring-2 ring-primary/20", avatarDisplay.color)}>
          <Icon className="w-10 h-10 text-white" />
        </div>
      );
    }
    return (
      <Avatar className="w-20 h-20 ring-2 ring-primary/20">
        <AvatarImage src={avatarDisplay?.url || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">{getInitials()}</AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="glass-card p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <UserCog className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">{isBn ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile'}</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {renderAvatar()}
        <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="w-4 h-4 mr-1.5" />
            {uploading ? t('loading') : (isBn ? 'ছবি আপলোড' : 'Upload Photo')}
          </Button>
          <AvatarSelector currentAvatar={profile?.avatar_url} onSelect={(url) => onUpdateProfile({ avatar_url: url })} />
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-1.5">
          <Label className="font-bengali text-xs uppercase tracking-wide text-muted-foreground">
            {isBn ? 'নাম' : 'Name'}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              placeholder={isBn ? 'আপনার নাম' : 'Your name'} className="pl-10" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="font-bengali text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-destructive" />
            {isBn ? 'স্বপ্ন' : 'Dream'}
          </Label>
          <Input value={dream} onChange={(e) => setDream(e.target.value)}
            placeholder={isBn ? 'যেমন: ডাক্তার, ইঞ্জিনিয়ার...' : 'e.g. Doctor, Engineer...'} />
        </div>

        <div className="space-y-1.5">
          <Label className="font-bengali text-xs uppercase tracking-wide text-muted-foreground">
            {isBn ? 'ইমেইল' : 'Email'}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={user?.email || ''} disabled className="pl-10 bg-muted" />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} variant="gradient" disabled={saving} className="w-full sm:w-auto">
        {saving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'সংরক্ষণ করুন' : 'Save Changes')}
      </Button>
    </div>
  );
}

function SecurityDialog({ open, onOpenChange, language }: { open: boolean; onOpenChange: (o: boolean) => void; language: string; }) {
  const { t } = useLanguage();
  const [isChanging, setIsChanging] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isBn = language === 'bn';

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: isBn ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: isBn ? '✅ পাসওয়ার্ড পরিবর্তন হয়েছে!' : '✅ Password changed!' });
      setIsChanging(false);
      setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      toast({ title: err.message || 'Error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {t('security')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
            <Shield className="w-8 h-8 text-success flex-shrink-0" />
            <div>
              <p className="font-semibold text-success">{isBn ? 'অ্যাকাউন্ট সুরক্ষিত' : 'Account Secure'}</p>
              <p className="text-xs text-muted-foreground font-bengali">
                {isBn ? 'RLS দ্বারা সুরক্ষিত' : 'Protected by RLS'}
              </p>
            </div>
          </div>

          {!isChanging ? (
            <button onClick={() => setIsChanging(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span className="font-bengali font-medium">{isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">{isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsChanging(false)}>✕</Button>
              </div>
              <Input type="password" placeholder={isBn ? 'নতুন পাসওয়ার্ড' : 'New password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password" />
              <Input type="password" placeholder={isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" />
              <Button onClick={handleChangePassword} className="w-full" disabled={loading || !newPassword || !confirmPassword}>
                {loading ? (isBn ? 'পরিবর্তন হচ্ছে...' : 'Changing...') : (isBn ? 'আপডেট করুন' : 'Update')}
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-bengali">{t('twoFactorAuth')}</span>
            </div>
            <Button variant="outline" size="sm" disabled>
              {isBn ? 'শীঘ্রই আসছে' : 'Coming Soon'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
