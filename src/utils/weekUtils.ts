import { startOfDay, subDays, isBefore, isAfter, eachDayOfInterval } from 'date-fns';

/**
 * Custom week: Saturday to Friday
 * Returns the start (Saturday) of the current custom week
 */
export function getWeekStartSaturday(date: Date = new Date()): Date {
  const d = startOfDay(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // Days since last Saturday
  const diff = day === 6 ? 0 : day + 1;
  return subDays(d, diff);
}

/**
 * Returns the end (Friday) of the current custom week
 */
export function getWeekEndFriday(date: Date = new Date()): Date {
  const start = getWeekStartSaturday(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Check if a date is within the current Sat-Fri week
 */
export function isInCurrentWeek(date: Date): boolean {
  const start = getWeekStartSaturday();
  const end = getWeekEndFriday();
  const d = new Date(date);
  return d >= start && d <= end;
}

/**
 * Get the days of the current Sat-Fri week
 */
export function getCurrentWeekDays(): Date[] {
  const start = getWeekStartSaturday();
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return eachDayOfInterval({ start, end });
}

/**
 * Filter sessions to only those in the current Sat-Fri week
 */
export function filterCurrentWeekSessions<T extends { session_date: string }>(sessions: T[]): T[] {
  const start = getWeekStartSaturday();
  const end = getWeekEndFriday();
  return sessions.filter(s => {
    const d = new Date(s.session_date);
    return d >= start && d <= end;
  });
}

/**
 * Get the last 4 custom weeks (Sat-Fri) for comparison
 */
export function getLast4Weeks(): { start: Date; end: Date; label: string; labelBn: string }[] {
  const weeks = [];
  for (let i = 0; i < 4; i++) {
    const refDate = subDays(new Date(), i * 7);
    const start = getWeekStartSaturday(refDate);
    const end = getWeekEndFriday(refDate);
    weeks.unshift({
      start,
      end,
      label: `Week ${4 - i}`,
      labelBn: `সপ্তাহ ${4 - i}`,
    });
  }
  return weeks;
}
