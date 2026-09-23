import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAccountDetailsForLabel, getAccountStages, getLabels } from '@/lib/apollo';
import { EXCLUDED_APOLLO_LISTS, mappedApolloLists, segmentNodeId } from '@/lib/gtm-markets';

// Building this payload costs roughly one Apollo request per 100 accounts, so
// it is cached rather than rebuilt per page view. The map is a briefing view —
// stage counts that are half an hour stale are fine.
const TTL_MS = 30 * 60 * 1000;

// Pages per list, at 100 accounts each. Bounds the cost of a list that grows
// unexpectedly large.
const MAX_PAGES = 10;

// Apollo rate-limits per minute; a small pool keeps well clear while still
// being much faster than fetching lists one after another.
const CONCURRENCY = 3;

interface ListSummary {
  id: string;
  name: string;
  marketId: string;
  segmentId: string;
  /** Accounts actually retrieved — may be capped by MAX_PAGES */
  accounts: number;
  /** Apollo's own count for the list, before any page cap */
  listedCount: number;
  truncated: boolean;
  withOwner: number;
  stages: Record<string, number>;
}

/**
 * Per-market totals with each account counted once. A market's lists overlap —
 * the same account sits in both a hand-built list and a lookalike cohort — so
 * summing per-list counts overstates the addressable set and makes the
 * planner's required conversion look easier than it is. us-facilities holds 95
 * list rows covering 48 companies.
 */
interface MarketSummary {
  marketId: string;
  segmentId: string;
  /** Distinct accounts across the market's lists. */
  accounts: number;
  /** Rows summed across lists; the excess over `accounts` is the overlap. */
  listRows: number;
  /** Stage tally over distinct accounts. */
  stages: Record<string, number>;
}

interface Payload {
  fetchedAt: string;
  stages: { id: string; name: string; category: string | null }[];
  lists: ListSummary[];
  markets: MarketSummary[];
  /** Account lists in Apollo that no segment claims and that aren't excluded */
  unmappedLists: { id: string; name: string; count: number }[];
  /** Lists this map references that Apollo no longer returns */
  missingLists: { id: string; name: string; marketId: string; segmentId: string }[];
}

let cache: { at: number; payload: Payload } | null = null;

async function inPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function build(): Promise<Payload> {
  const [labels, stages] = await Promise.all([getLabels(), getAccountStages()]);

  const stageName = new Map(stages.map((s) => [s.id, s.name]));
  const labelById = new Map(labels.map((l) => [l.id, l]));

  const mapped = mappedApolloLists();

  const missingLists = mapped
    .filter((m) => !labelById.has(m.id))
    .map((m) => ({
      id: m.id,
      name: m.name,
      marketId: m.marketId,
      segmentId: m.segmentId,
    }));

  const present = mapped.filter((m) => labelById.has(m.id));

  const stageOf = (stageId: string | null) =>
    stageId ? stageName.get(stageId) ?? 'Unknown' : 'No stage';

  const fetched = await inPool(present, CONCURRENCY, async (ref) => {
    const label = labelById.get(ref.id)!;
    const accounts = await getAccountDetailsForLabel(ref.id, MAX_PAGES);

    const stageTally: Record<string, number> = {};
    let withOwner = 0;
    for (const a of accounts) {
      const name = stageOf(a.accountStageId);
      stageTally[name] = (stageTally[name] || 0) + 1;
      if (a.ownerId) withOwner++;
    }

    const summary: ListSummary = {
      id: ref.id,
      // Apollo's current name wins, so a rename shows through immediately.
      name: label.name || ref.name,
      marketId: ref.marketId,
      segmentId: ref.segmentId,
      accounts: accounts.length,
      listedCount: label.cachedCount,
      truncated: accounts.length < label.cachedCount,
      withOwner,
      stages: stageTally,
    };
    return { summary, accounts };
  });

  const lists = fetched.map((f) => f.summary);

  const marketAccounts = new Map<string, Map<string, string>>();
  const marketRows = new Map<string, number>();
  for (const { summary, accounts } of fetched) {
    const seen = marketAccounts.get(summary.marketId) ?? new Map<string, string>();
    for (const a of accounts) {
      // First stage seen wins; the same account carries one stage in Apollo, so
      // any list it appears in reports the same value.
      if (!seen.has(a.id)) seen.set(a.id, stageOf(a.accountStageId));
    }
    marketAccounts.set(summary.marketId, seen);
    marketRows.set(summary.marketId, (marketRows.get(summary.marketId) || 0) + accounts.length);
  }

  const markets: MarketSummary[] = [...marketAccounts.entries()].map(([marketId, seen]) => {
    const stages: Record<string, number> = {};
    for (const stage of seen.values()) stages[stage] = (stages[stage] || 0) + 1;
    return {
      marketId,
      segmentId: segmentNodeId(marketId),
      accounts: seen.size,
      listRows: marketRows.get(marketId) || 0,
      stages,
    };
  });

  const claimed = new Set(mapped.map((m) => m.id));
  const unmappedLists = labels
    .filter(
      (l) => l.modality === 'accounts' && !claimed.has(l.id) && !(l.id in EXCLUDED_APOLLO_LISTS)
    )
    .map((l) => ({ id: l.id, name: l.name, count: l.cachedCount }))
    .sort((a, b) => b.count - a.count);

  return {
    fetchedAt: new Date().toISOString(),
    stages: stages.map((s) => ({ id: s.id, name: s.name, category: s.category })),
    lists,
    markets,
    unmappedLists,
    missingLists,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const refresh = request.nextUrl.searchParams.get('refresh') === '1';
    if (refresh && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - admin required to refresh' }, { status: 403 });
    }

    const fresh = cache && Date.now() - cache.at < TTL_MS;
    if (fresh && !refresh) {
      return NextResponse.json({ ...cache!.payload, cached: true });
    }

    const payload = await build();
    cache = { at: Date.now(), payload };
    return NextResponse.json({ ...payload, cached: false });
  } catch (error) {
    console.error('Error building GTM map Apollo payload:', error);
    return NextResponse.json({ error: 'Failed to load Apollo lists' }, { status: 500 });
  }
}
