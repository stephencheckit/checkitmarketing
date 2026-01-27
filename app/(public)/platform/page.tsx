import Link from 'next/link';
import { Metadata } from 'next';
import DemoRequestButton from '@/components/DemoRequestButton';
import { 
  ArrowRight,
  CheckCircle2,
  Shield,
  Eye,
  ShieldCheck,
  Wifi,
  Smartphone,
  Monitor,
  Layers,
  Thermometer,
  Droplet,
  Droplets,
  Wind,
  DoorOpen,
  Users,
  Activity,
  Hand,
  Radio,
  Gauge,
  Wrench,
  Cloud,
  Headphones,
  Bell,
  Camera,
  Clock,
  RefreshCw,
  ClipboardList,
  FileText,
  BarChart3,
  Settings,
  Building2,
  MapPin,
  UserCog,
  CalendarClock,
  AlertTriangle,
  LineChart,
  Zap,
  Globe2,
  Award,
  Play,
  Apple,
  ChevronRight,
  Server,
  Cpu,
  Signal,
  Battery,
  CircuitBoard,
  Workflow,
  Target,
  TrendingUp,
  PieChart,
  FileCheck,
  Download,
  Share2,
  Lock,
  History,
  Search,
  Filter,
  LayoutDashboard,
  BellRing,
  MessageSquare,
  CheckSquare,
  Timer,
  Repeat,
  Upload,
  Fingerprint,
  ScanLine,
  Mic,
  ImageIcon,
  WifiOff,
  Languages,
  Accessibility,
  Sparkles,
  Brain,
  Leaf,
  HeartHandshake,
  BadgeCheck,
  CalendarCheck,
  ExternalLink,
  LogIn,
  Quote,
  Facebook,
  Linkedin,
  Youtube
} from 'lucide-react';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Checkit Platform | Sensors + Apps + Cloud for Compliance, Monitoring & Visibility',
  description: 'The Checkit Platform combines IoT sensors, mobile apps, and cloud analytics to deliver automated compliance, 24/7 monitoring, and real-time visibility across all your locations. Food safety, temperature monitoring, HACCP, and operational compliance made simple.',
  keywords: [
    'compliance software',
    'temperature monitoring',
    'food safety software',
    'HACCP compliance',
    'IoT sensors',
    'operational compliance',
    'multi-site management',
    'audit trail software',
    'cold chain monitoring',
    'digital checklists',
    'asset intelligence',
    'operational insight',
    'environmental monitoring',
    'humidity sensors',
    'CO2 monitoring',
    'water leak detection',
    'occupancy sensors',
    'facilities management',
    'senior living compliance',
    'food retail compliance',
    'venue operations'
  ],
  openGraph: {
    title: 'Checkit Platform | Compliance, Monitoring & Visibility',
    description: 'Sensors + Apps + Platform delivering automated compliance, 24/7 monitoring, and real-time visibility across all your locations.',
    type: 'website',
    url: 'https://checkit.net/platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Checkit Platform | Compliance, Monitoring & Visibility',
    description: 'Sensors + Apps + Platform delivering automated compliance, 24/7 monitoring, and real-time visibility.',
  },
  alternates: {
    canonical: 'https://checkit.net/platform',
  },
};

// Structured data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Checkit Platform',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Contact for pricing'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '500'
  },
  description: 'Enterprise compliance and monitoring platform combining IoT sensors, mobile apps, and cloud analytics.',
  featureList: [
    'Temperature Monitoring',
    'Digital Checklists',
    'HACCP Compliance',
    'Multi-site Management',
    'Real-time Alerts',
    'Audit Trail Documentation',
    'Asset Intelligence',
    'Operational Insight'
  ]
};

// Three core outcomes
const outcomes = [
  {
    id: 'compliance',
    icon: ShieldCheck,
    title: 'Compliance',
    headline: 'Audit-Ready, Always',
    description: 'Every check, every temperature reading, every corrective action—automatically documented with timestamps, digital signatures, and full traceability. Transform compliance from a burden into a competitive advantage.',
    benefits: [
      'Digital checklists with HACCP-compliant workflows',
      'Automatic timestamping and digital signatures',
      'Complete corrective action documentation',
      'Audit-ready reports generated on demand',
      'Due diligence proof for inspectors and auditors',
      'Regulatory compliance across multiple frameworks'
    ],
    stats: [
      { value: '100%', label: 'Digital audit trails' },
      { value: '50%', label: 'Less documentation time' },
      { value: '0', label: 'Missing records' },
    ],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'safety',
    icon: Shield,
    title: 'Safety',
    headline: 'Protect People and Products',
    description: 'From food temperatures to cold storage, automated monitoring catches issues before they become incidents. Real-time alerts mean faster response times and fewer safety events.',
    benefits: [
      'Continuous temperature and environmental monitoring',
      'Real-time alerts via app, SMS, email, or phone call',
      'Configurable thresholds and escalation rules',
      'Equipment health tracking and failure prediction',
      'Door/access monitoring for sensitive areas',
      'Water leak and flood detection'
    ],
    stats: [
      { value: '99.9%', label: 'Temperature compliance' },
      { value: '73%', label: 'Fewer safety incidents' },
      { value: '24/7', label: 'Automated protection' },
    ],
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    borderColor: 'border-green-500/30',
  },
  {
    id: 'visibility',
    icon: Eye,
    title: 'Visibility',
    headline: 'See Everything, Everywhere',
    description: 'Real-time dashboards show compliance status, operational performance, and asset health across all your locations—whether you have 5 sites or 500. Spot trends, compare performance, and make data-driven decisions.',
    benefits: [
      'Multi-site dashboards with real-time status',
      'Operational Insight analytics and trends',
      'Asset Intelligence for equipment performance',
      'Energy optimization recommendations',
      'Performance comparison across locations',
      'Customizable reporting and data export'
    ],
    stats: [
      { value: 'Real-time', label: 'Multi-site visibility' },
      { value: '85%', label: 'Faster issue resolution' },
      { value: '15-25%', label: 'Cost savings identified' },
    ],
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-500/30',
  },
];

// Sensor categories
const sensorCategories = [
  {
    id: 'food-safety',
    title: 'Food Safety',
    description: 'Protect temperature-sensitive inventory and ensure HACCP compliance with continuous monitoring of fridges, freezers, cold rooms, and hot holding equipment.',
    icon: Thermometer,
    color: 'from-blue-500 to-cyan-500',
    sensors: [
      {
        name: 'Temperature Sensor',
        description: 'Continuous monitoring for fridges, freezers, and cold storage with ±0.5°C accuracy',
        icon: Thermometer,
      },
      {
        name: 'Temperature Probe',
        description: 'Wide-range probe for extreme environments including ultra-cold freezers and hot holding',
        icon: Gauge,
      },
      {
        name: 'Humidity Sensor',
        description: 'Monitor relative humidity alongside temperature for optimal storage conditions',
        icon: Droplet,
      },
      {
        name: 'Door & Window Sensor',
        description: 'Real-time open/close detection for cold room doors, display cases, and access points',
        icon: DoorOpen,
      },
    ],
    useCases: [
      'HACCP temperature logging',
      'Cold chain compliance',
      'Receiving temperature verification',
      'Hot holding monitoring',
      'Display case tracking',
    ],
  },
  {
    id: 'facilities',
    title: 'Facilities',
    description: 'Protect your buildings, equipment, and infrastructure with environmental monitoring, leak detection, and air quality sensors.',
    icon: Building2,
    color: 'from-emerald-500 to-green-500',
    sensors: [
      {
        name: 'Water & Leak Sensor',
        description: 'Instant detection of water presence for flood prevention and early leak alerts',
        icon: Droplets,
      },
      {
        name: 'CO2 Sensor',
        description: 'Monitor carbon dioxide levels plus temperature, humidity, and barometric pressure',
        icon: Wind,
      },
      {
        name: 'Temperature & Humidity',
        description: 'Ambient environmental monitoring for comfort, safety, and asset protection',
        icon: Activity,
      },
      {
        name: 'Proximity Sensor',
        description: 'Detect object placement or removal within 5mm range for equipment and asset tracking',
        icon: Radio,
      },
    ],
    useCases: [
      'HVAC optimization',
      'Server room monitoring',
      'Flood and leak prevention',
      'Indoor air quality',
      'Equipment room conditions',
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Gain insight into how spaces are used, verify cleaning and service completion, and enable instant communication with touch-activated sensors.',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    sensors: [
      {
        name: 'Motion Sensor',
        description: 'Detect people presence in rooms for occupancy analytics and cleaning verification',
        icon: Activity,
      },
      {
        name: 'Desk Occupancy',
        description: 'Track workspace utilization for real estate optimization and hybrid work planning',
        icon: Users,
      },
      {
        name: 'Touch Sensor',
        description: 'Instant event trigger on contact for service requests, task confirmations, or panic buttons',
        icon: Hand,
      },
      {
        name: 'Door & Window',
        description: 'Access monitoring and open/close tracking for security and operational efficiency',
        icon: DoorOpen,
      },
    ],
    useCases: [
      'Cleaning verification',
      'Restroom service tracking',
      'Space utilization analytics',
      'Service request buttons',
      'Security monitoring',
    ],
  },
];

// Probes section
const probes = [
  {
    name: 'Checkit Probe',
    description: 'Bluetooth-connected handheld probe for spot-check temperature readings with automatic data upload',
    icon: Thermometer,
  },
  {
    name: 'Thermapen',
    description: 'Professional-grade fast-reading thermometer for food service and culinary applications',
    icon: Gauge,
  },
  {
    name: 'Infrared Thermometer',
    description: 'Non-contact temperature measurement for surface readings and quick verification',
    icon: Target,
  },
  {
    name: 'TempTest',
    description: 'Durable multi-purpose probe for receiving checks, cooking verification, and audits',
    icon: FileCheck,
  },
];

// Connectivity options
const connectivity = [
  {
    title: 'Wi-Fi',
    description: 'Connect via your existing wireless network for simple deployment',
    icon: Wifi,
  },
  {
    title: 'Ethernet',
    description: 'Wired connection for maximum reliability in critical environments',
    icon: Server,
  },
  {
    title: 'Cellular',
    description: 'SenseFlex range offers cellular connectivity where network access isn\'t available',
    icon: Signal,
  },
];

// Infrastructure components
const infrastructure = [
  {
    name: 'Hub',
    description: 'Central data relay that receives sensor readings and transmits to the cloud. Supports Wi-Fi and Ethernet.',
    icon: Cpu,
  },
  {
    name: 'Repeater',
    description: 'Extend sensor range through walls and obstacles. Essential for large facilities and complex layouts.',
    icon: Radio,
  },
  {
    name: 'Cloud Connector',
    description: 'SenseFlex range connectivity hub supporting both Ethernet and cellular for flexible deployment.',
    icon: Cloud,
  },
];

// App capabilities
const appCapabilities = [
  {
    category: 'Task Management',
    icon: ClipboardList,
    color: 'from-blue-500 to-blue-600',
    features: [
      {
        name: 'Scheduled Work',
        description: 'Complete daily, weekly, and custom-scheduled checklists with automated reminders',
        icon: CalendarClock,
      },
      {
        name: 'Unscheduled Work',
        description: 'Ad-hoc tasks and responsive workflows for unexpected situations',
        icon: Zap,
      },
      {
        name: 'Delayed Checks',
        description: 'Time-sensitive follow-up tasks that trigger at exactly the right moment',
        icon: Timer,
      },
      {
        name: 'Team Collaboration',
        description: 'Share work with colleagues, see team progress, and coordinate activities',
        icon: Users,
      },
    ],
  },
  {
    category: 'Alerts & Response',
    icon: Bell,
    color: 'from-red-500 to-orange-500',
    features: [
      {
        name: 'Real-time Push Notifications',
        description: 'Instant alerts for sensor events, overdue work, and critical issues',
        icon: BellRing,
      },
      {
        name: 'Alert Acknowledgment',
        description: 'Acknowledge, escalate, or resolve alerts directly from the app',
        icon: CheckSquare,
      },
      {
        name: 'Corrective Actions',
        description: 'Document what went wrong and what you did to fix it—all timestamped',
        icon: Wrench,
      },
      {
        name: 'Manager Insights',
        description: 'Supervisors see overdue tasks and unresolved issues in real-time',
        icon: BarChart3,
      },
    ],
  },
  {
    category: 'Capture & Evidence',
    icon: Camera,
    color: 'from-green-500 to-emerald-500',
    features: [
      {
        name: 'Photo Capture',
        description: 'Attach photos to tasks as proof of work and issue documentation',
        icon: ImageIcon,
      },
      {
        name: 'Temperature Readings',
        description: 'Record probe readings with automatic validation against safe ranges',
        icon: Thermometer,
      },
      {
        name: 'Digital Signatures',
        description: 'Sign off on tasks and checks with secure, traceable digital signatures',
        icon: Fingerprint,
      },
      {
        name: 'Barcode & NFC Scanning',
        description: 'Scan checkpoint tags to verify physical presence and task completion',
        icon: ScanLine,
      },
    ],
  },
  {
    category: 'Sync & Reliability',
    icon: RefreshCw,
    color: 'from-purple-500 to-purple-600',
    features: [
      {
        name: 'Auto Sync',
        description: 'Continuous background upload and download for seamless data flow',
        icon: Upload,
      },
      {
        name: 'Offline Capable',
        description: 'Keep working even without connectivity—data syncs when reconnected',
        icon: WifiOff,
      },
      {
        name: 'Recent Work Screen',
        description: 'See team activity from the last 12 hours for real-time visibility',
        icon: History,
      },
      {
        name: 'Multi-language Support',
        description: 'Available in 9 languages including English, Spanish, French, German, and more',
        icon: Languages,
      },
    ],
  },
];

// Platform capabilities
const platformCapabilities = [
  {
    category: 'Configure',
    description: 'Set up and manage your entire operational ecosystem from one place',
    icon: Settings,
    color: 'from-slate-500 to-slate-600',
    features: [
      {
        name: 'Users & Teams',
        description: 'Create user accounts, assign roles and permissions, and organize staff into teams',
        icon: UserCog,
      },
      {
        name: 'Locations & Hierarchy',
        description: 'Define multi-level location structures from regions to individual rooms',
        icon: MapPin,
      },
      {
        name: 'Checklists & Checks',
        description: 'Build custom checklists with various check types, validations, and branching logic',
        icon: ClipboardList,
      },
      {
        name: 'Schedules & Rules',
        description: 'Configure work schedules, sensor rules, alert thresholds, and escalation paths',
        icon: CalendarClock,
      },
      {
        name: 'Monitoring Setup',
        description: 'Assign sensors to locations, set temperature ranges, and configure alerting',
        icon: Activity,
      },
      {
        name: 'Alert Escalations',
        description: 'Define who gets notified, when, and how—with automatic escalation if unacknowledged',
        icon: AlertTriangle,
      },
    ],
  },
  {
    category: 'Report',
    description: 'Generate audit-ready documentation and compliance reports on demand',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    features: [
      {
        name: 'Work Reports',
        description: 'Complete records of all checklist activity with timestamps, users, and outcomes',
        icon: ClipboardList,
      },
      {
        name: 'Monitoring Reports',
        description: 'Sensor readings, temperature logs, and environmental data with trend visualization',
        icon: LineChart,
      },
      {
        name: 'Alerts Reports',
        description: 'History of all alerts including acknowledgment, resolution, and time-to-respond',
        icon: Bell,
      },
      {
        name: 'Audit Trail',
        description: 'Immutable record of all system activity for compliance and due diligence',
        icon: FileCheck,
      },
      {
        name: 'Custom Export',
        description: 'Export data in multiple formats (PDF, CSV, Excel) for external reporting',
        icon: Download,
      },
      {
        name: 'Scheduled Delivery',
        description: 'Automatic report generation and email delivery on your schedule',
        icon: Share2,
      },
    ],
  },
  {
    category: 'Analyze',
    description: 'Turn operational data into actionable insights with advanced analytics',
    icon: BarChart3,
    color: 'from-purple-500 to-purple-600',
    features: [
      {
        name: 'Operational Insight',
        description: 'Dashboard showing compliance rates, alert patterns, and team performance across locations',
        icon: LayoutDashboard,
      },
      {
        name: 'Asset Intelligence',
        description: 'Predictive analytics for equipment health, failure risk, and replacement planning',
        icon: Brain,
      },
      {
        name: 'Energy Saving',
        description: 'Identify opportunities to optimize fridge/freezer temperatures for cost and carbon savings',
        icon: Leaf,
      },
      {
        name: 'Performance Comparison',
        description: 'Benchmark locations, teams, and time periods to identify best practices',
        icon: TrendingUp,
      },
      {
        name: 'Trend Analysis',
        description: 'Visualize patterns over time to predict issues and plan proactively',
        icon: LineChart,
      },
      {
        name: 'Custom Dashboards',
        description: 'Build personalized views focused on the metrics that matter to your role',
        icon: PieChart,
      },
    ],
  },
];

// Peace of mind subscription
const subscriptionBenefits = [
  {
    icon: Wrench,
    title: 'Hardware Included',
    description: 'All sensors and equipment supplied. Replacements included throughout the contract—no unexpected costs.',
  },
  {
    icon: Gauge,
    title: 'Calibration & Maintenance',
    description: 'ISO17025-aligned calibration included. Annual health checks keep your system running perfectly.',
  },
  {
    icon: Headphones,
    title: '24/7/365 Support',
    description: 'Round-the-clock monitoring alerts and helpdesk support. Optional alarm calling service available.',
  },
  {
    icon: Cloud,
    title: 'Cloud Platform',
    description: 'High-availability platform with secure data retention. Automatic software updates included.',
  },
];

// Industries served
const industries = [
  { name: 'Senior Living', href: '/industries/senior-living', icon: Building2 },
  { name: 'Food Retail', href: '/industries/food-retail', icon: Building2 },
  { name: 'Food Facilities', href: '/industries/food-facilities', icon: Building2 },
  { name: 'Operations', href: '/industries/operations', icon: Settings },
];

export default function PlatformPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300A3E0' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%2300A3E0' stroke-width='0.5' stroke-opacity='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent/10 text-accent rounded-full mb-6">
                <Layers className="w-4 h-4 inline mr-2" />
                The Complete Platform
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Protect What Matters.{' '}
                <span className="text-gradient">Prove It Every Day.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted mb-8 max-w-3xl mx-auto">
                The Checkit Platform combines IoT sensors, mobile apps, and cloud analytics to deliver 
                automated compliance, 24/7 monitoring, and real-time visibility across all your locations.
              </p>

              {/* Three outcomes summary */}
              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                {outcomes.map((outcome) => {
                  const Icon = outcome.icon;
                  return (
                    <a
                      key={outcome.id}
                      href={`#${outcome.id}`}
                      className={`bg-surface border ${outcome.borderColor} rounded-xl p-4 hover:border-accent/50 transition-all group`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${outcome.color} flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {outcome.title}
                      </h3>
                      <p className="text-sm text-muted">{outcome.headline}</p>
                    </a>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <DemoRequestButton />
                <Link
                  href="/industries"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors border border-border"
                >
                  Explore Industries
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted">Locations Protected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">1M+</div>
                  <div className="text-sm text-muted">Daily Checks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">99.9%</div>
                  <div className="text-sm text-muted">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">24/7</div>
                  <div className="text-sm text-muted">Monitoring</div>
                </div>
              </div>
            </div>

            {/* Platform Screenshot */}
            <div className="mt-16 relative max-w-5xl mx-auto">
              <img 
                src="/checkit v6-1.webp" 
                alt="Checkit Platform Dashboard" 
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
                <Globe2 className="w-4 h-4 text-accent" />
                <span><strong className="text-foreground">Multi-Site</strong> Operations Platform</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Award className="w-4 h-4 text-accent" />
                <span>ISO 17025 &amp; UKAS Accredited</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Lock className="w-4 h-4 text-accent" />
                <span><strong className="text-foreground">Enterprise-Grade</strong> Security</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Headphones className="w-4 h-4 text-accent" />
                <span><strong className="text-foreground">24/7</strong> Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 text-sm font-medium bg-success/10 text-success rounded-full mb-4">
                What You Get
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Proactively Ensure the Outcomes That Matter
              </h2>
              <p className="text-lg text-muted max-w-3xl mx-auto">
                Every feature we build, every integration we create, drives toward three outcomes 
                that matter most to operations leaders: Compliance, Safety, and Visibility.
              </p>
            </div>

            <div className="space-y-12">
              {outcomes.map((outcome, index) => {
                const Icon = outcome.icon;
                const isReversed = index % 2 === 1;
                
                return (
                  <div 
                    key={outcome.id} 
                    id={outcome.id}
                    className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center scroll-mt-20 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
                  >
                    <div className={isReversed ? 'lg:order-2' : ''}>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${outcome.bgColor} ${outcome.textColor} text-sm font-medium mb-4`}>
                        <Icon className="w-4 h-4" />
                        {outcome.title}
                      </div>
                      
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                        {outcome.headline}
                      </h3>
                      
                      <p className="text-muted mb-6 leading-relaxed">
                        {outcome.description}
                      </p>
                      
                      <ul className="space-y-3 mb-6">
                        {outcome.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 ${outcome.textColor} shrink-0 mt-0.5`} />
                            <span className="text-muted">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={`${isReversed ? 'lg:order-1' : ''}`}>
                      <div className={`bg-surface border ${outcome.borderColor} rounded-2xl p-8`}>
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {outcome.stats.map((stat) => (
                            <div key={stat.label} className={`${outcome.bgColor} rounded-lg p-4 text-center`}>
                              <div className={`text-2xl lg:text-3xl font-bold ${outcome.textColor}`}>{stat.value}</div>
                              <div className="text-xs text-muted mt-1">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Visual placeholder */}
                        <div className={`h-48 rounded-xl bg-gradient-to-br ${outcome.color} opacity-20 flex items-center justify-center`}>
                          <Icon className="w-20 h-20 text-white opacity-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-border" />
        </div>

        {/* How It's Delivered Section */}
        <section className="py-16 lg:py-24 bg-surface-elevated/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
                How It Works
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Three Components, One Integrated System
              </h2>
              <p className="text-lg text-muted max-w-3xl mx-auto">
                Sensors capture data automatically. Apps empower your team. The Platform gives you control and visibility. 
                Together, they transform how you operate.
              </p>
            </div>

            {/* Component overview cards */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <a href="#sensors" className="group bg-surface border border-border rounded-2xl p-6 hover:border-green-500/50 transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  <Wifi className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-green-500 transition-colors">Sensors</h3>
                <p className="text-sm text-accent mb-3">Automated Data Capture</p>
                <p className="text-muted text-sm mb-4">
                  IoT sensors continuously monitor temperature, humidity, air quality, water leaks, occupancy, and more—24/7 without manual intervention.
                </p>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  Explore sensors <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <a href="#apps" className="group bg-surface border border-border rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-500 transition-colors">Apps</h3>
                <p className="text-sm text-accent mb-3">Team Interface</p>
                <p className="text-muted text-sm mb-4">
                  iOS and Android apps for completing checklists, responding to alerts, capturing photos, and staying connected—even offline.
                </p>
                <div className="flex items-center text-blue-500 text-sm font-medium">
                  Explore apps <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <a href="#platform" className="group bg-surface border border-border rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <Monitor className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-purple-500 transition-colors">Platform</h3>
                <p className="text-sm text-accent mb-3">Central Management</p>
                <p className="text-muted text-sm mb-4">
                  Cloud dashboard for configuration, reporting, and analytics. See everything, manage everyone, and generate audit-ready reports.
                </p>
                <div className="flex items-center text-purple-500 text-sm font-medium">
                  Explore platform <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>

            {/* How they connect */}
            <div className="bg-surface border border-border rounded-2xl p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Workflow className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">The Flow: Data to Action to Insight</h3>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-5 gap-4 items-center">
                  <div className="bg-green-500/10 rounded-xl p-4">
                    <Wifi className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Sensors Capture</p>
                    <p className="text-xs text-muted">24/7 automated</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted hidden md:block mx-auto" />
                  <div className="bg-blue-500/10 rounded-xl p-4">
                    <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Apps Alert & Guide</p>
                    <p className="text-xs text-muted">Real-time response</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted hidden md:block mx-auto" />
                  <div className="bg-purple-500/10 rounded-xl p-4">
                    <Monitor className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Platform Analyzes</p>
                    <p className="text-xs text-muted">Insights & reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SENSORS SECTION */}
        {/* ============================================ */}
        <section id="sensors" className="py-16 lg:py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 text-sm font-medium bg-green-500/10 text-green-500 rounded-full mb-4">
                <Wifi className="w-4 h-4 inline mr-2" />
                Sensors
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Automated Data Capture Across Your Operation
              </h2>
              <p className="text-lg text-muted max-w-3xl mx-auto">
                From temperature and humidity to water leaks, occupancy, and air quality—our comprehensive sensor portfolio 
                monitors everything that matters, automatically and continuously.
              </p>
            </div>

            {/* Sensor Categories */}
            <div className="space-y-16">
              {sensorCategories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <div key={category.id} className="bg-surface border border-border rounded-2xl p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                      {/* Category header */}
                      <div className="lg:w-1/3">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                          <CategoryIcon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{category.title}</h3>
                        <p className="text-muted mb-4">{category.description}</p>
                        
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-foreground mb-3">Common Use Cases</h4>
                          <ul className="space-y-2">
                            {category.useCases.map((useCase) => (
                              <li key={useCase} className="flex items-center gap-2 text-sm text-muted">
                                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                                {useCase}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Sensors grid */}
                      <div className="lg:w-2/3">
                        <div className="grid sm:grid-cols-2 gap-4">
                          {category.sensors.map((sensor) => {
                            const SensorIcon = sensor.icon;
                            return (
                              <div key={sensor.name} className="bg-surface-elevated/50 border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
                                <div className="flex items-start gap-4">
                                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-20 flex items-center justify-center shrink-0`}>
                                    <SensorIcon className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-1">{sensor.name}</h4>
                                    <p className="text-sm text-muted">{sensor.description}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Probes Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Handheld Probes for Spot Checks</h3>
              <p className="text-muted text-center max-w-2xl mx-auto mb-8">
                Complement automated monitoring with manual spot checks for cooking temperatures, receiving verification, and audit requirements.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {probes.map((probe) => {
                  const ProbeIcon = probe.icon;
                  return (
                    <div key={probe.name} className="bg-surface border border-border rounded-xl p-5 text-center">
                      <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                        <ProbeIcon className="w-6 h-6 text-orange-500" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{probe.name}</h4>
                      <p className="text-sm text-muted">{probe.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connectivity & Infrastructure */}
            <div className="mt-16 grid lg:grid-cols-2 gap-8">
              {/* Connectivity */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Signal className="w-5 h-5 text-accent" />
                  Connectivity Options
                </h3>
                <p className="text-muted mb-6">
                  Choose the connectivity that works for your environment. Multiple options ensure reliable data transmission in any facility.
                </p>
                <div className="space-y-4">
                  {connectivity.map((option) => {
                    const ConnIcon = option.icon;
                    return (
                      <div key={option.title} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <ConnIcon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{option.title}</h4>
                          <p className="text-sm text-muted">{option.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Infrastructure */}
              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CircuitBoard className="w-5 h-5 text-accent" />
                  Infrastructure
                </h3>
                <p className="text-muted mb-6">
                  Supporting hardware that ensures reliable sensor data reaches the cloud for analysis and alerting.
                </p>
                <div className="space-y-4">
                  {infrastructure.map((item) => {
                    const InfraIcon = item.icon;
                    return (
                      <div key={item.name} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <InfraIcon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* APPS SECTION */}
        {/* ============================================ */}
        <section id="apps" className="py-16 lg:py-24 bg-surface-elevated/50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 text-sm font-medium bg-blue-500/10 text-blue-500 rounded-full mb-4">
                <Smartphone className="w-4 h-4 inline mr-2" />
                Mobile Apps
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Your Team's Interface to Operations
              </h2>
              <p className="text-lg text-muted max-w-3xl mx-auto">
                The Checkit Mobile App puts powerful workflow management in everyone's hands. Complete tasks, respond to alerts, 
                capture evidence, and stay connected—even when offline.
              </p>
              
              {/* App store badges */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <a 
                  href="https://apps.apple.com/us/app/checkit-cwm/id6463000375"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  <Apple className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted leading-none">Download on the</div>
                    <div className="text-sm font-semibold text-foreground leading-tight">App Store</div>
                  </div>
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=net.checkit.checkitandroid&hl=en_GB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  <Play className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted leading-none">GET IT ON</div>
                    <div className="text-sm font-semibold text-foreground leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* App Capabilities */}
            <div className="grid lg:grid-cols-2 gap-8">
              {appCapabilities.map((capability) => {
                const CapIcon = capability.icon;
                return (
                  <div key={capability.category} className="bg-surface border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${capability.color} flex items-center justify-center`}>
                        <CapIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{capability.category}</h3>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {capability.features.map((feature) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <div key={feature.name} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
                              <FeatureIcon className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground text-sm">{feature.name}</h4>
                              <p className="text-xs text-muted mt-0.5">{feature.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* App highlights */}
            <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="text-3xl font-bold text-foreground mb-2">9</div>
                <div className="text-sm text-muted">Languages Supported</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="text-3xl font-bold text-foreground mb-2">iOS & Android</div>
                <div className="text-sm text-muted">Platform Coverage</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="text-3xl font-bold text-foreground mb-2">Offline</div>
                <div className="text-sm text-muted">Capable</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* PLATFORM SECTION */}
        {/* ============================================ */}
        <section id="platform" className="py-16 lg:py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 text-sm font-medium bg-purple-500/10 text-purple-500 rounded-full mb-4">
                <Monitor className="w-4 h-4 inline mr-2" />
                Cloud Platform
              </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Your Central Hub for Operations
              </h2>
              <p className="text-lg text-muted max-w-3xl mx-auto">
                The Checkit Platform is where you configure your operation, generate compliance reports, 
                and analyze performance across all locations. Configure once, deploy everywhere.
              </p>
            </div>

            {/* Platform Capabilities */}
            <div className="space-y-12">
              {platformCapabilities.map((capability) => {
                const CapIcon = capability.icon;
                return (
                  <div key={capability.category} className="bg-surface border border-border rounded-2xl overflow-hidden">
                    <div className={`bg-gradient-to-r ${capability.color} p-6`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                          <CapIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{capability.category}</h3>
                          <p className="text-white/80">{capability.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {capability.features.map((feature) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div key={feature.name} className="bg-surface-elevated/50 border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                  <FeatureIcon className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-foreground mb-1">{feature.name}</h4>
                                  <p className="text-sm text-muted">{feature.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Asset Intelligence Add-on */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-900/20 via-surface to-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  Go beyond monitoring to predictive analytics. Asset Intelligence uses machine learning to predict equipment 
                  failures, optimize energy usage, and help you plan maintenance proactively.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-muted">Predict equipment failures before they happen</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-muted">Identify energy optimization opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-muted">Plan replacements with data-driven confidence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-muted">Reduce carbon footprint with temperature optimization</span>
                  </li>
                </ul>

                <DemoRequestButton className="bg-purple-600 hover:bg-purple-700" />
              </div>

              <div className="bg-surface border border-purple-500/30 rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-500/10 rounded-xl p-4 text-center">
                    <Gauge className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Asset Health</h4>
                    <p className="text-xs text-muted">Equipment performance scores</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Failure Prediction</h4>
                    <p className="text-xs text-muted">ML-powered forecasting</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl p-4 text-center">
                    <Leaf className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Energy Saving</h4>
                    <p className="text-xs text-muted">Temperature optimization</p>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl p-4 text-center">
                    <CalendarCheck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">Replacement Planning</h4>
                    <p className="text-xs text-muted">Budget with confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Peace of Mind Subscription */}
        <section className="py-16 lg:py-24 bg-surface-elevated/50">
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

        {/* Industries Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Built for Your Industry
              </h2>
              <p className="text-muted max-w-2xl mx-auto">
                The Checkit Platform serves organizations across multiple industries, each with unique 
                compliance requirements and operational challenges.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {industries.map((industry) => {
                const Icon = industry.icon;
                return (
                  <Link
                    key={industry.href}
                    href={industry.href}
                    className="group bg-surface border border-border rounded-xl p-4 text-center hover:border-accent/50 transition-all"
                  >
                    <Icon className="w-8 h-8 text-muted group-hover:text-accent transition-colors mx-auto mb-2" />
                    <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                      {industry.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/industries"
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                View all industries
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Case Study */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-red-900/20 via-surface to-surface border-y border-red-600/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1 text-sm font-medium bg-red-600/20 text-red-400 rounded-full mb-4">
                  Featured Case Study
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Texas Tech & OVG Hospitality
                </h2>
                <p className="text-xl text-muted mb-6">Protecting Revenue & Guest Experience at Scale</p>
                
                <blockquote className="border-l-4 border-red-600 pl-4 mb-6">
                  <Quote className="w-8 h-8 text-red-600/30 mb-2" />
                  <p className="text-lg text-foreground italic mb-4">
                    &ldquo;Within the first two months of using Checkit, the software paid for itself.&rdquo;
                  </p>
                  <footer className="text-sm text-muted">
                    <strong className="text-foreground">Megan Sunderman</strong> — General Manager, OVG Hospitality
                  </footer>
                </blockquote>

                <div className="flex items-center gap-8 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-foreground">2 Months</div>
                    <div className="text-sm text-muted">To ROI</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">1 Hour</div>
                    <div className="text-sm text-muted">Fix Time</div>
                  </div>
                </div>

                <Link
                  href="/case-studies/texas-tech"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Read Full Case Study
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
                  <img 
                    src="/Jones.jpg" 
                    alt="Texas Tech Stadium" 
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/texas-tech-logo.png" 
                      alt="Texas Tech" 
                      className="h-12 object-contain"
                    />
                    <div className="w-px h-10 bg-gray-300" />
                    <img 
                      src="/OVG_Hospitality_Logo_FullColor-f60e36da0b.webp" 
                      alt="OVG Hospitality" 
                      className="h-8 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-accent/10 via-surface to-purple-500/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              See how the Checkit Platform can help your organization achieve compliance confidence, 
              operational efficiency, and real-time visibility across all your locations.
            </p>
            <DemoRequestButton />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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
                  <li><a href="#sensors" className="text-sm text-muted hover:text-foreground transition-colors">Sensors</a></li>
                  <li><a href="#apps" className="text-sm text-muted hover:text-foreground transition-colors">Mobile Apps</a></li>
                  <li><a href="#platform" className="text-sm text-muted hover:text-foreground transition-colors">Cloud Platform</a></li>
                  <li><Link href="/industries" className="text-sm text-muted hover:text-foreground transition-colors">Industries</Link></li>
                  <li><Link href="/case-studies" className="text-sm text-muted hover:text-foreground transition-colors">Case Studies</Link></li>
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
                      href="https://docs.checkit.net/cam" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      Help Center
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
