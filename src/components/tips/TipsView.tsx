import { useState, useMemo } from 'react';
import { Lightbulb, Plus, Pencil, Trash2, Calendar, Search, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTips, type Tip } from '@/hooks/useTips';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { TipDialog } from './TipDialog';
import { LinkPreview } from './LinkPreview';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'সব' },
  { id: 'study', label: 'পড়াশোনা' },
  { id: 'motivation', label: 'মোটিভেশন' },
  { id: 'tools', label: 'টুলস' },
  { id: 'exam', label: 'পরীক্ষা প্রস্তুতি' },
  { id: 'other', label: 'অন্যান্য' },
];

const categoryLabel = (id: string) => CATEGORIES.find(c => c.id === id)?.label ?? id;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function TipsView() {
  const { tips, loading, addTip, updateTip, deleteTip } = useTips();
  const { isAdmin } = useIsAdmin();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'category'>('newest');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tip | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Tip | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = tips.filter(t => {
      if (filter !== 'all' && t.category !== filter) return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.content.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sort === 'newest') list = [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    else if (sort === 'oldest') list = [...list].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    else list = [...list].sort((a, b) =>
      a.category.localeCompare(b.category) || +new Date(b.created_at) - +new Date(a.created_at)
    );
    return list;
  }, [tips, filter, search, sort]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-bengali">হেল্পফুল রিসোর্স ও টিপস</h1>
            <p className="text-sm text-muted-foreground font-bengali">পড়াশোনার দরকারি পরামর্শ ও লিংক এক জায়গায়</p>
          </div>
        </div>
        {isAdmin && (
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="font-bengali">
            <Plus className="w-4 h-4" /> নতুন টিপ
          </Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium font-bengali transition-all',
              filter === c.id
                ? 'bg-primary text-primary-foreground shadow'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="শিরোনাম বা কনটেন্টে খুঁজুন..."
            className="pl-9 font-bengali"
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="w-full sm:w-[180px] font-bengali">
            <ArrowDownUp className="w-3.5 h-3.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="font-bengali">নতুন আগে</SelectItem>
            <SelectItem value="oldest" className="font-bengali">পুরনো আগে</SelectItem>
            <SelectItem value="category" className="font-bengali">ক্যাটেগরি অনুযায়ী</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-bengali text-sm">লোড হচ্ছে...</p>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center border-dashed">
          <Lightbulb className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground font-bengali">
            {isAdmin ? 'এখনো কোনো টিপ নেই — উপরে থেকে নতুন টিপ যোগ করুন।' : 'এখনো কোনো টিপ পোস্ট হয়নি।'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(tip => (
            <Card key={tip.id} className="p-5 group hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="font-bengali text-[11px]">{categoryLabel(tip.category)}</Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-bengali">
                    <Calendar className="w-3 h-3" /> {formatDate(tip.created_at)}
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon-sm" variant="ghost" onClick={() => { setEditing(tip); setDialogOpen(true); }}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => setConfirmDelete(tip)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-base text-foreground font-bengali mb-1.5">{tip.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap font-bengali leading-relaxed">{tip.content}</p>
              {tip.link_url && <LinkPreview url={tip.link_url} />}
            </Card>
          ))}
        </div>
      )}

      <TipDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tip={editing}
        onSubmit={async (data) => {
          if (editing) await updateTip(editing.id, data);
          else await addTip(data);
          setDialogOpen(false);
        }}
        categories={CATEGORIES.filter(c => c.id !== 'all')}
      />

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bengali">টিপ মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription className="font-bengali">এই কাজটি ফিরিয়ে আনা যাবে না।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bengali">বাতিল</AlertDialogCancel>
            <AlertDialogAction
              className="font-bengali bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => { if (confirmDelete) { await deleteTip(confirmDelete.id); setConfirmDelete(null); } }}
            >মুছুন</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}