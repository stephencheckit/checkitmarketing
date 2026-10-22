'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CalendarRange, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { formatWeek, PLAN_WEEKS, weekStart, type CoveragePlan } from '@/lib/gtm-plan';

interface ListData {
  coverage: CoveragePlan;
  customers: number;
  excluded: number;
  worked: number;
  withContacts: number;
}

interface OutreachData {
  lists: ListData[];
  lastSync: { finished_at: string; ok: boolean } | null;
  planUpdatedBy: string | null;
  planUpdatedAt: string | null;
  canEdit: boolean;
  hasData: boolean;
}

const BAR_COLORS = ['bg-blue-500/80', 'bg-sky-400/80', 'bg-indigo-400/80', 'bg-teal-400/80', 'bg-cyan-500/80', 'bg-violet-400/80', 'bg-blue-300/80', 'bg-emerald-400/80', 'bg-sky-600/80'];

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'never';

function doneLabel(c: CoveragePlan) {
  if (c.accounts === 0) return 'No targets';
  return c.weeksToCover > PLAN_WEEKS
    ? `${Math.round((c.coveredIn12m / c.accounts) * 100)}% in 12 months`
    : `done w/c ${formatWeek(c.settings.startDate, c.weeksToCover - 1)}`;
}

/** Gaps worked out from the plan and the synced lists, so they move as the plan changes. */
function findGaps(lists: ListData[]) {
  const gaps: string[] = [];
  const byOwner = new Map<string, ListData[]>();
  for (const l of lists) {
    const c = l.coverage;
    const name = `${c.list.name} (${c.list.region})`;
    if (!c.settings.closer.trim()) gaps.push(`${name}: no closer. Meetings ${c.settings.owner || 'the SDR'} books have nowhere to go.`);
    if (c.accounts > 0 && c.weeksToCover > PLAN_WEEKS)
      gaps.push(`${name}: only ${c.coveredIn12m} of ${c.accounts} accounts reached in 12 months at ${c.settings.perWeek} a week.`);
    if (c.accounts > 0 && c.weeksToCover <= PLAN_WEEKS)
      gaps.push(`${name}: runs out w/c ${formatWeek(c.settings.startDate, c.weeksToCover - 1)}; refill before then to keep ${c.settings.owner || 'the SDR'} busy.`);
    const owner = c.settings.owner.trim();
    if (owner) byOwner.set(owner, [...(byOwner.get(owner) ?? []), l]);
  }
  for (const [owner, ls] of byOwner) {
    if (ls.length > 1) {
      const pace = ls.reduce((s, l) => s + l.coverage.settings.perWeek, 0);
      gaps.push(`${owner} works ${ls.length} lists (${ls.map((l) => l.coverage.list.name).join(', ')}) at ${pace} accounts a week combined.`);
    }
  }
  return gaps;
}

function YearView({ lists }: { lists: ListData[] }) {
  const start = lists.map((l) => l.coverage.settings.startDate).sort()[0];
  if (!start) return null;
  const startMs = weekStart(start, 0).getTime();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = weekStart(start, 0);
    d.setUTCMonth(d.getUTCMonth() + i);
    return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit', timeZone: 'UTC' });
  });
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-60 flex-shrink-0" />
        <div className="flex flex-1">
          {months.map((m) => (
            <span key={m} className="flex-1 text-[11px] text-muted">{m}</span>
          ))}
        </div>
        <div className="w-36 flex-shrink-0" />
      </div>
      {lists.map((l) => {
        const c = l.coverage;
        // Lists may start on different dates; offset them on the shared axis.
        const offset = Math.round((weekStart(c.settings.startDate, 0).getTime() - startMs) / (7 * 864e5));
        return (
          <div key={c.list.id} className="flex items-center gap-3">
            <div className="w-60 flex-shrink-0">
              <div className="text-sm font-medium text-foreground">
                <span className="mr-1.5 rounded border border-border px-1 py-0.5 text-[10px] text-muted">{c.list.region}</span>
                {c.list.name}
              </div>
              <div className="text-[11px] text-muted">
                {c.settings.owner || 'No SDR'} · {c.settings.perWeek}/wk → {c.settings.closer || <span className="text-rose-300">no closer</span>}
              </div>
            </div>
            <div className="relative h-9 flex-1 overflow-hidden rounded bg-border/30">
              {c.segments
                .filter((s) => offset + s.startWeek < PLAN_WEEKS)
                .map((s, i) => (
                  <div
                    key={s.segment}
                    className={`absolute top-0 flex h-9 items-center overflow-hidden border-r border-background/60 px-1.5 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    style={{
                      left: `${((offset + s.startWeek) / PLAN_WEEKS) * 100}%`,
                      width: `${((Math.min(offset + s.endWeek, PLAN_WEEKS) - offset - s.startWeek) / PLAN_WEEKS) * 100}%`,
                    }}
                    title={`${s.segment}: ${s.accounts} accounts, ${formatWeek(c.settings.startDate, s.startWeek)} to ${formatWeek(c.settings.startDate, s.endWeek - 1)}`}
                  >
                    <span className="truncate text-[10px] font-medium text-background">{s.segment}</span>
                  </div>
                ))}
            </div>
            <div className={`w-36 flex-shrink-0 text-right text-[11px] ${c.weeksToCover > PLAN_WEEKS ? 'text-amber-300' : 'text-muted'}`}>{doneLabel(c)}</div>
          </div>
        );
      })}
    </div>
  );
}

function ListPlan({ data }: { data: ListData }) {
  const c = data.coverage;
  const span = Math.max(c.weeksToCover, PLAN_WEEKS);
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          <span className="mr-2 rounded border border-border px-1.5 py-0.5 text-xs text-muted">{c.list.region}</span>
          {c.list.name}
        </h2>
        <div className="text-xs text-muted">
          {c.settings.owner || 'No SDR'} · {c.settings.perWeek} accounts a week · from w/c {formatWeek(c.settings.startDate, 0)} · closer:{' '}
          {c.settings.closer || <span className="text-rose-300">none</span>}
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { label: 'Target accounts', value: c.accounts },
          { label: 'Covered in 12 months', value: c.coveredIn12m },
          { label: 'With Apollo activity', value: data.worked },
          { label: 'With contacts in Apollo', value: data.withContacts },
          { label: 'Held back', value: data.excluded },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-background/40 p-3">
            <div className="text-[11px] uppercase tracking-wide text-muted">{s.label}</div>
            <div className="mt-1 text-xl font-bold tabular-nums text-foreground">{s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <table className="w-full lg:col-span-2">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="py-1">Segment</th>
              <th className="py-1">Accts</th>
              <th className="py-1">1k+</th>
              <th className="py-1">Largest</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {c.segments.map((s) => (
              <tr key={s.segment}>
                <td className="py-1.5 pr-2 text-xs font-medium text-foreground">{s.segment}</td>
                <td className="py-1.5 pr-2 text-xs tabular-nums">{s.accounts}</td>
                <td className="py-1.5 pr-2 text-xs tabular-nums">{s.enterprise}</td>
                <td className="py-1.5 text-[11px] text-muted">{s.examples.slice(0, 2).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lg:col-span-3">
          <div className="mb-2 flex justify-between text-[11px] text-muted">
            <span>w/c {formatWeek(c.settings.startDate, 0)}</span>
            <span>w/c {formatWeek(c.settings.startDate, Math.floor(span / 2))}</span>
            <span>w/c {formatWeek(c.settings.startDate, span - 1)}</span>
          </div>
          <div className="space-y-1.5">
            {c.segments.map((s) => (
              <div key={s.segment} className="flex items-center gap-2">
                <span className="w-44 flex-shrink-0 truncate text-[11px] text-foreground/90">{s.segment}</span>
                <div className="relative h-4 flex-1 rounded bg-border/40">
                  {c.weeksToCover > PLAN_WEEKS ? (
                    <div className="absolute inset-y-0 border-l border-dashed border-amber-400/80" style={{ left: `${(PLAN_WEEKS / span) * 100}%` }} title="12 months" />
                  ) : null}
                  <div
                    className={`absolute h-4 rounded ${s.startWeek >= PLAN_WEEKS ? 'bg-amber-500/60' : 'bg-blue-500/70'}`}
                    style={{ left: `${(s.startWeek / span) * 100}%`, width: `${(Math.max(1, s.endWeek - s.startWeek) / span) * 100}%` }}
                  />
                </div>
                <span className="w-24 flex-shrink-0 text-right text-[11px] text-muted">by {formatWeek(c.settings.startDate, Math.max(0, s.endWeek - 1))}</span>
              </div>
            ))}
          </div>
          {c.settings.orderNote ? <p className="mt-3 text-[11px] text-muted">{c.settings.orderNote}</p> : null}
        </div>
      </div>
    </section>
  );
}

export default function GtmOutreachPage() {
  const [data, setData] = useState<OutreachData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(() => {
    fetch('/api/gtm-outreach')
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body?.error || `Request failed (${r.status})`);
        return body as OutreachData;
      })
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  useEffect(() => load(), [load]);

  const syncNow = async () => {
    setSyncing(true);
    try {
      await fetch('/api/gtm-outreach/sync', { method: 'POST' });
      load();
    } finally {
      setSyncing(false);
    }
  };

  const totals = useMemo(() => {
    if (!data) return null;
    const accounts = data.lists.reduce((s, l) => s + l.coverage.accounts, 0);
    const covered = data.lists.reduce((s, l) => s + l.coverage.coveredIn12m, 0);
    return { accounts, covered };
  }, [data]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <CalendarRange className="h-7 w-7 text-accent" />
              Outreach Plan
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-muted">
              Who prospects which target list, in what order, and when each is covered. Set in{' '}
              <Link href="/gtm-planning" className="text-accent hover:underline">GTM Strategy</Link>; accounts sync from Apollo nightly.
            </p>
            {data ? (
              <p className="mt-2 text-xs text-muted">
                Apollo synced {fmtDate(data.lastSync?.finished_at ?? null)}
                {data.lastSync && !data.lastSync.ok ? ' (last run failed)' : ''} · plan saved {fmtDate(data.planUpdatedAt)}
                {data.planUpdatedBy ? ` by ${data.planUpdatedBy}` : ''}
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Link href="/gtm-planning" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-muted hover:text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Edit plan
            </Link>
            {data?.canEdit ? (
              <button
                type="button"
                onClick={syncNow}
                disabled={syncing}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-muted hover:text-foreground disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing Apollo…' : 'Sync Apollo now'}
              </button>
            ) : null}
          </div>
        </div>

        {error ? <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">{error}</div> : null}
        {!data && !error ? <div className="text-sm text-muted">Loading…</div> : null}
        {data && !data.hasData ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
            No Apollo data yet. The nightly sync fills this in{data.canEdit ? ', or use “Sync Apollo now”.' : '.'}
          </div>
        ) : null}

        {data && data.hasData && totals ? (
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold text-foreground">The year at a glance</h2>
                <span className="text-sm text-muted">
                  {totals.accounts.toLocaleString()} target accounts · {totals.covered.toLocaleString()} reached in 12 months
                </span>
              </div>
              <YearView lists={data.lists} />
            </section>

            <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <h2 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Gaps and resource constraints
              </h2>
              <ul className="grid gap-x-6 gap-y-1.5 text-sm text-foreground/90 md:grid-cols-2">
                {findGaps(data.lists).map((g) => (
                  <li key={g}>• {g}</li>
                ))}
              </ul>
            </section>

            {data.lists.map((l) => (
              <ListPlan key={l.coverage.list.id} data={l} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
