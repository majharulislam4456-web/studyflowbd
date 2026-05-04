import { useState } from 'react';
import { ELEMENTS, ElementData, neutronsFor, categoryColor } from '@/data/elements';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Atom as AtomIcon } from 'lucide-react';

interface PeriodicTableViewProps {
  onShowIn3D: (number: number) => void;
}

export function PeriodicTableView({ onShowIn3D }: PeriodicTableViewProps) {
  const [selected, setSelected] = useState<ElementData | null>(null);

  return (
    <div className="rounded-2xl bg-[#0b1220] border border-border p-4 overflow-x-auto">
      <h2 className="text-xl font-bold text-cyan-300 mb-4">Periodic Table</h2>
      <div
        className="grid gap-1 min-w-[820px]"
        style={{ gridTemplateColumns: 'repeat(18, minmax(40px, 1fr))' }}
      >
        {ELEMENTS.map(el => (
          <button
            key={el.number}
            onClick={() => setSelected(el)}
            className="aspect-square rounded-md p-1 flex flex-col items-center justify-center text-slate-100 hover:scale-110 hover:z-10 transition-transform border border-white/10"
            style={{
              gridColumn: el.group,
              gridRow: el.period,
              backgroundColor: categoryColor(el.category) + '33',
              borderColor: categoryColor(el.category) + '88',
            }}
            title={`${el.symbol} — ${el.name}`}
          >
            <span className="text-[9px] opacity-70 leading-none">{el.number}</span>
            <span className="text-sm font-bold leading-none">{el.symbol}</span>
            <span className="text-[8px] truncate max-w-full opacity-80 leading-none mt-0.5">{el.name}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 text-xs">
        {[
          { k: 'alkali', label: 'Alkali' },
          { k: 'alkaline', label: 'Alkaline' },
          { k: 'transition', label: 'Transition' },
          { k: 'metal', label: 'Metal' },
          { k: 'metalloid', label: 'Metalloid' },
          { k: 'nonmetal', label: 'Nonmetal' },
          { k: 'halogen', label: 'Halogen' },
          { k: 'noble', label: 'Noble Gas' },
        ].map(c => (
          <div key={c.k} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: categoryColor(c.k) }} />
            <span className="text-muted-foreground">{c.label}</span>
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl bg-slate-900 border-cyan-500/30 text-slate-100">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-cyan-300">
                  {selected.name} ({selected.symbol})
                </DialogTitle>
                <p className="text-sm text-slate-400 font-bengali">{selected.nameBn}</p>
              </DialogHeader>

              <Tabs defaultValue="description">
                <TabsList className="bg-slate-800">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="electrons">Electrons</TabsTrigger>
                  <TabsTrigger value="isotopes">Isotopes</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="text-slate-300 leading-relaxed">
                  {selected.description}
                </TabsContent>

                <TabsContent value="properties">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      ['Atomic No.', selected.number],
                      ['Atomic Mass', selected.mass],
                      ['Group', selected.group],
                      ['Period', selected.period],
                      ['E. Configuration', selected.config],
                      ['State (STP)', selected.state],
                      ['Melting Pt.', selected.melt ? `${selected.melt} K` : '—'],
                      ['Boiling Pt.', selected.boil ? `${selected.boil} K` : '—'],
                    ].map(([k, v]) => (
                      <div key={String(k)} className="flex justify-between bg-slate-800/60 rounded px-3 py-2">
                        <span className="text-slate-400">{k}</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="electrons">
                  <div className="text-cyan-300 text-lg">{selected.config}</div>
                  <p className="text-sm text-slate-400 mt-2">
                    Total electrons: {selected.number}
                  </p>
                </TabsContent>

                <TabsContent value="isotopes">
                  {selected.isotopes && selected.isotopes.length > 0 ? (
                    <div className="space-y-2">
                      {selected.isotopes.map((iso, i) => (
                        <div key={i} className="flex justify-between bg-slate-800/60 rounded px-3 py-2 text-sm">
                          <span>{selected.symbol}-{iso.mass}</span>
                          <span className="text-cyan-300">{iso.abundance}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">
                      Most common: {selected.symbol}-{Math.round(selected.mass)} (neutrons: {neutronsFor(selected)})
                    </p>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end pt-2">
                <Button
                  className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2"
                  onClick={() => { onShowIn3D(selected.number); setSelected(null); }}
                >
                  <AtomIcon className="w-4 h-4" /> Show in 3D
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}