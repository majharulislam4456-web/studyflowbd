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
import { User, Settings, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { Profile } from '@/hooks/useSupabaseData';

interface ProfilePanelProps {
  profile: Profile | null;
  onUpdateProfile: (updates: Partial<Profile>) => void;
}

export function ProfilePanel({ profile, onUpdateProfile }: ProfilePanelProps) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.display_name || '');

  const handleSave = () => {
    onUpdateProfile({ display_name: displayName.trim() || null });
    setOpen(false);
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

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">
            {profile?.display_name || user?.email?.split('@')[0]}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <Settings className="w-4 h-4" />
              Edit / <span className="font-bengali">সম্পাদনা</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Edit Profile / <span className="font-bengali">প্রোফাইল সম্পাদনা</span>
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
                <Label htmlFor="displayName">
                  Display Name / <span className="font-bengali">প্রদর্শন নাম</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
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
                Save / <span className="font-bengali">সংরক্ষণ</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={signOut}
          className="gap-2 text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
