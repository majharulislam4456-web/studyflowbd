import { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Moon, X, Coffee, Brain, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGlobalPomodoro } from '@/contexts/PomodoroContext';
import { cn } from '@/lib/utils';

const SCENES = [
  { id: 'rain', emoji: '🌧️', label: 'Rainy Day', labelBn: 'বৃষ্টির দিন', gradient: 'from-slate-800 via-blue-900 to-slate-900', particleType: 'rain' as const },
  { id: 'forest', emoji: '🌿', label: 'Forest', labelBn: 'বন', gradient: 'from-emerald-900 via-green-800 to-teal-900', particleType: 'leaves' as const },
  { id: 'night', emoji: '🌙', label: 'Night Sky', labelBn: 'রাতের আকাশ', gradient: 'from-indigo-950 via-purple-900 to-slate-950', particleType: 'stars' as const },
  { id: 'cafe', emoji: '☕', label: 'Cozy Cafe', labelBn: 'কফি শপ', gradient: 'from-stone-800 via-yellow-900/80 to-stone-900', particleType: 'sparkle' as const },
  { id: 'ocean', emoji: '🌊', label: 'Ocean', labelBn: 'সমুদ্র', gradient: 'from-cyan-900 via-blue-800 to-teal-900', particleType: 'bubbles' as const },
  { id: 'library', emoji: '📚', label: 'Library', labelBn: 'লাইব্রেরি', gradient: 'from-stone-800 via-stone-700 to-stone-900', particleType: 'sparkle' as const },
];

function Particles({ type }: { type: string }) {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 8,
    duration: 3 + Math.random() * 6,
    opacity: 0.1 + Math.random() * 0.4,
  })), []);

  if (type === 'rain') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-[1px] bg-blue-300/40 rounded-full"
            style={{
              left: `${p.x}%`,
              height: `${10 + p.size * 4}px`,
              animation: `rainFall ${1 + p.duration * 0.3}s linear infinite`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
        <style>{`
          @keyframes rainFall {
            0% { transform: translateY(-20px); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (type === 'stars') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `twinkle ${2 + p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity * 0.5,
              boxShadow: `0 0 ${p.size * 2}px ${p.size}px rgba(255,255,255,${p.opacity * 0.3})`,
            }}
          />
        ))}
        {/* Shooting stars */}
        {[0, 1, 2].map(i => (
          <div
            key={`shoot-${i}`}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              animation: `shootingStar ${3 + i * 2}s ease-out infinite`,
              animationDelay: `${i * 4 + 2}s`,
              boxShadow: '0 0 6px 2px rgba(255,255,255,0.6), -30px 0 10px 1px rgba(255,255,255,0.3)',
            }}
          />
        ))}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          @keyframes shootingStar {
            0% { top: 10%; left: 80%; opacity: 0; transform: translate(0, 0) rotate(-45deg); }
            5% { opacity: 1; }
            15% { top: 40%; left: 20%; opacity: 0; transform: translate(-200px, 200px) rotate(-45deg); }
            100% { top: 40%; left: 20%; opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (type === 'leaves') {
    const leafEmojis = ['🍃', '🌿', '🍂', '🌱'];
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(0, 20).map(p => (
          <div
            key={p.id}
            className="absolute text-lg"
            style={{
              left: `${p.x}%`,
              animation: `leafFall ${6 + p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity * 0.6,
            }}
          >
            {leafEmojis[p.id % leafEmojis.length]}
          </div>
        ))}
        <style>{`
          @keyframes leafFall {
            0% { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 0; }
            10% { opacity: 0.6; }
            50% { transform: translateY(50vh) rotate(180deg) translateX(40px); }
            90% { opacity: 0.4; }
            100% { transform: translateY(100vh) rotate(360deg) translateX(-20px); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  if (type === 'bubbles') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(0, 25).map(p => (
          <div
            key={p.id}
            className="absolute rounded-full border border-cyan-300/20 bg-cyan-200/5"
            style={{
              left: `${p.x}%`,
              width: `${p.size * 3}px`,
              height: `${p.size * 3}px`,
              animation: `bubbleRise ${5 + p.duration}s ease-out infinite`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity * 0.5,
            }}
          />
        ))}
        <style>{`
          @keyframes bubbleRise {
            0% { bottom: -20px; transform: translateX(0) scale(0.5); opacity: 0; }
            10% { opacity: 0.5; }
            50% { transform: translateX(20px) scale(1); }
            90% { opacity: 0.2; }
            100% { bottom: 100%; transform: translateX(-10px) scale(1.2); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // sparkle - for cafe & library
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.slice(0, 20).map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(255,220,150,${p.opacity}) 0%, transparent 70%)`,
            animation: `sparkleFloat ${4 + p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          25% { transform: translateY(-15px) scale(1.3); opacity: 0.6; }
          50% { transform: translateY(-5px) scale(0.8); opacity: 0.3; }
          75% { transform: translateY(-20px) scale(1.1); opacity: 0.5; }
        }
      `}</style>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      {/* Ambient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

      {/* Animated particles */}
      <Particles type={selectedScene.particleType} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 md:p-6 animate-fade-in-down">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white/90 font-bengali flex items-center gap-2">
            <Brain className="w-7 h-7 animate-breathe" />
            Study With Me
          </h1>
          <p className="text-white/50 text-sm font-bengali">
            {language === 'bn' ? 'গভীর পড়াশোনায় মনোযোগ দিন' : 'Focus on deep study'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/15 transition-colors">
          <Moon className="w-4 h-4 text-white/70" />
          <span className="text-xs text-white/70 font-bengali hidden sm:inline">
            {language === 'bn' ? 'ডিপ স্টাডি' : 'Deep Study'}
          </span>
          <Switch checked={deepStudyMode} onCheckedChange={setDeepStudyMode} />
        </div>
      </div>

      {/* Scene Selector */}
      <div className="relative z-10 flex items-center gap-2 px-4 md:px-6 overflow-x-auto pb-2 scrollbar-hide">
        {SCENES.map((scene, i) => (
          <button
            key={scene.id}
            onClick={() => setSelectedScene(scene)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300",
              selectedScene.id === scene.id
                ? "bg-white/20 text-white shadow-lg backdrop-blur-md scale-105"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:scale-105"
            )}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="text-lg">{scene.emoji}</span>
            <span className="font-bengali">{language === 'bn' ? scene.labelBn : scene.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-16 space-y-8">
        {/* Timer */}
        <div className="text-center animate-fade-in-up">
          <p className="text-white/50 text-sm font-bengali mb-3 tracking-widest uppercase">
            {language === 'bn' ? 'পড়ার সময়' : 'Study Time'}
          </p>
          <div className="relative inline-block">
            <div className={cn(
              "text-6xl md:text-8xl font-mono font-bold tracking-wider transition-all duration-300",
              isStudyTimerRunning ? "text-white" : "text-white/80"
            )}>
              {formatTimer(studyTimer)}
            </div>
            {isStudyTimerRunning && (
              <div className="absolute -inset-4 rounded-2xl border border-white/10 animate-glow-pulse pointer-events-none" />
            )}
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button
              onClick={() => setIsStudyTimerRunning(!isStudyTimerRunning)}
              size="lg"
              className={cn(
                "rounded-full backdrop-blur-sm gap-2 px-10 text-white transition-all duration-300",
                isStudyTimerRunning
                  ? "bg-white/25 hover:bg-white/35 shadow-lg shadow-white/10"
                  : "bg-white/15 hover:bg-white/25"
              )}
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
              className="rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Pomodoro Status */}
        {(pomodoro.isRunning || pomodoro.phase !== 'idle') && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 animate-scale-in border border-white/10">
            <Coffee className="w-5 h-5 text-white/70 animate-bounce-soft" />
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
            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white" onClick={pomodoro.isRunning ? pomodoro.pause : pomodoro.start}>
              {pomodoro.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {/* YouTube Music */}
        <div className="w-full max-w-lg space-y-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
              className="bg-white/10 border-white/20 text-white placeholder:text-white/30 font-bengali focus:bg-white/15 transition-colors"
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
            <div className="relative rounded-xl overflow-hidden bg-black/30 animate-scale-in">
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

      {/* Deep Study Mode Info */}
      {deepStudyMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 z-20 animate-fade-in-up border border-white/10">
          <Moon className="w-4 h-4 text-white/70" />
          <span className="text-white/70 text-sm font-bengali">
            {language === 'bn'
              ? '🔕 ডিপ স্টাডি মোড — ফোনে DND চালু করুন'
              : '🔕 Deep Study Mode — Enable DND on your phone'
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
