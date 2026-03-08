import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, Volume2, VolumeX, Moon, Sun, Link, X, Coffee, Brain, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { cn } from '@/lib/utils';

const SCENES = [
  { id: 'rain', emoji: '🌧️', label: 'Rainy Day', labelBn: 'বৃষ্টির দিন', gradient: 'from-slate-800 via-blue-900 to-slate-900', particles: '🌧️' },
  { id: 'forest', emoji: '🌿', label: 'Forest', labelBn: 'বন', gradient: 'from-emerald-900 via-green-800 to-teal-900', particles: '🍃' },
  { id: 'night', emoji: '🌙', label: 'Night Sky', labelBn: 'রাতের আকাশ', gradient: 'from-indigo-950 via-purple-900 to-slate-950', particles: '✨' },
  { id: 'cafe', emoji: '☕', label: 'Cozy Cafe', labelBn: 'কফি শপ', gradient: 'from-amber-900 via-orange-800 to-yellow-900', particles: '☕' },
  { id: 'ocean', emoji: '🌊', label: 'Ocean', labelBn: 'সমুদ্র', gradient: 'from-cyan-900 via-blue-800 to-teal-900', particles: '🌊' },
  { id: 'library', emoji: '📚', label: 'Library', labelBn: 'লাইব্রেরি', gradient: 'from-stone-800 via-amber-900 to-stone-900', particles: '📖' },
];

export function StudyWithMeView() {
  const { language } = useLanguage();
  const pomodoro = useGlobalPomodoro();
  const [selectedScene, setSelectedScene] = useState(SCENES[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deepStudyMode, setDeepStudyMode] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutube, setShowYoutube] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isStudyTimerRunning, setIsStudyTimerRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Study timer
  useEffect(() => {
    if (isStudyTimerRunning) {
      timerRef.current = setInterval(() => setStudyTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isStudyTimerRunning]);

  // Deep study mode - request fullscreen
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
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

  return (
    <div ref={containerRef} className={cn(
      "relative min-h-[80vh] rounded-2xl overflow-hidden transition-all duration-700",
      `bg-gradient-to-br ${selectedScene.gradient}`,
      deepStudyMode && "fixed inset-0 z-[100] min-h-screen rounded-none"
    )}>
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {selectedScene.particles}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white/90 font-bengali flex items-center gap-2">
            <Brain className="w-7 h-7" />
            {language === 'bn' ? 'Study With Me' : 'Study With Me'}
          </h1>
          <p className="text-white/50 text-sm font-bengali">
            {language === 'bn' ? 'গভীর পড়াশোনায় মনোযোগ দিন' : 'Focus on deep study'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Deep Study Mode Toggle */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Moon className="w-4 h-4 text-white/70" />
            <span className="text-xs text-white/70 font-bengali hidden sm:inline">
              {language === 'bn' ? 'ডিপ স্টাডি' : 'Deep Study'}
            </span>
            <Switch checked={deepStudyMode} onCheckedChange={setDeepStudyMode} />
          </div>
        </div>
      </div>

      {/* Scene Selector */}
      <div className="relative z-10 flex items-center gap-2 px-4 md:px-6 overflow-x-auto pb-2 scrollbar-hide">
        {SCENES.map(scene => (
          <button
            key={scene.id}
            onClick={() => setSelectedScene(scene)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all",
              selectedScene.id === scene.id
                ? "bg-white/20 text-white shadow-lg backdrop-blur-md"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            )}
          >
            <span>{scene.emoji}</span>
            <span className="font-bengali">{language === 'bn' ? scene.labelBn : scene.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-16 space-y-8">
        {/* Study Timer */}
        <div className="text-center">
          <p className="text-white/50 text-sm font-bengali mb-2">
            {language === 'bn' ? 'পড়ার সময়' : 'Study Time'}
          </p>
          <div className="text-6xl md:text-8xl font-mono font-bold text-white/90 tracking-wider">
            {formatTimer(studyTimer)}
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              onClick={() => setIsStudyTimerRunning(!isStudyTimerRunning)}
              size="lg"
              className="rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm gap-2 px-8"
            >
              {isStudyTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isStudyTimerRunning
                ? (language === 'bn' ? 'বিরতি' : 'Pause')
                : (language === 'bn' ? 'শুরু' : 'Start')
              }
            </Button>
            <Button
              onClick={() => { setStudyTimer(0); setIsStudyTimerRunning(false); }}
              size="lg"
              variant="ghost"
              className="rounded-full text-white/60 hover:text-white hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Pomodoro Status */}
        {(pomodoro.isRunning || pomodoro.phase !== 'idle') && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4">
            <Coffee className="w-5 h-5 text-white/70" />
            <div>
              <p className="text-white/60 text-xs font-bengali">
                {pomodoro.phase === 'focus'
                  ? (language === 'bn' ? 'ফোকাস সেশন' : 'Focus Session')
                  : pomodoro.phase === 'break'
                    ? (language === 'bn' ? 'ছোট বিরতি' : 'Short Break')
                    : (language === 'bn' ? 'দীর্ঘ বিরতি' : 'Long Break')
                }
              </p>
              <p className="text-2xl font-mono text-white/90">{pomodoro.formattedTime}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="text-white/70 hover:text-white" onClick={pomodoro.isRunning ? pomodoro.pause : pomodoro.start}>
                {pomodoro.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* YouTube Music */}
        <div className="w-full max-w-lg space-y-3">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-white/60" />
            <span className="text-white/60 text-sm font-bengali">
              {language === 'bn' ? 'মিউজিক / অ্যাম্বিয়েন্ট সাউন্ড' : 'Music / Ambient Sound'}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder={language === 'bn' ? 'YouTube লিংক পেস্ট করুন...' : 'Paste YouTube link...'}
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 font-bengali"
            />
            <Button
              onClick={() => setShowYoutube(!!embedUrl)}
              disabled={!embedUrl}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
          {showYoutube && embedUrl && (
            <div className="relative rounded-xl overflow-hidden bg-black/30">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-10 text-white/70 hover:text-white bg-black/50 rounded-full"
                onClick={() => setShowYoutube(false)}
              >
                <X className="w-4 h-4" />
              </Button>
              <iframe
                src={embedUrl}
                className="w-full aspect-video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      {/* Deep Study Mode Overlay Info */}
      {deepStudyMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 z-20">
          <Moon className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm font-bengali">
            {language === 'bn'
              ? '🔕 ডিপ স্টাডি মোড চালু — ফুলস্ক্রিনে পড়ুন, ফোনে DND চালু করুন'
              : '🔕 Deep Study Mode ON — Fullscreen, enable DND on your phone'
            }
          </span>
          <Button size="sm" variant="ghost" className="text-white/60 hover:text-white" onClick={() => setDeepStudyMode(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
