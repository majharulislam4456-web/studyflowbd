import { useState } from 'react';
import { BookOpen, Star, FolderOpen, Trash2, Pencil } from 'lucide-react';
import { SubjectCard } from '@/components/syllabus/SubjectCard';
import { AddSubjectDialog } from '@/components/syllabus/AddSubjectDialog';
import { AddSyllabusDialog } from '@/components/syllabus/AddSyllabusDialog';
import { EditSubjectDialog } from '@/components/syllabus/EditSubjectDialog';
import type { Subject, Syllabus } from '@/hooks/useSupabaseData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SyllabusViewProps {
  subjects: Subject[];
  syllabuses: Syllabus[];
  addSubject: (subject: Omit<Subject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addSyllabus: (syllabus: Omit<Syllabus, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateSyllabus: (id: string, updates: Partial<Syllabus>) => void;
  deleteSyllabus: (id: string) => void;
}

export function SyllabusView({
  subjects,
  syllabuses,
  addSubject,
  updateSubject,
  deleteSubject,
  addSyllabus,
  updateSyllabus,
  deleteSyllabus,
}: SyllabusViewProps) {
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [activeSyllabusId, setActiveSyllabusId] = useState<string | null>(null);
  const { language } = useLanguage();

  // Filter subjects by active syllabus
  const filteredSubjects = activeSyllabusId
    ? subjects.filter(s => s.syllabus_id === activeSyllabusId)
    : subjects.filter(s => !s.syllabus_id);

  const totalChapters = filteredSubjects.reduce((acc, s) => acc + s.total_chapters, 0);
  const completedChapters = filteredSubjects.reduce((acc, s) => acc + s.completed_chapters, 0);
  const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const handleTogglePriority = (id: string, priority: number) => {
    updateSubject(id, { priority } as any);
  };

  const handleAddSubject = (subject: Omit<Subject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    addSubject({ ...subject, syllabus_id: activeSyllabusId } as any);
  };

  const prioritySubjects = filteredSubjects.filter(s => (s as any).priority > 0);
  const regularSubjects = filteredSubjects.filter(s => !((s as any).priority > 0));

  const activeSyllabus = syllabuses.find(s => s.id === activeSyllabusId);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            {language === 'bn' ? 'সিলেবাস ট্র্যাকার' : 'Syllabus Tracker'}
          </h1>
          <p className="text-muted-foreground mt-1 font-bengali">
            {language === 'bn' ? 'আপনার অগ্রগতি পরিচালনা করুন' : 'Manage your progress'}
          </p>
        </div>
        <div className="flex gap-2">
          <AddSyllabusDialog onAdd={addSyllabus} />
          <AddSubjectDialog onAdd={handleAddSubject} />
        </div>
      </div>

      {/* Syllabus Tabs */}
      {syllabuses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSyllabusId(null)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              !activeSyllabusId
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {language === 'bn' ? 'সব বিষয়' : 'All Subjects'}
          </button>
          {syllabuses.map((syl) => (
            <div key={syl.id} className="flex items-center gap-1">
              <button
                onClick={() => setActiveSyllabusId(syl.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                  activeSyllabusId === syl.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: syl.color }} />
                {language === 'bn' && syl.name_bn ? syl.name_bn : syl.name}
              </button>
              {activeSyllabusId === syl.id && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    if (confirm(language === 'bn' ? 'এই সিলেবাস এবং এর সব বিষয় মুছে ফেলবেন?' : 'Delete this syllabus and all its subjects?')) {
                      deleteSyllabus(syl.id);
                      setActiveSyllabusId(null);
                    }
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Active Syllabus Info */}
      {activeSyllabus && (
        <div className="glass-card p-4 flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              {language === 'bn' && activeSyllabus.name_bn ? activeSyllabus.name_bn : activeSyllabus.name}
            </h3>
            {activeSyllabus.description && (
              <p className="text-sm text-muted-foreground">{activeSyllabus.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">
              {language === 'bn' ? 'সামগ্রিক অগ্রগতি' : 'Overall Progress'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {completedChapters} / {totalChapters} {language === 'bn' ? 'অধ্যায় সম্পন্ন' : 'chapters completed'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 sm:w-64 h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full progress-gradient rounded-full transition-all duration-500 animate-pulse"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-lg font-bold text-foreground min-w-[60px]">
              {overallProgress.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Priority Subjects */}
      {prioritySubjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 font-bengali">
            <Star className="w-5 h-5 text-primary fill-primary" />
            {language === 'bn' ? 'গুরুত্বপূর্ণ বিষয়' : 'Priority Subjects'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prioritySubjects.map((subject, index) => (
              <div key={subject.id} className={`stagger-${(index % 5) + 1}`}>
                <SubjectCard
                  subject={subject}
                  onUpdateProgress={(id, completed) => updateSubject(id, { completed_chapters: completed })}
                  onDelete={deleteSubject}
                  onEdit={setEditSubject}
                  onTogglePriority={handleTogglePriority}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Subjects */}
      {regularSubjects.length > 0 && (
        <div className="space-y-4">
          {prioritySubjects.length > 0 && (
            <h2 className="text-lg font-semibold text-foreground font-bengali">
              {language === 'bn' ? 'অন্যান্য বিষয়' : 'Other Subjects'}
            </h2>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularSubjects.map((subject, index) => (
              <div key={subject.id} className={`stagger-${(index % 5) + 1}`}>
                <SubjectCard
                  subject={subject}
                  onUpdateProgress={(id, completed) => updateSubject(id, { completed_chapters: completed })}
                  onDelete={deleteSubject}
                  onEdit={setEditSubject}
                  onTogglePriority={handleTogglePriority}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredSubjects.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {language === 'bn' ? 'এখনো কোনো বিষয় নেই' : 'No subjects yet'}
          </h3>
          <p className="text-muted-foreground font-bengali">
            {language === 'bn' ? 'ট্র্যাকিং শুরু করতে প্রথম বিষয় যোগ করুন' : 'Add your first subject to start tracking'}
          </p>
        </div>
      )}

      <EditSubjectDialog
        subject={editSubject}
        open={!!editSubject}
        onOpenChange={(open) => !open && setEditSubject(null)}
        onSave={updateSubject}
      />
    </div>
  );
}
