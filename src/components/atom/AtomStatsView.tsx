import { ELEMENTS, neutronsFor } from '@/data/elements';
import { Card } from '@/components/ui/card';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter,
} from 'recharts';

// Bengali numerals
const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
const toBn = (n: number | string) => String(n).replace(/\d/g, d => bnDigits[+d]);

const data = ELEMENTS.map(e => {
  const n = neutronsFor(e);
  return {
    name: e.symbol,
    nameBn: e.nameBn,
    z: e.number,
    electrons: e.number,
    nucleons: e.number + n,
    neutrons: n,
    nzRatio: +(n / e.number).toFixed(3),
    melt: e.melt ?? null,
    boil: e.boil ?? null,
    liquidRange: e.melt && e.boil ? +(e.boil - e.melt) : null,
  };
});

const liquidData = data.filter(d => d.melt !== null && d.boil !== null);

const tooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #06b6d4',
  borderRadius: 8,
  color: '#e2e8f0',
};

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="p-4 bg-slate-900/60 border-cyan-500/20">
    <h3 className="text-base font-semibold text-cyan-300 mb-3 font-bengali">{title}</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        {children as any}
      </ResponsiveContainer>
    </div>
  </Card>
);

export function AtomStatsView() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-cyan-300 font-bengali">পরিসংখ্যান ও চার্ট</h2>
        <p className="text-sm text-muted-foreground font-bengali">মৌলসমূহের পারমাণবিক বৈশিষ্ট্যের তুলনামূলক বিশ্লেষণ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="নিউক্লিয়ন বনাম ইলেকট্রন">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid stroke="#1e293b" />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              tick={{ fontSize: 10 }}
              label={{ value: 'মৌলসমূহ', position: 'insideBottom', offset: -10, fill: '#94a3b8', style: { fontFamily: 'Noto Sans Bengali' } }}
            />
            <YAxis stroke="#94a3b8" tickFormatter={(v) => toBn(v)} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number, name: string) => [toBn(value), name]}
              labelFormatter={(l) => `মৌল: ${l}`}
            />
            <Legend wrapperStyle={{ fontFamily: 'Noto Sans Bengali', fontSize: 12 }} />
            <Line type="monotone" dataKey="electrons" name="ইলেকট্রন সংখ্যা" stroke="#22d3ee" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="nucleons" name="মোট নিউক্লিয়ন" stroke="#a78bfa" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="নিউট্রন ও প্রোটনের অনুপাত (N/Z Ratio)">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }}
              label={{ value: 'মৌলসমূহ', position: 'insideBottom', offset: -10, fill: '#94a3b8', style: { fontFamily: 'Noto Sans Bengali' } }} />
            <YAxis stroke="#94a3b8" tickFormatter={(v) => toBn(v)} />
            <Tooltip contentStyle={tooltipStyle}
              formatter={(v: number) => [toBn(v), 'N/Z অনুপাত']}
              labelFormatter={(l) => `মৌল: ${l}`} />
            <Legend wrapperStyle={{ fontFamily: 'Noto Sans Bengali', fontSize: 12 }} />
            <Line type="monotone" dataKey="nzRatio" name="N/Z অনুপাত" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="গলনাঙ্ক ও স্ফুটনাঙ্ক (K)">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }}
              label={{ value: 'মৌলসমূহ', position: 'insideBottom', offset: -10, fill: '#94a3b8', style: { fontFamily: 'Noto Sans Bengali' } }} />
            <YAxis stroke="#94a3b8" tickFormatter={(v) => toBn(v)}
              label={{ value: 'তাপমাত্রা (K)', angle: -90, position: 'insideLeft', fill: '#94a3b8', style: { fontFamily: 'Noto Sans Bengali' } }} />
            <Tooltip contentStyle={tooltipStyle}
              formatter={(v: number, n: string) => [v ? `${toBn(v)} K` : 'N/A', n]}
              labelFormatter={(l) => `মৌল: ${l}`} />
            <Legend wrapperStyle={{ fontFamily: 'Noto Sans Bengali', fontSize: 12 }} />
            <Line type="monotone" dataKey="melt" name="গলনাঙ্ক" stroke="#60a5fa" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="boil" name="স্ফুটনাঙ্ক" stroke="#f472b6" strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ChartCard>

        <ChartCard title="তরল অবস্থা (গলনাঙ্ক বনাম স্ফুটনাঙ্ক)">
          <ScatterChart margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid stroke="#1e293b" />
            <XAxis type="number" dataKey="melt" name="গলনাঙ্ক" stroke="#94a3b8" tickFormatter={(v) => toBn(v)}
              label={{ value: 'গলনাঙ্ক (K)', position: 'insideBottom', offset: -10, fill: '#94a3b8', style: { fontFamily: 'Noto Sans Bengali' } }} />
            <YAxis type="number" dataKey="boil" name="স্ফুটনাঙ্ক" stroke="#94a3b8" tickFormatter={(v) => toBn(v)}
              label={{ value: 'স্ফুটনাঙ্ক (K)', angle: -90, position: 'insideLeft', fill: '#94a3b8', style: { fontFamily: 'Noto Sans Bengali' } }} />
            <Tooltip contentStyle={tooltipStyle}
              formatter={(v: number, n: string) => [`${toBn(v)} K`, n === 'melt' ? 'গলনাঙ্ক' : 'স্ফুটনাঙ্ক']}
              labelFormatter={() => ''} />
            <Legend wrapperStyle={{ fontFamily: 'Noto Sans Bengali', fontSize: 12 }} />
            <Scatter name="মৌলসমূহ" data={liquidData} fill="#22d3ee" />
          </ScatterChart>
        </ChartCard>
      </div>
    </div>
  );
}