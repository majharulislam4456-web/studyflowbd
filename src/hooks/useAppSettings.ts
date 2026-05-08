import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppSettings {
  id: string;
  active_theme: string;
  announcement_title: string | null;
  announcement_content: string | null;
  announcement_link: string | null;
  announcement_active: boolean;
  announcement_expires_at: string | null;
  features: Record<string, boolean>;
  updated_at: string;
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('app_settings').select('*').limit(1).maybeSingle();
    if (data) setSettings(data as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel('app_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const update = async (updates: Partial<AppSettings>) => {
    if (!settings) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('app_settings')
      .update({ ...updates, updated_by: user?.id } as any)
      .eq('id', settings.id);
    if (error) throw error;
    await load();
  };

  return { settings, loading, update, reload: load };
}