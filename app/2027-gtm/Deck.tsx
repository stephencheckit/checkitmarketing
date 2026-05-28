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
  Sparkles,
  Flag,
  MapPin,
  LineChart,
  Briefcase,
  Calculator,
  Linkedin,
  Workflow,
  RefreshCw,
  Search,
  Bot,
  Mail,
  PenTool,
  Network,
  MousePointerClick,
} from 'lucide-react';

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
    eyebrow: 'Checkit — Internal Strategy',
    title: 'Pipeline Generation Plan',
    body: (
      <div className="space-y-8">
        <p className="max-w-2xl text-lg text-muted">
          Checkit GTM review — where we are, where we&apos;re going, and what it will take to
          close the gap to FY28 coverage.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="OKR" value="£1M / mo" sub="New PG target this FY" />
          <StatCard label="YTD Run Rate" value="£400K / mo" sub="£1.6M added so far" tone="warning" />
          <StatCard label="Gap to Close" value="~£10.4M" sub="To reach £12M by year end" tone="error" />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <Sparkles className="h-4 w-4 text-blue-400" />
          Part data, part discussion.
        </div>
      </div>
    ),
  },
  {
    id: 'context',
    eyebrow: 'Slide 2',
    title: 'Context & Meeting Goal',
    body: (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionCard title="The Headline Number" icon={Target}>
          <ul className="space-y-3">
            <Bullet>Checkit OKR: <strong>£1M of new PG per month</strong> in this FY (~£12M total).</Bullet>
            <Bullet>YTD: ~£1.6M added (~£400K / mo) — short of pace.</Bullet>
            <Bullet>Gap aligns with FY28 pipeline coverage need.</Bullet>
          </ul>
        </SectionCard>
        <SectionCard title="Meeting Format" icon={Users}>
          <ul className="space-y-3">
            <Bullet>Pipeline value snapshot (FY27, FY28+) and current state.</Bullet>
            <Bullet>PG plan for rest of year + aligned US / RoW campaign for FM.</Bullet>
            <Bullet>Open discussion: additional resourcing (pre-FSP / post-FSP).</Bullet>
          </ul>
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'posture',
    eyebrow: 'Slide 3',
    title: 'Current Go-To-Market Posture',
    body: (
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent p-6">
          <div className="text-xs uppercase tracking-widest text-blue-300">Operating principle</div>
          <div className="mt-2 text-3xl font-bold text-foreground">&quot;Inch wide, mile deep.&quot;</div>
          <p className="mt-2 text-muted">
            Single-vertical focus per resource. Lean by design — profitability mandate has been met.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="UK / Rest of World" icon={Globe}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>April + Tom → Forecourts</li>
              <li>Megan → NHS / Pharmacy (Cam+ medical)</li>
            </ul>
          </SectionCard>
          <SectionCard title="US" icon={Flag}>
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Jordan → Facilities, OVG, customer expansion</li>
              <li>Jennifer → Cam+ medical, account management</li>
            </ul>
          </SectionCard>
        </div>
        <SectionCard title="Utility" icon={Briefcase}>
          <p className="text-sm text-foreground/90">
            Stephen → utility player across motions, with a medical lean.
          </p>
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'forecourts',
    eyebrow: 'Slide 4 — Plan, Step 1',
    title: 'Finish the Forecourts Pass (UK)',
    body: (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="md:col-span-3 space-y-4">
          <ul className="space-y-3">
            <Bullet>~50–60 named accounts; 7-figure enterprise upside.</Bullet>
            <Bullet>
              Run a <strong>second, heavier cycle</strong> with Red / Amber / Green status using
              what we&apos;ve learned.
            </Bullet>
            <Bullet>
              Layer new tactics — e.g. Phantom Buster account-based LinkedIn outreach (already
              piloted).
            </Bullet>
            <Bullet icon={AlertTriangle}>
              Exit criteria: fewer than ~10 viable accounts remaining → move on.
            </Bullet>
          </ul>
        </div>
        <div className="md:col-span-2 space-y-3">
          <StatCard label="Accounts" value="50–60" sub="Named target list" />
          <StatCard label="Per-account upside" value="7-figure" sub="Enterprise multi-site" tone="success" />
        </div>
      </div>
    ),
  },
  {
    id: 'alignment',
    eyebrow: 'Slide 5 — Plan, Step 2',
    title: 'Transatlantic Market Alignment (H2)',
    body: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SectionCard title="Today — Misaligned" icon={MapPin}>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted">US</div>
                <div className="text-foreground/90">
                  Senior Living → Facilities · Cam+
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted">UK / RoW</div>
                <div className="text-foreground/90">
                  Food Retail · Food-to-Go · Forecourts · Cam+
                </div>
              </div>
            </div>
          </SectionCard>
          <SectionCard title="Target H2 — Aligned" icon={TrendingUp}>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-300">Shared vertical #1</div>
                <div className="text-foreground/90">
                  <strong>Facilities Management</strong> — ISS-type accounts spanning hospitals,
                  defense, grocery.
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-300">Shared vertical #2</div>
                <div className="text-foreground/90">
                  <strong>Cam+ Medical</strong> — NHS, plasma and broader medical account base.
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-200">
          Outcome: shared narratives, global case studies, simpler marketing motion across both
          regions.
        </div>
      </div>
    ),
  },
  {
    id: 'campaign',
    eyebrow: 'Slide 6 — Plan, Step 3',
    title: 'Aligned US / RoW Campaign for FM',
    body: (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionCard title="Co-Built Motion" icon={Globe}>
          <ul className="space-y-3">
            <Bullet>Shared messaging and positioning across regions.</Bullet>
            <Bullet>Joint asset library — case studies, decks, sequences.</Bullet>
            <Bullet>Coordinated target account list (US + UK FM).</Bullet>
          </ul>
        </SectionCard>
        <SectionCard title="Story Engine" icon={Sparkles}>
          <ul className="space-y-3">
            <Bullet>OVG playbook reused for FM enterprise sales.</Bullet>
            <Bullet>Demand-gen aligned to single vertical for clarity.</Bullet>
          </ul>
        </SectionCard>
      </div>
    ),
  },
  {
    id: 'enablement',
    eyebrow: 'Slide 7 — In Flight',
    title: 'Enablement & Tactics Already Underway',
    body: (
      <div className="space-y-6">
        <p className="max-w-3xl text-base text-muted">
          Concrete things shipped or in flight to support the reps — not theory, already in use.
        </p>

        {/* ROI Calculator showcase */}
        <SectionCard title="ROI Calculator — Live" icon={Calculator}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <ul className="space-y-2 text-sm md:col-span-2">
              <Bullet>Supporting Megan in active conversations.</Bullet>
              <Bullet>Now also being used by the Forecourts team.</Bullet>
              <Bullet>Reusable across verticals as we expand into FM.</Bullet>
            </ul>
            <div className="grid grid-cols-2 gap-3 md:col-span-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/decks/2027-gtm/roi-breakdown.png"
                alt="ROI calculator — Pounds and Pence hero"
                className="h-full w-full rounded-lg border border-border object-cover"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/decks/2027-gtm/roi-hero.png"
                alt="ROI calculator — composite business case"
                className="h-full w-full rounded-lg border border-border object-cover"
              />
            </div>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SectionCard title="Phantom Buster — Social Outreach" icon={Linkedin}>
            <ul className="space-y-2 text-sm">
              <Bullet>Account-based LinkedIn outreach live with the UK team.</Bullet>
              <Bullet>Auto-connect + soft intros to target-account execs.</Bullet>
            </ul>
          </SectionCard>
          <SectionCard title="Workflows — Tom & April" icon={Workflow}>
            <ul className="space-y-2 text-sm">
              <Bullet>Custom Phantom Buster sequences built out.</Bullet>
              <Bullet>Repeatable as we cycle through Forecourts again.</Bullet>
            </ul>
          </SectionCard>
          <SectionCard title="Smarter Re-engagement" icon={RefreshCw}>
            <ul className="space-y-2 text-sm">
              <Bullet>New process for re-warming inherited pipeline.</Bullet>
              <Bullet>Pairs with the Jordan list and hygiene work.</Bullet>
            </ul>
          </SectionCard>
        </div>
      </div>
    ),
  },
  {
    id: 'channels',
    eyebrow: 'Slide 8 — Demand Engine',
    title: 'Multi-Channel Orchestration',
    body: (
      <div className="space-y-6">
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-transparent p-5">
          <div className="flex items-start gap-3">
            <Network className="mt-1 h-5 w-5 text-blue-300" />
            <p className="text-base text-foreground/90">
              One coordinated motion across channels — paid, organic, social, outbound and email —
              feeding the same target account list and narrative.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <SectionCard title="LinkedIn" icon={Linkedin}>
            <p className="text-sm text-foreground/80">
              Account-based outreach + exec visibility via Phantom Buster.
            </p>
          </SectionCard>
          <SectionCard title="Google Ads" icon={MousePointerClick}>
            <p className="text-sm text-foreground/80">
              Intent capture on high-value vertical and competitor terms.
            </p>
          </SectionCard>
          <SectionCard title="AI Search" icon={Bot}>
            <p className="text-sm text-foreground/80">
              Optimising for ChatGPT / Perplexity answers — visibility where buyers now research.
            </p>
          </SectionCard>
          <SectionCard title="SEO" icon={Search}>
            <p className="text-sm text-foreground/80">
              Vertical landing pages + content depth for organic discovery.
            </p>
          </SectionCard>
          <SectionCard title="Outbound" icon={Workflow}>
            <p className="text-sm text-foreground/80">
              Rep-led sequences supported by automated enrichment and triggers.
            </p>
          </SectionCard>
          <SectionCard title="Marketing Email" icon={Mail}>
            <p className="text-sm text-foreground/80">
              Nurture, re-engagement and campaign drops to segmented audiences.
            </p>
          </SectionCard>
          <SectionCard title="Content Generation" icon={PenTool}>
            <p className="text-sm text-foreground/80">
              AI-assisted production scaled to vertical narratives and case studies.
            </p>
          </SectionCard>
          <SectionCard title="Orchestration" icon={Network}>
            <p className="text-sm text-foreground/80">
              Shared target list, shared messaging, sequenced touches across channels.
            </p>
          </SectionCard>
        </div>
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-200">
          The point isn&apos;t more channels — it&apos;s the <strong>same account</strong> seeing a
          coherent story across <strong>multiple channels</strong> at the right moments.
        </div>
      </div>
    ),
  },
  {
    id: 'decisions',
    eyebrow: 'Slide 9',
    title: 'Decisions / Asks',
    body: (
      <ul className="space-y-4">
        <Bullet>
          Confirm: continue inch-wide / mile-deep with current resources through summer.
        </Bullet>
        <Bullet>Endorse: pivot toward FM as the shared US/UK vertical in H2.</Bullet>
        <Bullet>
          Direction: focus on marketing & demand-gen vs. continuing to carry inherited pipeline
          (and commission structure if the latter).
        </Bullet>
        <Bullet icon={HandCoins}>
          Appetite for incremental resourcing investment vs. holding the profitability line.
        </Bullet>
      </ul>
    ),
  },
  {
    id: 'headline',
    eyebrow: 'Slide 10 — Close',
    title: 'Headline Message',
    body: (
      <div className="space-y-8">
        <blockquote className="rounded-2xl border-l-4 border-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent p-6 text-xl leading-relaxed text-foreground">
          With current resources we can sustain <strong>~£400K/month</strong>. To close the gap to
          <strong> £1M/month</strong> and the <strong>£12M target</strong>, we need either
          <em> (a)</em> a sharper, aligned single-vertical bet across both regions,
          <em> (b)</em> incremental resourcing, or — most likely — <strong>both</strong>.
        </blockquote>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Status Quo" value="£4.8M" sub="If we hold at £400K/mo for 12mo" tone="warning" />
          <StatCard label="Target" value="£12M" sub="Checkit OKR for the FY" tone="accent" />
          <StatCard label="Required Lift" value="2.5×" sub="To bridge the gap" tone="success" />
        </div>
      </div>
    ),
  },
];

export default function CheckitGtmDeck() {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = slides.length;

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

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
  }, [next, prev, total]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const slide = slides[index];
  const progress = useMemo(() => ((index + 1) / total) * 100, [index, total]);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <LineChart className="h-7 w-7 text-blue-400" />
            Checkit 2027 GTM
          </h1>
          <p className="text-sm text-muted mt-1">Internal discussion deck · Checkit GTM</p>
        </div>
        <button
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-surface-hover"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          {isFullscreen ? 'Exit' : 'Present'}
        </button>
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

      {/* Controls */}
      <div className="flex items-center justify-between">
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

      <p className="text-center text-xs text-muted">
        Tip: use ← / → keys to navigate, F to present, Home / End to jump.
      </p>
    </div>
  );
}
