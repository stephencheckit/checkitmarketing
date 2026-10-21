'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  CircleDashed,
  Phone,
  Mail,
  CalendarCheck,
  Target,
  Database,
  Link2,
  Users,
  Scale,
  Compass,
  Lightbulb,
  ShieldAlert,
  Flag,
  Building2,
  Stethoscope,
  HandCoins,
  Route,
  Sparkles,
  TrendingDown,
  Layers,
  Cpu,
  Gauge,
} from 'lucide-react';
import Image from 'next/image';
import { snapshot } from './data';
import { rampTransactions, rampSnapshotMeta } from '@/lib/ramp-snapshot';

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body: React.ReactNode;
};

const fmt = (n: number) => n.toLocaleString('en-GB');
const pct = (num: number, den: number) => (den ? `${((num / den) * 100).toFixed(num / den < 0.1 ? 1 : 0)}%` : 'n/a');

const rep = (name: string) => snapshot.repTotals.find((r) => r.rep === name)!;
const jordan = rep('Jordan Ernest');
const tom = rep('Tom Flaskett');
const bryan = rep('Bryan Blitman');
const dq = snapshot.dataQuality;

const bookedTotal = Object.values(snapshot.bookedMarkets).reduce((a, b) => a + b, 0);
const ovgBooked = (snapshot.bookedMarkets as Record<string, number>)['Venues (OVG estate)'] ?? 0;
const sdrTouchedMeetings = snapshot.meetingAccounts.filter((m) => m.sdrTouches > 0);
const primrose = sdrTouchedMeetings.find((m) => m.domain === 'primroseretirement.com');
const weeksBetween = (from: string, to: string) =>
  Math.round((new Date(to).getTime() - new Date(from).getTime()) / (7 * 24 * 60 * 60 * 1000));
const peakTomMonth = snapshot.monthly.reduce((a, b) => (b.tomLoggedCalls > a.tomLoggedCalls ? b : a));
const lastFullMonth = snapshot.monthly[snapshot.monthly.length - 2];

// SDR tooling visible on the marketing card in Ramp. Google Ads and other
// marketing spend are inbound costs and deliberately excluded here.
const SDR_TOOL_VENDORS = ['Apollo.io', 'Phantombuster', 'LinkedIn'];

function completeMonthsInWindow(start: string, end: string) {
  const months: string[] = [];
  const d = new Date(`${start.slice(0, 7)}-01T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  while (d < endDate) {
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    if (next <= endDate && d >= new Date(`${start}T00:00:00Z`)) months.push(d.toISOString().slice(0, 7));
    d.setTime(next.getTime());
  }
  return months;
}

const rampMonths = completeMonthsInWindow(rampSnapshotMeta.windowStart, rampSnapshotMeta.windowEnd);
const toolCosts = SDR_TOOL_VENDORS.map((vendor) => {
  const spend = rampTransactions
    .filter((t) => t.merchant === vendor && rampMonths.includes(t.date.slice(0, 7)))
    .reduce((a, t) => a + t.amount, 0);
  return { vendor, monthly: rampMonths.length ? spend / rampMonths.length : 0 };
});
const toolMonthly = toolCosts.reduce((a, t) => a + t.monthly, 0);
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

function StatCard({
  label,
  value,
  sub,
  tone = 'accent',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'accent' | 'success' | 'warning' | 'error';
}) {
  const toneMap = {
    accent: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-300',
    success: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-300',
    warning: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-300',
    error: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-300',
  } as const;
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${toneMap[tone]} p-5 backdrop-blur-sm`}>
      <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
      <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
      {sub && <div className="mt-1 text-sm text-muted">{sub}</div>}
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Callout({ tone = 'success', children }: { tone?: 'success' | 'warning' | 'accent'; children: React.ReactNode }) {
  const map = {
    success: 'border-green-500/30 bg-green-500/5 text-green-200',
    warning: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-200',
    accent: 'border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent text-foreground/90',
  } as const;
  return <div className={`rounded-xl border p-4 text-sm ${map[tone]}`}>{children}</div>;
}

type Status = 'have' | 'partial' | 'missing';
function StatusPill({ status }: { status: Status }) {
  const map = {
    have: { icon: CheckCircle2, label: 'Have it', cls: 'text-green-300 bg-green-500/10 border-green-500/30' },
    partial: { icon: AlertTriangle, label: 'Partial', cls: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30' },
    missing: { icon: XCircle, label: 'Not yet', cls: 'text-red-300 bg-red-500/10 border-red-500/30' },
  } as const;
  const { icon: Icon, label, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function FunnelStep({ label, value, sub, unknown }: { label: string; value: string; sub?: string; unknown?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        unknown ? 'border-dashed border-border bg-transparent' : 'border-blue-500/30 bg-blue-500/10'
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
        <span className={`text-xl font-bold ${unknown ? 'text-muted' : 'text-foreground'}`}>{value}</span>
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

const th = 'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted';
const td = 'px-3 py-2 text-sm text-foreground/90';

const requestRows: { item: string; status: Status; where: string }[] = [
  { item: 'SDR activity (calls, emails)', status: 'have', where: 'Apollo, July 2025 to today, by rep, month and market' },
  { item: 'Meetings booked', status: 'partial', where: 'Jordan’s call outcomes only; Tom’s meetings are not recorded in any system we can read' },
  { item: 'Meetings held', status: 'partial', where: 'Only where the AE recorded the call or it was logged in HubSpot' },
  { item: 'Qualified opportunities', status: 'missing', where: 'Salesforce. Apollo has 0 opportunities and no Salesforce link' },
  { item: 'Pipeline created / closed-won ARR', status: 'missing', where: 'Salesforce opportunity export needed' },
  { item: 'Split by source, geography, period', status: 'partial', where: 'Geography and period yes; source needs a Salesforce source field' },
  { item: 'Costs (campaigns, agencies, data, tools)', status: 'partial', where: 'Tool spend on the marketing card only; salaries, agencies and data contracts sit with finance' },
  { item: 'Cost per qualified opportunity', status: 'missing', where: 'Needs both of the above' },
  { item: 'SDR-sourced vs SDR-influenced', status: 'partial', where: 'Rules drafted (see attribution rules); can be applied once opportunities are exported' },
];

const maxBar = Math.max(...snapshot.monthly.flatMap((m) => [m.jordanDials, m.tomLoggedCalls, m.tomEmails, m.bryanDials]));

function MonthlyChart() {
  const series = [
    { key: 'jordanDials', label: 'Jordan dials', cls: 'bg-blue-400' },
    { key: 'tomLoggedCalls', label: 'Tom logged calls', cls: 'bg-yellow-400' },
    { key: 'tomEmails', label: 'Tom emails', cls: 'bg-teal-400' },
    { key: 'bryanDials', label: 'Bryan dials', cls: 'bg-purple-400' },
  ] as const;
  return (
    <div>
      <div className="flex h-56 items-end gap-2">
        {snapshot.monthly.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-48 w-full items-end justify-center gap-[2px]">
              {series.map((s) => (
                <div
                  key={s.key}
                  className={`w-1/4 rounded-t ${s.cls}`}
                  style={{ height: `${(m[s.key] / maxBar) * 100}%` }}
                  title={`${s.label}: ${fmt(m[s.key])}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted">{m.month.slice(2).replace('-', '/')}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${s.cls}`} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const inbound = snapshot.inbound;

const threatTone = {
  High: 'border-red-500/30 bg-red-500/10 text-red-300',
  Medium: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
  Watch: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
} as const;

const landscape: { name: string; plays: string; move: string; threat: keyof typeof threatTone }[] = [
  { name: 'SmartSense (Digi)', plays: 'Food, retail, healthcare · US, now Europe', move: 'Bought Jolt (SmartSense ONE, Jan 2026) and Disruptive Technologies (Oct 2026)', threat: 'High' },
  { name: 'Rees Scientific', plays: 'US hospital pharmacy, blood bank, labs', move: 'Helix platform (May 2026); PE-owned; own calibration lab', threat: 'High' },
  { name: 'JTF Wireless', plays: 'UK NHS pathology', move: 'Won Cwm Taf (£126k) and UHB Birmingham pathology awards in 2026', threat: 'High' },
  { name: 'Navitas', plays: 'UK multi-site hospitality, care', move: 'Sensors plus training and consultancy; 15,000+ locations', threat: 'Medium' },
  { name: 'Copeland / Dickson', plays: 'Pharma, healthcare, cold chain', move: 'Closed the Dickson acquisition', threat: 'Medium' },
  { name: 'Primex OneVue · XiltriX', plays: 'US multi-site healthcare · US labs', move: 'Service-led monitoring; XiltriX adds 24/7 alarm response', threat: 'Medium' },
  { name: 'Crunchtime · Ladle', plays: 'US restaurant and multi-unit food', move: 'AI analyst and photo review; ComplianceMate rolled into Ladle', threat: 'Medium' },
  { name: 'Trail · Testo Saveris', plays: 'UK and EU food checklists and loggers', move: 'AI copilot (Trail); new cook-to-chill sensor (Testo)', threat: 'Medium' },
  { name: 'AI-native apps (Hubl, FoodDocs)', plays: 'UK small and mid food operators', move: 'From £19 a site a month, monthly rolling contracts', threat: 'Watch' },
  { name: 'KLATU TRAXX · Service Insight', plays: 'Life science labs', move: 'Predictive asset health from existing temperature data', threat: 'Watch' },
];

const roadmap = [
  {
    theme: 'Sensor independence',
    why: 'DT now belongs to SmartSense',
    icon: Cpu,
    now: 'Contract and supply review; last-time buy; customer and rep messaging',
    next: 'Qualify a second-source sensor; move the commercial range onto our own and second-source hardware',
    later: 'Open, sensor-agnostic platform: bring your own sensor, positioned against closed bundles',
  },
  {
    theme: 'Asset health and AI',
    why: 'Buyers want early warning, not alarms',
    icon: Gauge,
    now: 'CAM+ customers onto the new platform (NGMM)',
    next: 'Asset health score from the temperature data we already collect; “what to do next” on every alert',
    later: 'Predictive maintenance work orders and energy scoring',
  },
  {
    theme: 'Workflow and evidence (CWM)',
    why: 'FM is the shared US and UK beachhead',
    icon: CheckCircle2,
    now: 'Route support requests out of sales forms, into the app',
    next: 'Per-client-site packs and audit reports for contract caterers and FM',
    later: 'FDA traceability (FSMA 204) records ahead of July 2028: build or partner',
  },
  {
    theme: 'Medical services',
    why: 'Rees and XiltriX win on service',
    icon: Stethoscope,
    now: 'Package existing calibration and temperature mapping as a priced offer',
    next: 'IQ/OQ validation for US labs and plasma',
    later: 'Managed alarm response as an add-on',
  },
  {
    theme: 'Commercial model',
    why: 'Bundled subscriptions are becoming the norm',
    icon: HandCoins,
    now: 'Model a sensors-included subscription',
    next: 'Pilot it on new commercial deals',
    later: 'Make it the default if win rate and margin hold',
  },
];

const okrs = [
  {
    owner: 'GTM · Sales and marketing',
    icon: Target,
    objective: 'Make SDR pipeline measurable and trusted',
    krs: [
      { kr: 'SDR meetings logged as Salesforce events', baseline: `${pct(dq.jordanMeetingsInHubspot, dq.jordanMeetingsBookedCalls)} (${dq.jordanMeetingsInHubspot} of ${dq.jordanMeetingsBookedCalls})`, target: '90%+' },
      { kr: 'New opportunities with a primary source set', baseline: 'TBC', target: '100%' },
      { kr: 'Cost per SDR-sourced qualified opportunity reported monthly', baseline: 'not reported', target: 'monthly from Jan 2027' },
      { kr: 'Junk and support submissions reaching the MQL count', baseline: `${inbound?.scannerJunkMarkedMql ?? 'TBC'} junk MQLs since Jul`, target: '0' },
    ],
  },
  {
    owner: 'Product and operations',
    icon: Cpu,
    objective: 'Come through the Digi / DT transition without losing a customer',
    krs: [
      { kr: 'Partner agreement reviewed and supply plan agreed', baseline: 'not started', target: 'end Nov 2026' },
      { kr: 'Second-source sensor qualified for the commercial range', baseline: 'none', target: 'end Q1 2027' },
      { kr: 'New commercial deployments on non-DT hardware', baseline: 'TBC', target: 'majority by end Q2 2027' },
      { kr: 'Churn attributable to the transition', baseline: '0', target: '0' },
    ],
  },
  {
    owner: 'Product',
    icon: Gauge,
    objective: 'Compete on outcomes, not sensors',
    krs: [
      { kr: 'Asset health score in beta with CAM+ / CAM customers', baseline: '0', target: '5 customers by Q2 2027' },
      { kr: 'CAM+ estate migrated to the new platform', baseline: 'TBC', target: 'set with product' },
      { kr: 'Validation and calibration package sold to a US lab', baseline: 'not packaged', target: 'first deal by Q2 2027' },
    ],
  },
  {
    owner: 'Commercial · US and UK',
    icon: Building2,
    objective: 'Make facilities management the shared transatlantic beachhead',
    krs: [
      { kr: 'Per-client-site FM pack live with an FM customer', baseline: 'none', target: 'one live by Q2 2027' },
      { kr: 'SDR-sourced qualified opps from the FM target lists', baseline: 'not measurable', target: 'set after first clean quarter' },
      { kr: 'FM accounts worked (US and UK lists)', baseline: `${(snapshot.targets.find((t) => t.list === 'FM - US')?.worked ?? 0) + (snapshot.targets.find((t) => t.list === 'FM - UK')?.worked ?? 0)} of ${(snapshot.targets.find((t) => t.list === 'FM - US')?.accounts ?? 0) + (snapshot.targets.find((t) => t.list === 'FM - UK')?.accounts ?? 0)}`, target: 'all, by end Q1 2027' },
    ],
  },
];

const slides: Slide[] = [
  {
    id: 'cover',
    eyebrow: 'Checkit · GTM baseline for the 18 to 24 month plan',
    title: 'SDR Baseline: What We Did, What We Can Prove, and the Plan for the Rest',
    body: (
      <div className="space-y-8">
        <p className="max-w-3xl text-lg text-muted">
          A first pass at the SDR baseline from the systems we can read today (Apollo and HubSpot). The
          effort is real and measurable. Outcomes after the first meeting live in Salesforce, which is not
          connected yet, so this is the baseline for activity plus a plan to close the rest.
          Part 2 covers inbound, the competitive landscape, the Disruptive Technologies acquisition, a
          product roadmap and proposed OKRs.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Calls logged" value={fmt(jordan.dials + jordan.loggedCalls + tom.dials + tom.loggedCalls + bryan.dials + bryan.loggedCalls)} sub={`Since ${snapshot.meta.window.slice(0, 7)}`} />
          <StatCard label="Sequence emails sent" value={fmt(jordan.emails + tom.emails + bryan.emails)} sub="Apollo sequences, all SDRs" />
          <StatCard label="Meetings booked by phone" value={fmt(bookedTotal)} sub="From Apollo call outcomes" tone="success" />
          <StatCard label="Logged in HubSpot" value={`${fmt(dq.jordanMeetingsInHubspot)} of ${fmt(dq.jordanMeetingsBookedCalls)}`} sub="Jordan’s meetings: the attribution gap in one number" tone="error" />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <Sparkles className="h-4 w-4 text-blue-400" />
          Data pulled {snapshot.meta.pulledAt.slice(0, 10)}. {snapshot.meta.quarters}. Every number traces to a script, not a spreadsheet.
        </div>
      </div>
    ),
  },
  {
    id: 'answer',
    eyebrow: 'The short answer',
    title: 'We Can Baseline the Effort. We Can’t Yet Baseline the Outcome.',
    body: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCard title="Solid today" icon={CheckCircle2}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Calls and emails by rep, month and market</li>
              <li>Reply rates by sequence and market</li>
              <li>Meetings Jordan booked by phone ({fmt(jordan.meetingsBooked)})</li>
            </ul>
          </SectionCard>
          <SectionCard title="Partial" icon={AlertTriangle}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Meetings held: only where an AE recorded or logged them</li>
              <li>Tom’s meetings: positive replies are visible, bookings are not</li>
              <li>Tool costs: marketing card only</li>
            </ul>
          </SectionCard>
          <SectionCard title="Needs Salesforce" icon={XCircle}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Qualified opportunities and pipeline created</li>
              <li>Closed-won ARR</li>
              <li>Cost per qualified opportunity</li>
            </ul>
          </SectionCard>
        </div>
        <Callout tone="accent">
          <strong>The headline for the plan:</strong> the SDRs have generated measurable activity and real
          meetings, but no system links that work to an opportunity. Apollo holds {dq.apolloOpportunities}{' '}
          opportunities and {dq.apolloContactsWithSalesforceId} of {fmt(dq.apolloContactsChecked)} engaged contacts carry a
          Salesforce ID. Fixing that link is the single biggest unlock.
        </Callout>
      </div>
    ),
  },
  {
    id: 'request',
    eyebrow: 'The ask, line by line',
    title: 'Where Each Part of the Request Stands',
    body: (
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-surface/80">
            <tr>
              <th className={th}>Requested</th>
              <th className={th}>Status</th>
              <th className={th}>Source / what’s needed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requestRows.map((r) => (
              <tr key={r.item}>
                <td className={`${td} font-medium`}>{r.item}</td>
                <td className={td}><StatusPill status={r.status} /></td>
                <td className={`${td} text-muted`}>{r.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: 'team',
    eyebrow: 'Who did what',
    title: 'Three Seats, Three Very Different Motions',
    body: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCard title={`Jordan · ${jordan.region}`} icon={Phone}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li><strong>Phone-led.</strong> {fmt(jordan.dials)} dials, {fmt(jordan.conversations)} conversations of {snapshot.meta.conversationSeconds}s+</li>
              <li>{fmt(jordan.meetingsBooked)} meetings booked by phone; {fmt(jordan.emails)} emails</li>
              <li>Active {jordan.firstActivity} on; last dial {jordan.lastDial}</li>
            </ul>
          </SectionCard>
          <SectionCard title={`Tom · ${tom.region}`} icon={Mail}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li><strong>Email-led.</strong> {fmt(tom.emails)} sequence emails, {fmt(tom.replies)} replies ({pct(tom.replies, tom.emails)})</li>
              <li>{fmt(tom.positiveReplies)} positive replies or referrals; {fmt(tom.willingToMeet)} explicit “willing to meet”</li>
              <li>{fmt(tom.loggedCalls)} calls logged, but outside the Apollo dialer</li>
            </ul>
          </SectionCard>
          <SectionCard title={`Bryan · ${bryan.region}`} icon={Stethoscope}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li><strong>New seat,</strong> started {bryan.firstActivity}, US medical / labs</li>
              <li>{fmt(bryan.dials)} dials, {fmt(bryan.emails)} emails, {fmt(bryan.meetingsBooked)} meeting booked</li>
              <li>Too early to baseline; useful as the clean-process pilot</li>
            </ul>
          </SectionCard>
        </div>
        <Callout tone="warning">
          Tom’s calls carry no duration or connection data because they were logged by hand, so we can’t
          tell a conversation from a no-answer. That’s a tooling gap, not a judgement on the work.
        </Callout>
      </div>
    ),
  },
  {
    id: 'quarterly',
    eyebrow: 'Activity baseline',
    title: 'Activity by Rep and Quarter',
    body: (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-surface/80">
              <tr>
                {['Rep', 'Quarter', 'Dials', 'Conversations', 'Logged calls', 'Mtgs booked', 'Emails', 'Replies', 'Positive'].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {snapshot.activity.map((r) => (
                <tr key={`${r.rep}-${r.quarter}`}>
                  <td className={`${td} font-medium`}>{r.rep.split(' ')[0]}</td>
                  <td className={td}>{r.quarter}</td>
                  <td className={td}>{fmt(r.dials)}</td>
                  <td className={td}>{fmt(r.conversations)}</td>
                  <td className={td}>{fmt(r.loggedCalls)}</td>
                  <td className={td}>{fmt(r.meetingsBooked)}</td>
                  <td className={td}>{fmt(r.emails)}</td>
                  <td className={td}>{fmt(r.replies)}</td>
                  <td className={td}>{fmt(r.positiveReplies)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Dials and conversations come from the Apollo dialer (conversation = {snapshot.meta.conversationSeconds}s or longer).
          Logged calls were entered by hand with no duration. Positive = willing to meet, follow-up question or referral.
          Q4 2026 is quarter to date.
        </p>
      </div>
    ),
  },
  {
    id: 'trend',
    eyebrow: 'The trend',
    title: 'Activity Peaked in Early 2026 and Has Fallen Since',
    body: (
      <div className="space-y-5">
        <MonthlyChart />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="Tom logged calls, peak month"
            value={fmt(peakTomMonth.tomLoggedCalls)}
            sub={`${peakTomMonth.month} vs ${fmt(lastFullMonth.tomLoggedCalls)} in ${lastFullMonth.month}`}
            tone="warning"
          />
          <StatCard label="Jordan’s last dial" value={jordan.lastDial ?? 'n/a'} sub="Email-only since; sequences restarted in October" tone="warning" />
          <StatCard label="Tom emails, last full month" value={fmt(lastFullMonth.tomEmails)} sub="Email volume has held up" tone="accent" />
        </div>
        <Callout tone="warning">
          Worth understanding before we set targets: is the drop a role change, a list running dry, or a
          deliberate shift to email? The answer changes what “baseline” we plan from.
        </Callout>
      </div>
    ),
  },
  {
    id: 'funnels',
    eyebrow: 'The funnel, as far as the data goes',
    title: 'Activity to Meetings Is Visible. After That, It Goes Dark.',
    body: (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionCard title="Jordan · US · phone-led" icon={Phone}>
          <div className="space-y-2">
            <FunnelStep label="Dials" value={fmt(jordan.dials)} />
            <FunnelStep label="Conversations (60s+)" value={fmt(jordan.conversations)} sub={`${pct(jordan.conversations, jordan.dials)} of dials`} />
            <FunnelStep label="Meetings booked" value={fmt(jordan.meetingsBooked)} sub={`${pct(jordan.meetingsBooked, jordan.conversations)} of conversations`} />
            <FunnelStep label="Meetings held" value="?" sub="Partially visible via AE call recordings" unknown />
            <FunnelStep label="Qualified opps / pipeline / ARR" value="?" sub="Salesforce" unknown />
          </div>
        </SectionCard>
        <SectionCard title="Tom · UK & Europe · email-led" icon={Mail}>
          <div className="space-y-2">
            <FunnelStep label="Emails sent" value={fmt(tom.emails)} />
            <FunnelStep label="Replies" value={fmt(tom.replies)} sub={`${pct(tom.replies, tom.emails)} of emails`} />
            <FunnelStep label="Positive replies / referrals" value={fmt(tom.positiveReplies)} sub={`${fmt(tom.willingToMeet)} explicit “willing to meet”`} />
            <FunnelStep label="Meetings booked / held" value="?" sub="Not recorded in Apollo or HubSpot" unknown />
            <FunnelStep label="Qualified opps / pipeline / ARR" value="?" sub="Salesforce" unknown />
          </div>
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'markets',
    eyebrow: 'Where the effort went',
    title: 'Effort by Market and Geography',
    body: (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionCard title="Tom · emails by market (UK & Europe)" icon={Mail}>
          <table className="w-full">
            <thead>
              <tr>
                {['Market', 'Emails', 'Replies', 'Positive'].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {snapshot.tomMarkets.map((m) => (
                <tr key={m.market}>
                  <td className={td}>{m.market}</td>
                  <td className={td}>{fmt(m.emails)}</td>
                  <td className={td}>{pct(m.replies, m.emails)}</td>
                  <td className={td}>{fmt(m.positive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
        <SectionCard title="Jordan · meetings booked by market (US)" icon={CalendarCheck}>
          <div className="space-y-3">
            {Object.entries(snapshot.bookedMarkets).map(([market, n]) => (
              <div key={market}>
                <div className="flex justify-between text-sm text-foreground/90">
                  <span>{market}</span>
                  <span>{n}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-border/50">
                  <div className="h-2 rounded-full bg-blue-400" style={{ width: `${(n / bookedTotal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Callout tone="warning">
              {pct(ovgBooked, bookedTotal)} of Jordan’s meetings were inside the OVG estate, an existing
              customer. That is expansion, and should be counted separately from new-logo pipeline.
            </Callout>
          </div>
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'rules',
    eyebrow: 'Avoiding double counting',
    title: 'Proposed Rules: SDR-Sourced vs SDR-Influenced',
    body: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCard title="SDR-sourced" icon={Target}>
            <p className="text-sm text-foreground/90">
              The SDR booked the first meeting with an account that had no open opportunity and no inbound
              enquiry in the prior 90 days. The SDR is the opportunity’s <strong>primary source</strong>.
            </p>
          </SectionCard>
          <SectionCard title="SDR-influenced" icon={Link2}>
            <p className="text-sm text-foreground/90">
              Primary source is something else (inbound, AE, partner, event, existing customer), but an SDR
              touched a contact at the account in the 90 days before the opportunity was created or advanced.
            </p>
          </SectionCard>
          <SectionCard title="Expansion" icon={Building2}>
            <p className="text-sm text-foreground/90">
              Any opportunity at an existing customer (OVG sites, for example). Tracked as its own line,
              whoever booked it, so new-logo pipeline isn’t inflated.
            </p>
          </SectionCard>
        </div>
        <SectionCard title="Rules that keep the numbers honest" icon={Scale}>
          <ul className="grid grid-cols-1 gap-2 text-sm text-foreground/90 md:grid-cols-2">
            <li>1. One opportunity, one primary source. Set at creation, never overwritten.</li>
            <li>2. Influence is a flag, not a share. Sourced and influenced are never added together.</li>
            <li>3. Report sourced pipeline as the SDR number; influenced as context.</li>
            <li>4. “Unattributed” is a valid answer and gets reported, so gaps stay visible.</li>
          </ul>
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'examples',
    eyebrow: 'The rules, applied to our own data',
    title: 'What the Rules Look Like on Real Meetings',
    body: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Accounts met since Jul 2025" value={fmt(snapshot.meetingAccounts.length)} sub="Meetings logged in HubSpot, one row per account" />
          <StatCard label="With an SDR touch first" value={fmt(sdrTouchedMeetings.length)} sub="The rest came from AEs, customers or inbound" tone="accent" />
          {primrose && (
            <StatCard
              label="Primrose: first touch to contract talks"
              value={`${weeksBetween(primrose.firstTouch!, primrose.date)} weeks`}
              sub={`Jordan’s first touch ${primrose.firstTouch}; AE contracting call ${primrose.date}`}
              tone="success"
            />
          )}
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-surface/80">
              <tr>
                {['Meeting', 'Account', 'Recorded source', 'SDR touches before', 'Proposed label'].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sdrTouchedMeetings.map((m) => {
                const inbound = m.source === 'ORGANIC_SEARCH' || m.source === 'DIRECT_TRAFFIC' || m.source === 'PAID_SEARCH';
                return (
                  <tr key={m.domain}>
                    <td className={td}>{m.date}</td>
                    <td className={`${td} font-medium`}>{m.domain}</td>
                    <td className={td}>{m.source?.replace('_', ' ').toLowerCase()}</td>
                    <td className={td}>{m.sdrTouches} ({m.sdr?.split(' ')[0]}, from {m.firstTouch})</td>
                    <td className={td}>
                      <span className={inbound ? 'text-yellow-300' : 'text-green-300'}>
                        {inbound ? 'SDR-influenced (inbound-sourced)' : 'SDR-sourced (confirm in Salesforce)'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Callout tone="accent">
            Without these rules, an inbound contact the SDR followed up on can be claimed by marketing
            <em> and</em> the SDR, and the same opportunity gets counted twice.
          </Callout>
          <Callout tone="warning">
            Matching on email domain breaks on shared domains: every NHS trust can use nhs.net. Proper
            attribution needs Apollo and Salesforce linked at the account level.
          </Callout>
        </div>
      </div>
    ),
  },
  {
    id: 'cost',
    eyebrow: 'Cost per qualified opportunity',
    title: 'The Visible Costs Are the Small Ones',
    body: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {toolCosts.map((t) => (
            <StatCard key={t.vendor} label={`${t.vendor} / month`} value={usd(t.monthly)} sub="Ramp, marketing card" />
          ))}
          <StatCard label="SDR tooling / month" value={usd(toolMonthly)} sub={`Avg of ${rampMonths.join(', ')}`} tone="success" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Not visible to marketing" icon={HandCoins}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>SDR salaries, commission and on-costs (by far the largest line)</li>
              <li>Agencies and any outsourced lead generation</li>
              <li>Data contracts beyond Apollo (e.g. ZoomInfo, Cognism, if held)</li>
              <li>Event and campaign spend booked outside the marketing card</li>
              <li>Salesforce and HubSpot seat costs attributable to SDRs</li>
            </ul>
          </SectionCard>
          <SectionCard title="How we’ll calculate it" icon={Scale}>
            <div className="space-y-3 text-sm text-foreground/90">
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 font-mono text-xs">
                Cost per SQO = (people + tools + data + agencies + campaigns) ÷ SDR-sourced qualified opps
              </div>
              <p>Same period, same region. Influenced opportunities are reported alongside, never in the denominator.</p>
              <p className="text-muted">LinkedIn includes Sales Navigator and light ad spend; Ramp scope is one card, so treat tooling as a floor.</p>
            </div>
          </SectionCard>
        </div>
      </div>
    ),
  },
  {
    id: 'gaps',
    eyebrow: 'Data and process gaps',
    title: 'Seven Gaps Between the Work and the Number',
    body: (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[
          { icon: CalendarCheck, title: 'Meetings aren’t logged', text: `Jordan booked ${dq.jordanMeetingsBookedCalls} meetings by phone; ${dq.jordanMeetingsInHubspot} appear in HubSpot. Tom’s appear nowhere.` },
          { icon: Link2, title: 'Apollo isn’t linked to Salesforce', text: `${dq.apolloContactsWithSalesforceId} of ${fmt(dq.apolloContactsChecked)} engaged Apollo contacts have a Salesforce ID; Apollo holds ${dq.apolloOpportunities} opportunities.` },
          { icon: Phone, title: 'Calls logged outside the dialer', text: `${fmt(dq.tomLoggedWithoutDialer)} of Tom’s calls have no duration or outcome detail, so connects can’t be measured.` },
          { icon: Database, title: '“Opportunity” means nothing yet', text: `HubSpot marks ${fmt(dq.hubspotLifecycle.opportunity)} contacts as opportunities and ${dq.hubspotLifecycle.salesqualifiedlead} as SQL; Apollo shows ${fmt(dq.apolloActiveOppAccounts ?? 0)} “active opportunity” accounts.` },
          { icon: Layers, title: 'Contacts on the wrong accounts', text: 'Senior-living chefs filed under a BBQ restaurant chain, for example. Account-level reporting inherits the errors.' },
          { icon: Mail, title: 'Manual steps pile up', text: `${fmt(tom.queuedManualEmails)} manual emails queued in Tom’s sequences; ${fmt(dq.emailsFailed)} emails failed, ${fmt(dq.emailsFailedStageSafeguard)} blocked by stage rules.` },
          { icon: TrendingDown, title: 'No agreed stage definitions', text: 'Meeting booked, meeting held and qualified opportunity aren’t defined the same way across Apollo, HubSpot and Salesforce.' },
        ].map((g, i) => (
          <div key={g.title} className="flex gap-3 rounded-xl border border-border bg-surface/60 p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-sm font-bold text-red-300">
              {i + 1}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <g.icon className="h-4 w-4 text-blue-400" />
                {g.title}
              </div>
              <p className="mt-1 text-sm text-muted">{g.text}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'plan',
    eyebrow: 'The plan',
    title: 'From First Pass to a Trusted Baseline in 90 Days',
    body: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCard title="This week" icon={Flag}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Salesforce opportunity export: created date, owner, source, stage, amount, close date, account</li>
              <li>Match it to Apollo activity and label each opportunity sourced / influenced / expansion / unattributed</li>
              <li>Finance: SDR people cost, agencies, data contracts</li>
              <li><strong>Output:</strong> first real cost per qualified opportunity, with gaps shown</li>
            </ul>
          </SectionCard>
          <SectionCard title="Next 30 days" icon={Route}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Agree three stage definitions: meeting booked, meeting held, qualified opportunity</li>
              <li>Add “Primary source” and “SDR influenced” fields to the Salesforce opportunity</li>
              <li>Every SDR meeting lands as a calendar event on the account, whatever tool booked it</li>
              <li>All calls through the Apollo dialer</li>
            </ul>
          </SectionCard>
          <SectionCard title="By 90 days" icon={Target}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Connect Apollo to Salesforce (or route through HubSpot) at the account level</li>
              <li>One weekly view: activity to meetings to SQOs to pipeline, by rep, region and market</li>
              <li>First clean quarter to plan the 18 to 24 months from</li>
              <li>Bryan’s seat runs the clean process from day one, as the pilot</li>
            </ul>
          </SectionCard>
        </div>
        <Callout tone="success">
          None of this needs new headcount or new tools. It needs agreed definitions and two integrations
          switched on.
        </Callout>
      </div>
    ),
  },
  {
    id: 'inbound',
    eyebrow: 'Part 2 · What HubSpot tells us',
    title: 'Inbound Is Small, UK-Only, and Noisy',
    body: inbound ? (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label={`Contacts created since ${inbound.since}`} value={fmt(inbound.contactsCreated)} sub={`${pct(inbound.importedOrSynced, inbound.contactsCreated)} imported or synced, not inbound`} />
          <StatCard label="Genuine demand forms" value={fmt(inbound.demandForms)} sub="Demo, quote and contact requests" tone="accent" />
          <StatCard label="UK vs US demand" value={`${fmt(inbound.demandByCountry.UK ?? 0)} : ${fmt(inbound.demandByCountry.US ?? 0)}`} sub={`${fmt(inbound.demandByCountry.Unknown ?? 0)} with no country recorded`} tone="warning" />
          <StatCard label="Scanner junk in demo forms" value={fmt(inbound.scannerJunk)} sub={`${inbound.scannerJunkMarkedMql} of them marked as MQLs`} tone="error" />
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-surface/80">
              <tr>
                {['Quarter', 'Demand forms', 'Support requests via sales forms', 'App requests', 'Scanner junk'].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inbound.byQuarter.map((q) => (
                <tr key={q.quarter}>
                  <td className={td}>{q.quarter}</td>
                  <td className={td}>{fmt(q.demand)}</td>
                  <td className={td}>{fmt(q.support)}</td>
                  <td className={td}>{fmt(q.appRequest)}</td>
                  <td className={td}>{fmt(q.junk)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout tone="accent">
          US pipeline depends almost entirely on outbound, which is why the SDR baseline matters. Existing
          customers raising support through sales forms is both a product signal and noise in the MQL count.
        </Callout>
      </div>
    ) : (
      <p className="text-sm text-muted">HubSpot inbound data not pulled.</p>
    ),
  },
  {
    id: 'landscape',
    eyebrow: 'Part 2 · Competitive landscape',
    title: 'Who We Meet in Food Safety and Medical Monitoring',
    body: (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-surface/80">
              <tr>
                {['Competitor', 'Where they play', 'Recent move', 'Threat'].map((h) => (
                  <th key={h} className={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {landscape.map((c) => (
                <tr key={c.name}>
                  <td className="px-3 py-1.5 text-sm font-medium text-foreground">{c.name}</td>
                  <td className="px-3 py-1.5 text-xs text-muted">{c.plays}</td>
                  <td className="px-3 py-1.5 text-xs text-foreground/90">{c.move}</td>
                  <td className="px-3 py-1.5">
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${threatTone[c.threat]}`}>{c.threat}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Callout tone="success">
            <strong>Where we win:</strong> one vendor across medical-grade (CAM+), commercial (CAM) and workflow
            (CWM); an NHS installed base that renews (e.g. Nottingham pharmacy and Mersey pathology in 2026).
          </Callout>
          <Callout tone="warning">
            <strong>Where we’re exposed:</strong> bundled platforms on price and breadth, AI-native apps from
            £19 a site in UK food, and predictive layers that sit on top of anyone’s monitoring data.
          </Callout>
        </div>
      </div>
    ),
  },
  {
    id: 'market',
    eyebrow: 'Part 2 · Where the market is heading',
    title: 'Competitors Are Consolidating Into All-in-One Platforms',
    body: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Recent moves" icon={Compass}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li><strong>Digi / SmartSense</strong> bought Jolt and launched SmartSense ONE (Jan 2026): sensors, tasks, maintenance, labels and scheduling in one subscription.</li>
              <li><strong>Digi / SmartSense</strong> agreed to buy Disruptive Technologies for $130M (Oct 2026, closing by year end), its route into Europe.</li>
              <li><strong>Copeland</strong> closed its Dickson acquisition: cold chain and healthcare monitoring.</li>
              <li><strong>Ladle</strong> (PE-backed) rolled up ComplianceMate with two other products.</li>
              <li><strong>Rees Scientific</strong> launched Helix (May 2026) for hospital pharmacy and labs, backed by validation services.</li>
              <li><strong>Crunchtime</strong> (ex-Zenput) shipped AI analyst, photo review and AI actions.</li>
            </ul>
          </SectionCard>
          <SectionCard title="What it means" icon={Lightbulb}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Buyers will compare platforms, not sensors. Point solutions get squeezed.</li>
              <li>Hardware plus software in a single subscription is becoming the default commercial model.</li>
              <li>AI is moving from “alerts” to “tell me what to do next and prove it was done”.</li>
              <li>Medical buyers expect validation and calibration as part of the deal.</li>
              <li>US food regulation has a fixed date: FDA traceability rule (FSMA 204) from July 2028.</li>
            </ul>
          </SectionCard>
        </div>
        <Callout tone="warning">
          The most immediate of these for Checkit is the Disruptive Technologies deal. Next slide.
        </Callout>
      </div>
    ),
  },
  {
    id: 'dt',
    eyebrow: 'Part 2 · Disruptive Technologies',
    title: 'Our Primary Sensor Partner Now Belongs to a Competitor',
    body: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCard title="What happened" icon={AlertTriangle}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Digi (SmartSense) signed to buy Disruptive Technologies on 30 Sep 2026 for $130M; closing expected before year end.</li>
              <li>DT: $15M revenue, $4M ARR in 2025; 250,000+ sensors installed.</li>
            </ul>
          </SectionCard>
          <SectionCard title="What Digi has said" icon={Building2}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>DT folds into SmartSense during Digi’s FY2027 (Oct 2026 to Sep 2027).</li>
              <li>Channel partners move from one-off sensor sales to a single SmartSense subscription.</li>
              <li>“You are buying a SmartSense solution.”</li>
            </ul>
          </SectionCard>
          <SectionCard title="What it means for us" icon={ShieldAlert}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Pricing, supply and roadmap for the range we resell move to a direct competitor.</li>
              <li>Installed DT sensors depend on DT cloud subscriptions, so the installed base is exposed too.</li>
              <li>SmartSense gets a European foothold and a reason to call our customers.</li>
            </ul>
          </SectionCard>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCard title="Next 30 days" icon={Flag}>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              <li>Legal read of the partner agreement: term, change of control, pricing, notice</li>
              <li>Written confirmation of cloud continuity for installed sensors</li>
              <li>Last-time-buy volume and stock position</li>
              <li>One customer and rep script, so the message is ours first</li>
            </ul>
          </SectionCard>
          <SectionCard title="By 90 days" icon={Route}>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              <li>Qualify a second-source sensor for the commercial range</li>
              <li>Decide: stay a partner on new terms, or move to our own and second-source hardware</li>
            </ul>
          </SectionCard>
          <SectionCard title="By 180 days" icon={Target}>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              <li>Migration path for the installed DT estate</li>
              <li>Sell “open, sensor-agnostic” against SmartSense’s closed bundle</li>
              <li>Approach DT partners and customers who don’t want to be moved onto SmartSense</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    ),
  },
  {
    id: 'roadmap',
    eyebrow: 'Part 2 · Product roadmap',
    title: 'Product Roadmap: 18 to 24 Months',
    body: (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full table-fixed">
            <thead className="bg-surface/80">
              <tr>
                <th className={`${th} w-[18%]`}>Theme</th>
                <th className={th}>Now · Q4 2026</th>
                <th className={th}>Next · H1 2027</th>
                <th className={th}>Later · H2 2027 to H1 2028</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {roadmap.map((r) => (
                <tr key={r.theme}>
                  <td className={`${td} align-top`}>
                    <div className="flex items-start gap-2 font-semibold text-foreground">
                      <r.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                      {r.theme}
                    </div>
                    <div className="mt-1 text-xs text-muted">{r.why}</div>
                  </td>
                  {[r.now, r.next, r.later].map((cell, i) => (
                    <td key={i} className={`${td} align-top text-sm`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          Built from the competitor moves and inbound demand in this deck. Proposed for discussion with product;
          sequencing and build-versus-partner calls still to be agreed.
        </p>
      </div>
    ),
  },
  {
    id: 'okrs',
    eyebrow: 'Part 2 · OKRs',
    title: 'Proposed OKRs for the Next Two Quarters',
    body: (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {okrs.map((o) => (
            <div key={o.objective} className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="flex items-center gap-2">
                <o.icon className="h-4 w-4 text-blue-400" />
                <span className="text-xs uppercase tracking-wider text-muted">{o.owner}</span>
              </div>
              <h3 className="mt-1 text-sm font-semibold text-foreground">{o.objective}</h3>
              <ul className="mt-2 space-y-1.5">
                {o.krs.map((kr) => (
                  <li key={kr.kr} className="text-xs text-foreground/90">
                    <span className="font-medium">{kr.kr}</span>
                    <span className="text-muted"> · baseline {kr.baseline} · target {kr.target}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">
          Targets are proposals to agree, not commitments. Where the baseline says TBC, the first quarter sets it.
          These sit under the existing £1M a month pipeline generation OKR rather than replacing it.
        </p>
      </div>
    ),
  },
  {
    id: 'targets',
    eyebrow: 'Target accounts',
    title: 'Target Accounts: US Healthcare and Facilities Management',
    body: (
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {snapshot.targets.map((t) => (
            <SectionCard key={t.list} title={t.list} icon={t.list.includes('Healthcare') ? Stethoscope : Building2}>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">{fmt(t.accounts)}</div>
                  <div className="text-xs text-muted">accounts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{fmt(t.enterprise)}</div>
                  <div className="text-xs text-muted">1,000+ staff</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{fmt(t.worked)}</div>
                  <div className="text-xs text-muted">worked so far</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">{t.topIndustries.join(' · ')}</p>
              <p className="mt-2 text-sm text-foreground/90">{t.topAccounts.slice(0, 5).join(', ')}</p>
            </SectionCard>
          ))}
        </div>
        <Callout tone="accent">
          Full list sent separately as a workbook: one tab per list, with industry, size, location, Apollo
          stage, owner, contacts found and whether an SDR has worked the account. Existing customers are
          flagged, not removed.
        </Callout>
        <Callout tone="warning">
          The US FM list is mid-market FM firms. The tier-one groups (ISS, Compass, Sodexo) are handled as
          named accounts or are already customers, and the UK FM list is thin at{' '}
          {snapshot.targets.find((t) => t.list === 'FM - UK')?.accounts} accounts.
        </Callout>
      </div>
    ),
  },
  {
    id: 'asks',
    eyebrow: 'Decisions',
    title: 'What I Need to Finish This',
    body: (
      <div className="space-y-4">
        <ul className="space-y-4">
          {[
            { icon: Database, text: <><strong>Salesforce opportunity export</strong> (or read access) for the last 18 months, including source and owner.</> },
            { icon: HandCoins, text: <><strong>Cost inputs from finance:</strong> SDR people cost, agencies, data contracts, events.</> },
            { icon: Scale, text: <><strong>Sign-off on the attribution rules</strong> (sourced, influenced, expansion, unattributed) so the number is agreed before it’s calculated.</> },
            { icon: Users, text: <><strong>Context on the activity drop</strong> since spring: role changes, list exhaustion or a deliberate channel shift.</> },
            { icon: ShieldAlert, text: <><strong>An owner and budget for the Disruptive Technologies response:</strong> legal review, last-time buy and second source, before the deal closes.</> },
            { icon: Gauge, text: <><strong>Product to react to the roadmap themes</strong> and name an owner for each proposed OKR.</> },
          ].map((a, i) => (
            <li key={i} className="flex items-start gap-3">
              <a.icon className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
              <span className="text-base leading-relaxed text-foreground/90">{a.text}</span>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <StatCard label="With the export" value="1 week" sub="First cost per qualified opp" tone="success" />
          <StatCard label="With definitions" value="30 days" sub="Clean tracking going forward" />
          <StatCard label="Trusted baseline" value="90 days" sub="One clean quarter for the plan" />
        </div>
      </div>
    ),
  },
  {
    id: 'appendix',
    eyebrow: 'Appendix · Method',
    title: 'How These Numbers Were Built',
    body: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SectionCard title="Sources" icon={Database}>
          <ul className="space-y-2 text-sm text-foreground/90">
            {snapshot.meta.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
            <li>Tool spend: Ramp snapshot {rampSnapshotMeta.windowStart} to {rampSnapshotMeta.windowEnd} ({rampSnapshotMeta.scope})</li>
          </ul>
        </SectionCard>
        <SectionCard title="Definitions and caveats" icon={CircleDashed}>
          <ul className="space-y-2 text-sm text-foreground/90">
            <li>Apollo shows call outcomes as IDs only; labels were inferred from call length and rep notes.</li>
            <li>Conversation = dialer call of {snapshot.meta.conversationSeconds}s or longer.</li>
            <li>Meetings booked = calls with the “meeting booked” outcome. Meetings booked by email are not captured.</li>
            <li>Market for Tom’s emails is taken from the sequence name.</li>
            <li>Raw tables available as a workbook for anyone who wants to check the working.</li>
          </ul>
        </SectionCard>
      </div>
    ),
  },
];

export default function SdrBaselineDeck() {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = slides.length;

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        setIndex(0);
      } else if (e.key === 'End') {
        setIndex(total - 1);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, total, toggleFullscreen]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const slide = slides[index];
  const progress = useMemo(() => ((index + 1) / total) * 100, [index, total]);

  return (
    <>
      <PrintStyles />
      <div className="space-y-4 deck-screen">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/checkit-logo-horizontal-standard-rgb-white.svg"
              alt="Checkit"
              width={140}
              height={32}
              priority
              className="h-8 w-auto"
            />
            <div className="hidden sm:block border-l border-border pl-4">
              <h1 className="text-lg font-semibold text-foreground">SDR Baseline</h1>
              <p className="text-xs text-muted">GTM working session · 18 to 24 month plan</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-surface-hover"
              title="Print / Save as PDF (one slide per landscape page)"
            >
              <Printer className="h-4 w-4" />
              Print / PDF
            </button>
            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-surface-hover"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {isFullscreen ? 'Exit' : 'Present'}
            </button>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-background shadow-2xl"
          style={{
            backgroundImage:
              'radial-gradient(circle at 100% 0%, rgba(59,130,246,0.12), transparent 50%), radial-gradient(circle at 0% 100%, rgba(37,99,235,0.08), transparent 50%)',
          }}
        >
          <div className="absolute left-0 top-0 h-1 w-full bg-border/40">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="min-h-[60vh] px-8 py-10 md:px-14 md:py-14">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-blue-300">{slide.eyebrow}</span>
              <span className="text-xs uppercase tracking-widest text-muted">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              <span className="text-gradient">{slide.title}</span>
            </h2>
            <div className="mt-8">{slide.body}</div>
          </div>

          <div className="flex items-center justify-between border-t border-border/60 bg-background/40 px-6 py-3 text-xs text-muted">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              Checkit · GTM Tracker
            </div>
            <div>Confidential · internal use only</div>
          </div>
        </div>

        <p className="text-center text-xs text-muted">
          Tip: use ← / → keys to navigate, F to present, Home / End to jump.
        </p>

        <div className="h-24" aria-hidden />
      </div>

      <div className="deck-controls fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={prev}
            disabled={index === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? 'w-8 bg-blue-400' : 'w-2.5 bg-border hover:bg-surface-hover'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={index === total - 1}
            className="inline-flex items-center gap-2 rounded-lg btn-gradient px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="deck-print" aria-hidden>
        {slides.map((s, i) => (
          <section key={s.id} className="print-slide">
            <div className="print-slide-inner">
              <div className="print-slide-header">
                <span className="print-eyebrow">{s.eyebrow}</span>
                <span className="print-pageno">
                  {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
              <h2 className="print-title">{s.title}</h2>
              <div className="print-body">{s.body}</div>
              <div className="print-footer">
                <span>Checkit · GTM Tracker</span>
                <span>Confidential · internal use only</span>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

const PRINT_CSS = `
      @media print {
        @page {
          size: 13.333in 7.5in;
          margin: 0;
        }
        html,
        body {
          background: #0b1220 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        main {
          padding: 0 !important;
          max-width: none !important;
        }
        nextjs-portal {
          display: none !important;
        }
        .deck-screen,
        .deck-controls {
          display: none !important;
        }
        .deck-print {
          display: block !important;
        }
        .print-slide {
          page-break-after: always;
          break-after: page;
          width: 13.333in;
          height: 7.5in;
          overflow: hidden;
          background:
            radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.18), transparent 55%),
            radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.12), transparent 55%),
            linear-gradient(135deg, #111827 0%, #0b1220 100%);
          color: #f3f4f6;
          padding: 40px 56px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .print-slide:last-child {
          page-break-after: auto;
        }
        .print-slide-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .print-slide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .print-eyebrow {
          color: #93c5fd;
        }
        .print-pageno {
          color: #9ca3af;
        }
        .print-title {
          margin-top: 4px;
          font-size: 32px;
          font-weight: 800;
          line-height: 1.1;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .print-body {
          margin-top: 16px;
          flex: 1;
          overflow: hidden;
          zoom: 0.95;
        }
        .print-body .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .print-body .md\\:grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .print-body .md\\:grid-cols-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .print-footer {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #9ca3af;
        }
      }
      @media screen {
        .deck-print {
          display: none;
        }
      }
`;

function PrintStyles() {
  return <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />;
}
