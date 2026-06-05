import { Metadata } from 'next';
import Link from 'next/link';
import {
  Coffee,
  ArrowLeft,
  ArrowDown,
  Receipt,
  Frown,
  UserMinus,
  FileX,
  Repeat,
  Clock,
  Eye,
  TrendingDown,
  Shield,
  ShieldCheck,
  Users,
  ClipboardList,
  ClipboardCheck,
  Wifi,
  Smartphone,
  Monitor,
  Zap,
  Layers,
  TrendingUp,
  Thermometer,
  Snowflake,
  Flame,
  Milk,
  Droplets,
  DoorOpen,
  Wind,
  Radio,
  Activity,
  Truck,
  UtensilsCrossed,
  HardHat,
  Scale,
  AlertTriangle,
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';
import RevenueCalculator from './RevenueCalculator';

export const metadata: Metadata = {
  title: 'Checkit for Coffee Shops & Cafés | Stop the Silent Revenue Grind',
  description:
    'Every manual temperature check pulls a team member off the till. Across every shift and every site, that silent interruption compounds into lost sales, longer queues, and staff churn. See how Checkit gives the counter back to your customers.',
  keywords: [
    'coffee shop compliance software',
    'café temperature monitoring',
    'automated fridge monitoring',
    'food safety compliance coffee',
    'multi-site café operations',
    'digital checklists coffee shops',
  ],
  openGraph: {
    title: 'Checkit for Coffee Shops & Cafés | Stop the Silent Revenue Grind',
    description:
      'The manual temperature check that pulls staff off the counter is quietly draining revenue, customer satisfaction, and your best people. Here is how to stop it.',
  },
};

const ripples = [
  {
    label: 'Revenue',
    icon: Receipt,
    title: 'The Sale That Never Rang',
    description:
      'A team member steps away from the till to check a fridge, at the exact moment a queue is forming. The customer at the back does not wait. They walk. That sale never shows up on any report, because it was never made.',
  },
  {
    label: 'Customer Experience',
    icon: Frown,
    title: 'The Queue Gets Longer',
    description:
      'Service slows, the line backs up, and the experience frays. Regulars notice. Loyalty in this business is built on speed and consistency, and every interruption quietly chips away at both.',
  },
  {
    label: 'Your People',
    icon: UserMinus,
    title: 'Your Best People Burn Out',
    description:
      'Your team came to make great drinks and serve customers, not to abandon a rush to log a fridge temperature on a clipboard. Friction turns into frustration, frustration into turnover. Every leaver means hiring again, retraining again, and weeks before the replacement is fully up to speed.',
  },
  {
    label: 'Compliance & Risk',
    icon: FileX,
    title: 'The Record You Cannot Trust',
    description:
      'When the counter is slammed, the check gets skipped, or filled in later from memory. The log looks complete. It is not. The one time it matters, an audit or an incident, the gaps are exactly where the risk was hiding.',
  },
];

const compoundingSteps = [
  {
    icon: Clock,
    headline: 'One manual check',
    detail:
      'Two to three minutes away from the counter to walk to a fridge, take a reading, and record it.',
  },
  {
    icon: Repeat,
    headline: 'Several times a day',
    detail:
      'Fridges, freezers, hot-holding, display chillers. Multiple checks, every single shift, at every site.',
  },
  {
    icon: TrendingDown,
    headline: 'During your busiest minutes',
    detail:
      'Checks fall due when footfall peaks, the exact moments when every minute on the till is a sale.',
  },
  {
    icon: Layers,
    headline: 'Multiplied across the estate',
    detail:
      'Dozens or hundreds of sites, doing the same thing, every trading day of the year.',
  },
];

const differentiators = [
  {
    icon: Zap,
    title: 'Staff Never Leave the Counter',
    description:
      'Wireless sensors take the manual temperature check off your team entirely. During the rush, they stay on service, where the revenue and the experience actually happen.',
  },
  {
    icon: ShieldCheck,
    title: 'Records You Can Actually Trust',
    description:
      'Readings are captured automatically, around the clock, not from memory at the end of a shift. Every log is timestamped, complete, and audit-ready by default.',
  },
  {
    icon: Eye,
    title: 'Estate-Wide Visibility in One View',
    description:
      'Head office sees compliance and equipment status across every location from one dashboard, not after a site visit, not after stock is lost. Live, always.',
  },
  {
    icon: Repeat,
    title: 'Built for High-Turnover Teams',
    description:
      'Simple enough to pick up in minutes. New starters are productive on day one, critical when café teams change as often as they do.',
  },
];

const sensorDataTypes = [
  {
    icon: Thermometer,
    title: 'Temperature',
    scenario:
      'Under-counter chillers, fridges, freezers, hot-holding, and display cabinets monitored 24/7, with automatic alerts before stock or safety is ever at risk.',
  },
  {
    icon: Milk,
    title: 'Milk & Dairy Chillers',
    scenario:
      'The chillers your entire menu depends on, watched continuously, so a failing unit is caught overnight, not discovered at the morning rush.',
  },
  {
    icon: Snowflake,
    title: 'Freezers',
    scenario:
      'Frozen stock and pastries protected around the clock, with alerts the moment temperatures start to drift.',
  },
  {
    icon: Flame,
    title: 'Hot Holding',
    scenario:
      'Hot food cabinets monitored against safe thresholds automatically, so no one steps away from service to check them.',
  },
  {
    icon: DoorOpen,
    title: 'Door & Seal',
    scenario:
      'Chiller and freezer doors left ajar, the silent cause of temperature drift and energy waste, flagged the moment it happens.',
  },
  {
    icon: Droplets,
    title: 'Humidity',
    scenario:
      'Storage and prep areas where moisture levels quietly affect shelf life and stock quality.',
  },
  {
    icon: Activity,
    title: 'Water & Leak',
    scenario:
      'Under-counter, plant rooms, and back-of-house, with instant alerts on leaks before they close a site for the day.',
  },
  {
    icon: Radio,
    title: 'Energy & Equipment',
    scenario:
      'Fridge compressors, HVAC, and equipment faults captured automatically, before they become a breakdown and a write-off.',
  },
];

const useCases = [
  {
    icon: ClipboardCheck,
    title: 'Opening & Closing Routines',
    description: 'Guided open and close so every site starts and ends the day to exactly the same standard.',
    tag: 'Shift-triggered',
  },
  {
    icon: Droplets,
    title: 'Cleaning & Hygiene',
    description: 'Surfaces, machines, and equipment cleaning logged with photo evidence and timestamps.',
    tag: 'Photo-evidenced',
  },
  {
    icon: ShieldCheck,
    title: 'Allergen & Date Labelling',
    description: 'Allergen controls and date labelling aligned with food-safety law. Captured, not remembered.',
    tag: "Natasha's Law",
  },
  {
    icon: Coffee,
    title: 'Machine & Equipment Care',
    description: 'Daily descaling, calibration, and maintenance routines that protect drink quality and uptime.',
    tag: 'Daily',
  },
  {
    icon: Truck,
    title: 'Delivery & Goods-In Checks',
    description: 'Temperature and condition checks on every delivery, signed off in seconds at the back door.',
    tag: 'Goods-in',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food Prep & Date Codes',
    description: 'HACCP-aligned prep workflows and date-code discipline, built into the daily routine.',
    tag: 'HACCP',
  },
  {
    icon: Scale,
    title: 'Waste & Stock Logging',
    description: 'Record waste and date-check failures at the moment they happen, with tagging and trend tracking.',
    tag: 'Loss prevention',
  },
  {
    icon: AlertTriangle,
    title: 'Incident & Near-Miss Reporting',
    description: 'Spills, accidents, and near-misses captured instantly with photo evidence and automatic escalation.',
    tag: 'Auto-escalation',
  },
  {
    icon: HardHat,
    title: 'Health & Safety Checks',
    description: 'Fire safety, first aid, and site inspections, all photo-evidenced and configurable per site.',
    tag: 'Configurable',
  },
  {
    icon: Shield,
    title: 'EHO & Audit Readiness',
    description: 'Log inspector visits, findings, and corrective actions in real time with deadlines and evidence.',
    tag: 'Audit-ready',
  },
];

const platformCapabilities = [
  {
    icon: TrendingUp,
    title: 'Compliance Dashboards',
    description: 'Live compliance scoring across every site. See which locations are on track and which need attention, at a glance.',
  },
  {
    icon: ClipboardList,
    title: 'Custom Workflow Builder',
    description: 'Create and update checklists centrally, then push them to any site or group of sites. No per-site setup.',
  },
  {
    icon: Zap,
    title: 'Automatic Escalations',
    description: 'Missed checks, breached thresholds, and overdue tasks automatically trigger alerts to the right person at the right level.',
  },
  {
    icon: Shield,
    title: 'Complete Audit Trail',
    description: 'Every check, every reading, every photo, timestamped and stored. Export-ready for EHO visits and audits.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Store managers see their store. Area managers see their region. Head office sees the whole estate.',
  },
  {
    icon: Layers,
    title: 'Trend Analysis & Reporting',
    description: 'Spot recurring issues, compare site performance, and make decisions on data instead of anecdotes.',
  },
];

const journeySteps = [
  {
    step: 1,
    title: 'Take the Manual Temperature Check Off Your Team First',
    description:
      'Place wireless sensors on the fridges, freezers, and hot-holding units. From day one, no one leaves the counter to log a temperature. It happens automatically, 24/7, with alerts the moment anything drifts.',
    duration: '~30 min install per unit',
  },
  {
    step: 2,
    title: 'Digitise the Checks That Remain',
    description:
      'Move opening, closing, cleaning, and allergen checks onto a tablet. Same routines, now with timestamps and photo evidence instead of a clipboard nobody can find.',
    duration: '1–2 weeks per site',
  },
  {
    step: 3,
    title: 'Give the Counter Back to Your Customers',
    description:
      'With monitoring automated and checks streamlined, staff stay on service through the rush. The queue moves, the experience holds, and the silent revenue drip stops.',
    duration: 'Immediate impact',
  },
  {
    step: 4,
    title: 'Roll Out Across the Estate',
    description:
      'Standardise so every site runs the same way. Deploy to 10 sites, then 50, then hundreds. The platform scales without proportional overhead, retraining, or per-site customisation.',
    duration: '5–10 sites per week',
  },
  {
    step: 5,
    title: 'See the Whole Estate at a Glance',
    description:
      'With data flowing from every location, head office gets live dashboards, automated escalations, and trend analysis, and acts before problems ever surface.',
    duration: 'Ongoing optimisation',
  },
];

const outcomes = [
  { stat: '0', label: 'Manual temperature checks during service', detail: 'sensors do it automatically' },
  { stat: '24/7', label: 'Automated asset monitoring', detail: 'nights, weekends, overnight' },
  { stat: '100%', label: 'Of temperature logs captured automatically', detail: 'no gaps, no memory, no clipboard' },
  { stat: '1', label: 'Platform for every check across the estate', detail: 'one source of truth' },
];

export default function CoffeeShopsMarketPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero: café counter background with overlay */}
      <section className="relative py-24 lg:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/markets/coffee-shops/hero.jpg")`,
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
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-white/10 text-white/90 border border-white/20 rounded-full backdrop-blur-sm">
                Coffee Shops &amp; Café Chains
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Automate Away the{' '}
              <span className="text-amber-400">Silent Grind</span> Draining Your
              Margins
            </h1>

            <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
              Every time a team member steps away from the till to check a
              fridge or freezer, a sale slips away, a queue grows, and your best
              people get a little more fed up. One small interruption,
              multiplied across every shift and every site, quietly compounds
              into real money. Here&apos;s how to stop it.
            </p>

            <DemoRequestButton
              industry="Coffee Shops & Café Chains"
              label="Book a Demo"
            />
          </div>
        </div>
      </section>

      {/* The moment: silent grind narrative */}
      <section className="relative py-20 lg:py-28 bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='1.5' fill='%23fff' fill-opacity='0.3'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20 rounded-full mb-6">
            The moment you never see on a report
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
            Millions in Lost Revenue Start With Small, Simple Choices
          </h2>
          <div className="space-y-5 text-lg text-slate-300 leading-relaxed">
            <p>
              The line is out the door. Every barista is on the bar, every till
              is moving. Then a manual temperature check falls due: a fridge, a
              freezer, a hot-hold cabinet.
            </p>
            <p>
              Someone has to stop serving, walk over, take a reading, and write
              it down. For two or three minutes, that&apos;s one fewer person
              making drinks and taking orders during the busiest stretch of the
              day.
            </p>
            <p className="text-white font-medium">
              Stepping away from the counter to run one temperature check looks
              harmless. It is not. That single choice carries a real revenue
              impact nobody ever logs, and it repeats all day, at every site.
            </p>
          </div>
        </div>
      </section>

      {/* The ripples: one interruption, four costs */}
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
              One Interruption. Four Ways It Costs You.
            </h2>
            <p className="text-slate-400 text-lg">
              That single decision ripples across four areas that rarely make it
              onto a P&amp;L, but all of them land on your bottom line.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {ripples.map((ripple) => {
              const Icon = ripple.icon;
              return (
                <div
                  key={ripple.title}
                  className="group/card bg-amber-950/30 border border-amber-500/20 rounded-2xl p-7 backdrop-blur-sm hover:scale-[1.02] hover:border-amber-500/40 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                      {ripple.label}
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 group-hover/card:bg-white/20 flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-amber-300 group-hover/card:scale-110 transition-transform duration-300" />
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

      {/* The compounding math: your margins are going cold */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[130px]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20 rounded-full mb-5">
              Now multiply it. Your margins are going cold.
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              The Arithmetic of the Silent Grind
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              A single interruption looks trivial. But it never happens once. It
              happens all day, every day, at every site, and it compounds.
            </p>
          </div>

          <div className="space-y-4">
            {compoundingSteps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.headline}>
                  <div className="group flex items-center gap-5 p-5 lg:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/25 transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-amber-500 flex items-center justify-center shrink-0 transition-colors duration-200">
                      <Icon className="w-6 h-6 text-amber-300 group-hover:text-white transition-colors duration-200" />
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
                      <ArrowDown className="w-5 h-5 text-amber-500/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Worked example with interactive estate-size slider */}
          <RevenueCalculator />

          <div className="mt-8 rounded-2xl bg-linear-to-r from-amber-600 to-amber-500 p-8 lg:p-10 text-center shadow-xl shadow-amber-500/20">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-100 mb-3">
              The Silent Grind
            </p>
            <p className="text-xl lg:text-2xl font-bold text-white leading-snug max-w-3xl mx-auto">
              That is revenue that never gets booked, customers who quietly stop
              coming back, and people who quietly leave. None of it shows up as a
              line item, which is exactly why it goes unaddressed.
            </p>
          </div>
          <p className="text-center text-xs text-slate-500 mt-5 max-w-xl mx-auto">
            Illustrative figures. Swap in your own check frequency, transaction
            value, and estate size. The direction never changes.
          </p>
        </div>
      </section>

      {/* The fix: Checkit platform overview */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-teal-100 text-teal-700 rounded-full mb-5">
              The Checkit Platform
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Checkit Keeps Your People at the Counter
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Sensors automate the readings, the app streamlines the checks that
              remain, and the platform gives head office estate-wide visibility,
              so your team stays on service and the drip stops.
            </p>
          </div>

          <div>
            <img
              src="/markets/coffee-shops/platform.webp"
              alt="Checkit platform: sensors, dashboards, and mobile app working together"
              className="w-full max-w-4xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Why operators choose Checkit */}
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
                Why Café Operators Choose Checkit
              </h2>
              <p className="text-slate-500 text-lg mb-8">
                Built for how high-volume, multi-site hospitality actually
                operates: fast counters, busy peaks, and teams that change
                often.
              </p>
              <DemoRequestButton
                industry="Coffee Shops & Café Chains"
                variant="secondary"
                label="Learn More"
                className="bg-blue-50! text-blue-700! hover:bg-blue-100!"
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
                01 / Sensors
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Automate Your Checks and So Much More
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Wireless sensors monitor your critical assets around the clock, so
              the manual temperature check disappears, and the readings keep
              coming whether the site is open, closed, or slammed.
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

      {/* 2. DIGITAL APP */}
      <section className="relative py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">
                02 / Digital App
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Digitise Everything, Making It Fast and Foolproof
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Frontline staff complete guided checklists on a tablet or phone,
              with photo evidence, timestamps, and offline capability built in.
              Quick enough to fit around a busy counter.
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

      {/* 3. PLATFORM */}
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
                03 / Platform
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Unlock Estate-Wide Visibility and Control
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Dashboards, reporting, and configuration tools that give head
              office a single view of compliance and equipment health across
              every site.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {platformCapabilities.map((item, i) => {
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
            What Stopping the Grind Looks Like
          </h2>
          <p className="text-teal-100 text-center mb-14 text-lg max-w-xl mx-auto">
            Automate the manual check, and the compounding cost stops at the
            source.
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

      {/* Implementation Journey, café background */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/markets/coffee-shops/journey.jpg")`,
          }}
        />
        <div className="absolute inset-0 bg-slate-950/88" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/40 via-transparent to-slate-950/60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Kickstart Your Implementation Journey
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg">
              Start where the pain is, the manual temperature check, then
              expand as you see value. No big-bang rollout, no disruption to
              service.
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
            Stop the Drip. Brew Up the Margin.
          </h2>
          <p className="text-slate-500 mb-10 text-lg max-w-xl mx-auto">
            Book a 15-minute walkthrough tailored to your estate. No slides,
            just a live look at how the silent grind disappears.
          </p>
          <DemoRequestButton
            industry="Coffee Shops & Café Chains"
            label="See It in Action"
          />
        </div>
      </section>
    </div>
  );
}
