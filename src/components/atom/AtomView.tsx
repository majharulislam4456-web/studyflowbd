import { useState } from 'react';
import { Atom, Grid3x3, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AtomAnimatorView } from './AtomAnimatorView';
import { PeriodicTableView } from './PeriodicTableView';
import { AtomStatsView } from './AtomStatsView';

type SubView = 'animator' | 'table' | 'stats';

const tabs: { id: SubView; label: string; icon: typeof Atom }[] = [
  { id: 'animator', label: '3D Atom Animator', icon: Atom },
  { id: 'table', label: 'Periodic Table', icon: Grid3x3 },
  { id: 'stats', label: 'Statistics', icon: BarChart3 },
];

export function AtomView() {
  const [view, setView] = useState<SubView>('animator');
  const [selectedNumber, setSelectedNumber] = useState(8); // Oxygen default

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Atom className="w-7 h-7 text-cyan-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Atom Animation</h1>
      </div>

      <div className="flex gap-2 p-1 bg-muted/40 rounded-xl w-fit overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            className={cn(
              'flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              view === t.id
                ? 'bg-cyan-600 text-white shadow'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {view === 'animator' && <AtomAnimatorView initialNumber={selectedNumber} />}
      {view === 'table' && (
        <PeriodicTableView onShowIn3D={(n) => { setSelectedNumber(n); setView('animator'); }} />
      )}
      {view === 'stats' && <AtomStatsView />}
    </div>
  );
}