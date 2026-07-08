import { Metadata } from 'next';
import Link from 'next/link';
import {
  Pill,
  ArrowLeft,
  ArrowDown,
  HeartPulse,
  Banknote,
  FileX,
  Hourglass,
  Thermometer,
  Snowflake,
  Syringe,
  DoorOpen,
  Wifi,
  Monitor,
  Zap,
  Shield,
  ShieldCheck,
  ClipboardList,
  ClipboardCheck,
  Layers,
  Users,
  Building2,
  Gauge,
  ScrollText,
  Bell,
  Wrench,
  Droplets,
  Activity,
  Boxes,
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

export const metadata: Metadata = {
  title: 'CAM+ for Hospital Pharmacies | Certainty for Every Dose',
  description:
    'Continuous, audit-ready monitoring for medicine fridges, freezers, and storage across hospital pharmacies. CAM+ protects high-value medicines, releases staff time, and makes compliance demonstrable at a click.',
  keywords: [
    'hospital pharmacy temperature monitoring',
    'medicine fridge monitoring',
    'pharmacy compliance monitoring',
    'cold chain monitoring pharmacy',
    'vaccine storage monitoring',
    'pharmacy audit readiness',
  ],
  openGraph: {
    title: 'CAM+ for Hospital Pharmacies | Certainty for Every Dose',
    description:
      'A fridge drifts overnight and a batch of biologics quietly loses potency — nothing looks different. CAM+ monitors every medicine storage asset continuously, so certainty comes as standard.',
  },
};

const ripples = [
  {
    label: 'Patient Safety',
    icon: HeartPulse,
    title: 'The Dose That Looks Fine but Isn\u2019t',
    description:
      'A vial of monoclonal antibody therapy that sat through an overnight drift looks identical to one that didn\u2019t. Its potency may be gone. In oncology, immunology, or infectious disease care, an ineffective dose has consequences no one can see coming.',
  },
  {
    label: 'Financial Waste',
    icon: Banknote,
    title: 'A Quarter\u2019s Allocation, Gone Overnight',
    description:
      'A single batch of advanced cancer drugs can cost tens of thousands of pounds. One excursion can wipe out an entire quarter\u2019s allocation — in a budget environment where every incident of waste is harder to absorb than the last.',
  },
  {
    label: 'Audit Stress',
    icon: FileX,
    title: 'The Logbook That Doesn\u2019t Hold Up',
    description:
      'Auditors no longer accept paper logbooks and occasional checks. They expect continuous monitoring, validated systems, and secure audit trails — with evidence that alerts were raised and acted upon. Gaps in documentation carry real consequences.',
  },
  {
    label: 'Hidden Costs',
    icon: Hourglass,
    title: 'The Hours That Never Reach a Patient',
    description:
      'Backtracking, transcribing logs, chasing missing records, reconstructing incidents for auditors. The hidden costs of manual monitoring often exceed the stock loss itself — paid in skilled pharmacy time that should go to clinical work.',
  },
];

const compoundingSteps = [
  {
    icon: Users,
    headline: 'Fewer staff, larger portfolios',
    detail:
      'ICBs, workforce shortages, and procurement consolidation mean fewer people are responsible for more stock across more sites.',
  },
  {
    icon: ClipboardList,
    headline: 'Manual checks across every ward and store',
    detail:
      'Clipboards, spreadsheets, and disparate devices don\u2019t scale. Hours each week go to repetitive checks and transcription.',
  },
  {
    icon: Gauge,
    headline: 'Stretched teams miss things',
    detail:
      'When staff are stretched, manual systems fail: temperatures get missed, alerts are overlooked, data goes unrecorded.',
  },
  {
    icon: Layers,
    headline: 'Each lapse compounds the risk',
    detail:
      'Every gap heightens exposure for patients, budgets, and compliance — and treatments are only getting more storage-sensitive.',
  },
];

const differentiators = [
  {
    icon: ShieldCheck,
    title: 'Reliability You Can Stake an Audit On',
    description:
      'Continuous monitoring with accurate, timely alerts — free from the false positives that train teams to ignore alarms. When CAM+ escalates, it matters.',
  },
  {
    icon: ScrollText,
    title: 'Compliance Support Built In',
    description:
      'Full traceability of readings, calibrations, and interventions, ready for inspection at a click. Not just reactive records — a preventative system regulators recognise.',
  },
  {
    icon: Zap,
    title: 'Efficiency That Releases Clinical Time',
    description:
      'Automation replaces repetitive checks and transcription. Pharmacy staff regain hours every week for counselling, clinical reviews, and the work only they can do.',
  },
  {
    icon: Building2,
    title: 'Scalability Without Added Complexity',
    description:
      'Consistency across sites, pharmacies, and wards from one platform. The same system in the main pharmacy, the satellite unit, and the ward fridge on level six.',
  },
];

const sensorDataTypes = [
  {
    icon: Thermometer,
    title: 'Medicine Refrigerators',
    scenario:
      'Every pharmacy and ward fridge held at its validated range, monitored continuously with alerts before stock is at risk — not after.',
  },
  {
    icon: Snowflake,
    title: 'Pharmacy Freezers',
    scenario:
      'Frozen medicines and temperature-critical stock watched around the clock, including the nights and weekends when no one is walking past.',
  },
  {
    icon: Syringe,
    title: 'Vaccines & Biologics',
    scenario:
      'The most storage-sensitive, highest-value items in the building — chemotherapy agents, biologics, vaccines — protected with continuous evidence of integrity.',
  },
  {
    icon: Boxes,
    title: 'Ambient Store Rooms',
    scenario:
      'Controlled ambient storage where summer heat or a failed AC unit quietly takes medicines outside their licensed range.',
  },
  {
    icon: DoorOpen,
    title: 'Door & Seal Events',
    scenario:
      'A fridge door left ajar is the most common cause of excursions. Caught in minutes with an alert, not discovered at the next check.',
  },
  {
    icon: Droplets,
    title: 'Humidity',
    scenario:
      'Storage areas where moisture affects packaging integrity and product stability, logged automatically alongside temperature.',
  },
  {
    icon: Wrench,
    title: 'Equipment Health',
    scenario:
      'Compressor behaviour and temperature patterns that signal a failing fridge — so it\u2019s repaired before it fails with a full load of stock.',
  },
  {
    icon: Activity,
    title: 'Power & Environment',
    scenario:
      'Power interruptions and environmental events captured with a complete timeline, ready for the incident review and the auditor.',
  },
];

const useCases = [
  {
    icon: ClipboardCheck,
    title: 'Automated Temperature Records',
    description: 'Every fridge and freezer logged continuously. No clipboards, no transcription, no end-of-shift memory.',
    tag: '24/7',
  },
  {
    icon: Bell,
    title: 'Excursion Alerts & Escalation',
    description: 'The right person alerted immediately, with escalation if unacknowledged — and the response captured for the record.',
    tag: 'Real-time',
  },
  {
    icon: Shield,
    title: 'Audit-Ready Reporting',
    description: 'Compliance demonstrable at a click. Complete, tamper-proof documentation the moment inspectors ask.',
    tag: 'Inspection-proof',
  },
  {
    icon: ScrollText,
    title: 'Calibration Traceability',
    description: 'Calibration records maintained and documented against every sensor — one less thing to chase before an audit.',
    tag: 'Traceable',
  },
  {
    icon: Monitor,
    title: 'Multi-Site Dashboards',
    description: 'Chief pharmacists and quality leads see every site and ward fridge in one live view, without leaving their desk.',
    tag: 'Estate-wide',
  },
  {
    icon: ClipboardList,
    title: 'Standardised Procedures',
    description: 'One monitoring approach across pharmacy, satellites, and wards — consistent training, consistent records.',
    tag: 'Consistent',
  },
];

const journeySteps = [
  {
    step: 1,
    title: 'Protect the Highest-Value Stock First',
    description:
      'Start with the fridges holding biologics, chemotherapy agents, and vaccines. Wireless sensors install in minutes and monitoring starts the same day.',
    duration: 'Days, not months',
  },
  {
    step: 2,
    title: 'Retire the Paper Logs',
    description:
      'Manual checks give way to continuous automated records across the pharmacy. Staff hours come back; documentation gaps close for good.',
    duration: 'Immediate impact',
  },
  {
    step: 3,
    title: 'Extend to Wards and Satellites',
    description:
      'Ward fridges and satellite units join the same platform — the assets most likely to be missed under manual regimes get the same protection as the main pharmacy.',
    duration: 'Site by site',
  },
  {
    step: 4,
    title: 'Give Leaders the Full Picture',
    description:
      'Chief pharmacists and governance teams get live dashboards and trend reporting across every site, with data that stands up in any inspection.',
    duration: 'Estate-wide',
  },
  {
    step: 5,
    title: 'Make Certainty the Standard',
    description:
      'Inspections become routine. Excursions become rare, caught early, and fully documented. The pharmacy demonstrates control instead of explaining gaps.',
    duration: 'Ongoing assurance',
  },
];

const outcomes = [
  { stat: '24/7', label: 'Continuous monitoring of every asset', detail: 'nights, weekends, holidays' },
  { stat: '100%', label: 'Of temperature records captured automatically', detail: 'no paper, no gaps, no memory' },
  { stat: '0', label: 'Manual fridge checks', detail: 'clinical time back where it belongs' },
  { stat: '1', label: 'Platform across pharmacy, wards, and sites', detail: 'one source of truth' },
];

export default function PharmaciesMarketPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero: pharmacy background with overlay */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=1920&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/92 via-slate-900/85 to-slate-900/60" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-slate-950/30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 mb-10 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All Markets
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-white/10 text-white/90 border border-white/20 rounded-full backdrop-blur-sm">
                CAM+ · Hospital Pharmacies
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Certainty for{' '}
              <span className="text-cyan-400">Every Dose</span> You Dispense
            </h1>

            <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              Hospital pharmacies hold life-saving medicines that must stay
              within strict temperature ranges — yet many still rely on
              clipboards and occasional checks. CAM+ monitors every fridge,
              freezer, and store room continuously, so compromised stock never
              reaches a patient and audits never keep you up at night.
            </p>

            <DemoRequestButton
              industry="Hospital Pharmacies"
              label="Book a Demo"
            />
          </div>
        </div>
      </section>

      {/* The moment: the invisible failure */}
      <section className="relative py-20 lg:py-28 bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/82" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/60 via-transparent to-slate-950/70" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 rounded-full mb-6">
            The failure you cannot see
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
            There&apos;s No Point Giving Medicines That Don&apos;t Work
          </h2>
          <div className="space-y-5 text-lg text-slate-300 leading-relaxed">
            <p>
              Medicines are not ordinary products. Chemotherapy agents,
              biologics, blood products, and vaccines are delicate formulations
              designed to interact with the body in precise ways — and they are
              unforgiving about how they are stored.
            </p>
            <p>
              A fridge drifts outside its validated range overnight. By
              morning, the temperature has recovered. The vials inside look
              exactly as they did yesterday. Nothing is visibly wrong.
            </p>
            <p className="text-white font-medium">
              But the potency may be gone — and the impact lands on a
              patient&apos;s treatment, not a spreadsheet. The cost isn&apos;t
              just financial. It&apos;s measured in outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* The ripples: one excursion, four costs */}
      <section className="relative py-20 lg:py-28 bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1920&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/50 via-transparent to-slate-950/70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              One Excursion. Four Ways It Costs You.
            </h2>
            <p className="text-slate-400 text-lg">
              The direct cost is wasted stock. The hidden costs — time, audit
              stress, lost opportunities — are often larger, and they land on a
              team already stretched thin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {ripples.map((ripple) => {
              const Icon = ripple.icon;
              return (
                <div
                  key={ripple.title}
                  className="group/card bg-cyan-950/30 border border-cyan-500/20 rounded-2xl p-7 backdrop-blur-sm hover:scale-[1.02] hover:border-cyan-500/40 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                      {ripple.label}
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 group-hover/card:bg-white/20 flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-cyan-300 group-hover/card:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1.5">
                        {ripple.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed group-hover/card:text-slate-300 transition-colors duration-300">
                        {ripple.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The squeeze: more pressure, fewer resources */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[130px]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 rounded-full mb-5">
              The operational reality
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              More Pressure. Fewer Resources. Manual Systems Break.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              While regulatory expectations rise, pharmacy teams are being
              asked to do more with less — and clipboard-based monitoring is
              where the strain shows first.
            </p>
          </div>

          <div className="space-y-4">
            {compoundingSteps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.headline}>
                  <div className="group flex items-center gap-5 p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/25 transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-cyan-500 flex items-center justify-center shrink-0 transition-colors duration-200">
                      <Icon className="w-6 h-6 text-cyan-300 group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white">
                        {item.headline}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mt-0.5">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                  {i < compoundingSteps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-5 h-5 text-cyan-500/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl bg-linear-to-r from-cyan-700 to-cyan-600 p-8 lg:p-10 text-center shadow-xl shadow-cyan-500/20">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-100 mb-3">
              The Standard Has Moved
            </p>
            <p className="text-xl lg:text-2xl font-bold text-white leading-snug max-w-3xl mx-auto">
              Regulators no longer accept paper logbooks. They expect
              continuous monitoring, validated systems, and secure audit trails
              — with proof that alerts are acted upon, not just raised.
            </p>
          </div>
        </div>
      </section>

      {/* The fix: CAM+ platform overview */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-teal-100 text-teal-700 rounded-full mb-5">
              The CAM+ Platform
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              From Constant Risk to Proactive Control
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Wireless sensors, cloud analytics, and automated reporting shift
              the pharmacy out of the cycle of manual checks and reactive
              firefighting. Incidents flagged in real time. Reports generated
              instantly. Compliance demonstrable at a click.
            </p>
          </div>

          <div>
            <img
              src="https://checkitv6.com/checkit%20v6-1.webp"
              alt="CAM+ platform: sensors, dashboards, and mobile app working together"
              className="w-full max-w-4xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Why pharmacies choose CAM+ */}
      <section className="relative py-20 lg:py-28 bg-slate-50">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 24L24 0' stroke='%2394a3b8' stroke-width='0.4' stroke-opacity='0.15' fill='none'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                The Four Essentials Pharmacy Leaders Demand
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                Not more alarms, not more data — assurance. Systems that
                actively reduce risk, protect patients, and simplify
                compliance.
              </p>
              <DemoRequestButton
                industry="Hospital Pharmacies"
                variant="secondary"
                label="Learn More"
                className="bg-teal-50! text-teal-700! hover:bg-teal-100!"
              />
            </div>

            <div className="lg:col-span-3 space-y-6">
              {differentiators.map((diff, i) => {
                const Icon = diff.icon;
                return (
                  <div
                    key={diff.title}
                    className="group flex gap-5 p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 cursor-default"
                  >
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <span className="text-2xl font-bold text-slate-300 group-hover:text-teal-600 transition-colors duration-300">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-teal-500 group-hover:shadow-lg group-hover:shadow-teal-500/30 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                        <Icon className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:rotate-6 transition-all duration-300" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1.5 group-hover:text-teal-900 transition-colors duration-300">
                        {diff.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-600 transition-colors duration-300">
                        {diff.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 1. SENSORS */}
      <section className="relative py-20 lg:py-28 bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1.5' fill='%23fff' fill-opacity='0.3'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
                01 / Continuous Monitoring
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Every Storage Asset, Watched Around the Clock
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              From the main pharmacy cold room to the ward fridge no one walks
              past on weekends — CAM+ sensors monitor continuously and alert
              the moment anything drifts.
            </p>
          </div>

          <div className="space-y-3">
            {sensorDataTypes.map((sensor) => {
              const Icon = sensor.icon;
              return (
                <div
                  key={sensor.title}
                  className="group flex items-center gap-5 p-4 lg:p-5 rounded-xl bg-white/5 border border-white/[0.07] hover:bg-teal-500/10 hover:border-teal-500/20 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-teal-500 flex items-center justify-center shrink-0 transition-colors duration-200">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-sm font-semibold text-white whitespace-nowrap">
                        {sensor.title}
                      </h3>
                      <div className="hidden sm:block h-px flex-1 bg-white/10" />
                    </div>
                    <p className="text-slate-400 group-hover:text-slate-300 text-sm leading-relaxed mt-0.5 transition-colors duration-200">
                      {sensor.scenario}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. COMPLIANCE */}
      <section className="relative py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                02 / Compliance, Handled
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Audits Passed Without Sleepless Nights
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Complete traceability produced as a by-product of simply running
              — not assembled in a panic the week before an inspection.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={useCase.title}
                  className="group/uc flex gap-4 p-5 rounded-xl bg-slate-50 border-l-4 border-l-slate-200 hover:border-l-teal-500 hover:bg-teal-50/50 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 group-hover/uc:border-teal-200 group-hover/uc:bg-teal-50 flex items-center justify-center shrink-0 transition-all duration-200">
                    <Icon className="w-5 h-5 text-slate-400 group-hover/uc:text-teal-600 transition-colors duration-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {useCase.title}
                      </h3>
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 group-hover/uc:text-teal-600 group-hover/uc:bg-teal-100 rounded transition-colors duration-200">
                        {useCase.tag}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business case strip */}
      <section className="relative py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-slate-200 p-8 lg:p-10">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 rounded-full mb-3">
                  Building the business case
                </span>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-snug">
                  Preparing a submission for the next financial year?
                </h3>
              </div>
              <div className="lg:col-span-2 grid sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1.5">
                    CapEx / revenue clarity
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Itemised costings split cleanly between capital and revenue
                    budgets, so finance teams can validate without back-and-forth.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1.5">
                    ROI models that hold up
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Grounded in staff hours released, stock protected, and audit
                    performance — concrete numbers, not general claims.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1.5">
                    Realistic timelines
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Implementation plans that reflect real NHS operating
                    environments, ready to move the moment funding is approved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="relative py-20 lg:py-24 bg-teal-600 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='20' stroke='%23fff' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='40' cy='40' r='35' stroke='%23fff' stroke-width='0.3' fill='none'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center tracking-tight">
            What Certainty as Standard Looks Like
          </h2>
          <p className="text-teal-100 text-center mb-14 text-lg max-w-xl mx-auto">
            Medicines safe, patients protected, audits passed — without the
            firefighting.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {outcomes.map((outcome) => (
              <div
                key={outcome.label}
                className="group/stat text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10 hover:bg-white/20 hover:border-white/20 hover:scale-105 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 cursor-default"
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover/stat:scale-110 transition-transform duration-300">
                  {outcome.stat}
                </div>
                <div className="text-sm text-teal-100">{outcome.label}</div>
                <div className="mt-2 overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover/stat:max-h-8 group-hover/stat:opacity-100">
                  <p className="text-xs text-teal-200/70">{outcome.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Journey */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=1920&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/40 via-transparent to-slate-950/60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Implementation Without the Battleground
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Frontline teams have no capacity for months of workshops and
              process redesign. CAM+ deploys around the pharmacy&apos;s day —
              and delivers measurable value in weeks.
            </p>
          </div>

          {/* Desktop: alternating timeline */}
          <div className="hidden lg:block relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-teal-500/40 -translate-x-1/2" />
            <div className="space-y-12">
              {journeySteps.map((step, i) => {
                const isLeft = i % 2 === 0;
                const cardClasses = "group/step bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/[0.18] hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 cursor-default";
                const card = (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed group-hover/step:text-slate-200 transition-colors duration-300">
                      {step.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/0 group-hover/step:border-white/10 overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover/step:max-h-10 group-hover/step:opacity-100">
                      <span className="text-xs font-semibold text-teal-400">
                        {step.duration}
                      </span>
                    </div>
                  </>
                );
                return (
                  <div key={step.step} className="relative flex items-start">
                    {isLeft ? (
                      <>
                        <div className="w-1/2 pr-12 text-right">
                          <div className={`${cardClasses} inline-block text-left max-w-md ml-auto`}>
                            {card}
                          </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-teal-500/30 z-10">
                          {step.step}
                        </div>
                        <div className="w-1/2 pl-12" />
                      </>
                    ) : (
                      <>
                        <div className="w-1/2 pr-12" />
                        <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-teal-500/30 z-10">
                          {step.step}
                        </div>
                        <div className="w-1/2 pl-12">
                          <div className={`${cardClasses} max-w-md`}>
                            {card}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="lg:hidden relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-teal-500/40" />
            <div className="space-y-8">
              {journeySteps.map((step) => (
                <div key={step.step} className="relative flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-bold shrink-0 z-10 shadow-lg shadow-teal-500/30">
                    {step.step}
                  </div>
                  <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                    <h3 className="text-base font-semibold text-white mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    <p className="text-teal-400 text-xs mt-3 font-semibold">
                      {step.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-slate-50/80 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Make Certainty the Standard
          </h2>
          <p className="text-slate-500 mb-10 text-lg max-w-xl mx-auto">
            Book a 15-minute walkthrough tailored to your pharmacy — main site,
            satellites, and every ward fridge in between.
          </p>
          <DemoRequestButton
            industry="Hospital Pharmacies"
            label="See It in Action"
          />
        </div>
      </section>
    </div>
  );
}
