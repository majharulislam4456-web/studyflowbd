import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

type TimerStyle = 'normal' | 'flipping' | 'futuristic' | 'realwatch' | 'funny';
type TimerMode = 'pomodoro' | 'timer' | 'stopwatch';

// ─── Flip Card ────────────────────────────────────────────
function FlipDigit({ digit, prevDigit }: { digit: string; prevDigit: string }) {
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 500);
      return () => clearTimeout(t);
    }
  }, [digit, prevDigit]);

  return (
    <div className="relative w-14 h-20 md:w-20 md:h-28" style={{ perspective: '300px' }}>
      {/* Static bottom half (new digit) */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 overflow-hidden shadow-xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl md:text-6xl font-bold text-white tabular-nums">{digit}</span>
        </div>
        {/* Center split line */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/40 z-10" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 z-10 translate-y-[1px]" />
      </div>

      {/* Flipping top half (old digit flipping away) */}
      {flipping && (
        <div
          className="absolute inset-x-0 top-0 h-1/2 rounded-t-lg bg-gradient-to-b from-slate-700 to-slate-800 border border-white/10 border-b-0 overflow-hidden z-20"
          style={{
            animation: 'flipDown 0.5s ease-in forwards',
            transformOrigin: 'bottom center',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
            <span className="text-4xl md:text-6xl font-bold text-white tabular-nums">{prevDigit}</span>
          </div>
        </div>
      )}

      {/* Static top half (new digit underneath) */}
      <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-lg bg-gradient-to-b from-slate-700 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center" style={{ height: '200%' }}>
          <span className="text-4xl md:text-6xl font-bold text-white tabular-nums">{digit}</span>
        </div>
      </div>

      {/* Subtle inner shadow / reflections */}
      <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)' }} />
    </div>
  );
}

function FlippingTimer({ time }: { time: string }) {
  const prevTimeRef = useRef(time);
  const [prevTime, setPrevTime] = useState(time);

  useEffect(() => {
    setPrevTime(prevTimeRef.current);
    prevTimeRef.current = time;
  }, [time]);

  const pairs: { digit: string; prev: string }[] = [];
  for (let i = 0; i < time.length; i++) {
    pairs.push({ digit: time[i], prev: prevTime[i] || time[i] });
  }

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {pairs.map((p, i) =>
        p.digit === ':' ? (
          <div key={i} className="flex flex-col items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
          </div>
        ) : (
          <FlipDigit key={i} digit={p.digit} prevDigit={p.prev} />
        )
      )}
      <style>{`
        @keyframes flipDown {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Futuristic LED ───────────────────────────────────────
function FuturisticTimer({ time, isRunning }: { time: string; isRunning: boolean }) {
  return (
    <div className="relative" style={{ perspective: '800px' }}>
      <div
        className="relative transition-transform duration-700"
        style={{ transform: isRunning ? 'rotateX(5deg)' : 'rotateX(0deg)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 -m-8 rounded-3xl bg-cyan-500/5 blur-3xl pointer-events-none" />
        
        {/* LED segments container */}
        <div className="relative bg-black/60 backdrop-blur-md rounded-2xl border border-cyan-500/20 px-6 py-8 md:px-10 md:py-12 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(0,200,255,0.1), inset 0 1px 0 rgba(0,200,255,0.1)' }}>
          
          {/* Scan line effect */}
          {isRunning && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                style={{ animation: 'scanLine 3s linear infinite' }} />
            </div>
          )}

          {/* LED digits */}
          <div className="flex items-center gap-0">
            {time.split('').map((char, i) => (
              <span
                key={i}
                className={cn(
                  "font-mono font-bold tabular-nums transition-all duration-300",
                  char === ':'
                    ? "text-3xl md:text-5xl text-cyan-400/60 mx-1 animate-pulse"
                    : "text-5xl md:text-8xl"
                )}
                style={char !== ':' ? {
                  color: '#00e5ff',
                  textShadow: '0 0 10px #00e5ff, 0 0 30px #00e5ff80, 0 0 60px #00e5ff40, 0 0 80px #00e5ff20',
                  filter: 'brightness(1.2)',
                } : undefined}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Bottom LED indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[0, 1, 2].map(i => (
              <div key={i} className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                isRunning ? "bg-cyan-400 shadow-[0_0_6px_#00e5ff]" : "bg-cyan-900/50"
              )} />
            ))}
          </div>
        </div>

        {/* Reflection underneath */}
        <div className="absolute -bottom-6 inset-x-4 h-6 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-b-2xl blur-sm" />
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: -2px; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

// ─── Real Watch (3D rotating) ─────────────────────────────
function RealWatchTimer({ time, isRunning, mode, progress }: { time: string; isRunning: boolean; mode: string; progress?: number }) {
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setRotateY(prev => {
        // Gentle oscillation
        const t = Date.now() / 3000;
        return Math.sin(t) * 8;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isRunning]);

  const seconds = parseInt(time.split(':').pop() || '0');
  const secondAngle = (seconds / 60) * 360;

  return (
    <div style={{ perspective: '600px' }}>
      <div
        className="relative w-64 h-64 md:w-80 md:h-80 transition-transform"
        style={{ transform: `rotateY(${rotateY}deg) rotateX(${isRunning ? 2 : 0}deg)`, transformStyle: 'preserve-3d' }}
      >
        {/* Watch body */}
        <div className="absolute inset-0 rounded-full border-[6px] border-slate-600 bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-2xl"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.5)' }}>
          
          {/* Inner bezel */}
          <div className="absolute inset-3 rounded-full border border-white/5">
            {/* Hour marks */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="absolute left-1/2 top-0 -translate-x-1/2" style={{ height: '100%', transform: `rotate(${i * 30}deg)` }}>
                <div className={cn(
                  "mx-auto bg-white/40",
                  i % 3 === 0 ? "w-[2px] h-4" : "w-[1px] h-2"
                )} style={{ marginTop: '4px' }} />
              </div>
            ))}

            {/* Minute ticks */}
            {Array.from({ length: 60 }).map((_, i) => (
              i % 5 !== 0 && (
                <div key={i} className="absolute left-1/2 top-0 -translate-x-1/2" style={{ height: '100%', transform: `rotate(${i * 6}deg)` }}>
                  <div className="w-[0.5px] h-1.5 mx-auto bg-white/15" style={{ marginTop: '6px' }} />
                </div>
              )
            ))}

            {/* Second hand */}
            {isRunning && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-bottom w-[1px] h-[40%] bg-red-500 -translate-y-full z-10 transition-transform"
                style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)`, transformOrigin: 'bottom center' }}>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500" />
              </div>
            )}

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <p className="text-white/25 text-[9px] uppercase tracking-[0.4em] mb-1 font-medium">{mode}</p>
              <div className="text-3xl md:text-4xl font-mono font-bold text-white tabular-nums tracking-wider">{time}</div>
            </div>
          </div>

          {/* Crown (side button) */}
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-3 h-6 bg-slate-600 rounded-r-sm border border-slate-500"
            style={{ boxShadow: '2px 0 4px rgba(0,0,0,0.3)' }} />
        </div>

        {/* Progress ring */}
        {progress !== undefined && progress > 0 && (
          <svg className="absolute inset-0 w-full h-full -rotate-90 z-10 pointer-events-none">
            <circle cx="50%" cy="50%" r="46%" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none" />
            <circle cx="50%" cy="50%" r="46%" stroke="url(#watchGrad)" strokeWidth="3" fill="none" strokeLinecap="round"
              style={{ strokeDasharray: `${2 * Math.PI * 46}%`, strokeDashoffset: `${2 * Math.PI * 46 * (1 - progress / 100)}%`, transition: 'stroke-dashoffset 0.5s' }} />
            <defs>
              <linearGradient id="watchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Glass reflection */}
        <div className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)' }} />
      </div>
    </div>
  );
}

// ─── Funny Timer ──────────────────────────────────────────
function FunnyTimer({ time, isRunning }: { time: string; isRunning: boolean }) {
  const emojis = ['🔥', '📚', '💪', '🧠', '⚡', '🎯', '🚀', '✨'];
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => setEmojiIndex(i => (i + 1) % emojis.length), 2000);
    return () => clearInterval(t);
  }, [isRunning]);

  return (
    <div className="text-center">
      {isRunning && (
        <div className="text-4xl mb-4 transition-all" style={{ animation: 'bounceEmoji 0.6s ease-in-out' }} key={emojiIndex}>
          {emojis[emojiIndex]}
        </div>
      )}
      <div className="relative inline-block">
        <div
          className={cn(
            "text-6xl md:text-8xl font-black tabular-nums transition-all",
            isRunning ? "text-yellow-300" : "text-white/70"
          )}
          style={{
            textShadow: isRunning
              ? '4px 4px 0 rgba(0,0,0,0.3), -2px -2px 0 rgba(255,200,0,0.2), 0 0 20px rgba(255,200,0,0.3)'
              : '3px 3px 0 rgba(0,0,0,0.3)',
            animation: isRunning ? 'wobble 2s ease-in-out infinite' : 'none',
          }}
        >
          {time}
        </div>
      </div>
      {isRunning && (
        <p className="text-white/50 text-sm mt-3 tracking-wider animate-pulse">
          Keep going! 💪
        </p>
      )}
      <style>{`
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-1deg) scale(1.02); }
          75% { transform: rotate(1deg) scale(0.98); }
        }
        @keyframes bounceEmoji {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Normal Timer ─────────────────────────────────────────
function NormalTimer({ time, isRunning }: { time: string; isRunning: boolean }) {
  return (
    <div className="relative">
      <div className={cn(
        "text-5xl md:text-7xl font-mono font-bold tracking-wider transition-all tabular-nums",
        isRunning ? "text-white" : "text-white/70"
      )}>
        {time}
      </div>
      {isRunning && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────
export function TimerDisplay({ time, style, isRunning, mode, progress }: {
  time: string;
  style: TimerStyle;
  isRunning: boolean;
  mode: TimerMode;
  progress?: number;
}) {
  switch (style) {
    case 'flipping':
      return <FlippingTimer time={time} />;
    case 'futuristic':
      return <FuturisticTimer time={time} isRunning={isRunning} />;
    case 'realwatch':
      return <RealWatchTimer time={time} isRunning={isRunning} mode={mode} progress={progress} />;
    case 'funny':
      return <FunnyTimer time={time} isRunning={isRunning} />;
    default:
      return <NormalTimer time={time} isRunning={isRunning} />;
  }
}
