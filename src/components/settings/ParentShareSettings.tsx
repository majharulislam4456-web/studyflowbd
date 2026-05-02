import { useState, useEffect } from 'react';
import { Share2, Phone, Clock, MessageSquare, Power, PowerOff, Loader2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function ParentShareSettings() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isBn = language === 'bn';

  const [shareCode, setShareCode] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sendTime, setSendTime] = useState('20:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('parent_share_codes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const row = data[0] as any;
          setShareCode(row.share_code);
          setIsActive(row.is_active);
          setWhatsappNumber(row.whatsapp_number || '');
          setSendTime(row.send_time || '20:00');
        }
        setLoading(false);
      });
  }, [user]);

  const generateCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const handleEnable = async () => {
    if (!user || !whatsappNumber.trim()) {
      toast({ title: isBn ? 'WhatsApp নম্বর দিন' : 'Enter WhatsApp number', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      // Delete old codes
      await supabase.from('parent_share_codes').delete().eq('user_id', user.id);
      const code = generateCode();
      const { error } = await supabase.from('parent_share_codes').insert({
        user_id: user.id,
        share_code: code,
        is_active: true,
        whatsapp_number: whatsappNumber.trim(),
        send_time: sendTime,
      } as any);
      if (error) throw error;
      setShareCode(code);
      setIsActive(true);
      toast({ title: isBn ? '✅ অভিভাবক নোটিফিকেশন চালু হয়েছে!' : '✅ Parent notification enabled!' });
    } catch {
      toast({ title: isBn ? 'ত্রুটি হয়েছে' : 'Error occurred', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (active: boolean) => {
    if (!user || !shareCode) return;
    const { error } = await supabase
      .from('parent_share_codes')
      .update({ is_active: active } as any)
      .eq('user_id', user.id);
    if (!error) {
      setIsActive(active);
      toast({ title: active ? (isBn ? '✅ চালু করা হয়েছে' : '✅ Activated') : (isBn ? '🔒 বন্ধ করা হয়েছে' : '🔒 Deactivated') });
    }
  };

  const handleUpdateSettings = async () => {
    if (!user || !shareCode) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('parent_share_codes')
        .update({ whatsapp_number: whatsappNumber.trim(), send_time: sendTime } as any)
        .eq('user_id', user.id);
      if (error) throw error;
      toast({ title: isBn ? '✅ সেটিংস আপডেট হয়েছে!' : '✅ Settings updated!' });
    } catch {
      toast({ title: isBn ? 'ত্রুটি হয়েছে' : 'Error', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const shareLink = shareCode ? `${window.location.origin}/parent/${shareCode}` : '';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const waMessage = isBn
    ? `আমার পড়াশোনার রিপোর্ট দেখুন: ${shareLink}`
    : `Check my study report: ${shareLink}`;

  const openManualGuide = () => {
    setStep(1);
    setLinkCopied(false);
    setManualOpen(true);
  };

  const copyLinkInGuide = async () => {
    await navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    toast({ title: isBn ? '✅ লিংক কপি হয়েছে!' : '✅ Link copied!' });
    setStep(2);
  };

  const sendOnWhatsApp = () => {
    const url = cleanNumber
      ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="glass-card p-6 max-w-lg">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-primary" />
        {isBn ? 'অভিভাবকের সাথে শেয়ার করুন' : 'Share with Parent'}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {isBn
          ? 'চালু করলে প্রতিদিন অটো WhatsApp রিপোর্ট যাবে। এছাড়াও যেকোনো সময় ম্যানুয়ালি লিংক কপি বা পাঠাতে পারবেন।'
          : 'Auto WhatsApp report daily + manual link sharing anytime.'}
      </p>

      {shareCode && isActive ? (
        <div className="space-y-4">
          {/* Active indicator */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Power className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {isBn ? 'সক্রিয় — প্রতিদিন রিপোর্ট পাঠানো হচ্ছে' : 'Active — Sending daily reports'}
            </span>
          </div>

          {/* WhatsApp number */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {isBn ? 'WhatsApp নম্বর' : 'WhatsApp Number'}
            </Label>
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+8801XXXXXXXXX"
              type="tel"
            />
          </div>

          {/* Send time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {isBn ? 'রিপোর্ট পাঠানোর সময়' : 'Report Send Time'}
            </Label>
            <Select value={sendTime} onValueChange={setSendTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['18:00', '19:00', '20:00', '21:00', '22:00'].map(time => (
                  <SelectItem key={time} value={time}>
                    {time === '18:00' && (isBn ? 'সন্ধ্যা ৬:০০' : '6:00 PM')}
                    {time === '19:00' && (isBn ? 'সন্ধ্যা ৭:০০' : '7:00 PM')}
                    {time === '20:00' && (isBn ? 'রাত ৮:০০' : '8:00 PM')}
                    {time === '21:00' && (isBn ? 'রাত ৯:০০' : '9:00 PM')}
                    {time === '22:00' && (isBn ? 'রাত ১০:০০' : '10:00 PM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview link */}
          <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">{isBn ? 'অভিভাবক লিংক' : 'Parent link'}</p>
            <p className="text-xs font-mono text-primary break-all">{shareLink}</p>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  toast({ title: isBn ? '✅ লিংক কপি হয়েছে!' : '✅ Link copied!' });
                }}
              >
                <Copy className="w-3 h-3" />
                {isBn ? 'লিংক কপি' : 'Copy Link'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={openManualGuide}
              >
                <ExternalLink className="w-3 h-3" />
                {isBn ? 'ম্যানুয়ালি পাঠান' : 'Send Manually'}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleUpdateSettings} disabled={saving} size="sm" variant="gradient">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isBn ? 'আপডেট করুন' : 'Update')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleToggle(false)} className="gap-1 text-destructive">
              <PowerOff className="w-3.5 h-3.5" />
              {isBn ? 'বন্ধ করুন' : 'Disable'}
            </Button>
          </div>
        </div>
      ) : shareCode && !isActive ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
            <PowerOff className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isBn ? 'নিষ্ক্রিয় — রিপোর্ট পাঠানো বন্ধ আছে' : 'Inactive — Reports paused'}
            </span>
          </div>
          <Button onClick={() => handleToggle(true)} variant="gradient" size="sm" className="gap-2">
            <Power className="w-4 h-4" />
            {isBn ? 'আবার চালু করুন' : 'Re-enable'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {isBn ? 'অভিভাবকের WhatsApp নম্বর' : "Parent's WhatsApp Number"}
            </Label>
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+8801XXXXXXXXX"
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {isBn ? 'রিপোর্ট পাঠানোর সময়' : 'Daily Report Time'}
            </Label>
            <Select value={sendTime} onValueChange={setSendTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['18:00', '19:00', '20:00', '21:00', '22:00'].map(time => (
                  <SelectItem key={time} value={time}>
                    {time === '18:00' && (isBn ? 'সন্ধ্যা ৬:০০' : '6:00 PM')}
                    {time === '19:00' && (isBn ? 'সন্ধ্যা ৭:০০' : '7:00 PM')}
                    {time === '20:00' && (isBn ? 'রাত ৮:০০' : '8:00 PM')}
                    {time === '21:00' && (isBn ? 'রাত ৯:০০' : '9:00 PM')}
                    {time === '22:00' && (isBn ? 'রাত ১০:০০' : '10:00 PM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleEnable} disabled={saving} variant="gradient" className="w-full gap-2">
            <MessageSquare className="w-4 h-4" />
            {saving ? (isBn ? 'সেটআপ হচ্ছে...' : 'Setting up...') : (isBn ? 'চালু করুন' : 'Enable')}
          </Button>
        </div>
      )}

      {/* Manual share step-by-step dialog */}
      <Dialog open={manualOpen} onOpenChange={setManualOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bengali flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              {isBn ? 'ম্যানুয়ালি লিংক পাঠান' : 'Send Link Manually'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Stepper */}
            <div className="flex items-center gap-2">
              <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>

            {/* Step 1 */}
            <div className={`p-4 rounded-xl border transition-all ${step === 1 ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 opacity-60'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${linkCopied ? 'bg-emerald-500 text-white' : step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {linkCopied ? '✓' : '1'}
                </div>
                <h4 className="font-semibold text-sm font-bengali">
                  {isBn ? 'প্রথমে লিংক কপি করুন' : 'Step 1 — Copy the link'}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3 font-bengali">
                {isBn ? 'অভিভাবক এই লিংক দিয়ে ড্যাশবোর্ড দেখতে পারবেন' : 'Parent will use this link to view the dashboard'}
              </p>
              <div className="p-2 rounded-lg bg-background/60 border border-border/50 mb-3">
                <p className="text-xs font-mono text-primary break-all">{shareLink}</p>
              </div>
              <Button onClick={copyLinkInGuide} size="sm" variant={linkCopied ? 'outline' : 'gradient'} className="gap-1.5 w-full">
                <Copy className="w-3.5 h-3.5" />
                {linkCopied ? (isBn ? '✅ কপি হয়েছে — পরের ধাপে যান' : '✅ Copied — Continue') : (isBn ? 'লিংক কপি করুন' : 'Copy Link')}
              </Button>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-xl border transition-all ${step === 2 ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 opacity-60'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <h4 className="font-semibold text-sm font-bengali">
                  {isBn ? 'WhatsApp-এ পাঠান' : 'Step 2 — Send on WhatsApp'}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3 font-bengali">
                {cleanNumber
                  ? (isBn ? `অভিভাবকের নম্বর: +${cleanNumber}` : `Guardian: +${cleanNumber}`)
                  : (isBn ? 'WhatsApp খুলবে — কন্টাক্ট সিলেক্ট করুন' : 'WhatsApp will open — pick a contact')}
              </p>
              <Button
                onClick={sendOnWhatsApp}
                disabled={step !== 2}
                size="sm"
                variant="gradient"
                className="gap-1.5 w-full"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {isBn ? 'WhatsApp খুলুন ও পাঠান' : 'Open WhatsApp & Send'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
