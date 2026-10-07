import { Metadata } from 'next';
import Link from 'next/link';
import DemoRequestButton from '@/components/DemoRequestButton';
import PlatformPreview from '@/components/checkit-platform/PlatformPreview';
import AlertJourney, { type JourneyStep } from '@/components/checkit-platform/AlertJourney';
import AuditTrailMock from '@/components/checkit-platform/AuditTrailMock';
import {
  Activity,
  ArrowRight,
  Check,
  ClipboardList,
  FileCheck,
  Gauge,
  GitBranch,
  History,
  LayoutDashboard,
  Network,
  Radio,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Checkit Platform for CAM+ Customers',
  description:
    'Keep the sensors and infrastructure you already rely on, and gain mobile alerts, a connected response and audit-ready records on the Checkit Platform.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://checkitv6.com/checkit-platform/cam-plus' },
  openGraph: {
    title: 'Keep the hardware you trust. Get a better way to work.',
    description:
      'Keep the sensors and infrastructure you already rely on, and gain mobile alerts, a connected response and audit-ready records on the Checkit Platform.',
    url: 'https://checkitv6.com/checkit-platform/cam-plus',
  },
};

const gains = [
  { icon: Smartphone, title: 'Alerts that reach people anywhere', description: 'Get critical alerts to the people who need to act, on their phones, wherever they are.' },
  { icon: GitBranch, title: 'One connected response', description: 'Every alert connects to acknowledgement, corrective action and resolution, instead of calls and paper logs.' },
  { icon: FileCheck, title: 'Audits without the scramble', description: 'A clear, attributable record of changes, actions and approvals, ready before anyone asks for it.' },
  { icon: Gauge, title: 'Calibration and IQ/OQ in one place', description: 'Calibration records and qualification documents sit alongside the monitoring data they support.' },
  { icon: LayoutDashboard, title: 'Every site in one view', description: 'See what is happening across your sites and where attention is needed.' },
  { icon: Zap, title: 'A modern, web-based platform', description: 'Move from legacy interfaces to a modern platform that is easier for your team to use.' },
];

const stays = [
  { icon: Radio, title: 'Your sensors stay', description: 'The sensors already installed across your sites keep doing their job.' },
  { icon: Network, title: 'Your infrastructure stays', description: 'Your existing monitoring infrastructure remains in place.' },
  { icon: Activity, title: 'Your monitoring continues', description: 'Your assets stay monitored while you move to the new platform.' },
  { icon: History, title: 'Your history comes with you', description: 'Your historical monitoring records move across to the new platform.' },
  { icon: ClipboardList, title: 'Your processes are supported', description: 'The established processes your teams rely on are supported.' },
  { icon: ShieldCheck, title: 'No rip and replace', description: 'Build on the investment you have already made, rather than starting again.' },
];

const journey: JourneyStep[] = [
  { id: 'detect', title: 'Detect', description: 'A monitored asset moves outside its defined parameters.' },
  { id: 'alert', title: 'Alert', description: 'The alert reaches the right people on their phones and other configured channels, wherever they are.' },
  { id: 'escalate', title: 'Escalate', description: 'If nobody acknowledges, the configured escalation path takes over automatically.' },
  { id: 'act', title: 'Act', description: 'The responsible person follows the agreed response and records what they did.' },
  { id: 'record', title: 'Record', description: 'The acknowledgement, actions and resolution are captured, by name and time.' },
  { id: 'prove', title: 'Prove', description: 'The complete record is ready when you need to demonstrate compliance.' },
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
  { title: 'Understand your current environment', description: 'We start with your sites, sensors and how your teams work today.' },
  { title: 'Plan the migration', description: 'Agree the approach and timing with your team.' },
  { title: 'Validate', description: 'Validate the new platform against your existing system.' },
  { title: 'Migrate your records', description: 'Your monitoring history moves across with you.' },
  { title: 'Run and compare', description: 'Check the new platform against what you see today.' },
  { title: 'Cut over with confidence', description: 'Switch when you are satisfied, with Checkit supporting you.' },
];

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
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
                Keep the hardware you trust.{' '}
                <span className="text-gradient">Get a better way to work.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted mb-8 max-w-xl leading-relaxed">
                The Checkit Platform builds on the sensors and infrastructure you already rely on, adding
                mobile alerts, a connected response and audit-ready records, without a rip and replace.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link
                  href="#what-you-gain"
                  className="btn-gradient inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg"
                >
                  See what you gain
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <DemoRequestButton industry="Checkit Platform (existing CAM+ customers)" variant="secondary" label="Talk to us" />
              </div>
            </div>
            <div className="lg:col-span-6 lg:pl-4">
              <PlatformPreview />
            </div>
          </div>
        </div>
      </section>

      <section id="what-you-gain" className="py-20 lg:py-28 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>What you gain</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Less chasing. Less paperwork. More control.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              The work that used to be split across phone calls, paper logs and spreadsheets becomes one
              connected platform.
            </p>
          </div>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gains.map((gain, i) => {
              const Icon = gain.icon;
              return (
                <div key={gain.title} className="rounded-2xl border border-border bg-background p-6">
                  <div className="flex items-center justify-between mb-5">
                    <Icon className="w-6 h-6 text-accent" />
                    <span className="text-xs font-semibold text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <dt className="font-semibold text-foreground mb-2">{gain.title}</dt>
                  <dd className="text-sm text-muted leading-relaxed">{gain.description}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section id="what-stays" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>What stays</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              A new platform, without starting again.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              You have already invested in your monitoring hardware. The Checkit Platform is designed to
              build on that investment, not force you to replace it.
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stays.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="rounded-2xl border border-border bg-surface p-6">
                  <span className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>Alerts and response</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              From alarm to evidence, in one flow.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Today, an alarm can mean phone calls, paper logs and evidence pieced together later. On the
              Checkit Platform, alerts reach the right people on their phones, and every acknowledgement,
              action and resolution is recorded as it happens.
            </p>
          </div>
          <AlertJourney steps={journey} />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className={eyebrow}>Compliance and evidence</p>
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
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>Migration</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Move when you&apos;re ready.</h2>
            <p className="text-lg text-muted leading-relaxed">A supported, controlled migration, step by step.</p>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {migrationSteps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-border bg-background p-6">
                <span className="w-10 h-10 rounded-full border-2 border-accent text-accent font-bold flex items-center justify-center mb-4">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-linear-to-br from-accent/25 via-accent/10 to-background px-6 py-14 sm:px-12 lg:py-20">
            <div className="absolute -top-24 right-0 w-[32rem] h-64 bg-accent/30 blur-3xl rounded-full" aria-hidden="true" />
            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                Ready to move your monitoring platform forward?
              </h2>
              <div>
                <p className="text-lg text-foreground/75 mb-6 leading-relaxed">
                  Keep the hardware you trust. Talk to us about what the Checkit Platform means for your
                  sites and how the move would work.
                </p>
                <DemoRequestButton industry="Checkit Platform (existing CAM+ customers)" label="Talk to us" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
