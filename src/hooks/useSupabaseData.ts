import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  name_bn: string | null;
  total_chapters: number;
  completed_chapters: number;
  color: string;
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
  created_at: string;
  updated_at: string;
}

export function useSupabaseData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [subjectsRes, goalsRes, sessionsRes, quotesRes, profileRes] = await Promise.all([
        supabase.from('subjects').select('*').order('created_at', { ascending: false }),
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
        supabase.from('study_sessions').select('*').order('session_date', { ascending: false }),
        supabase.from('quotes').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('user_id', user.id).single()
      ]);

      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data as Goal[]);
      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (quotesRes.data) setQuotes(quotesRes.data);
      if (profileRes.data) setProfile(profileRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      toast({ title: 'Session Logged! / সেশন লগ হয়েছে!' });
    }
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

  return {
    subjects,
    goals,
    sessions,
    quotes,
    profile,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    addGoal,
    updateGoal,
    deleteGoal,
    addSession,
    addQuote,
    updateQuote,
    deleteQuote,
    updateProfile,
    getTodayStudyTime,
    getWeekStudyTime,
    refetch: fetchData,
  };
}
