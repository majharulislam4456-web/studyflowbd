 import { useState } from 'react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
 import { Label } from '@/components/ui/label';
 import { Pencil, Trash2, Clock } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import type { StudySession, Subject } from '@/hooks/useSupabaseData';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 interface StudySessionListProps {
   sessions: StudySession[];
   subjects: Subject[];
   onUpdate: (id: string, duration: number) => void;
   onDelete: (id: string) => void;
 }
 
 export function StudySessionList({ sessions, subjects, onUpdate, onDelete }: StudySessionListProps) {
   const { language } = useLanguage();
   const [editSession, setEditSession] = useState<StudySession | null>(null);
   const [editDuration, setEditDuration] = useState('');
 
   const getSubjectName = (subjectId: string | null) => {
     if (!subjectId) return language === 'bn' ? 'সাধারণ পড়াশোনা' : 'General Study';
     const subject = subjects.find(s => s.id === subjectId);
     if (!subject) return language === 'bn' ? 'অজানা বিষয়' : 'Unknown';
     return language === 'bn' && subject.name_bn ? subject.name_bn : subject.name;
   };
 
   const formatDate = (date: string) => {
     return new Date(date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
       month: 'short',
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   const formatDuration = (minutes: number) => {
     const hours = Math.floor(minutes / 60);
     const mins = minutes % 60;
     if (hours === 0) return `${mins}${language === 'bn' ? 'মি' : 'm'}`;
     return `${hours}${language === 'bn' ? 'ঘ' : 'h'} ${mins}${language === 'bn' ? 'মি' : 'm'}`;
   };
 
   const handleEdit = (session: StudySession) => {
     setEditSession(session);
     setEditDuration(String(session.duration));
   };
 
   const handleSave = () => {
     if (editSession && editDuration) {
       onUpdate(editSession.id, parseInt(editDuration));
       setEditSession(null);
     }
   };
 
   // Get recent sessions (last 10)
   const recentSessions = sessions.slice(0, 10);
 
   if (recentSessions.length === 0) {
     return (
       <div className="text-center py-8 text-muted-foreground">
         <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
         <p className="font-bengali">
           {language === 'bn' ? 'কোনো সেশন নেই' : 'No sessions yet'}
         </p>
       </div>
     );
   }
 
   return (
     <>
       <div className="space-y-2">
         {recentSessions.map((session, index) => (
           <div
             key={session.id}
             className={cn(
               "flex items-center justify-between p-3 rounded-xl bg-card border border-border",
               "hover:bg-muted/50 transition-all animate-fade-in",
               `stagger-${(index % 5) + 1}`
             )}
           >
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-primary/10">
                 <Clock className="w-4 h-4 text-primary" />
               </div>
                <div>
                  <p className="font-medium text-sm">{getSubjectName(session.subject_id)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(session.session_date)}</p>
                  {session.notes && (
                    <p className="text-xs text-muted-foreground/70 font-bengali mt-0.5 truncate max-w-[200px]">
                      📝 {session.notes}
                    </p>
                  )}
                </div>
             </div>
             
             <div className="flex items-center gap-2">
               <span className="text-sm font-semibold text-primary">
                 {formatDuration(session.duration)}
               </span>
               <Button
                 variant="ghost"
                 size="icon-sm"
                 onClick={() => handleEdit(session)}
                 className="text-muted-foreground hover:text-primary"
               >
                 <Pencil className="w-3 h-3" />
               </Button>
               <Button
                 variant="ghost"
                 size="icon-sm"
                 onClick={() => onDelete(session.id)}
                 className="text-muted-foreground hover:text-destructive"
               >
                 <Trash2 className="w-3 h-3" />
               </Button>
             </div>
           </div>
         ))}
       </div>
 
       {/* Edit Dialog */}
       <Dialog open={!!editSession} onOpenChange={(open) => !open && setEditSession(null)}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle className="font-bengali">
               {language === 'bn' ? 'সেশন সম্পাদনা' : 'Edit Session'}
             </DialogTitle>
           </DialogHeader>
           <div className="space-y-4 py-4">
             <div className="space-y-2">
               <Label className="font-bengali">
                 {language === 'bn' ? 'সময়কাল (মিনিট)' : 'Duration (minutes)'}
               </Label>
               <div className="flex gap-2">
                 <Input
                   type="number"
                   min="1"
                   max="480"
                   value={editDuration}
                   onChange={(e) => setEditDuration(e.target.value)}
                   className="flex-1"
                 />
                 <div className="flex gap-1">
                   {[15, 30, 45, 60, 90, 120].map((mins) => (
                     <Button
                       key={mins}
                       variant={editDuration === String(mins) ? "default" : "outline"}
                       size="sm"
                       onClick={() => setEditDuration(String(mins))}
                       className="px-2 text-xs"
                     >
                       {mins}
                     </Button>
                   ))}
                 </div>
               </div>
             </div>
             <div className="flex gap-2 justify-end">
               <Button variant="outline" onClick={() => setEditSession(null)}>
                 {language === 'bn' ? 'বাতিল' : 'Cancel'}
               </Button>
               <Button onClick={handleSave}>
                 {language === 'bn' ? 'সংরক্ষণ' : 'Save'}
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </>
   );
 }