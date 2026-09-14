'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import HeroVideo from '@/components/HeroVideo';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Menu,
  X,
  Thermometer,
  Radio,
  Network,
  LayoutDashboard,
  ShieldCheck,
  Wifi,
  Layers,
  ServerOff,
  ClipboardCheck,
  Wrench,
  Headset,
  CalendarCheck,
  Eye,
  BellRing,
  FileCheck2,
  Building2,
  CheckCircle2,
  Users,
} from 'lucide-react';

const TEAL = '#00cccc';
// Teal is too light for text on white; use the brand's deep teal there.
const TEAL_TEXT = 'text-[#007d7d]';

type Slide = {
  id: string;
  nav: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: 'cover' | 'divider' | 'content';
  bg?: string;
  appendix?: boolean;
  body?: React.ReactNode;
};

/* ---------- primitives ---------- */

function Card({
  children,
  className = '',
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        accent ? 'border-[#00cccc]/50 bg-[#00cccc]/10' : 'border-[#020233]/10 bg-white shadow-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function IconCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`rounded-lg bg-[#00cccc]/15 p-2 ${TEAL_TEXT}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children && <div className="mt-3 text-base leading-relaxed text-[#020233]/70">{children}</div>}
    </Card>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#020233]/10 bg-white p-6 shadow-sm">
      <div
        className={`whitespace-nowrap font-bold tracking-tight ${TEAL_TEXT} ${
          value.length > 6 ? 'text-2xl xl:text-3xl' : 'text-3xl xl:text-4xl'
        }`}
      >
        {value}
      </div>
      <div className="mt-2 text-base text-[#020233]/70">{label}</div>
    </div>
  );
}

function Bullet({ children, icon: Icon = CheckCircle2 }: { children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <li className="flex items-start gap-3">
      <Icon className={`mt-1 h-5 w-5 flex-shrink-0 ${TEAL_TEXT}`} />
      <span className="text-lg leading-relaxed text-[#020233]/85">{children}</span>
    </li>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#020233]/10 py-2 last:border-0">
      <div className="text-xs uppercase tracking-wider text-[#020233]/55">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

function SpecCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${TEAL_TEXT}`} />
        <h3 className={`text-sm font-semibold uppercase tracking-[0.18em] ${TEAL_TEXT}`}>{title}</h3>
      </div>
      {children}
    </Card>
  );
}

type MonitorReading = {
  asset: string;
  value: string;
  state: 'Normal' | 'Warning';
  points: number[];
};

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 200;
  const h = 40;
  const min = Math.min(...points);
  const max = Math.max(...points);
  // Floor the plotted range so a ±0.3°C wobble reads as flat rather than being stretched to full height.
  const span = Math.max(max - min, 3);
  const base = min - (span - (max - min)) / 2;
  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * w,
    h - 4 - ((p - base) / span) * (h - 8),
  ]);
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-10 w-full" aria-hidden="true">
      <path d={area} fill={color} fillOpacity={0.12} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MonitorStrip({ readings }: { readings: MonitorReading[] }) {
  return (
    <div className="rounded-2xl border border-[#020233]/10 bg-[#020233]/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#020233]/55">
        <span>Live view · illustrative</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#007d7d]" />
          Updated 1 min ago
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {readings.map((r) => {
          const warn = r.state === 'Warning';
          const color = warn ? '#d98c00' : '#007d7d';
          return (
            <div key={r.asset} className="rounded-xl border border-[#020233]/10 bg-white p-4 shadow-sm">
              <div className="text-base text-[#020233]/70">{r.asset}</div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-3xl font-bold tracking-tight">{r.value}</div>
                <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color }}>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                  {r.state}
                </div>
              </div>
              <div className="mt-2">
                <Sparkline points={r.points} color={color} />
              </div>
              <div className="mt-1 flex justify-between text-xs text-[#020233]/45">
                <span>24h ago</span>
                <span>12h</span>
                <span>Now</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#00cccc] text-xl font-bold text-[#020233]">
        {n}
      </div>
      <div className="mt-3 text-lg font-semibold">{title}</div>
      <div className="mt-1 text-base text-[#020233]/65">{sub}</div>
    </div>
  );
}

/* ---------- slides ---------- */

const slides: Slide[] = [
  {
    id: 'cover',
    nav: 'Cover',
    variant: 'cover',
    bg: '/hero-globe-poster.jpg',
    title: 'Checkit Solution Overview',
    subtitle: 'CAM+ · Continuous Automated Monitoring for BioIVT · September 3, 2026',
  },
  {
    id: 'agenda',
    nav: 'Agenda',
    eyebrow: 'Today',
    title: "Today's agenda",
    body: (
      <ol className="grid max-w-3xl gap-4">
        {[
          ['Introduction & the Checkit team', 'Who you will be working with'],
          ['CAM+ solution overview', 'Sensor to enterprise view, delivery, and commercial model'],
          ['CAM+ solution demonstration', 'Live walkthrough of alarms, audit trail, and user management'],
        ].map(([t, s], i) => (
          <li key={t} className="flex items-center gap-6 rounded-2xl border border-[#020233]/10 bg-white p-6 shadow-sm">
            <span className={`text-5xl font-bold ${TEAL_TEXT}`}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="text-2xl font-semibold">{t}</div>
              <div className="mt-1 text-base text-[#020233]/65">{s}</div>
            </div>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: 'priorities',
    nav: 'What matters to BioIVT',
    eyebrow: 'Discovery',
    title: 'What we see as important to BioIVT',
    subtitle: 'Anything to add?',
    body: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <IconCard icon={Layers} title="Enterprise standardization" />
        <IconCard icon={Thermometer} title="Reliable continuous monitoring" />
        <IconCard icon={FileCheck2} title="Audit readiness" />
        <IconCard icon={ShieldCheck} title="Robust, resilient, user-friendly" />
        <IconCard icon={Headset} title="Trusted partner with operational continuity" />
        <IconCard icon={CalendarCheck} title="Predictable costs over time" />
      </div>
    ),
  },
  {
    id: 'trust',
    nav: 'Trusted partner',
    eyebrow: 'Introduction',
    title: 'A proven partner in regulated monitoring',
    body: (
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="grid grid-cols-2 gap-4 lg:col-span-3 md:grid-cols-3">
          <Stat value="50+" label="Years experience" />
          <Stat value="24,000+" label="Sensors monitored" />
          <Stat value="500+" label="US installations" />
          <Stat value="In-house" label="Certified field engineers" />
          <Stat value="On-site" label="Annual calibration" />
          <Stat value="24×7×365" label="Global support" />
        </div>
        <div className="lg:col-span-2">
          <div className={`text-sm uppercase tracking-[0.2em] ${TEAL_TEXT}`}>Trusted by</div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { src: '/decks/bioivt/grifols.svg', alt: 'Grifols' },
              { src: '/decks/bioivt/octapharma.svg', alt: 'Octapharma' },
              { src: '/decks/bioivt/kedrion.png', alt: 'Kedrion Biopharma' },
              { src: '/decks/bioivt/quest.png', alt: 'Quest Diagnostics' },
              { src: '/decks/bioivt/globus-medical.png', alt: 'Globus Medical' },
              { src: '/decks/bioivt/namsa.png', alt: 'NAMSA' },
              { src: '/logos/nhs.svg', alt: 'NHS' },
            ].map((l) => (
              <div key={l.alt} className="flex h-16 items-center justify-center rounded-xl border border-[#020233]/10 bg-white px-5 py-3 shadow-sm">
                <Image src={l.src} alt={l.alt} width={240} height={64} className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {[
              { src: '/decks/bioivt/iso-9001.png', alt: 'ISO 9001' },
              { src: '/decks/bioivt/iso-17025.png', alt: 'ISO 17025' },
              { src: '/decks/bioivt/cert-iso-27001.png', alt: 'ISO 27001 certified' },
            ].map((c) => (
              <div key={c.alt} className="flex h-20 w-20 items-center justify-center rounded-full border border-[#020233]/10 bg-white p-2.5 shadow-sm">
                <Image src={c.src} alt={c.alt} width={120} height={120} className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'solution-divider',
    nav: 'Solution overview',
    variant: 'divider',
    bg: '/bg-abstract-how.jpg',
    title: 'Solution overview',
    subtitle: 'CAM+ · Resilient from sensor to enterprise view',
  },
  {
    id: 'cam-plus',
    nav: 'Sensor to enterprise view',
    eyebrow: 'CAM+ solution',
    title: 'Resilient from sensor to enterprise view',
    subtitle: 'A simple path from protected asset to documented action.',
    body: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { icon: Thermometer, t: 'Monitored asset', s: 'Temperature · humidity · dry contact · door · CO₂, O₂, LN₂' },
            { icon: Radio, t: 'Wireless sensor', s: 'Accurate readings · low-maintenance · ±0.2°C tolerance' },
            { icon: Network, t: 'Dedicated mesh', s: "Self-healing · independent of BioIVT's corporate network" },
            { icon: LayoutDashboard, t: 'CAM+ platform', s: 'Dashboards · reports · alarms · audit trail · role-based access' },
          ].map((c, i) => (
            <div key={c.t} className="relative">
              <IconCard icon={c.icon} title={c.t}>
                {c.s}
              </IconCard>
              {i < 3 && (
                <ChevronRight className={`absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 md:block ${TEAL_TEXT}`} />
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <IconCard icon={ServerOff} title="Less IT dependency">
            Sensors do not traverse BioIVT&apos;s corporate network.
          </IconCard>
          <IconCard icon={Wifi} title="Designed for continuity">
            Dedicated architecture avoids network congestion and reliability issues.
          </IconCard>
          <IconCard icon={Building2} title="Built for scale">
            Centralized monitoring supports multiple locations.
          </IconCard>
          <IconCard icon={ShieldCheck} title="Compliance assured">
            21 CFR Part 11 e-signatures, tamper-evident audit trail.
          </IconCard>
        </div>
      </div>
    ),
  },
  {
    id: 'technology',
    nav: 'Technology reliability',
    eyebrow: 'Solution',
    title: 'Technology reliability',
    subtitle: 'A complete end-to-end solution.',
    body: (
      <div className="grid items-center gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <p className="text-xl leading-relaxed text-[#020233]/80">
            Checkit&apos;s combination of smart sensors and platform technology lets customers eliminate manual
            tracking and drive better compliance.
          </p>
          <ul className="space-y-3">
            <Bullet>Wireless transmitters for −80°C freezers, fridges, and ambient areas</Bullet>
            <Bullet>WARP gateway with local display, buffering, and alarm relay</Bullet>
            <Bullet>Signal repeaters extend coverage across large or complex sites</Bullet>
          </ul>
        </div>
        <div className="lg:col-span-3">
          <div className="flex justify-center overflow-hidden rounded-2xl border border-[#020233]/10 bg-[#dbe8ee] shadow-sm">
            <Image
              src="/decks/bioivt/warp-diagram.png"
              alt="WARP gateway, temperature transmitters and signal repeater"
              width={1600}
              height={1000}
              className="h-auto max-h-[56vh] w-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'demo',
    nav: 'Solution demonstration',
    eyebrow: 'Live',
    title: 'Solution demonstration',
    subtitle: 'Alarms, audit trail, reporting, and user management — as BioIVT staff would use them.',
    body: (
      <div className="overflow-hidden rounded-2xl border border-[#020233]/10 shadow-md">
        <Image
          src="/checkitv6.png"
          alt="Checkit platform on laptop and mobile"
          width={1600}
          height={1200}
          className="h-auto max-h-[50vh] w-full object-cover object-top"
        />
      </div>
    ),
  },
  {
    id: 'implementation',
    nav: 'Implementation',
    eyebrow: 'Delivery',
    title: 'Implementation without unnecessary delivery risk',
    subtitle: 'Deployment is an owned, in-house process — not a handoff between vendors.',
    body: (
      <div className="space-y-10">
        <div className="relative grid grid-cols-5 gap-4">
          <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-[#020233]/15 md:block" />
          <Step n={1} title="Plan" sub="Confirm scope and schedule" />
          <Step n={2} title="Install" sub="Checkit-trained engineers deploy" />
          <Step n={3} title="Validate" sub="Support regulated implementation" />
          <Step n={4} title="Calibrate" sub="Annual on-site calibration" />
          <Step n={5} title="Support" sub="24×7×365 + customer success" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <IconCard icon={ClipboardCheck} title="Delivery confidence">
            No inventory, resourcing, or platform risks to delivery are identified in the proposal.
          </IconCard>
          <IconCard icon={Wrench} title="Experienced team">
            U.S.-based engineers bring a combined 50 years of installation experience.
          </IconCard>
          <IconCard icon={Headset} title="Long-term partnership">
            Dedicated customer success complements technical support and implementation.
          </IconCard>
        </div>
      </div>
    ),
  },
  {
    id: 'commercial',
    nav: 'Predictable cost',
    eyebrow: 'Commercial model',
    title: 'Predictable cost, transferred hardware risk',
    subtitle: 'A full subscription approach designed to reduce capital and lifecycle uncertainty.',
    body: (
      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <div className={`text-sm uppercase tracking-[0.2em] ${TEAL_TEXT}`}>Subscription includes</div>
          <ul className="mt-4 space-y-3">
            {[
              'Hardware',
              'Continuous monitoring & alarming',
              'Warranty',
              'On-site calibration',
              'Maintenance',
              '24/7 support',
              'Redundant data storage',
            ].map((i) => (
              <Bullet key={i}>{i}</Bullet>
            ))}
          </ul>
        </Card>
        <div className="space-y-6 lg:col-span-3">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 text-center">
            <Card>
              <div className="text-xl font-semibold">No upfront capital investment</div>
            </Card>
            <span className={`text-4xl font-bold ${TEAL_TEXT}`}>+</span>
            <Card>
              <div className="text-xl font-semibold">Hardware failure risk sits with Checkit</div>
            </Card>
            <span className={`text-4xl font-bold ${TEAL_TEXT}`}>=</span>
            <Card accent>
              <div className={`text-xl font-semibold ${TEAL_TEXT}`}>Predictable future costs</div>
            </Card>
          </div>
          <Card accent>
            <div className={`text-sm font-semibold uppercase tracking-wider ${TEAL_TEXT}`}>Business value</div>
            <p className="mt-2 text-lg leading-relaxed text-[#020233]/85">
              The subscription model accelerates time to value, maximizing ROI and minimizing risk while providing
              transparency and certainty of future costs.
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 'roadmap',
    nav: 'Roadmap',
    eyebrow: 'Ongoing innovation',
    title: 'Roadmap',
    subtitle: 'Enhanced software capabilities that work seamlessly with the installed sensor base.',
    body: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <IconCard icon={LayoutDashboard} title="A more powerful platform">
          <ul className="list-disc space-y-1 pl-4">
            <li>Refreshed UI — better mobile usability, intuitive</li>
            <li>Service architecture — open APIs, QMS connectors, faster innovation</li>
          </ul>
        </IconCard>
        <IconCard icon={Layers} title="Expanded scope">
          <ul className="list-disc space-y-1 pl-4">
            <li>Task management — digitize processes for excursions and frontline quality</li>
            <li>Asset Intelligence — predictive maintenance</li>
          </ul>
        </IconCard>
        <IconCard icon={Wrench} title="More efficient service">
          <ul className="list-disc space-y-1 pl-4">
            <li>Calibration management — improved access to calibration data and scheduling</li>
            <li>Qualification processes — OQ automation and simplification</li>
          </ul>
        </IconCard>
        <IconCard icon={Radio} title="Next generation sensors">
          <ul className="list-disc space-y-1 pl-4">
            <li>Adaptive signal processing — smarter sensing</li>
            <li>Simpler installation — enables self-service</li>
          </ul>
        </IconCard>
      </div>
    ),
  },
  {
    id: 'asset-intelligence',
    nav: 'Asset Intelligence',
    eyebrow: 'Preview',
    title: 'Checkit Asset Intelligence',
    subtitle: 'Performance, assurance, and predictive insights into freezers, fridges, and other critical assets.',
    body: (
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-[#020233]/10 shadow-md">
            <Image
              src="/decks/bioivt/asset-intelligence.jpg"
              alt="Asset Intelligence dashboard on a laptop showing savings opportunity by location and by asset"
              width={1600}
              height={1200}
              className="h-auto max-h-[52vh] w-full object-cover object-center"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:col-span-2">
          <p className="text-lg leading-relaxed text-[#020233]/80">
            Checkit sensors are already capturing real-time information. Asset Intelligence expands the value of that
            data.
          </p>
          <IconCard icon={Network} title="Automate">
            Turn under-exposed data points into actionable operational insights by sending data to a single source.
          </IconCard>
          <IconCard icon={Eye} title="Analyze">
            Predictive insights and actionable plans with visibility into system reliability and availability.
          </IconCard>
          <IconCard icon={CheckCircle2} title="Optimize">
            Prioritize maintenance and replacement before an excursion, not after.
          </IconCard>
        </div>
      </div>
    ),
  },
  {
    id: 'why-checkit',
    nav: 'Why Checkit',
    eyebrow: 'Summary',
    title: 'Why Checkit for BioIVT',
    subtitle: 'A single partner across technology, implementation, calibration, support, and customer success.',
    body: (
      <div className="grid gap-8 lg:grid-cols-5">
        <ul className="space-y-3 lg:col-span-3">
          <Bullet>Long-standing experience with major plasma and laboratory organizations in the United States</Bullet>
          <Bullet>In-house engineers own deployment from start to finish, including annual on-site calibration</Bullet>
          <Bullet>Robust wireless sensors with low failure rates and simple replacement by laboratory staff</Bullet>
          <Bullet>Nationwide engineering coverage and 24×7×365 support</Bullet>
          <Bullet>Specialization in complex, multi-site organizations</Bullet>
        </ul>
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          {[
            { icon: Eye, k: 'Monitor', v: 'Accurate, continuous visibility' },
            { icon: BellRing, k: 'Respond', v: '24/7 alarm management' },
            { icon: FileCheck2, k: 'Prove', v: 'Audit-ready records' },
            { icon: Building2, k: 'Scale', v: 'Enterprise-wide oversight' },
          ].map((c) => (
            <Card key={c.k} accent>
              <c.icon className={`h-6 w-6 ${TEAL_TEXT}`} />
              <div className={`mt-2 text-sm uppercase tracking-[0.2em] ${TEAL_TEXT}`}>{c.k}</div>
              <div className="mt-1 text-base font-semibold">{c.v}</div>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'questions',
    nav: 'Questions',
    variant: 'divider',
    bg: '/bg-abstract-value.jpg',
    title: 'Additional questions?',
    subtitle: 'Thank you.',
  },

  /* ---------- appendix: RFP detail ---------- */
  {
    id: 'appendix',
    nav: 'Appendix',
    appendix: true,
    variant: 'divider',
    bg: '/bg-abstract-shift.jpg',
    title: 'Appendix',
    subtitle: 'Supporting detail from the RFP response',
  },
  {
    id: 'resilience',
    nav: 'Resilience & continuity',
    appendix: true,
    eyebrow: 'Appendix · Business continuity',
    title: 'No monitoring gaps — by design',
    subtitle: 'Every layer keeps recording and alarming through power, network, and cloud interruptions.',
    body: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SpecCard icon={Radio} title="Sensors">
          <Spec label="Reading interval" value="1 minute" />
          <Spec label="Local buffer (if WARP unreachable)" value="~7 days" />
          <Spec label="Battery life" value="3–4 years" />
          <Spec label="Backfill on reconnect" value="Automatic" />
        </SpecCard>
        <SpecCard icon={Network} title="WARP gateway & repeaters">
          <Spec label="Local data storage" value="Up to 5 years" />
          <Spec label="Battery backup" value="7 hours" />
          <Spec label="Local display & alarm" value="Yes" />
          <Spec label="Uplink" value="Ethernet · VPN · cellular" />
        </SpecCard>
        <SpecCard icon={ShieldCheck} title="Cloud">
          <Spec label="Data centers" value="Dual, geo-separated, ISO 27001" />
          <Spec label="Recovery point (RPO)" value="0 minutes" />
          <Spec label="Recovery time (RTO)" value="15 minutes" />
          <Spec label="Availability target" value="99.9%" />
        </SpecCard>
        <Card accent className="md:col-span-3">
          <p className="text-base leading-relaxed text-[#020233]/85">
            Sensors talk over Checkit&apos;s dedicated T-Mesh™ self-healing mesh — not BioIVT&apos;s corporate Wi-Fi.
            Data routes around obstacles, avoids IT congestion, and keeps working when the facility network doesn&apos;t.
          </p>
        </Card>
      </div>
    ),
  },
  {
    id: 'alarms',
    nav: 'Alarm management',
    appendix: true,
    eyebrow: 'Appendix · Alert management',
    title: 'Configurable alarms, staffed escalation',
    subtitle: 'Every alarm reaches the right person, is acknowledged by name, and is recorded.',
    body: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:col-span-3">
          <Image
            src="/decks/bioivt/alarm-dashboard.jpg"
            alt="Real-time temperature monitoring dashboard with normal and warning states across fridges and freezers"
            width={1600}
            height={431}
            className="h-auto max-h-[38vh] w-full object-cover object-top"
          />
        </div>
        <SpecCard icon={BellRing} title="Thresholds">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>High / low / warning limits per sensor</li>
            <li>Delay timers and pre-alarms to suppress nuisance alarms</li>
            <li>Sensor isolation during defrost or maintenance</li>
            <li>All configuration changes audit-logged</li>
          </ul>
        </SpecCard>
        <SpecCard icon={Headset} title="Escalation & channels">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>Sequential escalation, up to 10 contacts</li>
            <li>Shift- and department-based routing</li>
            <li>Repeats until acknowledged</li>
            <li>Email · SMS · automated voice call (ACH)</li>
            <li>Staffed Alarm Calling Service Centre, 24/7/365</li>
          </ul>
        </SpecCard>
        <SpecCard icon={FileCheck2} title="Acknowledgement & record">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>Time-stamped, user-specific acknowledgement</li>
            <li>Supervisor review and electronic sign-off</li>
            <li>Immutable incident record: occurrence, notifications, contact sequence, actions, resolution</li>
            <li>Real-time system status page and subscriber notifications</li>
          </ul>
        </SpecCard>
      </div>
    ),
  },
  {
    id: 'compliance',
    nav: 'Compliance & data integrity',
    appendix: true,
    eyebrow: 'Appendix · Regulatory',
    title: 'Compliance, data integrity, and security',
    body: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SpecCard icon={FileCheck2} title="21 CFR Part 11 & ALCOA+">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>Immutable, time-stamped audit trails with user attribution</li>
            <li>Electronic signatures; named users with PIN authentication</li>
            <li>Role-based access (admin, standard, read-only, department-level)</li>
            <li>Chain of custody across alarms, reports, and configuration</li>
          </ul>
        </SpecCard>
        <SpecCard icon={ShieldCheck} title="Security & retention">
          <Spec label="At rest" value="AES-256" />
          <Spec label="In transit" value="TLS 1.2 / 1.3" />
          <Spec label="Online retention" value="36 months" />
          <Spec label="Archival" value="Up to 40 years" />
          <Spec label="Backups" value="Daily full · 30-min transactional" />
          <Spec label="Exit" value="Full electronic data export" />
        </SpecCard>
        <SpecCard icon={ClipboardCheck} title="Certifications & validation">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>ISO 27001 · ISO 9001 · ISO 17025 (UKAS)</li>
            <li>SOC 2 Type II report available</li>
            <li>IQ / OQ delivered as standard</li>
            <li>PQ available for critical environments</li>
            <li>Releases under formal change control with advance notice</li>
          </ul>
        </SpecCard>
      </div>
    ),
  },
  {
    id: 'sensors-reporting',
    nav: 'Sensors, calibration & reporting',
    appendix: true,
    eyebrow: 'Appendix · Technical',
    title: 'Sensors, calibration, and reporting',
    body: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SpecCard icon={Thermometer} title="Sensor range">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>Refrigerator / freezer / −80°C probes</li>
            <li>Cryogenic (LN₂) probes</li>
            <li>Ambient temperature and humidity</li>
            <li>Door, differential pressure, CO₂ / O₂ gas</li>
          </ul>
          <div className="mt-3">
            <Spec label="Accuracy — PT1000" value="±0.2°C" />
            <Spec label="Accuracy — cryogenic" value="±0.3°C" />
          </div>
        </SpecCard>
        <SpecCard icon={Wrench} title="Calibration">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>Annual, on-site, in-situ — no monitoring gap</li>
            <li>NIST-traceable via ISO 17025 (UKAS) reference probes</li>
            <li>Battery inspection, firmware review, signal validation</li>
            <li>Certificates uploaded to the portal automatically</li>
            <li>Included in subscription</li>
          </ul>
        </SpecCard>
        <SpecCard icon={LayoutDashboard} title="Reporting & analytics">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>Self-service portal — no vendor tickets for records</li>
            <li>Excel · CSV · PDF export; digital archive</li>
            <li>Up to 8 sensors per comparison graph; min / max / avg / MKT</li>
            <li>Scheduled daily / weekly alarm summaries by email</li>
            <li>Quarterly business reviews: excursions, response times, highest-alerting assets — no fee</li>
          </ul>
        </SpecCard>
      </div>
    ),
  },
  {
    id: 'delivery-support',
    nav: 'Delivery, training & support',
    appendix: true,
    eyebrow: 'Appendix · Implementation',
    title: 'Delivery, training, and lifecycle support',
    body: (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SpecCard icon={ClipboardCheck} title="Implementation method">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>PRINCE2-aligned governance, weekly milestone reporting</li>
            <li>Site survey → network validation → install → IQ → OQ → acceptance → handover</li>
            <li>Dedicated PM, customer success manager, install and OQ engineers</li>
            <li>Phased rollout by site priority (e.g. GMP sites first)</li>
          </ul>
        </SpecCard>
        <SpecCard icon={Users} title="Training">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>Live sessions for end users, admins, and QA</li>
            <li>Help Center, in-app help, videos, quick-start guides</li>
            <li>SCORM 1.2 package for BioIVT&apos;s LMS with completion tracking and auditable records</li>
          </ul>
        </SpecCard>
        <SpecCard icon={Headset} title="Peace of Mind subscription">
          <ul className="space-y-1.5 text-sm text-white/80">
            <li>Preventive maintenance and hardware lifecycle management</li>
            <li>Annual calibration and bi-annual battery replacement</li>
            <li>Software updates and security patches included</li>
            <li>24×7×365 technical support under defined SLAs</li>
            <li>Named customer success manager and QBR cadence</li>
          </ul>
        </SpecCard>
      </div>
    ),
  },
];

const appendixStart = slides.findIndex((s) => s.appendix);

/* ---------- subtle per-slide backdrops ---------- */

const svgUrl = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

const LINE = 'rgba(255,255,255,0.07)';
const NODE = 'rgba(0,204,204,0.35)';
const TEAL_LINE = 'rgba(0,204,204,0.12)';

// Motifs all speak to the same idea: a global, connected network of sensors.
type Backdrop = {
  svg: string;
  size: string; // css background-size
  repeat: boolean;
  position: string;
  fade?: boolean; // soft radial mask so tiled motifs don't fight the content
  glow: string;
};

const nodes = (pts: [number, number][], r = 2.5) =>
  pts.map(([x, y]) => `<circle cx='${x}' cy='${y}' r='${r}' fill='${NODE}'/>`).join('');
const links = (segs: [number, number, number, number][], stroke = LINE) =>
  `<path d='${segs.map(([a, b, c, d]) => `M${a} ${b}L${c} ${d}`).join('')}' fill='none' stroke='${stroke}' stroke-width='1'/>`;

const MESH_PTS: [number, number][] = [
  [30, 40],
  [120, 25],
  [200, 70],
  [70, 130],
  [160, 150],
  [220, 200],
  [40, 210],
  [110, 235],
];
const MESH_LINKS: [number, number, number, number][] = [
  [30, 40, 120, 25],
  [120, 25, 200, 70],
  [30, 40, 70, 130],
  [120, 25, 70, 130],
  [70, 130, 160, 150],
  [200, 70, 160, 150],
  [160, 150, 220, 200],
  [70, 130, 40, 210],
  [40, 210, 110, 235],
  [160, 150, 110, 235],
];

const ROUTE_PTS: [number, number][] = [
  [140, 620],
  [380, 300],
  [620, 460],
  [900, 220],
  [1180, 380],
  [1460, 260],
  [1700, 520],
  [1320, 700],
  [760, 760],
];

const BACKDROPS: Backdrop[] = [
  {
    // sensor mesh: nodes joined by short hops, tiled
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'>${links(MESH_LINKS)}${nodes(MESH_PTS)}</svg>`,
    size: '260px 260px',
    repeat: true,
    position: '0 0',
    fade: true,
    glow: 'radial-gradient(circle at 100% 0%, rgba(0,204,204,0.14), transparent 45%)',
  },
  {
    // globe: meridians and parallels, anchored right
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000' viewBox='0 0 1000 1000'><g fill='none' stroke='${TEAL_LINE}' stroke-width='1'><circle cx='500' cy='500' r='440'/><ellipse cx='500' cy='500' rx='300' ry='440'/><ellipse cx='500' cy='500' rx='150' ry='440'/><line x1='500' y1='60' x2='500' y2='940'/><line x1='60' y1='500' x2='940' y2='500'/><ellipse cx='500' cy='500' rx='440' ry='300'/><ellipse cx='500' cy='500' rx='440' ry='150'/></g>${nodes(
      [
        [500, 60],
        [800, 500],
        [650, 200],
        [350, 800],
        [200, 350],
      ],
      3,
    )}</svg>`,
    size: 'auto 130%',
    repeat: false,
    position: '115% 50%',
    glow: 'radial-gradient(circle at 0% 100%, rgba(0,204,204,0.10), transparent 45%)',
  },
  {
    // signal ripples radiating from a sensor at top-left
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='1400' height='1400' viewBox='0 0 1400 1400'><g fill='none' stroke='${TEAL_LINE}' stroke-width='1'><circle cx='0' cy='0' r='220'/><circle cx='0' cy='0' r='420'/><circle cx='0' cy='0' r='640'/><circle cx='0' cy='0' r='880'/><circle cx='0' cy='0' r='1140'/></g>${nodes(
      [
        [156, 156],
        [297, 297],
        [640, 0],
        [0, 880],
        [806, 806],
        [1140, 0],
      ],
      3,
    )}</svg>`,
    size: 'auto 140%',
    repeat: false,
    position: '0 0',
    glow: 'radial-gradient(circle at 100% 100%, rgba(0,204,204,0.14), transparent 45%)',
  },
  {
    // long-haul routes between distant sites
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='1840' height='1000' viewBox='0 0 1840 1000'><g fill='none' stroke='${LINE}' stroke-width='1'><path d='M140 620Q260 380 380 300'/><path d='M380 300Q500 300 620 460'/><path d='M380 300Q640 120 900 220'/><path d='M620 460Q900 340 1180 380'/><path d='M900 220Q1180 120 1460 260'/><path d='M1180 380Q1440 300 1460 260'/><path d='M1460 260Q1640 340 1700 520'/><path d='M1180 380Q1260 560 1320 700'/><path d='M620 460Q700 640 760 760'/><path d='M760 760Q1040 800 1320 700'/></g>${nodes(ROUTE_PTS, 3)}</svg>`,
    size: '100% auto',
    repeat: false,
    position: '50% 50%',
    fade: true,
    glow: 'radial-gradient(circle at 50% 0%, rgba(0,204,204,0.12), transparent 50%)',
  },
  {
    // triangulated mesh, tiled
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='174'>${links([
      [0, 0, 200, 0],
      [0, 0, 100, 174],
      [200, 0, 100, 174],
      [0, 0, 100, 87],
      [200, 0, 100, 87],
      [100, 87, 100, 174],
    ])}${nodes(
      [
        [0, 0],
        [200, 0],
        [100, 87],
        [100, 174],
      ],
      2,
    )}</svg>`,
    size: '200px 174px',
    repeat: true,
    position: '0 0',
    fade: true,
    glow: 'radial-gradient(circle at 0% 0%, rgba(0,204,204,0.12), transparent 45%)',
  },
  {
    // coverage rings with sensors on each ring, bottom-right
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200' viewBox='0 0 1200 1200'><g fill='none' stroke='${TEAL_LINE}' stroke-width='1'><circle cx='1200' cy='1200' r='260'/><circle cx='1200' cy='1200' r='460'/><circle cx='1200' cy='1200' r='680'/><circle cx='1200' cy='1200' r='920'/></g>${links(
      [
        [1016, 1016, 875, 875],
        [875, 875, 1200, 520],
        [1200, 520, 740, 700],
      ],
      LINE,
    )}${nodes(
      [
        [1016, 1016],
        [875, 875],
        [1200, 520],
        [740, 700],
        [280, 1200],
        [1200, 280],
      ],
      3,
    )}</svg>`,
    size: 'auto 110%',
    repeat: false,
    position: 'right bottom',
    glow: 'radial-gradient(circle at 0% 100%, rgba(0,204,204,0.10), transparent 45%)',
  },
];

function SlideBackdrop({ index }: { index: number }) {
  const b = BACKDROPS[index % BACKDROPS.length];
  const mask = b.fade ? 'radial-gradient(ellipse at center, black 35%, transparent 85%)' : undefined;
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: svgUrl(b.svg),
          backgroundSize: b.size,
          backgroundRepeat: b.repeat ? 'repeat' : 'no-repeat',
          backgroundPosition: b.position,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div className="absolute inset-0" style={{ backgroundImage: b.glow }} />
    </>
  );
}

/* ---------- deck ---------- */

export default function BioIvtDeck() {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const total = slides.length;
  const inAppendix = !!slides[index].appendix;
  const counter = inAppendix
    ? `A${index - appendixStart + 1} / A${total - appendixStart}`
    : `${String(index + 1).padStart(2, '0')} / ${String(appendixStart).padStart(2, '0')}`;

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
      } else if (e.key.toLowerCase() === 'n') {
        setNavOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, total, toggleFullscreen]);

  useEffect(() => {
    const onFsChange = () => {
      const fs = Boolean(document.fullscreenElement);
      setIsFullscreen(fs);
      if (fs) setNavOpen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const slide = slides[index];
  const isFullBleed = slide.variant === 'cover' || slide.variant === 'divider';
  // Cover and dividers stay dark; content slides are light.
  const dark = isFullBleed;
  const chip = dark
    ? 'border-white/15 bg-black/30 text-white/80 hover:bg-white/10'
    : 'border-[#020233]/15 bg-white/80 text-[#020233]/80 hover:bg-white';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020233]">
      {/* Side nav */}
      <aside
        className={`flex-shrink-0 border-r border-white/10 bg-[#01011f] transition-all duration-300 ${
          navOpen ? 'w-72' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex h-full w-72 flex-col">
          <div className="flex items-center justify-between px-5 py-5">
            <Image
              src="/checkit-logo-horizontal-standard-rgb-white.svg"
              alt="Checkit"
              width={120}
              height={28}
              priority
              className="h-7 w-auto"
            />
            <button
              onClick={() => setNavOpen(false)}
              className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Hide navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 pb-3 text-[11px] uppercase tracking-[0.2em] text-white/40">BioIVT · CAM+</div>
          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            {slides.map((s, i) => {
              const active = i === index;
              const firstAppendix = s.appendix && !slides[i - 1]?.appendix;
              const label = s.appendix ? `A${i - appendixStart + 1}` : String(i + 1).padStart(2, '0');
              return (
                <div key={s.id}>
                  {firstAppendix && (
                    <div className="mt-3 mb-1 border-t border-white/10 px-3 pt-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                      Appendix
                    </div>
                  )}
                  <button
                    onClick={() => setIndex(i)}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      active ? 'bg-[#00cccc]/15 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-6 flex-shrink-0 text-xs tabular-nums ${
                        active ? 'text-[#00cccc]' : 'text-white/30'
                      }`}
                    >
                      {label}
                    </span>
                    <span className="truncate">{s.nav}</span>
                  </button>
                </div>
              );
            })}
          </nav>
          <div className="flex h-12 items-center border-t border-white/10 px-5 text-[11px] text-white/40">
            ← / → navigate · F present · N toggle nav
          </div>
        </div>
      </aside>

      {/* Stage */}
      <main className="relative flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {!navOpen && (
              <button
                onClick={() => setNavOpen(true)}
                className={`rounded-lg border p-2 backdrop-blur ${chip}`}
                aria-label="Show navigation"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
            {!navOpen && (
              <Image
                src={dark ? '/checkit-logo-horizontal-standard-rgb-white.svg' : '/decks/bioivt/checkit-logo-navy.svg'}
                alt="Checkit"
                width={110}
                height={26}
                className="h-6 w-auto"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs tabular-nums backdrop-blur ${chip}`}>{counter}</span>
            <button
              onClick={toggleFullscreen}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs backdrop-blur ${chip}`}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              {isFullscreen ? 'Exit' : 'Present'}
            </button>
          </div>
        </div>

        {/* Slide */}
        <section
          key={slide.id}
          className={`relative flex flex-1 flex-col overflow-hidden ${dark ? 'text-white' : 'bg-[#f4f7fb] text-[#020233]'}`}
        >
          {slide.bg && (
            <>
              {slide.variant === 'cover' ? (
                <HeroVideo src="/hero-globe.mp4" poster={slide.bg} />
              ) : (
                <Image src={slide.bg} alt="" fill priority className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-[#020233]/90 via-[#020233]/75 to-[#020233]/60" />
            </>
          )}
          {!slide.bg && <SlideBackdrop index={index} />}

          <div
            className={`relative z-10 flex flex-1 flex-col overflow-y-auto px-8 pb-10 pt-20 md:px-14 lg:px-20 ${
              isFullBleed ? 'items-center justify-center text-center' : 'justify-center'
            }`}
          >
            {slide.variant === 'cover' && (
              <div className="mb-10 rounded-2xl bg-black/40 px-10 py-6 backdrop-blur-sm">
                <Image
                  src="/decks/bioivt/bioivt-logo.png"
                  alt="BioIVT — Elevating Science"
                  width={420}
                  height={160}
                  priority
                  className="h-auto w-[260px] md:w-[380px]"
                />
              </div>
            )}
            {slide.eyebrow && (
              <div className={`mb-3 text-sm uppercase tracking-[0.25em] ${dark ? 'text-[#00cccc]' : TEAL_TEXT}`}>
                {slide.eyebrow}
              </div>
            )}
            <h2
              className={`font-bold leading-[1.05] tracking-tight ${
                isFullBleed ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-4xl md:text-5xl lg:text-6xl'
              }`}
            >
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p
                className={`mt-4 ${
                  isFullBleed ? 'text-lg text-white/70 md:text-2xl' : 'max-w-4xl text-lg text-[#020233]/70 md:text-xl'
                }`}
              >
                {slide.subtitle}
              </p>
            )}
            {slide.body && <div className="mt-10">{slide.body}</div>}
          </div>

          {/* Footer */}
          <div
            className={`relative z-10 flex h-12 items-center justify-between border-t px-8 text-[11px] uppercase tracking-[0.2em] md:px-14 lg:px-20 ${
              dark ? 'border-white/10 text-white/40' : 'border-[#020233]/10 text-[#020233]/45'
            }`}
          >
            <span>Checkit · Temperature monitoring & validation</span>
            <span>Prepared for BioIVT · Confidential</span>
          </div>

          {/* Prev / next */}
          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous slide"
            className={`absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border p-2 backdrop-blur disabled:opacity-0 ${chip}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={index === total - 1}
            aria-label="Next slide"
            className={`absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border p-2 backdrop-blur disabled:opacity-0 ${chip}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Progress */}
          <div className={`absolute inset-x-0 bottom-0 z-20 h-1 ${dark ? 'bg-white/10' : 'bg-[#020233]/10'}`}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${((index + 1) / total) * 100}%`, background: TEAL }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
