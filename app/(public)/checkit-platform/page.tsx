import { Metadata } from 'next';
import Link from 'next/link';
import DemoRequestButton from '@/components/DemoRequestButton';
import PlatformPreview from '@/components/checkit-platform/PlatformPreview';
import AlertJourney, { type JourneyStep } from '@/components/checkit-platform/AlertJourney';
import AuditTrailMock from '@/components/checkit-platform/AuditTrailMock';
import {
  Activity,
  ArrowRight,
  BellRing,
  Building2,
  Check,
  ClipboardCheck,
  Droplet,
  FileCheck,
  FlaskConical,
  Gauge,
  GitBranch,
  LayoutDashboard,
  Microscope,
  Network,
  Pill,
  Radio,
  Repeat,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Checkit Platform for Critical Asset Monitoring',
  description:
    'Temperature and environmental monitoring, asset insight, multi-site visibility, mobile alerting and audit-ready records for teams protecting medicines, samples, blood and plasma. Protect critical assets, see risk sooner, act faster and prove what happened.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://checkitv6.com/checkit-platform' },
  openGraph: {
    title: 'Critical asset compliance with proactive risk prevention.',
    description:
      'Brings temperature and environmental monitoring, asset insight, alerting, response and compliance together across every site.',
    url: 'https://checkitv6.com/checkit-platform',
  },
};

const needs = [
  'Spot assets that are starting to drift or struggle',
  'See where risk sits across every site',
  'Reach the right person, wherever they are',
  'Escalate if nobody responds',
  'Follow the same correct response every time',
  'Learn which problems keep coming back',
  'Prove what happened, who acted and when',
];

const outcomes = [
  { icon: ShieldCheck, title: 'Protect critical stock', description: 'Keep medicines, samples, reagents, blood and plasma within safe conditions, 24/7.' },
  { icon: TrendingUp, title: 'See risk sooner', description: 'Spot abnormal or deteriorating asset behaviour while there is still time to intervene.' },
  { icon: LayoutDashboard, title: 'Understand every site', description: 'Know what is happening across every site, asset and alarm from one view.' },
  { icon: Zap, title: 'Act quickly', description: 'Get alerts to the right people wherever they are, and escalate if nobody responds.' },
  { icon: Repeat, title: 'Improve operations', description: 'Use monitoring history to find recurring issues and focus your team where it matters.' },
  { icon: FileCheck, title: 'Prove what happened', description: 'Keep an attributable record of every alarm, action and change, ready for audit.' },
];

type HealthRating = 'poor' | 'general' | 'good';

// Mirrors CAM+ Asset Health & Availability (docs.checkit.net/camplus/asset-health-availability):
// fridges and freezers rated good / general / poor against a predicted temperature range.
// TODO(product): confirm the same ratings and metrics carry over to the new platform.
const watchlist: { asset: string; site: string; signal: string; status: HealthRating }[] = [
  { asset: 'Vaccine fridge', site: 'Ward 4 pharmacy', signal: '18% of readings outside predicted range', status: 'poor' },
  { asset: 'Plasma freezer 2', site: 'Blood bank', signal: 'Out of service 3 days this month', status: 'general' },
  { asset: 'Reagent fridge', site: 'Pathology', signal: 'Running above ideal temperature', status: 'general' },
  { asset: 'Sample freezer 1', site: 'Pathology', signal: 'Within predicted range', status: 'good' },
];

const watchStyles: Record<HealthRating, { label: string; pill: string; dot: string }> = {
  poor: { label: 'Poor health', pill: 'bg-red-500/10 text-red-300 border-red-500/30', dot: 'bg-red-500' },
  general: { label: 'General health', pill: 'bg-amber-500/10 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
  good: { label: 'Good health', pill: 'bg-green-500/10 text-green-300 border-green-500/20', dot: 'bg-green-500' },
};

const assetPoints = [
  { title: 'Understand asset health', description: 'Rate each fridge and freezer on how it actually performs over time, not just its latest reading.' },
  { title: 'Surface emerging risk', description: 'Highlight units drifting outside their predicted range before it becomes an excursion.' },
  { title: 'Prioritise intervention', description: 'Focus maintenance and replacement on the assets showing the most concerning behaviour.' },
  { title: 'Protect critical inventory', description: 'Reduce the chance of losing medicines, samples, reagents, blood or plasma to an avoidable failure.' },
];

// TODO(product): illustrative multi-site view. Confirm which cross-site metrics the new platform's
// dashboards show today (repeat alarms in particular) versus what is delivered through service reviews.
const siteRows = [
  { site: 'Main hospital pharmacy', assets: 42, alarms: 1, repeat: 3 },
  { site: 'Pathology laboratory', assets: 68, alarms: 0, repeat: 1 },
  { site: 'Blood bank', assets: 24, alarms: 0, repeat: 0 },
  { site: 'Community clinic, North', assets: 11, alarms: 2, repeat: 4 },
];

const sitePoints = [
  'Every location and monitored asset in one place',
  'Current alarms and open incidents at a glance',
  // TODO(product): confirm recurring-issue and response-performance views are in-product, not QBR-only.
  'Recurring issues and response performance by site',
  'Trends that show where your team should focus',
];

const journey: JourneyStep[] = [
  { id: 'detect', title: 'Detect', description: 'A monitored asset moves outside its defined parameters.' },
  { id: 'alert', title: 'Alert', description: 'The alert reaches the right people on their phones and other configured channels, wherever they are.' },
  { id: 'escalate', title: 'Escalate', description: 'If nobody acknowledges, the configured escalation path takes over automatically.' },
  { id: 'act', title: 'Act', description: 'The responsible person follows the agreed response and records what they did.' },
  { id: 'record', title: 'Record', description: 'The acknowledgement, actions and resolution are captured, by name and time.' },
  { id: 'prove', title: 'Prove', description: 'The complete record is ready when you need to demonstrate compliance.' },
];

const capabilities = [
  { icon: Radio, title: 'Continuous monitoring', description: '24/7 temperature and environmental monitoring of critical equipment and spaces.' },
  // TODO(product): Asset Intelligence is a live optional add-on in CAM+. Confirm availability and packaging on the new platform.
  { icon: Activity, title: 'Asset Intelligence', description: 'Health ratings for fridges and freezers that surface emerging risk earlier.' },
  { icon: LayoutDashboard, title: 'Multi-site visibility', description: 'Dashboards across sites, assets, alarms and trends.' },
  { icon: Smartphone, title: 'Mobile alerting', description: 'Alerts that reach people on the move, not just at a workstation.' },
  { icon: GitBranch, title: 'Escalation & incident response', description: 'Escalate automatically and capture who acknowledged and when.' },
  // TODO(product): task management is listed as roadmap for the medical platform in the BioIVT deck. Confirm availability.
  { icon: ClipboardCheck, title: 'Digital checks & SOPs', description: 'Make the correct response repeatable across sites and shifts.' },
  { icon: FileCheck, title: 'Audit trails & compliance reporting', description: 'An attributable record of alarms, actions and changes.' },
  { icon: Gauge, title: 'Calibration & IQ/OQ', description: 'Calibration records and qualification documentation in the platform.' },
];

const complianceItems = ['Audit trail', 'Electronic signatures', 'Calibration records', 'IQ/OQ', 'Corrective action', 'Reporting'];

const checksPoints = [
  'Replace paper logs and spreadsheets',
  'Standardise SOPs across sites and shifts',
  'Keep standards consistent as staff change',
  'Show that required checks were completed',
];

const environments = [
  { icon: Pill, label: 'Pharmacy', description: 'Protect medicines and respond fast, wherever staff are.' },
  { icon: Microscope, label: 'Pathology', description: 'See asset risk across labs and show required checks happened.' },
  { icon: Droplet, label: 'Blood & plasma', description: 'Protect high-value inventory with rapid response and evidence.' },
  { icon: FlaskConical, label: 'Biotech', description: 'Safeguard samples, reagents and research materials.' },
  { icon: Building2, label: 'Hospitals', description: 'Monitor fridges, freezers and rooms across wards and departments.' },
  { icon: Network, label: 'Multi-site healthcare networks', description: 'One view of risk across every site.' },
];

const proofSlots = [
  'Customer logos',
  'Customer quotes',
  'Monitored assets and sites',
  'Years of industry experience',
  'Relevant certifications',
  'Case studies',
  'Regulatory and compliance credentials',
];

const eyebrow = 'text-xs font-semibold uppercase tracking-widest text-accent mb-3';

export default function CheckitPlatformPage() {
  return (
    <div>
      <section className="relative pt-16 pb-28 lg:pt-24 lg:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-accent/10 via-transparent to-transparent" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-accent/10 text-accent rounded-full mb-6 border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Critical asset monitoring
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
                Critical asset compliance{' '}
                <span className="text-gradient">with proactive risk prevention.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted mb-8 max-w-xl leading-relaxed">
                Checkit brings temperature and environmental monitoring together with asset insight,
                multi-site visibility, mobile alerting and audit-ready records, so teams can
                protect medicines, samples and blood products across every site.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link
                  href="#how-it-works"
                  className="btn-gradient inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg"
                >
                  See how it works
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <DemoRequestButton industry="Checkit Platform (new customers)" variant="secondary" label="Talk to an expert" />
              </div>
            </div>
            <div className="lg:col-span-6 lg:pl-4">
              <PlatformPreview />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <p className={eyebrow}>The problem</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Traditional monitoring tells you something has already gone wrong.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-6">
                Teams protecting critical stock need more than an alarm. They need to see risk building, understand
                what is happening across every site, act quickly, and prove what they did.
              </p>
              <p className="text-foreground leading-relaxed border-l-2 border-amber-400 pl-4">
                Today, that work is often spread across alarm panels, phone calls, paper logs and spreadsheets.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-border bg-background p-5 sm:p-6">
                <div className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 mb-4">
                  <span className="relative flex w-9 h-9 items-center justify-center rounded-lg bg-red-500/20 text-red-400 shrink-0">
                    <BellRing className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Most monitoring starts at the alarm.</p>
                    <p className="text-sm text-muted">By then, stock may already be at risk. Your team needs to:</p>
                  </div>
                </div>
                <ol className="grid sm:grid-cols-2 gap-2">
                  {needs.map((need, i) => (
                    <li
                      key={need}
                      className={`flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3 ${
                        i === needs.length - 1 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground">{need}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>One connected platform</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Checkit helps you prevent, see, do and prove.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Monitoring data doesn&apos;t stop at the alarm. It feeds asset insight, multi-site visibility,
              response and evidence, so every part of the platform makes the next one stronger.
            </p>
          </div>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outcomes.map((outcome, i) => {
              const Icon = outcome.icon;
              return (
                <div key={outcome.title} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex items-center justify-between mb-5">
                    <Icon className="w-6 h-6 text-accent" />
                    <span className="text-xs font-semibold text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <dt className="font-semibold text-foreground mb-2">{outcome.title}</dt>
                  <dd className="text-sm text-muted leading-relaxed">{outcome.description}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section id="asset-intelligence" className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <p className={eyebrow}>Asset Intelligence</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                See risk building before it becomes loss.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                Asset Intelligence uses the monitoring data you already collect to rate the health of
                your fridges and freezers, flag units behaving abnormally, and help your team decide
                where to intervene first.
              </p>
              <ul className="space-y-4">
                {assetPoints.map((point) => (
                  <li key={point.title} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{point.title}</p>
                      <p className="text-sm text-muted leading-relaxed">{point.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <div
                className="relative rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40 overflow-hidden"
                role="img"
                aria-label="Illustration of Asset Intelligence rating fridges and freezers by health"
              >
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">Asset health</span>
                  </div>
                  <span className="text-[11px] text-muted">Last 3 months</span>
                </div>
                <ul className="divide-y divide-white/[0.06]">
                  {watchlist.map((item) => {
                    const style = watchStyles[item.status];
                    return (
                      <li key={item.asset} className="flex items-center gap-3 px-5 py-3.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {item.asset} <span className="text-muted font-normal">· {item.site}</span>
                          </p>
                          <p className="text-xs text-muted truncate">{item.signal}</p>
                        </div>
                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border shrink-0 ${style.pill}`}>
                          {style.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="px-5 py-3 border-t border-white/[0.06] text-[11px] text-muted">
                  Predicted range based on each unit&apos;s recent performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="multi-site-visibility" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div
                className="relative rounded-2xl border border-white/10 bg-[#0b1220] shadow-2xl shadow-black/40 overflow-hidden"
                role="img"
                aria-label="Illustration of a multi-site view comparing sites by monitored assets, open alarms and repeat alarms"
              >
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">All sites</span>
                  </div>
                  <span className="text-[11px] text-muted">Last 30 days</span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-x-4 sm:gap-x-8 px-5 py-2.5 text-[10px] uppercase tracking-wider text-muted border-b border-white/[0.06]">
                  <span>Site</span>
                  <span className="text-right">Assets</span>
                  <span className="text-right">Open alarms</span>
                  <span className="text-right">Repeat alarms</span>
                </div>
                <ul className="divide-y divide-white/[0.06]">
                  {siteRows.map((row) => (
                    <li key={row.site} className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-x-4 sm:gap-x-8 items-center px-5 py-3.5">
                      <span className="text-sm text-foreground truncate">{row.site}</span>
                      <span className="text-sm text-muted tabular-nums text-right">{row.assets}</span>
                      <span className={`text-sm tabular-nums text-right font-medium ${row.alarms > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {row.alarms}
                      </span>
                      <span className={`text-sm tabular-nums text-right ${row.repeat >= 3 ? 'text-amber-300 font-medium' : 'text-muted'}`}>
                        {row.repeat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-5 order-1 lg:order-2">
              <p className={eyebrow}>Multi-site visibility</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                One view across every site, asset and alarm.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-6">
                Give managers a clear view of every site, so the question moves on from what is
                happening right now to where the risk is.
              </p>
              <div className="space-y-2 mb-8">
                <p className="rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-muted">
                  &ldquo;What is happening right now?&rdquo;
                </p>
                <p className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-foreground">
                  &ldquo;Where are my risks, where do problems keep coming back, and where should my team focus?&rdquo;
                </p>
              </div>
              <ul className="space-y-2.5">
                {sitePoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>Alerts and response</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Alerts wherever work happens.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Nurses, pharmacy teams and lab staff are rarely sitting beside a desk phone. Checkit gets
              alerts and incident details to the right people on the move, so they can acknowledge and
              respond without anyone needing to be at a fixed workstation. Every step is recorded.
            </p>
          </div>
          <AlertJourney steps={journey} />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className={eyebrow}>Capabilities</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Everything you need to monitor, understand and protect critical stock at every site.
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="group relative bg-surface border border-border rounded-2xl p-6 hover:border-accent/40 transition-colors overflow-hidden"
                >
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  <span className="relative w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="relative text-lg font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="relative text-sm text-muted leading-relaxed">{item.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className={eyebrow}>Compliance and evidence</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Don&apos;t just know something went wrong. Prove what happened.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                Every alarm, acknowledgement, action and configuration change is recorded with who, what
                and when, so the evidence exists before anyone asks for it.
              </p>
              <ul className="flex flex-wrap gap-2 mb-10">
                {complianceItems.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-background border border-border text-sm text-foreground"
                  >
                    <Check className="w-3.5 h-3.5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              {/* TODO(product): digital checks / task management is listed as roadmap for the medical platform. Confirm before external use. */}
              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <ClipboardCheck className="w-4 h-4" />
                  </span>
                  <p className="font-semibold text-foreground">Make the correct response repeatable, and prove it happened.</p>
                </div>
                <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                  {checksPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <AuditTrailMock />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <p className={eyebrow}>Who it&apos;s for</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                From a single department to every site you run.
              </h2>
              <p className="text-xl text-foreground/90 leading-relaxed">
                Designed for organisations where one failed asset, missed alert or incomplete record can
                mean lost stock, disrupted services and serious compliance consequences.
              </p>
            </div>
            <ul className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {environments.map((env) => {
                const Icon = env.icon;
                return (
                  <li
                    key={env.label}
                    className="group relative flex flex-col gap-6 min-h-44 rounded-2xl border border-border bg-linear-to-br from-surface to-background p-5 overflow-hidden hover:border-accent/40 transition-colors"
                  >
                    <Icon className="absolute -bottom-4 -right-4 w-24 h-24 text-accent/[0.07] group-hover:text-accent/[0.12] transition-colors" aria-hidden="true" />
                    <span className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="relative mt-auto">
                      <p className="font-semibold text-foreground leading-snug mb-1">{env.label}</p>
                      <p className="text-xs text-muted leading-relaxed">{env.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Trusted to protect critical assets.
          </h2>
          <p className="text-lg text-muted max-w-2xl mb-10">
            This is where proof belongs. Nothing is published here until it can be supported.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {proofSlots.map((slot) => (
              <li
                key={slot}
                className="rounded-xl border border-dashed border-border px-4 py-4 flex items-center justify-between gap-3"
              >
                <span className="text-foreground">{slot}</span>
                <span className="text-[11px] uppercase tracking-wide text-muted shrink-0">Awaiting proof</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-linear-to-br from-accent/25 via-accent/10 to-background px-6 py-14 sm:px-12 lg:py-20">
            <div className="absolute -top-24 right-0 w-[32rem] h-64 bg-accent/30 blur-3xl rounded-full" aria-hidden="true" />
            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                See where risk sits across all your sites.
              </h2>
              <div>
                <p className="text-lg text-foreground/75 mb-6 leading-relaxed">
                  Talk to us about monitoring, asset insight, mobile alerting and compliance evidence
                  for your sites.
                </p>
                <DemoRequestButton industry="Checkit Platform (new customers)" label="Talk to us" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
