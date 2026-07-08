'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  Users,
  Globe,
  HandCoins,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Printer,
  Sparkles,
  Flag,
  Stethoscope,
  ShoppingCart,
  Calculator,
  Linkedin,
  Workflow,
  RefreshCw,
  Search,
  Bot,
  ShieldQuestion,
  HelpCircle,
  UserCheck,
  Network,
  MousePointerClick,
  Wrench,
  Trophy,
} from 'lucide-react';
import Image from 'next/image';

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body: React.ReactNode;
};

function StatCard({
  label,
  value,
  sub,
  tone = 'accent',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'accent' | 'success' | 'warning' | 'error';
}) {
  const toneMap = {
    accent: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-300',
    success: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-300',
    warning: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-300',
    error: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-300',
  } as const;
  return (
    <div
      className={`rounded-xl border bg-gradient-to-br ${toneMap[tone]} p-5 backdrop-blur-sm`}
    >
      <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
      <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
      {sub && <div className="mt-1 text-sm text-muted">{sub}</div>}
    </div>
  );
}

function Bullet({ children, icon: Icon = CheckCircle2 }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
      <span className="text-base leading-relaxed text-foreground/90">{children}</span>
    </li>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

const slides: Slide[] = [
  {
    id: 'cover',
    eyebrow: 'Checkit — Marketing · RoW Sales',
    title: 'Sharpening the Motion',
    body: (
      <div className="space-y-8">
        <p className="max-w-2xl text-lg text-muted">
          How marketing helps each territory sell the <strong>problem</strong>, not the product —
          and how we prove it&apos;s working. Support material for the territory reviews, on demand.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Trajectory" value="Best year yet" sub="Solid Q1 / Q2, year-end a touch light" tone="success" />
          <StatCard label="Stretch" value="~£2M" sub="Upside if Jen's motion lands (stretch target)" />
          <StatCard label="Our job today" value="Sharpen" sub="Narrative, proof, and demand" tone="accent" />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <Sparkles className="h-4 w-4 text-blue-400" />
          Color commentary to Meghan&apos;s and April&apos;s territory reviews — not a replacement for them.
        </div>
      </div>
    ),
  },
  {
    id: 'insight',
    eyebrow: 'Slide 2 — The Reframe',
    title: 'Are We Selling a Solution Looking for a Problem?',
    body: (
      <div className="space-y-6">
        <blockquote className="rounded-2xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent p-6 text-xl leading-relaxed text-foreground">
          &quot;Sometimes I think we&apos;re a bit of a solution looking for a problem.&quot;
          <span className="mt-2 block text-sm font-normal text-muted">— the honest version of where CAM commercial sits today</span>
        </blockquote>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Where it&apos;s clear" icon={Stethoscope}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li><strong>CAM+ medical</strong> — compliance is the driver. People <em>have</em> to do it.</li>
              <li>Well-defined buyer, well-defined trigger.</li>
            </ul>
          </SectionCard>
          <SectionCard title="Where it blurs" icon={ShoppingCart}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li><strong>CAM commercial</strong> — &quot;all things to all people.&quot;</li>
              <li>Harder to hone in on the specific pain, so pitches get a glazed-over look.</li>
            </ul>
          </SectionCard>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-200">
          The fix isn&apos;t more features or a rebrand — it&apos;s leading with the problem and who owns it.
        </div>
      </div>
    ),
  },
  {
    id: 'discovery',
    eyebrow: 'Slide 3 — The Framework',
    title: 'Lead With the Problem, Not the Product',
    body: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <SectionCard title="Who's the problem?" icon={UserCheck}>
            <p className="text-sm text-foreground/90">Which role feels the pain — ops, finance, compliance, sustainability?</p>
          </SectionCard>
          <SectionCard title="What's the problem?" icon={HelpCircle}>
            <p className="text-sm text-foreground/90">Waste, energy, staff time, risk, visibility at scale.</p>
          </SectionCard>
          <SectionCard title="Who owns it?" icon={ShieldQuestion}>
            <p className="text-sm text-foreground/90">Who is accountable if it&apos;s not solved — and who signs?</p>
          </SectionCard>
          <SectionCard title="What if nothing's done?" icon={AlertTriangle}>
            <p className="text-sm text-foreground/90">The cost of inaction — the trigger that makes it &quot;today.&quot;</p>
          </SectionCard>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent p-5">
            <div className="text-xs uppercase tracking-widest text-blue-300">Proof — BWG</div>
            <p className="mt-2 text-sm text-foreground/90">
              Weren&apos;t optimizing temperature levels — wasting energy across the estate. The problem
              framed the sale, not the sensor spec.
            </p>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent p-5">
            <div className="text-xs uppercase tracking-widest text-blue-300">Proof — BP</div>
            <p className="mt-2 text-sm text-foreground/90">
              Started as visibility at scale — a single point of glass — then a food-production waste
              problem surfaced as we engaged. Land, then expand on the next problem.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-200">
          Marketing&apos;s role: turn account intelligence from Tom&apos;s conversations into problem-led
          materials the reps can lead with.
        </div>
      </div>
    ),
  },
  {
    id: 'motions',
    eyebrow: 'Slide 4 — Two Motions',
    title: 'Medical and Commercial Are Different Games',
    body: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="CAM+ Medical — Meghan" icon={Stethoscope}>
            <ul className="space-y-3 text-sm">
              <Bullet icon={Target}>Well-defined universe: hospital pharmacy &amp; hospital pathology (UK).</Bullet>
              <Bullet icon={Flag}>Tender-based — get on the shortlist, win on scoring.</Bullet>
              <Bullet icon={Users}>Less mass campaign; more <strong>conference presence</strong> and getting known where tenders originate.</Bullet>
              <Bullet icon={HandCoins}>Be <strong>more commercially aggressive on price</strong> — historically our gap.</Bullet>
            </ul>
          </SectionCard>
          <SectionCard title="CAM Commercial — April" icon={ShoppingCart}>
            <ul className="space-y-3 text-sm">
              <Bullet icon={HelpCircle}>Broader, fuzzier: waste? staff time? energy? visibility?</Bullet>
              <Bullet icon={Search}>Win with <strong>discovery + account intelligence</strong> before pitching.</Bullet>
              <Bullet icon={TrendingUp}>Find the biggest-opportunity problem and lead the narrative with it.</Bullet>
              <Bullet icon={Sparkles}>Microsite-style, business-focused messaging is resonating.</Bullet>
            </ul>
          </SectionCard>
        </div>
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-yellow-200">
          One marketing engine, two calibrations — don&apos;t run the medical playbook at commercial, or vice versa.
        </div>
      </div>
    ),
  },
  {
    id: 'territory-support',
    eyebrow: 'Slide 5 — On Demand',
    title: 'What Marketing Has Ready per Territory',
    body: (
      <div className="space-y-4">
        <p className="max-w-3xl text-base text-muted">
          Available to pull up as each territory is reviewed — not a plan being imposed, a toolkit to draw on.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Meghan — Medical" icon={Stethoscope}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>ROI calculator live in active conversations</li>
              <li>Tender / shortlist awareness support</li>
              <li>Conference-presence and &quot;get known&quot; assets</li>
            </ul>
          </SectionCard>
          <SectionCard title="April — Commercial" icon={ShoppingCart}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Coffee-shops &amp; forecourts microsites (use cases + calculators)</li>
              <li>Problem-led narrative from account intelligence</li>
              <li>Business-focused messaging, not spec sheets</li>
            </ul>
          </SectionCard>
          <SectionCard title="Tom — Forecourts / Outbound" icon={Linkedin}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Phantom Buster account-based LinkedIn outreach</li>
              <li>Custom sequences, repeatable for the next cycle</li>
              <li>Battlecards for live objections (see next)</li>
            </ul>
          </SectionCard>
          <SectionCard title="Jordan — New SDR / US" icon={Bot}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Apollo implementation to ramp on from day one</li>
              <li>Re-engagement workflows for inherited pipeline</li>
              <li>Scripts tied to the problem framework</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    ),
  },
  {
    id: 'enablement',
    eyebrow: 'Slide 6 — In Flight',
    title: 'Enablement Already Shipped or Underway',
    body: (
      <div className="space-y-6">
        <p className="max-w-3xl text-base text-muted">
          Concrete things in use today — not theory.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="ROI Calculator — Live" icon={Calculator}>
            <ul className="space-y-2 text-sm">
              <Bullet>Supporting Meghan in active conversations.</Bullet>
              <Bullet>Now used by the forecourts team too.</Bullet>
              <Bullet>Reusable as we align verticals.</Bullet>
            </ul>
          </SectionCard>
          <SectionCard title="Outbound — Phantom Buster + Apollo" icon={Workflow}>
            <ul className="space-y-2 text-sm">
              <Bullet>Account-based LinkedIn outreach live with the UK team.</Bullet>
              <Bullet>Apollo sequences into named accounts — more value to squeeze as Tom &amp; Jordan ramp.</Bullet>
            </ul>
          </SectionCard>
          <SectionCard title="Battlecard — &quot;Why Homegrown Is a Bad Idea&quot;" icon={Wrench}>
            <ul className="space-y-2 text-sm">
              <Bullet>Counters the &quot;we&apos;ll build it internally&quot; objection Tom hears.</Bullet>
              <Bullet>Cost of maintenance, hidden gotchas, opportunity cost — one page, on hand.</Bullet>
            </ul>
          </SectionCard>
          <SectionCard title="Smarter Re-engagement" icon={RefreshCw}>
            <ul className="space-y-2 text-sm">
              <Bullet>New process for re-warming inherited / stalled pipeline.</Bullet>
              <Bullet>Pairs with list hygiene work.</Bullet>
            </ul>
          </SectionCard>
        </div>
      </div>
    ),
  },
  {
    id: 'proof',
    eyebrow: 'Slide 7 — Visibility for the Room',
    title: 'The Demand Engine — and Proof It Works',
    body: (
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent p-5">
          <div className="flex items-start gap-3">
            <Network className="mt-1 h-5 w-5 text-blue-300" />
            <p className="text-base text-foreground/90">
              <strong>Inbound is the anchor</strong>; paid, social and outbound layer on top to feed the
              same accounts a coherent story. Here&apos;s what it&apos;s actually producing.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="AI referral clicks / mo" value="~50" sub="From 0 in October — halfway to goal" tone="success" />
          <StatCard label="Goal" value="100 / mo" sub="Clicks alone — excludes impressions &amp; mentions" tone="accent" />
          <StatCard label="Context" value="Organic ↓" sub="B2B SaaS-wide decline as AI search rises" tone="warning" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Ahead of the curve" icon={Search}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>AI search visibility (ChatGPT / Perplexity) — no other sensor company is doing this</li>
              <li>Anecdotal wins already: reps reporting &quot;we showed up&quot;</li>
            </ul>
          </SectionCard>
          <SectionCard title="Learning the paid AI channel" icon={MousePointerClick}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Experimenting with ChatGPT advertising</li>
              <li>Question on the table: shift some LinkedIn spend here?</li>
            </ul>
          </SectionCard>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-200">
          Steve / Chris ask: full visibility of this activity so spend is defensible. Data&apos;s ready —
          just needs a standing view.
        </div>
      </div>
    ),
  },
  {
    id: 'product-loop',
    eyebrow: 'Slide 8 — Feedback Loop',
    title: 'What the Market Is Telling Us',
    body: (
      <div className="space-y-6">
        <p className="max-w-3xl text-base text-muted">
          Product-market fit isn&apos;t static (Blackberry had it once). Where we lose is signal —
          route it to product, don&apos;t just absorb it.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Where we're strong" icon={Trophy}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>CAM sensors — robust, fit-for-purpose for food retail</li>
              <li>Platform coverage of core needs</li>
              <li>Recently more price-aggressive with less resistance than expected</li>
            </ul>
          </SectionCard>
          <SectionCard title="Where we hear friction" icon={AlertTriangle}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>App is &quot;average at best&quot; — limited standout differentiation</li>
              <li>Prospects building homegrown solutions instead</li>
              <li>Feature asks (e.g. label printing) ≠ a killer differentiator</li>
            </ul>
          </SectionCard>
        </div>
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm text-yellow-200">
          Ask of the room: from live pipeline, what&apos;s the handful of losses worth handing to product —
          and are they a gap, a price issue, or a narrative issue?
        </div>
      </div>
    ),
  },
  {
    id: 'decisions',
    eyebrow: 'Slide 9 — Decisions / Asks',
    title: 'What I Need From This Room',
    body: (
      <div className="space-y-4">
        <ul className="space-y-4">
          <Bullet icon={MousePointerClick}>
            <strong>Channel mix:</strong> appetite to shift some LinkedIn spend toward AI / ChatGPT
            advertising as we learn it?
          </Bullet>
          <Bullet icon={Globe}>
            <strong>Web direction:</strong> lean the corporate site toward the business-focused
            microsite style (April&apos;s feedback) — and how does that sequence against the planned
            rebrand / category work?
          </Bullet>
          <Bullet icon={Search}>
            <strong>Visibility:</strong> stand up a marketing view so spend is defensible to Chris.
          </Bullet>
          <Bullet icon={HandCoins}>
            <strong>Events:</strong> confirm the small events with Meghan (budget-neutral if we move funds).
          </Bullet>
          <Bullet icon={Users}>
            <strong>Resourcing:</strong> US SDR backfill — Jordan ramping, strong candidate in screening.
          </Bullet>
        </ul>
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent p-4 text-sm text-foreground/90">
          Bottom line: sharpen the problem-led narrative per motion, prove the demand engine, and pick
          the two or three bets worth leaning into.
        </div>
      </div>
    ),
  },
];

export default function CheckitGtmDeckV2() {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = slides.length;

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        setIndex(0);
      } else if (e.key === 'End') {
        setIndex(total - 1);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, total, toggleFullscreen]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const slide = slides[index];
  const progress = useMemo(() => ((index + 1) / total) * 100, [index, total]);

  return (
    <>
      <PrintStyles />
      <div className="space-y-4 deck-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/checkit-logo-horizontal-standard-rgb-white.svg"
            alt="Checkit"
            width={140}
            height={32}
            priority
            className="h-8 w-auto"
          />
          <div className="hidden sm:block border-l border-border pl-4">
            <h1 className="text-lg font-semibold text-foreground">2027 GTM · v2</h1>
            <p className="text-xs text-muted">Marketing working session</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-surface-hover"
            title="Print / Save as PDF (one slide per landscape page)"
          >
            <Printer className="h-4 w-4" />
            Print / PDF
          </button>
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-surface-hover"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {isFullscreen ? 'Exit' : 'Present'}
          </button>
        </div>
      </div>

      {/* Slide */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-background shadow-2xl"
        style={{
          backgroundImage:
            'radial-gradient(circle at 100% 0%, rgba(59,130,246,0.12), transparent 50%), radial-gradient(circle at 0% 100%, rgba(37,99,235,0.08), transparent 50%)',
        }}
      >
        {/* Progress */}
        <div className="absolute left-0 top-0 h-1 w-full bg-border/40">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="min-h-[60vh] px-8 py-10 md:px-14 md:py-14">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-blue-300">{slide.eyebrow}</span>
            <span className="text-xs uppercase tracking-widest text-muted">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            <span className="text-gradient">{slide.title}</span>
          </h2>
          <div className="mt-8">{slide.body}</div>
        </div>

        {/* Brand strip */}
        <div className="flex items-center justify-between border-t border-border/60 bg-background/40 px-6 py-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            Checkit · GTM Tracker
          </div>
          <div>Confidential — internal use only</div>
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        Tip: use ← / → keys to navigate, F to present, Home / End to jump.
      </p>

      {/* Spacer so fixed bottom bar doesn't cover content */}
      <div className="h-24" aria-hidden />
      </div>

      {/* Fixed bottom controls (no-print, hidden on print) */}
      <div className="deck-controls fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={prev}
            disabled={index === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? 'w-8 bg-blue-400' : 'w-2.5 bg-border hover:bg-surface-hover'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={index === total - 1}
            className="inline-flex items-center gap-2 rounded-lg btn-gradient px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Print-only stack: every slide on its own landscape page */}
      <div className="deck-print" aria-hidden>
        {slides.map((s, i) => (
          <section key={s.id} className="print-slide">
            <div className="print-slide-inner">
              <div className="print-slide-header">
                <span className="print-eyebrow">{s.eyebrow}</span>
                <span className="print-pageno">
                  {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
              <h2 className="print-title">{s.title}</h2>
              <div className="print-body">{s.body}</div>
              <div className="print-footer">
                <span>Checkit · GTM Tracker</span>
                <span>Confidential — internal use only</span>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

const PRINT_CSS = `
      @media print {
        @page {
          size: landscape;
          margin: 0;
        }
        html,
        body {
          background: #0b1220 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .deck-screen,
        .deck-controls {
          display: none !important;
        }
        .deck-print {
          display: block !important;
        }
        .print-slide {
          page-break-after: always;
          break-after: page;
          width: 100vw;
          height: 100vh;
          background:
            radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.18), transparent 55%),
            radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.12), transparent 55%),
            linear-gradient(135deg, #111827 0%, #0b1220 100%);
          color: #f3f4f6;
          padding: 48px 64px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .print-slide:last-child {
          page-break-after: auto;
        }
        .print-slide-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .print-slide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .print-eyebrow {
          color: #93c5fd;
        }
        .print-pageno {
          color: #9ca3af;
        }
        .print-title {
          margin-top: 4px;
          font-size: 40px;
          font-weight: 800;
          line-height: 1.1;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .print-body {
          margin-top: 20px;
          flex: 1;
          overflow: hidden;
        }
        .print-footer {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #9ca3af;
        }
      }
      @media screen {
        .deck-print {
          display: none;
        }
      }
`;

function PrintStyles() {
  return <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />;
}
