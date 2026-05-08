export interface FestivalTheme {
  id: string;
  name: string;
  emoji: string;
  banner: string;
  primary: string; // HSL "H S% L%"
  accent: string;
  bgGradient?: string; // optional CSS gradient
}

export const FESTIVAL_THEMES: FestivalTheme[] = [
  { id: 'default', name: 'ডিফল্ট', emoji: '✨', banner: '', primary: '168 65% 35%', accent: '168 30% 90%' },
  { id: 'eid_fitr', name: 'ঈদুল ফিতর', emoji: '🌙', banner: 'ঈদ মোবারক! ঈদুল ফিতরের শুভেচ্ছা।', primary: '142 60% 35%', accent: '45 80% 60%', bgGradient: 'linear-gradient(135deg, hsl(142 40% 15%), hsl(45 30% 20%))' },
  { id: 'eid_adha', name: 'ঈদুল আজহা', emoji: '🐑', banner: 'ঈদুল আজহার শুভেচ্ছা।', primary: '142 50% 28%', accent: '30 40% 45%', bgGradient: 'linear-gradient(135deg, hsl(142 35% 12%), hsl(30 25% 18%))' },
  { id: 'independence', name: 'স্বাধীনতা দিবস (২৬ মার্চ)', emoji: '🇧🇩', banner: 'মহান স্বাধীনতা দিবসের শুভেচ্ছা।', primary: '142 70% 35%', accent: '0 75% 50%', bgGradient: 'linear-gradient(135deg, hsl(142 40% 15%), hsl(0 50% 20%))' },
  { id: 'victory', name: 'বিজয় দিবস (১৬ ডিসেম্বর)', emoji: '🏵️', banner: 'মহান বিজয় দিবসের শুভেচ্ছা।', primary: '142 70% 35%', accent: '0 75% 50%', bgGradient: 'linear-gradient(135deg, hsl(142 40% 15%), hsl(0 50% 20%))' },
  { id: 'pohela_boishakh', name: 'পহেলা বৈশাখ', emoji: '🎨', banner: 'শুভ নববর্ষ!', primary: '0 70% 45%', accent: '45 85% 55%', bgGradient: 'linear-gradient(135deg, hsl(0 50% 20%), hsl(45 40% 25%))' },
  { id: 'shaheed', name: 'শহীদ দিবস (২১ ফেব্রুয়ারি)', emoji: '🕯️', banner: 'অমর একুশে — ভাষা শহীদদের প্রতি শ্রদ্ধাঞ্জলি।', primary: '0 0% 60%', accent: '0 60% 45%', bgGradient: 'linear-gradient(135deg, hsl(0 0% 8%), hsl(0 0% 15%))' },
  { id: 'muharram', name: 'মহররম', emoji: '🕌', banner: 'মহররমের পবিত্রতায় কল্যাণ হোক।', primary: '200 50% 35%', accent: '200 30% 60%', bgGradient: 'linear-gradient(135deg, hsl(200 40% 12%), hsl(200 30% 18%))' },
  { id: 'shab_e_barat', name: 'শবে বরাত', emoji: '🌟', banner: 'শবে বরাতের পবিত্রতা সকলের জীবনে নেমে আসুক।', primary: '260 50% 45%', accent: '45 80% 60%', bgGradient: 'linear-gradient(135deg, hsl(260 40% 15%), hsl(260 30% 20%))' },
];

export function applyFestivalTheme(themeId: string) {
  const t = FESTIVAL_THEMES.find(x => x.id === themeId) || FESTIVAL_THEMES[0];
  const root = document.documentElement;
  root.style.setProperty('--primary', t.primary);
  root.style.setProperty('--primary-foreground', '0 0% 100%');
  root.style.setProperty('--accent', t.accent);
  if (t.bgGradient && t.id !== 'default') {
    root.style.setProperty('--festival-bg', t.bgGradient);
  } else {
    root.style.removeProperty('--festival-bg');
  }
}