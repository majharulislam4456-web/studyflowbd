import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Pause, RotateCcw, Moon, X, Coffee, Brain, Headphones, ImagePlus, Volume2, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { cn } from '@/lib/utils';

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

function Particles({ type }: { type: string }) {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 2 + Math.random() * 4, delay: Math.random() * 8,
    duration: 3 + Math.random() * 6, opacity: 0.1 + Math.random() * 0.4,
  })), []);

  if (type === 'rain') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div key={p.id} className="absolute w-[1px] bg-blue-300/40 rounded-full"
            style={{ left: `${p.x}%`, height: `${10 + p.size * 4}px`,
              animation: `rainFall ${1 + p.duration * 0.3}s linear infinite`, animationDelay: `${p.delay}s`, opacity: p.opacity }} />
        ))}
        <style>{`@keyframes rainFall { 0% { transform: translateY(-20px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }`}</style>
      </div>
    );
  }
  if (type === 'stars') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full bg-white"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`,
              animation: `twinkle ${2 + p.duration}s ease-in-out infinite`, animationDelay: `${p.delay}s`,
              opacity: p.opacity * 0.5, boxShadow: `0 0 ${p.size * 2}px ${p.size}px rgba(255,255,255,${p.opacity * 0.3})` }} />
        ))}
        <style>{`@keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }`}</style>
      </div>
    );
  }
  if (type === 'leaves') {
    const leafEmojis = ['🍃', '🌿', '🍂', '🌱'];
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(0, 20).map(p => (
          <div key={p.id} className="absolute text-lg"
            style={{ left: `${p.x}%`, animation: `leafFall ${6 + p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`, opacity: p.opacity * 0.6 }}>
            {leafEmojis[p.id % leafEmojis.length]}
          </div>
        ))}
        <style>{`@keyframes leafFall { 0% { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 0; } 10% { opacity: 0.6; } 50% { transform: translateY(50vh) rotate(180deg) translateX(40px); } 100% { transform: translateY(100vh) rotate(360deg) translateX(-20px); opacity: 0; } }`}</style>
      </div>
    );
  }
  if (type === 'bubbles') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(0, 25).map(p => (
          <div key={p.id} className="absolute rounded-full border border-cyan-300/20 bg-cyan-200/5"
            style={{ left: `${p.x}%`, width: `${p.size * 3}px`, height: `${p.size * 3}px`,
              animation: `bubbleRise ${5 + p.duration}s ease-out infinite`, animationDelay: `${p.delay}s`, opacity: p.opacity * 0.5 }} />
        ))}
        <style>{`@keyframes bubbleRise { 0% { bottom: -20px; transform: translateX(0) scale(0.5); opacity: 0; } 10% { opacity: 0.5; } 50% { transform: translateX(20px) scale(1); } 100% { bottom: 100%; transform: translateX(-10px) scale(1.2); opacity: 0; } }`}</style>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.slice(0, 20).map(p => (
        <div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(255,220,150,${p.opacity}) 0%, transparent 70%)`,
            animation: `sparkleFloat ${4 + p.duration}s ease-in-out infinite`, animationDelay: `${p.delay}s` }} />
      ))}
      <style>{`@keyframes sparkleFloat { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; } 50% { transform: translateY(-15px) scale(1.3); opacity: 0.6; } }`}</style>
    </div>
  );
}

export function StudyWithMeView() {
  const { language } = useLanguage();
  const pomodoro = useGlobalPomodoro();
  const [selectedScene, setSelectedScene] = useState(SCENES[0]);
  const [deepStudyMode, setDeepStudyMode] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutube, setShowYoutube] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isStudyTimerRunning, setIsStudyTimerRunning] = useState(false);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [musicMinimized, setMusicMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleBgUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCustomBg(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    if (customBg) { setBgLoaded(true); return; }
    setBgLoaded(false);
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.src = selectedScene.bgImage;
  }, [selectedScene, customBg]);

  useEffect(() => {
    if (isStudyTimerRunning) {
      timerRef.current = setInterval(() => setStudyTimer(t => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isStudyTimerRunning]);

  useEffect(() => {
    if (deepStudyMode && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else if (!deepStudyMode && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [deepStudyMode]);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
    )}
    style={{
      backgroundImage: bgLoaded ? `url(${bgUrl})` : undefined,
      backgroundSize: 'cover', backgroundPosition: 'center',
    }}>
      {/* Gradient fallback */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-700",
        bgLoaded ? "opacity-0" : "opacity-100",
        `bg-gradient-to-br ${selectedScene.gradient}`
      )} />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

      <Particles type={selectedScene.particleType} />

      {/* Top Bar - minimal */}
      <div className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Brain className="w-5 h-5 text-white/80" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white/90">
              {language === 'bn' ? 'একসাথে পড়ি' : 'Study With Me'}
            </h1>
            <p className="text-white/40 text-xs">
              {language === 'bn' ? 'মনোযোগ দিয়ে পড়ুন' : 'Focus & Flow'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
            <Moon className="w-3.5 h-3.5 text-white/60" />
            <span className="text-[11px] text-white/60 hidden sm:inline">
              {language === 'bn' ? 'ডিপ মোড' : 'Deep Mode'}
            </span>
            <Switch checked={deepStudyMode} onCheckedChange={setDeepStudyMode} className="scale-75" />
          </div>
        </div>
      </div>

      {/* Scene selector - pill style */}
      <div className="relative z-10 flex items-center gap-1.5 px-4 md:px-6 overflow-x-auto pb-3 scrollbar-hide">
        <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
        <button onClick={() => bgInputRef.current?.click()}
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border",
            customBg ? "bg-white/15 text-white border-white/20 shadow-lg" : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10"
          )}>
          <ImagePlus className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ওয়ালপেপার' : 'Wallpaper'}</span>
        </button>
        {customBg && (
          <button onClick={() => setCustomBg(null)} className="px-2 py-1.5 rounded-full text-xs bg-red-500/20 text-white/60 hover:bg-red-500/40 border border-red-500/20">
            <X className="w-3 h-3" />
          </button>
        )}
        {SCENES.map(scene => (
          <button key={scene.id} onClick={() => { setSelectedScene(scene); setCustomBg(null); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border",
              selectedScene.id === scene.id
                ? "bg-white/15 text-white border-white/20 shadow-lg"
                : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10"
            )}>
            <span>{scene.emoji}</span>
            <span>{language === 'bn' ? scene.labelBn : scene.label}</span>
          </button>
        ))}
      </div>

      {/* Center: Timer - Hero section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-6 md:py-12">
        {/* Timer ring */}
        <div className="relative mb-8">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-2xl">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border border-white/5 bg-black/20 flex flex-col items-center justify-center">
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-2">
                {language === 'bn' ? 'পড়ার সময়' : 'Study Time'}
              </p>
              <div className={cn(
                "text-5xl md:text-7xl font-mono font-bold tracking-wider transition-all",
                isStudyTimerRunning ? "text-white" : "text-white/70"
              )}>
                {formatTimer(studyTimer)}
              </div>
              {isStudyTimerRunning && (
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400/80 text-xs">
                    {language === 'bn' ? 'সেশন চলছে' : 'Session Active'}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Glow effect */}
          {isStudyTimerRunning && (
            <div className="absolute inset-0 rounded-full bg-white/5 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button onClick={() => { setStudyTimer(0); setIsStudyTimerRunning(false); }}
            size="lg" variant="ghost"
            className="rounded-full w-12 h-12 text-white/40 hover:text-white hover:bg-white/10 border border-white/10">
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button onClick={() => setIsStudyTimerRunning(!isStudyTimerRunning)}
            size="lg"
            className={cn(
              "rounded-full w-16 h-16 text-white transition-all shadow-2xl",
              isStudyTimerRunning
                ? "bg-white/20 hover:bg-white/30 border border-white/20"
                : "bg-white/15 hover:bg-white/25 border border-white/10"
            )}>
            {isStudyTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </Button>
          <div className="w-12" /> {/* Spacer for symmetry */}
        </div>

        {/* Pomodoro status badge */}
        {(pomodoro.isRunning || pomodoro.phase !== 'idle') && (
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-3 border border-white/10 animate-fade-in">
            <Coffee className="w-4 h-4 text-white/60" />
            <div className="text-center">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">
                {pomodoro.phase === 'focus' ? (language === 'bn' ? 'ফোকাস' : 'Focus')
                  : pomodoro.phase === 'break' ? (language === 'bn' ? 'বিরতি' : 'Break')
                  : (language === 'bn' ? 'দীর্ঘ বিরতি' : 'Long Break')}
              </p>
              <p className="text-xl font-mono text-white/80">{pomodoro.formattedTime}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white rounded-full w-8 h-8 p-0"
              onClick={pomodoro.isRunning ? pomodoro.pause : pomodoro.start}>
              {pomodoro.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>
          </div>
        )}
      </div>

      {/* Music Player - Bottom right corner */}
      <div className={cn(
        "absolute z-20 transition-all duration-300",
        musicMinimized
          ? "bottom-4 right-4"
          : "bottom-4 right-4 w-80 max-w-[calc(100%-2rem)]"
      )}>
        {musicMinimized ? (
          <button onClick={() => setMusicMinimized(false)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all shadow-lg">
            <Headphones className="w-4 h-4" />
          </button>
        ) : (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-3 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-white/50" />
                <span className="text-white/50 text-xs">
                  {language === 'bn' ? 'মিউজিক' : 'Music'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMusicMinimized(true)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10">
                  <Minimize2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={language === 'bn' ? 'YouTube লিংক...' : 'YouTube link...'}
                value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                className="bg-white/10 border-white/10 text-white text-xs placeholder:text-white/25 h-8 focus:bg-white/15"
              />
              <Button onClick={() => setShowYoutube(!!embedUrl)} disabled={!embedUrl}
                className="bg-white/15 hover:bg-white/25 text-white h-8 w-8 p-0" size="sm">
                <Play className="w-3 h-3" />
              </Button>
            </div>
            {showYoutube && embedUrl && (
              <div className="relative rounded-lg overflow-hidden mt-2 bg-black/30">
                <Button size="icon" variant="ghost"
                  className="absolute top-1 right-1 z-10 text-white/60 hover:text-white bg-black/40 rounded-full w-6 h-6"
                  onClick={() => setShowYoutube(false)}>
                  <X className="w-3 h-3" />
                </Button>
                <iframe src={embedUrl} className="w-full aspect-video" allow="autoplay; encrypted-media" allowFullScreen />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deep Study Mode indicator */}
      {deepStudyMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-2 z-20 border border-white/10">
          <Moon className="w-3.5 h-3.5 text-white/60" />
          <span className="text-white/60 text-xs">
            {language === 'bn' ? '🔕 DND চালু করুন' : '🔕 Enable DND'}
          </span>
          <Button size="sm" variant="ghost" className="text-white/50 hover:text-white h-6 w-6 p-0 rounded-full" onClick={() => setDeepStudyMode(false)}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
