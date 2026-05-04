import { useState, useMemo } from 'react';
import { Atom3D } from './Atom3D';
import { ELEMENTS, neutronsFor } from '@/data/elements';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Atom as AtomIcon } from 'lucide-react';

interface AtomAnimatorViewProps {
  initialNumber?: number;
}

export function AtomAnimatorView({ initialNumber = 8 }: AtomAnimatorViewProps) {
  const [elementNum, setElementNum] = useState(initialNumber);
  const baseElement = useMemo(() => ELEMENTS.find(e => e.number === elementNum) || ELEMENTS[7], [elementNum]);
  const [protons, setProtons] = useState(baseElement.number);
  const [neutrons, setNeutrons] = useState(neutronsFor(baseElement));
  const [electrons, setElectrons] = useState(baseElement.number);
  const [speed, setSpeed] = useState(1);

  const onElementChange = (val: string) => {
    const n = Number(val);
    const el = ELEMENTS.find(e => e.number === n);
    if (!el) return;
    setElementNum(n);
    setProtons(el.number);
    setNeutrons(neutronsFor(el));
    setElectrons(el.number);
  };

  const adjust = (setter: (v: number) => void, val: number, delta: number, min = 0, max = 118) => {
    setter(Math.max(min, Math.min(max, val + delta)));
  };

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] min-h-[500px] rounded-2xl overflow-hidden border border-border bg-[#0b1220]">
      <Atom3D protons={protons} neutrons={neutrons} electrons={electrons} speed={speed} />

      {/* Info Card - bottom left */}
      <Card className="absolute top-4 left-4 p-4 w-56 bg-slate-900/80 backdrop-blur-md border-cyan-500/30 text-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <AtomIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs uppercase tracking-wider text-cyan-400">Element Info</span>
        </div>
        <div className="text-4xl font-bold text-cyan-300">{baseElement.symbol}</div>
        <div className="text-lg font-semibold">{baseElement.name}</div>
        <div className="text-xs text-slate-400 font-bengali">{baseElement.nameBn}</div>
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-slate-400">Atomic No:</span><span>{baseElement.number}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Atomic Mass:</span><span>{baseElement.mass}</span></div>
          <div className="text-slate-400 mt-2">Configuration:</div>
          <div className="text-cyan-300 text-xs">{baseElement.config}</div>
        </div>
      </Card>

      {/* Bottom control panel */}
      <Card className="absolute bottom-4 left-1/2 -translate-x-1/2 p-4 w-[min(680px,calc(100%-2rem))] bg-slate-900/85 backdrop-blur-md border-cyan-500/30 text-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">Element</Label>
            <Select value={String(elementNum)} onValueChange={onElementChange}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72 bg-slate-900 border-slate-700 text-slate-100">
                {ELEMENTS.map(e => (
                  <SelectItem key={e.number} value={String(e.number)}>
                    {e.number}. {e.symbol} — {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">Speed: {speed.toFixed(1)}x</Label>
            <Slider min={0} max={4} step={0.1} value={[speed]} onValueChange={(v) => setSpeed(v[0])} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {([
            { label: 'Protons', value: protons, set: setProtons, color: 'text-red-400' },
            { label: 'Neutrons', value: neutrons, set: setNeutrons, color: 'text-slate-300' },
            { label: 'Electrons', value: electrons, set: setElectrons, color: 'text-cyan-400' },
          ]).map((row) => (
            <div key={row.label} className="flex flex-col items-center gap-1 bg-slate-800/60 rounded-lg p-2">
              <span className={`text-[11px] uppercase tracking-wide ${row.color}`}>{row.label}</span>
              <div className="flex items-center gap-2">
                <Button size="icon-sm" variant="outline" className="h-7 w-7 bg-slate-900 border-slate-700" onClick={() => adjust(row.set, row.value, -1)}>
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-lg font-bold tabular-nums w-8 text-center">{row.value}</span>
                <Button size="icon-sm" variant="outline" className="h-7 w-7 bg-slate-900 border-slate-700" onClick={() => adjust(row.set, row.value, 1)}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}