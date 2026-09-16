import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  ArrowLeft,
  Shield,
  DollarSign,
  Eye,
  FileX,
  Scale,
  Users,
  ClipboardList,
  Wifi,
  Smartphone,
  Monitor,
  Zap,
  Layers,
  Thermometer,
  Flame,
  Truck,
  ShieldCheck,
  UtensilsCrossed,
  ClipboardCheck,
  DoorOpen,
  Wind,
  Radio,
  Activity,
  Droplets,
  Snowflake,
  Trophy,
  CalendarClock,
  AlertTriangle,
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

export const metadata: Metadata = {
  title: 'Checkit for Facilities Management | Compliance Across Every Site',
  description:
    'Digital task management and automated monitoring in one platform for FM and contract catering providers. Central visibility of task completion, temperature compliance, and site performance across every contract in your estate.',
  keywords: [
    'facilities management compliance software',
    'contract catering compliance software',
    'multi-site food safety monitoring',
    'FM estate compliance visibility',
    'digital task management facilities',
    'multi-site temperature monitoring',
  ],
  openGraph: {
    title: 'Checkit for Facilities Management | Compliance Across Every Site',
    description:
      'One platform for task completion, temperature compliance, and site performance across every contract you run — automated monitoring, digital workflows, and estate-wide visibility for FM and contract catering providers.',
  },
};

// Referenceable customers (names only for now — logos/quotes to follow)
const referenceCustomers = ['OVG', 'Compass', 'Guggenheim'];

const problemCategories = [
  {
    label: 'Reputational',
    color: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/20',
    dotColor: 'bg-red-500',
    problems: [
      {
        icon: Trophy,
        title: "Your Client's Brand Is on the Line",
        description:
          "Across every contract you hold, a food-safety or compliance failure isn't just your problem — it damages your client's reputation and puts the contract you fought to win at risk of renewal.",
      },
      {
        icon: Scale,
        title: 'Compliance Risk Rolls Up to the Provider',
        description:
          'Site teams run the day-to-day, but a failed inspection, a recall, or an incident lands on the provider holding the contract — not the individual site.',
      },
    ],
  },
  {
    label: 'Financial',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/20',
    dotColor: 'bg-amber-500',
    problems: [
      {
        icon: DollarSign,
        title: 'Fines, Closures, and Lost Contracts',
        description:
          'A single failed inspection can shut a site down and put a multi-year contract renewal at risk. The cost of a compliance gap is rarely just the fine.',
      },
      {
        icon: Layers,
        title: 'Fragmented Tools, Duplicated Cost',
        description:
          'Separate systems for temperature logs, cleaning, allergens, and incident reporting mean redundant spend across sites — and no unified view of where risk actually sits.',
      },
    ],
  },
  {
    label: 'Operational',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/40',
    borderColor: 'border-blue-500/20',
    dotColor: 'bg-blue-500',
    problems: [
      {
        icon: CalendarClock,
        title: 'Every Site Ends Up Working Differently',
        description:
          "As portfolios grow, sites drift into their own ways of working. Keeping processes consistent across every contract gets harder, and central teams rely on reports to know what's really happening.",
      },
      {
        icon: Eye,
        title: 'Visibility Is Retrospective, Not Real-Time',
        description:
          'Head office learns about a warm fridge or a missed check after the fact — after the spoiled stock, after the complaint, after the client has already noticed.',
      },
    ],
  },
  {
    label: 'Process',
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/40',
    borderColor: 'border-purple-500/20',
    dotColor: 'bg-purple-500',
    problems: [
      {
        icon: FileX,
        title: "Paper Records Don't Survive an Audit",
        description:
          'Clipboards get lost, filled in from memory, or never make it back from a remote stand. When an inspector asks for proof, the gaps are exactly where the risk was hiding.',
      },
      {
        icon: ClipboardList,
        title: 'No Single Source of Truth Across Sites',
        description:
          'Every site logs things its own way. Nobody can prove estate-wide compliance on demand — or spot the same failure repeating across the portfolio.',
      },
    ],
  },
];

const differentiators = [
  {
    icon: Zap,
    title: 'Simple Enough for Frontline Site Teams',
    description:
      'Built to be picked up in minutes by frontline staff who change constantly across sites. No lengthy onboarding, no technical background — productive on day one.',
  },
  {
    icon: Layers,
    title: 'One Platform, Every Site',
    description:
      'Replace disconnected tools for temperature, cleaning, allergens, and incidents with a single system — consistent standards and one view of risk across every contract you run.',
  },
  {
    icon: Eye,
    title: 'Real-Time Visibility Across the Estate',
    description:
      'Regional and head-office teams see live task completion and compliance status across every site — not after a site visit, not after an incident. Always current, always provable.',
  },
  {
    icon: Shield,
    title: 'Automated Monitoring + Digital Workflows',
    description:
      'Wireless sensors watch every fridge, freezer, and hot-hold around the clock, while digital checklists cover every manual task that remains. No gaps between the two.',
  },
];

const useCases = [
  {
    icon: Thermometer,
    title: 'Temperature & Probe Checks',
    description: 'Guided cook, cool, and hold temperature checks with Bluetooth probe capture — no transcription, no guessing, no memory logs.',
    tag: 'HACCP',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food Prep & Cook Workflows',
    description: 'HACCP-aligned prep, cook, and cooling workflows built into the daily routine, with time and temperature captured at each critical control point.',
    tag: 'CCP',
  },
  {
    icon: ShieldCheck,
    title: 'Allergen & Labeling',
    description: 'Allergen controls and date/day-dot labeling captured, not remembered — protecting guests and evidencing every step.',
    tag: 'Allergen control',
  },
  {
    icon: Truck,
    title: 'Delivery & Goods-In Checks',
    description: 'Temperature and condition checks on every delivery, signed off in seconds at the dock before stock ever reaches a site.',
    tag: 'Goods-in',
  },
  {
    icon: Flame,
    title: 'Opening & Closing Routines',
    description: 'Shift-triggered open and close checklists so every kitchen and site starts and ends the day to exactly the same standard.',
    tag: 'Shift-triggered',
  },
  {
    icon: ClipboardCheck,
    title: 'Cleaning & Hygiene',
    description: 'Surfaces, equipment, and back-of-house cleaning logged with photo evidence and timestamps across every outlet.',
    tag: 'Photo-evidenced',
  },
  {
    icon: CalendarClock,
    title: 'Site Readiness Checks',
    description: 'Pre-service readiness checks across kitchens, outlets, and back-of-house — confirm every site is safe to open before service begins.',
    tag: 'Readiness',
  },
  {
    icon: Scale,
    title: 'Waste & Stock Logging',
    description: 'Record waste, date-check failures, and stock discrepancies the moment they happen, with tagging and trend tracking for loss prevention.',
    tag: 'Loss prevention',
  },
  {
    icon: AlertTriangle,
    title: 'Incident & Near-Miss Reporting',
    description: 'Spills, injuries, and near-misses captured instantly with photo evidence and automatic escalation to the right person.',
    tag: 'Auto-escalation',
  },
  {
    icon: Shield,
    title: 'Health & Safety Checks',
    description: 'Fire safety, first aid, and site inspections across every site — all photo-evidenced and configurable per contract.',
    tag: 'Configurable',
  },
  {
    icon: ClipboardList,
    title: 'Inspection & Audit Readiness',
    description: 'Log health-inspector visits, findings, and corrective actions in real time — with deadlines, owners, and evidence attached.',
    tag: 'Audit-ready',
  },
  {
    icon: Building2,
    title: 'Equipment & Facility Care',
    description: 'Daily and periodic equipment care routines that protect food quality, uptime, and the guest experience across the estate.',
    tag: 'Daily',
  },
];

const sensorDataTypes = [
  {
    icon: Thermometer,
    title: 'Temperature',
    scenario: 'Under-counter chillers, walk-ins, freezers, and hot-holding across every kitchen and site — monitored 24/7 with automatic alerts before stock or safety is at risk.',
  },
  {
    icon: Snowflake,
    title: 'Freezers & Cold Storage',
    scenario: 'Frozen and refrigerated stock protected around the clock, with alerts the moment temperatures start to drift — catch a failing unit overnight, not the next morning.',
  },
  {
    icon: Flame,
    title: 'Hot Holding',
    scenario: 'Hot food cabinets and bain-maries monitored against safe thresholds automatically, so no one leaves service to take a manual reading during peak.',
  },
  {
    icon: DoorOpen,
    title: 'Door & Seal',
    scenario: 'Chiller and freezer doors left ajar — the silent cause of temperature drift and energy waste — flagged the moment it happens.',
  },
  {
    icon: Droplets,
    title: 'Humidity',
    scenario: 'Dry stores, cold rooms, and prep areas where moisture levels quietly affect shelf life, stock quality, and food safety.',
  },
  {
    icon: Activity,
    title: 'Water & Leak Detection',
    scenario: 'Plant rooms, under-counter, and back-of-house — instant alerts on leaks before they close a site in the middle of service.',
  },
  {
    icon: Wind,
    title: 'Air Quality & CO2',
    scenario: 'Enclosed kitchens and back-of-house prep spaces — monitor air quality for staff safety and ventilation compliance.',
  },
  {
    icon: Radio,
    title: 'Equipment Alarms',
    scenario: 'Compressor faults, HVAC issues, and equipment failures captured automatically — before they become a breakdown and a write-off.',
  },
];

const journeySteps = [
  {
    step: 1,
    title: 'Automate Temperature Monitoring First',
    description:
      'Place wireless sensors on the fridges, freezers, and hot-holding units across your outlets. From day one, temperature logging is continuous and automatic — no manual checks during peak, no gaps in records.',
    duration: '~30 min install per asset',
  },
  {
    step: 2,
    title: 'Digitize the Checks That Remain',
    description:
      'Move opening, closing, cleaning, allergen, and prep checks onto a tablet or phone. Same routines your teams already run — now with timestamps and photo evidence instead of a clipboard nobody can find.',
    duration: '1–2 weeks per site',
  },
  {
    step: 3,
    title: 'Cover the Whole Site',
    description:
      'Extend workflows beyond food safety — goods-in, incident reporting, health & safety, and site readiness across kitchens, outlets, and back-of-house. Same interface, broader coverage.',
    duration: '4–6 weeks typical',
  },
  {
    step: 4,
    title: 'Roll Out Across Every Contract',
    description:
      'Standardize so every site runs the same way. Deploy to a handful of sites, then the whole estate. The platform scales without proportional overhead, retraining, or per-site customization.',
    duration: 'Multiple sites per week',
  },
  {
    step: 5,
    title: 'Estate-Wide Visibility and Control',
    description:
      'With data flowing from every outlet, head office gets live compliance dashboards, automated escalations, and trend analysis — and acts on problems before they ever surface.',
    duration: 'Ongoing optimization',
  },
];

// Structural facts, not ROI claims — mirrors the coffee-shops "what good looks like" band.
const outcomes = [
  { stat: '0', label: 'Manual temperature checks during service', detail: 'sensors do it automatically' },
  { stat: '24/7', label: 'Automated monitoring across every site', detail: 'busy days, quiet days, overnight' },
  { stat: '100%', label: 'Of temperature logs captured automatically', detail: 'no gaps, no clipboards, no memory' },
  { stat: '1', label: 'Platform for every check across every site', detail: 'one source of truth' },
];

export default function FacilitiesManagementMarketPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — facility kitchen background image with overlay */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1740&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/92 via-slate-900/82 to-slate-900/50" />
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
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-white/10 text-white/90 border border-white/20 rounded-full backdrop-blur-sm">
                Facilities Management &amp; Contract Catering
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Clear Visibility of Compliance Across{' '}
              <span className="text-teal-400">Every Site</span> You Run
            </h1>

            <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              Multiple contracts, dozens of sites, checks still recorded on paper
              or across disconnected systems — and no clear view of what&apos;s
              actually happening across the estate. Checkit brings digital task
              management and automated monitoring into one platform, giving your
              teams a central view of task completion, temperature compliance,
              and site performance.
            </p>

            <DemoRequestButton
              industry="Facilities Management & Contract Catering"
              label="Book a Demo"
            />
          </div>
        </div>
      </section>

      {/* Trust bar — referenceable customers (names only) */}
      <section className="bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-5">
            Trusted by teams managing food service across complex estates
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {referenceCustomers.map((name) => (
              <span
                key={name}
                className="text-xl lg:text-2xl font-bold tracking-tight text-white/60"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Problems — dark, moody */}
      <section className="relative py-20 lg:py-28 bg-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-gray-600/50 via-transparent to-gray-800/60" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23fff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              What&apos;s Putting Your Contracts and Reputation at Risk
            </h2>
            <p className="text-slate-400 text-lg">
              Food service across a multi-site estate faces compounding pressure
              — from client-brand risk at the top to consistent execution on the
              frontline.
            </p>
          </div>

          <div className="space-y-6">
            {problemCategories.map((category) => (
              <div key={category.label}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${category.dotColor}`} />
                  <span className={`text-xs font-semibold uppercase tracking-widest ${category.color}`}>
                    {category.label}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.problems.map((problem) => {
                    const Icon = problem.icon;
                    return (
                      <div
                        key={problem.title}
                        className={`group/card ${category.bgColor} border ${category.borderColor} rounded-2xl p-6 backdrop-blur-sm hover:scale-[1.02] hover:border-opacity-60 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 cursor-default`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/10 group-hover/card:bg-white/20 flex items-center justify-center shrink-0 transition-colors duration-300">
                            <Icon className={`w-5 h-5 ${category.color} group-hover/card:scale-110 transition-transform duration-300`} />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-white mb-1.5 group-hover/card:text-white/95">
                              {problem.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed group-hover/card:text-slate-300 transition-colors duration-300">
                              {problem.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution — overview with product image */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-teal-100 text-teal-700 rounded-full mb-5">
              The Checkit Platform
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Sensors, App, and Platform — Working Together
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              One connected system that automates data collection, digitizes
              every workflow, and gives you compliance visibility across every
              site.
            </p>
          </div>

          <div>
            <img
              src="https://checkitv6.com/checkit%20v6-1.webp"
              alt="Checkit platform — sensors, dashboards, and mobile app working together"
              className="w-full max-w-4xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Why FM Operators Choose Checkit */}
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
                Why Facilities &amp; Catering Operators Choose Checkit
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                Built for how food service across a multi-site estate actually
                operates — not adapted from another industry.
              </p>
              <DemoRequestButton
                industry="Facilities Management & Contract Catering"
                variant="secondary"
                label="Learn More"
                className="bg-slate-100! text-slate-700! hover:bg-slate-200!"
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

      {/* 1. SENSORS — automated data collection */}
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
                01 — Sensors
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Automate the Readings, Around the Clock
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Wireless sensors monitor your critical assets 24/7 — so the manual
              temperature check disappears and the readings keep coming whether a
              site is busy, quiet, or closed for the night.
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

      {/* 2. DIGITAL APP — multi-site food-service workflows */}
      <section className="relative py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                02 — Digital App
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Every Check on Every Site, Digitized
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Frontline teams complete guided checklists on a tablet or phone —
              with photo evidence, timestamps, and offline capability built in.
              Fast enough for the busiest service.
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

      {/* 3. PLATFORM — reporting, configuration, control */}
      <section className="relative py-20 lg:py-28 bg-slate-50">
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 24L24 0' stroke='%2394a3b8' stroke-width='0.4' stroke-opacity='0.15' fill='none'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                03 — Platform
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Estate-Wide Visibility and Control
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Dashboards, reporting, and configuration tools that give head
              office a single view of compliance and equipment health across
              every site.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {[
              {
                icon: Shield,
                title: 'Compliance Dashboards',
                description: 'Live compliance and task-completion scoring across every site. See which contracts are on track and which need attention — at a glance, before the client asks.',
              },
              {
                icon: ClipboardList,
                title: 'Custom Workflow Builder',
                description: 'Create and update checklists centrally, then push them to any site or group of sites. No per-site configuration needed.',
              },
              {
                icon: Zap,
                title: 'Automatic Escalations',
                description: 'Missed checks, breached thresholds, and overdue tasks trigger automatic alerts to the right person at the right level.',
              },
              {
                icon: FileX,
                title: 'Complete Audit Trail',
                description: 'Every check, every reading, every photo — timestamped and stored. Export-ready evidence for health inspections and client audits.',
              },
              {
                icon: Users,
                title: 'Role-Based Access',
                description: 'Site teams see their site. Contract managers see their contract. Head office sees the whole estate. Everyone gets the view they need.',
              },
              {
                icon: Layers,
                title: 'Trend Analysis & Reporting',
                description: 'Spot recurring issues, compare site and contract performance, and make decisions on data instead of anecdotes.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex gap-6 p-7 rounded-2xl bg-white border border-slate-200 hover:border-teal-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <span className="text-3xl font-bold text-slate-200 group-hover:text-teal-500 transition-colors duration-200">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center transition-colors duration-200">
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors duration-200" />
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Implementation Journey — facility background with dark overlay */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1740&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/40 via-transparent to-slate-950/60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Your Implementation Journey
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Start where the risk is highest, expand as you see value. No
              big-bang rollout — just a logical progression from paper to full
              digital compliance.
            </p>
          </div>

          {/* Desktop: alternating left/right timeline */}
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

      {/* Outcomes — bold teal band */}
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
            What Good Looks Like
          </h2>
          <p className="text-teal-100 text-center mb-14 text-lg max-w-xl mx-auto">
            Automate the manual check, and the compounding risk stops at the
            source — across every site you run.
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

      {/* CTA */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-slate-50/80 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Get Clear Visibility Across Every Site You Run
          </h2>
          <p className="text-slate-500 mb-10 text-lg max-w-xl mx-auto">
            Book a 15-minute walkthrough tailored to your estate. No slides —
            just a live look at how central visibility works across your
            contracts.
          </p>
          <DemoRequestButton
            industry="Facilities Management & Contract Catering"
            label="See It in Action"
          />
        </div>
      </section>
    </div>
  );
}
