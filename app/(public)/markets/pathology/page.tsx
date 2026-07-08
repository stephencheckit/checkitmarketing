import { Metadata } from 'next';
import Link from 'next/link';
import {
  Microscope,
  ArrowLeft,
  ArrowDown,
  HeartPulse,
  Droplets,
  FileX,
  Users,
  Thermometer,
  Snowflake,
  TestTubes,
  Truck,
  DoorOpen,
  Wifi,
  Monitor,
  Zap,
  Shield,
  ShieldCheck,
  ClipboardList,
  ClipboardCheck,
  TrendingUp,
  Network,
  Route,
  Puzzle,
  ScrollText,
  Bell,
  Wrench,
  FlaskConical,
  Activity,
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

export const metadata: Metadata = {
  title: 'CAM+ for Pathology Networks | Protect Every Sample, Every Site',
  description:
    'Continuous, audit-ready monitoring for blood, tissue, and pathology samples across hub-and-spoke networks. CAM+ turns temperature control from a hidden vulnerability into a visible strength.',
  keywords: [
    'pathology temperature monitoring',
    'blood bank monitoring system',
    'pathology network consolidation',
    'sample integrity monitoring',
    'laboratory compliance monitoring',
    'hub and spoke pathology',
  ],
  openGraph: {
    title: 'CAM+ for Pathology Networks | Protect Every Sample, Every Site',
    description:
      'A single temperature excursion can mean a failed transfusion, a false result, a postponed procedure. CAM+ monitors every fridge, freezer, and incubator across your network — continuously, automatically, audit-ready.',
  },
};

const ripples = [
  {
    label: 'Patient Safety',
    icon: HeartPulse,
    title: 'The Consequence That Stays Hidden',
    description:
      'A compromised blood unit or degraded sample is not just waste — it is risk. Transfusing unsuitable blood can cause serious reactions. A spoiled sample can produce a false result, a misdiagnosis, the wrong treatment. The damage rarely announces itself; it surfaces later, when it matters most.',
  },
  {
    label: 'Wasted Donations',
    icon: Droplets,
    title: 'A Gift, Given Freely, Thrown Away',
    description:
      'Every blood unit carries the cost of collection, rigorous testing, and the donation itself — given voluntarily by someone who trusted the system to use it well. Every unit lost to an excursion is doubly costly: financially and ethically.',
  },
  {
    label: 'Audit Exposure',
    icon: FileX,
    title: 'The Record That Cannot Be Reconstructed',
    description:
      'Regulators expect verifiable proof, not paper charts and occasional checks. When an excursion happens, hours of skilled staff time disappear into reconstructing events and answering auditors — and a missing log can carry serious consequences.',
  },
  {
    label: 'Public Trust',
    icon: Users,
    title: 'Confidence Lost in a Single Lapse',
    description:
      'Donors give because they believe their gift will save lives. Staff morale suffers when they are forced to dispose of stock they know could have helped a patient. Trust is built over years and lost in one mishandled incident.',
  },
];

const compoundingSteps = [
  {
    icon: Route,
    headline: 'Samples travel further, more often',
    detail:
      'What was once a short walk along a corridor is now a 40-minute drive between spoke and hub. Every van journey and courier transfer introduces exposure.',
  },
  {
    icon: Puzzle,
    headline: 'A patchwork of monitoring systems',
    detail:
      'One fridge has a digital logger, another relies on paper charts, another on occasional checks. Inconsistency complicates training and multiplies the chance of error.',
  },
  {
    icon: Users,
    headline: 'Staff move between sites',
    detail:
      'In a consolidated network, people work across hubs and spokes. Different systems at every site mean confusion, retraining, and gaps at exactly the wrong moments.',
  },
  {
    icon: ScrollText,
    headline: 'Audit demand multiplies across trusts',
    detail:
      'Central teams overseeing multiple trusts need consistent, reliable compliance data. Patchy systems produce patchy records — and patchy records raise audit risk.',
  },
];

const differentiators = [
  {
    icon: Network,
    title: 'Proven Scalability Across Networks',
    description:
      'The same system, the same interface, the same safeguards — whether the site is a rural spoke or a city-centre hub. Staff encounter one way of working everywhere, and central teams see one consistent picture.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Designed In, Not Bolted On',
    description:
      'Continuous readings, transparent audit trails, and calibration traceability that stand up to scrutiny. Not just alerts raised — evidence that they were acted on.',
  },
  {
    icon: Zap,
    title: 'Minimal Implementation Burden',
    description:
      'Consolidation is disruptive enough. CAM+ deploys in days, not months — wireless sensors, no complex integrations, and training measured in minutes. Value in weeks, not quarters.',
  },
  {
    icon: TrendingUp,
    title: 'Aligned With Where the NHS Is Going',
    description:
      'Consolidation is about standardisation, efficiency, and risk reduction at scale. CAM+ is built for exactly that operating model — one platform underpinning the whole network.',
  },
];

const sensorDataTypes = [
  {
    icon: Droplets,
    title: 'Blood Bank Refrigerators',
    scenario:
      'Continuous monitoring of blood storage at validated ranges, with immediate alerts the moment conditions drift — before stock is at risk, not after.',
  },
  {
    icon: Snowflake,
    title: 'Plasma & Ultra-Low Freezers',
    scenario:
      'Plasma, tissue, and long-term sample storage down to ultra-low temperatures, watched around the clock — nights, weekends, and holidays included.',
  },
  {
    icon: TestTubes,
    title: 'Sample Storage & Incubators',
    scenario:
      'Reagents, cultures, and pathology samples held in precise conditions, with every reading logged automatically against its validated range.',
  },
  {
    icon: Thermometer,
    title: 'Ambient Lab Environments',
    scenario:
      'Room conditions in labs and storage areas where ambient drift quietly degrades reagents and equipment performance.',
  },
  {
    icon: Truck,
    title: 'Transport Between Sites',
    scenario:
      'The journey between spoke and hub is the most exposed link in the chain. Monitoring that travels with the sample closes the gap.',
  },
  {
    icon: DoorOpen,
    title: 'Door & Seal Events',
    scenario:
      'A fridge door left ajar is the most common cause of excursions. Catch it in minutes — not at the next manual check.',
  },
  {
    icon: Wrench,
    title: 'Equipment Health',
    scenario:
      'Compressor behaviour and temperature patterns that signal a failing unit — so it gets fixed before it fails with stock inside.',
  },
  {
    icon: Activity,
    title: 'Power & Environment',
    scenario:
      'Power interruptions and environmental events captured and escalated automatically, with a complete timeline for the incident review.',
  },
];

const useCases = [
  {
    icon: ClipboardCheck,
    title: 'Continuous Temperature Records',
    description: 'Every fridge, freezer, and incubator logged automatically. No clipboards, no transcription, no gaps.',
    tag: '24/7',
  },
  {
    icon: Bell,
    title: 'Excursion Alerts & Escalation',
    description: 'The right person alerted immediately, with escalation if no one responds. Response actions captured for the record.',
    tag: 'Real-time',
  },
  {
    icon: Shield,
    title: 'Audit-Ready Reporting',
    description: 'Tamper-proof records available instantly when inspectors arrive. No binders, no spreadsheets, no scrambling.',
    tag: 'Inspection-proof',
  },
  {
    icon: ScrollText,
    title: 'Calibration Traceability',
    description: 'Sensor calibration records maintained and documented — one more thing auditors ask for, answered in seconds.',
    tag: 'Traceable',
  },
  {
    icon: Monitor,
    title: 'Network-Wide Dashboards',
    description: 'Every site, every asset, one view. Central quality teams see compliance status across the whole network, live.',
    tag: 'Hub & spoke',
  },
  {
    icon: ClipboardList,
    title: 'Standardised Procedures',
    description: 'One monitoring approach across every site, so staff moving between hubs and spokes always know what to expect.',
    tag: 'Consistent',
  },
];

const journeySteps = [
  {
    step: 1,
    title: 'Protect the Highest-Risk Assets First',
    description:
      'Start with blood bank fridges and sample freezers at your hub. Wireless sensors install without disrupting the lab, and monitoring begins the same day.',
    duration: 'Days, not months',
  },
  {
    step: 2,
    title: 'Retire the Paper Logs',
    description:
      'Manual checks and paper charts give way to continuous automated records. Staff time comes back; audit gaps close permanently.',
    duration: 'Immediate impact',
  },
  {
    step: 3,
    title: 'Standardise Across the Spokes',
    description:
      'Roll the same system out to every site in the network. Same sensors, same interface, same records — wherever staff work.',
    duration: 'Site by site',
  },
  {
    step: 4,
    title: 'Give Central Teams the Full Picture',
    description:
      'Quality and governance teams get live dashboards across every trust and site, with consistent data that stands up in any audit.',
    duration: 'Network-wide',
  },
  {
    step: 5,
    title: 'Turn Compliance Into Confidence',
    description:
      'With monitoring standardised and records complete, inspections become routine. The network demonstrates control instead of explaining gaps.',
    duration: 'Ongoing assurance',
  },
];

const outcomes = [
  { stat: '24/7', label: 'Continuous monitoring of every asset', detail: 'nights, weekends, transport' },
  { stat: '100%', label: 'Of temperature records captured automatically', detail: 'no paper, no gaps, no memory' },
  { stat: '0', label: 'Manual temperature logs', detail: 'skilled staff time back on the bench' },
  { stat: '1', label: 'System across the whole network', detail: 'every hub, every spoke, one view' },
];

export default function PathologyMarketPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero: pathology lab background with overlay */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1920&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/92 via-slate-900/82 to-slate-900/55" />
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
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-white/10 text-white/90 border border-white/20 rounded-full backdrop-blur-sm">
                CAM+ · Pathology Networks &amp; Blood Sciences
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Every Sample Protected.{' '}
              <span className="text-cyan-400">Every Site Accounted For.</span>
            </h1>

            <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              Blood, tissue, and pathology samples are the lifeblood of modern
              healthcare — and the margin for error is razor-thin. CAM+ gives
              consolidated pathology networks continuous, audit-ready monitoring
              across every fridge, freezer, and transfer, so a hidden excursion
              never becomes a patient incident.
            </p>

            <DemoRequestButton
              industry="Pathology Networks"
              label="Book a Demo"
            />
          </div>
        </div>
      </section>

      {/* The moment: the excursion nobody sees */}
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
            The risk that unfolds quietly
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
            The Most Serious Risks Never Happen Under Bright Lights
          </h2>
          <div className="space-y-5 text-lg text-slate-300 leading-relaxed">
            <p>
              When people think about hospital safety, they picture the
              operating theatre, the emergency department, the bedside. But some
              of the most serious risks to patient outcomes unfold quietly,
              behind the scenes — in the storage and transport of blood,
              tissue, and pathology samples.
            </p>
            <p>
              A fridge drifts overnight. A freezer door doesn&apos;t quite
              seal. A courier run takes longer than planned. Nothing looks
              different. Nothing sounds an alarm.
            </p>
            <p className="text-white font-medium">
              The consequences stay hidden until it is too late: a transfusion
              fails, a test delivers a false result, a procedure is postponed.
              That is why temperature control is not a technical requirement —
              it is a core element of patient safety.
            </p>
          </div>
        </div>
      </section>

      {/* The ripples: one excursion, four costs */}
      <section className="relative py-20 lg:py-28 bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop")`,
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
              Each excursion costs far more than the product itself. It
              consumes time, erodes trust, and diminishes capacity in an
              already stretched system.
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

      {/* Hub-and-spoke: consolidation multiplies the risk */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[130px]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/20 rounded-full mb-5">
              The hub-and-spoke challenge
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Consolidation Magnifies Both Opportunity and Risk
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Regional pathology networks promise efficiency and consistency.
              But centralisation also means a single failure in a hub can
              disrupt services for several hospitals — and the exposure
              compounds at every step.
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
              The Bottom Line
            </p>
            <p className="text-xl lg:text-2xl font-bold text-white leading-snug max-w-3xl mx-auto">
              Without accurate, continuous monitoring at every point, a single
              lapse can expose weakness across the whole network. What seems
              like one incident is really a systemic question auditors will ask
              everywhere.
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
              From Hidden Vulnerability to Visible Strength
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Wireless sensors monitor every critical asset continuously, the
              platform escalates the moment anything drifts, and central teams
              see the whole network in one live view — with records that are
              audit-ready by default.
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

      {/* Why networks choose CAM+ */}
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
                The Four Non-Negotiables — Answered
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                Procurement leaders evaluating suppliers for a consolidated
                network should demand four things. CAM+ was built around all
                four.
              </p>
              <DemoRequestButton
                industry="Pathology Networks"
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
              Every Critical Asset, Watched Around the Clock
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Manual logs and occasional checks are no longer sufficient. CAM+
              sensors monitor continuously and alert immediately — whether the
              lab is staffed or empty.
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
                <FlaskConical className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                02 / Compliance, Handled
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Records That Withstand Scrutiny, Automatically
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Regulators expect continuous monitoring, validated systems, and
              secure audit trails — with evidence that alerts are acted upon.
              CAM+ produces all of it as a by-product of simply running.
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
                    Grounded in time saved, stock protected, and risk reduced —
                    concrete numbers, not general claims of efficiency.
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
            What Control Actually Looks Like
          </h2>
          <p className="text-teal-100 text-center mb-14 text-lg max-w-xl mx-auto">
            Integrity depends on control. Control depends on monitoring done
            right.
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
              A solution that takes months of complex roll-outs is worth less
              than one that delivers measurable improvement in weeks. CAM+ is
              built to get live fast — and stay live.
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
            Turn Risk Into Resilience
          </h2>
          <p className="text-slate-500 mb-10 text-lg max-w-xl mx-auto">
            Book a 15-minute walkthrough tailored to your network — hub,
            spokes, and everything in transit between them.
          </p>
          <DemoRequestButton
            industry="Pathology Networks"
            label="See It in Action"
          />
        </div>
      </section>
    </div>
  );
}
