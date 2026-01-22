import Link from 'next/link';
import { 
  Building2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Thermometer,
  FileCheck,
  BarChart3,
  UtensilsCrossed,
  Hotel,
  Coffee,
  Warehouse,
  Eye,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

// Core outcomes for operations
const outcomes = [
  {
    icon: Utensils,
    title: 'Safety',
    description: 'Protect customers and staff with automated monitoring. From food temps to equipment checks, nothing falls through the cracks.',
    stat: '99.9%',
    statLabel: 'Task completion',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: ShieldCheck,
    title: 'Compliance',
    description: 'Meet health, safety, and brand standards with digital workflows. Complete records, always audit-ready.',
    stat: '100%',
    statLabel: 'Digital audit trails',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: Eye,
    title: 'Visibility',
    description: 'See operational status across all locations in real-time. Identify issues, compare performance, drive improvement.',
    stat: 'Real-time',
    statLabel: 'Multi-site monitoring',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
];

const problems = [
  {
    icon: AlertTriangle,
    title: 'Inconsistent Compliance',
    description: 'Without standardized processes, each location operates differently. Compliance gaps emerge and grow until they become incidents.'
  },
  {
    icon: Clock,
    title: 'Paper-Based Processes',
    description: 'Manual logs and checklists are time-consuming, easy to forget, and difficult to audit. Records get lost or damaged.'
  },
  {
    icon: Thermometer,
    title: 'Temperature Management',
    description: 'Food storage, HVAC, and equipment monitoring require constant attention. Manual checks miss critical issues between readings.'
  },
  {
    icon: Building2,
    title: 'Multi-Site Visibility',
    description: 'Regional and operations managers struggle to see what\'s happening across locations. Problems stay hidden until they escalate.'
  },
];

const solutions = [
  {
    icon: FileCheck,
    title: 'Digital Checklists & Workflows',
    description: 'Replace paper with intuitive digital workflows. Staff complete tasks on tablets or phones with built-in guidance and validation.',
    benefit: 'Standardize operations across all locations'
  },
  {
    icon: Thermometer,
    title: 'Automated Monitoring',
    description: 'Continuous monitoring of refrigeration, HVAC, and critical equipment. Automatic alerts when conditions drift out of range.',
    benefit: 'Catch issues before they become incidents'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Dashboards',
    description: 'See compliance status across all your locations instantly. Identify trends, compare performance, and address issues proactively.',
    benefit: 'Complete visibility at every level'
  },
  {
    icon: Clock,
    title: 'Audit-Ready Records',
    description: 'Every check timestamped and stored securely. Generate compliance reports in seconds. No more searching through paper logs.',
    benefit: 'Be inspection-ready any time'
  },
];

const segments = [
  {
    icon: UtensilsCrossed,
    title: 'Restaurants',
    description: 'Food safety compliance, temperature monitoring, and operational checklists for restaurant chains and QSRs.',
  },
  {
    icon: Hotel,
    title: 'Hospitality',
    description: 'Guest safety, HVAC monitoring, and operational compliance for hotels, resorts, and hospitality venues.',
  },
  {
    icon: Coffee,
    title: 'Food & Beverage',
    description: 'Production compliance, quality checks, and temperature management for F&B manufacturing and distribution.',
  },
  {
    icon: Warehouse,
    title: 'Facilities',
    description: 'Environmental monitoring, maintenance workflows, and compliance tracking for commercial facilities.',
  },
];

const differentiators = [
  {
    title: 'Flexible for Any Operation',
    description: 'CheckIt adapts to your processes, not the other way around. Configure workflows that match how your teams actually work.'
  },
  {
    title: 'Scales With You',
    description: 'From a handful of locations to hundreds, our platform handles growth without adding proportional overhead.'
  },
  {
    title: 'Rapid Deployment',
    description: 'Intuitive interfaces mean minimal training. New locations go live fast with consistent processes from day one.'
  },
];

export default function OperationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 via-transparent to-transparent" />
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
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-slate-500/10 text-slate-400 rounded-full">
                  V6 Platform
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Operational Excellence{' '}
                <span className="text-gradient">Across Every Site</span>
              </h1>
              
              <p className="text-lg text-muted mb-8">
                From restaurants to hospitality, CheckIt helps multi-site operations 
                maintain consistent compliance and visibility across all locations.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <DemoRequestButton industry="Operations" />
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Use Cases</h3>
              <div className="grid grid-cols-2 gap-3">
                {segments.map((segment) => {
                  const Icon = segment.icon;
                  return (
                    <div key={segment.title} className="bg-surface-elevated rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-foreground text-sm">{segment.title}</span>
                      </div>
                      <p className="text-xs text-muted line-clamp-2">{segment.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-slate-500/10 text-slate-400 rounded-full mb-4">
              Outcomes That Matter
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Safety. Compliance. Visibility.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              V6 transforms operations across every location—protecting customers, 
              ensuring compliance, and giving you complete visibility.
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
              Multi-site operations struggle with consistency, visibility, and 
              the burden of paper-based compliance processes.
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
              Our V6 platform brings consistency and visibility to multi-site 
              operations without adding administrative burden.
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
              Why CheckIt for Operations
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              We understand that every operation is different. Our platform is 
              built to adapt to your needs, not force you into a box.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((diff, index) => (
              <div key={diff.title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-500/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-slate-400">{index + 1}</span>
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
            Ready to Standardize Your Operations?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how CheckIt can help you maintain consistency and visibility 
            across all your locations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <DemoRequestButton industry="Operations" label="Schedule a Demo" />
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
              <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:sales@checkit.net" className="text-sm text-muted hover:text-foreground transition-colors">Request Demo</a></li>
                <li><a href="mailto:info@checkit.net" className="text-sm text-muted hover:text-foreground transition-colors">General Inquiries</a></li>
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
