import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { startOfDay, isSameDay, format } from 'date-fns';
import { getCurrentWeekDays, filterCurrentWeekSessions, getWeekStartSaturday, getWeekEndFriday } from '@/utils/weekUtils';
import type { StudySession } from '@/hooks/useSupabaseData';

interface WeeklyStudyChartProps {
  sessions: StudySession[];
}

const DAY_NAMES_BN = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র'];
const DAY_NAMES_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function WeeklyStudyChart({ sessions }: WeeklyStudyChartProps) {
  const { language } = useLanguage();

  const weekSessions = useMemo(() => filterCurrentWeekSessions(sessions), [sessions]);

  const dailyData = useMemo(() => {
    const days = getCurrentWeekDays();
    return days.map((day, i) => {
      const dayStart = startOfDay(day);
      const totalMinutes = weekSessions
        .filter(s => isSameDay(new Date(s.session_date), dayStart))
        .reduce((acc, s) => acc + s.duration, 0);

      return {
        day: language === 'bn' ? DAY_NAMES_BN[i] : DAY_NAMES_EN[i],
        minutes: totalMinutes,
        hours: Math.round(totalMinutes / 60 * 10) / 10,
      };
    });
  }, [weekSessions, language]);

  const totalWeekMinutes = dailyData.reduce((acc, d) => acc + d.minutes, 0);
  const avgMinutes = Math.round(totalWeekMinutes / 7);
  const weekStart = getWeekStartSaturday();
  const weekEnd = getWeekEndFriday();

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}${language === 'bn' ? 'মি' : 'm'}`;
    if (m === 0) return `${h}${language === 'bn' ? 'ঘ' : 'h'}`;
    return `${h}${language === 'bn' ? 'ঘ' : 'h'} ${m}${language === 'bn' ? 'মি' : 'm'}`;
  };

  return (
    <div className="glass-card p-5 animate-fade-in-up hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 font-bengali">
          <TrendingUp className="w-5 h-5 text-primary" />
          {language === 'bn' ? 'সাপ্তাহিক পড়াশোনা' : 'Weekly Study'}
        </h3>
        <div className="text-xs text-muted-foreground font-bengali">
          {format(weekStart, 'dd/MM')} - {format(weekEnd, 'dd/MM')} | {language === 'bn' ? 'গড়:' : 'Avg:'} {formatTime(avgMinutes)}/{language === 'bn' ? 'দিন' : 'day'}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData} barCategoryGap="20%">
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              width={35}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
                      <p className="font-semibold text-foreground font-bengali">
                        {formatTime(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="minutes" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
