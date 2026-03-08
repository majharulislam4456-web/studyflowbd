import { useState } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddNoteDialog } from '@/components/notes/AddNoteDialog';
import { NoteCard } from '@/components/notes/NoteCard';
import { EditNoteDialog } from '@/components/notes/EditNoteDialog';
import type { Subject } from '@/hooks/useSupabaseData';

export interface Note {
  id: string;
  user_id: string;
  subject_id: string | null;
  title: string;
  title_bn: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NotesViewProps {
  notes: Note[];
  subjects: Subject[];
  addNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export function NotesView({ notes, subjects, addNote, updateNote, deleteNote }: NotesViewProps) {
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const filtered = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'all' || n.subject_id === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const getSubjectName = (subjectId: string | null) => {
    if (!subjectId) return null;
    return subjects.find(s => s.id === subjectId)?.name || null;
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
            তোমার সব নোট এখানে সেভ করো
          </p>
        </div>
        <AddNoteDialog subjects={subjects} onAdd={addNote} />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes... / নোট খুঁজুন..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
        >
          <option value="all">All Subjects / সব বিষয়</option>
          <option value="">General / সাধারণ</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-bengali">কোনো নোট নেই। নতুন নোট যোগ করো!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note, i) => (
            <NoteCard
              key={note.id}
              note={note}
              subjectName={getSubjectName(note.subject_id)}
              onEdit={() => setEditingNote(note)}
              onDelete={() => deleteNote(note.id)}
              index={i}
            />
          ))}
        </div>
      )}

      {editingNote && (
        <EditNoteDialog
          note={editingNote}
          subjects={subjects}
          onUpdate={updateNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}
