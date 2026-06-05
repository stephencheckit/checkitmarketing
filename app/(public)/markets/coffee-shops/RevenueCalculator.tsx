'use client';

import { useState } from 'react';
import { Receipt } from 'lucide-react';

const PER_SITE_ANNUAL = 18000;

const calcRows = [
  { label: 'Time wasted on one manual temperature check', value: '3 min' },
  { label: 'Manual checks per site, per day', value: '8' },
  { label: 'Time wasted off the counter, per site per day', value: '24 min' },
  { label: 'Peak-time orders that slip away, per day', value: '~10' },
  { label: 'Average transaction value', value: '£5' },
  { label: 'Lost revenue per site, per day', value: '£50' },
  { label: 'Per site, per year (around 360 trading days)', value: '£18,000' },
];

// Snap-to stops so mid-range estates (e.g. 500) are easy to select even though
// the largest global coffee estate is ~41,000 sites.
const siteStops = [
  10, 25, 50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 4000, 6000,
  8000, 12000, 18000, 25000, 41000,
];

const DEFAULT_INDEX = siteStops.indexOf(200);

function formatGBP(n: number) {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `£${m >= 100 ? Math.round(m) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) return `£${Math.round(n / 1000)}k`;
  return `£${n}`;
}

export default function RevenueCalculator() {
  const [index, setIndex] = useState(DEFAULT_INDEX);
  const sites = siteStops[index];
  const total = sites * PER_SITE_ANNUAL;

  return (
    <div className="mt-10 rounded-2xl bg-white/4 border border-white/10 overflow-hidden">
      <div className="px-6 lg:px-8 py-5 border-b border-white/10 flex items-center gap-3">
        <Receipt className="w-5 h-5 text-amber-300" />
        <h3 className="text-base font-semibold text-white">Put a number to it</h3>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1">
          Illustrative
        </span>
      </div>

      <div className="px-6 lg:px-8 py-2">
        {calcRows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-4 py-3.5 ${
              i < calcRows.length - 1 ? 'border-b border-white/6' : ''
            }`}
          >
            <span className="text-sm text-slate-300">{row.label}</span>
            <span className="text-sm lg:text-base font-semibold text-white tabular-nums whitespace-nowrap">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="px-6 lg:px-8 py-6 bg-amber-500/10 border-t border-amber-500/20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <div className="text-sm font-medium text-amber-100">
              Across an estate of
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">
              {sites.toLocaleString()} sites
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-xs uppercase tracking-widest text-amber-200/70 mb-1">
              Revenue never booked, per year
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white tabular-nums whitespace-nowrap">
              {formatGBP(total)}
            </div>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={siteStops.length - 1}
          step={1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
          aria-label="Number of sites in your estate"
        />
        <div className="flex justify-between text-[11px] text-amber-200/60 mt-2">
          <span>10</span>
          <span>Drag to match your estate</span>
          <span>41,000</span>
        </div>
      </div>
    </div>
  );
}
