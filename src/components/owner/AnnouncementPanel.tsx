import { useEffect, useState } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export function AnnouncementPanel() {
  const { settings, update } = useAppSettings();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [active, setActive] = useState(false);
  const [expires, setExpires] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setTitle(settings.announcement_title ?? '');
      setContent(settings.announcement_content ?? '');
      setLink(settings.announcement_link ?? '');
      setActive(settings.announcement_active);
      setExpires(settings.announcement_expires_at ? settings.announcement_expires_at.slice(0, 16) : '');
    }
  }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      await update({
        announcement_title: title || null,
        announcement_content: content || null,
        announcement_link: link || null,
        announcement_active: active,
        announcement_expires_at: expires ? new Date(expires).toISOString() : null,
      });
      toast({ title: 'সংরক্ষিত হয়েছে', description: 'ঘোষণা আপডেট হয়েছে।' });
    } catch (e: any) {
      toast({ title: 'সমস্যা', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div>
        <h2 className="text-lg font-bold font-bengali">📢 ঘোষণা / বার্তা</h2>
        <p className="text-xs text-muted-foreground font-bengali">সব ব্যবহারকারীর ড্যাশবোর্ডে দেখানো হবে।</p>
      </div>
      <div className="space-y-3">
        <div>
          <Label className="font-bengali text-xs">শিরোনাম</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="যেমন: নতুন ফিচার এসেছে" className="font-bengali" />
        </div>
        <div>
          <Label className="font-bengali text-xs">বিস্তারিত</Label>
          <Textarea value={content} onChange={e => setContent(e.target.value)} rows={3} placeholder="বার্তার বিস্তারিত..." className="font-bengali" />
        </div>
        <div>
          <Label className="font-bengali text-xs">লিংক (ঐচ্ছিক)</Label>
          <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <Label className="font-bengali text-xs">মেয়াদ শেষ (ঐচ্ছিক)</Label>
          <Input type="datetime-local" value={expires} onChange={e => setExpires(e.target.value)} />
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
          <Label className="font-bengali">সক্রিয় করুন</Label>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>
        <Button onClick={save} disabled={saving} className="w-full font-bengali">
          {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
        </Button>
      </div>
    </div>
  );
}