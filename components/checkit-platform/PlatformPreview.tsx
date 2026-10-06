import { Bell, CheckCircle2, FileCheck, Gauge, LayoutGrid, Radio, ShieldCheck, Smartphone } from 'lucide-react';
import { sparklinePath } from './sparkline';

type Status = 'ok' | 'alert';

const assets: { name: string; site: string; value: string; status: Status; series: number[] }[] = [
  { name: 'Pharmacy fridge 2', site: 'Main pharmacy', value: '4.6°C', status: 'ok', series: [4.4, 4.6, 4.5, 4.8, 4.6, 4.5, 4.7, 4.6, 4.4, 4.6, 4.5, 4.6] },
  { name: 'Vaccine fridge', site: 'Ward 4', value: '8.9°C', status: 'alert', series: [5.0, 5.1, 4.9, 5.2, 5.4, 5.9, 6.3, 6.9, 7.4, 8.0, 8.5, 8.9] },
  { name: 'Plasma freezer', site: 'Blood bank', value: '−30.4°C', status: 'ok', series: [-30.1, -30.4, -30.2, -30.6, -30.3, -30.5, -30.2, -30.4, -30.6, -30.3, -30.5, -30.4] },
  { name: 'Incubator 3', site: 'Pathology', value: '37.0°C', status: 'ok', series: [36.9, 37.0, 37.1, 37.0, 36.9, 37.0, 37.1, 37.0, 37.0, 36.9, 37.0, 37.0] },
  { name: 'Cold room', site: 'Biotech lab', value: '5.2°C', status: 'ok', series: [5.4, 5.2, 5.3, 5.1, 5.2, 5.4, 5.3, 5.2, 5.1, 5.3, 5.2, 5.2] },
  { name: 'Reagent fridge', site: 'Pathology', value: '3.8°C', status: 'ok', series: [3.9, 3.8, 3.7, 3.9, 4.0, 3.8, 3.9, 3.7, 3.8, 3.9, 3.8, 3.8] },
];

const navIcons = [LayoutGrid, Radio, Bell, Gauge, FileCheck];

function AssetTile({ asset, index }: { asset: (typeof assets)[number]; index: number }) {
  const alert = asset.status === 'alert';
  const { line, area, last } = sparklinePath(asset.series, 120, 28);
  const color = alert ? '#ef4444' : '#22c55e';
  const gradientId = `platform-spark-${index}`;

  return (
    <div
      className={`relative rounded-lg border p-2.5 sm:p-3 ${
        alert ? 'border-red-500/60 bg-red-500/[0.07]' : 'border-white/[0.06] bg-white/[0.03]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] font-medium text-foreground truncate">{asset.name}</p>
          <p className="text-[9px] sm:text-[10px] text-muted truncate">{asset.site}</p>
        </div>
        <span className="relative flex h-2 w-2 mt-1 shrink-0">
          {alert && <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${alert ? 'bg-red-500' : 'bg-green-500'}`} />
        </span>
      </div>
      <p className={`mt-1.5 text-base sm:text-lg font-semibold tabular-nums ${alert ? 'text-red-400' : 'text-foreground'}`}>
        {asset.value}
      </p>
      <svg viewBox="0 0 120 28" className="w-full h-6 sm:h-7 mt-1 overflow-visible" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {alert && <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />}
      </svg>
    </div>
  );
}

export default function PlatformPreview() {
  return (
    <div className="relative" role="img" aria-label="Illustration of the Checkit Platform showing monitored assets, a live alert on a phone and an audit record">
      <div className="absolute -inset-6 bg-accent/20 blur-3xl rounded-full opacity-40" aria-hidden="true" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="ml-3 text-[11px] text-muted">All sites</span>
        </div>

        <div className="flex">
          <div className="hidden sm:flex flex-col items-center gap-4 py-4 px-3 border-r border-white/[0.06]">
            {navIcons.map((Icon, i) => (
              <span
                key={i}
                className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  i === 0 ? 'bg-accent/20 text-accent' : 'text-muted/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
            ))}
          </div>

          <div className="flex-1 p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] text-muted">
                <span className="text-foreground font-semibold">6</span> assets
              </span>
              <span className="text-[10px] px-2 py-1 rounded-md bg-red-500/10 text-red-300">
                <span className="font-semibold">1</span> active alert
              </span>
              <span className="text-[10px] px-2 py-1 rounded-md bg-white/[0.04] text-muted">
                <span className="text-foreground font-semibold">4</span> sites
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
              {assets.map((asset, i) => (
                <AssetTile key={asset.name} asset={asset} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TODO(product): in-app mobile acknowledgement is not documented for the current medical platform. */}
      <div className="absolute -bottom-8 -left-3 sm:-left-8 w-56 sm:w-64 rounded-2xl border border-white/10 bg-[#111a2e]/95 backdrop-blur shadow-2xl shadow-black/60 p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 rounded-md bg-red-500/15 text-red-400 flex items-center justify-center">
            <Smartphone className="w-3.5 h-3.5" />
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted">Alert · now</span>
        </div>
        <p className="text-xs font-semibold text-foreground">Vaccine fridge · Ward 4</p>
        <p className="text-[11px] text-muted mb-3">8.9°C, above the 8.0°C upper limit</p>
        <div className="flex gap-2">
          <span className="flex-1 text-center text-[11px] font-medium py-1.5 rounded-md bg-accent text-white">Acknowledge</span>
          <span className="flex-1 text-center text-[11px] font-medium py-1.5 rounded-md bg-white/[0.06] text-foreground">View</span>
        </div>
      </div>

      <div className="hidden md:block absolute -top-6 -right-6 w-60 rounded-2xl border border-white/10 bg-[#111a2e]/95 backdrop-blur shadow-2xl shadow-black/60 p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 rounded-md bg-green-500/15 text-green-400 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted">Audit trail</span>
        </div>
        <ul className="space-y-1.5">
          {['Alert acknowledged', 'Stock moved to backup fridge', 'Action signed off'].map((entry) => (
            <li key={entry} className="flex items-center gap-2 text-[11px] text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
              {entry}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
