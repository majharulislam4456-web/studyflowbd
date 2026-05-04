import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Mail, Shield, Flame, GraduationCap, Star, Heart, Calendar, Trophy, Clock, Target
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAvatarDisplay } from './AvatarSelector';
import { initializeThemeColor } from './ThemeColorSelector';
import type { Profile, StudySession } from '@/hooks/useSupabaseData';
import { cn } from '@/lib/utils';
import { calculateStreak } from '@/utils/streak';

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

export function ProfileView({ profile, sessions }: ProfileViewProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  useState(() => {
    if ((profile as any)?.theme_color) initializeThemeColor((profile as any).theme_color);
  });

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

  // Stats
  const totalMinutes = sessions.reduce((s, x) => s + (x.duration || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalSessions = sessions.length;
  const joinDate = profile?.created_at ? new Date(profile.created_at) : null;
  const memberDays = joinDate ? Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const renderAvatar = () => {
    if (avatarDisplay?.type === 'icon') {
      const Icon = avatarDisplay.icon;
      return (
        <div className={cn("w-28 h-28 rounded-full flex items-center justify-center ring-4 ring-primary/30 shadow-xl", avatarDisplay.color)}>
          <Icon className="w-14 h-14 text-white" />
        </div>
      );
    }
    return (
      <Avatar className="w-28 h-28 ring-4 ring-primary/30 shadow-xl">
        <AvatarImage src={avatarDisplay?.url || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-4xl">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <div className="p-2 rounded-xl bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            {isBn ? 'প্রোফাইল' : 'Profile'}
          </h1>
          <p className="page-subtitle">
            {isBn ? 'আপনার ব্যক্তিগত তথ্য ও পরিসংখ্যান' : 'Your personal information and stats'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hero Card */}
        <div className="lg:col-span-2 glass-card p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {renderAvatar()}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">
                {profile?.display_name || user?.email?.split('@')[0]}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-4 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 border border-success/20">
                  <Shield className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-medium text-success font-bengali">
                    {isBn ? 'ভেরিফাইড' : 'Verified'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary font-bengali">
                    {memberDays} {isBn ? 'দিন সদস্য' : 'days member'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-card p-6 bg-gradient-to-br from-destructive/10 to-accent/5 flex flex-col justify-center items-center text-center">
          <Flame className="w-10 h-10 text-destructive mb-2" />
          <p className="text-4xl font-bold text-foreground">{currentStreak}</p>
          <p className="text-sm text-muted-foreground font-bengali mt-1">
            {isBn ? 'দিনের স্ট্রিক 🔥' : 'Day Streak 🔥'}
          </p>
        </div>
      </div>

      {/* Personal Info Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <InfoCard
          icon={GraduationCap}
          label={isBn ? 'ক্লাস' : 'Class'}
          value={studentClass ? (CLASS_LABELS[studentClass] || studentClass) : '—'}
          color="text-primary"
          bg="bg-primary/10"
        />
        <InfoCard
          icon={Star}
          label={isBn ? 'বিভাগ' : 'Division'}
          value={needsDivision && division ? (DIVISION_LABELS[division] || division) : '—'}
          color="text-accent-foreground"
          bg="bg-accent/20"
        />
        <InfoCard
          icon={Heart}
          label={isBn ? 'স্বপ্ন' : 'Dream'}
          value={profileDream || '—'}
          color="text-destructive"
          bg="bg-destructive/10"
        />
        <InfoCard
          icon={Trophy}
          label={isBn ? 'মোট সেশন' : 'Total Sessions'}
          value={totalSessions.toString()}
          color="text-success"
          bg="bg-success/10"
        />
      </div>

      {/* Study Stats */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          {isBn ? 'অধ্যয়ন পরিসংখ্যান' : 'Study Statistics'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Clock}
            label={isBn ? 'মোট সময়' : 'Total Time'}
            value={`${totalHours}h ${totalMinutes % 60}m`}
            gradient="from-primary/20 to-primary/5"
          />
          <StatCard
            icon={Flame}
            label={isBn ? 'সর্বোচ্চ স্ট্রিক' : 'Best Streak'}
            value={`${currentStreak} ${isBn ? 'দিন' : 'days'}`}
            gradient="from-destructive/20 to-destructive/5"
          />
          <StatCard
            icon={Trophy}
            label={isBn ? 'গড় সেশন' : 'Avg Session'}
            value={totalSessions > 0 ? `${Math.round(totalMinutes / totalSessions)}m` : '0m'}
            gradient="from-success/20 to-success/5"
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color: string; bg: string; }) {
  return (
    <div className="glass-card p-4 hover:scale-[1.02] transition-transform">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", bg)}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <p className="text-xs text-muted-foreground font-bengali mb-1">{label}</p>
      <p className="font-semibold text-foreground font-bengali truncate">{value}</p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, gradient }: { icon: any; label: string; value: string; gradient: string; }) {
  return (
    <div className={cn("glass-card p-5 bg-gradient-to-br", gradient)}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5 text-foreground/60" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground font-bengali mt-1">{label}</p>
    </div>
  );
}
