import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShoppingCart,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Clock,
  AlertTriangle,
  Thermometer,
  FileCheck,
  Store,
  BarChart3,
  MapPin,
  Eye,
  ShieldCheck,
  Utensils,
  Wifi,
  Smartphone,
  Monitor
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Food Retail Compliance Software | Convenience Stores & Food-to-Go',
  description: 'Checkit helps food retailers maintain temperature compliance, food safety standards, and operational efficiency across hundreds of convenience stores and food-to-go locations. Trusted by BP and major retailers.',
  keywords: ['food retail compliance', 'convenience store food safety', 'food-to-go compliance', 'temperature monitoring retail', 'HACCP food retail'],
  openGraph: {
    title: 'Food Retail Compliance Software | Checkit',
    description: 'Food safety and compliance solutions for convenience stores and food-to-go operations.',
  },
  alternates: {
    canonical: 'https://checkit-marketing.vercel.app/industries/food-retail',
  },
};

// Product components for food retail
const productComponents = [
  {
    icon: Wifi,
    title: 'Sensors',
    description: 'Wireless monitoring of fridges, hot holding units, and display cases across every location.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Staff complete food safety checks, receive temperature alerts, and log corrective actions.',
  },
  {
    icon: Monitor,
    title: 'Platform',
    description: 'Estate-wide dashboards showing compliance status across hundreds of sites in real-time.',
  },
];

// Core outcomes for food retail
const outcomes = [
  {
    icon: Utensils,
    title: 'Food Safety',
    description: 'Protect customers with continuous temperature monitoring across fridges, hot holding, and display cases.',
    stat: '99.9%',
    statLabel: 'Temperature compliance',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: ShieldCheck,
    title: 'Compliance',
    description: 'Pass every EHO inspection with confidence. Complete digital records, always ready for review.',
    stat: '5-star',
    statLabel: 'Food hygiene ratings',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: Eye,
    title: 'Visibility',
    description: 'See compliance status across your entire estate in real-time. One dashboard for hundreds of sites.',
    stat: 'Real-time',
    statLabel: 'Multi-site visibility',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
];

const problems = [
  {
    icon: MapPin,
    title: 'Multi-Site Consistency',
    description: 'Maintaining food safety standards across hundreds of locations is challenging. Each site operates differently, creating compliance gaps.'
  },
  {
    icon: Thermometer,
    title: 'Food-to-Go Temperature Control',
    description: 'Hot holding, cold storage, and display cases require constant monitoring. Manual checks miss critical temperature excursions.'
  },
  {
    icon: Clock,
    title: 'High Staff Turnover',
    description: 'Convenience retail faces constant turnover. Paper-based training and compliance procedures don\'t scale.'
  },
  {
    icon: AlertTriangle,
    title: 'EHO Inspection Risk',
    description: 'Environmental Health Officers can visit any time. Incomplete records or compliance gaps threaten your food hygiene rating.'
  },
];

const solutions = [
  {
    icon: Store,
    title: 'Standardized Digital Workflows',
    description: 'Consistent food safety checks across all locations. Staff follow guided workflows on tablets, ensuring every site meets your standards.',
    benefit: 'Same high standards at every location'
  },
  {
    icon: Thermometer,
    title: 'Automated Temperature Monitoring',
    description: 'Continuous monitoring of fridges, hot holding, and display units. Automatic alerts when temperatures drift, with full audit trails.',
    benefit: 'Catch issues before food safety incidents'
  },
  {
    icon: FileCheck,
    title: 'Instant Compliance Records',
    description: 'Every check timestamped and stored securely. Generate EHO-ready reports in seconds. No more searching through paper logs.',
    benefit: 'Inspection-ready at every visit'
  },
  {
    icon: BarChart3,
    title: 'Portfolio-Wide Visibility',
    description: 'Real-time dashboards show compliance status across your entire estate. Identify underperforming sites and drive improvement.',
    benefit: 'Manage hundreds of sites from one view'
  },
];

const differentiators = [
  {
    title: 'Built for Retail Scale',
    description: 'CheckIt is designed for large multi-site operations. Our platform handles hundreds of locations without compromising performance.'
  },
  {
    title: 'Quick Site Rollout',
    description: 'Standardized deployment means new sites go live fast. Digital workflows scale as you grow, without proportional overhead.'
  },
  {
    title: 'Proven with Major Retailers',
    description: 'Trusted by BP and John Lewis Partners. We understand the operational realities of high-volume convenience retail.'
  },
];

export default function FoodRetailPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
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
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-orange-500/10 text-orange-400 rounded-full">
                  V6 Platform
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Food Safety at Scale for{' '}
                <span className="text-gradient">Food Retail</span>
              </h1>
              
              <p className="text-lg text-muted mb-8">
                From forecourts to convenience stores, CheckIt helps food retailers 
                maintain consistent compliance across every location.
              </p>
              
            </div>
            
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Trusted By</h3>
              <div className="grid grid-cols-2 gap-4">
                {['BP', 'John Lewis Partners'].map((customer) => (
                  <div key={customer} className="bg-surface-elevated rounded-lg p-4 text-center">
                    <span className="text-sm font-medium text-muted">{customer}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-4 text-center">
                Leading UK retailers trust CheckIt for food-to-go compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-orange-500/10 text-orange-400 rounded-full mb-4">
              Outcomes That Matter
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Safety. Compliance. Visibility.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Every feature drives toward protecting your customers, ensuring compliance, 
              and giving you complete visibility across your entire retail estate.
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
              Food retail operates on thin margins with high stakes. One food safety 
              incident can damage your brand across your entire network.
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
              Our V6 platform delivers consistent food safety compliance across 
              your entire retail estate, without adding operational burden.
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
              Sensors, mobile apps, and cloud platform working together to ensure 
              food safety across your entire retail estate.
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
              Why CheckIt for Food Retail
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              We understand the unique challenges of multi-site food retail 
              and have built our platform to address them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {differentiators.map((diff, index) => (
              <div key={diff.title} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-orange-400">{index + 1}</span>
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
            Ready to Standardize Your Compliance?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how CheckIt can help you maintain consistent food safety 
            standards across your entire retail portfolio.
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
