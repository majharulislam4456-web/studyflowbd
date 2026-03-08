import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Note } from '@/components/views/NotesView';

interface NoteCardProps {
  note: Note;
  subjectName: string | null;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}

export function NoteCard({ note, subjectName, onEdit, onDelete, index }: NoteCardProps) {
  const preview = note.content.length > 150 ? note.content.slice(0, 150) + '...' : note.content;
  const date = new Date(note.updated_at).toLocaleDateString('bn-BD', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <Card
      className={cn(
        "group hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in-up",
      )}
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={onEdit}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{note.title}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onEdit(); }}>
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={e => { e.stopPropagation(); onDelete(); }}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        {subjectName && <Badge variant="secondary" className="w-fit text-xs">{subjectName}</Badge>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">{preview}</p>
        <p className="text-xs text-muted-foreground/60 mt-3 font-bengali">{date}</p>
      </CardContent>
    </Card>
  );
}
