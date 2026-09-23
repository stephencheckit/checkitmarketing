import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getCustomerArrByMarket } from '@/lib/db';
import { GTM_MARKETS } from '@/lib/gtm-markets';

/**
 * Active customer ARR per market, so the planner can weight focus by where
 * revenue actually sits instead of splitting each category evenly. Per-customer
 * ARR is internal, so only market-level totals leave the server.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await getCustomerArrByMarket();
    const known = new Set(GTM_MARKETS.map((m) => m.id));

    const markets = rows
      .filter((r) => r.market_id && known.has(r.market_id))
      .map((r) => ({
        marketId: r.market_id as string,
        customers: r.accounts,
        arrUsd: r.arr_usd,
      }));

    // Surfaced rather than dropped: ARR the classifier could not place, or
    // placed on a market the planner no longer carries, is invisible to the
    // weighting and would otherwise silently understate the base.
    const unattributed = rows
      .filter((r) => !r.market_id || !known.has(r.market_id))
      .reduce(
        (acc, r) => ({
          customers: acc.customers + r.accounts,
          arrUsd: acc.arrUsd + r.arr_usd,
        }),
        { customers: 0, arrUsd: 0 }
      );

    return NextResponse.json({
      markets,
      unattributed,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error loading customer ARR by market:', error);
    return NextResponse.json({ error: 'Failed to load customer ARR' }, { status: 500 });
  }
}
