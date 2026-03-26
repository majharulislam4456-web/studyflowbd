import { useState } from 'react';
import { FileText, Plus, Search, Pin, Archive, ArchiveRestore, CheckSquare, Palette, Tag, Eye, Edit3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Subject, Note } from '@/hooks/useSupabaseData';

export type { Note } from '@/hooks/useSupabaseData';

const NOTE_COLORS = [
  null, '#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#ede9fe', '#fed7aa', '#e5e7eb',
];

interface NotesViewProps {
  notes: Note[];
  subjects: Subject[];
  addNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

type ViewTab = 'active' | 'archived';

export function NotesView({ notes, subjects, addNote, updateNote, deleteNote }: NotesViewProps) {
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [viewTab, setViewTab] = useState<ViewTab>('active');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newColor, setNewColor] = useState<string | null>(null);
  const [newIsChecklist, setNewIsChecklist] = useState(false);
  const [newChecklistItems, setNewChecklistItems] = useState<{text: string; checked: boolean}[]>([]);
  const [newChecklistInput, setNewChecklistInput] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editColor, setEditColor] = useState<string | null>(null);
  const [editChecklistItems, setEditChecklistItems] = useState<{text: string; checked: boolean}[]>([]);
  const [editChecklistInput, setEditChecklistInput] = useState('');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const filtered = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'all' || n.subject_id === filterSubject;
    const matchesTab = viewTab === 'archived' ? n.is_archived : !n.is_archived;
    return matchesSearch && matchesSubject && matchesTab;
  });

  // Sort: pinned first, then by updated_at
  const sorted = [...filtered].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const getSubjectName = (subjectId: string | null) => {
    if (!subjectId) return null;
    return subjects.find(s => s.id === subjectId)?.name || null;
  };

  const handleAdd = async () => {
    if (!newTitle.trim() && !newIsChecklist) return;
    await addNote({
      title: newTitle.trim() || 'Untitled',
      title_bn: null,
      content: newContent.trim(),
      subject_id: newSubjectId || null,
      is_pinned: false,
      color: newColor,
      is_archived: false,
      labels: [],
      is_checklist: newIsChecklist,
      checklist_items: newChecklistItems,
    });
    setNewTitle(''); setNewContent(''); setNewSubjectId(''); setNewColor(null);
    setNewIsChecklist(false); setNewChecklistItems([]); setAddOpen(false);
  };

  const openViewNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditSubjectId(note.subject_id || '');
    setEditColor(note.color);
    setEditChecklistItems((note.checklist_items || []) as {text: string; checked: boolean}[]);
  };

  const handleSaveEdit = async () => {
    if (!selectedNote) return;
    await updateNote(selectedNote.id, {
      title: editTitle.trim() || 'Untitled',
      content: editContent.trim(),
      subject_id: editSubjectId || null,
      color: editColor,
      checklist_items: editChecklistItems,
    });
    setSelectedNote({ ...selectedNote, title: editTitle, content: editContent, subject_id: editSubjectId || null, color: editColor, checklist_items: editChecklistItems });
    setIsEditing(false);
  };

  const addChecklistItem = (items: {text:string;checked:boolean}[], setItems: (i: any[]) => void, input: string, setInput: (s: string) => void) => {
    if (!input.trim()) return;
    setItems([...items, { text: input.trim(), checked: false }]);
    setInput('');
  };

  const toggleCheckItem = async (note: Note, idx: number) => {
    const items = [...(note.checklist_items as {text:string;checked:boolean}[])];
    items[idx] = { ...items[idx], checked: !items[idx].checked };
    await updateNote(note.id, { checklist_items: items });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            Notes <span className="font-bengali text-lg text-muted-foreground">/ নোটস</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-bengali">
            Google Keep স্টাইলে নোট রাখো
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /><span className="font-bengali">নতুন নোট</span></Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-bengali">নতুন নোট</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="শিরোনাম..." />
              <select value={newSubjectId} onChange={e => setNewSubjectId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm">
                <option value="">সাধারণ / General</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {/* Checklist toggle */}
              <div className="flex items-center gap-2">
                <Checkbox checked={newIsChecklist} onCheckedChange={v => setNewIsChecklist(!!v)} id="newChecklist" />
                <Label htmlFor="newChecklist" className="font-bengali text-sm">চেকলিস্ট নোট</Label>
              </div>
              {newIsChecklist ? (
                <div className="space-y-2">
                  {newChecklistItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox checked={item.checked} onCheckedChange={() => {
                        const copy = [...newChecklistItems];
                        copy[i] = { ...copy[i], checked: !copy[i].checked };
                        setNewChecklistItems(copy);
                      }} />
                      <span className={cn("text-sm flex-1", item.checked && "line-through text-muted-foreground")}>{item.text}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setNewChecklistItems(newChecklistItems.filter((_, j) => j !== i))}><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input value={newChecklistInput} onChange={e => setNewChecklistInput(e.target.value)} placeholder="আইটেম যোগ করো..." className="text-sm"
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChecklistItem(newChecklistItems, setNewChecklistItems, newChecklistInput, setNewChecklistInput); }}} />
                    <Button size="sm" variant="outline" onClick={() => addChecklistItem(newChecklistItems, setNewChecklistItems, newChecklistInput, setNewChecklistInput)}>+</Button>
                  </div>
                </div>
              ) : (
                <Textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="নোট লেখো..." rows={6} />
              )}
              {/* Color picker */}
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                {NOTE_COLORS.map((c, i) => (
                  <button key={i} onClick={() => setNewColor(c)} className={cn("w-6 h-6 rounded-full border-2 transition-all", newColor === c ? "border-primary scale-110" : "border-border")}
                    style={{ backgroundColor: c || 'transparent' }} />
                ))}
              </div>
              <Button onClick={handleAdd} disabled={!newTitle.trim() && !newIsChecklist} className="w-full font-bengali">সেভ করো</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          <Button variant={viewTab === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setViewTab('active')} className="font-bengali gap-1">
            <FileText className="w-4 h-4" /> নোটস
          </Button>
          <Button variant={viewTab === 'archived' ? 'default' : 'outline'} size="sm" onClick={() => setViewTab('archived')} className="font-bengali gap-1">
            <Archive className="w-4 h-4" /> আর্কাইভ
          </Button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="নোট খুঁজুন..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm">
          <option value="all">সব বিষয়</option>
          <option value="">সাধারণ</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Notes Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-bengali">{viewTab === 'archived' ? 'আর্কাইভে কোনো নোট নেই' : 'কোনো নোট নেই। নতুন নোট যোগ করো!'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((note, i) => {
            const checkItems = (note.checklist_items || []) as {text:string;checked:boolean}[];
            return (
              <Card
                key={note.id}
                className={cn("group hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in-up relative overflow-hidden")}
                style={{ animationDelay: `${i * 60}ms`, backgroundColor: note.color || undefined }}
                onClick={() => openViewNote(note)}
              >
                {note.is_pinned && (
                  <div className="absolute top-2 right-2"><Pin className="w-4 h-4 text-primary fill-primary" /></div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2 pr-6">
                    <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{note.title}</h3>
                  </div>
                  {getSubjectName(note.subject_id) && <Badge variant="secondary" className="w-fit text-xs">{getSubjectName(note.subject_id)}</Badge>}
                </CardHeader>
                <CardContent>
                  {note.is_checklist ? (
                    <div className="space-y-1">
                      {checkItems.slice(0, 4).map((item, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <Checkbox checked={item.checked} className="pointer-events-none h-3.5 w-3.5" />
                          <span className={cn(item.checked && "line-through text-muted-foreground")}>{item.text}</span>
                        </div>
                      ))}
                      {checkItems.length > 4 && <p className="text-xs text-muted-foreground">+{checkItems.length - 4} more</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">{note.content}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground/60 font-bengali">
                      {new Date(note.updated_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); updateNote(note.id, { is_pinned: !note.is_pinned }); }}>
                        <Pin className={cn("w-3.5 h-3.5", note.is_pinned && "fill-primary text-primary")} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); updateNote(note.id, { is_archived: !note.is_archived }); }}>
                        {note.is_archived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setShowColorPicker(showColorPicker === note.id ? null : note.id); }}>
                        <Palette className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  {showColorPicker === note.id && (
                    <div className="flex gap-1 mt-2 p-2 bg-background/80 rounded-lg" onClick={e => e.stopPropagation()}>
                      {NOTE_COLORS.map((c, j) => (
                        <button key={j} onClick={() => { updateNote(note.id, { color: c }); setShowColorPicker(null); }}
                          className={cn("w-6 h-6 rounded-full border-2", note.color === c ? "border-primary" : "border-border")}
                          style={{ backgroundColor: c || 'transparent' }} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* View/Edit Note Dialog */}
      {selectedNote && (
        <Dialog open onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" style={{ backgroundColor: (isEditing ? editColor : selectedNote.color) || undefined }}>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="font-bengali flex-1">
                  {isEditing ? 'এডিট নোট' : selectedNote.title}
                </DialogTitle>
                <Button variant="ghost" size="sm" onClick={() => { if (isEditing) handleSaveEdit(); else { setIsEditing(true); } }} className="font-bengali gap-1">
                  {isEditing ? <>সেভ</> : <><Edit3 className="w-4 h-4" /> এডিট</>}
                </Button>
              </div>
            </DialogHeader>
            {isEditing ? (
              <div className="space-y-4">
                <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="শিরোনাম" />
                <select value={editSubjectId} onChange={e => setEditSubjectId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm">
                  <option value="">সাধারণ</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {selectedNote.is_checklist ? (
                  <div className="space-y-2">
                    {editChecklistItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Checkbox checked={item.checked} onCheckedChange={() => {
                          const copy = [...editChecklistItems];
                          copy[i] = { ...copy[i], checked: !copy[i].checked };
                          setEditChecklistItems(copy);
                        }} />
                        <Input value={item.text} onChange={e => {
                          const copy = [...editChecklistItems];
                          copy[i] = { ...copy[i], text: e.target.value };
                          setEditChecklistItems(copy);
                        }} className="text-sm flex-1" />
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditChecklistItems(editChecklistItems.filter((_, j) => j !== i))}><X className="w-3 h-3" /></Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input value={editChecklistInput} onChange={e => setEditChecklistInput(e.target.value)} placeholder="নতুন আইটেম..."
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChecklistItem(editChecklistItems, setEditChecklistItems, editChecklistInput, setEditChecklistInput); }}} />
                      <Button size="sm" variant="outline" onClick={() => addChecklistItem(editChecklistItems, setEditChecklistItems, editChecklistInput, setEditChecklistInput)}>+</Button>
                    </div>
                  </div>
                ) : (
                  <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={10} />
                )}
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  {NOTE_COLORS.map((c, i) => (
                    <button key={i} onClick={() => setEditColor(c)} className={cn("w-6 h-6 rounded-full border-2", editColor === c ? "border-primary scale-110" : "border-border")}
                      style={{ backgroundColor: c || 'transparent' }} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} className="flex-1 font-bengali">আপডেট করো</Button>
                  <Button variant="destructive" onClick={async () => { await deleteNote(selectedNote.id); setSelectedNote(null); }} className="font-bengali">মুছে ফেলো</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {getSubjectName(selectedNote.subject_id) && <Badge variant="secondary">{getSubjectName(selectedNote.subject_id)}</Badge>}
                {selectedNote.is_checklist ? (
                  <div className="space-y-2">
                    {((selectedNote.checklist_items || []) as {text:string;checked:boolean}[]).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Checkbox checked={item.checked} onCheckedChange={() => toggleCheckItem(selectedNote, i)} />
                        <span className={cn("text-sm", item.checked && "line-through text-muted-foreground")}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{selectedNote.content || 'কোনো কন্টেন্ট নেই'}</p>
                )}
                <p className="text-xs text-muted-foreground font-bengali">
                  আপডেট: {new Date(selectedNote.updated_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
