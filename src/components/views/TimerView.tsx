import { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Moon, X, Coffee, Headphones, ImagePlus, Minimize2, Settings, Timer, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { useGlobalStopwatch } from '@/contexts/StopwatchContext';
import { PomodoroSettings } from '@/components/pomodoro/PomodoroSettings';
import { TimerPresets } from '@/components/pomodoro/TimerPresets';
import { TimerDisplay } from '@/components/timer/TimerDisplay';
import { LiveClock } from '@/components/timer/LiveClock';
import { cn } from '@/lib/utils';
import { playStart, playPause, playTimerAlarm } from '@/utils/sounds';

const SCENES = [
  { id: 'city-rain', emoji: '🌧️', label: 'City Rain', labelBn: 'শহরে বৃষ্টি', gradient: 'from-slate-800 via-blue-900 to-slate-900', particleType: 'rain' as const, bgImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80' },
  { id: 'sunset-city', emoji: '🌇', label: 'Sunset City', labelBn: 'সূর্যাস্তের শহর', gradient: 'from-orange-900 via-pink-800 to-purple-900', particleType: 'sparkle' as const, bgImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80' },
  { id: 'night-sky', emoji: '🌙', label: 'Night Sky', labelBn: 'রাতের আকাশ', gradient: 'from-indigo-950 via-purple-900 to-slate-950', particleType: 'stars' as const, bgImage: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80' },
  { id: 'cozy-cafe', emoji: '☕', label: 'Cozy Cafe', labelBn: 'কফি শপ', gradient: 'from-stone-800 via-yellow-900/80 to-stone-900', particleType: 'sparkle' as const, bgImage: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1920&q=80' },
  { id: 'ocean-view', emoji: '🌊', label: 'Ocean View', labelBn: 'সমুদ্র', gradient: 'from-cyan-900 via-blue-800 to-teal-900', particleType: 'bubbles' as const, bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80' },
  { id: 'forest', emoji: '🌿', label: 'Forest', labelBn: 'বন', gradient: 'from-emerald-900 via-green-800 to-teal-900', particleType: 'leaves' as const, bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80' },
  { id: 'library', emoji: '📚', label: 'Library', labelBn: 'লাইব্রেরি', gradient: 'from-stone-800 via-stone-700 to-stone-900', particleType: 'sparkle' as const, bgImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80' },
  { id: 'mountain', emoji: '🏔️', label: 'Mountain', labelBn: 'পাহাড়', gradient: 'from-slate-700 via-blue-800 to-indigo-900', particleType: 'sparkle' as const, bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80' },
];

type TimerMode = 'pomodoro' | 'timer' | 'stopwatch';
type TimerStyle = 'normal' | 'flipping' | 'futuristic' | 'realwatch' | 'funny';

const TIMER_STYLES: { id: TimerStyle; label: string; labelBn: string; emoji: string }[] = [
  { id: 'normal', label: 'Normal', labelBn: 'সাধারণ', emoji: '⏰' },
  { id: 'flipping', label: 'Flipping', labelBn: 'ফ্লিপিং', emoji: '🔄' },
  { id: 'futuristic', label: 'Futuristic', labelBn: 'ফিউচারিস্টিক', emoji: '🚀' },
  { id: 'realwatch', label: 'Real Watch', labelBn: 'ঘড়ি', emoji: '⌚' },
  { id: 'funny', label: 'Funny', labelBn: 'মজার', emoji: '🤪' },
];

function Particles({ type }: { type: string }) {
  const particles = useMemo(() => Array.from({ length: 35 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 2 + Math.random() * 4, delay: Math.random() * 8,
    duration: 3 + Math.random() * 6, opacity: 0.1 + Math.random() * 0.4,
  })), []);

  const getAnimation = () => {
    switch (type) {
      case 'rain': return { css: `@keyframes rainFall { 0% { transform: translateY(-20px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }`, render: (p: any) => <div key={p.id} className="absolute w-[1px] bg-blue-300/40 rounded-full" style={{ left: `${p.x}%`, height: `${10 + p.size * 4}px`, animation: `rainFall ${1 + p.duration * 0.3}s linear infinite`, animationDelay: `${p.delay}s`, opacity: p.opacity }} /> };
      case 'stars': return { css: `@keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }`, render: (p: any) => <div key={p.id} className="absolute rounded-full bg-white" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, animation: `twinkle ${2 + p.duration}s ease-in-out infinite`, animationDelay: `${p.delay}s`, opacity: p.opacity * 0.5 }} /> };
      case 'leaves': return { css: `@keyframes leafFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`, render: (p: any) => <div key={p.id} className="absolute text-lg" style={{ left: `${p.x}%`, animation: `leafFall ${6 + p.duration}s ease-in-out infinite`, animationDelay: `${p.delay}s`, opacity: p.opacity * 0.6 }}>{'🍃🌿🍂🌱'[p.id % 4]}</div> };
      default: return { css: `@keyframes sparkleFloat { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; } 50% { transform: translateY(-15px) scale(1.3); opacity: 0.6; } }`, render: (p: any) => <div key={p.id} className="absolute rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, background: `radial-gradient(circle, rgba(255,220,150,${p.opacity}) 0%, transparent 70%)`, animation: `sparkleFloat ${4 + p.duration}s ease-in-out infinite`, animationDelay: `${p.delay}s` }} /> };
    }
  };

  const anim = getAnimation();
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.slice(0, type === 'leaves' ? 20 : 35).map(anim.render)}
      <style>{anim.css}</style>
    </div>
  );
}

// TimerDisplay is now imported from @/components/timer/TimerDisplay

export function TimerView() {
  const { language } = useLanguage();
  const pomodoro = useGlobalPomodoro();
  const stopwatch = useGlobalStopwatch();
  const isBn = language === 'bn';

  const [mode, setMode] = useState<TimerMode>(() => {
    return (localStorage.getItem('timerMode') as TimerMode) || 'pomodoro';
  });
  const [timerStyle, setTimerStyle] = useState<TimerStyle>(() => {
    return (localStorage.getItem('timerStyle') as TimerStyle) || 'normal';
  });
  const [selectedScene, setSelectedScene] = useState(SCENES[0]);
  const [deepStudyMode, setDeepStudyMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutube, setShowYoutube] = useState(false);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [musicMinimized, setMusicMinimized] = useState(true);
  const [showClock, setShowClock] = useState(() => localStorage.getItem('timerShowClock') !== 'false');
  const [clockFormat, setClockFormat] = useState<'12h' | '24h'>(() => (localStorage.getItem('timerClockFormat') as '12h' | '24h') || '12h');

  useEffect(() => { localStorage.setItem('timerShowClock', String(showClock)); }, [showClock]);
  useEffect(() => { localStorage.setItem('timerClockFormat', clockFormat); }, [clockFormat]);

  // Custom countdown timer state
  const [countdownMinutes, setCountdownMinutes] = useState(25);
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { localStorage.setItem('timerMode', mode); }, [mode]);
  useEffect(() => { localStorage.setItem('timerStyle', timerStyle); }, [timerStyle]);

  // Background loading
  useEffect(() => {
    if (customBg) { setBgLoaded(true); return; }
    setBgLoaded(false);
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.src = selectedScene.bgImage;
  }, [selectedScene, customBg]);

  // Countdown timer logic
  useEffect(() => {
    if (isCountdownRunning && countdownTime > 0) {
      countdownRef.current = setInterval(() => setCountdownTime(t => t - 1), 1000);
    } else if (countdownTime === 0 && isCountdownRunning) {
      setIsCountdownRunning(false);
      // Play 10 second alarm
      let alarmCount = 0;
      const alarmInterval = setInterval(() => {
        playTimerAlarm();
        alarmCount++;
        if (alarmCount >= 5) clearInterval(alarmInterval);
      }, 2000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [isCountdownRunning, countdownTime]);

  // Deep study mode
  useEffect(() => {
    if (deepStudyMode && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else if (!deepStudyMode && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [deepStudyMode]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    switch (mode) {
      case 'pomodoro': return pomodoro.formattedTime;
      case 'timer': return formatTime(countdownTime);
      case 'stopwatch': return stopwatch.formattedTime;
    }
  };

  const isActive = mode === 'pomodoro' ? pomodoro.isRunning : mode === 'timer' ? isCountdownRunning : stopwatch.isRunning;

  const handlePlayPause = () => {
    switch (mode) {
      case 'pomodoro':
        if (pomodoro.isRunning) { playPause(); pomodoro.pause(); }
        else { playStart(); pomodoro.start(); }
        break;
      case 'timer':
        if (isCountdownRunning) { playPause(); setIsCountdownRunning(false); }
        else {
          if (countdownTime === 0) setCountdownTime(countdownMinutes * 60);
          playStart(); setIsCountdownRunning(true);
        }
        break;
      case 'stopwatch':
        if (stopwatch.isRunning) { playPause(); stopwatch.pause(); }
        else { playStart(); stopwatch.start(); }
        break;
    }
  };

  const handleReset = () => {
    switch (mode) {
      case 'pomodoro': pomodoro.reset(); break;
      case 'timer': setIsCountdownRunning(false); setCountdownTime(0); break;
      case 'stopwatch': stopwatch.reset(); break;
    }
  };

  const getProgress = () => {
    if (mode === 'pomodoro') return pomodoro.progress;
    if (mode === 'timer' && countdownMinutes > 0) return ((countdownMinutes * 60 - countdownTime) / (countdownMinutes * 60)) * 100;
    return 0;
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);
  const bgUrl = customBg || selectedScene.bgImage;

  return (
    <div ref={containerRef} className={cn(
      "relative min-h-[85vh] rounded-2xl overflow-hidden transition-all duration-700",
      deepStudyMode && "fixed inset-0 z-[100] min-h-screen rounded-none"
    )} style={{ backgroundImage: bgLoaded ? `url(${bgUrl})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Gradient fallback */}
      <div className={cn("absolute inset-0 transition-opacity duration-700", bgLoaded ? "opacity-0" : "opacity-100", `bg-gradient-to-br ${selectedScene.gradient}`)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50 pointer-events-none" />
      <Particles type={selectedScene.particleType} />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Timer className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white/90">{isBn ? 'টাইমার' : 'Timer'}</h1>
            <p className="text-white/40 text-xs">{isBn ? 'মনোযোগ দিয়ে পড়ুন' : 'Focus & Flow'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSettings(!showSettings)}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/60 hover:text-white transition-all">
            <Settings className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
            <Moon className="w-3.5 h-3.5 text-white/60" />
            <Switch checked={deepStudyMode} onCheckedChange={setDeepStudyMode} className="scale-75" />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="relative z-20 mx-4 mb-4 p-4 bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 animate-fade-in max-w-lg">
          <h3 className="text-white/80 text-sm font-semibold mb-3">{isBn ? 'সেটিংস' : 'Settings'}</h3>
          
          <div className="space-y-4">
            {/* Mode */}
            <div>
              <p className="text-white/50 text-xs mb-2 uppercase tracking-wider">{isBn ? 'মোড' : 'Mode'}</p>
              <div className="flex gap-2">
                {([
                  { id: 'pomodoro' as TimerMode, label: isBn ? 'পমোডোরো' : 'Pomodoro', icon: Coffee },
                  { id: 'timer' as TimerMode, label: isBn ? 'টাইমার' : 'Timer', icon: Clock },
                  { id: 'stopwatch' as TimerMode, label: isBn ? 'স্টপওয়াচ' : 'Stopwatch', icon: Zap },
                ]).map(m => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all border",
                      mode === m.id ? "bg-white/15 text-white border-white/20" : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                    )}>
                    <m.icon className="w-3.5 h-3.5" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Style */}
            <div>
              <p className="text-white/50 text-xs mb-2 uppercase tracking-wider">{isBn ? 'স্টাইল' : 'Style'}</p>
              <div className="flex gap-1.5 flex-wrap">
                {TIMER_STYLES.map(s => (
                  <button key={s.id} onClick={() => setTimerStyle(s.id)}
                    className={cn("flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all border",
                      timerStyle === s.id ? "bg-white/15 text-white border-white/20" : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                    )}>
                    <span>{s.emoji}</span>
                    <span>{isBn ? s.labelBn : s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Timer duration for countdown mode */}
            {mode === 'timer' && (
              <div>
                <p className="text-white/50 text-xs mb-2">{isBn ? 'সময় (মিনিট)' : 'Duration (minutes)'}</p>
                <div className="flex gap-2">
                  {[5, 10, 15, 25, 30, 45, 60].map(m => (
                    <button key={m} onClick={() => { setCountdownMinutes(m); if (!isCountdownRunning) setCountdownTime(m * 60); }}
                      className={cn("px-2.5 py-1.5 rounded-lg text-xs border transition-all",
                        countdownMinutes === m ? "bg-white/15 text-white border-white/20" : "bg-white/5 text-white/40 border-white/5"
                      )}>{m}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Pomodoro Settings */}
            {mode === 'pomodoro' && (
              <div className="pt-1">
                <PomodoroSettings />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scene selector */}
      <div className="relative z-10 flex items-center gap-1.5 px-4 md:px-6 overflow-x-auto pb-3 scrollbar-hide">
        <input ref={bgInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setCustomBg(r.result as string); r.readAsDataURL(f); } }} className="hidden" />
        <button onClick={() => bgInputRef.current?.click()}
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border",
            customBg ? "bg-white/15 text-white border-white/20" : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10")}>
          <ImagePlus className="w-3.5 h-3.5" />
          <span>{isBn ? 'ওয়ালপেপার' : 'Wallpaper'}</span>
        </button>
        {customBg && (
          <button onClick={() => setCustomBg(null)} className="px-2 py-1.5 rounded-full text-xs bg-red-500/20 text-white/60 hover:bg-red-500/40 border border-red-500/20">
            <X className="w-3 h-3" />
          </button>
        )}
        {SCENES.map(scene => (
          <button key={scene.id} onClick={() => { setSelectedScene(scene); setCustomBg(null); }}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border",
              selectedScene.id === scene.id ? "bg-white/15 text-white border-white/20" : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10")}>
            <span>{scene.emoji}</span>
            <span>{isBn ? scene.labelBn : scene.label}</span>
          </button>
        ))}
      </div>

      {/* Center Timer */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-16">
        {/* Mode label */}
        <div className="mb-4 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
          {mode === 'pomodoro' && <Coffee className="w-3.5 h-3.5 text-white/60" />}
          {mode === 'timer' && <Clock className="w-3.5 h-3.5 text-white/60" />}
          {mode === 'stopwatch' && <Zap className="w-3.5 h-3.5 text-white/60" />}
          <span className="text-white/60 text-xs uppercase tracking-wider">
            {mode === 'pomodoro' ? (pomodoro.phase === 'focus' ? (isBn ? 'ফোকাস' : 'Focus') : pomodoro.phase === 'break' ? (isBn ? 'বিরতি' : 'Break') : pomodoro.phase === 'longBreak' ? (isBn ? 'দীর্ঘ বিরতি' : 'Long Break') : (isBn ? 'পমোডোরো' : 'Pomodoro'))
            : mode === 'timer' ? (isBn ? 'কাউন্টডাউন' : 'Countdown')
            : (isBn ? 'স্টপওয়াচ' : 'Stopwatch')}
          </span>
          {mode === 'pomodoro' && pomodoro.completedSessions > 0 && (
            <span className="text-white/40 text-xs">#{pomodoro.completedSessions + 1}</span>
          )}
        </div>

        {/* Timer presets for pomodoro idle */}
        {mode === 'pomodoro' && pomodoro.phase === 'idle' && (
          <div className="mb-6">
            <TimerPresets selectedDuration={pomodoro.focusDuration} onSelectDuration={pomodoro.setFocusDuration} />
          </div>
        )}

        {/* Timer Display */}
        <div className="mb-8">
          {timerStyle === 'realwatch' ? (
            <TimerDisplay time={getCurrentTime()} style={timerStyle} isRunning={isActive} mode={mode} progress={getProgress()} />
          ) : (
            <TimerDisplay time={getCurrentTime()} style={timerStyle} isRunning={isActive} mode={mode} progress={getProgress()} />
          )}
        </div>

        {/* Running indicator */}
        {isActive && timerStyle !== 'funny' && (
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400/80 text-xs">{isBn ? 'সেশন চলছে' : 'Session Active'}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button onClick={handleReset} size="lg" variant="ghost"
            className="rounded-full w-12 h-12 text-white/40 hover:text-white hover:bg-white/10 border border-white/10">
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button onClick={handlePlayPause} size="lg"
            className={cn("rounded-full w-16 h-16 text-white transition-all shadow-2xl",
              isActive ? "bg-white/20 hover:bg-white/30 border border-white/20" : "bg-white/15 hover:bg-white/25 border border-white/10")}>
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
          {mode === 'pomodoro' && (
            <Button onClick={pomodoro.skip} disabled={pomodoro.phase === 'idle'} size="lg" variant="ghost"
              className="rounded-full w-12 h-12 text-white/40 hover:text-white hover:bg-white/10 border border-white/10">
              <SkipForward className="w-5 h-5" />
            </Button>
          )}
          {mode === 'pomodoro' && (pomodoro.isRunning || pomodoro.phase !== 'idle') && (
            <Button onClick={pomodoro.minimize} size="lg" variant="ghost"
              className="rounded-full w-12 h-12 text-white/40 hover:text-white hover:bg-white/10 border border-white/10">
              <Minimize2 className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Pomodoro session dots */}
        {mode === 'pomodoro' && (
          <div className="flex items-center gap-3 mt-6 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={cn("w-3 h-3 rounded-full transition-all",
                i < (pomodoro.completedSessions % 4) ? "bg-white/80 shadow-lg" : "bg-white/15"
              )} />
            ))}
            <span className="text-white/40 text-xs ml-1">{pomodoro.completedSessions} {isBn ? 'সেশন' : 'sessions'}</span>
          </div>
        )}
      </div>

      {/* Music Player - Bottom right */}
      <div className={cn("absolute z-20 transition-all duration-300", musicMinimized ? "bottom-4 right-4" : "bottom-4 right-4 w-80 max-w-[calc(100%-2rem)]")}>
        {musicMinimized ? (
          <button onClick={() => setMusicMinimized(false)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all shadow-lg">
            <Headphones className="w-4 h-4" />
          </button>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-3 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-white/50" />
                <span className="text-white/50 text-xs">{isBn ? 'মিউজিক' : 'Music'}</span>
              </div>
              <button onClick={() => setMusicMinimized(true)} className="text-white/40 hover:text-white">
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-2">
              <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="YouTube URL..."
                className="bg-white/5 border-white/10 text-white text-xs h-8 placeholder:text-white/20" />
              <Button size="sm" variant="ghost" onClick={() => setShowYoutube(!!youtubeUrl)}
                className="text-white/60 hover:text-white h-8 px-2 border border-white/10">
                <Play className="w-3 h-3" />
              </Button>
            </div>
            {showYoutube && embedUrl && (
              <div className="mt-2 rounded-lg overflow-hidden aspect-video">
                <iframe src={embedUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
