'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import DemoRequestButton from '@/components/DemoRequestButton';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Layers,
  Radio,
  Smartphone,
  BarChart3,
  Brain,
  FlaskConical,
  Pill,
  Building2,
  ShoppingCart,
  UtensilsCrossed,
  Coffee,
  Fuel,
  BookOpen,
  Calculator,
  FileText,
  Users,
  Landmark,
  Award,
  Globe2,
  LogIn,
  LifeBuoy,
  Ticket,
  Briefcase,
  Leaf,
  Recycle,
  BadgeCheck,
  Mail,
  Thermometer,
  Snowflake,
  Wind,
  Truck,
  ClipboardCheck,
  Sparkles,
  Bell,
  ShieldCheck,
  Droplets,
  Microscope,
  Factory,
  GraduationCap,
  Hotel,
  Stethoscope,
  Server,
  LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Menu data                                                           */
/* ------------------------------------------------------------------ */

type MenuLink = {
  href?: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  badge?: string;
  external?: boolean;
};

type MenuColumn = {
  heading: string;
  links: MenuLink[];
  /* Segment color-coding: commercial = coral, medical = teal, default = accent blue */
  segment?: 'commercial' | 'medical';
};

const segmentStyles = {
  commercial: {
    heading: 'text-coral',
    tile: 'bg-coral/20 text-coral group-hover:bg-coral/30',
    mobileIcon: 'text-coral',
  },
  medical: {
    heading: 'text-teal',
    tile: 'bg-teal/20 text-teal group-hover:bg-teal/30',
    mobileIcon: 'text-teal',
  },
  default: {
    heading: 'text-white/50',
    tile: 'bg-white/15 text-white group-hover:bg-white/25',
    mobileIcon: 'text-white',
  },
} as const;

type FeaturedCard = {
  href?: string;
  image: string;
  eyebrow: string;
  title: string;
  cta: string;
  /** When true, render as non-clickable (Coming soon) */
  comingSoon?: boolean;
};

type MegaMenuDef = {
  id: string;
  label: string;
  columns: MenuColumn[];
  featured?: FeaturedCard;
  statStrip?: string[];
};

const megaMenus: MegaMenuDef[] = [
  {
    id: 'products',
    label: 'Products',
    columns: [
      {
        heading: 'Platform',
        links: [
          {
            href: '/platform',
            label: 'Platform Overview',
            description: 'One connected system: digital capture, alerts, and reporting',
            icon: Layers,
            badge: 'Soon',
          },
          {
            href: '/platform#platform',
            label: 'Digital Capture & Workflows',
            description: 'Checklists, schedules, and evidence captured digitally',
            icon: ClipboardCheck,
            badge: 'Soon',
          },
          {
            href: '/platform#platform',
            label: 'Notifications & Alerts',
            description: 'Right person, right channel, before it becomes an incident',
            icon: Bell,
            badge: 'Soon',
          },
          {
            href: '/platform/reporting',
            label: 'Reporting & Operational Insight',
            description: 'Dashboards, audit trails, and live operational data',
            icon: BarChart3,
            badge: 'Soon',
          },
          {
            href: '/platform#asset-intelligence',
            label: 'Asset Intelligence',
            description: 'Predict equipment failures before they cost you',
            icon: Brain,
            badge: 'Soon',
          },
        ],
      },
      {
        heading: 'Sensors',
        links: [
          {
            href: '/platform#sensors',
            label: 'Sensor Range Overview',
            description: 'If you need to measure it, we can automate it',
            icon: Radio,
            badge: 'Soon',
          },
          {
            href: '/sensors/commercial',
            label: 'Commercial Monitoring Range',
            description: 'Fridges, freezers, hot-hold, doors, humidity, probes',
            icon: Thermometer,
            badge: 'Soon',
          },
          {
            href: '/sensors/medical-lab',
            label: 'Medical & Laboratory Range',
            description: 'Cryogenic, incubators, O2/CO2, differential pressure, mapping',
            icon: Microscope,
            badge: 'Soon',
          },
          {
            href: '/sensors/resilience',
            label: 'Hubs, WARPs & TTMUs',
            description: 'Resilience hardware that survives power loss',
            icon: Server,
            badge: 'Soon',
          },
        ],
      },
      {
        heading: 'Mobile apps',
        links: [
          {
            href: '/platform#apps',
            label: 'Checkit App Overview',
            description: 'Guided digital checklists for frontline teams',
            icon: Smartphone,
            badge: 'Soon',
          },
          {
            href: 'https://apps.apple.com/us/app/checkit-cwm/id6463000375',
            label: 'iOS App',
            description: 'Download on the App Store',
            icon: Smartphone,
            external: true,
          },
          {
            href: 'https://play.google.com/store/apps/details?id=net.checkit.checkitandroid&hl=en_GB',
            label: 'Android App',
            description: 'Get it on Google Play',
            icon: Smartphone,
            external: true,
          },
        ],
      },
    ],
    featured: {
      image: '/checkit v6-1.webp',
      eyebrow: 'New',
      title: 'A new Checkit platform experience',
      cta: 'Coming soon',
      comingSoon: true,
    },
    statStrip: ['1M+ daily checks', '99.9% uptime', 'ISO 17025 & UKAS accredited'],
  },
  {
    id: 'solutions',
    label: 'Solutions',
    columns: [
      {
        heading: 'For Commercial Orchestration',
        segment: 'commercial',
        links: [
          {
            label: 'Automated Temperature Monitoring',
            description: 'Fridges, freezers, and hot-hold protected around the clock',
            icon: Snowflake,
            badge: 'Soon',
          },
          {
            label: 'Food Safety & Probing',
            description: 'Digital HACCP with wireless probes and guided checks',
            icon: ShieldCheck,
            badge: 'Soon',
          },
          {
            label: 'Digitized Checklists & Workflows',
            description: 'Opening, closing, cleaning, and every check in between',
            icon: Sparkles,
            badge: 'Soon',
          },
          {
            label: 'Alerts & Corrective Actions',
            description: 'Triggers, escalation paths, and closure trails',
            icon: Bell,
            badge: 'Soon',
          },
          {
            label: 'Multi-Site Operations',
            description: 'Enterprise visibility and consistency across every location',
            icon: Globe2,
            badge: 'Soon',
          },
        ],
      },
      {
        heading: 'For Medical Monitoring',
        segment: 'medical',
        links: [
          {
            label: 'Automated Temperature Monitoring',
            description: 'Freezers, fridges, cryo, and incubators compliant 24/7',
            icon: Thermometer,
            badge: 'Soon',
          },
          {
            label: 'Alarms & Escalation',
            description: 'Out-of-range notifications reach the right person, every time',
            icon: Bell,
            badge: 'Soon',
          },
          {
            label: 'Compliance Reporting',
            description: 'Audit-ready records generated automatically',
            icon: ClipboardCheck,
            badge: 'Soon',
          },
          {
            label: 'O2, CO2 & Pressure Monitoring',
            description: 'Gas and differential pressure for labs and cleanrooms',
            icon: Wind,
            badge: 'Soon',
          },
          {
            label: 'Cold-Chain Transport',
            description: 'TTMUs keep custody of goods on the move',
            icon: Truck,
            badge: 'Soon',
          },
        ],
      },
      {
        heading: 'With Every Solution',
        links: [
          {
            label: 'Reporting & Operational Insight',
            description: 'One view of work, monitoring, and alerts across all sites',
            icon: BarChart3,
            badge: 'Soon',
          },
          {
            label: 'Asset Intelligence',
            description: 'Predict equipment failures before they cost you',
            icon: Brain,
            badge: 'Soon',
          },
        ],
      },
    ],
    statStrip: [
      'Safety · Compliance · Consistency: land on one problem, expand under one vendor roof',
    ],
  },
  {
    id: 'industries',
    label: 'Industries',
    columns: [
      {
        heading: 'Commercial Orchestration',
        segment: 'commercial',
        links: [
          {
            href: '/industries/food-facilities',
            label: 'Venues & Facilities',
            description: 'Event-day food service for stadiums and venues',
            icon: UtensilsCrossed,
            badge: 'Soon',
          },
          {
            href: '/industries/food-retail',
            label: 'Food Retail & Convenience',
            description: 'Food-to-go and store operations, standardized',
            icon: ShoppingCart,
            badge: 'Soon',
          },
          {
            href: '/industries/senior-living',
            label: 'Senior Living & Care',
            description: 'Resident safety and food compliance at scale',
            icon: Building2,
            badge: 'Soon',
          },
          {
            href: '/markets/coffee-shops',
            label: 'Coffee Shops & Cafés',
            description: 'Keep teams on the counter, not on clipboard rounds',
            icon: Coffee,
          },
          {
            href: '/markets/forecourts',
            label: 'Forecourts & Fuel Retail',
            description: 'Multi-site compliance for fuel and convenience',
            icon: Fuel,
          },
          {
            label: 'Hospitality',
            description: 'Hotels, resorts, and food & beverage operations',
            icon: Hotel,
            badge: 'Soon',
          },
        ],
      },
      {
        heading: 'Medical Monitoring',
        segment: 'medical',
        links: [
          {
            href: '/markets/pathology',
            label: 'Pathology Networks',
            description: 'Continuous monitoring across NHS pathology networks',
            icon: FlaskConical,
          },
          {
            href: '/markets/pharmacies',
            label: 'Hospital Pharmacies',
            description: 'Medicine cold-chain compliance without the manual checks',
            icon: Pill,
          },
          {
            label: 'Blood, Plasma & Tissue',
            description: 'Critical inventory protection for US plasma and blood centers',
            icon: Droplets,
            badge: 'Soon',
          },
          {
            label: 'Biotech & Pharmaceutical',
            description: 'Validated monitoring for regulated manufacturing',
            icon: Factory,
            badge: 'Soon',
          },
          {
            label: 'Universities & Research Labs',
            description: 'Research integrity across campus sites',
            icon: GraduationCap,
            badge: 'Soon',
          },
          {
            label: 'Hospitals & Healthcare',
            description: '24/7 monitoring for blood, medicines, and vaccines',
            icon: Stethoscope,
            badge: 'Soon',
          },
        ],
      },
    ],
    featured: {
      image: '/ovg-texastech.webp',
      eyebrow: 'All industries',
      title: 'One problem to start. One platform for everything after.',
      cta: 'Coming soon',
      comingSoon: true,
    },
    statStrip: ['60+ NHS trusts', '500+ locations protected', '1M+ daily checks'],
  },
  {
    id: 'customers',
    label: 'Customers',
    columns: [
      {
        heading: 'Featured Stories',
        links: [
          {
            label: 'Texas Tech & OVG Hospitality',
            description: '"Within two months, the software paid for itself."',
            icon: Award,
            badge: 'Soon',
          },
          {
            label: 'Morningstar Senior Living',
            description: 'Food safety modernized across 41 communities',
            icon: Building2,
            badge: 'Soon',
          },
        ],
      },
      {
        heading: 'Browse',
        links: [
          {
            label: 'All Customer Stories',
            description: 'Results from healthcare, retail, venues, and more',
            icon: BookOpen,
            badge: 'Soon',
          },
        ],
      },
    ],
    featured: {
      image: '/Texas-Tech-0031.jpg',
      eyebrow: 'Case study',
      title: 'Protecting revenue & guest experience at scale',
      cta: 'Coming soon',
      comingSoon: true,
    },
    statStrip: ['Trusted by BP, John Lewis, Sodexo, Octapharma & the NHS'],
  },
  {
    id: 'resources',
    label: 'Resources',
    columns: [
      {
        heading: 'Learn & tools',
        links: [
          {
            href: '/resources',
            label: 'Articles',
            description: 'Practical answers to operational questions',
            icon: FileText,
          },
          {
            href: '/digital-haccp-roi',
            label: 'Digital HACCP ROI Calculator',
            description: 'Translate paper, hours, energy, and stock risk into money',
            icon: Calculator,
          },
        ],
      },
      {
        heading: 'Company',
        links: [
          {
            label: 'About Checkit',
            description: 'Our story, leadership, and values',
            icon: Users,
            badge: 'Soon',
          },
          {
            label: 'Careers',
            description: 'Join the team building multi-site operations',
            icon: Briefcase,
            badge: 'Soon',
          },
          {
            label: 'Contact us',
            description: 'Talk to sales, support, or partnerships',
            icon: Mail,
            badge: 'Soon',
          },
          {
            label: 'Investor Relations',
            description: 'Checkit plc, LSE: CHK',
            icon: Landmark,
            badge: 'Soon',
          },
        ],
      },
      {
        heading: 'Trust',
        links: [
          {
            label: 'ESG',
            description: 'Environmental, social, and governance commitments',
            icon: Leaf,
            badge: 'Soon',
          },
          {
            label: 'Sustainability',
            description: 'How we reduce waste and energy across estates',
            icon: Recycle,
            badge: 'Soon',
          },
          {
            label: 'Certifications',
            description: 'ISO, UKAS, and the standards we hold',
            icon: BadgeCheck,
            badge: 'Soon',
          },
        ],
      },
    ],
    statStrip: ['London Stock Exchange: CHK', 'Global operations, UK & US teams'],
  },
];

const hatLinks = [
  { label: 'Login', icon: LogIn },
  { label: 'Help documentation', icon: LifeBuoy },
  { label: 'Submit a support ticket', icon: Ticket },
] as const;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const close = useCallback(() => setOpenMenu(null), []);

  return (
    <header
      className="border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-50"
      onMouseLeave={close}
    >
      {/* Utility hat — Login / Help / Support (coming soon) */}
      <div className="hidden sm:block bg-navy border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-[11px] font-medium tracking-wide text-white/80">
            <div className="flex items-center gap-0 divide-x divide-white/25">
              {hatLinks.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5 px-3 first:pl-0 last:pr-0 opacity-70 cursor-default"
                  aria-disabled="true"
                  title="Coming soon"
                >
                  {item.label}
                  <span className="text-[9px] uppercase tracking-wider text-white/40">Soon</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" onClick={close}>
            <img
              src="/checkit-logo-horizontal-standard-rgb-white.svg"
              alt="Checkit"
              className="h-6"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-center gap-1 flex-1">
            {megaMenus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                onMouseEnter={() => setOpenMenu(menu.id)}
                onClick={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                  openMenu === menu.id
                    ? 'text-foreground bg-surface-elevated'
                    : 'text-muted hover:text-foreground'
                }`}
                aria-haspopup="menu"
                aria-expanded={openMenu === menu.id}
              >
                {menu.label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openMenu === menu.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <DemoRequestButton label="Request Demo" className="px-4 py-2 text-sm" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-muted hover:text-foreground cursor-pointer ml-auto"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mega panel (desktop) */}
      {openMenu && (
        <div className="hidden lg:block absolute left-0 right-0 top-full border-b border-white/10 bg-navy shadow-2xl">
          {megaMenus
            .filter((m) => m.id === openMenu)
            .map((menu) => (
              <div key={menu.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-8">
                  {/* Link columns */}
                  <div
                    className={`${
                      menu.featured
                        ? menu.columns.length >= 3
                          ? 'col-span-9'
                          : 'col-span-8'
                        : 'col-span-12'
                    } grid gap-8`}
                    style={{
                      gridTemplateColumns: `repeat(${menu.columns.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {menu.columns.map((col) => {
                      const seg = segmentStyles[col.segment ?? 'default'];
                      return (
                      <div key={col.heading}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-4 ${seg.heading}`}>
                          {col.heading}
                        </div>
                        <div className="space-y-1">
                          {col.links.map((link) => {
                            const Icon = link.icon;
                            const isComingSoon = link.badge === 'Soon';
                            const inner = (
                              <>
                                <div className={`p-2 rounded-md shrink-0 transition-colors ${seg.tile}`}>
                                  <Icon className="w-4 h-4" strokeWidth={2} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium transition-colors ${
                                      isComingSoon ? 'text-white/55' : 'text-white group-hover:text-accent'
                                    }`}>
                                      {link.label}
                                    </span>
                                    {link.badge && (
                                      <span
                                        className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded ${
                                          isComingSoon
                                            ? 'bg-white/10 text-white/50'
                                            : 'bg-accent/20 text-accent'
                                        }`}
                                      >
                                        {isComingSoon ? 'Coming soon' : link.badge}
                                      </span>
                                    )}
                                  </div>
                                  {link.description && (
                                    <div className={`text-xs mt-0.5 leading-snug ${
                                      isComingSoon ? 'text-white/40' : 'text-white/60'
                                    }`}>
                                      {link.description}
                                    </div>
                                  )}
                                </div>
                              </>
                            );
                            const cls =
                              'flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors group';
                            if (isComingSoon || !link.href) {
                              return (
                                <div
                                  key={link.label}
                                  className={`${cls} cursor-default`}
                                  aria-disabled="true"
                                >
                                  {inner}
                                </div>
                              );
                            }
                            return link.external ? (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={close}
                                className={`${cls} hover:bg-white/5`}
                              >
                                {inner}
                              </a>
                            ) : (
                              <Link key={link.href} href={link.href} onClick={close} className={`${cls} hover:bg-white/5`}>
                                {inner}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      );
                    })}
                  </div>

                  {/* Featured card */}
                  {menu.featured && (
                    menu.featured.comingSoon || !menu.featured.href ? (
                      <div
                        className={`${
                          menu.columns.length >= 3 ? 'col-span-3' : 'col-span-4'
                        } relative rounded-xl overflow-hidden border border-white/10 min-h-[220px] flex cursor-default`}
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('${menu.featured.image}')` }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/70 to-navy/20" />
                        <div className="relative mt-auto p-5">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
                            {menu.featured.eyebrow}
                          </div>
                          <div className="text-base font-semibold text-white leading-snug mb-2">
                            {menu.featured.title}
                          </div>
                          <div className="text-sm text-white/50">Coming soon</div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={menu.featured.href}
                        onClick={close}
                        className={`${
                          menu.columns.length >= 3 ? 'col-span-3' : 'col-span-4'
                        } group relative rounded-xl overflow-hidden border border-white/10 hover:border-accent/50 transition-colors min-h-[220px] flex`}
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url('${menu.featured.image}')` }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/65 to-navy/15" />
                        <div className="relative mt-auto p-5">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1.5">
                            {menu.featured.eyebrow}
                          </div>
                          <div className="text-base font-semibold text-white leading-snug mb-2">
                            {menu.featured.title}
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-accent">
                            {menu.featured.cta}
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    )
                  )}
                </div>

                {/* Stat strip */}
                {menu.statStrip && (
                  <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-8 gap-y-2">
                    {menu.statStrip.map((stat) => (
                      <div key={stat} className="flex items-center gap-2 text-xs text-white/55">
                        <Globe2 className="w-3.5 h-3.5 text-accent" />
                        <span>{stat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border py-3 px-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="sm:hidden mb-3 pb-3 border-b border-border space-y-1">
            {hatLinks.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-2 py-2 text-sm text-muted/70 cursor-default"
                  aria-disabled="true"
                >
                  <Icon className="w-4 h-4 shrink-0 opacity-50" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Coming soon
                  </span>
                </div>
              );
            })}
          </div>
          <nav className="space-y-1">
            {megaMenus.map((menu) => (
              <div key={menu.id} className="border-b border-border/50 last:border-0">
                <button
                  type="button"
                  onClick={() => setMobileSection(mobileSection === menu.id ? null : menu.id)}
                  className="w-full flex items-center justify-between px-2 py-3 text-sm font-medium text-foreground cursor-pointer"
                >
                  {menu.label}
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform ${
                      mobileSection === menu.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileSection === menu.id && (
                  <div className="pb-3 space-y-3">
                    {menu.columns.map((col) => {
                      const seg = segmentStyles[col.segment ?? 'default'];
                      return (
                      <div key={col.heading}>
                        <div className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${seg.heading}`}>
                          {col.heading}
                        </div>
                        {col.links.map((link) => {
                          const Icon = link.icon;
                          const isComingSoon = link.badge === 'Soon';
                          const cls =
                            'flex items-center gap-3 px-2 py-2 text-sm rounded-lg transition-colors';
                          if (isComingSoon || !link.href) {
                            return (
                              <div
                                key={link.label}
                                className={`${cls} text-muted/70 cursor-default`}
                                aria-disabled="true"
                              >
                                <Icon className={`w-4 h-4 shrink-0 ${seg.mobileIcon}`} />
                                <span className="flex-1">{link.label}</span>
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                                  Coming soon
                                </span>
                              </div>
                            );
                          }
                          return link.external ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMobileOpen(false)}
                              className={`${cls} text-muted hover:text-foreground`}
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${seg.mobileIcon}`} />
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMobileOpen(false)}
                              className={`${cls} text-muted hover:text-foreground`}
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${seg.mobileIcon}`} />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 space-y-3">
              <div className="px-2">
                <DemoRequestButton label="Request Demo" className="w-full justify-center" />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
