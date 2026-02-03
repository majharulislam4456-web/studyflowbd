import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import type { StudySession, Subject } from '@/hooks/useSupabaseData';
import { format, subDays, startOfDay, startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

interface StudyAnalyticsProps {
  sessions: StudySession[];
  subjects: Subject[];
}

const COLORS = [
  'hsl(168, 65%, 35%)',
  'hsl(38, 92%, 55%)',
  'hsl(145, 65%, 42%)',
  'hsl(200, 85%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(340, 75%, 55%)',
];

export function StudyAnalytics({ sessions, subjects }: StudyAnalyticsProps) {
  // Last 7 days data
  const dailyData = useMemo(() => {
    const today = new Date();
    const days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    return days.map(day => {
      const dayStart = startOfDay(day);
      const totalMinutes = sessions
        .filter(s => isSameDay(new Date(s.session_date), dayStart))
        .reduce((acc, s) => acc + s.duration, 0);

      return {
        date: format(day, 'EEE'),
        dateFull: format(day, 'dd/MM'),
        minutes: totalMinutes,
        hours: Math.round(totalMinutes / 60 * 10) / 10,
      };
    });
  }, [sessions]);

  // Last 4 weeks data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const weeks = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7), { weekStartsOn: 0 });
      const weekEnd = subDays(weekStart, -6);
      
      const totalMinutes = sessions
        .filter(s => {
          const sessionDate = new Date(s.session_date);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        })
        .reduce((acc, s) => acc + s.duration, 0);

      weeks.push({
        week: `সপ্তাহ ${4 - i}`,
        weekEn: `Week ${4 - i}`,
        minutes: totalMinutes,
        hours: Math.round(totalMinutes / 60 * 10) / 10,
      });
    }
    
    return weeks;
  }, [sessions]);

  // Subject-wise data
  const subjectData = useMemo(() => {
    const subjectMap = new Map<string, number>();
    let generalTime = 0;

    sessions.forEach(session => {
      if (session.subject_id) {
        const current = subjectMap.get(session.subject_id) || 0;
        subjectMap.set(session.subject_id, current + session.duration);
      } else {
        generalTime += session.duration;
      }
    });

    const data = subjects
      .filter(s => subjectMap.has(s.id))
      .map((subject, index) => ({
        name: subject.name_bn || subject.name,
        value: subjectMap.get(subject.id) || 0,
        color: subject.color || COLORS[index % COLORS.length],
      }));

    if (generalTime > 0) {
      data.push({
        name: 'সাধারণ',
        value: generalTime,
        color: 'hsl(160, 20%, 50%)',
      });
    }

    return data;
  }, [sessions, subjects]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    const todayMinutes = sessions
      .filter(s => isSameDay(new Date(s.session_date), today))
      .reduce((acc, s) => acc + s.duration, 0);

    const weekMinutes = sessions
      .filter(s => new Date(s.session_date) >= subDays(today, 7))
      .reduce((acc, s) => acc + s.duration, 0);

    const totalSessions = sessions.length;
    const avgSessionLength = totalSessions > 0 
      ? Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / totalSessions) 
      : 0;

    return { todayMinutes, weekMinutes, totalSessions, avgSessionLength };
  }, [sessions]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} মিনিট`;
    if (mins === 0) return `${hours} ঘন্টা`;
    return `${hours}ঘ ${mins}মি`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{formatTime(stats.todayMinutes)}</p>
          <p className="text-xs text-muted-foreground font-bengali">আজ পড়েছি</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-foreground">{formatTime(stats.weekMinutes)}</p>
          <p className="text-xs text-muted-foreground font-bengali">এই সপ্তাহে</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-success" />
          <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
          <p className="text-xs text-muted-foreground font-bengali">মোট সেশন</p>
        </div>
        <div className="glass-card p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-info" />
          <p className="text-2xl font-bold text-foreground">{stats.avgSessionLength} মি</p>
          <p className="text-xs text-muted-foreground font-bengali">গড় সেশন</p>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 font-bengali">
          📊 দৈনিক পড়াশোনা (গত ৭ দিন)
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
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card p-2 text-sm">
                        <p className="font-bengali">{formatTime(payload[0].value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="minutes" 
                stroke="hsl(168, 65%, 35%)" 
                fillOpacity={1} 
                fill="url(#colorMinutes)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly & Subject Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-bengali">
            📈 সাপ্তাহিক তুলনা
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" className="text-muted-foreground text-xs font-bengali" />
                <YAxis className="text-muted-foreground text-xs" />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-2 text-sm">
                          <p className="font-bengali">{formatTime(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="minutes" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 font-bengali">
            📚 বিষয়ভিত্তিক সময়
          </h3>
          {subjectData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
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
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground font-bengali">
              এখনো কোনো সেশন নেই
            </div>
          )}
          {/* Legend */}
          {subjectData.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {subjectData.map((item, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
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
