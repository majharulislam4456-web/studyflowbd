import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { subDays, startOfDay, eachDayOfInterval, isSameDay, format } from 'date-fns';
import type { StudySession } from '@/hooks/useSupabaseData';

interface WeeklyStudyChartProps {
  sessions: StudySession[];
}

export function WeeklyStudyChart({ sessions }: WeeklyStudyChartProps) {
  const { language } = useLanguage();

  const dailyData = useMemo(() => {
    const today = new Date();
    const days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    const dayNamesBn = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];

    return days.map(day => {
      const dayStart = startOfDay(day);
      const totalMinutes = sessions
        .filter(s => isSameDay(new Date(s.session_date), dayStart))
        .reduce((acc, s) => acc + s.duration, 0);

      const dayIndex = day.getDay();
      return {
        day: language === 'bn' ? dayNamesBn[dayIndex] : format(day, 'EEE'),
        minutes: totalMinutes,
        hours: Math.round(totalMinutes / 60 * 10) / 10,
      };
    });
  }, [sessions, language]);

  const totalWeekMinutes = dailyData.reduce((acc, d) => acc + d.minutes, 0);
  const avgMinutes = Math.round(totalWeekMinutes / 7);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}${language === 'bn' ? 'মি' : 'm'}`;
    if (m === 0) return `${h}${language === 'bn' ? 'ঘ' : 'h'}`;
    return `${h}${language === 'bn' ? 'ঘ' : 'h'} ${m}${language === 'bn' ? 'মি' : 'm'}`;
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 font-bengali">
          <TrendingUp className="w-5 h-5 text-primary" />
          {language === 'bn' ? 'সাপ্তাহিক পড়াশোনা' : 'Weekly Study'}
        </h3>
        <div className="text-xs text-muted-foreground font-bengali">
          {language === 'bn' ? 'গড়:' : 'Avg:'} {formatTime(avgMinutes)}/{language === 'bn' ? 'দিন' : 'day'}
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
