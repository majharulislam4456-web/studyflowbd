import { useState, useEffect } from 'react';
import { Share2, Copy, RefreshCw, ShieldCheck, ShieldOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function ParentShareSettings() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isBn = language === 'bn';

  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('parent_share_codes')
      .select('share_code, is_active')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setShareCode(data[0].share_code);
          setIsActive(data[0].is_active);
        }
        setLoading(false);
      });
  }, [user]);

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      // Delete old codes
      await supabase.from('parent_share_codes').delete().eq('user_id', user.id);
      const code = generateCode();
      const { error } = await supabase.from('parent_share_codes').insert({
        user_id: user.id,
        share_code: code,
        is_active: true,
      });
      if (error) throw error;
      setShareCode(code);
      setIsActive(true);
      toast({ title: isBn ? '✅ কোড তৈরি হয়েছে!' : '✅ Code generated!' });
    } catch {
      toast({ title: isBn ? 'ত্রুটি হয়েছে' : 'Error occurred', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (active: boolean) => {
    if (!user || !shareCode) return;
    const { error } = await supabase
      .from('parent_share_codes')
      .update({ is_active: active })
      .eq('user_id', user.id);
    if (!error) {
      setIsActive(active);
      toast({ title: active ? (isBn ? '✅ চালু করা হয়েছে' : '✅ Activated') : (isBn ? '🔒 বন্ধ করা হয়েছে' : '🔒 Deactivated') });
    }
  };

  const handleCopy = () => {
    if (!shareCode) return;
    const link = `${window.location.origin}/parent/${shareCode}`;
    navigator.clipboard.writeText(link);
    toast({ title: isBn ? '📋 লিংক কপি হয়েছে!' : '📋 Link copied!' });
  };

  const shareLink = shareCode ? `${window.location.origin}/parent/${shareCode}` : '';

  if (loading) return null;

  return (
    <div className="glass-card p-6 max-w-lg">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-primary" />
        {isBn ? 'অভিভাবকের সাথে শেয়ার করুন' : 'Share with Parent'}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {isBn
          ? 'একটি কোড তৈরি করুন যাতে আপনার অভিভাবক আপনার পড়াশোনার অগ্রগতি দেখতে পারেন — কোনো অ্যাকাউন্ট ছাড়াই।'
          : 'Generate a code so your parent can view your study progress — no account needed.'}
      </p>

      {shareCode ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">{isBn ? 'শেয়ার কোড' : 'Share Code'}</p>
              <p className="text-2xl font-mono font-bold tracking-widest text-primary">{shareCode}</p>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopy} title="Copy link">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground break-all flex items-center gap-1">
            <ExternalLink className="w-3 h-3 shrink-0" />
            {shareLink}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isActive ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldOff className="w-4 h-4 text-muted-foreground" />}
              <span className="text-sm">{isActive ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}</span>
            </div>
            <Switch checked={isActive} onCheckedChange={handleToggle} />
          </div>

          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {isBn ? 'নতুন কোড তৈরি করুন' : 'Regenerate Code'}
          </Button>
        </div>
      ) : (
        <Button onClick={handleGenerate} disabled={generating} variant="gradient" className="gap-2">
          <Share2 className="w-4 h-4" />
          {generating ? (isBn ? 'তৈরি হচ্ছে...' : 'Generating...') : (isBn ? 'কোড তৈরি করুন' : 'Generate Code')}
        </Button>
      )}
    </div>
  );
}
