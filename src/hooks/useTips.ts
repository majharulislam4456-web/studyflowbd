import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Tip {
  id: string;
  title: string;
  content: string;
  link_url: string | null;
  category: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useTips() {
  const { user } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTips(data as Tip[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTip = async (input: Omit<Tip, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    const { error } = await supabase.from('tips').insert({ ...input, created_by: user.id });
    if (error) { toast.error('যোগ করা যায়নি: ' + error.message); return; }
    toast.success('টিপ যোগ হয়েছে');
    load();
  };

  const updateTip = async (id: string, patch: Partial<Tip>) => {
    const { error } = await supabase.from('tips').update(patch).eq('id', id);
    if (error) { toast.error('আপডেট ব্যর্থ'); return; }
    toast.success('আপডেট হয়েছে');
    load();
  };

  const deleteTip = async (id: string) => {
    const { error } = await supabase.from('tips').delete().eq('id', id);
    if (error) { toast.error('ডিলিট ব্যর্থ'); return; }
    toast.success('ডিলিট হয়েছে');
    load();
  };

  return { tips, loading, addTip, updateTip, deleteTip };
}