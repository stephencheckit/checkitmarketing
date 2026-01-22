import Link from 'next/link';
import { 
  Pill,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Clock,
  AlertTriangle,
  Thermometer,
  FileCheck,
  Bell,
  BarChart3,
  Lock,
  Eye,
  ShieldCheck
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

// Core outcomes for NHS pharmacies
const outcomes = [
  {
    icon: Thermometer,
    title: 'Medication Safety',
    description: 'Protect patients with 24/7 fridge monitoring. Automatic alerts catch excursions before medication is compromised.',
    stat: '24/7',
    statLabel: 'Continuous monitoring',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: ShieldCheck,
    title: 'GPhC Compliance',
    description: 'Meet every GPhC requirement with automated logging, controlled drugs tracking, and complete audit trails.',
    stat: '100%',
    statLabel: 'Audit-ready records',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  {
    icon: Eye,
    title: 'Visibility',
    description: 'See temperature status across all branches instantly. Regional managers monitor compliance from anywhere.',
    stat: 'Real-time',
    statLabel: 'Multi-branch visibility',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
];

const problems = [
  {
    icon: Thermometer,
    title: 'Fridge Temperature Monitoring',
    description: 'Manual temperature logging is time-consuming and risks medication spoilage going undetected. GPhC requires continuous monitoring.'
  },
  {
    icon: Lock,
    title: 'Controlled Drugs Compliance',
    description: 'CD register checks, balance verification, and audit trails are critical but burdensome. Any gaps create significant compliance risk.'
  },
  {
    icon: AlertTriangle,
    title: 'Out-of-Hours Incidents',
    description: 'Equipment failures outside working hours can lead to thousands of pounds in wasted medication and patient safety concerns.'
  },
  {
    icon: Clock,
    title: 'Manual Documentation Burden',
    description: 'Pharmacists and technicians spend valuable time on paperwork instead of patient care. Records are scattered and hard to retrieve.'
  },
];

const solutions = [
  {
    icon: Thermometer,
    title: 'Continuous Temperature Monitoring',
    description: 'CAM+ sensors monitor fridge and ambient temperatures 24/7. Automatic logging eliminates manual checks while ensuring GPhC compliance.',
    benefit: 'Never miss a temperature excursion'
  },
  {
    icon: Bell,
    title: 'Intelligent Alerting',
    description: 'Receive instant alerts via SMS, email, or app when temperatures drift out of range—day or night. Escalation ensures issues never go unaddressed.',
    benefit: 'Protect medication inventory around the clock'
  },
  {
    icon: FileCheck,
    title: 'Digital CD Monitoring',
    description: 'Streamlined controlled drugs workflows with digital balance checks, audit trails, and discrepancy flagging. Always inspection-ready.',
    benefit: 'Reduce CD compliance burden by 60%'
  },
  {
    icon: BarChart3,
    title: 'Centralized Reporting',
    description: 'Multi-site dashboards show compliance status across your pharmacy network. Identify trends, benchmark performance, and generate reports instantly.',
    benefit: 'Enterprise visibility for pharmacy groups'
  },
];

const differentiators = [
  {
    title: 'Built for NHS Pharmacy',
    description: 'CAM+ is designed specifically for UK pharmacy compliance requirements, including GPhC standards and NHS contractual obligations.'
  },
  {
    title: 'Proven Reliability',
    description: 'Enterprise-grade sensors and redundant connectivity ensure continuous monitoring. Our uptime record speaks for itself.'
  },
  {
    title: 'Rapid Deployment',
    description: 'Non-invasive sensor installation means minimal disruption to your pharmacy. Most sites are live within a single day.'
  },
];

export default function NHSPharmaciesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
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
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                  CAM+ Platform
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Connected Automated Monitoring for{' '}
                <span className="text-gradient">NHS Pharmacies</span>
              </h1>
              
              <p className="text-lg text-muted mb-8">
                Protect your medication inventory, streamline compliance, and give your team 
                more time for patient care with CAM+ automated monitoring.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <DemoRequestButton industry="NHS Pharmacies" />
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Coverage</h3>
              <div className="space-y-3">
                {[
                  { label: 'GPhC Standards', desc: 'Continuous temperature monitoring' },
                  { label: 'CD Regulations', desc: 'Digital controlled drugs workflows' },
                  { label: 'NHS Contract', desc: 'Service requirement documentation' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 bg-surface-elevated rounded-lg p-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
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

      {/* Outcomes Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-emerald-500/10 text-emerald-400 rounded-full mb-4">
              Outcomes That Matter
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Safety. Compliance. Visibility.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              CAM+ is purpose-built to protect patients, ensure GPhC compliance, 
              and give pharmacy teams complete visibility into their operations.
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
              NHS pharmacies operate under intense regulatory scrutiny while managing 
              increasing workloads. Manual processes create risk and inefficiency.
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
              Connected Automated Monitoring Plus delivers continuous compliance 
              without the manual burden, protecting both your patients and your business.
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
              Why CAM+ for NHS Pharmacies
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Purpose-built for UK pharmacy compliance with the reliability 
              and support your operation demands.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((diff, index) => (
              <div key={diff.title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-emerald-400">{index + 1}</span>
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
            Ready to Automate Your Compliance?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how CAM+ can protect your medication inventory and streamline 
            your compliance workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <DemoRequestButton industry="NHS Pharmacies" label="Schedule a Demo" />
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
