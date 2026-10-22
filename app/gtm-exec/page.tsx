import PasswordGate from '@/components/deck/PasswordGate';
import { GTM_DECK_COOKIE, hasDeckAccess } from '@/lib/deck-auth';
import { getCustomerArrByMarket } from '@/lib/db';
import { GTM_MARKETS } from '@/lib/gtm-markets';
import { getOutreachPlan } from '@/lib/gtm-outreach-data';
import { formatWeek } from '@/lib/gtm-plan';
import { DEFAULT_STATE, installedUkShare, normalizePlan, type PlanState } from '@/lib/gtm-plan-math';
import { snapshot } from '../sdr-baseline/data';
import Deck, { type ExecData } from './Deck';

export const dynamic = 'force-dynamic';

async function loadData(): Promise<ExecData> {
  const [arrRows, outreach] = await Promise.all([getCustomerArrByMarket(), getOutreachPlan()]);

  const marketById = new Map(GTM_MARKETS.map((m) => [m.id, m]));
  const arrByMarket: Record<string, number> = {};
  const base = { customers: 0, arrUsd: 0, medicalUsd: 0, commercialUsd: 0, ukUsd: 0, usUsd: 0, unattributedUsd: 0, unattributedCustomers: 0 };
  for (const r of arrRows) {
    base.customers += r.accounts;
    base.arrUsd += r.arr_usd;
    const m = r.market_id ? marketById.get(r.market_id) : undefined;
    if (!m) {
      base.unattributedUsd += r.arr_usd;
      base.unattributedCustomers += r.accounts;
      continue;
    }
    arrByMarket[m.id] = r.arr_usd;
    if (m.category === 'medical') base.medicalUsd += r.arr_usd;
    else base.commercialUsd += r.arr_usd;
    if (m.region === 'uk') base.ukUsd += r.arr_usd;
    else base.usUsd += r.arr_usd;
  }

  const lists = outreach.lists.map(({ coverage: c, customers }) => ({
    id: c.list.id,
    label: c.list.name,
    region: c.list.region,
    owner: c.settings.owner,
    closer: c.settings.closer,
    perWeek: c.settings.perWeek,
    accounts: c.accounts,
    coveredIn12m: c.coveredIn12m,
    coveredBy: c.accounts ? formatWeek(c.settings.startDate, c.weeksToCover) : null,
    customersExcluded: customers,
  }));

  const dq = snapshot.dataQuality;
  return {
    plan: normalizePlan(outreach.plan.planner as Partial<PlanState> | null) ?? DEFAULT_STATE,
    planIsDefault: !normalizePlan(outreach.plan.planner as Partial<PlanState> | null),
    planUpdatedAt: outreach.plan.updatedAt,
    installedUkPct: installedUkShare(arrByMarket),
    outreachReach: outreach.hasData ? lists.reduce((s, l) => s + l.coveredIn12m, 0) : null,
    base,
    lists,
    lastSync: outreach.lastSync?.finished_at ?? null,
    baseline: {
      meetingsBooked: dq.jordanMeetingsBookedCalls,
      meetingsInHubspot: dq.jordanMeetingsInHubspot,
      apolloOpportunities: dq.apolloOpportunities,
      pulledAt: snapshot.meta.pulledAt.slice(0, 10),
    },
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const authed = await hasDeckAccess(GTM_DECK_COOKIE);
  const params = await searchParams;
  const bypass = process.env.NODE_ENV !== 'production';

  if (!authed && !bypass) {
    return <PasswordGate title="GTM Plan" action="/api/gtm-exec/auth" error={params.error === '1'} />;
  }

  return <Deck data={await loadData()} />;
}
