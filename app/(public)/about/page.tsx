import Link from 'next/link';
import { Metadata } from 'next';
import DemoRequestButton from '@/components/DemoRequestButton';
import { 
  ArrowRight,
  Globe2,
  Award,
  Users,
  Building2,
  Target,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
  Layers,
  Brain,
  BarChart3,
  Clock,
  MapPin,
  Briefcase,
  Heart,
  Lightbulb,
  Rocket,
  ChevronRight,
  Quote
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Checkit | Powering Predictive Operations Worldwide',
  description: 'Checkit is a global leader in operational compliance and IoT monitoring solutions. We help organizations transform manual processes into intelligent, predictive operations across food safety, healthcare, and facilities management.',
  keywords: [
    'Checkit',
    'predictive operations',
    'operational compliance',
    'IoT monitoring',
    'food safety software',
    'healthcare compliance',
    'temperature monitoring',
    'workflow automation',
    'enterprise software',
    'digital transformation'
  ],
  openGraph: {
    title: 'About Checkit | Powering Predictive Operations',
    description: 'Global leader in operational compliance and IoT monitoring solutions.',
    type: 'website',
  },
};

// Company stats
const companyStats = [
  { value: '500+', label: 'Enterprise Customers', icon: Building2 },
  { value: '25+', label: 'Countries Served', icon: Globe2 },
  { value: '1M+', label: 'Daily Checks Processed', icon: CheckCircle2 },
  { value: '10+', label: 'Years of Innovation', icon: Clock },
];

// Core values
const coreValues = [
  {
    icon: Target,
    title: 'Customer Obsession',
    description: 'Every product decision starts with our customers. We measure success by the operational improvements we deliver to their teams.',
  },
  {
    icon: Lightbulb,
    title: 'Relentless Innovation',
    description: 'We continuously push the boundaries of what\'s possible in operational technology, from IoT sensors to AI-powered analytics.',
  },
  {
    icon: Shield,
    title: 'Uncompromising Quality',
    description: 'ISO 17025 and UKAS accredited. Our solutions meet the highest standards because your compliance depends on it.',
  },
  {
    icon: Heart,
    title: 'People First',
    description: 'We build technology that empowers frontline workers, not replaces them. Our tools make their jobs easier and more impactful.',
  },
];

// Leadership team
const leadership = [
  {
    name: 'Kit Kyte',
    role: 'Chief Executive Officer',
    bio: 'Former VP at Genpact and decorated Army Officer. Kit has led Checkit\'s transformation into a global predictive operations platform.',
  },
  {
    name: 'Keith Daley',
    role: 'Chairman',
    bio: 'Serial entrepreneur with 37+ years of experience building and scaling technology businesses across multiple industries.',
  },
  {
    name: 'Kris Shaw',
    role: 'Chief Financial Officer',
    bio: 'Experienced finance leader with expertise in multi-site operations and commodity businesses, driving profitability through data-driven decisions.',
  },
  {
    name: 'David Davies',
    role: 'Chief Product Officer',
    bio: 'Leading product strategy and innovation, ensuring Checkit remains at the forefront of operational technology.',
  },
];

// Timeline milestones
const milestones = [
  { year: '2014', title: 'Founded', description: 'Checkit established in Cambridge, UK with a vision to digitize operational compliance.' },
  { year: '2018', title: 'US Expansion', description: 'Opened North American headquarters to serve growing enterprise customer base.' },
  { year: '2020', title: 'Platform Launch', description: 'Launched unified cloud platform combining monitoring and workflow management.' },
  { year: '2023', title: 'AI Integration', description: 'Introduced Asset Intelligence with predictive analytics and machine learning.' },
  { year: '2024', title: 'V6 Platform', description: 'Released next-generation platform with enhanced mobile apps and analytics.' },
];

// Industries served
const industries = [
  'Healthcare & Life Sciences',
  'Food & Beverage',
  'Senior Living & Care',
  'Hospitality & Venues',
  'Retail & Convenience',
  'Pharmaceutical & Biotech',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent/10 text-accent rounded-full mb-6">
              About Checkit
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Powering{' '}
              <span className="text-gradient">Predictive Operations</span>{' '}
              Worldwide
            </h1>
            
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-3xl mx-auto">
              We're on a mission to eliminate operational waste and transform how organizations 
              manage compliance, safety, and performance. Our platform combines IoT sensors, 
              mobile apps, and AI-powered analytics to deliver predictable, scalable, and simple operations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <DemoRequestButton />
              <Link
                href="/platform"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors border border-border"
              >
                Explore Platform
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {companyStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 text-sm font-medium bg-purple-500/10 text-purple-400 rounded-full mb-4">
                Our Vision
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Transforming Operational Waste into Predictive Intelligence
              </h2>
              <p className="text-muted mb-6 leading-relaxed">
                The world is changing rapidly, and organizations can no longer afford to rely on manual, 
                error-prone processes. We envision a future where every operational decision is informed 
                by real-time data, where compliance is automatic, and where teams are empowered to focus 
                on what matters most—serving customers and driving growth.
              </p>
              <p className="text-muted mb-8 leading-relaxed">
                Checkit is uniquely positioned to make this vision a reality. By combining connected 
                technology, proprietary data models, and deep domain expertise, we're helping organizations 
                across healthcare, food service, and facilities management unlock the power of predictive operations.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-surface border border-border rounded-xl p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Predictability</h4>
                  <p className="text-xs text-muted mt-1">Know before problems occur</p>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4 text-center">
                  <Layers className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Scalability</h4>
                  <p className="text-xs text-muted mt-1">From 1 site to 1,000</p>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4 text-center">
                  <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground">Simplicity</h4>
                  <p className="text-xs text-muted mt-1">Intuitive for every user</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-accent/20 via-purple-500/10 to-transparent rounded-2xl p-8">
                <blockquote className="text-xl lg:text-2xl font-medium text-foreground italic mb-6">
                  "We're not just building software—we're building the operating system for the future of work."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-accent">KK</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Kit Kyte</div>
                    <div className="text-sm text-muted">CEO, Checkit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 lg:py-24 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              What We Do
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Comprehensive Operational Intelligence
            </h2>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              Our platform addresses the full spectrum of operational challenges—from automated 
              monitoring to workflow management to predictive analytics.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-surface border border-border rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Compliance Automation</h3>
              <p className="text-muted mb-4">
                Replace paper logs and manual processes with digital workflows that automatically 
                document every check, every reading, and every corrective action—creating audit-ready 
                records without extra effort.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  HACCP & food safety compliance
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Healthcare regulatory requirements
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Facilities & safety standards
                </li>
              </ul>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Continuous Monitoring</h3>
              <p className="text-muted mb-4">
                IoT sensors provide 24/7 automated monitoring of temperature, humidity, air quality, 
                and equipment status—alerting your team to issues before they become incidents.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Real-time temperature tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Equipment health monitoring
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Environmental conditions
                </li>
              </ul>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Predictive Analytics</h3>
              <p className="text-muted mb-4">
                Machine learning models analyze your operational data to predict equipment failures, 
                identify optimization opportunities, and provide actionable insights for better decisions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Asset failure prediction
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Energy optimization
                </li>
                <li className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  Performance benchmarking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
                Global Reach
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Trusted Across Industries & Continents
              </h2>
              <p className="text-muted mb-8 leading-relaxed">
                From NHS hospitals in the UK to food service operations across North America, 
                Checkit is the platform of choice for organizations that demand reliability, 
                compliance, and operational excellence.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center gap-2 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    {industry}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-xl p-6">
                <MapPin className="w-8 h-8 text-accent mb-3" />
                <h4 className="font-semibold text-foreground mb-1">Cambridge, UK</h4>
                <p className="text-sm text-muted">Global Headquarters</p>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6">
                <MapPin className="w-8 h-8 text-accent mb-3" />
                <h4 className="font-semibold text-foreground mb-1">Florida, USA</h4>
                <p className="text-sm text-muted">North American HQ</p>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6">
                <Globe2 className="w-8 h-8 text-accent mb-3" />
                <h4 className="font-semibold text-foreground mb-1">25+ Countries</h4>
                <p className="text-sm text-muted">Active Deployments</p>
              </div>
              <div className="bg-surface border border-border rounded-xl p-6">
                <Users className="w-8 h-8 text-accent mb-3" />
                <h4 className="font-semibold text-foreground mb-1">100+ Team</h4>
                <p className="text-sm text-muted">Global Employees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              Our Values
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Drives Us Every Day
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Our culture is built on principles that guide every decision, every product, 
              and every customer interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="bg-surface border border-border rounded-xl p-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              Leadership
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Experienced Team, Proven Results
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Our leadership team brings decades of experience from enterprise software, 
              healthcare technology, and operational excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((person) => (
              <div key={person.name} className="bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-white">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{person.name}</h3>
                <p className="text-sm text-accent mb-3">{person.role}</p>
                <p className="text-sm text-muted">{person.bio}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://www.linkedin.com/company/checkit-ltd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:underline"
            >
              See our full team on LinkedIn
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              Our Journey
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              A Decade of Innovation
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-border" />
            
            <div className="grid lg:grid-cols-5 gap-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative">
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background" />
                  
                  <div className="bg-surface border border-border rounded-xl p-6 lg:mt-12">
                    <div className="text-2xl font-bold text-accent mb-2">{milestone.year}</div>
                    <h4 className="font-semibold text-foreground mb-2">{milestone.title}</h4>
                    <p className="text-sm text-muted">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-accent/10 via-surface to-purple-500/10 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Enterprise-Grade Compliance & Security
                </h2>
                <p className="text-muted mb-6">
                  Checkit meets the highest standards for quality, security, and regulatory compliance. 
                  Our certifications give you confidence that your data and operations are protected.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2">
                    <Award className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">ISO 17025</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2">
                    <Award className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">UKAS Accredited</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2">
                    <Shield className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">SOC 2 Type II</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2">
                    <Shield className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">GDPR Compliant</span>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <a
                  href="https://www.checkit.net/about-us"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors border border-border"
                >
                  View All Certifications
                  <ArrowRight className="w-4 h-4" />
                </a>
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
            Join hundreds of organizations worldwide who trust Checkit to power their 
            compliance, monitoring, and operational intelligence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <DemoRequestButton />
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface-hover transition-colors border border-border"
            >
              Explore the Platform
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
