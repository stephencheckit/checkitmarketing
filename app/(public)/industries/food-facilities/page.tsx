import Link from 'next/link';
import { 
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Thermometer,
  FileCheck,
  Users,
  BarChart3,
  CalendarDays,
  Zap
} from 'lucide-react';

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
              
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:sales@checkit.net?subject=Food Facilities Demo Request"
                  className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-medium rounded-lg"
                >
                  Request a Demo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
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
              <p className="text-xs text-muted mt-4 text-center">
                Leading venue and facilities operators trust CheckIt
              </p>
            </div>
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

      {/* Why Different Section */}
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
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
            <a
              href="mailto:sales@checkit.net?subject=Food Facilities Demo Request"
              className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-medium rounded-lg"
            >
              Schedule a Demo
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface transition-colors"
            >
              View All Industries
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-5 opacity-60"
            />
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} Checkit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
