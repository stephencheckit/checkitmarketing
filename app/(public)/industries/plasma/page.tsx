import Link from 'next/link';
import { 
  Droplets,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Clock,
  AlertTriangle,
  Thermometer,
  FileCheck,
  BarChart3,
  Bell,
  Lock
} from 'lucide-react';

const problems = [
  {
    icon: Shield,
    title: 'FDA/AABB Compliance',
    description: 'Plasma collection centers operate under strict regulatory oversight. Any compliance gap can result in product loss or facility shutdown.'
  },
  {
    icon: Thermometer,
    title: 'Critical Temperature Control',
    description: 'Plasma products require precise temperature maintenance throughout collection, processing, and storage. Manual monitoring creates risk.'
  },
  {
    icon: Clock,
    title: 'Documentation Burden',
    description: 'Regulatory requirements demand complete, accurate records for every batch. Manual documentation is time-consuming and error-prone.'
  },
  {
    icon: AlertTriangle,
    title: 'Out-of-Hours Equipment Failures',
    description: 'Freezer failures outside operating hours can destroy thousands of dollars in plasma product. Response time is critical.'
  },
];

const solutions = [
  {
    icon: Thermometer,
    title: 'Continuous Temperature Monitoring',
    description: 'CAM+ sensors monitor freezers, refrigerators, and processing equipment 24/7. Automatic logging ensures complete temperature records.',
    benefit: 'Protect product integrity around the clock'
  },
  {
    icon: Bell,
    title: 'Intelligent Alert System',
    description: 'Instant alerts via SMS, email, and phone when temperatures drift out of range. Escalation paths ensure rapid response.',
    benefit: 'Minutes to respond, not hours'
  },
  {
    icon: FileCheck,
    title: 'Regulatory-Ready Documentation',
    description: 'Every temperature reading logged automatically with full audit trail. Generate compliance reports for FDA, AABB, and client audits instantly.',
    benefit: 'Always audit-ready'
  },
  {
    icon: BarChart3,
    title: 'Multi-Center Visibility',
    description: 'Centralized dashboard shows compliance status across all your plasma centers. Benchmark performance and identify issues proactively.',
    benefit: 'Enterprise-wide oversight'
  },
];

const differentiators = [
  {
    title: 'Built for Plasma & Biologics',
    description: 'CAM+ is designed specifically for the unique regulatory requirements and operational needs of plasma collection and biological products.'
  },
  {
    title: 'Enterprise-Grade Reliability',
    description: 'Redundant sensors, cellular connectivity, and battery backup ensure continuous monitoring even during power outages.'
  },
  {
    title: 'Trusted by Industry Leaders',
    description: 'Octapharma and Grifols rely on CAM+ for their plasma center operations. We understand the stakes.'
  },
];

export default function PlasmaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
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
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-red-500/10 text-red-400 rounded-full">
                  CAM+ Platform
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Critical Monitoring for{' '}
                <span className="text-gradient">Plasma Centers</span>
              </h1>
              
              <p className="text-lg text-muted mb-8">
                Protect your plasma inventory, maintain FDA/AABB compliance, and 
                ensure product integrity with CAM+ automated monitoring.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:sales@checkit.net?subject=Plasma Center CAM+ Demo Request"
                  className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-medium rounded-lg"
                >
                  Request a Demo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Coverage</h3>
              <div className="space-y-3">
                {[
                  { label: 'FDA 21 CFR Part 606', desc: 'Blood establishment regulations' },
                  { label: 'AABB Standards', desc: 'Blood bank accreditation' },
                  { label: 'Client Audits', desc: 'Pharmaceutical customer requirements' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 bg-surface-elevated rounded-lg p-3">
                    <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground text-sm">{item.label}</span>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">Trusted By</h4>
                <div className="flex gap-4">
                  {['Octapharma', 'Grifols'].map((customer) => (
                    <span key={customer} className="text-xs text-muted bg-surface-elevated px-2 py-1 rounded">
                      {customer}
                    </span>
                  ))}
                </div>
              </div>
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
              Plasma collection operates at the intersection of healthcare and manufacturing, 
              with regulatory requirements from multiple agencies.
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
              How CAM+ Solves It
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Connected Automated Monitoring Plus delivers the reliability and 
              documentation your plasma operations demand.
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
              Why CAM+ for Plasma
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              When product integrity and patient safety are at stake, you need 
              monitoring you can trust completely.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((diff, index) => (
              <div key={diff.title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-red-400">{index + 1}</span>
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
            Ready to Protect Your Plasma Inventory?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how CAM+ can help your plasma centers maintain compliance 
            and protect product integrity around the clock.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:sales@checkit.net?subject=Plasma Center CAM+ Demo Request"
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
