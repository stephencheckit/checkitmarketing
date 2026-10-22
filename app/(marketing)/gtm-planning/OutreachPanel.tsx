'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp, CalendarRange, ExternalLink } from 'lucide-react';
import { buildCoverage, formatWeek, PLAN_WEEKS, type OutreachSettings, type SegmentCount } from '@/lib/gtm-plan';
import { TARGET_LISTS } from '@/lib/gtm-targets';

interface OutreachResponse {
  lists: { coverage: { list: { id: string }; segments: SegmentCount[] } }[];
  lastSync: { finished_at: string } | null;
}

/**
 * Outreach settings per target list, saved into the shared plan. The same
 * settings drive the outreach page and the coverage shown on the GTM map.
 */
export default function OutreachPanel({
  outreach,
  canEdit,
  onChange,
}: {
  outreach: Record<string, OutreachSettings> | null;
  canEdit: boolean;
  onChange: (next: Record<string, OutreachSettings>) => void;
}) {
  const [counts, setCounts] = useState<Record<string, SegmentCount[]>>({});
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gtm-outreach')
      .then((r) => (r.ok ? r.json() : null))
      .then((body: OutreachResponse | null) => {
        if (!body) return;
        setCounts(Object.fromEntries(body.lists.map((l) => [l.coverage.list.id, l.coverage.segments])));
        setSyncedAt(body.lastSync?.finished_at ?? null);
      })
      .catch(() => {});
  }, []);

  const coverage = useMemo(
    () =>
      outreach
        ? TARGET_LISTS.map((l) => buildCoverage(l, outreach[l.id], counts[l.id] ?? []))
        : [],
    [outreach, counts]
  );

  if (!outreach) return null;

  const update = (id: string, patch: Partial<OutreachSettings>) => onChange({ ...outreach, [id]: { ...outreach[id], ...patch } });
  const move = (id: string, segment: string, dir: -1 | 1) => {
    const order = [...outreach[id].order];
    const i = order.indexOf(segment);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    update(id, { order });
  };

  const input = 'w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground disabled:opacity-70';

  return (
    <section className="bg-surface border border-border rounded-xl p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Target lists</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span>Apollo synced {syncedAt ? new Date(syncedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'not yet'}</span>
          <Link href="/gtm-outreach" className="inline-flex items-center gap-1 text-accent hover:underline">
            Open outreach plan <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {coverage.map((c) => {
          const s = outreach[c.list.id];
          const present = new Set(c.segments.map((x) => x.segment));
          return (
            <div key={c.list.id} className="rounded-lg border border-border bg-background/40 p-4">
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <div className="text-sm font-semibold text-foreground">
                  <span className="mr-1.5 rounded border border-border px-1 py-0.5 text-[10px] text-muted">{c.list.region}</span>
                  {c.list.name}
                </div>
                <div className={`text-xs ${c.weeksToCover > PLAN_WEEKS ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {c.accounts} accounts ·{' '}
                  {c.weeksToCover > PLAN_WEEKS
                    ? `${Math.round((c.coveredIn12m / Math.max(1, c.accounts)) * 100)}% in 12 months`
                    : `done w/c ${formatWeek(s.startDate, Math.max(0, c.weeksToCover - 1))}`}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <label className="text-[11px] text-muted">
                  SDR
                  <input className={input} disabled={!canEdit} value={s.owner} onChange={(e) => update(c.list.id, { owner: e.target.value })} />
                </label>
                <label className="text-[11px] text-muted">
                  Closer
                  <input className={input} disabled={!canEdit} value={s.closer} placeholder="None" onChange={(e) => update(c.list.id, { closer: e.target.value })} />
                </label>
                <label className="text-[11px] text-muted">
                  Accounts / week
                  <input
                    className={input}
                    type="number"
                    min={1}
                    max={200}
                    disabled={!canEdit}
                    value={s.perWeek}
                    onChange={(e) => update(c.list.id, { perWeek: Math.max(1, Number(e.target.value) || 1) })}
                  />
                </label>
                <label className="text-[11px] text-muted">
                  Start
                  <input className={input} type="date" disabled={!canEdit} value={s.startDate} onChange={(e) => e.target.value && update(c.list.id, { startDate: e.target.value })} />
                </label>
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-wide text-muted">Segment order</div>
              <ol className="mt-1 space-y-1">
                {s.order
                  .filter((seg) => present.has(seg))
                  .map((seg, i, arr) => {
                    const planned = c.segments.find((x) => x.segment === seg);
                    return (
                      <li key={seg} className="flex items-center gap-2 text-sm">
                        <span className="w-4 text-[11px] tabular-nums text-muted">{i + 1}</span>
                        <span className="flex-1 truncate text-foreground/90">{seg}</span>
                        <span className="text-[11px] tabular-nums text-muted">
                          {planned?.accounts ?? 0} · by {planned ? formatWeek(s.startDate, Math.max(0, planned.endWeek - 1)) : '—'}
                        </span>
                        {canEdit ? (
                          <span className="flex">
                            <button type="button" aria-label={`Move ${seg} up`} disabled={i === 0} onClick={() => move(c.list.id, seg, -1)} className="p-0.5 text-muted hover:text-foreground disabled:opacity-30">
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" aria-label={`Move ${seg} down`} disabled={i === arr.length - 1} onClick={() => move(c.list.id, seg, 1)} className="p-0.5 text-muted hover:text-foreground disabled:opacity-30">
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}
