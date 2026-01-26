import Link from 'next/link';
import { 
  ArrowRight,
  Building2,
  ChefHat,
  Users,
  Shield
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

// Case studies data
const caseStudies = [
  {
    slug: 'texas-tech',
    title: 'Texas Tech University',
    subtitle: 'OVG Hospitality',
    description: 'How OVG Hospitality leverages Checkit to protect revenue and guest experience at scale in college football hospitality.',
    industry: 'Food Facilities',
    product: 'V6',
    color: 'from-red-600 to-red-700',
    stats: [
      { value: '2 Months', label: 'to ROI' },
      { value: '1 Hour', label: 'Fix Time' },
    ],
    featured: true,
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              Customer Success
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Real Results from{' '}
              <span className="text-gradient">Real Operations</span>
            </h1>
            <p className="text-lg text-muted mb-8">
              See how leading organizations use Checkit to transform compliance, 
              protect revenue, and deliver exceptional experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all card-glow"
              >
                {/* Featured Badge */}
                {study.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 text-amber-500 text-xs font-medium rounded-full">
                    Featured
                  </div>
                )}
                
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${study.color} p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{study.title}</h2>
                      <p className="text-white/80">{study.subtitle}</p>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 text-xs font-medium bg-surface-elevated text-muted rounded">
                      {study.industry}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
                      {study.product}
                    </span>
                  </div>
                  
                  <p className="text-muted mb-6">{study.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-6">
                    {study.stats.map((stat) => (
                      <div key={stat.label}>
                        <div className="text-xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Read More */}
                  <div className="flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                    Read Case Study
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}

            {/* Placeholder for future case studies */}
            <div className="bg-surface-elevated/30 border border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
                <ChefHat className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">More Stories Coming</h3>
              <p className="text-muted text-sm max-w-sm mb-6">
                We&apos;re documenting more customer success stories. Want to be featured?
              </p>
              <DemoRequestButton label="Share Your Story" />
            </div>
          </div>
        </div>
      </section>

      {/* Industry breakdown */}
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Success Across Industries
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Checkit delivers measurable results across multiple verticals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Food Facilities</h3>
              <p className="text-sm text-muted">Venues, stadiums, hospitality</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Senior Living</h3>
              <p className="text-sm text-muted">Resident safety, compliance</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Healthcare</h3>
              <p className="text-sm text-muted">Pharmacies, medical facilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how Checkit can transform your operations with the same results our customers achieve.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <DemoRequestButton label="Schedule a Demo" />
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface transition-colors"
            >
              Explore Industries
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
                <li><Link href="/industries/food-facilities" className="text-sm text-muted hover:text-foreground transition-colors">Food Facilities</Link></li>
                <li><Link href="/industries/senior-living" className="text-sm text-muted hover:text-foreground transition-colors">Senior Living</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Case Studies</h4>
              <ul className="space-y-2">
                <li><Link href="/case-studies/texas-tech" className="text-sm text-red-400 hover:text-red-300 transition-colors">Texas Tech (OVG)</Link></li>
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
