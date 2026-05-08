import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Search, Calendar, Clock } from 'lucide-react';

interface UserRow {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  display_name: string | null;
  profile: { display_name?: string; student_class?: string; division?: string; dream?: string; avatar_url?: string } | null;
}

export function UserListPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('admin-list-users');
        if (error) throw error;
        setUsers(data?.users ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally { setLoading(false); }
    })();
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.email?.toLowerCase().includes(q) || u.profile?.display_name?.toLowerCase().includes(q);
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold font-bengali">👥 ব্যবহারকারী ({users.length})</h2>
          <p className="text-xs text-muted-foreground font-bengali">সকল ব্যবহারকারীর ইমেইল ও তথ্য</p>
        </div>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ইমেইল বা নাম দিয়ে খুঁজুন..." className="pl-9 font-bengali" />
      </div>

      {loading && <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}
      {error && <p className="text-sm text-destructive font-bengali">ত্রুটি: {error}</p>}

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filtered.map(u => (
          <div key={u.id} className="rounded-xl border border-border bg-muted/20 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate font-bengali">{u.profile?.display_name || u.display_name || 'অজানা'}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                  <Mail className="w-3 h-3" /> {u.email}
                </p>
                <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(u.created_at).toLocaleDateString('bn-BD')}</span>
                  {u.last_sign_in_at && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> শেষ: {new Date(u.last_sign_in_at).toLocaleDateString('bn-BD')}</span>}
                  {u.profile?.student_class && <span className="font-bengali">শ্রেণী: {u.profile.student_class}</span>}
                  {u.profile?.dream && <span className="font-bengali truncate">স্বপ্ন: {u.profile.dream}</span>}
                </div>
              </div>
              <a href={`mailto:${u.email}`} className="text-xs text-primary hover:underline font-bengali whitespace-nowrap">ইমেইল</a>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8 font-bengali">কোনো ব্যবহারকারী নেই</p>
        )}
      </div>
    </div>
  );
}