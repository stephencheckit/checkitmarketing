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
  cover: { group: 'The plan', label: 'Cover' },
  answer: { group: 'The plan', label: 'The exercise' },
  target: { group: 'The plan', label: 'The target' },
  quarters: { group: 'The plan', label: 'Quarterly goals' },
  sources: { group: 'The plan', label: 'Where it comes from' },
  funnel: { group: 'The maths', label: 'The funnel' },
  planner: { group: 'The maths', label: 'GTM Strategy tool' },
  coverage: { group: 'Execution', label: 'Coverage' },
  timeline: { group: 'Execution', label: 'Outreach timeline' },
  map: { group: 'Execution', label: 'GTM Map' },
  risk: { group: 'Risks & asks', label: 'Market risk' },
  measurement: { group: 'Risks & asks', label: 'Measurement' },
  decisions: { group: 'Risks & asks', label: 'Decisions' },
  outro: { group: 'Risks & asks', label: 'Interactive tools' },
  thanks: { group: 'Risks & asks', label: 'Thanks' },
};

// Pages of the FY28 GTM plan draft (27 Oct). Pages 1 and 13 are blank and left out.
const APPENDIX: { page: number; label: string }[] = [
  { page: 2, label: 'FY28 ARR goals' },
  { page: 3, label: 'ARR gain by initiative' },
  { page: 4, label: 'UK Healthcare' },
  { page: 5, label: 'Global Commercial' },
  { page: 6, label: 'NGMM upsell' },
  { page: 7, label: 'NGMM target accounts' },
  { page: 8, label: 'US Healthcare' },
  { page: 9, label: 'Strategic accounts' },
  { page: 10, label: 'Demand generation' },
  { page: 11, label: 'Summary and owners' },
  { page: 12, label: 'Risks and mitigation' },
];

const FULL_TOC = {
  ...TOC,
  ...Object.fromEntries(APPENDIX.map((a) => [`appendix-${a.page}`, { group: 'Reference: FY28 plan draft', label: a.label }])),
};

const LIVE_TOOLS = [
  { href: '/gtm-planning', title: 'GTM Strategy', text: 'Targets, funnel maths and scenarios' },
  { href: '/gtm-map', title: 'GTM Map', text: 'Market by market coverage' },
  { href: '/gtm-outreach', title: 'Outreach Plan', text: '12-month list schedule' },
];

export default function ExecDeck({ data }: { data: ExecData }) {
  const { plan, lists } = data;
  const live = useLiveView();
  const p = computePlan(plan, { installedUkPct: data.installedUkPct, outreachReach: data.outreachReach });
  const [uk, us] = p.byRegion;
  const reachPct = pctOf(p.sdrArrCapacity, plan.netNew);
  const gap = Math.max(0, p.sdrGap);
  const hasOpenSeat = p.activeReps.some((r) => r.isOpen);
  const listsWithoutCloser = lists.filter((l) => !l.closer.trim());
  const totalTargets = lists.reduce((s, l) => s + l.accounts, 0);
  const topMarkets = [...p.marketRows].sort((a, b) => b.arr - a.arr).filter((m) => m.arr > 0).slice(0, 6);
  const slides: Slide[] = [
    {
      id: 'cover',
      eyebrow: 'Checkit · FY28 go-to-market plan',
      title: 'FY28 Go-to-Market Plan',
      body: (
        <div className="flex min-h-[40vh] flex-col justify-between gap-10">
          <p className="max-w-2xl text-xl text-muted">Executive summary: the revenue target, the maths behind it, and how we execute.</p>
          <div className="text-sm text-muted">
            Created by <span className="font-semibold text-foreground">Stephen Newman</span>
          </div>
        </div>
      ),
    },
    {
      id: 'answer',
      eyebrow: 'The exercise',
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
      id: 'target',
      eyebrow: 'The target',
      title: `${gbp(p.newPlusExpansion)} Across ${p.activeReps.length}${hasOpenSeat ? '*' : ''} Quota-Carrying Seats`,
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
          {hasOpenSeat ? (
            <div className="text-sm text-muted">* One seat is open headcount, and one of the filled seats splits time with other work.</div>
          ) : null}
          {!p.repsBalanced ? (
            <Callout tone="warning">Quotas add up to {gbp(p.repTotal)}, {gbp(Math.abs(p.repDelta))} {p.repDelta < 0 ? 'short of' : 'over'} the ARR target.</Callout>
          ) : null}
        </div>
      ),
    },
    {
      id: 'quarters',
      eyebrow: 'The target',
      title: `${gbp(p.regionGoals.us)} From the US, ${gbp(p.regionGoals.uk)} From UK and RoW, Phased by Quarter`,
      body: (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-surface/80">
                <tr>
                  {['Region', 'Q1', 'Q2', 'Q3', 'Q4', 'FY28'].map((h, i) => (
                    <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${i ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(['uk', 'us'] as const).map((region) => (
                  <tr key={region} className="border-t border-border/60">
                    <td className="px-4 py-3 text-foreground">{region === 'uk' ? 'UK / RoW' : 'US'}</td>
                    {plan.quarterly[region].map((v, q) => (
                      <td key={q} className="px-4 py-3 text-right tabular-nums text-foreground/80">{gbp(v)}</td>
                    ))}
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">{gbp(p.regionGoals[region])}</td>
                  </tr>
                ))}
                <tr className="border-t border-border bg-surface/60">
                  <td className="px-4 py-3 font-semibold text-foreground">Total</td>
                  {p.quarterTotals.map((v, q) => (
                    <td key={q} className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">{gbp(v)}</td>
                  ))}
                  <td className="px-4 py-3 text-right font-bold tabular-nums text-foreground">{gbp(p.regionGoals.uk + p.regionGoals.us)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard label="Gross revenue retention" value={`${plan.grrTargetPct}%`} sub="Includes notified terminations" />
            <StatCard label="Net revenue retention" value={`${plan.nrrTargetPct}%`} />
            <StatCard label="New terminations" value={`< ${gbp(plan.terminationCap)}`} sub="For the GRR target to hold" tone="warning" />
          </div>
          {!p.quartersBalanced ? (
            <Callout tone="warning">
              Quarters add up to {gbp(p.regionGoals.uk + p.regionGoals.us)}, {gbp(Math.abs(p.quarterlyDelta))} {p.quarterlyDelta < 0 ? 'short of' : 'over'} the ARR target.
            </Callout>
          ) : null}
        </div>
      ),
    },
    {
      id: 'sources',
      eyebrow: 'Where it comes from',
      title: `${Math.round(uk.logos + us.logos)} New Logos Across Two Regions`,
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
              <SectionCard key={r.region} title={r.region === 'uk' ? 'UK / RoW' : 'US'} icon={Compass}>
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
      title: 'Apollo, HubSpot and Salesforce Now Sync. Next, Every Meeting Has to Be Logged.',
      body: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatCard label="Apollo, HubSpot, Salesforce" value="Syncing" sub="Connected and syncing" tone="success" />
            <StatCard label="Funnel rates" value="Assumed" sub="Meeting, opportunity and win rates aren’t measured yet" tone="warning" />
          </div>
          <SectionCard title="What’s next" icon={Database}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Train SDRs on the new “meeting scheduled date” process, so every meeting is dated and counted.</li>
              <li>Agree what counts as a meeting held and a qualified opportunity, the same way in every system.</li>
              <li>Report cost per qualified opportunity monthly once the rates are measured.</li>
            </ul>
          </SectionCard>
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
            { icon: CalendarCheck, title: 'Measurement as a priority', text: 'SDRs trained on the meeting scheduled date process, so next quarter’s plan runs on actual rates.' },
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
    {
      id: 'outro',
      eyebrow: 'Interactive tools',
      title: 'Interactive Tools',
      body: (
        <div className="flex min-h-[40vh] flex-col justify-between gap-10">
          <p className="max-w-2xl text-xl text-muted">
            {gbp(p.totalArr)} of ARR in FY28. The funnel covers {reachPct}% of the new-logo number at today&apos;s settings
            {gap > 0 ? `, leaving ${gbp(gap)} to close.` : '.'}
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {LIVE_TOOLS.map((t) => (
              <button
                key={t.href}
                onClick={() => live.open({ href: t.href, title: t.title })}
                className="group rounded-xl border border-border bg-surface/60 p-5 text-left transition-colors hover:border-blue-400/60"
              >
                <div className="flex items-center justify-between font-semibold text-foreground">
                  {t.title}
                  <ArrowRight className="h-4 w-4 text-blue-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-1 text-sm text-muted">{t.text}</p>
              </button>
            ))}
          </div>
          <div className="text-sm text-muted">The plan, map and outreach schedule are live in the GTM Tracker and update together.</div>
        </div>
      ),
    },
    {
      id: 'thanks',
      eyebrow: 'Checkit · FY28 go-to-market plan',
      title: 'THANKS!',
      body: <div className="min-h-[40vh]" />,
    },
    ...APPENDIX.map((a) => ({
      id: `appendix-${a.page}`,
      eyebrow: `Reference · FY28 plan draft, page ${a.page}`,
      title: a.label,
      body: (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/api/gtm-exec/appendix/${a.page}`} alt={`FY28 plan draft, page ${a.page}`} className="mx-auto w-full max-w-5xl rounded-lg border border-border" />
      ),
    })),
  ];

  return (
    <>
      <DeckShell slides={slides} toc={FULL_TOC} title="GTM Plan" subtitle="FY28 · executive summary" />
      <LiveOverlay view={live.view} onClose={live.close} />
    </>
  );
}
