'use client';

import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Compass,
  Cpu,
  Database,
  Flag,
  Gauge,
  Map as MapIcon,
  ShieldAlert,
  SlidersHorizontal,
  Target,
  Users,
} from 'lucide-react';
import DeckShell, { type Slide } from '@/components/deck/DeckShell';
import { Callout, SectionCard, StatCard } from '@/components/deck/primitives';
import { computePlan, type PlanState } from '@/lib/gtm-plan-math';
import { LiveOverlay, LivePreview, useLiveView } from './LiveView';

export type ExecData = {
  plan: PlanState;
  planIsDefault: boolean;
  planUpdatedAt: string | null;
  installedUkPct: number | null;
  outreachReach: number | null;
  base: {
    customers: number;
    arrUsd: number;
    medicalUsd: number;
    commercialUsd: number;
    ukUsd: number;
    usUsd: number;
    unattributedUsd: number;
    unattributedCustomers: number;
  };
  lists: {
    id: string;
    label: string;
    region: string;
    owner: string;
    closer: string;
    perWeek: number;
    accounts: number;
    coveredIn12m: number;
    coveredBy: string | null;
    customersExcluded: number;
  }[];
  lastSync: string | null;
  baseline: { meetingsBooked: number; meetingsInHubspot: number; apolloOpportunities: number; pulledAt: string };
};

const gbp = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}m`;
  if (Math.abs(n) >= 1_000) return `£${Math.round(n / 1_000)}k`;
  return `£${Math.round(n)}`;
};
const usd = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}m`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
};
const num = (n: number) => Math.round(n).toLocaleString('en-GB');
const pctOf = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);
const date = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'not yet';

function SplitBar({ parts }: { parts: { label: string; value: number; cls: string; display: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-border/40">
        {parts.map((p) => (
          <div key={p.label} className={p.cls} style={{ width: `${(p.value / total) * 100}%` }} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
        {parts.map((p) => (
          <span key={p.label} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${p.cls}`} />
            {p.label} <span className="font-semibold text-foreground">{p.display}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const TOC: Record<string, { group: string; label: string }> = {
  answer: { group: 'The plan', label: 'The answer' },
  start: { group: 'The plan', label: 'Where we start' },
  target: { group: 'The plan', label: 'The target' },
  sources: { group: 'The plan', label: 'Where it comes from' },
  funnel: { group: 'The maths', label: 'The funnel' },
  levers: { group: 'The maths', label: 'Closing the gap' },
  planner: { group: 'The maths', label: 'GTM Strategy tool' },
  coverage: { group: 'Execution', label: 'Coverage' },
  timeline: { group: 'Execution', label: 'Outreach timeline' },
  map: { group: 'Execution', label: 'GTM Map' },
  risk: { group: 'Risks & asks', label: 'Market risk' },
  measurement: { group: 'Risks & asks', label: 'Measurement' },
  decisions: { group: 'Risks & asks', label: 'Decisions' },
};

export default function ExecDeck({ data }: { data: ExecData }) {
  const { plan, base, lists, baseline } = data;
  const live = useLiveView();
  const p = computePlan(plan, { installedUkPct: data.installedUkPct, outreachReach: data.outreachReach });
  const [uk, us] = p.byRegion;
  const reachPct = pctOf(p.sdrArrCapacity, plan.netNew);
  const gap = Math.max(0, p.sdrGap);
  const listsWithoutCloser = lists.filter((l) => !l.closer.trim());
  const totalTargets = lists.reduce((s, l) => s + l.accounts, 0);
  const topMarkets = [...p.marketRows].sort((a, b) => b.arr - a.arr).filter((m) => m.arr > 0).slice(0, 6);
  const winRateNeeded = p.sdrOppsPerYear > 0 && plan.avgDealSize > 0 ? plan.netNew / (p.sdrOppsPerYear * plan.avgDealSize) : null;
  const dealSizeNeeded = p.winsPerYear > 0 ? plan.netNew / p.winsPerYear : null;

  // A lever already at or past what the target needs is reported as enough:
  // pushing it further does nothing while another limit binds.
  const levers: { lever: string; now: string; needed: string | null; note: string }[] = [
    {
      lever: 'Accounts worked a year',
      now: num(p.accountsWorked),
      needed: p.accountsNeeded > p.accountsWorked ? num(p.accountsNeeded) : null,
      note: `At a ${plan.accountToMeetingPct}% meeting rate`,
    },
    {
      lever: 'SDR seats',
      now: String(plan.sdrCount),
      needed: p.sdrsNeeded > plan.sdrCount ? (Math.ceil(p.sdrsNeeded * 10) / 10).toFixed(1) : null,
      note: `At ${plan.meetingsPerSdrPerMonth} meetings per SDR a month`,
    },
    {
      lever: 'Account to meeting rate',
      now: `${plan.accountToMeetingPct}%`,
      needed:
        p.meetingRateNeeded !== null && p.meetingRateNeeded * 100 > plan.accountToMeetingPct
          ? `${Math.round(p.meetingRateNeeded * 100)}%`
          : null,
      note: 'Only helps while SDR capacity has room',
    },
    {
      lever: 'Win rate',
      now: `${plan.closeRatePct}%`,
      needed: winRateNeeded !== null && winRateNeeded * 100 > plan.closeRatePct ? `${Math.round(winRateNeeded * 100)}%` : null,
      note: 'Opportunity to closed-won',
    },
    {
      lever: 'Average deal size',
      now: gbp(plan.avgDealSize),
      needed: dealSizeNeeded !== null && dealSizeNeeded > plan.avgDealSize ? gbp(dealSizeNeeded) : null,
      note: 'First-year ARR per new logo',
    },
  ];
  const leversToPull = levers.filter((l) => l.needed !== null).length;

  const slides: Slide[] = [
    {
      id: 'answer',
      eyebrow: 'Checkit · FY28 go-to-market plan',
      title: `A ${gbp(p.totalArr)} ARR Plan for FY28, and What It Takes to Hit It`,
      body: (
        <div className="space-y-8">
          <p className="max-w-3xl text-lg text-muted">
            The plan asks for {gbp(plan.netNew)} from new logos and {gbp(plan.expansion)} from existing customers. At
            today&apos;s settings the outbound funnel delivers {gbp(p.sdrArrCapacity)} of the new-logo number. This deck
            covers where the revenue comes from, the maths behind it, and what closes the gap.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard label="Target ARR" value={gbp(p.totalArr)} sub="New logos plus expansion" />
            <StatCard label="New logos" value={gbp(plan.netNew)} sub={`${Math.round(p.winsNeeded)} wins at ${gbp(plan.avgDealSize)}`} />
            <StatCard label="Expansion" value={gbp(plan.expansion)} sub="From the installed base" tone="success" />
            <StatCard
              label="Funnel reaches"
              value={`${reachPct}%`}
              sub={gap > 0 ? `${gbp(gap)} short of the new-logo target` : 'Covers the new-logo target'}
              tone={gap > 0 ? 'warning' : 'success'}
            />
          </div>
          <div className="text-sm text-muted">
            {data.planIsDefault
              ? 'Live from the shared GTM plan (not saved yet, showing defaults).'
              : `Live from the shared GTM plan, last saved ${date(data.planUpdatedAt)}.`}
          </div>
        </div>
      ),
    },
    {
      id: 'start',
      eyebrow: 'Starting point',
      title: `${num(base.customers)} Customers and ${usd(base.arrUsd)} of ARR to Build From`,
      body: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard label="Active customers" value={num(base.customers)} />
            <StatCard label="Customer ARR" value={usd(base.arrUsd)} sub="Recorded in USD" />
            <StatCard
              label="Not yet mapped to a market"
              value={usd(base.unattributedUsd)}
              sub={`${num(base.unattributedCustomers)} customers`}
              tone="warning"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SectionCard title="Medical vs commercial" icon={Building2}>
              <SplitBar
                parts={[
                  { label: 'Medical', value: base.medicalUsd, cls: 'bg-blue-500', display: usd(base.medicalUsd) },
                  { label: 'Commercial', value: base.commercialUsd, cls: 'bg-teal-400', display: usd(base.commercialUsd) },
                ]}
              />
            </SectionCard>
            <SectionCard title="UK vs US" icon={Compass}>
              <SplitBar
                parts={[
                  { label: 'UK', value: base.ukUsd, cls: 'bg-indigo-400', display: usd(base.ukUsd) },
                  { label: 'US', value: base.usUsd, cls: 'bg-sky-400', display: usd(base.usUsd) },
                ]}
              />
            </SectionCard>
          </div>
          <Callout tone="accent">
            Expansion is planned from where this base sits; new logos follow the market focus on the next slides.
          </Callout>
        </div>
      ),
    },
    {
      id: 'target',
      eyebrow: 'The target',
      title: `${gbp(p.newPlusExpansion)} Across ${p.activeReps.length} Quota-Carrying Seats`,
      body: (
        <div className="space-y-6">
          <SectionCard title="ARR mix" icon={Target}>
            <SplitBar
              parts={[
                { label: 'New logos', value: plan.netNew, cls: 'bg-blue-500', display: gbp(plan.netNew) },
                { label: 'Expansion', value: plan.expansion, cls: 'bg-sky-400', display: gbp(plan.expansion) },
                ...(plan.renewal > 0 ? [{ label: 'Renewal', value: plan.renewal, cls: 'bg-green-400', display: gbp(plan.renewal) }] : []),
              ]}
            />
          </SectionCard>
          <div className={`grid grid-cols-1 gap-4 ${p.activeReps.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            {p.activeReps.map((r) => (
              <StatCard key={r.id} label={r.isOpen ? `${r.name} · to hire` : r.name} value={gbp(r.quota)} sub={`${pctOf(r.quota, p.newPlusExpansion)}% of quota`} tone={r.isOpen ? 'warning' : 'accent'} />
            ))}
          </div>
          {!p.repsBalanced ? (
            <Callout tone="warning">Quotas add up to {gbp(p.repTotal)}, {gbp(Math.abs(p.repDelta))} {p.repDelta < 0 ? 'short of' : 'over'} the ARR target.</Callout>
          ) : null}
        </div>
      ),
    },
    {
      id: 'sources',
      eyebrow: 'Where it comes from',
      title: `${p.medicalPct}% Medical, ${p.commercialPct}% Commercial; ${Math.round(uk.logos + us.logos)} New Logos Across Two Regions`,
      body: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-3">
            <SectionCard title="Largest markets in the plan" icon={Building2}>
              <div className="space-y-3">
                {topMarkets.map((m) => (
                  <div key={m.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-foreground">
                        {m.label} <span className="text-xs uppercase text-muted">{m.region}</span>
                      </span>
                      <span className="font-semibold text-foreground">{gbp(m.arr)}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-border/40">
                      <div className={`h-2 rounded-full ${m.category === 'medical' ? 'bg-blue-500' : 'bg-teal-400'}`} style={{ width: `${(m.arr / topMarkets[0].arr) * 100}%` }} />
                    </div>
                    {m.beachheads.length ? (
                      <div className="mt-1 text-xs text-muted">Proof points: {m.beachheads.slice(0, 3).map((b) => b.name).join(', ')}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
          <div className="space-y-4 md:col-span-2">
            {[uk, us].map((r) => (
              <SectionCard key={r.region} title={r.region === 'uk' ? 'UK' : 'US'} icon={Compass}>
                <div className="text-3xl font-bold text-foreground">{Math.round(r.logos)} new logos</div>
                <div className="mt-1 text-sm text-muted">
                  {gbp(r.netNew)} new · {gbp(r.expansion)} expansion
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'funnel',
      eyebrow: 'The maths',
      title: gap > 0 ? `The Outbound Funnel Reaches ${gbp(p.sdrArrCapacity)} of ${gbp(plan.netNew)}` : `The Outbound Funnel Covers the ${gbp(plan.netNew)} Target`,
      body: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 items-stretch gap-2 md:grid-cols-9">
            {[
              { label: 'Accounts worked', value: num(p.accountsWorked), sub: plan.accountsWorked === null ? 'from the outreach plan' : 'set in the plan' },
              { label: 'Meetings', value: num(p.meetingsPerYear), sub: `limited by ${p.meetingsLimitedBy}` },
              { label: 'Opportunities', value: num(p.sdrOppsPerYear), sub: `${plan.meetingToOppPct}% of meetings` },
              { label: 'Wins', value: num(p.winsPerYear), sub: `${plan.closeRatePct}% win rate` },
              { label: 'New ARR', value: gbp(p.sdrArrCapacity), sub: `at ${gbp(plan.avgDealSize)} a deal` },
            ].flatMap((s, i, arr) => [
              <div key={s.label} className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 md:col-span-1">
                <div className="text-xs uppercase tracking-wider text-muted">{s.label}</div>
                <div className="mt-1 text-2xl font-bold text-foreground">{s.value}</div>
                <div className="mt-1 text-xs text-muted">{s.sub}</div>
              </div>,
              i < arr.length - 1 ? (
                <div key={`${s.label}-arrow`} className="hidden items-center justify-center md:flex">
                  <ArrowRight className="h-5 w-5 text-blue-400" />
                </div>
              ) : null,
            ])}
          </div>
          <SectionCard title="Against the new-logo target" icon={Gauge}>
            <SplitBar
              parts={[
                { label: 'Funnel delivers', value: Math.min(p.sdrArrCapacity, plan.netNew), cls: 'bg-blue-500', display: gbp(p.sdrArrCapacity) },
                ...(gap > 0 ? [{ label: 'Gap', value: gap, cls: 'bg-yellow-500/70', display: gbp(gap) }] : []),
              ]}
            />
          </SectionCard>
          <Callout tone="accent">
            Hitting {gbp(plan.netNew)} takes {num(p.winsNeeded)} wins, {num(p.oppsNeeded)} opportunities and {num(p.meetingsNeeded)} first
            meetings a year at these rates.
          </Callout>
        </div>
      ),
    },
    {
      id: 'levers',
      eyebrow: 'Closing the gap',
      title: gap > 0 ? `${leversToPull} Levers Can Close ${gbp(gap)}; Here Is What Each Would Need on Its Own` : 'The Levers That Keep the Plan on Track',
      body: (
        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-surface/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Lever</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Today</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Needed alone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Note</th>
                </tr>
              </thead>
              <tbody>
                {levers.map((l) => (
                  <tr key={l.lever} className="border-t border-border/60">
                    <td className="px-4 py-3 text-foreground">{l.lever}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground/80">{l.now}</td>
                    <td className={`px-4 py-3 text-right font-semibold tabular-nums ${l.needed ? 'text-lg text-blue-300' : 'text-sm text-green-300'}`}>
                      {l.needed ?? 'Enough'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{l.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout tone="warning">
            Meetings are capped by whichever runs out first, accounts or SDR time. Today the cap is {p.meetingsLimitedBy}, so
            that is the lever to pull first; realistically the gap closes with a mix.
          </Callout>
        </div>
      ),
    },
    {
      id: 'planner',
      eyebrow: 'The model behind these numbers',
      title: 'Every Number Here Comes From the GTM Strategy Planner',
      body: (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <LivePreview src="/decks/gtm-strategy.png" alt="GTM Strategy planner" target={{ href: '/gtm-planning', title: 'GTM Strategy' }} onOpen={live.open} />
          </div>
          <div className="space-y-3 text-sm text-foreground/90">
            <p>Scenarios, ARR mix, quotas, market focus, region split and the funnel are set in one place and saved as the shared plan.</p>
            <p>Change a setting there and this deck, the GTM Map and the outreach plan update with it.</p>
            <p className="text-muted">Opens the live page full screen; Back returns here. Needs a GTM Tracker login.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'coverage',
      eyebrow: 'Execution',
      title: `${num(totalTargets)} Target Accounts, ${num(data.outreachReach ?? 0)} Worked in the Next 12 Months`,
      body: (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {lists.map((l) => (
              <div key={l.id} className="rounded-xl border border-border bg-surface/60 p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-semibold text-foreground">{l.label}</div>
                  <span className="text-xs uppercase tracking-wider text-muted">{l.region}</span>
                </div>
                <div className="mt-1 text-sm text-muted">
                  {l.owner || 'No SDR'} · {l.perWeek} a week · closer: {l.closer.trim() || <span className="text-yellow-300">none</span>}
                </div>
                <div className="mt-3 h-2 rounded-full bg-border/40">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${pctOf(l.coveredIn12m, l.accounts)}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-foreground">
                    {num(l.coveredIn12m)} of {num(l.accounts)} in 12 months
                  </span>
                  <span className="text-muted">all covered by {l.coveredBy ?? 'n/a'}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-muted">
            Existing customers are excluded from every list. Target lists refresh from Apollo nightly (last sync {date(data.lastSync)}).
          </div>
        </div>
      ),
    },
    {
      id: 'timeline',
      eyebrow: 'Execution',
      title: 'The 12-Month Outreach Timeline',
      body: (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <LivePreview src="/decks/gtm-outreach.png" alt="Outreach plan timeline" target={{ href: '/gtm-outreach', title: 'Outreach Plan' }} onOpen={live.open} />
          </div>
          <div className="space-y-3 text-sm text-foreground/90">
            <p>Each list is worked segment by segment at its weekly pace, so the timeline shows who is prospecting what, and when each list runs out.</p>
            <p>The full plan adds the gaps and resource constraints, and the accounts in every segment.</p>
            <p className="text-muted">Opens the live page full screen; Back returns here. Needs a GTM Tracker login.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'map',
      eyebrow: 'Where we play',
      title: 'The GTM Map Shows the Plan Market by Market',
      body: (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <LivePreview src="/decks/gtm-map.png" alt="GTM Map" target={{ href: '/gtm-map', title: 'GTM Map' }} onOpen={live.open} />
          </div>
          <div className="space-y-3 text-sm text-foreground/90">
            <p>Each market shows its target accounts, who owns outreach, the weekly pace and when the list is fully covered.</p>
            <p>It reads the same shared plan, so it always matches this deck.</p>
            <p className="text-muted">Opens the live page full screen; Back returns here. Needs a GTM Tracker login.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'risk',
      eyebrow: 'Market risk',
      title: 'Competitors Are Consolidating, and Our Primary Reseller Now Belongs to One',
      body: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCard title="Disruptive Technologies" icon={ShieldAlert}>
            <p className="text-sm text-foreground/90">
              SmartSense (Digi) bought DT, our primary reseller and sensor supplier. Supply, pricing and customer messaging all need a plan.
            </p>
          </SectionCard>
          <SectionCard title="All-in-one platforms" icon={Cpu}>
            <p className="text-sm text-foreground/90">
              Competitors are bundling sensors, checklists and analytics into one subscription, and selling on outcomes rather than hardware.
            </p>
          </SectionCard>
          <SectionCard title="Our response" icon={Compass}>
            <p className="text-sm text-foreground/90">
              Second-source sensors, asset health from the data we already collect, and medical services packaged as a priced offer.
            </p>
          </SectionCard>
        </div>
      ),
    },
    {
      id: 'measurement',
      eyebrow: 'Measurement',
      title: 'We Can Measure the Effort. We Can’t Yet Measure the Outcome.',
      body: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              label="Meetings logged in HubSpot"
              value={`${baseline.meetingsInHubspot} of ${baseline.meetingsBooked}`}
              sub="Booked by phone, for one SDR"
              tone="error"
            />
            <StatCard label="Opportunities in Apollo" value={String(baseline.apolloOpportunities)} sub="Apollo isn’t linked to Salesforce" tone="error" />
            <StatCard label="Funnel rates" value="Assumed" sub="Meeting, opportunity and win rates aren’t measured yet" tone="warning" />
          </div>
          <SectionCard title="What fixes it" icon={Database}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Log every SDR meeting in Salesforce, and connect Apollo to Salesforce.</li>
              <li>Agree what counts as a meeting held and a qualified opportunity, the same way in every system.</li>
              <li>Report cost per qualified opportunity monthly once the above is in place.</li>
            </ul>
          </SectionCard>
          <div className="text-sm text-muted">From the SDR baseline, data pulled {baseline.pulledAt}.</div>
        </div>
      ),
    },
    {
      id: 'decisions',
      eyebrow: 'Decisions needed',
      title: 'What We Need From You',
      body: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ...(gap > 0
              ? [{ icon: SlidersHorizontal, title: `Close the ${gbp(gap)} gap`, text: `Choose the mix: more SDR capacity, more accounts, or better conversion. The funnel is ${p.meetingsLimitedBy}-limited today.` }]
              : []),
            ...(listsWithoutCloser.length
              ? [{ icon: Users, title: 'Closers for uncovered lists', text: `${listsWithoutCloser.map((l) => l.label).join(', ')} ${listsWithoutCloser.length === 1 ? 'has' : 'have'} no one to take the meetings.` }]
              : []),
            { icon: CalendarCheck, title: 'Measurement as a priority', text: 'Meetings in Salesforce and Apollo connected, so next quarter’s plan runs on actual rates.' },
            { icon: Cpu, title: 'Sensor supply after DT', text: 'Agree the supply plan and a second-source sensor for the commercial range.' },
            { icon: Flag, title: 'People costs from finance', text: 'SDR and AE costs, so the plan can show cost per qualified opportunity and payback.' },
          ].map((d) => (
            <div key={d.title} className="rounded-xl border border-border bg-surface/60 p-5">
              <div className="flex items-center gap-2">
                <d.icon className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-foreground">{d.title}</h3>
              </div>
              <p className="mt-2 text-sm text-foreground/90">{d.text}</p>
            </div>
          ))}
          <div className="md:col-span-2">
            <Callout tone="accent">
              <span className="inline-flex items-center gap-2">
                <MapIcon className="h-4 w-4" />
                The plan, map and outreach schedule are live in the GTM Tracker and update together.
              </span>
            </Callout>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <DeckShell slides={slides} toc={TOC} title="GTM Plan" subtitle="FY28 · executive summary" />
      <LiveOverlay view={live.view} onClose={live.close} />
    </>
  );
}
