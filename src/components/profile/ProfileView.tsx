import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  User, 
  Settings, 
  LogOut, 
  Mail, 
  Info, 
  Shield,
  Palette,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AboutApp } from '@/components/about/AboutApp';
import type { Profile } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';

interface ProfileViewProps {
  profile: Profile | null;
  onUpdateProfile: (updates: Partial<Profile>) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function ProfileView({ profile, onUpdateProfile, isDark, toggleTheme }: ProfileViewProps) {
  const { user, signOut } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');

  const handleSave = () => {
    onUpdateProfile({ display_name: displayName.trim() || null });
    setEditOpen(false);
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

  const menuItems = [
    {
      icon: Settings,
      label: 'প্রোফাইল সম্পাদনা',
      labelEn: 'Edit Profile',
      onClick: () => setEditOpen(true),
      color: 'text-foreground',
    },
    {
      icon: isDark ? Sun : Moon,
      label: isDark ? 'লাইট মোড' : 'ডার্ক মোড',
      labelEn: isDark ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme,
      color: 'text-foreground',
    },
    {
      icon: Info,
      label: 'অ্যাপ সম্পর্কে',
      labelEn: 'About App',
      onClick: () => setAboutOpen(true),
      color: 'text-primary',
    },
    {
      icon: LogOut,
      label: 'লগআউট',
      labelEn: 'Logout',
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
          Profile
        </h1>
        <p className="text-muted-foreground mt-1 font-bengali">
          প্রোফাইল - আপনার অ্যাকাউন্ট সেটিংস
        </p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">
                {profile?.display_name || user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-xs text-success font-bengali">ভেরিফাইড অ্যাকাউন্ট</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/50">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {new Date(profile?.created_at || Date.now()).toLocaleDateString('bn-BD', { month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-muted-foreground font-bengali">যোগদান</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-lg font-bold text-foreground">🇧🇩</p>
              <p className="text-xs text-muted-foreground font-bengali">অঞ্চল</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">Pro</p>
              <p className="text-xs text-muted-foreground font-bengali">প্ল্যান</p>
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
              <div className="flex-1 text-left">
                <p className={cn("font-medium font-bengali", item.color)}>{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.labelEn}</p>
              </div>
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
            <p>Version 1.0.0</p>
            <p className="font-bengali">তৈরি করেছেন: মাজহারুল ইসলাম</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bengali">
              প্রোফাইল সম্পাদনা / Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName" className="font-bengali">
                প্রদর্শন নাম / Display Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bengali">ইমেইল / Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full" variant="gradient">
              <span className="font-bengali">সংরক্ষণ করুন / Save</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* About App Dialog */}
      <AboutApp open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}
