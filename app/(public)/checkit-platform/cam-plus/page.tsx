import { Metadata } from 'next';
import Link from 'next/link';
import DemoRequestButton from '@/components/DemoRequestButton';
import PlatformPreview from '@/components/checkit-platform/PlatformPreview';
import EstateStack from '@/components/checkit-platform/EstateStack';
import FragmentedVsConnected, { type FlowItem } from '@/components/checkit-platform/FragmentedVsConnected';
import AuditTrailMock from '@/components/checkit-platform/AuditTrailMock';
import {
  Activity,
  Bell,
  Check,
  ClipboardList,
  Eye,
  FileSearch,
  FileSpreadsheet,
  Gauge,
  History,
  Phone,
  PenLine,
  Radio,
  Rocket,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
  Wrench,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Checkit Platform for CAM+ Customers',
  description:
    'The Checkit Platform gives CAM+ customers a modern medical monitoring platform without replacing the sensors and infrastructure you already rely on.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://checkitv6.com/checkit-platform/cam-plus' },
  openGraph: {
    title: 'Keep your monitoring estate. Move your platform forward.',
    description:
      'The Checkit Platform gives CAM+ customers a modern medical monitoring platform without replacing the sensors and infrastructure you already rely on.',
    url: 'https://checkitv6.com/checkit-platform/cam-plus',
  },
};

const proofPoints = [
  'Keep your existing sensors and hardware',
  'Bring your monitoring history with you',
  'Modern web-based platform',
  'Monitoring, response and compliance in one place',
  'Supported, controlled migration',
];

const benefits = [
  {
    icon: Shield,
    title: 'Protect your investment',
    description: 'Your existing monitoring infrastructure remains in place.',
  },
  {
    icon: Sparkles,
    title: 'Modernise the experience',
    description: 'Move from legacy interfaces and fragmented processes to a modern, accessible platform.',
  },
  {
    icon: Rocket,
    title: "Prepare for what's next",
    description: 'Gain the foundations for stronger compliance, workflow, mobile alerting and future capabilities.',
  },
];

const stays = [
  { icon: Radio, label: 'Your sensors stay' },
  { icon: Server, label: 'Your infrastructure stays' },
  { icon: Activity, label: 'Your monitoring continues' },
  { icon: History, label: 'Your historical records come with you' },
  { icon: ClipboardList, label: 'Your established processes are supported' },
  { icon: Shield, label: 'No rip and replace' },
];

const today: FlowItem[] = [
  { icon: Radio, label: 'Monitoring', note: 'Readings in one system' },
  { icon: Bell, label: 'Alert', note: 'Someone has to notice' },
  { icon: Phone, label: 'Someone responds', note: 'By phone, in person, ad hoc' },
  { icon: FileSpreadsheet, label: 'Action recorded elsewhere', note: 'Paper logs, spreadsheets, email' },
  { icon: FileSearch, label: 'Evidence assembled later', note: 'Pieced together for an audit' },
];

const connected: FlowItem[] = [
  { icon: Radio, label: 'Detect', note: 'Out-of-range condition identified' },
  { icon: Smartphone, label: 'Alert', note: 'Sent to the people who need to act' },
  { icon: Wrench, label: 'Respond', note: 'Acknowledged, escalated, actioned' },
  { icon: PenLine, label: 'Record', note: 'Captured as the work happens' },
  { icon: ShieldCheck, label: 'Prove', note: 'Evidence ready when asked' },
];

const capabilities = [
  {
    icon: Smartphone,
    title: 'Mobile alerting',
    description: 'Get critical alerts to the people who need to act, wherever they are.',
  },
  {
    icon: Workflow,
    title: 'Connected workflow',
    description: 'Connect an alert to acknowledgement, corrective action and resolution.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance built in',
    description: 'Create a clear, attributable record of changes, actions and approvals.',
  },
  {
    icon: Gauge,
    title: 'Calibration & IQ/OQ',
    description: 'Bring calibration records and operational qualification into the platform.',
  },
  {
    icon: Eye,
    title: 'Estate visibility',
    description: "See what's happening across sites and identify where attention is needed.",
  },
];

const complianceTopics = [
  'Audit trails',
  'Electronic signatures',
  'Threshold changes',
  'Corrective actions',
  'Calibration history',
  'IQ/OQ',
  'Reporting',
  'User accountability',
];

const migrationSteps = [
  'Understand your current environment',
  'Plan the migration',
  'Validate the new platform against your existing system',
  'Migrate your records',
  'Run and compare',
  'Cut over with confidence',
];

const linkButton =
  'inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors border border-border';

const eyebrow = 'text-xs font-semibold uppercase tracking-widest text-accent mb-3';

export default function CheckitPlatformCamPlusPage() {
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
                For CAM+ customers
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
                Keep your monitoring estate.{' '}
                <span className="text-gradient">Move your platform forward.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted mb-8 max-w-xl leading-relaxed">
                The Checkit Platform gives CAM+ customers a modern medical monitoring platform without
                replacing the sensors and infrastructure you already rely on.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3 mb-10">
                <DemoRequestButton industry="Checkit Platform — existing CAM+ customers" label="Talk to us about the Checkit Platform" />
                <Link href="#what-gets-better" className={linkButton}>
                  See what&apos;s changing
                </Link>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {proofPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
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
              <p className={eyebrow}>What stays</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                A new platform, without starting again.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                You have already invested in your monitoring estate. The Checkit Platform is designed to
                build on that investment, not force you to replace it.
              </p>
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {stays.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <EstateStack />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-16">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-background border border-border rounded-2xl p-6 card-glow">
                  <span className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="what-gets-better" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>What gets better</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Less fragmentation. More visibility.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              The work that used to be split across people and documents becomes one connected workflow.
            </p>
          </div>
          <FragmentedVsConnected today={today} connected={connected} />
        </div>
      </section>

      <section id="whats-new" className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>What&apos;s new</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              More than a new interface.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              The Checkit Platform adds the capabilities a modern monitoring estate needs, on top of the
              hardware you already run.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group relative bg-background border border-border rounded-2xl p-6 hover:border-accent/40 transition-colors overflow-hidden ${
                    i === 0 ? 'lg:row-span-2 flex flex-col' : ''
                  }`}
                >
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  <div className="relative w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="relative text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="relative text-sm text-muted leading-relaxed">{item.description}</p>
                  {i === 0 && (
                    <div className="relative mt-auto pt-8" aria-hidden="true">
                      <div className="mx-auto max-w-[15rem] rounded-2xl border border-white/10 bg-[#0b1220] p-3 shadow-xl">
                        {[
                          { text: 'Vaccine fridge · 8.9°C', tone: 'bg-red-500' },
                          { text: 'Escalated to on-call', tone: 'bg-amber-400' },
                          { text: 'Acknowledged', tone: 'bg-green-500' },
                        ].map((n) => (
                          <div key={n.text} className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-2.5 py-2 mb-1.5 last:mb-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${n.tone}`} />
                            <span className="text-[11px] text-foreground">{n.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="sm:col-span-2 lg:col-span-3 border border-dashed border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-surface-elevated text-muted flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">Asset Intelligence</h3>
                  <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-surface-elevated text-muted border border-border">
                    Expanding
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">An expanding capability on the platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className={eyebrow}>Compliance</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Turn monitoring data into evidence you can prove.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                When someone asks what happened, who acted and why, the evidence is already there.
              </p>
              <ul className="flex flex-wrap gap-2">
                {complianceTopics.map((topic) => (
                  <li
                    key={topic}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface border border-border text-sm text-foreground"
                  >
                    <Check className="w-3.5 h-3.5 text-accent" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
            <AuditTrailMock />
          </div>
        </div>
      </section>

      <section id="migration" className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <p className={eyebrow}>Migration</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Move when you&apos;re ready.</h2>
              <p className="text-lg text-muted leading-relaxed">
                A supported, controlled migration, step by step.
              </p>
            </div>
            <DemoRequestButton industry="Checkit Platform — existing CAM+ customers" label="Talk to us about your migration" />
          </div>
          <ol className="relative grid sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
            <span
              className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-0.5 bg-linear-to-r from-accent/30 via-accent to-green-400"
              aria-hidden="true"
            />
            {migrationSteps.map((step, i) => {
              const last = i === migrationSteps.length - 1;
              return (
                <li key={step} className="relative flex lg:flex-col lg:items-center lg:text-center gap-4 lg:gap-0">
                  <span
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ring-8 ring-surface lg:mb-5 ${
                      last ? 'bg-green-500 text-white' : 'bg-background border-2 border-accent text-accent'
                    }`}
                  >
                    {last ? <Check className="w-5 h-5" /> : i + 1}
                  </span>
                  <p className="font-medium text-foreground leading-snug pt-3 lg:pt-0">{step}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Built around the realities of medical estates.
          </h2>
          <p className="text-lg text-muted max-w-2xl mb-10">
            Quotes, logos and migration results will sit here once early Checkit Platform customers can be referenced.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {['Customer quotes', 'Customer logos', 'Migration results'].map((slot) => (
              <div
                key={slot}
                className="min-h-32 rounded-2xl border border-dashed border-border bg-surface/40 p-6 flex flex-col justify-between"
              >
                <p className="font-medium text-foreground">{slot}</p>
                <p className="text-sm text-muted">Placeholder. Nothing is claimed until the evidence exists.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-linear-to-br from-accent/25 via-accent/10 to-background px-6 py-14 sm:px-12 lg:py-20 text-center">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-64 bg-accent/30 blur-3xl rounded-full" aria-hidden="true" />
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-5 tracking-tight">
                Ready to move your monitoring platform forward?
              </h2>
              <p className="text-lg text-foreground/75 mb-8">
                Keep the estate you trust. Get the platform it deserves.
              </p>
              <DemoRequestButton industry="Checkit Platform — existing CAM+ customers" label="Talk to us about the Checkit Platform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
