import { startOfDay, subDays, isSameDay } from 'date-fns';

/**
 * Calculate streak from study sessions.
 * Streak increases by 1 for each consecutive day with a session.
 * Missing one day resets streak to 0.
 */
export function calculateStreak(sessions: { session_date: string; duration: number }[]): number {
  if (sessions.length === 0) return 0;

  const today = startOfDay(new Date());
  
  // Get unique dates with study activity
  const activeDates = new Set<string>();
  sessions.forEach(s => {
    if (s.duration > 0) {
      activeDates.add(startOfDay(new Date(s.session_date)).toISOString());
    }
  });

  // Check if today has activity
  const todayHasActivity = activeDates.has(today.toISOString());
  
  // Start counting from today or yesterday
  let streak = 0;
  let checkDate = todayHasActivity ? today : subDays(today, 1);
  
  // If neither today nor yesterday has activity, streak is 0
  if (!todayHasActivity && !activeDates.has(checkDate.toISOString())) {
    return 0;
  }

  // Count consecutive days backward
  while (activeDates.has(startOfDay(checkDate).toISOString())) {
    streak++;
    checkDate = subDays(checkDate, 1);
  }

  return streak;
}
