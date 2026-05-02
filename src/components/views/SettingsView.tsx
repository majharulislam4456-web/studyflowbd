import { useState } from 'react';
import { Settings, Languages, Moon, Sun, Palette, Info, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeColorSelector, initializeThemeColor } from '@/components/profile/ThemeColorSelector';
import { AboutApp } from '@/components/about/AboutApp';
import { ParentShareSettings } from '@/components/settings/ParentShareSettings';
import type { Profile, StudySession } from '@/hooks/useSupabaseData';

interface SettingsViewProps {
  profile: Profile | null;
  sessions: StudySession[];
  onUpdateProfile: (updates: Partial<Profile>) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function SettingsView({ profile, onUpdateProfile, isDark, toggleTheme }: SettingsViewProps) {
  const { signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const isBn = language === 'bn';
  const [aboutOpen, setAboutOpen] = useState(false);

  useState(() => {
    if ((profile as any)?.theme_color) initializeThemeColor((profile as any).theme_color);
  });

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

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            {isBn ? 'থিম' : 'Appearance'}
          </TabsTrigger>
          <TabsTrigger value="parent" className="gap-2">
            <Settings className="w-4 h-4" />
            {isBn ? 'অভিভাবক' : 'Parent'}
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Info className="w-4 h-4" />
            {isBn ? 'সাধারণ' : 'General'}
          </TabsTrigger>
        </TabsList>

        {/* Appearance */}
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

        {/* Parent Share */}
        <TabsContent value="parent" className="space-y-6">
          <ParentShareSettings />
        </TabsContent>

        {/* General */}
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
