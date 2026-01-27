'use client';

import Link from 'next/link';
import { useState } from 'react';
import DemoRequestModal from '@/components/DemoRequestModal';
import DemoRequestButton from '@/components/DemoRequestButton';
import { 
  ArrowRight,
  Menu,
  X,
  Headphones,
  Facebook,
  Linkedin,
  Youtube,
  Building2,
  Pill,
  ShoppingCart,
  UtensilsCrossed,
  Droplets,
  CheckCircle2,
  Shield,
  Clock,
  Eye,
  ShieldCheck,
  Utensils,
  AlertTriangle,
  ClipboardX,
  Thermometer,
  FileWarning,
  Ban,
  CircleDollarSign,
  Timer,
  Globe2,
  Award,
  Wifi,
  Smartphone,
  Monitor,
  Layers,
  Play,
  ChevronRight,
  Quote,
  Users,
  BarChart3,
  Zap,
  LogIn,
  ExternalLink,
  Apple,
  ClipboardList,
  Droplet,
  Wind,
  TrendingUp,
  Activity,
  Radio,
  Sparkles,
  Brain,
  Gauge,
  DollarSign,
  Wrench,
  LineChart,
  ShieldAlert,
  Trash2,
  CalendarCheck,
  DoorOpen,
  SprayCan,
  Package,
  FileCheck,
  ClipboardCheck,
  Settings
} from 'lucide-react';

// Hero stats
const heroStats = [
  { value: '500+', label: 'Locations Protected' },
  { value: '1M+', label: 'Daily Checks' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Monitoring' },
];

// Problems section
const problems = [
  {
    icon: ClipboardX,
    title: 'Paper-Based Processes',
    description: 'Manual logs are error-prone, easily falsified, and impossible to audit in real-time.',
    stat: '40%',
    statLabel: 'of paper records have errors',
  },
  {
    icon: Thermometer,
    title: 'Unmonitored Equipment',
    description: 'Critical equipment fails silently. By the time someone notices, inventory is spoiled.',
    stat: '$35K',
    statLabel: 'average loss per failure',
  },
  {
    icon: FileWarning,
    title: 'Audit Anxiety',
    description: 'Scrambling to find records before inspections. Missing signatures and incomplete logs.',
    stat: '73%',
    statLabel: 'of managers stress audits',
  },
  {
    icon: Ban,
    title: 'Reactive Operations',
    description: 'Problems discovered after the damage is done. No early warning, no prevention.',
    stat: '3x',
    statLabel: 'more costly to fix than prevent',
  },
  {
    icon: CircleDollarSign,
    title: 'Hidden Waste',
    description: 'Spoiled inventory, wasted labor hours, duplicate efforts. Costs accumulate invisibly.',
    stat: '15-25%',
    statLabel: 'of costs are waste',
  },
  {
    icon: Timer,
    title: 'Staff Time Drain',
    description: 'Hours spent on temperature logs and compliance paperwork that could be automated.',
    stat: '8+ hrs',
    statLabel: 'per week on manual tasks',
  },
];

// Use cases / capabilities
const useCases = [
  {
    icon: ClipboardList,
    title: 'Digitize Tasks & Workflows',
    description: 'Move off paper-based or manual tracking to a fully digital and mobile-ready solution.',
    color: 'bg-blue-500',
  },
  {
    icon: Thermometer,
    title: 'Automate Temperature Monitoring',
    description: 'Capture temperature data in real-time, ensuring freezers, cold rooms, and labs stay within safe parameters.',
    color: 'bg-red-500',
  },
  {
    icon: Droplet,
    title: 'Track Humidity',
    description: 'Protect assets, ensure product quality, and prevent mold, mildew, and equipment malfunction.',
    color: 'bg-cyan-500',
  },
  {
    icon: Wind,
    title: 'Measure O2 and CO2 Levels',
    description: 'Ensure safe oxygen levels in hospitals, laboratories, and industrial settings.',
    color: 'bg-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Predict Equipment Failures',
    description: 'Understand when freezers and fridges protecting your critical assets are likely to fail.',
    color: 'bg-purple-500',
  },
  {
    icon: Activity,
    title: 'See Ambient Levels',
    description: 'Monitor temperature, humidity, light, and sound levels for comfort and safety.',
    color: 'bg-orange-500',
  },
  {
    icon: Droplets,
    title: 'Detect Water Leaks',
    description: 'Real-time alerts help you respond quickly to water leaks and minimize damage.',
    color: 'bg-sky-500',
  },
  {
    icon: Radio,
    title: 'Much, Much More',
    description: 'Measure motion, levels, proximity, door openings, and so much more.',
    color: 'bg-pink-500',
  },
];

// Workflow actions - What can you do
const workflowActions = [
  {
    icon: DoorOpen,
    title: 'Opening & Closing Checks',
    description: 'Standardize daily routines with digital checklists for shift start and end procedures.',
    color: 'bg-blue-500',
  },
  {
    icon: ClipboardList,
    title: 'Standard Operating Procedures',
    description: 'Digitize SOPs with step-by-step guidance, verification, and compliance documentation.',
    color: 'bg-red-500',
  },
  {
    icon: SprayCan,
    title: 'Cleaning & Sanitation',
    description: 'Schedule and track cleaning tasks with verification steps and compliance documentation.',
    color: 'bg-cyan-500',
  },
  {
    icon: Utensils,
    title: 'Food Safety (HACCP)',
    description: 'HACCP-compliant workflows for food handling, preparation, and storage checks.',
    color: 'bg-emerald-500',
  },
  {
    icon: Settings,
    title: 'Equipment Checks',
    description: 'Daily, weekly, or monthly equipment inspections with maintenance logging.',
    color: 'bg-orange-500',
  },
  {
    icon: Package,
    title: 'Receiving & Inventory',
    description: 'Goods-in checks, delivery verification, and stock rotation workflows.',
    color: 'bg-purple-500',
  },
  {
    icon: FileCheck,
    title: 'Safety Audits',
    description: 'Health and safety inspections, fire safety checks, and compliance audits.',
    color: 'bg-yellow-500',
  },
  {
    icon: Radio,
    title: 'Much, Much More',
    description: 'Incident reporting, training verification, maintenance requests, and any workflow you need.',
    color: 'bg-pink-500',
  },
];

// Product components
const productComponents = [
  {
    icon: Wifi,
    title: 'Sensors',
    subtitle: 'Always-on monitoring',
    description: 'Wireless IoT sensors continuously monitor temperatures, humidity, and equipment status.',
    features: ['Temperature sensors', 'Door/open sensors', 'Humidity monitoring', 'Equipment alerts'],
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    subtitle: 'Operations in your pocket',
    description: 'iOS and Android apps for task completion, alerts, and on-the-go visibility.',
    features: ['Digital checklists', 'Real-time alerts', 'Photo capture', 'Offline capable'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Monitor,
    title: 'Platform',
    subtitle: 'Central management',
    description: 'Cloud dashboard for complete visibility across all locations. Reports and analytics.',
    features: ['Multi-site dashboards', 'Compliance reports', 'Trend analytics', 'Audit trails'],
    color: 'from-purple-500 to-purple-600',
  },
];

// Outcomes - aligned with platform page (Compliance, Monitoring, Visibility)
const outcomes = [
  {
    icon: ShieldCheck,
    title: 'Compliance',
    subtitle: 'Audit-ready, always',
    description: 'Every check automatically documented with timestamps and digital signatures.',
    stats: [
      { value: '100%', label: 'Digital audit trails' },
      { value: '50%', label: 'Less documentation time' },
    ],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
  },
  {
    icon: Shield,
    title: 'Safety',
    subtitle: 'Protect people and products',
    description: 'From food temperatures to cold storage, automated monitoring catches issues before they become incidents.',
    stats: [
      { value: '99.9%', label: 'Temperature compliance' },
      { value: '73%', label: 'Fewer safety incidents' },
    ],
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
  },
  {
    icon: Eye,
    title: 'Visibility',
    subtitle: 'See everything, everywhere',
    description: 'Real-time dashboards show compliance status across all locations.',
    stats: [
      { value: 'Real-time', label: 'Multi-site monitoring' },
      { value: '85%', label: 'Faster issue resolution' },
    ],
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
  },
];

// Industries
const industries = [
  {
    href: '/industries/senior-living',
    name: 'Senior Living',
    icon: Building2,
    description: 'Compliance and resident safety for senior care communities',
    color: 'from-blue-500 to-blue-600',
  },
  {
    href: '/industries/food-retail',
    name: 'Food Retail',
    icon: ShoppingCart,
    description: 'Food safety for convenience stores and food-to-go',
    color: 'from-orange-500 to-orange-600',
  },
  {
    href: '/industries/food-facilities',
    name: 'Facilities Food Service',
    icon: UtensilsCrossed,
    description: 'Food service operations for venues and events',
    color: 'from-purple-500 to-purple-600',
  },
];

// Featured case studies
const featuredCaseStudies = [
  {
    title: 'Texas Tech & OVG Hospitality',
    subtitle: 'Protecting Revenue & Guest Experience at Scale',
    quote: 'Within the first two months of using Checkit, the software paid for itself.',
    author: 'Megan Sunderman',
    role: 'General Manager, OVG Hospitality',
    stats: [
      { value: '2 Months', label: 'To ROI' },
      { value: '1 Hour', label: 'Fix Time' },
    ],
    href: '/case-studies/texas-tech',
    image: '/Jones.jpg',
    logo: '/TexasTech_logo.png',
    logo2: '/OVG_Hospitality_Logo_FullColor-f60e36da0b.webp',
    color: 'red',
    industry: 'Food Facilities',
  },
  {
    title: 'Morningstar Senior Living',
    subtitle: 'Modernizing Food Safety & Compliance at Scale',
    quote: 'Our teams now spend less time on paperwork and more time with residents.',
    author: 'Natalie Brown',
    role: 'VP of Culinary, Morningstar Senior Living',
    stats: [
      { value: '41', label: 'Communities' },
      { value: '100%', label: 'Audit Trail' },
    ],
    href: '/case-studies/morningstar',
    image: '/morningstar-of-arvada.jpg',
    logo: '/morningstar-logo-500x125.png',
    logo2: null,
    color: 'teal',
    industry: 'Senior Living',
  },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <>
      <DemoRequestModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
      />
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center shrink-0">
              <img 
                src="/checkit-logo-horizontal-standard-rgb-white.svg" 
                alt="Checkit" 
                className="h-6"
              />
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
              <Link href="/platform" className="text-sm text-muted hover:text-foreground transition-colors">
                Platform
              </Link>
              <Link href="/industries" className="text-sm text-muted hover:text-foreground transition-colors">
                Industries
              </Link>
              <Link href="/case-studies" className="text-sm text-muted hover:text-foreground transition-colors">
                Stories
              </Link>
              <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
                About Us
              </Link>
            </nav>

            <div className="hidden md:flex items-center shrink-0">
              <DemoRequestButton label="Request Demo" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-muted hover:text-foreground cursor-pointer ml-auto"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileOpen && (
            <div className="md:hidden border-t border-border py-4">
              <nav className="space-y-1">
                <Link
                  href="/platform"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  Platform
                </Link>
                <Link
                  href="/industries"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  Industries
                </Link>
                <Link
                  href="/case-studies"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  Stories
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  About Us
                </Link>
                <div className="border-t border-border my-3" />
                <div className="mx-3">
                  <DemoRequestButton label="Request Demo" className="w-full justify-center" />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent/10 text-accent rounded-full mb-6">
              Discover the Checkit V6 Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Transform Operations with{' '}
              <span className="text-gradient">Intelligent Compliance</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-3xl mx-auto">
              Checkit combines IoT sensors, mobile apps, and cloud analytics to deliver automated 
              monitoring, streamlined operations, and complete visibility across all your locations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <DemoRequestButton />
              <Link
                href="/industries"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors border border-border"
              >
                Explore Solutions
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border">
              {heroStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Screenshot */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <img 
              src="/checkit v6-1.webp" 
              alt="Checkit V6 Platform Dashboard" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 text-sm">
            <div className="flex items-center gap-2 text-muted">
              <Layers className="w-4 h-4 text-accent" />
              <span><strong className="text-foreground">Fully Connected</strong> Operational Ecosystem</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Globe2 className="w-4 h-4 text-accent" />
              <span><strong className="text-foreground">Multi-Site</strong> Operations Platform</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Award className="w-4 h-4 text-accent" />
              <span>ISO 17025 &amp; UKAS Accredited</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 lg:py-24 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-red-500/10 text-red-500 rounded-full mb-4">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              The Problem
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Operational Non-Compliance & Waste is a Drain
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Manual processes, paper logs, and disconnected systems create compliance gaps, 
              hidden waste, and operational blind spots that put your business at risk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem) => {
              const Icon = problem.icon;
              return (
                <div key={problem.title} className="bg-surface border border-border rounded-xl p-6 hover:border-red-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{problem.title}</h3>
                      <p className="text-sm text-muted mb-4">{problem.description}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-red-500">{problem.stat}</span>
                        <span className="text-xs text-muted">{problem.statLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Components Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              The Solution
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              One Connected System for Complete Control
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Three integrated components that work together to deliver automated monitoring, 
              streamlined operations, and complete visibility.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {productComponents.map((component, index) => {
              const Icon = component.icon;
              return (
                <div key={component.title} className="relative">
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border z-0">
                      <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-muted" />
                    </div>
                  )}
                  
                  <div className="bg-surface border border-border rounded-2xl p-6 h-full relative z-10 card-glow">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${component.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-1">{component.title}</h3>
                    <p className="text-sm text-accent mb-3">{component.subtitle}</p>
                    <p className="text-muted text-sm mb-4">{component.description}</p>
                    
                    <ul className="space-y-2">
                      {component.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-surface-elevated/50 border border-border rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Layers className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">How They Work Together</h3>
            </div>
            <p className="text-muted max-w-3xl mx-auto">
              <strong className="text-foreground">Sensors</strong> capture data automatically and send it to the cloud. 
              <strong className="text-foreground"> Mobile apps</strong> alert staff to issues and guide them through tasks. 
              The <strong className="text-foreground">platform</strong> aggregates everything into dashboards, reports, and audit-ready documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 lg:py-24 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              <Sparkles className="w-4 h-4 inline mr-1" />
              Endless Possibilities
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Can You Measure?
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Whether you can see it or not, we can measure it. Reduce waste, stay compliant, 
              and improve your bottom line with intelligent monitoring.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div 
                  key={useCase.title} 
                  className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${useCase.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Can You Digitize Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              <ClipboardList className="w-4 h-4 inline mr-1" />
              Digital Workflows
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Can You Digitize?
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Replace paper-based processes with digital checklists, tasks, and workflows 
              that drive accountability and ensure nothing gets missed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowActions.map((action) => {
              const Icon = action.icon;
              return (
                <div 
                  key={action.title} 
                  className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {action.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 lg:py-24 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-success/10 text-success rounded-full mb-4">
              The Outcomes
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Driving Better Behavioral Change at Scale
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Every feature we build drives toward three outcomes that matter most to operations leaders.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;
              return (
                <div 
                  key={outcome.title} 
                  className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all"
                >
                  <div className={`bg-gradient-to-r ${outcome.color} p-6`}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{outcome.title}</h3>
                        <p className="text-white/80 text-sm">{outcome.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-muted mb-6">{outcome.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {outcome.stats.map((stat) => (
                        <div key={stat.label} className={`${outcome.bgColor} rounded-lg p-3 text-center`}>
                          <div className={`text-xl font-bold ${outcome.textColor}`}>{stat.value}</div>
                          <div className="text-xs text-muted">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Asset Intelligence Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-surface to-surface" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-purple-500/20 text-purple-400 rounded-full mb-6">
                <Brain className="w-4 h-4" />
                Platform Add-On
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Asset Intelligence
              </h2>
              <p className="text-lg text-muted mb-6">
                Unlock predictive insights and performance data for your freezers, fridges, and critical assets. 
                Move beyond traditional monitoring to predict failures before they happen.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Gauge className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Be Proactive</h4>
                    <p className="text-sm text-muted">Identify underperforming assets before costly failures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Optimize Assets</h4>
                    <p className="text-sm text-muted">Extend asset life and replace only when necessary</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Reduce Risk</h4>
                    <p className="text-sm text-muted">Protect critical inventory from unexpected failures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <CalendarCheck className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Plan Confidently</h4>
                    <p className="text-sm text-muted">Budget accurately with data-driven insights</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* How it works */}
              <div className="bg-surface border border-purple-500/30 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-purple-400" />
                  How It Works
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Connect Data to Checkit</h4>
                      <p className="text-sm text-muted">Your sensors are already capturing real-time data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Turn On Asset Intelligence</h4>
                      <p className="text-sm text-muted">AI/ML models analyze patterns and predict outcomes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Access Predictive Insights</h4>
                      <p className="text-sm text-muted">Filterable dashboard highlights predictions and savings</p>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted italic mb-3">
                    &ldquo;Asset Intelligence allows me to have a real plan in place of what is priority, 
                    what&apos;s costing the most to run, and what potentially needs new investment.&rdquo;
                  </p>
                  <p className="text-xs text-purple-400 font-medium">
                    Philip King, BWG Foods, Operations Development Manager
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 lg:py-24 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Industries We Serve
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Each industry has unique challenges. Our solutions are tailored to meet 
              the specific compliance, safety, and operational needs of your sector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <Link
                  key={industry.href}
                  href={industry.href}
                  className="group bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all card-glow"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${industry.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                    {industry.name}
                  </h3>
                  
                  <p className="text-muted text-sm mb-4">{industry.description}</p>
                  
                  <div className="flex items-center text-accent text-sm font-medium group-hover:gap-2 transition-all">
                    Learn more
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors border border-border"
            >
              View All Industries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-16 lg:py-24 bg-surface-elevated/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/20 text-accent rounded-full mb-4">
              Customer Success
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Real Results from Real Operations
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              See how leading organizations use Checkit to transform compliance and protect their operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredCaseStudies.map((study) => (
              <Link
                key={study.href}
                href={study.href}
                className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      study.color === 'red' ? 'bg-red-600/80 text-white' : 'bg-teal-600/80 text-white'
                    }`}>
                      {study.industry}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Logo */}
                  <div className={`inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-lg ${
                    study.color === 'red' ? 'bg-gradient-to-r from-gray-950 via-gray-800 to-gray-600' : 'bg-white border border-gray-200'
                  }`}>
                    <img 
                      src={study.logo} 
                      alt={study.title}
                      className="h-8 object-contain"
                    />
                    {study.logo2 && (
                      <>
                        <div className="w-px h-6 bg-gray-400" />
                        <img 
                          src={study.logo2} 
                          alt=""
                          className="h-6 object-contain"
                        />
                      </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{study.title}</h3>
                  <p className="text-muted mb-4">{study.subtitle}</p>
                  
                  {/* Quote */}
                  <blockquote className={`border-l-4 pl-4 mb-4 ${
                    study.color === 'red' ? 'border-red-600' : 'border-teal-600'
                  }`}>
                    <p className="text-sm text-foreground italic mb-2">
                      &ldquo;{study.quote}&rdquo;
                    </p>
                    <footer className="text-xs text-muted">
                      <strong className="text-foreground">{study.author}</strong>
                    </footer>
                  </blockquote>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    {study.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-lg font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className={`flex items-center gap-2 font-medium group-hover:gap-3 transition-all ${
                    study.color === 'red' ? 'text-red-500' : 'text-teal-500'
                  }`}>
                    Read Case Study
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-accent hover:gap-3 transition-all font-medium"
            >
              View All Stories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Checkit */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Organizations Choose Checkit
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Trusted by leading organizations across multiple industries to ensure 
              compliance, safety, and operational excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Multi-Site Control</h3>
              <p className="text-sm text-muted">One platform for all locations. Standardize and manage centrally.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Regulatory Compliance</h3>
              <p className="text-sm text-muted">Meet and exceed industry requirements with automated monitoring.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Operational Efficiency</h3>
              <p className="text-sm text-muted">Eliminate paper processes and free your teams to focus on what matters.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Audit-Ready Always</h3>
              <p className="text-sm text-muted">Complete digital records with full traceability. Be confident in every inspection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <img 
                src="/checkit-logo-horizontal-standard-rgb-white.svg" 
                alt="Checkit" 
                className="h-6 mb-4"
              />
              <p className="text-sm text-muted mb-6 max-w-sm">
                Purpose-built compliance and monitoring solutions for operational excellence. 
                Sensors, apps, and cloud analytics working together.
              </p>
              
              {/* App Downloads */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted uppercase tracking-wider font-medium">Get the Mobile App</span>
                <div className="flex items-center gap-3">
                  <a 
                    href="https://apps.apple.com/us/app/checkit-cwm/id6463000375"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-surface-elevated border border-border rounded-lg hover:border-accent/50 transition-colors"
                  >
                    <Apple className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-[10px] text-muted leading-none">Download on the</div>
                      <div className="text-sm font-semibold text-foreground leading-tight">App Store</div>
                    </div>
                  </a>
                  <a 
                    href="https://play.google.com/store/apps/details?id=net.checkit.checkitandroid&hl=en_GB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-surface-elevated border border-border rounded-lg hover:border-accent/50 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-[10px] text-muted leading-none">GET IT ON</div>
                      <div className="text-sm font-semibold text-foreground leading-tight">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Platform */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/platform" className="text-sm text-muted hover:text-foreground transition-colors">Overview</Link></li>
                <li><Link href="/platform#sensors" className="text-sm text-muted hover:text-foreground transition-colors">Sensors</Link></li>
                <li><Link href="/platform#apps" className="text-sm text-muted hover:text-foreground transition-colors">Mobile Apps</Link></li>
                <li><Link href="/platform#platform" className="text-sm text-muted hover:text-foreground transition-colors">Cloud Platform</Link></li>
              </ul>
            </div>
            
            {/* More */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">More</h4>
              <ul className="space-y-2">
                <li><Link href="/industries" className="text-sm text-muted hover:text-foreground transition-colors">Industries</Link></li>
                <li><Link href="/case-studies" className="text-sm text-muted hover:text-foreground transition-colors">Stories</Link></li>
                <li><Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            {/* Login & Access */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Access</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://app.checkit.net" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Platform Login
                  </a>
                </li>
                <li>
                  <a 
                    href="/login" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <LogIn className="w-3 h-3" />
                    Employee Portal
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.checkit.net/support/raise-a-ticket" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <Headphones className="w-3 h-3" />
                    Submit Support Ticket
                  </a>
                </li>
                <li>
                  <a 
                    href="https://apps.apple.com/us/app/checkit-cwm/id6463000375" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <Apple className="w-3 h-3" />
                    iOS App
                  </a>
                </li>
                <li>
                  <a 
                    href="https://play.google.com/store/apps/details?id=net.checkit.checkitandroid&hl=en_GB" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Android App
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} Checkit. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/Checkit.net" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/_checkit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/checkit-ltd" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.youtube.com/channel/UC_YtXdvdVvgENqnPndHrAAA" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            <div className="flex items-center gap-6">
              <a href="https://www.checkit.net/privacy" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="https://www.checkit.net/terms" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
