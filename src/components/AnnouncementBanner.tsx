import { useAppSettings } from '@/hooks/useAppSettings';
import { Megaphone, X, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FESTIVAL_THEMES } from '@/lib/festivalThemes';

export function AnnouncementBanner() {
  const { settings } = useAppSettings();
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    setDismissed(localStorage.getItem('dismissed_announcement'));
  }, []);

  if (!settings) return null;

  const theme = FESTIVAL_THEMES.find(t => t.id === settings.active_theme);
  const isExpired = settings.announcement_expires_at && new Date(settings.announcement_expires_at) < new Date();
  const showAnnouncement = settings.announcement_active && settings.announcement_title && !isExpired && dismissed !== settings.updated_at;
  const showFestival = theme && theme.id !== 'default' && theme.banner;

  if (!showAnnouncement && !showFestival) return null;

  const handleDismiss = () => {
    localStorage.setItem('dismissed_announcement', settings.updated_at);
    setDismissed(settings.updated_at);
  };

  if (showAnnouncement) {
    return (
      <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 flex items-start gap-3 animate-fade-in">
        <Megaphone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm font-bengali text-foreground">{settings.announcement_title}</h3>
          {settings.announcement_content && (
            <p className="text-xs text-muted-foreground font-bengali mt-1 whitespace-pre-wrap">{settings.announcement_content}</p>
          )}
          {settings.announcement_link && (
            <a href={settings.announcement_link} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2 font-bengali">
              <ExternalLink className="w-3 h-3" /> বিস্তারিত দেখুন
            </a>
          )}
        </div>
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Festival banner (non-dismissible, smaller)
  return (
    <div className="mb-4 rounded-2xl border border-accent/40 bg-gradient-to-r from-primary/10 to-accent/10 p-3 flex items-center gap-3 animate-fade-in">
      <span className="text-2xl">{theme!.emoji}</span>
      <p className="text-sm font-bengali text-foreground font-medium">{theme!.banner}</p>
    </div>
  );
}