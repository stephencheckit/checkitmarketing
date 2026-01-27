import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Clock,
  AlertTriangle,
  Users,
  FileCheck,
  Thermometer,
  ClipboardList,
  BarChart3,
  Eye,
  ShieldCheck,
  Utensils,
  Wifi,
  Smartphone,
  Monitor
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Senior Living Compliance Software | Food Safety & Resident Wellness',
  description: 'Checkit helps senior living communities maintain food safety compliance, protect resident wellness, and streamline culinary operations across multiple communities. Trusted by Morningstar, Atria, and leading operators.',
  keywords: ['senior living compliance', 'food safety senior care', 'resident wellness', 'HACCP senior living', 'culinary compliance software'],
  openGraph: {
    title: 'Senior Living Compliance Software | Checkit',
    description: 'Food safety and compliance solutions designed for senior living communities.',
  },
  alternates: {
    canonical: 'https://checkit-marketing.vercel.app/industries/senior-living',
  },
};

// Product components for senior living
const productComponents = [
  {
    icon: Wifi,
    title: 'Sensors',
    description: 'Wireless monitoring of fridges, food storage, and equipment—24/7, no manual checks.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Staff complete safety checks, receive alerts, and document corrective actions from any device.',
  },
  {
    icon: Monitor,
    title: 'Platform',
    description: 'Multi-community dashboards, compliance reports, and audit trails for regional oversight.',
  },
];

// Core outcomes for senior living
const outcomes = [
  {
    icon: Utensils,
    title: 'Safety',
    description: 'Protect residents with automated temperature monitoring for food service, cold storage, and critical equipment.',
    stat: '99.9%',
    statLabel: 'Temperature compliance',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: ShieldCheck,
    title: 'Compliance',
    description: 'Meet CQC and state requirements with complete digital audit trails. Every check documented automatically.',
    stat: '100%',
    statLabel: 'Audit-ready records',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: Eye,
    title: 'Visibility',
    description: 'Real-time dashboards across all communities. See compliance status, identify trends, and act before issues escalate.',
    stat: 'Real-time',
    statLabel: 'Multi-site monitoring',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
];

const problems = [
  {
    icon: AlertTriangle,
    title: 'Paper-Based Compliance',
    description: 'Manual logs and checklists are time-consuming, error-prone, and difficult to audit. Staff spend hours on documentation instead of resident care.'
  },
  {
    icon: Shield,
    title: 'Regulatory Pressure',
    description: 'CQC inspections and state compliance requirements demand complete, accurate records. Missing or incomplete documentation puts your license at risk.'
  },
  {
    icon: Clock,
    title: 'Inconsistent Task Completion',
    description: 'Without real-time visibility, managers can\'t ensure critical safety checks are completed on time across all shifts and locations.'
  },
  {
    icon: Users,
    title: 'Staff Turnover & Training',
    description: 'High turnover means constantly training new staff on compliance procedures. Paper systems make onboarding slow and inconsistent.'
  },
];

const solutions = [
  {
    icon: ClipboardList,
    title: 'Digital Checklists & Workflows',
    description: 'Replace paper with intuitive digital workflows. Staff complete checks on tablets or phones, with built-in guidance and validation.',
    benefit: 'Reduce documentation time by up to 50%'
  },
  {
    icon: Thermometer,
    title: 'Automated Temperature Monitoring',
    description: 'Continuous monitoring of cold storage, food holding, and critical equipment. Automatic alerts when temperatures drift out of range.',
    benefit: 'Catch issues before they become violations'
  },
  {
    icon: FileCheck,
    title: 'Audit-Ready Documentation',
    description: 'Every check is timestamped, signed, and stored securely. Generate complete compliance reports in seconds, not hours.',
    benefit: 'Be inspection-ready 24/7'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Dashboards',
    description: 'See compliance status across all communities instantly. Identify trends, compare performance, and proactively address issues.',
    benefit: 'Multi-site visibility at a glance'
  },
];

const differentiators = [
  {
    title: 'Purpose-Built for Senior Living',
    description: 'Not a generic solution adapted for care. Built from the ground up for the unique compliance and operational needs of senior living communities.'
  },
  {
    title: 'Implementation That Works',
    description: 'We understand the realities of care operations. Phased rollout, hands-on training, and support that ensures adoption across all staff levels.'
  },
  {
    title: 'Proven at Scale',
    description: 'Trusted by leading operators including Morningstar, PLC, and Atria. Hundreds of communities rely on CheckIt daily.'
  },
];

export default function SeniorLivingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />
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
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-blue-500/10 text-blue-400 rounded-full">
                  V6 Platform
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Senior Living Compliance,{' '}
                <span className="text-gradient">Simplified</span>
              </h1>
              
              <p className="text-lg text-muted mb-8">
                From cold storage to food safety, CheckIt helps senior living communities 
                maintain compliance, protect residents, and give staff more time for care.
              </p>
              
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Trusted By</h3>
              <div className="grid grid-cols-3 gap-4">
                {['Morningstar', 'PLC', 'Atria'].map((customer) => (
                  <div key={customer} className="bg-surface-elevated rounded-lg p-4 text-center">
                    <span className="text-sm font-medium text-muted">{customer}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-4 text-center">
                Hundreds of communities across the US rely on CheckIt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-blue-500/10 text-blue-400 rounded-full mb-4">
              Outcomes That Matter
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Safety. Compliance. Visibility.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Everything we do for senior living communities drives toward protecting 
              residents, ensuring compliance, and giving you complete operational visibility.
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
              Senior living operators juggle resident safety, regulatory compliance, 
              and operational efficiency—often with outdated tools.
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
              Our V6 platform transforms compliance from a burden into an advantage, 
              giving you confidence and your staff more time for residents.
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
              Sensors, mobile apps, and cloud platform working together to protect 
              your residents and simplify compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {productComponents.map((component) => {
              const Icon = component.icon;
              return (
                <div key={component.title} className="bg-surface border border-border rounded-xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
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
              Why CheckIt for Senior Living
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              We&apos;re not just another software vendor. We understand the unique 
              challenges of senior care operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((diff, index) => (
              <div key={diff.title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-accent">{index + 1}</span>
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
            Ready to Transform Your Compliance?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            Join hundreds of senior living communities that trust CheckIt for 
            compliance, safety, and operational excellence.
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
                <li><Link href="/industries/food-retail" className="text-sm text-muted hover:text-foreground transition-colors">Food Retail</Link></li>
                <li><Link href="/industries/food-facilities" className="text-sm text-muted hover:text-foreground transition-colors">Facilities Food Service</Link></li>
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
