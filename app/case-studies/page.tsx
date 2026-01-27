import Link from 'next/link';
import { 
  ArrowRight,
  Building2,
  ChefHat,
  Users,
  Shield
} from 'lucide-react';

// Case studies data
const caseStudies = [
  {
    slug: 'texas-tech',
    title: 'Texas Tech University',
    subtitle: 'OVG Hospitality',
    description: 'How OVG Hospitality leverages Checkit to protect revenue and guest experience at scale in college football hospitality.',
    industry: 'Food Facilities',
    product: 'V6',
    stats: [
      { value: '2 Months', label: 'to ROI' },
      { value: '1 Hour', label: 'Fix Time' },
    ],
    featured: true,
    logo: '/TexasTech_logo.png',
  },
  {
    slug: 'morningstar',
    title: 'Morningstar Senior Living',
    subtitle: 'Senior Living Dining & Compliance',
    description: 'How Morningstar modernized food safety and compliance across 41 communities, delivering consistent resident wellness at scale.',
    industry: 'Senior Living',
    product: 'V6',
    stats: [
      { value: '41', label: 'Communities' },
      { value: '100%', label: 'Audit Trail' },
    ],
    featured: true,
    logo: '/morningstar-logo-500x125.png',
    logoBgWhite: true,
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent/20 text-accent rounded-full mb-4">
              Customer Success
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Real Results from Real Operations
            </h1>
            <p className="text-lg text-muted">
              See how leading organizations use Checkit to transform compliance, 
              protect revenue, and deliver exceptional experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group block bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Dark or white background for logo visibility */}
                  <div className={`p-6 md:p-8 md:w-1/3 flex flex-col justify-center ${(study as typeof study & { logoBgWhite?: boolean }).logoBgWhite ? 'bg-white border-r border-gray-200' : 'bg-gray-950'}`}>
                    {study.logo ? (
                      <img 
                        src={study.logo} 
                        alt={study.title}
                        className="h-16 w-auto object-contain mb-4"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                    )}
                    <h2 className={`text-2xl font-bold mb-1 ${(study as typeof study & { logoBgWhite?: boolean }).logoBgWhite ? 'text-gray-900' : 'text-white'}`}>{study.title}</h2>
                    <p className={(study as typeof study & { logoBgWhite?: boolean }).logoBgWhite ? 'text-gray-500' : 'text-white/70'}>{study.subtitle}</p>
                    
                    {study.featured && (
                      <span className={`inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full w-fit ${(study as typeof study & { logoBgWhite?: boolean }).logoBgWhite ? 'bg-gray-100 text-gray-700' : 'bg-white/20 text-white'}`}>
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Right side - Content */}
                  <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center bg-surface">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 text-xs font-medium bg-surface-elevated text-muted rounded border border-border">
                        {study.industry}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded">
                        {study.product}
                      </span>
                    </div>
                    
                    <p className="text-muted mb-6">{study.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-8 mb-6">
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industry breakdown */}
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Success Across Industries
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Checkit delivers measurable results across multiple verticals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/industries/food-facilities" className="bg-surface border border-border rounded-xl p-6 text-center hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Food Facilities</h3>
              <p className="text-sm text-muted">Venues, stadiums, hospitality</p>
            </Link>
            <Link href="/industries/senior-living" className="bg-surface border border-border rounded-xl p-6 text-center hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Senior Living</h3>
              <p className="text-sm text-muted">Resident safety, compliance</p>
            </Link>
            <Link href="/industries/food-retail" className="bg-surface border border-border rounded-xl p-6 text-center hover:border-accent/50 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Food Retail</h3>
              <p className="text-sm text-muted">Convenience, food-to-go</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-muted mb-8">
            Join industry leaders who trust Checkit to protect their operations.
          </p>
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
          >
            Explore Solutions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
