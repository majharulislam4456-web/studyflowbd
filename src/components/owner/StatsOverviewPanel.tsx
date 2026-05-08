import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, BookOpen, Clock, Target } from 'lucide-react';

export function StatsOverviewPanel() {
  const [stats, setStats] = useState({ profiles: 0, sessions: 0, hours: 0, goals: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: profiles }, { data: sessions }, { count: goals }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('study_sessions').select('duration'),
        supabase.from('goals').select('*', { count: 'exact', head: true }),
      ]);
      const totalSec = (sessions ?? []).reduce((s: number, r: any) => s + (r.duration || 0), 0);
      setStats({ profiles: profiles ?? 0, sessions: sessions?.length ?? 0, hours: Math.round(totalSec / 3600), goals: goals ?? 0 });
    })();
  }, []);

  const cards = [
    { icon: Users, label: 'মোট ব্যবহারকারী', value: stats.profiles },
    { icon: BookOpen, label: 'মোট সেশন', value: stats.sessions },
    { icon: Clock, label: 'মোট ঘন্টা', value: stats.hours },
    { icon: Target, label: 'মোট লক্ষ্য', value: stats.goals },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className="rounded-2xl border border-border bg-card p-4">
          <c.icon className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{c.value}</p>
          <p className="text-xs text-muted-foreground font-bengali mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
}