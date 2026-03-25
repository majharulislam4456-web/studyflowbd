import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Syllabus {
  id: string;
  user_id: string;
  name: string;
  name_bn: string | null;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  name_bn: string | null;
  total_chapters: number;
  completed_chapters: number;
  color: string;
  priority?: number;
  syllabus_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  title_bn: string | null;
  type: 'mission' | 'weekly' | 'short';
  days_total: number;
  days_remaining: number;
  progress: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id: string | null;
  duration: number;
  notes: string | null;
  session_date: string;
  created_at: string;
}

export interface Quote {
  id: string;
  user_id: string;
  text: string;
  author: string | null;
  is_bengali: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  language?: string;
  theme_color?: string;
  created_at: string;
  updated_at: string;
}

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  title_bn?: string | null;
  is_completed: boolean;
  due_date?: string | null;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  title_bn?: string | null;
  last_completed_date?: string | null;
  created_at: string;
  updated_at: string;
}

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

export interface StudyRoutine {
  id: string;
  user_id: string;
  subject_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

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

export function useSupabaseData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [routines, setRoutines] = useState<StudyRoutine[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
   // Sort subjects by priority (higher first) then by created_at
   const sortedSubjects = [...subjects].sort((a, b) => {
     const priorityDiff = (b as any).priority - (a as any).priority;
     if (priorityDiff !== 0) return priorityDiff;
     return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
   });

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [subjectsRes, syllabusesRes, goalsRes, sessionsRes, quotesRes, todosRes, dailyTasksRes, profileRes, notesRes, routinesRes, flashcardsRes] = await Promise.all([
        supabase.from('subjects').select('*').order('created_at', { ascending: false }),
        supabase.from('syllabuses').select('*').order('created_at', { ascending: false }),
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
        supabase.from('study_sessions').select('*').order('session_date', { ascending: false }),
        supabase.from('quotes').select('*').order('created_at', { ascending: false }),
        supabase.from('todos').select('*').order('created_at', { ascending: false }),
        supabase.from('daily_tasks').select('*').order('created_at', { ascending: true }),
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('notes').select('*').order('updated_at', { ascending: false }),
        supabase.from('study_routines').select('*').order('start_time', { ascending: true }),
        supabase.from('flashcards').select('*').order('created_at', { ascending: false })
      ]);

      if (subjectsRes.data) setSubjects(subjectsRes.data as Subject[]);
      if (syllabusesRes.data) setSyllabuses(syllabusesRes.data as Syllabus[]);
      if (goalsRes.data) setGoals(goalsRes.data as Goal[]);
      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (quotesRes.data) setQuotes(quotesRes.data);
      if (todosRes.data) setTodos(todosRes.data as Todo[]);
      if (dailyTasksRes.data) setDailyTasks(dailyTasksRes.data as DailyTask[]);
      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (notesRes.data) setNotes(notesRes.data as Note[]);
      if (routinesRes.data) setRoutines(routinesRes.data as StudyRoutine[]);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching data:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // SYLLABUSES
  const addSyllabus = async (syllabus: Omit<Syllabus, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('syllabuses')
      .insert({ ...syllabus, user_id: user.id } as any)
      .select()
      .single();
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    if (data) setSyllabuses(prev => [data as Syllabus, ...prev]);
  };

  const updateSyllabus = async (id: string, updates: Partial<Syllabus>) => {
    const { error } = await supabase.from('syllabuses').update(updates as any).eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setSyllabuses(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSyllabus = async (id: string) => {
    const { error } = await supabase.from('syllabuses').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setSyllabuses(prev => prev.filter(s => s.id !== id));
    // Subjects with this syllabus_id will be cascade deleted by DB
    setSubjects(prev => prev.filter(s => s.syllabus_id !== id));
  };

  // SUBJECTS
  const addSubject = async (subject: Omit<Subject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('subjects')
      .insert({ ...subject, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    if (data) setSubjects(prev => [data, ...prev]);
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    const { error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = async (id: string) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // GOALS
  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goal, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    if (data) setGoals(prev => [data as Goal, ...prev]);
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const { error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // SESSIONS
  const addSession = async (session: Omit<StudySession, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({ ...session, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    if (data) {
      setSessions(prev => [data, ...prev]);
     }
   };
 
   const updateSession = async (id: string, duration: number) => {
     const { error } = await supabase
       .from('study_sessions')
       .update({ duration })
       .eq('id', id);
 
     if (error) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
       return;
     }
 
     setSessions(prev => prev.map(s => s.id === id ? { ...s, duration } : s));
   };
 
   const deleteSession = async (id: string) => {
     const { error } = await supabase.from('study_sessions').delete().eq('id', id);
     
     if (error) {
       toast({ title: 'Error', description: error.message, variant: 'destructive' });
       return;
    }
 
     setSessions(prev => prev.filter(s => s.id !== id));
  };

  // QUOTES
  const addQuote = async (quote: Omit<Quote, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('quotes')
      .insert({ ...quote, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    if (data) setQuotes(prev => [data, ...prev]);
  };

  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    const { error } = await supabase
      .from('quotes')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuote = async (id: string) => {
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setQuotes(prev => prev.filter(q => q.id !== id));
  };

  // PROFILE
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setProfile(prev => prev ? { ...prev, ...updates } : null);
    toast({ title: 'Profile Updated! / প্রোফাইল আপডেট হয়েছে!' });
  };

  // Helper functions
  const getTodayStudyTime = () => {
    const today = new Date().toDateString();
    return sessions
      .filter(s => new Date(s.session_date).toDateString() === today)
      .reduce((acc, s) => acc + s.duration, 0);
  };

  const getWeekStudyTime = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions
      .filter(s => new Date(s.session_date) >= weekAgo)
      .reduce((acc, s) => acc + s.duration, 0);
  };

  // TODOS
  const addTodo = async (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('todos')
      .insert({ ...todo, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    if (data) setTodos(prev => [data as Todo, ...prev]);
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const { error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // DAILY TASKS
  const addDailyTask = async (task: Omit<DailyTask, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('daily_tasks')
      .insert({ ...task, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    if (data) setDailyTasks(prev => [...prev, data as DailyTask]);
  };

  const updateDailyTask = async (id: string, updates: Partial<DailyTask>) => {
    const { error } = await supabase
      .from('daily_tasks')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteDailyTask = async (id: string) => {
    const { error } = await supabase.from('daily_tasks').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    setDailyTasks(prev => prev.filter(t => t.id !== id));
  };

  // NOTES
  const addNote = async (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('notes')
      .insert({ ...note, user_id: user.id } as any)
      .select()
      .single();
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    if (data) setNotes(prev => [data as Note, ...prev]);
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const { error } = await supabase.from('notes').update(updates as any).eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // ROUTINES
  const addRoutine = async (routine: Omit<StudyRoutine, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('study_routines')
      .insert({ ...routine, user_id: user.id })
      .select()
      .single();
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    if (data) setRoutines(prev => [...prev, data as StudyRoutine]);
  };

  const deleteRoutine = async (id: string) => {
    const { error } = await supabase.from('study_routines').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  return {
    subjects: sortedSubjects,
    syllabuses,
    goals,
    sessions,
    quotes,
    todos,
    dailyTasks,
    notes,
    routines,
    profile,
    loading,
    addSyllabus,
    updateSyllabus,
    deleteSyllabus,
    addSubject,
    updateSubject,
    deleteSubject,
    addGoal,
    updateGoal,
    deleteGoal,
    addSession,
    updateSession,
    deleteSession,
    addQuote,
    updateQuote,
    deleteQuote,
    addTodo,
    updateTodo,
    deleteTodo,
    addDailyTask,
    updateDailyTask,
    deleteDailyTask,
    addNote,
    updateNote,
    deleteNote,
    addRoutine,
    deleteRoutine,
    updateProfile,
    getTodayStudyTime,
    getWeekStudyTime,
    refetch: fetchData,
  };
}
