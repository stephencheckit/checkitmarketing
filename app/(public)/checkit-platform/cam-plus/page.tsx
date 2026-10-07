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
    'Everything you rely on in CAM+, extended with mobile alerting, connected workflows and modern cloud infrastructure, on the sensors you already have.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://checkitv6.com/checkit-platform/cam-plus' },
  openGraph: {
    title: 'Upgrade to the new Checkit Platform without the risk.',
    description:
      'Everything you rely on in CAM+, extended with mobile alerting, connected workflows and modern cloud infrastructure, on the sensors you already have.',
    url: 'https://checkitv6.com/checkit-platform/cam-plus',
  },
};

const gains = [
  { icon: Smartphone, title: 'Mobile alerting', description: 'Critical alerts reach the people who need to act, on their phones, wherever they are.' },
  { icon: GitBranch, title: 'Connected workflows', description: 'Every alert flows through acknowledgement, corrective action and resolution in one place.' },
  { icon: Zap, title: 'Modern cloud infrastructure', description: 'A modern, web-based platform on secure cloud infrastructure, easy for your team to use.' },
  { icon: FileCheck, title: 'Audit-ready records', description: 'A clear, attributable record of changes, actions and approvals, ready before anyone asks for it.' },
  { icon: Gauge, title: 'Calibration and IQ/OQ in one place', description: 'Calibration records and qualification documents sit alongside the monitoring data they support.' },
  { icon: LayoutDashboard, title: 'Every site in one view', description: 'See what is happening across your sites and where attention is needed.' },
];

const stays = [
  { icon: Radio, title: 'Your sensors stay', description: 'The sensors already installed across your sites keep doing their job.' },
  { icon: Network, title: 'Your infrastructure stays', description: 'Your existing monitoring infrastructure remains in place.' },
  { icon: Activity, title: 'Your monitoring continues', description: 'Your assets stay monitored throughout the switch.' },
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

const complianceAdds = [
  'Every action and change attributed to a named user and time',
  'Optional eSignature, designed to meet 21 CFR Part 11 requirements',
  'Calibration records and IQ/OQ alongside your monitoring data',
  'Reports ready to share, across every site',
];

const upgradeSteps = [
  { title: 'Decide to upgrade', description: 'Talk to us about your sites and what the upgrade would change for your teams.' },
  { title: 'Migrate with support', description: 'Keep using CAM+ day to day while you test the new platform alongside it.' },
  { title: 'Get the benefits', description: 'Mobile alerting, connected workflows and modern cloud infrastructure, on the hardware you already have.' },
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
                Upgrade to the new Checkit Platform{' '}
                <span className="text-gradient">without the risk.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted mb-8 max-w-xl leading-relaxed">
                Everything you rely on in CAM+, extended with mobile alerting, connected workflows and modern
                cloud infrastructure, on the sensors you already have.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link
                  href="#whats-new"
                  className="btn-gradient inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg"
                >
                  See what&apos;s new
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

      <section id="how-it-works" className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>Alerts and response</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              The alerting you trust, extended to every step of the response.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              The monitoring and alarms you rely on stay at the core. The Checkit Platform takes them further,
              with alerts on your team&apos;s phones, automatic escalation and every action recorded from first
              alert to final evidence.
            </p>
          </div>
          <AlertJourney steps={journey} />
        </div>
      </section>

      <section id="whats-new" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>What&apos;s new</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              A modern, flexible and efficient way to monitor.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              The Checkit Platform builds on the monitoring you already trust, with new capabilities for your
              teams at every site.
            </p>
          </div>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gains.map((gain, i) => {
              const Icon = gain.icon;
              return (
                <div key={gain.title} className="rounded-2xl border border-border bg-surface p-6">
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

      <section className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className={eyebrow}>Compliance and evidence</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Go beyond keeping records, with evidence built into every step.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                CAM+ gives you a monitoring record you trust. The Checkit Platform builds on it, connecting
                every reading, alert, action and sign-off into evidence that is ready whenever an auditor or
                inspector asks.
              </p>
              <div className="rounded-2xl border border-border bg-background p-6">
                <p className="font-semibold text-foreground mb-4">What&apos;s new for compliance</p>
                <ul className="space-y-3">
                  {complianceAdds.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <AuditTrailMock />
          </div>
        </div>
      </section>

      <section id="what-stays" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>What stays</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything you rely on today comes with you.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Your sensors, infrastructure, history and processes stay in place, so you build on the
              investment you have already made.
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

      <section id="how-to-upgrade" className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>How to upgrade</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Three simple steps to the new platform.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Decide when you&apos;re ready, migrate with Checkit alongside you and start getting the benefits,
              without replacing your hardware.
            </p>
          </div>
          <ol className="grid sm:grid-cols-3 gap-4">
            {upgradeSteps.map((step, i) => (
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
                Ready to see the new Checkit Platform?
              </h2>
              <div>
                <p className="text-lg text-foreground/75 mb-6 leading-relaxed">
                  Keep the hardware you trust. Talk to us about upgrading, and about being one of the first
                  customers to run the Checkit Platform alongside CAM+.
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
