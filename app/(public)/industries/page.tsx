import Link from 'next/link';
import { 
  Building2, 
  Pill, 
  ShoppingCart, 
  UtensilsCrossed, 
  Droplets,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
  BarChart3,
  Eye,
  ShieldCheck,
  Utensils,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Monitor,
  Smartphone,
  Wifi,
  ArrowDown,
  Layers,
  HeartHandshake,
  Wrench,
  Gauge,
  Headphones,
  Cloud,
  CalendarCheck,
  BadgeCheck,
  ClipboardX,
  Thermometer,
  FileWarning,
  Ban,
  CircleDollarSign,
  Timer,
  Globe2,
  Award
} from 'lucide-react';

// Problems - Operational non-compliance and waste
const problems = [
  {
    icon: ClipboardX,
    title: 'Paper-Based Processes',
    description: 'Manual logs are error-prone, easily falsified, and impossible to audit in real-time. Compliance gaps go unnoticed until inspections.',
    stat: '40%',
    statLabel: 'of paper records contain errors or gaps',
  },
  {
    icon: Thermometer,
    title: 'Unmonitored Equipment',
    description: 'Fridges, freezers, and critical equipment fail silently. By the time someone notices, inventory is spoiled and compliance is breached.',
    stat: '$35K',
    statLabel: 'average loss per cold chain failure',
  },
  {
    icon: FileWarning,
    title: 'Audit Anxiety',
    description: 'Scrambling to find records before inspections. Missing signatures, incomplete logs, and untraceable corrective actions.',
    stat: '73%',
    statLabel: 'of managers stress about audits',
  },
  {
    icon: Ban,
    title: 'Reactive Operations',
    description: 'Problems discovered after the damage is done. No early warning systems, no predictive insights, no prevention.',
    stat: '3x',
    statLabel: 'more costly to fix than prevent',
  },
  {
    icon: CircleDollarSign,
    title: 'Hidden Waste',
    description: 'Spoiled inventory, wasted labor hours on manual checks, duplicate efforts across shifts. Costs accumulate invisibly.',
    stat: '15-25%',
    statLabel: 'of operational costs are waste',
  },
  {
    icon: Timer,
    title: 'Staff Time Drain',
    description: 'Hours spent on temperature logs, compliance paperwork, and chasing down records that could be automated.',
    stat: '8+ hrs',
    statLabel: 'per week on manual compliance tasks',
  },
];

// Peace of Mind subscription benefits
const subscriptionBenefits = [
  {
    icon: Wrench,
    title: 'Hardware Included',
    description: 'All sensors and equipment supplied. Replacements included throughout contract—no unexpected costs.',
  },
  {
    icon: Gauge,
    title: 'Calibration & Maintenance',
    description: 'ISO17025-aligned calibration included. Annual health checks keep your system running perfectly.',
  },
  {
    icon: Headphones,
    title: '24/7/365 Support',
    description: 'Round-the-clock monitoring alerts and helpdesk support. Optional alarm calling service.',
  },
  {
    icon: Cloud,
    title: 'Cloud Platform',
    description: 'High-availability platform with secure data retention. Automatic software updates included.',
  },
];

// Product components
const productComponents = [
  {
    icon: Wifi,
    title: 'Sensors',
    subtitle: 'Always-on monitoring',
    description: 'Wireless IoT sensors continuously monitor temperatures, humidity, and equipment status. No manual checks required.',
    features: ['Temperature sensors', 'Door/open sensors', 'Humidity monitoring', 'Equipment alerts'],
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    subtitle: 'Operations in your pocket',
    description: 'iOS and Android apps for task completion, alerts, and on-the-go visibility. Staff complete workflows from any device.',
    features: ['Digital checklists', 'Real-time alerts', 'Photo capture', 'Offline capable'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Monitor,
    title: 'Platform',
    subtitle: 'Command center',
    description: 'Cloud dashboard for complete visibility across all locations. Reports, analytics, and compliance documentation.',
    features: ['Multi-site dashboards', 'Compliance reports', 'Trend analytics', 'Audit trails'],
    color: 'from-purple-500 to-purple-600',
  },
];

const industries = [
  {
    href: '/industries/senior-living',
    name: 'Senior Living',
    icon: Building2,
    description: 'Compliance management and resident safety for senior care communities',
    customers: ['Morningstar', 'PLC', 'Atria'],
    product: 'V6',
    color: 'from-blue-500 to-blue-600'
  },
  {
    href: '/industries/nhs-pharmacies',
    name: 'NHS Pharmacies',
    icon: Pill,
    description: 'Connected automated monitoring for pharmaceutical compliance',
    customers: ['NHS Trust Partners'],
    product: 'CAM+',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    href: '/industries/food-retail',
    name: 'Food Retail',
    icon: ShoppingCart,
    description: 'Food safety and compliance for convenience stores and food-to-go',
    customers: ['BP', 'John Lewis Partners'],
    product: 'V6',
    color: 'from-orange-500 to-orange-600'
  },
  {
    href: '/industries/food-facilities',
    name: 'Food Facilities',
    icon: UtensilsCrossed,
    description: 'Food service operations for venues, stadiums, and events',
    customers: ['OVG', 'ISS'],
    product: 'V6',
    color: 'from-purple-500 to-purple-600'
  },
  {
    href: '/industries/medical',
    name: 'Medical',
    icon: Droplets,
    description: 'Compliance monitoring for plasma centers, pharma, and university labs',
    customers: ['Octapharma', 'Grifols', 'University Labs'],
    product: 'CAM+',
    color: 'from-red-500 to-red-600'
  },
  {
    href: '/industries/operations',
    name: 'Operations',
    icon: Building2,
    description: 'Operational compliance for restaurants, hospitality, and more',
    customers: ['Restaurants', 'Hotels', 'Hospitality'],
    product: 'V6',
    color: 'from-slate-500 to-slate-600'
  },
];

// Core outcomes we drive
const outcomes = [
  {
    icon: Utensils,
    title: 'Safety',
    subtitle: 'Protect people and products',
    description: 'From food temperatures to medication storage, automated monitoring catches issues before they become incidents. Real-time alerts mean faster response and fewer safety events.',
    stats: [
      { value: '99.9%', label: 'Temperature compliance' },
      { value: '73%', label: 'Reduction in safety incidents' },
    ],
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500'
  },
  {
    icon: ShieldCheck,
    title: 'Compliance',
    subtitle: 'Always audit-ready',
    description: 'Every check, every temperature, every corrective action—automatically documented with timestamps and digital signatures. Turn compliance from a burden into a competitive advantage.',
    stats: [
      { value: '100%', label: 'Digital audit trails' },
      { value: '50%', label: 'Less time on documentation' },
    ],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500'
  },
  {
    icon: Eye,
    title: 'Visibility',
    subtitle: 'See everything, everywhere',
    description: 'Real-time dashboards show compliance status across all locations. Spot trends, compare performance, and make data-driven decisions—whether you have 5 sites or 500.',
    stats: [
      { value: 'Real-time', label: 'Multi-site monitoring' },
      { value: '85%', label: 'Faster issue resolution' },
    ],
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500'
  },
];

const valueProps = [
  {
    icon: Globe2,
    title: 'Multi-Site Control',
    description: 'One platform for all your locations. Standardize operations, compare performance, and manage compliance centrally.'
  },
  {
    icon: Shield,
    title: 'Regulatory Compliance',
    description: 'Meet and exceed industry-specific regulatory requirements with automated monitoring and documentation.'
  },
  {
    icon: Clock,
    title: 'Operational Efficiency',
    description: 'Eliminate paper-based processes and manual data entry. Free your teams to focus on what matters.'
  },
  {
    icon: CheckCircle2,
    title: 'Audit-Ready Always',
    description: 'Complete digital records with full traceability. Be confident in every inspection.'
  },
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Network grid background */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300A3E0' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%2300A3E0' stroke-width='0.5' stroke-opacity='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Globe/network visualization */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Globe circles */}
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            <circle cx="200" cy="200" r="90" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            <ellipse cx="200" cy="200" rx="150" ry="60" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            <ellipse cx="200" cy="200" rx="60" ry="150" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            {/* Connection nodes */}
            <circle cx="200" cy="50" r="4" fill="currentColor" className="text-accent" />
            <circle cx="320" cy="140" r="4" fill="currentColor" className="text-accent" />
            <circle cx="340" cy="220" r="4" fill="currentColor" className="text-accent" />
            <circle cx="280" cy="320" r="4" fill="currentColor" className="text-accent" />
            <circle cx="120" cy="300" r="4" fill="currentColor" className="text-accent" />
            <circle cx="80" cy="180" r="4" fill="currentColor" className="text-accent" />
            <circle cx="140" cy="100" r="4" fill="currentColor" className="text-accent" />
            {/* Connection lines */}
            <line x1="200" y1="50" x2="320" y2="140" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="320" y1="140" x2="340" y2="220" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="340" y1="220" x2="280" y2="320" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="280" y1="320" x2="120" y2="300" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="120" y1="300" x2="80" y2="180" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="80" y1="180" x2="140" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="140" y1="100" x2="200" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto lg:text-left lg:max-w-2xl lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Industry-Specific Solutions for{' '}
              <span className="text-gradient">Forward Thinking Operations</span>
            </h1>
            <p className="text-lg text-muted mb-8">
              From senior living to plasma centers, Checkit delivers purpose-built compliance 
              and monitoring solutions that transform how multi-site organizations operate.
            </p>
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
              Operational Non-Compliance & Waste
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

      {/* Product Components - The Solution */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              The Solution
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Sensors + Apps + Platform
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
                  {/* Connection line */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border z-0">
                      <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-muted" />
                    </div>
                  )}
                  
                  <div className="bg-surface border border-border rounded-2xl p-6 h-full relative z-10">
                    {/* Header */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${component.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-1">{component.title}</h3>
                    <p className="text-sm text-accent mb-3">{component.subtitle}</p>
                    <p className="text-muted text-sm mb-4">{component.description}</p>
                    
                    {/* Features */}
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

          {/* How they connect */}
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
              Every feature we build, every integration we create, drives toward three 
              outcomes that matter most to operations leaders.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;
              return (
                <div 
                  key={outcome.title} 
                  className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all group"
                >
                  {/* Header */}
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
                  
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-muted mb-6">
                      {outcome.description}
                    </p>
                    
                    {/* Stats */}
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

          {/* Outcome proof points */}
          <div className="mt-16 grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">500+</div>
              <div className="text-sm text-muted">Locations protected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">1M+</div>
              <div className="text-sm text-muted">Checks completed daily</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">99.9%</div>
              <div className="text-sm text-muted">Uptime reliability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted">Automated monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Markets We Serve
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Each industry has unique challenges. Our solutions are tailored to meet 
              the specific compliance, safety, and operational needs of your sector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {industry.name}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-surface-elevated text-muted rounded">
                      {industry.product}
                    </span>
                  </div>
                  
                  <p className="text-muted text-sm mb-4">
                    {industry.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {industry.customers.slice(0, 2).map((customer) => (
                        <span key={customer} className="text-xs text-muted/70">
                          {customer}{industry.customers.indexOf(customer) < Math.min(industry.customers.length - 1, 1) ? ',' : ''}
                        </span>
                      ))}
                      {industry.customers.length > 2 && (
                        <span className="text-xs text-muted/70">+{industry.customers.length - 2} more</span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Case Study Banner */}
      <section className="py-12 bg-gradient-to-r from-red-900/20 via-surface to-surface border-y border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 bg-red-600/20 text-red-400 rounded">Case Study</span>
                </div>
                <h3 className="font-semibold text-foreground">Texas Tech &amp; OVG Hospitality</h3>
                <p className="text-sm text-muted">See how they achieved ROI in just 2 months with Checkit</p>
              </div>
            </div>
            <Link
              href="/case-studies/texas-tech"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shrink-0"
            >
              Read Case Study
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Peace of Mind Subscription */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              <HeartHandshake className="w-4 h-4 inline mr-1" />
              Peace of Mind Subscriptions
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need, One Annual Fee
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              No capital investment, no surprises—hardware, calibration, support, and software 
              all included in a predictable annual subscription.
            </p>
          </div>

          {/* Key benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {subscriptionBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-surface border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* Value props */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                <BadgeCheck className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">No Capital Outlay</h4>
              <p className="text-sm text-muted">Start monitoring without major upfront investment</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                <CalendarCheck className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Predictable Costs</h4>
              <p className="text-sm text-muted">Simple annual fee with no surprise bills</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                <Headphones className="w-6 h-6 text-success" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Always Supported</h4>
              <p className="text-sm text-muted">24/7/365 monitoring and rapid response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Organizations Choose CheckIt
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Trusted by leading organizations across multiple industries to ensure 
              compliance, safety, and operational excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <div key={prop.title} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-muted">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how CheckIt can help your organization achieve compliance confidence, 
            operational efficiency, and real-time visibility across all your locations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.checkit.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-medium rounded-lg transition-colors"
            >
              Learn More at Checkit.net
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="/checkit-logo-horizontal-standard-rgb-white.svg" 
                alt="Checkit" 
                className="h-5 mb-4"
              />
              <p className="text-sm text-muted">
                Purpose-built compliance and monitoring solutions for operational excellence.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Industries</h4>
              <ul className="space-y-2">
                <li><Link href="/industries" className="text-sm text-muted hover:text-foreground transition-colors">Overview</Link></li>
                <li><Link href="/industries/senior-living" className="text-sm text-muted hover:text-foreground transition-colors">Senior Living</Link></li>
                <li><Link href="/industries/nhs-pharmacies" className="text-sm text-muted hover:text-foreground transition-colors">NHS Pharmacies</Link></li>
                <li><Link href="/industries/food-retail" className="text-sm text-muted hover:text-foreground transition-colors">Food Retail</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">&nbsp;</h4>
              <ul className="space-y-2">
                <li><Link href="/industries/food-facilities" className="text-sm text-muted hover:text-foreground transition-colors">Food Facilities</Link></li>
                <li><Link href="/industries/medical" className="text-sm text-muted hover:text-foreground transition-colors">Medical</Link></li>
                <li><Link href="/industries/operations" className="text-sm text-muted hover:text-foreground transition-colors">Operations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2">
                <li><a href="https://www.checkit.net" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">Checkit.net</a></li>
                <li><a href="https://www.checkit.net/about" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">About Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} Checkit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
