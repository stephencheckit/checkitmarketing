import { Metadata } from 'next';
import Link from 'next/link';
import DemoRequestButton from '@/components/DemoRequestButton';
import PlatformPreview from '@/components/checkit-platform/PlatformPreview';
import AlertJourney, { type JourneyStep } from '@/components/checkit-platform/AlertJourney';
import AuditTrailMock from '@/components/checkit-platform/AuditTrailMock';
import {
  ArrowRight,
  BellRing,
  Building2,
  Check,
  Droplet,
  Eye,
  FileCheck,
  FlaskConical,
  Gauge,
  GitBranch,
  Layers,
  Microscope,
  Network,
  Pill,
  Radio,
  ShieldCheck,
  Smartphone,
  Target,
  Timer,
  Workflow,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Checkit Platform',
  description:
    'The Checkit Platform brings monitoring, alerting, response, workflow and compliance together in one platform, helping healthcare teams protect critical assets and prove what happened.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://checkitv6.com/checkit-platform' },
  openGraph: {
    title: 'Medical monitoring, connected from alert to action to evidence.',
    description:
      'The Checkit Platform brings monitoring, alerting, response, workflow and compliance together in one platform.',
    url: 'https://checkitv6.com/checkit-platform',
  },
};

const needs = [
  'Know about it quickly',
  'Reach the right person',
  'Escalate if nobody responds',
  'Record what happened',
  'Take corrective action',
  'Demonstrate that the right process was followed',
  'Produce the evidence when required',
];

const journey: JourneyStep[] = [
  { id: 'detect', title: 'Detect', description: 'A monitored asset moves outside its defined parameters.' },
  { id: 'alert', title: 'Alert', description: 'The platform sends the alert through the appropriate channels.' },
  { id: 'escalate', title: 'Escalate', description: 'If nobody responds, the system follows the configured escalation path.' },
  { id: 'act', title: 'Act', description: 'The responsible person investigates and takes corrective action.' },
  { id: 'record', title: 'Record', description: 'The action, decision and resolution are captured.' },
  { id: 'prove', title: 'Prove', description: 'The complete record is available when you need to demonstrate compliance.' },
];

const capabilities = [
  { icon: Radio, title: '24/7 monitoring', description: 'Continuously monitor critical environments and equipment.' },
  { icon: Smartphone, title: 'Multi-channel alerting', description: 'Get the right alert to the right person.' },
  { icon: GitBranch, title: 'Automated escalation', description: 'Escalate automatically and capture acknowledgement.' },
  { icon: Workflow, title: 'Workflow & corrective action', description: 'Manage corrective action and resolution.' },
  { icon: Gauge, title: 'Calibration & IQ/OQ', description: 'Bring calibration records and operational qualification into the platform.' },
  { icon: FileCheck, title: 'Audit trails & compliance reporting', description: 'Create an attributable record of what happened.' },
];

const environments = [
  { icon: Pill, label: 'Pharmacy' },
  { icon: Microscope, label: 'Pathology' },
  { icon: Droplet, label: 'Blood & plasma' },
  { icon: FlaskConical, label: 'Biotech' },
  { icon: Building2, label: 'Hospitals' },
  { icon: Network, label: 'Distributed healthcare estates' },
];

const outcomes = [
  { icon: ShieldCheck, title: 'Protect what matters', description: 'Know when critical conditions change.' },
  { icon: Target, title: 'Respond with confidence', description: 'Get alerts to the people responsible for taking action.' },
  { icon: Timer, title: 'Reduce manual administration', description: 'Connect monitoring and response instead of piecing together evidence afterwards.' },
  { icon: FileCheck, title: 'Strengthen compliance', description: 'Create an attributable record of actions and decisions.' },
  { icon: Layers, title: 'Manage at estate scale', description: 'Give teams the visibility they need across sites and assets.' },
];

const complianceItems = ['Audit trail', 'Electronic signatures', 'Calibration', 'IQ/OQ', 'Corrective action', 'Reporting'];

const proofSlots = [
  'Customer logos',
  'Customer quotes',
  'Monitored assets and sites',
  'Years of healthcare experience',
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
                Medical monitoring platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
                Medical monitoring, connected from{' '}
                <span className="text-gradient">alert to action to evidence.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted mb-8 max-w-xl leading-relaxed">
                The Checkit Platform brings monitoring, alerting, response, workflow and compliance together
                in one platform, helping healthcare teams protect critical assets and prove
                what happened.
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
                Monitoring shouldn&apos;t end when the alarm sounds.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-6">
                Healthcare teams don&apos;t just need to know that something has gone out of range.
                They need to act on it, and prove that they did.
              </p>
              <p className="text-foreground leading-relaxed border-l-2 border-amber-400 pl-4">
                These activities can be spread across people, systems and documents.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-border bg-background p-5 sm:p-6">
                <div className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 mb-4">
                  <span className="relative flex w-9 h-9 items-center justify-center rounded-lg bg-red-500/20 text-red-400 shrink-0">
                    <BellRing className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">The alarm sounds.</p>
                    <p className="text-sm text-muted">Now the real work starts. Your team needs to:</p>
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

      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>How it works</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              One platform from detection to evidence.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Follow a single out-of-range event from the first reading to the finished record.
            </p>
          </div>
          <AlertJourney steps={journey} />
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className={eyebrow}>Capabilities</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Everything you need to manage a modern medical monitoring estate.
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="group relative bg-background border border-border rounded-2xl p-6 hover:border-accent/40 transition-colors overflow-hidden"
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
            <li className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-accent/30 bg-linear-to-r from-accent/15 to-accent/[0.03] px-6 py-5">
              <span className="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5" />
              </span>
              <div>
                <p className="text-lg font-semibold text-foreground">Estate-wide visibility</p>
                <p className="text-sm text-muted">For organisations managing multiple sites.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <p className={eyebrow}>Who it&apos;s for</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                From a single department to an entire estate.
              </h2>
              <p className="text-xl text-foreground/90 leading-relaxed">
                Designed for organisations where one missed alert, undocumented action or
                incomplete record can have serious operational and compliance consequences.
              </p>
            </div>
            <ul className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {environments.map((env) => {
                const Icon = env.icon;
                return (
                  <li
                    key={env.label}
                    className="group relative flex flex-col justify-between aspect-[4/3] rounded-2xl border border-border bg-linear-to-br from-surface to-background p-5 overflow-hidden hover:border-accent/40 transition-colors"
                  >
                    <Icon className="absolute -bottom-4 -right-4 w-24 h-24 text-accent/[0.07] group-hover:text-accent/[0.12] transition-colors" aria-hidden="true" />
                    <span className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="relative font-semibold text-foreground leading-snug">{env.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className={eyebrow}>Outcomes</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Why it matters</h2>
          </div>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;
              return (
                <div key={outcome.title} className="rounded-2xl border border-border bg-background p-6">
                  <Icon className="w-6 h-6 text-accent mb-5" />
                  <dt className="font-semibold text-foreground mb-2">{outcome.title}</dt>
                  <dd className="text-sm text-muted leading-relaxed">{outcome.description}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className={eyebrow}>Compliance</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Compliance isn&apos;t a report you create afterwards.
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                The Checkit Platform is designed to capture the evidence as work happens, from threshold
                changes and alerts through to corrective actions, approvals and resolution.
              </p>
              <ul className="flex flex-wrap gap-2">
                {complianceItems.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface border border-border text-sm text-foreground"
                  >
                    <Check className="w-3.5 h-3.5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <AuditTrailMock />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Trusted to monitor critical healthcare environments.
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
                See what connected medical monitoring could look like for your organisation.
              </h2>
              <div>
                <p className="text-lg text-foreground/75 mb-6 leading-relaxed">
                  Discover how the Checkit Platform can connect monitoring, alerting, response and compliance
                  across your healthcare estate.
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
