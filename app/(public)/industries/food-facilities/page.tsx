import Link from 'next/link';
import { 
  UtensilsCrossed,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Thermometer,
  FileCheck,
  Users,
  BarChart3,
  CalendarDays,
  Zap,
  Eye,
  ShieldCheck,
  Utensils,
  Wifi,
  Smartphone,
  Monitor
} from 'lucide-react';

// Product components for food facilities
const productComponents = [
  {
    icon: Wifi,
    title: 'Sensors',
    description: 'Monitor every concession stand, hot box, and fridge across the venue—automatically.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Event-day workflows guide temporary staff through food safety checks. No training required.',
  },
  {
    icon: Monitor,
    title: 'Platform',
    description: 'Real-time dashboard shows compliance status across all service points during events.',
  },
];

// Core outcomes for food facilities
const outcomes = [
  {
    icon: Utensils,
    title: 'Food Safety',
    description: 'Protect thousands of guests with real-time monitoring across every service point. No excursion goes unnoticed.',
    stat: '99.9%',
    statLabel: 'Temperature compliance',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: ShieldCheck,
    title: 'Compliance',
    description: 'Meet health department standards even on the busiest event days. Complete documentation, always audit-ready.',
    stat: '100%',
    statLabel: 'Event-day compliance',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    icon: Eye,
    title: 'Visibility',
    description: 'See every concession stand, suite, and kitchen from one dashboard. Know instantly when something needs attention.',
    stat: 'Real-time',
    statLabel: 'Multi-point visibility',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
];

const problems = [
  {
    icon: CalendarDays,
    title: 'Event-Day Complexity',
    description: 'Stadium and venue food service faces massive demand spikes. Thousands of meals served in hours, with no room for food safety failures.'
  },
  {
    icon: Users,
    title: 'Temporary & Seasonal Staff',
    description: 'Event operations rely on temporary workers who may not know your compliance procedures. Training time is limited.'
  },
  {
    icon: Thermometer,
    title: 'Multiple Service Points',
    description: 'Dozens of concession stands, suites, and catering kitchens operating simultaneously. Manual monitoring can\'t cover it all.'
  },
  {
    icon: AlertTriangle,
    title: 'High-Profile Risk',
    description: 'A food safety incident at a major venue makes headlines. Reputation damage extends far beyond the single event.'
  },
];

const solutions = [
  {
    icon: Zap,
    title: 'Event-Ready Workflows',
    description: 'Pre-configured checklists for event days that guide staff through critical checks. Works even with temporary workers.',
    benefit: 'Consistent compliance on the busiest days'
  },
  {
    icon: Thermometer,
    title: 'Multi-Point Temperature Monitoring',
    description: 'Sensors across all service points feed into a single dashboard. See every holding unit, fridge, and hot box in real-time.',
    benefit: 'Complete visibility across the venue'
  },
  {
    icon: FileCheck,
    title: 'Instant Documentation',
    description: 'Digital records captured automatically. No paper to manage on hectic event days. Full audit trail for every check.',
    benefit: 'Inspection-ready without the paperwork'
  },
  {
    icon: BarChart3,
    title: 'Post-Event Analytics',
    description: 'Review compliance performance after every event. Identify issues, track trends, and continuously improve operations.',
    benefit: 'Learn and improve from every event'
  },
];

const differentiators = [
  {
    title: 'Built for High-Volume Operations',
    description: 'CheckIt handles the intensity of event-day food service. Our platform performs when thousands of meals are at stake.'
  },
  {
    title: 'Works with Any Workforce',
    description: 'Intuitive interfaces that temporary staff can use immediately. Minimal training required, maximum compliance achieved.'
  },
  {
    title: 'Trusted by Industry Leaders',
    description: 'OVG and ISS rely on CheckIt for their venue and facilities operations. We understand the food service business.'
  },
];

export default function FoodFacilitiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link 
            href="/industries" 
            className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Industries
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-purple-500/10 text-purple-400 rounded-full">
                  V6 Platform
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Food Safety for{' '}
                <span className="text-gradient">Venues & Food Service</span>
              </h1>
              
              <p className="text-lg text-muted mb-8">
                From stadiums to corporate catering, CheckIt helps food facilities 
                maintain compliance even on the busiest event days.
              </p>
              
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Trusted By</h3>
              <div className="grid grid-cols-2 gap-4">
                {['OVG', 'ISS'].map((customer) => (
                  <div key={customer} className="bg-surface-elevated rounded-lg p-4 text-center">
                    <span className="text-sm font-medium text-muted">{customer}</span>
                  </div>
                ))}
              </div>
              <Link 
                href="/case-studies/texas-tech"
                className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-red-600/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-600/20 transition-colors"
              >
                Read Texas Tech Case Study
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-purple-500/10 text-purple-400 rounded-full mb-4">
              Outcomes That Matter
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Safety. Compliance. Visibility.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              When thousands of guests are counting on you, Checkit ensures food safety, 
              compliance confidence, and complete operational visibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;
              return (
                <div key={outcome.title} className="bg-surface border border-border rounded-xl p-6 text-center">
                  <div className={`w-14 h-14 mx-auto rounded-xl ${outcome.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${outcome.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{outcome.title}</h3>
                  <p className="text-muted text-sm mb-4">{outcome.description}</p>
                  <div className={`inline-block ${outcome.bgColor} rounded-lg px-4 py-2`}>
                    <span className={`text-xl font-bold ${outcome.color}`}>{outcome.stat}</span>
                    <span className="text-xs text-muted block">{outcome.statLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Challenges You Face
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Food facilities operate in high-pressure environments where compliance 
              must be maintained despite complexity and volume.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {problems.map((problem) => {
              const Icon = problem.icon;
              return (
                <div key={problem.title} className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-error" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {problem.title}
                      </h3>
                      <p className="text-muted text-sm">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How CheckIt Solves It
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Our V6 platform is built for the intensity of food service operations, 
              delivering compliance without slowing you down.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <div key={solution.title} className="bg-surface border border-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {solution.title}
                      </h3>
                      <p className="text-muted text-sm mb-3">
                        {solution.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-success">
                        <CheckCircle2 className="w-4 h-4" />
                        {solution.benefit}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Components */}
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Complete Solution
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Sensors, mobile apps, and cloud platform designed for the unique demands 
              of high-volume event food service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {productComponents.map((component) => {
              const Icon = component.icon;
              return (
                <div key={component.title} className="bg-surface border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{component.title}</h3>
                  <p className="text-sm text-muted">{component.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why CheckIt for Food Facilities
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              We understand that food service operations can&apos;t slow down for compliance. 
              Our platform works at your pace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((diff, index) => (
              <div key={diff.title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-purple-400">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {diff.title}
                </h3>
                <p className="text-sm text-muted">
                  {diff.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Simplify Event-Day Compliance?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how CheckIt can help your food facilities maintain compliance 
            even during the busiest events.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-medium rounded-lg transition-colors"
            >
              View All Industries
            </Link>
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
