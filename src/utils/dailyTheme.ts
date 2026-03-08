// Auto-rotate theme color daily — no brown/amber tones
const themeColors = [
  { id: 'teal', hue: '168' },
  { id: 'blue', hue: '221' },
  { id: 'purple', hue: '262' },
  { id: 'pink', hue: '330' },
  { id: 'green', hue: '142' },
  { id: 'indigo', hue: '245' },
  { id: 'cyan', hue: '190' },
  { id: 'violet', hue: '280' },
  { id: 'emerald', hue: '155' },
  { id: 'rose', hue: '345' },
  { id: 'sky', hue: '200' },
  { id: 'fuchsia', hue: '295' },
];

export function getDailyTheme(): typeof themeColors[0] {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return themeColors[dayOfYear % themeColors.length];
}

export function applyDailyTheme() {
  const theme = getDailyTheme();
  document.documentElement.style.setProperty('--primary', `${theme.hue} 65% 35%`);
  document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
  document.documentElement.style.setProperty('--accent', `${theme.hue} 30% 90%`);
}
