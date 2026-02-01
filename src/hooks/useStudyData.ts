import { useState, useEffect } from 'react';
import type { Subject, Goal, StudySession, Quote } from '@/types/study';

const defaultSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', nameBn: 'গণিত', totalChapters: 12, completedChapters: 5, color: 'hsl(168 65% 35%)' },
  { id: '2', name: 'Physics', nameBn: 'পদার্থবিজ্ঞান', totalChapters: 10, completedChapters: 3, color: 'hsl(38 92% 55%)' },
  { id: '3', name: 'Chemistry', nameBn: 'রসায়ন', totalChapters: 14, completedChapters: 8, color: 'hsl(145 65% 42%)' },
  { id: '4', name: 'Biology', nameBn: 'জীববিজ্ঞান', totalChapters: 16, completedChapters: 10, color: 'hsl(200 85% 50%)' },
];

const defaultGoals: Goal[] = [
  { id: '1', title: 'Complete Physics Syllabus', titleBn: 'পদার্থবিজ্ঞান সিলেবাস সম্পূর্ণ করুন', type: 'mission', daysTotal: 30, daysRemaining: 22, progress: 27, isCompleted: false, createdAt: new Date() },
  { id: '2', title: 'Practice Math Daily', titleBn: 'প্রতিদিন গণিত অনুশীলন', type: 'weekly', daysTotal: 7, daysRemaining: 4, progress: 43, isCompleted: false, createdAt: new Date() },
  { id: '3', title: 'Revise Chemistry Notes', titleBn: 'রসায়ন নোট রিভিউ করুন', type: 'short', daysTotal: 3, daysRemaining: 1, progress: 67, isCompleted: false, createdAt: new Date() },
];

const defaultQuotes: Quote[] = [
  { id: '1', text: 'পরিশ্রম সৌভাগ্যের প্রসূতি।', author: 'প্রবাদ', isBengali: true },
  { id: '2', text: 'যে কষ্ট করে সে রষ্ট হয় না।', author: 'প্রবাদ', isBengali: true },
  { id: '3', text: 'শিক্ষাই জাতির মেরুদণ্ড।', isBengali: true },
  { id: '4', text: 'আজকের কাজ আজই করো, কালের জন্য ফেলে রেখো না।', author: 'প্রবাদ', isBengali: true },
  { id: '5', text: 'সফলতার কোনো শর্টকাট নেই।', isBengali: true },
];

export function useStudyData() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const stored = localStorage.getItem('studyflow-subjects');
    return stored ? JSON.parse(stored) : defaultSubjects;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const stored = localStorage.getItem('studyflow-goals');
    return stored ? JSON.parse(stored) : defaultGoals;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const stored = localStorage.getItem('studyflow-sessions');
    return stored ? JSON.parse(stored) : [];
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const stored = localStorage.getItem('studyflow-quotes');
    return stored ? JSON.parse(stored) : defaultQuotes;
  });

  useEffect(() => {
    localStorage.setItem('studyflow-subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('studyflow-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('studyflow-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('studyflow-quotes', JSON.stringify(quotes));
  }, [quotes]);

  const updateSubjectProgress = (id: string, completedChapters: number) => {
    setSubjects(prev => prev.map(s => 
      s.id === id ? { ...s, completedChapters: Math.min(completedChapters, s.totalChapters) } : s
    ));
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    setSubjects(prev => [...prev, { ...subject, id: Date.now().toString() }]);
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now().toString(), createdAt: new Date() }]);
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, progress: Math.min(progress, 100), isCompleted: progress >= 100 } : g
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    setSessions(prev => [...prev, { ...session, id: Date.now().toString() }]);
  };

  const addQuote = (quote: Omit<Quote, 'id'>) => {
    setQuotes(prev => [...prev, { ...quote, id: Date.now().toString() }]);
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  const getTodayStudyTime = () => {
    const today = new Date().toDateString();
    return sessions
      .filter(s => new Date(s.date).toDateString() === today)
      .reduce((acc, s) => acc + s.duration, 0);
  };

  const getWeekStudyTime = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions
      .filter(s => new Date(s.date) >= weekAgo)
      .reduce((acc, s) => acc + s.duration, 0);
  };

  return {
    subjects,
    goals,
    sessions,
    quotes,
    updateSubjectProgress,
    addSubject,
    deleteSubject,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    addSession,
    addQuote,
    deleteQuote,
    getTodayStudyTime,
    getWeekStudyTime,
  };
}
