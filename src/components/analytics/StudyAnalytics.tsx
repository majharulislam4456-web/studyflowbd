import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Clock, Target, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { StudySession, Subject } from '@/hooks/useSupabaseData';
import { format, isSameDay, startOfDay } from 'date-fns';
import { 
  filterCurrentWeekSessions, getCurrentWeekDays, getLast4Weeks, 
  getWeekStartSaturday, getWeekEndFriday 
} from '@/utils/weekUtils';
import { calculateStreak } from '@/utils/streak';

interface StudyAnalyticsProps {
  sessions: StudySession[];
  subjects: Subject[];
}

const COLORS = [
  'hsl(168, 65%, 35%)', 'hsl(38, 92%, 55%)', 'hsl(145, 65%, 42%)',
  'hsl(200, 85%, 50%)', 'hsl(280, 70%, 50%)', 'hsl(340, 75%, 55%)',
];

const DAY_NAMES_BN = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র'];
const DAY_NAMES_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function StudyAnalytics({ sessions, subjects }: StudyAnalyticsProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const weekSessions = useMemo(() => filterCurrentWeekSessions(sessions), [sessions]);
  const streak = useMemo(() => calculateStreak(sessions), [sessions]);

  const dailyData = useMemo(() => {
    const days = getCurrentWeekDays();
    return days.map((day, i) => {
      const dayStart = startOfDay(day);
      const totalMinutes = weekSessions
        .filter(s => isSameDay(new Date(s.session_date), dayStart))
        .reduce((acc, s) => acc + s.duration, 0);
      return {
        date: isBn ? DAY_NAMES_BN[i] : DAY_NAMES_EN[i],
        dateFull: format(day, 'dd/MM'),
        minutes: totalMinutes,
        hours: Math.round(totalMinutes / 60 * 10) / 10,
      };
    });
  }, [weekSessions, isBn]);

  const weeklyData = useMemo(() => {
    const weeks = getLast4Weeks();
    return weeks.map(({ start, end, label, labelBn }) => {
      const totalMinutes = sessions
        .filter(s => { const d = new Date(s.session_date); return d >= start && d <= end; })
        .reduce((acc, s) => acc + s.duration, 0);
      return {
        week: isBn ? labelBn : label,
        dateRange: `${format(start, 'dd/MM')} - ${format(end, 'dd/MM')}`,
        minutes: totalMinutes,
        hours: Math.round(totalMinutes / 60 * 10) / 10,
      };
    });
  }, [sessions, isBn]);

  const subjectData = useMemo(() => {
    const subjectMap = new Map<string, number>();
    let generalTime = 0;
    weekSessions.forEach(session => {
      if (session.subject_id) {
        subjectMap.set(session.subject_id, (subjectMap.get(session.subject_id) || 0) + session.duration);
      } else { generalTime += session.duration; }
    });
    const data = subjects.filter(s => subjectMap.has(s.id)).map((subject, index) => ({
      name: (isBn && subject.name_bn) ? subject.name_bn : subject.name,
      value: subjectMap.get(subject.id) || 0,
      color: subject.color || COLORS[index % COLORS.length],
    }));
    if (generalTime > 0) data.push({ name: isBn ? 'সাধারণ' : 'General', value: generalTime, color: 'hsl(160, 20%, 50%)' });
    return data;
  }, [weekSessions, subjects, isBn]);

  const stats = useMemo(() => {
    const today = new Date();
    const todayMinutes = weekSessions.filter(s => isSameDay(new Date(s.session_date), today)).reduce((acc, s) => acc + s.duration, 0);
    const weekMinutes = weekSessions.reduce((acc, s) => acc + s.duration, 0);
    const totalSessions = weekSessions.length;
    const avgSessionLength = totalSessions > 0 ? Math.round(weekMinutes / totalSessions) : 0;
    return { todayMinutes, weekMinutes, totalSessions, avgSessionLength };
  }, [weekSessions]);

  const weekStart = getWeekStartSaturday();
  const weekEnd = getWeekEndFriday();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} ${isBn ? 'মিনিট' : 'min'}`;
    if (mins === 0) return `${hours} ${isBn ? 'ঘন্টা' : 'hr'}`;
    return `${hours}${isBn ? 'ঘ' : 'h'} ${mins}${isBn ? 'মি' : 'm'}`;
  };

  return (
    <div className="space-y-6">
      {/* Week indicator */}
      <div className="glass-card p-4 text-center bg-gradient-to-r from-primary/5 to-accent/5">
        <p className="text-sm font-semibold text-foreground font-bengali">
          📅 {isBn ? 'শনি' : 'Sat'} ({format(weekStart, 'dd/MM')}) → {isBn ? 'শুক্র' : 'Fri'} ({format(weekEnd, 'dd/MM')})
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-bengali">
          {isBn ? 'সব ডেটা প্রতি শনিবারে রিসেট হয় (সাপ্তাহিক তুলনা বাদে)' : 'All data resets every Saturday (except weekly comparison)'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-xl font-bold text-foreground">{formatTime(stats.todayMinutes)}</p>
          <p className="text-xs text-muted-foreground font-bengali">{isBn ? 'আজ পড়েছি' : 'Today'}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
          <p className="text-xl font-bold text-foreground">{formatTime(stats.weekMinutes)}</p>
          <p className="text-xs text-muted-foreground font-bengali">{isBn ? 'এই সপ্তাহে' : 'This week'}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-success" />
          <p className="text-xl font-bold text-foreground">{stats.totalSessions}</p>
          <p className="text-xs text-muted-foreground font-bengali">{isBn ? 'সেশন' : 'Sessions'}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-info" />
          <p className="text-xl font-bold text-foreground">{stats.avgSessionLength} {isBn ? 'মি' : 'm'}</p>
          <p className="text-xs text-muted-foreground font-bengali">{isBn ? 'গড় সেশন' : 'Avg session'}</p>
        </div>
        <div className="glass-card p-4 text-center col-span-2 md:col-span-1 bg-gradient-to-br from-destructive/5 to-warning/5">
          <Flame className="w-6 h-6 mx-auto mb-2 text-destructive" />
          <p className="text-xl font-bold text-foreground">{streak} 🔥</p>
          <p className="text-xs text-muted-foreground font-bengali">{isBn ? 'স্ট্রিক' : 'Streak'}</p>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-bengali">
          📊 {isBn ? 'এই সপ্তাহের পড়াশোনা (শনি-শুক্র)' : 'This Week Study (Sat-Fri)'}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(168, 65%, 35%)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(168, 65%, 35%)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-muted-foreground text-xs" />
              <YAxis className="text-muted-foreground text-xs" />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-card p-2 text-sm">
                      <p className="font-semibold font-bengali">{label}</p>
                      <p className="font-bengali">{formatTime(payload[0].value as number)}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Area type="monotone" dataKey="minutes" stroke="hsl(168, 65%, 35%)" fillOpacity={1} fill="url(#colorMinutes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly & Subject Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-bengali">
            📈 {isBn ? 'সাপ্তাহিক তুলনা' : 'Weekly Comparison'}
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" className="text-muted-foreground text-xs font-bengali" />
                <YAxis className="text-muted-foreground text-xs" />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-card p-2 text-sm">
                        <p className="text-xs text-muted-foreground">{data.dateRange}</p>
                        <p className="font-bengali font-semibold">{formatTime(payload[0].value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="minutes" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-bengali">
            📚 {isBn ? 'বিষয়ভিত্তিক সময় (এই সপ্তাহ)' : 'Subject Time (This Week)'}
          </h3>
          {subjectData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={subjectData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
                    {subjectData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-card p-2 text-sm">
                          <p className="font-semibold font-bengali">{data.name}</p>
                          <p className="font-bengali">{formatTime(data.value)}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground font-bengali">
              {isBn ? 'এই সপ্তাহে কোনো সেশন নেই' : 'No sessions this week'}
            </div>
          )}
          {subjectData.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {subjectData.map((item, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-bengali">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
