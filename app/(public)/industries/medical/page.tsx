import Link from 'next/link';
import { 
  Droplets,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Clock,
  AlertTriangle,
  Thermometer,
  FileCheck,
  BarChart3,
  Bell,
  FlaskConical,
  GraduationCap
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

const problems = [
  {
    icon: Shield,
    title: 'Complex Regulatory Landscape',
    description: 'FDA, AABB, GxP, and institutional requirements create overlapping compliance demands. Manual systems struggle to keep up.'
  },
  {
    icon: Thermometer,
    title: 'Critical Temperature Control',
    description: 'Biologics, samples, and reagents require precise temperature maintenance. Any excursion can destroy irreplaceable materials.'
  },
  {
    icon: Clock,
    title: 'Documentation Burden',
    description: 'Regulatory audits demand complete, accurate records for every process. Manual documentation is time-consuming and error-prone.'
  },
  {
    icon: AlertTriangle,
    title: 'Out-of-Hours Equipment Failures',
    description: 'Freezer or incubator failures outside operating hours can destroy thousands in product or years of research. Response time is critical.'
  },
];

const solutions = [
  {
    icon: Thermometer,
    title: 'Continuous Environmental Monitoring',
    description: 'CAM+ sensors monitor freezers, refrigerators, incubators, and clean rooms 24/7. Automatic logging ensures complete environmental records.',
    benefit: 'Protect critical materials around the clock'
  },
  {
    icon: Bell,
    title: 'Intelligent Alert System',
    description: 'Instant alerts via SMS, email, and phone when conditions drift out of range. Escalation paths ensure rapid response day or night.',
    benefit: 'Minutes to respond, not hours'
  },
  {
    icon: FileCheck,
    title: 'Audit-Ready Documentation',
    description: 'Every reading logged automatically with full audit trail. Generate compliance reports for FDA, AABB, GxP, and institutional audits instantly.',
    benefit: 'Always inspection-ready'
  },
  {
    icon: BarChart3,
    title: 'Multi-Facility Visibility',
    description: 'Centralized dashboard shows compliance status across all your facilities. Benchmark performance and identify issues proactively.',
    benefit: 'Enterprise-wide oversight'
  },
];

const segments = [
  {
    icon: Droplets,
    title: 'Plasma Collection',
    description: 'FDA 21 CFR Part 606 and AABB compliance for plasma centers. Protect inventory and maintain regulatory standing.',
    customers: 'Octapharma, Grifols'
  },
  {
    icon: FlaskConical,
    title: 'Pharmaceutical',
    description: 'GxP-compliant monitoring for manufacturing, storage, and distribution. Meet FDA, EMA, and MHRA requirements.',
    customers: 'Pharma manufacturers'
  },
  {
    icon: GraduationCap,
    title: 'Universities & Research',
    description: 'Protect irreplaceable samples and research materials. Meet institutional and grant compliance requirements.',
    customers: 'Research institutions'
  },
];

const differentiators = [
  {
    title: 'Built for Regulated Environments',
    description: 'CAM+ is designed specifically for the unique regulatory requirements of medical, pharmaceutical, and research applications.'
  },
  {
    title: 'Enterprise-Grade Reliability',
    description: 'Redundant sensors, cellular connectivity, and battery backup ensure continuous monitoring even during power outages.'
  },
  {
    title: 'Proven in Critical Applications',
    description: 'Trusted by Octapharma, Grifols, and leading research institutions. We understand the stakes when materials are irreplaceable.'
  },
];

export default function MedicalPage() {
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
                <span className="text-gradient">Medical & Research</span>
              </h1>
              
              <p className="text-lg text-muted mb-8">
                From plasma centers to university labs, CAM+ delivers the reliability and 
                documentation that regulated medical environments demand.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <DemoRequestButton industry="Medical" />
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Coverage</h3>
              <div className="space-y-3">
                {[
                  { label: 'FDA 21 CFR Part 606', desc: 'Blood establishment regulations' },
                  { label: 'AABB Standards', desc: 'Blood bank accreditation' },
                  { label: 'GxP Compliance', desc: 'Pharmaceutical manufacturing' },
                  { label: 'Institutional Requirements', desc: 'University & research standards' },
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
            </div>
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Markets We Serve
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              CAM+ is trusted across the medical and research spectrum for critical 
              environmental monitoring and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {segments.map((segment) => {
              const Icon = segment.icon;
              return (
                <div key={segment.title} className="bg-surface border border-border rounded-xl p-6">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {segment.title}
                  </h3>
                  <p className="text-muted text-sm mb-3">
                    {segment.description}
                  </p>
                  <p className="text-xs text-muted/70">
                    {segment.customers}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Challenges You Face
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Medical and research environments operate under intense regulatory scrutiny 
              where equipment failures can destroy irreplaceable materials.
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
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How CAM+ Solves It
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Connected Automated Monitoring Plus delivers the reliability and 
              documentation your regulated environment demands.
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
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why CAM+ for Medical & Research
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              When materials are irreplaceable and compliance is non-negotiable, 
              you need monitoring you can trust completely.
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
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Protect Your Critical Materials?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how CAM+ can help your facility maintain compliance 
            and protect irreplaceable materials around the clock.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <DemoRequestButton industry="Medical" label="Schedule a Demo" />
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
