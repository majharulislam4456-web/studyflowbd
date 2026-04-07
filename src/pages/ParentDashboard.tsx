import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Clock, Flame, Target, CheckCircle2, GraduationCap, Heart, BarChart3, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ParentData {
  student: { name: string; avatar_url: string | null; class: string | null; division: string | null; dream: string | null };
  today: { studyMinutes: number; subjects: { name: string; name_bn: string | null; color: string }[]; sessionCount: number };
  week: { studyMinutes: number };
  streak: number;
  syllabus: { progress: number; completedChapters: number; totalChapters: number };
  todos: { completed: number; total: number; items: { title: string; title_bn: string | null; is_completed: boolean }[] };
}

export default function ParentDashboard() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<ParentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    const fetchData = async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const url = `https://${projectId}.supabase.co/functions/v1/parent-dashboard?code=${code}`;
        const res = await fetch(url, {
          headers: { 'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Not found');
        }
        setData(await res.json());
      } catch (e: any) {
        setError(e.message || 'Invalid code');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">কোড সঠিক নয়</h1>
          <p className="text-gray-500">এই শেয়ার কোডটি সঠিক নয় বা নিষ্ক্রিয় করা হয়েছে। আপনার সন্তানের কাছ থেকে সঠিক কোড নিন।</p>
          <p className="text-sm text-gray-400 mt-4">Invalid or inactive share code</p>
        </div>
      </div>
    );
  }

  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins} মিনিট`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} ঘণ্টা ${m} মিনিট` : `${h} ঘণ্টা`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <p className="text-teal-200 text-sm mb-1">📚 অভিভাবক ড্যাশবোর্ড</p>
          <h1 className="text-2xl font-bold">{data.student.name}</h1>
          <div className="flex items-center gap-3 mt-2 text-teal-100 text-sm">
            {data.student.class && <span>ক্লাস: {data.student.class}</span>}
            {data.student.division && <span>• {data.student.division}</span>}
            {data.student.dream && (
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" /> {data.student.dream}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-8 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Clock} color="bg-blue-500" label="আজ পড়েছে" value={formatTime(data.today.studyMinutes)} />
          <StatCard icon={BarChart3} color="bg-purple-500" label="এই সপ্তাহে" value={formatTime(data.week.studyMinutes)} />
          <StatCard icon={Flame} color="bg-orange-500" label="স্ট্রিক" value={`${data.streak} দিন`} />
          <StatCard icon={GraduationCap} color="bg-teal-500" label="সিলেবাস" value={`${data.syllabus.progress}%`} />
        </div>

        {/* Today's Subjects */}
        {data.today.subjects.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              আজ যেসব বিষয় পড়েছে
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.today.subjects.map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium text-white" style={{ backgroundColor: s.color }}>
                  {s.name_bn || s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Syllabus Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-600" />
            সিলেবাস অগ্রগতি
          </h2>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${data.syllabus.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {data.syllabus.completedChapters}/{data.syllabus.totalChapters} অধ্যায় শেষ হয়েছে
          </p>
        </div>

        {/* Todos */}
        {data.todos.total > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              কাজের তালিকা ({data.todos.completed}/{data.todos.total} সম্পন্ন)
            </h2>
            <div className="space-y-2">
              {data.todos.items.map((t, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm ${t.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${t.is_completed ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                    {t.is_completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  {t.title_bn || t.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
          <p className="text-center text-amber-800">
            {data.today.studyMinutes >= 120
              ? '🌟 দারুণ! আজ অনেক পড়াশোনা হয়েছে!'
              : data.today.studyMinutes >= 60
              ? '👍 ভালো চলছে! আরেকটু পড়লে দুর্দান্ত হবে।'
              : data.today.studyMinutes > 0
              ? '📚 শুরু হয়েছে! আরো একটু সময় দিলে ভালো হবে।'
              : '⏰ আজ এখনো পড়াশোনা শুরু হয়নি।'}
          </p>
        </div>

        <p className="text-center text-xs text-gray-400">
          প্রতি ৫ মিনিটে স্বয়ংক্রিয়ভাবে আপডেট হয় • StudyTracker
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value }: { icon: any; color: string; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-2`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
}
