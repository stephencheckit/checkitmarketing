import { Metadata } from 'next';
import Link from 'next/link';
import {
  Fuel,
  ArrowLeft,
  Shield,
  PoundSterling,
  Eye,
  FileX,
  TrendingUp,
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
  CarFront,
  Droplets,
  HardHat,
  UtensilsCrossed,
  ClipboardCheck,
  DoorOpen,
  Wind,
  Radio,
  Hand,
  Activity,
  ScanSearch,
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

export const metadata: Metadata = {
  title: 'Checkit for Forecourts | Whole-Site Compliance for Fuel Retail',
  description:
    'One platform for every compliance need across your forecourt. Digital checklists, automated monitoring, and estate-wide visibility for fuel retail operators.',
  keywords: [
    'forecourt compliance',
    'fuel retail compliance software',
    'forecourt operations',
    'petrol station compliance',
    'forecourt digital checklists',
    'fuel retail temperature monitoring',
  ],
  openGraph: {
    title: 'Checkit for Forecourts | Whole-Site Compliance for Fuel Retail',
    description:
      'One platform for every compliance need across your forecourt — from pump safety and fuel compliance to food-to-go and contractor management.',
  },
};

const problemCategories = [
  {
    label: 'Strategic',
    color: 'text-red-400',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-500/20',
    dotColor: 'bg-red-500',
    problems: [
      {
        icon: TrendingUp,
        title: 'No Standardised Operating Model Across a Growing Estate',
        description:
          "You've grown from 50 sites to 500+ through franchise and acquisition, but the way each site operates is still dictated locally. There's no blueprint, no guardrails, no consistency.",
      },
      {
        icon: Scale,
        title: 'Brand and Regulatory Risk Sits With You',
        description:
          "Franchise partners and site managers execute the day-to-day. But when something goes wrong — a failed inspection, a compliance breach — the fines and reputational damage land on the operator, not the individual site.",
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
        icon: PoundSterling,
        title: 'Regulatory Fines Are Significant and Increasing',
        description:
          "Forecourts operate under heavy scrutiny. Paper-based evidence doesn't hold up, and gaps in records turn routine inspections into costly penalties.",
      },
      {
        icon: Layers,
        title: 'Multiple Vendor Contracts for Fragmented Needs',
        description:
          'Separate systems for food safety, fuel checks, incident logging, and maintenance means redundant cost and no unified return on investment.',
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
        icon: Eye,
        title: 'Visibility Is Retrospective, Not Real-Time',
        description:
          "Area managers rely on periodic site visits to understand what's happening. Problems are discovered after the incident, the spoiled stock, or the failed audit — not before.",
      },
      {
        icon: Users,
        title: 'High Staff Turnover Undermines Consistency',
        description:
          "New starters need to be productive immediately. Paper-based training and complex systems don't survive the reality of a forecourt workforce.",
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
        title: "Paper Records Aren't Audit-Ready",
        description:
          "Logs get lost, damaged, or filled in retrospectively. None of it stands up when an EHO officer or auditor asks questions.",
      },
      {
        icon: ClipboardList,
        title: 'No Single Source of Truth',
        description:
          "Fuel checks in one system, food safety in another, incident reports on paper. Nobody has the full picture of a site's compliance posture.",
      },
    ],
  },
];

const differentiators = [
  {
    icon: Zap,
    title: 'Intuitive Enough for Any Operator',
    description:
      'Designed to be picked up by anyone with minimal training. No lengthy onboarding, no technical background required. Critical for franchise operations where staff turnover is high.',
  },
  {
    icon: Layers,
    title: 'One Vendor, Not Five',
    description:
      'Replace disconnected tools for food safety, fuel checks, incident logging, and maintenance with a single platform. Less admin, less cost, consistent standards across every activity on site.',
  },
  {
    icon: Eye,
    title: 'Real-Time Visibility at Scale',
    description:
      'Ops directors and area managers see compliance status across the entire estate from one dashboard — not after a site visit, not after an incident. Live, always.',
  },
  {
    icon: Shield,
    title: 'Automated Monitoring + Digital Workflows',
    description:
      'The only platform that combines wireless sensor monitoring of assets with digital workflow management for every other check on site. No gaps.',
  },
];

const useCases = [
  {
    icon: Fuel,
    title: 'Pump Safety Checks',
    description: 'Daily and shift-based pump inspection workflows covering nozzles, hoses, emergency cut-offs, and signage compliance.',
    tag: 'APEA / HSE',
  },
  {
    icon: Truck,
    title: 'Fuel Delivery Procedures',
    description: 'Step-by-step digital workflows for tanker deliveries — dip readings, seal checks, spill kit inspections, and sign-off.',
    tag: 'Photo-evidenced',
  },
  {
    icon: ClipboardCheck,
    title: 'Shift Handover Logs',
    description: 'Structured handover checklists so nothing falls through the cracks between shifts — incidents, stock issues, maintenance flags.',
    tag: '3 min avg.',
  },
  {
    icon: ShieldCheck,
    title: 'Health & Safety Audits',
    description: 'Site-level H&S inspections covering fire safety, first aid, PPE, signage, and hazard reporting — all photo-evidenced.',
    tag: 'Configurable',
  },
  {
    icon: CarFront,
    title: 'Car Wash & Jet Wash Checks',
    description: 'Pre-opening and periodic inspections for car wash bays — drainage, chemical levels, equipment condition, and safety barriers.',
    tag: '3× daily cycles',
  },
  {
    icon: HardHat,
    title: 'Contractor Sign-In',
    description: 'Digital contractor management with permit-to-work workflows, induction acknowledgement, and time-stamped site access logs.',
    tag: 'Permit-to-work',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food Prep & Hygiene',
    description: 'HACCP-aligned food preparation workflows — cleaning schedules, allergen controls, date labelling, and waste logging.',
    tag: "Natasha's Law",
  },
  {
    icon: Droplets,
    title: 'Spill & Incident Reporting',
    description: 'Instant digital capture of fuel spills, customer incidents, and near-misses with photo evidence and automatic escalation.',
    tag: 'Auto-escalation',
  },
  {
    icon: Eye,
    title: 'Mystery Shopper Readiness',
    description: 'Daily site presentation checklists covering forecourt cleanliness, branding standards, toilet checks, and customer-facing areas.',
    tag: '20%+ improvement',
  },
  {
    icon: Flame,
    title: 'Opening & Closing Procedures',
    description: 'Guided step-by-step workflows for site open and close — till reconciliation, lighting checks, security protocols, and signage.',
    tag: 'Shift-triggered',
  },
  {
    icon: Shield,
    title: 'EHO & Regulatory Visits',
    description: 'Log inspector visits in real time — capture findings, corrective actions, and follow-ups with photo evidence and deadlines.',
    tag: 'Audit-ready',
  },
  {
    icon: Scale,
    title: 'Waste & Stock Management',
    description: 'Record food waste, date-check failures, and stock discrepancies at the point they happen — with category tagging and trend tracking.',
    tag: 'Loss prevention',
  },
];

const sensorDataTypes = [
  {
    icon: Thermometer,
    title: 'Temperature',
    scenario: 'Fridges, freezers, hot holding cabinets, and food-to-go display cases — monitored 24/7 with automatic alerts when thresholds breach.',
  },
  {
    icon: Droplets,
    title: 'Humidity',
    scenario: 'Back-of-house storage areas and walk-in cold rooms where moisture levels affect stock quality and shelf life.',
  },
  {
    icon: DoorOpen,
    title: 'Door & Window',
    scenario: 'Cold room doors and freezer access points — detect when doors are left open, driving temperature excursions and energy waste.',
  },
  {
    icon: Activity,
    title: 'Water & Leak Detection',
    scenario: 'Plant rooms, under-sink areas, and fuel pump bases — instant alerts on water ingress before it becomes a costly incident.',
  },
  {
    icon: ScanSearch,
    title: 'Motion & Occupancy',
    scenario: 'Customer toilets, back offices, and storage areas — trigger cleaning schedules or security alerts based on actual usage.',
  },
  {
    icon: Hand,
    title: 'Touch',
    scenario: 'Manual check-in points and panic buttons — staff tap to confirm task completion or trigger an immediate escalation.',
  },
  {
    icon: Wind,
    title: 'CO2 & Air Quality',
    scenario: 'Enclosed kitchen areas and back-of-house prep spaces — monitor air quality for staff safety and ventilation compliance.',
  },
  {
    icon: Radio,
    title: 'Equipment Alarms',
    scenario: 'Generator alerts, HVAC faults, and compressor failures — relay monitoring that captures equipment status changes automatically.',
  },
  {
    icon: Eye,
    title: 'Proximity',
    scenario: 'Asset presence detection for high-value displays, safety equipment, and compliance signage — know immediately when something is removed.',
  },
];

const journeySteps = [
  {
    step: 1,
    title: 'Digitise Your Existing Checks',
    description:
      'Take the paper checklists your sites already use — shift handovers, daily opening checks, food prep logs — and put them on a tablet. Same process, digital format. Staff pick it up in minutes. You get timestamped, photo-evidenced records from day one.',
    duration: '1–2 weeks per site',
  },
  {
    step: 2,
    title: 'Add Automated Monitoring to Critical Assets',
    description:
      'Place wireless sensors on fridges, freezers, and hot holding units. Temperature logging becomes continuous and automatic — no more manual checks during busy periods, no more gaps in records.',
    duration: '~30 min install per asset',
  },
  {
    step: 3,
    title: 'Extend Across the Whole Forecourt',
    description:
      'Once the team is comfortable with the app, expand workflows beyond food. Pump safety checks, contractor sign-in, incident reporting, car wash inspections, fuel delivery procedures. Same interface, same simplicity — broader coverage.',
    duration: '4–6 weeks typical',
  },
  {
    step: 4,
    title: 'Roll Out Across the Estate',
    description:
      'Standardise workflows so every site operates the same way. Deploy to 10 sites, then 50, then 200+. The platform scales without proportional overhead — no retraining, no customisation per site.',
    duration: '5–10 sites per week',
  },
  {
    step: 5,
    title: 'Estate-Wide Visibility and Optimisation',
    description:
      'With data flowing from every site, ops directors and area managers get live compliance dashboards, automated escalations, trend analysis, and compliance scoring across the portfolio.',
    duration: 'Ongoing optimisation',
  },
];

const outcomes = [
  { stat: '60%', label: 'Reduction in compliance admin', detail: 'vs. paper-based processes' },
  { stat: '90%+', label: 'Audit-ready scores across the estate', detail: 'up from 50–70% on paper' },
  { stat: '24/7', label: 'Automated asset monitoring', detail: 'no gaps, nights or weekends' },
  { stat: '1', label: 'Platform for every check on site', detail: 'replaces 4–6 separate tools' },
];

export default function ForecourtsMarketPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — forecourt background image with overlay */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.cdn.autocar.co.uk/sites/autocar.co.uk/files/images/car-reviews/first-drives/legacy/10_bp_forecourt_high_resolution.jpg")`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/80 to-slate-900/50" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-slate-950/30" />

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
                <Fuel className="w-5 h-5 text-white" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-white/10 text-white/90 border border-white/20 rounded-full backdrop-blur-sm">
                Forecourts &amp; Fuel Retail
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Drive Compliance Across Your Entire Forecourt Operation
            </h1>

            <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              From pump safety and fuel compliance to food-to-go and contractor
              management — Checkit replaces paper processes and disconnected
              systems with a single digital platform your entire estate can rely
              on.
            </p>

            <DemoRequestButton
              industry="Forecourts & Fuel Retail"
              label="Book a Demo"
            />
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
              What&apos;s Costing You Sites, Fines, and Sleep
            </h2>
            <p className="text-slate-400 text-lg">
              Forecourt operators face compounding challenges as they scale —
              from board-level risk to frontline execution.
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
              One connected system that automates data collection, digitises
              every workflow, and gives you estate-wide visibility and control.
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

      {/* Why Forecourt Operators Choose Checkit */}
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
                Why Forecourt Operators Choose Checkit
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                Built for how forecourts actually operate — not adapted from
                another industry.
              </p>
              <DemoRequestButton
                industry="Forecourts & Fuel Retail"
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
              Automate the Collection of Multiple Data Sources
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Wireless sensors collect operational data around the clock —
              replacing clipboards, spreadsheets, and guesswork across your
              forecourt.
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

      {/* 2. DIGITAL APP — forecourt workflows */}
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
              Every Check on Your Forecourt, Digitised
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Frontline staff complete guided checklists on a tablet or phone —
              with photo evidence, timestamps, and offline capability built in.
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

      {/* 3. PLATFORM — reporting, configuration, customization */}
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
              Dashboards, reporting, and configuration tools that give ops
              directors and area managers a single view of compliance across
              every site.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {[
              {
                icon: TrendingUp,
                title: 'Compliance Dashboards',
                description: 'Live compliance scoring across your entire estate. See which sites are on track and which need attention — at a glance.',
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
                icon: Shield,
                title: 'Complete Audit Trail',
                description: 'Every check, every reading, every photo — timestamped and stored. Export-ready for EHO visits, audits, and inspections.',
              },
              {
                icon: Users,
                title: 'Role-Based Access',
                description: 'Site managers see their site. Area managers see their region. Ops directors see the whole estate. Everyone gets the view they need.',
              },
              {
                icon: Layers,
                title: 'Trend Analysis & Reporting',
                description: 'Spot patterns across sites and over time. Identify recurring issues, compare performance, and make data-driven decisions.',
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

      {/* Implementation Journey — highway background with dark overlay */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1516319915504-015b432d407c?q=80&w=1684&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
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
              Start simple, expand as you see value. No big-bang rollout — just a
              logical progression from paper to full digital compliance.
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
            Outcomes Operators See
          </h2>
          <p className="text-teal-100 text-center mb-14 text-lg max-w-xl mx-auto">
            Measurable results from forecourt operators using Checkit across
            their estate.
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
            Turn Due Diligence into Operational Confidence
          </h2>
          <p className="text-slate-500 mb-10 text-lg max-w-xl mx-auto">
            Book a 15-minute walkthrough tailored to your forecourt estate. No
            slides — just a live look at the platform.
          </p>
          <DemoRequestButton
            industry="Forecourts & Fuel Retail"
            label="See It in Action"
          />
        </div>
      </section>
    </div>
  );
}
