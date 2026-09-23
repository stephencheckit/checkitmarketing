'use client';

// Client-side access to the Apollo target-list payload, shared by the GTM map
// and the GTM planner. Both read the same session-gated endpoint so the counts
// on the two pages can never disagree.

import { useEffect, useState } from 'react';

export interface ApolloListSummary {
  id: string;
  name: string;
  marketId: string;
  segmentId: string;
  /** Accounts actually retrieved — may be capped by the endpoint's page limit */
  accounts: number;
  /** Apollo's own count for the list, before any page cap */
  listedCount: number;
  truncated: boolean;
  withOwner: number;
  stages: Record<string, number>;
}

/**
 * Per-market totals with each account counted once. A market's lists overlap,
 * so summing `ApolloListSummary.accounts` double-counts; use this for any
 * number that feeds a decision.
 */
export interface ApolloMarketSummary {
  marketId: string;
  segmentId: string;
  accounts: number;
  /** Rows summed across lists; the excess over `accounts` is the overlap. */
  listRows: number;
  stages: Record<string, number>;
}

export interface ApolloSnapshot {
  /** `off` is the static view — unauthenticated pages never call Apollo. */
  status: 'off' | 'loading' | 'ready' | 'error';
  lists: ApolloListSummary[];
  markets: ApolloMarketSummary[];
  unmappedLists: { id: string; name: string; count: number }[];
  missingLists: { id: string; name: string; marketId: string; segmentId: string }[];
  fetchedAt: string | null;
  error: string | null;
}

export const EMPTY_SNAPSHOT: ApolloSnapshot = {
  status: 'off',
  lists: [],
  markets: [],
  unmappedLists: [],
  missingLists: [],
  fetchedAt: null,
  error: null,
};

/**
 * Loads the Apollo payload. Returns the static `off` snapshot when disabled,
 * which is what the unauthenticated map preview uses — it must never call the
 * endpoint, since target account names and counts are internal.
 */
export function useApolloLists(enabled: boolean): ApolloSnapshot {
  const [snapshot, setSnapshot] = useState<ApolloSnapshot>(EMPTY_SNAPSHOT);

  useEffect(() => {
    if (!enabled) {
      setSnapshot(EMPTY_SNAPSHOT);
      return;
    }

    let cancelled = false;
    setSnapshot({ ...EMPTY_SNAPSHOT, status: 'loading' });

    fetch('/api/gtm-map/apollo')
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
        return body as {
          lists: ApolloListSummary[];
          markets: ApolloMarketSummary[];
          unmappedLists: ApolloSnapshot['unmappedLists'];
          missingLists: ApolloSnapshot['missingLists'];
          fetchedAt: string;
        };
      })
      .then((body) => {
        if (cancelled) return;
        setSnapshot({
          status: 'ready',
          lists: body.lists,
          markets: body.markets ?? [],
          unmappedLists: body.unmappedLists,
          missingLists: body.missingLists,
          fetchedAt: body.fetchedAt,
          error: null,
        });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setSnapshot({ ...EMPTY_SNAPSHOT, status: 'error', error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return snapshot;
}

// Apollo groups stages as in_progress / succeeded / failed, but that grouping
// is the wrong lens here: "Current Client" and "Active Opportunity" are both
// `succeeded` while meaning opposite things for a prospecting list. So stages
// are bucketed by name, with anything unrecognised falling into `other`.
export type StageBucket = 'client' | 'opportunity' | 'working' | 'cold' | 'dead' | 'other';

const STAGE_BUCKETS: Record<string, StageBucket> = {
  'Current Client': 'client',
  'Active Opportunity': 'opportunity',
  'Sales Qualified Lead': 'working',
  'Marketing Qualified Lead': 'working',
  Subscriber: 'working',
  Evangelist: 'working',
  Cold: 'cold',
  'No stage': 'cold',
  'Dead Opportunity': 'dead',
  'Do Not Prospect': 'dead',
};

export const BUCKET_LABEL: Record<StageBucket, string> = {
  client: 'Client',
  opportunity: 'Active opp',
  working: 'Working',
  cold: 'Cold',
  dead: 'Dead / DNP',
  other: 'Other',
};

export const BUCKET_COLOR: Record<StageBucket, string> = {
  client: 'bg-[#00cccc]',
  opportunity: 'bg-emerald-400',
  working: 'bg-blue-400',
  cold: 'bg-slate-500',
  dead: 'bg-rose-500',
  other: 'bg-slate-600',
};

const BUCKET_ORDER: StageBucket[] = ['client', 'opportunity', 'working', 'cold', 'dead', 'other'];

export interface StageMix {
  accounts: number;
  buckets: { bucket: StageBucket; count: number }[];
  /**
   * Accounts a BDR could actually prospect: excludes current clients, dead
   * opportunities and do-not-prospect. Accounts already at "Active opp" stay
   * in, since they are live deals rather than exhausted names.
   */
  prospectable: number;
  clients: number;
}

function mixFromTally(stages: Record<string, number>, accounts: number): StageMix {
  const totals: Record<StageBucket, number> = {
    client: 0,
    opportunity: 0,
    working: 0,
    cold: 0,
    dead: 0,
    other: 0,
  };
  for (const [stage, count] of Object.entries(stages)) {
    totals[STAGE_BUCKETS[stage] ?? 'other'] += count;
  }

  return {
    accounts,
    buckets: BUCKET_ORDER.filter((b) => totals[b] > 0).map((b) => ({
      bucket: b,
      count: totals[b],
    })),
    prospectable: accounts - totals.client - totals.dead,
    clients: totals.client,
  };
}

/**
 * Stage mix for a market, each account counted once. Prefer this over
 * `bucketListStages` anywhere the number drives a decision.
 */
export function bucketMarketStages(market: ApolloMarketSummary | undefined): StageMix | undefined {
  if (!market) return undefined;
  return mixFromTally(market.stages, market.accounts);
}

/**
 * Stage mix for a set of lists, summing per-list counts. An account in two of
 * the lists is counted twice, so this is only safe for a single list.
 */
export function bucketListStages(lists: ApolloListSummary[]): StageMix {
  const stages: Record<string, number> = {};
  let accounts = 0;
  for (const list of lists) {
    accounts += list.accounts;
    for (const [stage, count] of Object.entries(list.stages)) {
      stages[stage] = (stages[stage] || 0) + count;
    }
  }
  return mixFromTally(stages, accounts);
}

export function marketsById(markets: ApolloMarketSummary[]) {
  const out: Record<string, ApolloMarketSummary> = {};
  for (const m of markets) out[m.marketId] = m;
  return out;
}

export function groupListsByMarket(lists: ApolloListSummary[]) {
  const byMarket: Record<string, ApolloListSummary[]> = {};
  for (const list of lists) {
    (byMarket[list.marketId] ||= []).push(list);
  }
  for (const group of Object.values(byMarket)) {
    group.sort((a, b) => b.accounts - a.accounts);
  }
  return byMarket;
}
