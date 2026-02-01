import { BookOpen } from 'lucide-react';
import { SubjectCard } from '@/components/syllabus/SubjectCard';
import { AddSubjectDialog } from '@/components/syllabus/AddSubjectDialog';
import type { Subject } from '@/types/study';

interface SyllabusViewProps {
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubjectProgress: (id: string, completed: number) => void;
  deleteSubject: (id: string) => void;
}

export function SyllabusView({
  subjects,
  addSubject,
  updateSubjectProgress,
  deleteSubject,
}: SyllabusViewProps) {
  const totalChapters = subjects.reduce((acc, s) => acc + s.totalChapters, 0);
  const completedChapters = subjects.reduce((acc, s) => acc + s.completedChapters, 0);
  const overallProgress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Syllabus Tracker
          </h1>
          <p className="text-muted-foreground mt-1 font-bengali">
            সিলেবাস ট্র্যাকার - আপনার অগ্রগতি পরিচালনা করুন
          </p>
        </div>
        <AddSubjectDialog onAdd={addSubject} />
      </div>

      {/* Overall Progress */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Overall Progress / <span className="font-bengali">সামগ্রিক অগ্রগতি</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              {completedChapters} of {totalChapters} chapters completed
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 sm:w-64 h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full progress-gradient rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-lg font-bold text-foreground min-w-[60px]">
              {overallProgress.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <div key={subject.id} className={`stagger-${(index % 5) + 1}`}>
            <SubjectCard
              subject={subject}
              onUpdateProgress={updateSubjectProgress}
              onDelete={deleteSubject}
            />
          </div>
        ))}
      </div>

      {subjects.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No subjects yet / <span className="font-bengali">এখনো কোনো বিষয় নেই</span>
          </h3>
          <p className="text-muted-foreground">
            Add your first subject to start tracking / <span className="font-bengali">ট্র্যাকিং শুরু করতে প্রথম বিষয় যোগ করুন</span>
          </p>
        </div>
      )}
    </div>
  );
}
