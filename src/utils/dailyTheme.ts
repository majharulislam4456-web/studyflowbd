// Auto-rotate theme color daily
const themeColors = [
  { id: 'teal', hue: '168' },
  { id: 'blue', hue: '221' },
  { id: 'purple', hue: '262' },
  { id: 'pink', hue: '330' },
  { id: 'orange', hue: '25' },
  { id: 'green', hue: '142' },
  { id: 'red', hue: '0' },
  { id: 'amber', hue: '45' },
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
