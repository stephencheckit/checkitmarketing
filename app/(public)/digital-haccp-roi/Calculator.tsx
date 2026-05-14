'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Leaf,
  Bell,
  Calculator as CalculatorIcon,
  Download,
  ChevronDown,
  ArrowRight,
  ArrowUp,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  ShieldCheck,
  Eye,
} from 'lucide-react';
type Accent = 'cyan' | 'indigo' | 'emerald' | 'amber';

const accentMap: Record<
  Accent,
  {
    hex: string;
    iconBg: string;
    iconText: string;
    border: string;
    tileBg: string;
    dot: string;
  }
> = {
  cyan: {
    hex: '#22d3ee',
    iconBg: 'bg-cyan-500/10',
    iconText: 'text-cyan-300 print:text-cyan-700',
    border: 'border-cyan-500/40',
    tileBg: 'bg-cyan-500/10 print:bg-white',
    dot: 'bg-cyan-400',
  },
  indigo: {
    hex: '#818cf8',
    iconBg: 'bg-indigo-500/10',
    iconText: 'text-indigo-300 print:text-indigo-700',
    border: 'border-indigo-500/40',
    tileBg: 'bg-indigo-500/10 print:bg-white',
    dot: 'bg-indigo-400',
  },
  emerald: {
    hex: '#34d399',
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-300 print:text-emerald-700',
    border: 'border-emerald-500/40',
    tileBg: 'bg-emerald-500/10 print:bg-white',
    dot: 'bg-emerald-400',
  },
  amber: {
    hex: '#fbbf24',
    iconBg: 'bg-amber-500/10',
    iconText: 'text-amber-300 print:text-amber-700',
    border: 'border-amber-500/40',
    tileBg: 'bg-amber-500/10 print:bg-white',
    dot: 'bg-amber-400',
  },
};

function accentTone(a: Accent) {
  return accentMap[a];
}

const fmtGBP = (n: number) =>
  '£' + Math.round(n).toLocaleString('en-GB');

const fmtGBPCompact = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return '£' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (Math.abs(n) >= 1_000) return '£' + (n / 1_000).toFixed(0) + 'K';
  return '£' + Math.round(n).toLocaleString('en-GB');
};

type AssumptionsToggleProps = {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function AssumptionsBlock({ open, onToggle, children }: AssumptionsToggleProps) {
  return (
    <div className="mt-4 border-t border-slate-700/60 pt-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors print:hidden cursor-pointer"
      >
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
        {open ? 'Hide assumptions' : 'Edit assumptions'}
      </button>
      <div className={`${open ? 'block' : 'hidden'} print:block! mt-3`}>
        <div className="hidden print:block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wide">
          Assumptions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
      </div>
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
};

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  prefix,
  suffix,
  hint,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400 print:text-slate-700">{label}</span>
      <div className="mt-1 flex items-center bg-slate-800 print:bg-white border border-slate-700 print:border-slate-300 rounded-md focus-within:border-cyan-500/70 transition-colors">
        {prefix && (
          <span className="pl-3 text-sm text-slate-400 print:text-slate-600">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const next = parseFloat(e.target.value);
            onChange(Number.isFinite(next) ? next : 0);
          }}
          className="w-full bg-transparent px-3 py-2 text-sm text-white print:text-black focus:outline-none"
        />
        {suffix && (
          <span className="pr-3 text-sm text-slate-400 print:text-slate-600">{suffix}</span>
        )}
      </div>
      {hint && <span className="block text-[11px] text-slate-500 mt-1 print:text-slate-500">{hint}</span>}
    </label>
  );
}

export default function Calculator() {
  // Estate-wide
  const [sites, setSites] = useState(10);

  // 1) Paper & Printing
  const [paperBookletsPerSite, setPaperBookletsPerSite] = useState(1);
  const [paperCostPerBooklet, setPaperCostPerBooklet] = useState(7.25);
  const [paperShowAssumptions, setPaperShowAssumptions] = useState(false);
  const [paperReductionPct, setPaperReductionPct] = useState(100);

  // 2) Staff Time
  const [staffMinsPerDay, setStaffMinsPerDay] = useState(33);
  const [staffDaysPerYear, setStaffDaysPerYear] = useState(365);
  const [staffWage, setStaffWage] = useState(12);
  const [adminHrsPerMonth, setAdminHrsPerMonth] = useState(8);
  const [adminWage, setAdminWage] = useState(18);
  const [staffShowAssumptions, setStaffShowAssumptions] = useState(false);
  // Default 70% capture rate is honest: not every reclaimed minute converts to productive output.
  const [staffCapturePct, setStaffCapturePct] = useState(70);

  // 3) Energy Saving
  const [energyFreezersPerSite, setEnergyFreezersPerSite] = useState(9);
  const [energyKwhPerUnitPerYear, setEnergyKwhPerUnitPerYear] = useState(3500);
  const [energyCostPerKwh, setEnergyCostPerKwh] = useState(0.28);
  const [energyReductionPct, setEnergyReductionPct] = useState(12);
  // UK grid average ~0.207 kgCO2e/kWh (BEIS/DESNZ 2024 conversion factor).
  const [energyGridCarbonIntensity, setEnergyGridCarbonIntensity] = useState(0.207);
  const [energyShowAssumptions, setEnergyShowAssumptions] = useState(false);

  // 4) Stock Risk Coverage (annual exposure, not a guaranteed saving)
  const [stockValuePerSite, setStockValuePerSite] = useState(55000);
  // Default 5% annual risk is conservative for a mature operator; rep can dial up.
  const [stockAnnualRiskPct, setStockAnnualRiskPct] = useState(5);
  const [stockShowAssumptions, setStockShowAssumptions] = useState(false);

  const calc = useMemo(() => {
    const paper =
      sites * paperBookletsPerSite * paperCostPerBooklet * 12 * (paperReductionPct / 100);

    const staffFrontlineHours = sites * (staffMinsPerDay / 60) * staffDaysPerYear;
    const staffAdminHours = sites * adminHrsPerMonth * 12;
    const staffTotalHours = staffFrontlineHours + staffAdminHours;
    // 1 FTE ~ 1,800 productive hours/year (37.5h/wk × 48 weeks).
    const staffFTE = staffTotalHours / 1800;

    const staffFrontline =
      staffFrontlineHours * staffWage * (staffCapturePct / 100);
    const staffAdmin = staffAdminHours * adminWage * (staffCapturePct / 100);
    const staff = staffFrontline + staffAdmin;

    const energyKwhSaved =
      sites *
      energyFreezersPerSite *
      energyKwhPerUnitPerYear *
      (energyReductionPct / 100);
    const energy = energyKwhSaved * energyCostPerKwh;
    const energyTCO2eAvoided = (energyKwhSaved * energyGridCarbonIntensity) / 1000;
    // Tangibles: ~6,200 km/tCO2e for an average UK petrol car, ~30 trees/yr/tCO2e absorbed.
    const energyCarKmEquivalent = energyTCO2eAvoided * 6200;

    const stock = sites * stockValuePerSite * (stockAnnualRiskPct / 100);

    // Honest split: cash-out-the-door vs capacity / risk insurance.
    const hardSavings = paper + energy;
    const capacityAndRisk = staff + stock;

    const total = paper + staff + energy + stock;
    return {
      paper,
      staffFrontline,
      staffAdmin,
      staff,
      staffFrontlineHours,
      staffAdminHours,
      staffTotalHours,
      staffFTE,
      energy,
      energyKwhSaved,
      energyTCO2eAvoided,
      energyCarKmEquivalent,
      stock,
      hardSavings,
      capacityAndRisk,
      total,
    };
  }, [
    sites,
    paperBookletsPerSite,
    paperCostPerBooklet,
    paperReductionPct,
    staffMinsPerDay,
    staffDaysPerYear,
    staffWage,
    adminHrsPerMonth,
    adminWage,
    staffCapturePct,
    energyFreezersPerSite,
    energyKwhPerUnitPerYear,
    energyCostPerKwh,
    energyReductionPct,
    energyGridCarbonIntensity,
    stockValuePerSite,
    stockAnnualRiskPct,
  ]);

  const handlePrint = () => {
    // Brief delay lets any UI state settle before the browser print dialog opens.
    setTimeout(() => window.print(), 50);
  };

  return (
    <div className="bg-slate-950 print:bg-white text-slate-100 print:text-black">
      {/* Print-only styles: hide page chrome and background */}
      <style>{`
        @media print {
          header, footer, .demo-request-button-wrapper { display: none !important; }
          html, body { background: white !important; }
          body::before { display: none !important; }
          .print-card { break-inside: avoid; page-break-inside: avoid; }
          .print-page-break { page-break-before: always; }
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800/70 print:border-slate-300">
        <div className="absolute inset-0 pointer-events-none print:hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 print:text-cyan-700 font-semibold mb-4">
            ROI Calculators &amp; Business Case
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white print:text-black">
            Translating the Platform into
            <br />
            <span className="text-cyan-300 print:text-cyan-700">Pounds and Pence.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 print:text-slate-700 max-w-2xl">
            Digital HACCP turns the daily friction of paper-based food safety into measurable
            savings. Built on your numbers, not glossy averages.
          </p>

          {/* Hero stats from slide */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <HeroStat
              value="£55K"
              label="Max stock at risk"
              sub="per incident, single freezer estate"
            />
            <HeroStat value="33 min" label="Daily time" sub="recovered from manual temperature checks" />
            <HeroStat value="8 hrs" label="Monthly admin" sub="returned to operations leadership" />
            <HeroStat value="£7.25" label="Per booklet" sub="paper log replaced, per site, per month" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 print:hidden">
            <a
              href="#calculators"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors"
            >
              Run the numbers
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* STORY 1: The hidden cost of paper */}
      <section className="py-16 sm:py-20 bg-slate-900 print:bg-white print:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300 print:text-amber-700 font-semibold mb-3">
                <AlertTriangle className="w-3.5 h-3.5" />
                The hidden cost of paper
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white print:text-black tracking-tight">
                Paper-based food safety is more expensive than it looks.
              </h2>
              <p className="mt-5 text-slate-300 print:text-slate-700 text-lg leading-relaxed">
                Most kitchens have learned to live with their paper logs. They&apos;re cheap to
                print, easy to copy, and familiar to staff. But the real cost shows up everywhere
                else: in time, in risk, in stock, and in the slow erosion of operational visibility.
              </p>
            </div>
            <div className="space-y-4">
              <CostCard
                icon={<Clock className="w-5 h-5" />}
                title="Time bleeds out, one check at a time"
                body="A kitchen team running three temperature checks a day across nine assets can lose more than 30 minutes per day, per site — before anyone has even started auditing the records."
              />
              <CostCard
                icon={<Eye className="w-5 h-5" />}
                title="The estate is invisible until it isn't"
                body="When records sit in folders behind a kitchen door, leaders only learn about a problem after it has happened. By then the stock is gone and the report is on someone's desk."
              />
              <CostCard
                icon={<TrendingDown className="w-5 h-5" />}
                title="Small leaks. Big estate. Real money."
                body="At single-site scale these costs look manageable. Multiply by every site, every shift, every audit cycle, and the loss becomes the largest line item nobody is reporting."
              />
            </div>
          </div>
        </div>
      </section>

      {/* STORY 2: What changes with Digital HACCP */}
      <section className="py-16 sm:py-20 bg-slate-950 print:bg-white print:py-10 border-y border-slate-800/70 print:border-slate-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="space-y-4 order-2 lg:order-1">
              <OutcomeCard
                icon={<Sparkles className="w-5 h-5" />}
                title="Manual checks become automatic"
                body="Connected sensors and mobile checks remove the clipboard from the kitchen workflow. Staff time goes back to service, not to ticking boxes."
                accent="cyan"
              />
              <OutcomeCard
                icon={<ShieldCheck className="w-5 h-5" />}
                title="Risk is caught in minutes, not days"
                body="Real-time alerts on temperature, equipment and tasks mean issues are seen the moment they appear — not when an auditor opens a folder."
                accent="emerald"
              />
              <OutcomeCard
                icon={<Eye className="w-5 h-5" />}
                title="One view of the whole estate"
                body="Compliance, exceptions and trends are visible across every site, so leadership can prioritise visits where they actually matter."
                accent="blue"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-300 print:text-cyan-700 font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                What changes with Digital HACCP
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white print:text-black tracking-tight">
                Same compliance, with a measurable bottom line.
              </h2>
              <p className="mt-5 text-slate-300 print:text-slate-700 text-lg leading-relaxed">
                Digital HACCP is not a paper log on a tablet. It replaces the moments that quietly
                cost you money &mdash; the third temperature check of the day, the Friday audit
                review, the freezer running colder than it needs to, the spoilage event nobody saw
                coming &mdash; with workflows that report themselves.
              </p>
              <p className="mt-4 text-slate-400 print:text-slate-700 leading-relaxed">
                The four calculators below quantify the four most common places that saving shows
                up. Use the defaults to anchor the conversation, then tune every assumption to your
                estate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY 3: How this calculator works */}
      <section className="py-12 sm:py-16 bg-slate-900 print:bg-white print:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-300 print:text-cyan-700 font-semibold mb-3">
              <CalculatorIcon className="w-3.5 h-3.5" />
              How this calculator works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white print:text-black tracking-tight">
              Four numbers. Fully editable. Always shown.
            </h2>
            <p className="mt-4 text-slate-300 print:text-slate-700 max-w-2xl mx-auto">
              Every input below starts with a defensible default. Every multiplier is visible under
              &ldquo;Edit assumptions.&rdquo; Nothing is hidden behind a black box.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MiniCard
              icon={<FileText className="w-5 h-5" />}
              title="Paper & Printing"
              valueType="Direct cost eliminated"
              body="Hard cost you stop paying for as soon as paper logs go."
              accent="cyan"
            />
            <MiniCard
              icon={<Clock className="w-5 h-5" />}
              title="Staff Time"
              valueType="Labour capacity reallocated"
              body="Hours your team can redirect to higher-value work."
              accent="indigo"
            />
            <MiniCard
              icon={<Leaf className="w-5 h-5" />}
              title="Energy Saving"
              valueType="Direct cost reduction"
              body="Optimised setpoints, lower kWh, lower bill."
              accent="emerald"
            />
            <MiniCard
              icon={<Bell className="w-5 h-5" />}
              title="Stock Risk Coverage"
              valueType="Annual exposure covered"
              body="Value of stock at risk × annual risk = exposure."
              accent="amber"
            />
          </div>
        </div>
      </section>

      {/* CALCULATORS */}
      <section
        id="calculators"
        className="py-16 sm:py-20 bg-slate-950 print:bg-white print:py-10 scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Estate setup */}
          <div
            id="estate-setup"
            className="scroll-mt-24 rounded-2xl border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-5 sm:p-6 print-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 print:text-cyan-700 font-semibold mb-1">
                Configure your estate
              </div>
              <p className="text-sm text-slate-400 print:text-slate-700">
                Set your site count, then tune each calculator below to your numbers.
              </p>
            </div>
            <label className="block">
              <span className="text-xs text-slate-400 print:text-slate-700">Number of sites</span>
              <input
                type="number"
                min={1}
                value={sites}
                onChange={(e) => setSites(Math.max(1, parseInt(e.target.value || '1', 10)))}
                className="mt-1 w-full sm:w-32 bg-slate-800 print:bg-white border border-slate-700 print:border-slate-300 rounded-md px-3 py-2 text-lg font-semibold text-white print:text-black focus:outline-none focus:border-cyan-500"
              />
            </label>
          </div>

          {/* The 4 calculators */}
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            {/* Paper & Printing */}
            <CalculatorCard
              title="Paper & Printing"
              icon={<FileText className="w-5 h-5" />}
              tagline="Hard cost you stop paying as soon as paper logs are retired."
              valueType="Direct cost eliminated"
              accent="cyan"
              result={calc.paper}
              siteCount={sites}
              note="This is real money that comes off your monthly invoice. No assumptions about productivity — the line item simply goes away."
            >
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Booklets per site / month"
                  value={paperBookletsPerSite}
                  onChange={setPaperBookletsPerSite}
                  step={0.5}
                  min={0}
                />
                <NumberField
                  label="Cost per booklet"
                  prefix="£"
                  value={paperCostPerBooklet}
                  onChange={setPaperCostPerBooklet}
                  step={0.25}
                  min={0}
                />
              </div>
              <AssumptionsBlock
                open={paperShowAssumptions}
                onToggle={() => setPaperShowAssumptions(!paperShowAssumptions)}
              >
                <NumberField
                  label="% of paper replaced by Digital HACCP"
                  value={paperReductionPct}
                  onChange={setPaperReductionPct}
                  suffix="%"
                  step={5}
                  min={0}
                  max={100}
                  hint="100% assumes full migration off pre-printed booklets."
                />
              </AssumptionsBlock>
              <CalcFormula>
                {sites} sites &times; {paperBookletsPerSite} booklets &times; {fmtGBP(paperCostPerBooklet)} &times; 12 months
                &times; {paperReductionPct}%
              </CalcFormula>
            </CalculatorCard>

            {/* Staff Time */}
            <CalculatorCard
              title="Staff Time"
              icon={<Clock className="w-5 h-5" />}
              tagline="You don't save time — you prevent wasting it. Reclaim labour hours for training, service and revenue work."
              valueType="Labour capacity reallocated"
              accent="indigo"
              result={calc.staff}
              resultSubtext={`${Math.round(calc.staffTotalHours).toLocaleString('en-GB')} hrs reclaimed`}
              siteCount={sites}
              note="Your wage bill doesn't drop. What changes is what those hours are spent on. The value below is the cost of labour currently consumed by manual checks — capacity that becomes available for the work your team was actually hired to do."
            >
              <div className="text-xs uppercase tracking-wider text-slate-500 print:text-slate-600 font-semibold mb-2">
                Frontline (kitchen / temp checks)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Minutes not wasted per day per site"
                  value={staffMinsPerDay}
                  onChange={setStaffMinsPerDay}
                  suffix="min"
                  step={1}
                  min={0}
                />
                <NumberField
                  label="Frontline hourly wage"
                  prefix="£"
                  value={staffWage}
                  onChange={setStaffWage}
                  step={0.5}
                  min={0}
                />
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-500 print:text-slate-600 font-semibold mt-4 mb-2">
                Admin / leadership (audits, reviews)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Hours not wasted per month per site"
                  value={adminHrsPerMonth}
                  onChange={setAdminHrsPerMonth}
                  suffix="hrs"
                  step={0.5}
                  min={0}
                />
                <NumberField
                  label="Admin / manager hourly wage"
                  prefix="£"
                  value={adminWage}
                  onChange={setAdminWage}
                  step={0.5}
                  min={0}
                />
              </div>

              {/* Hours breakdown */}
              <div className="mt-4 rounded-lg border border-indigo-500/30 bg-indigo-500/5 print:bg-white print:border-slate-300 p-4">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-indigo-300 print:text-indigo-700 mb-3">
                  Hours reclaimed across estate · per year
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-slate-900/50 print:bg-white border border-slate-800/70 print:border-slate-300 px-2 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-slate-600">
                      Frontline
                    </div>
                    <div className="text-sm font-bold text-indigo-300 print:text-indigo-700">
                      {Math.round(calc.staffFrontlineHours).toLocaleString('en-GB')} hrs
                    </div>
                  </div>
                  <div className="rounded-md bg-slate-900/50 print:bg-white border border-slate-800/70 print:border-slate-300 px-2 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-slate-600">
                      Admin
                    </div>
                    <div className="text-sm font-bold text-indigo-300 print:text-indigo-700">
                      {Math.round(calc.staffAdminHours).toLocaleString('en-GB')} hrs
                    </div>
                  </div>
                  <div className="rounded-md bg-slate-900/50 print:bg-white border border-slate-800/70 print:border-slate-300 px-2 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-slate-600">
                      ~FTE equivalent
                    </div>
                    <div className="text-sm font-bold text-indigo-300 print:text-indigo-700">
                      {calc.staffFTE.toFixed(1)}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-slate-500 print:text-slate-600 leading-relaxed">
                  {Math.round(calc.staffTotalHours).toLocaleString('en-GB')} total hours per year —
                  roughly {calc.staffFTE.toFixed(1)} full-time equivalents worth of capacity
                  (assuming 1,800 productive hrs / FTE).
                </p>
              </div>

              <AssumptionsBlock
                open={staffShowAssumptions}
                onToggle={() => setStaffShowAssumptions(!staffShowAssumptions)}
              >
                <NumberField
                  label="Operating days per year"
                  value={staffDaysPerYear}
                  onChange={setStaffDaysPerYear}
                  step={1}
                  min={1}
                  max={365}
                  hint="365 for residential / hospital catering, 250 for office and school estates."
                />
                <NumberField
                  label="% of reclaimed time productively redirected"
                  value={staffCapturePct}
                  onChange={setStaffCapturePct}
                  suffix="%"
                  step={5}
                  min={0}
                  max={100}
                  hint="Default 70%: not every reclaimed minute converts to productive output. Raise to 100% for the optimistic case."
                />
              </AssumptionsBlock>
              <CalcFormula>
                Frontline: {sites} &times; ({staffMinsPerDay}/60) &times; {staffDaysPerYear} days &times;{' '}
                {fmtGBP(staffWage)} = <strong className="text-slate-200 print:text-black">{fmtGBP(calc.staffFrontline)}</strong>
                <br />
                Admin: {sites} &times; {adminHrsPerMonth} hrs &times; 12 &times; {fmtGBP(adminWage)} ={' '}
                <strong className="text-slate-200 print:text-black">{fmtGBP(calc.staffAdmin)}</strong>
                <br />
                Capture rate: {staffCapturePct}%
              </CalcFormula>
            </CalculatorCard>

            {/* Energy Saving */}
            <CalculatorCard
              title="Energy Saving"
              icon={<Leaf className="w-5 h-5" />}
              tagline="Optimised freezer setpoints under continuous monitoring. Lower kWh, lower bill, lower carbon."
              valueType="Direct cost reduction"
              accent="emerald"
              result={calc.energy}
              resultSubtext={`${calc.energyTCO2eAvoided.toFixed(1)} tCO₂e avoided`}
              siteCount={sites}
              note="Only applicable where continuous Digital HACCP monitoring is in place. Under those conditions, Checkit's Primary Authority arrangement supports an optimised setpoint (e.g. -15°C vs -18°C) without compromising food safety. Without continuous monitoring, do not adjust setpoints."
            >
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Freezers / fridges per site"
                  value={energyFreezersPerSite}
                  onChange={setEnergyFreezersPerSite}
                  step={1}
                  min={0}
                />
                <NumberField
                  label="Energy cost per kWh"
                  prefix="£"
                  value={energyCostPerKwh}
                  onChange={setEnergyCostPerKwh}
                  step={0.01}
                  min={0}
                  hint="UK commercial average ~£0.28/kWh."
                />
              </div>

              {/* ESG / Carbon impact */}
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 print:bg-white print:border-slate-300 p-4">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-300 print:text-emerald-700 mb-3">
                  ESG impact · per year
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-slate-900/50 print:bg-white border border-slate-800/70 print:border-slate-300 px-2 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-slate-600">
                      kWh saved
                    </div>
                    <div className="text-sm font-bold text-emerald-300 print:text-emerald-700">
                      {Math.round(calc.energyKwhSaved).toLocaleString('en-GB')}
                    </div>
                  </div>
                  <div className="rounded-md bg-slate-900/50 print:bg-white border border-slate-800/70 print:border-slate-300 px-2 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-slate-600">
                      tCO₂e avoided
                    </div>
                    <div className="text-sm font-bold text-emerald-300 print:text-emerald-700">
                      {calc.energyTCO2eAvoided.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-md bg-slate-900/50 print:bg-white border border-slate-800/70 print:border-slate-300 px-2 py-2">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-slate-600">
                      ≈ car km off-road
                    </div>
                    <div className="text-sm font-bold text-emerald-300 print:text-emerald-700">
                      {Math.round(calc.energyCarKmEquivalent).toLocaleString('en-GB')}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-slate-500 print:text-slate-600 leading-relaxed">
                  Equivalent to a {Math.round(calc.energyCarKmEquivalent).toLocaleString('en-GB')} km
                  reduction in petrol-car driving per year &middot; reported as Scope 2 emissions
                  reduction on supplier ESG and CSRD disclosures.
                </p>
              </div>

              <AssumptionsBlock
                open={energyShowAssumptions}
                onToggle={() => setEnergyShowAssumptions(!energyShowAssumptions)}
              >
                <NumberField
                  label="kWh per unit per year (baseline)"
                  value={energyKwhPerUnitPerYear}
                  onChange={setEnergyKwhPerUnitPerYear}
                  step={100}
                  min={0}
                  hint="Typical UK commercial upright freezer: 3,000-4,000 kWh / year."
                />
                <NumberField
                  label="% energy reduction from setpoint optimisation"
                  value={energyReductionPct}
                  onChange={setEnergyReductionPct}
                  suffix="%"
                  step={1}
                  min={0}
                  max={100}
                  hint="Approx. 3-5% per 1°C warmer setpoint. Only applies under continuous Digital HACCP monitoring with Primary Authority backing."
                />
                <NumberField
                  label="Grid carbon intensity"
                  value={energyGridCarbonIntensity}
                  onChange={setEnergyGridCarbonIntensity}
                  suffix="kgCO₂e/kWh"
                  step={0.001}
                  min={0}
                  hint="UK 2024 average: 0.207. Use your local grid factor for non-UK estates."
                />
              </AssumptionsBlock>
              <CalcFormula>
                Cost: {sites} &times; {energyFreezersPerSite} units &times;{' '}
                {energyKwhPerUnitPerYear.toLocaleString('en-GB')} kWh &times; {fmtGBP(energyCostPerKwh)}{' '}
                &times; {energyReductionPct}% ={' '}
                <strong className="text-slate-200 print:text-black">{fmtGBP(calc.energy)}</strong>
                <br />
                Carbon: {Math.round(calc.energyKwhSaved).toLocaleString('en-GB')} kWh &times;{' '}
                {energyGridCarbonIntensity} kgCO₂e/kWh ={' '}
                <strong className="text-slate-200 print:text-black">
                  {calc.energyTCO2eAvoided.toFixed(1)} tCO₂e
                </strong>{' '}
                avoided
              </CalcFormula>
            </CalculatorCard>

            {/* Stock Risk Coverage */}
            <CalculatorCard
              title="Stock Risk Coverage"
              icon={<Bell className="w-5 h-5" />}
              tagline="Not a guaranteed saving. Your annual exposure if you do nothing."
              valueType="Annual exposure covered"
              accent="amber"
              result={calc.stock}
              resultSubtext={`${fmtGBPCompact(sites * stockValuePerSite)} total stock at risk`}
              siteCount={sites}
              note="The conversation here isn't 'how much will we save?' — it's 'what are we already carrying as risk?' If your annual exposure is greater than the cost of monitoring, the protection pays for itself before the first incident."
            >
              <div className="grid grid-cols-2 gap-3">
                <NumberField
                  label="Stock value at risk per site"
                  prefix="£"
                  value={stockValuePerSite}
                  onChange={setStockValuePerSite}
                  step={1000}
                  min={0}
                  hint="Worst-case stock value sitting in cold storage at any one time."
                />
                <NumberField
                  label="Annual risk of a loss event"
                  value={stockAnnualRiskPct}
                  onChange={setStockAnnualRiskPct}
                  suffix="%"
                  step={1}
                  min={0}
                  max={100}
                  hint="Probability per site per year of a power, door or equipment event that spoils stock."
                />
              </div>

              <AssumptionsBlock
                open={stockShowAssumptions}
                onToggle={() => setStockShowAssumptions(!stockShowAssumptions)}
              >
                <div className="text-xs text-slate-400 print:text-slate-700 leading-relaxed sm:col-span-2">
                  This calculator deliberately avoids a &ldquo;% prevented&rdquo; multiplier.
                  Instead it expresses your annual exposure — the value carried at risk each year.
                  Read it as a coverage decision: if the cost of monitoring is less than this
                  exposure, the protection pays for itself.
                </div>
              </AssumptionsBlock>
              <CalcFormula>
                {sites} sites &times; {fmtGBP(stockValuePerSite)} stock at risk &times;{' '}
                {stockAnnualRiskPct}% annual risk ={' '}
                <strong className="text-slate-200 print:text-black">{fmtGBP(calc.stock)}</strong>
              </CalcFormula>
            </CalculatorCard>
          </div>

          {/* Estate-wide annual value (total of the 4 calculators above) */}
          <div className="mt-10 rounded-2xl bg-linear-to-br from-cyan-500/15 via-indigo-500/10 to-emerald-500/15 border border-cyan-500/30 print:border-slate-300 p-6 sm:p-8 print-card">
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 print:text-cyan-700 font-semibold mb-1">
                Estate-wide annual value
              </div>
              <p className="text-sm text-slate-400 print:text-slate-700">
                Combined annual value of the four calculators above &middot; across {sites}{' '}
                {sites === 1 ? 'site' : 'sites'}.
              </p>
            </div>

            {/* 4 breakdown tiles ABOVE the total */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <TotalBreakdown
                label="Paper & Printing"
                valueType="Direct cost eliminated"
                value={calc.paper}
                accent="cyan"
              />
              <TotalBreakdown
                label="Staff Time"
                valueType="Labour reallocated"
                value={calc.staff}
                accent="indigo"
              />
              <TotalBreakdown
                label="Energy Saving"
                valueType="Direct cost reduction"
                value={calc.energy}
                accent="emerald"
              />
              <TotalBreakdown
                label="Stock Risk Coverage"
                valueType="Annual exposure"
                value={calc.stock}
                accent="amber"
              />
            </div>

            {/* Pie / donut chart with the big total in the middle */}
            <div className="mt-8 flex flex-col items-center">
              <DonutChart
                slices={[
                  { label: 'Paper & Printing', value: calc.paper, accent: 'cyan' },
                  { label: 'Staff Time', value: calc.staff, accent: 'indigo' },
                  { label: 'Energy Saving', value: calc.energy, accent: 'emerald' },
                  { label: 'Stock Risk Coverage', value: calc.stock, accent: 'amber' },
                ]}
                centerTop={fmtGBP(calc.total)}
                centerBottom="/ year"
              />
              <p className="mt-2 text-[11px] text-slate-500 print:text-slate-600 italic">
                Composite business-case value. Not all four are the same type of money — see below.
              </p>

              {/* Honest decomposition: hard cash vs capacity / risk */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                <div className="rounded-lg border border-slate-700 print:border-slate-300 bg-slate-900/40 print:bg-white p-4">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-700 font-semibold">
                    Hard savings
                  </div>
                  <div className="text-2xl font-bold text-white print:text-black mt-1">
                    {fmtGBP(calc.hardSavings)}
                    <span className="text-xs text-slate-400 print:text-slate-600 font-normal ml-1">
                      / year
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 print:text-slate-600 mt-1 leading-snug">
                    Paper + Energy &middot; cash that comes off the invoice
                  </div>
                </div>
                <div className="rounded-lg border border-slate-700 print:border-slate-300 bg-slate-900/40 print:bg-white p-4">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-700 font-semibold">
                    Capacity &amp; risk covered
                  </div>
                  <div className="text-2xl font-bold text-white print:text-black mt-1">
                    {fmtGBP(calc.capacityAndRisk)}
                    <span className="text-xs text-slate-400 print:text-slate-600 font-normal ml-1">
                      / year
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 print:text-slate-600 mt-1 leading-snug">
                    Staff hours reclaimed + stock-loss exposure protected
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs text-slate-500 print:text-slate-600 max-w-2xl text-center leading-relaxed">
                The Hard savings figure is what shows up on a bank statement. Capacity &amp; risk
                covered is what shows up on the operations dashboard: hours your team can spend on
                higher-value work, plus annual exposure to stock-loss events. Both belong in the
                business case, but they are not the same kind of pound.
              </p>
            </div>
          </div>

          {/* PDF export */}
          <div className="mt-6 rounded-2xl border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-6 sm:p-8 print-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-cyan-300 print:text-cyan-700 font-semibold mb-2">
                  Take this with you
                </div>
                <h3 className="text-2xl font-bold text-white print:text-black">
                  Export your business case as a PDF
                </h3>
                <p className="mt-2 text-slate-400 print:text-slate-700 max-w-xl">
                  The PDF will include all your inputs, every assumption you&apos;ve adjusted, and
                  the four annual values plus the estate-wide total.
                </p>
              </div>
              <div className="flex print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-8 text-xs text-slate-500 print:text-slate-600 max-w-3xl">
            Defaults are anchored to observed benchmarks across UK food service estates. Adjust any
            input to your own data. Currency: GBP. This is an estimate, not a quotation &mdash; talk
            to a Checkit expert for a tailored business case.
          </p>
          <p className="hidden print:block mt-4 text-xs text-slate-500">
            Prepared with Checkit Digital HACCP ROI Calculator &middot;{' '}
            {new Date().toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {/* Internal-link nudge - links elsewhere in the site (hidden in print) */}
          <div className="mt-6 print:hidden">
            <Link
              href="/platform"
              className="text-sm text-slate-400 hover:text-cyan-300 transition-colors"
            >
              &larr; See the platform behind these numbers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------- Small presentational helpers ----------

function HeroStat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-slate-800/80 print:border-slate-300 bg-slate-900/40 print:bg-white p-4 sm:p-5">
      <div className="text-3xl sm:text-4xl font-bold text-cyan-300 print:text-cyan-700">{value}</div>
      <div className="text-sm font-semibold text-white print:text-black mt-1">{label}</div>
      <div className="text-xs text-slate-400 print:text-slate-600 mt-1">{sub}</div>
    </div>
  );
}

function CostCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/60 print:bg-white p-5 print-card">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-amber-500/10 text-amber-300 print:text-amber-700">{icon}</div>
        <div>
          <div className="font-semibold text-white print:text-black">{title}</div>
          <p className="text-sm text-slate-400 print:text-slate-700 mt-1 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}

function OutcomeCard({
  icon,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: 'cyan' | 'emerald' | 'blue';
}) {
  const tone =
    accent === 'cyan'
      ? 'bg-cyan-500/10 text-cyan-300 print:text-cyan-700'
      : accent === 'emerald'
        ? 'bg-emerald-500/10 text-emerald-300 print:text-emerald-700'
        : 'bg-blue-500/10 text-blue-300 print:text-blue-700';
  return (
    <div className="rounded-xl border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-white p-5 print-card">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-md ${tone}`}>{icon}</div>
        <div>
          <div className="font-semibold text-white print:text-black">{title}</div>
          <p className="text-sm text-slate-400 print:text-slate-700 mt-1 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  icon,
  title,
  valueType,
  body,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  valueType: string;
  body: string;
  accent: Accent;
}) {
  const tone = accentTone(accent);
  return (
    <div className="rounded-xl border border-slate-800 print:border-slate-300 bg-slate-950/60 print:bg-white p-5 print-card">
      <div className={`inline-flex p-2 rounded-md ${tone.iconBg} ${tone.iconText} mb-3`}>
        {icon}
      </div>
      <div className="font-semibold text-white print:text-black">{title}</div>
      <div
        className={`mt-1 text-[10px] uppercase tracking-wider font-semibold ${tone.iconText}`}
      >
        {valueType}
      </div>
      <p className="text-xs text-slate-400 print:text-slate-700 mt-2">{body}</p>
    </div>
  );
}

function TotalBreakdown({
  label,
  valueType,
  value,
  accent,
}: {
  label: string;
  valueType: string;
  value: number;
  accent: Accent;
}) {
  const tone = accentTone(accent);
  return (
    <div
      className={`rounded-lg ${tone.tileBg} border ${tone.border} print:border-slate-300 px-4 py-3`}
    >
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${tone.dot}`} />
        <div className="text-xs font-semibold text-white print:text-black truncate">{label}</div>
      </div>
      <div className="text-xl font-bold text-white print:text-black mt-1.5">
        {fmtGBPCompact(value)}
      </div>
      <div className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${tone.iconText}`}>
        {valueType}
      </div>
    </div>
  );
}

type DonutSlice = { label: string; value: number; accent: Accent };

function DonutChart({
  slices,
  centerTop,
  centerBottom,
}: {
  slices: DonutSlice[];
  centerTop: string;
  centerBottom: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = slices.reduce((s, sl) => s + Math.max(0, sl.value), 0);
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 100;
  const innerR = 64;
  const hoverOuterR = 108; // slight pop on hover

  // Edge case: no value, render an empty ring placeholder.
  if (total <= 0) {
    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-56 h-56 sm:w-64 sm:h-64"
        style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' } as React.CSSProperties}
        role="img"
        aria-label="Estate-wide annual value breakdown"
      >
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke="#334155"
          strokeWidth={outerR - innerR}
        />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white print:fill-black"
          fontSize="20"
          fontWeight="700"
        >
          {centerTop}
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-400 print:fill-slate-600"
          fontSize="12"
        >
          {centerBottom}
        </text>
      </svg>
    );
  }

  // Active slices only - guards against zero-value arcs producing degenerate paths.
  const active = slices.filter((sl) => sl.value > 0);

  const buildArc = (startAngle: number, endAngle: number, r: number) => {
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return { x1, y1, x2, y2, largeArc };
  };

  // Precompute angle ranges without mutating outer state, so React 19's compiler
  // can treat this purely as a render-time derivation.
  const sliceAngles = active.map((sl, i, arr) => {
    const startFraction = arr.slice(0, i).reduce((s, x) => s + x.value, 0) / total;
    const sweepFraction = sl.value / total;
    return {
      slice: sl,
      start: -Math.PI / 2 + startFraction * 2 * Math.PI,
      end: -Math.PI / 2 + (startFraction + sweepFraction) * 2 * Math.PI,
      pct: sweepFraction * 100,
    };
  });

  const buildSlicePath = (start: number, end: number, r: number, isSingle: boolean) => {
    if (isSingle) {
      return [
        `M ${cx - r} ${cy}`,
        `A ${r} ${r} 0 1 1 ${cx + r} ${cy}`,
        `A ${r} ${r} 0 1 1 ${cx - r} ${cy}`,
        `Z`,
      ].join(' ');
    }
    const outer = buildArc(start, end, r);
    const inner = buildArc(end, start, innerR);
    return [
      `M ${outer.x1} ${outer.y1}`,
      `A ${r} ${r} 0 ${outer.largeArc} 1 ${outer.x2} ${outer.y2}`,
      `L ${inner.x1} ${inner.y1}`,
      `A ${innerR} ${innerR} 0 ${outer.largeArc} 0 ${inner.x2} ${inner.y2}`,
      `Z`,
    ].join(' ');
  };

  const hovered = hoveredIdx !== null ? sliceAngles[hoveredIdx] : null;
  const displayTop = hovered ? fmtGBPCompact(hovered.slice.value) : centerTop;
  const displayBottom = hovered
    ? `${hovered.slice.label} · ${hovered.pct.toFixed(0)}%`
    : centerBottom;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-56 h-56 sm:w-72 sm:h-72"
        style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' } as React.CSSProperties}
        role="img"
        aria-label="Estate-wide annual value breakdown"
      >
        {/* Backing ring fills any rounding gaps between slices */}
        <circle
          cx={cx}
          cy={cy}
          r={(outerR + innerR) / 2}
          fill="none"
          stroke="rgba(51,65,85,0.4)"
          strokeWidth={outerR - innerR}
        />
        {sliceAngles.map(({ slice: sl, start, end, pct }, i) => {
          const isHovered = hoveredIdx === i;
          const r = isHovered ? hoverOuterR : outerR;
          const d = buildSlicePath(start, end, r, active.length === 1);
          return (
            <path
              key={`${sl.label}-${i}`}
              d={d}
              fill={accentMap[sl.accent].hex}
              opacity={hoveredIdx === null || isHovered ? 1 : 0.55}
              style={{
                transition: 'opacity 150ms ease, d 150ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(i)}
              onBlur={() => setHoveredIdx(null)}
              tabIndex={0}
              role="button"
              aria-label={`${sl.label}: ${fmtGBP(sl.value)} (${pct.toFixed(0)}% of total)`}
            />
          );
        })}
        {/* Single-slice case needs an explicit inner cutout */}
        {active.length === 1 && (
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill="rgb(15,23,42)"
            className="print:fill-white"
            pointerEvents="none"
          />
        )}
        {/* Center labels */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white print:fill-black"
          fontSize="26"
          fontWeight="700"
          pointerEvents="none"
        >
          {displayTop}
        </text>
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-400 print:fill-slate-600"
          fontSize="12"
          pointerEvents="none"
        >
          {displayBottom}
        </text>
      </svg>
      {/* Hint that's always there - removed once a slice is hovered */}
      <div
        className={`mt-2 text-[11px] uppercase tracking-wider transition-opacity print:hidden ${
          hoveredIdx === null ? 'text-slate-500 opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        Hover a slice for detail
      </div>
    </div>
  );
}

function CalculatorCard({
  title,
  icon,
  tagline,
  valueType,
  accent,
  result,
  resultSubtext,
  note,
  siteCount,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  tagline: string;
  valueType: string;
  accent: Accent;
  result: number;
  resultSubtext?: string;
  note?: string;
  siteCount?: number;
  children: React.ReactNode;
}) {
  const tone = accentTone(accent);
  return (
    <div
      className={`rounded-2xl border ${tone.border} bg-slate-900/60 print:bg-white print:border-slate-300 p-6 print-card`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md ${tone.iconBg} ${tone.iconText}`}>{icon}</div>
          <div>
            <h3 className="text-xl font-bold text-white print:text-black">{title}</h3>
            <div
              className={`mt-1 text-[10px] uppercase tracking-wider font-semibold ${tone.iconText}`}
            >
              {valueType}
            </div>
            <p className="text-xs text-slate-400 print:text-slate-700 mt-2">{tagline}</p>
            {siteCount !== undefined && (
              <a
                href="#estate-setup"
                className="inline-flex items-center gap-1 mt-2 text-[11px] text-slate-500 hover:text-slate-200 transition-colors print:text-slate-700 print:no-underline"
                title="Jump to estate setup"
              >
                <ArrowUp className="w-3 h-3" />
                Across {siteCount} {siteCount === 1 ? 'site' : 'sites'}
                <span className="print:hidden text-slate-600">· change</span>
              </a>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-slate-600">
            / year
          </div>
          <div className={`text-2xl font-bold ${tone.iconText}`}>{fmtGBP(result)}</div>
          {resultSubtext && (
            <div className="text-[11px] text-slate-400 print:text-slate-700 mt-0.5">
              {resultSubtext}
            </div>
          )}
        </div>
      </div>
      <div>{children}</div>
      {note && (
        <p className="mt-4 text-xs text-slate-400 print:text-slate-700 leading-relaxed border-t border-slate-800/60 print:border-slate-200 pt-3 italic">
          {note}
        </p>
      )}
    </div>
  );
}

function CalcFormula({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 text-[11px] text-slate-500 print:text-slate-600 leading-relaxed bg-slate-950/40 print:bg-slate-50 border border-slate-800/60 print:border-slate-200 rounded-md p-3 font-mono">
      {children}
    </div>
  );
}
