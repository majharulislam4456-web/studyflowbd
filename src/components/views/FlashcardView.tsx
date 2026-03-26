import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff, BookOpen, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Subject } from '@/hooks/useSupabaseData';

export interface Flashcard {
  id: string;
  user_id: string;
  subject_id: string | null;
  question: string;
  answer: string;
  difficulty: number;
  next_review_date: string | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

interface FlashcardViewProps {
  flashcards: Flashcard[];
  subjects: Subject[];
  addFlashcard: (card: Omit<Flashcard, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
}

type ViewMode = 'manage' | 'review';

export function FlashcardView({ flashcards, subjects, addFlashcard, updateFlashcard, deleteFlashcard }: FlashcardViewProps) {
  const [mode, setMode] = useState<ViewMode>('manage');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [chapter, setChapter] = useState('');

  // Review state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const filtered = filterSubject === 'all'
    ? flashcards
    : flashcards.filter(f => f.subject_id === filterSubject);

  // Cards due for review (next_review_date <= now)
  const reviewCards = filtered.filter(f => {
    if (!f.next_review_date) return true;
    return new Date(f.next_review_date) <= new Date();
  });

  const handleAdd = async () => {
    if (!question.trim() || !answer.trim()) return;
    await addFlashcard({
      subject_id: selectedSubject || null,
      question: question.trim(),
      answer: answer.trim(),
      difficulty: 0,
      next_review_date: new Date().toISOString(),
      review_count: 0,
      chapter: chapter.trim() || null,
    });
    setQuestion('');
    setAnswer('');
    setSelectedSubject('');
    setChapter('');
    setDialogOpen(false);
  };

  const handleReviewResponse = async (quality: 'easy' | 'medium' | 'hard') => {
    const card = reviewCards[currentIndex];
    if (!card) return;

    // Simple spaced repetition: adjust next review based on difficulty
    const now = new Date();
    let daysToAdd = 1;
    let newDifficulty = card.difficulty;

    if (quality === 'easy') {
      daysToAdd = Math.max(1, (card.review_count + 1) * 3);
      newDifficulty = Math.max(0, card.difficulty - 1);
    } else if (quality === 'medium') {
      daysToAdd = Math.max(1, (card.review_count + 1) * 1.5);
      newDifficulty = card.difficulty;
    } else {
      daysToAdd = 0.5; // Review again in 12 hours
      newDifficulty = Math.min(5, card.difficulty + 1);
    }

    const nextReview = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    await updateFlashcard(card.id, {
      difficulty: newDifficulty,
      next_review_date: nextReview.toISOString(),
      review_count: card.review_count + 1,
    });

    setShowAnswer(false);
    if (currentIndex >= reviewCards.length - 1) {
      setCurrentIndex(0);
      setMode('manage');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const getSubjectName = (id: string | null) => {
    if (!id) return null;
    const s = subjects.find(s => s.id === id);
    return s?.name_bn || s?.name || null;
  };

  const getSubjectColor = (id: string | null) => {
    if (!id) return undefined;
    return subjects.find(s => s.id === id)?.color;
  };

  // REVIEW MODE
  if (mode === 'review') {
    const card = reviewCards[currentIndex];
    if (!card || reviewCards.length === 0) {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-bold font-bengali">🎉 সব কার্ড রিভিউ হয়ে গেছে!</h3>
            <p className="text-muted-foreground font-bengali mt-2">এই মুহূর্তে রিভিউ করার কোনো কার্ড নেই</p>
            <Button onClick={() => setMode('manage')} className="mt-4 font-bengali">
              <ChevronLeft className="w-4 h-4 mr-2" /> ফিরে যান
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setMode('manage'); setCurrentIndex(0); setShowAnswer(false); }} className="font-bengali">
            <ChevronLeft className="w-4 h-4 mr-2" /> ফিরে যান
          </Button>
          <Badge variant="secondary" className="font-bengali">
            {currentIndex + 1} / {reviewCards.length}
          </Badge>
        </div>

        <Card
          className="min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-lg"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <CardContent className="text-center p-8 w-full">
            {getSubjectName(card.subject_id) && (
              <Badge className="mb-4" style={{ backgroundColor: getSubjectColor(card.subject_id) }}>
                {getSubjectName(card.subject_id)}
              </Badge>
            )}
            <p className="text-lg font-semibold mb-6">{card.question}</p>

            {showAnswer ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-full h-px bg-border mb-4" />
                <p className="text-base text-muted-foreground">{card.answer}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground font-bengali flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" /> ক্লিক করে উত্তর দেখুন
              </p>
            )}
          </CardContent>
        </Card>

        {showAnswer && (
          <div className="flex items-center justify-center gap-3 animate-in fade-in duration-300">
            <Button variant="destructive" onClick={() => handleReviewResponse('hard')} className="gap-2 font-bengali">
              <ThumbsDown className="w-4 h-4" /> কঠিন
            </Button>
            <Button variant="outline" onClick={() => handleReviewResponse('medium')} className="gap-2 font-bengali">
              <Minus className="w-4 h-4" /> মোটামুটি
            </Button>
            <Button variant="default" onClick={() => handleReviewResponse('easy')} className="gap-2 font-bengali">
              <ThumbsUp className="w-4 h-4" /> সহজ
            </Button>
          </div>
        )}
      </div>
    );
  }

  // MANAGE MODE
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-bengali">🃏 ফ্ল্যাশকার্ড</h2>
          <p className="text-muted-foreground text-sm font-bengali">প্রশ্ন-উত্তর কার্ড তৈরি ও রিভিউ করুন</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="সব সাবজেক্ট" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><span className="font-bengali">সব সাবজেক্ট</span></SelectItem>
              {subjects.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.name_bn || s.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {reviewCards.length > 0 && (
            <Button onClick={() => { setMode('review'); setCurrentIndex(0); setShowAnswer(false); }} className="gap-2 font-bengali">
              <RotateCcw className="w-4 h-4" /> রিভিউ ({reviewCards.length})
            </Button>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="font-bengali">কার্ড যোগ</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-bengali">নতুন ফ্ল্যাশকার্ড</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label className="font-bengali">সাবজেক্ট (ঐচ্ছিক)</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="সাবজেক্ট বাছাই করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                            <span>{s.name_bn || s.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-bengali">চ্যাপ্টার (ঐচ্ছিক)</Label>
                  <Input value={chapter} onChange={e => setChapter(e.target.value)} placeholder="যেমন: অধ্যায় ৩ - গতিবিদ্যা" />
                </div>
                <div>
                  <Label className="font-bengali">প্রশ্ন</Label>
                  <Textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="প্রশ্নটি লিখুন..." rows={3} />
                </div>
                <div>
                  <Label className="font-bengali">উত্তর</Label>
                  <Textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="উত্তরটি লিখুন..." rows={3} />
                </div>
                <Button onClick={handleAdd} className="w-full font-bengali" disabled={!question.trim() || !answer.trim()}>
                  যোগ করুন
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-bengali">কোনো ফ্ল্যাশকার্ড নেই। নতুন কার্ড যোগ করুন!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(card => (
            <Card key={card.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  {getSubjectName(card.subject_id) && (
                    <Badge variant="outline" className="text-xs" style={{ borderColor: getSubjectColor(card.subject_id), color: getSubjectColor(card.subject_id) }}>
                      {getSubjectName(card.subject_id)}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                    onClick={() => deleteFlashcard(card.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="font-medium text-sm mb-2 line-clamp-2">{card.question}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{card.answer}</p>
                {(card as any).chapter && <p className="text-xs text-primary/70 mt-1 font-bengali">📖 {(card as any).chapter}</p>}
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span className="font-bengali">রিভিউ: {card.review_count}বার</span>
                  <Badge variant={card.difficulty > 2 ? 'destructive' : 'secondary'} className="text-[10px]">
                    {card.difficulty > 2 ? 'কঠিন' : card.difficulty > 0 ? 'মাঝারি' : 'সহজ'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
