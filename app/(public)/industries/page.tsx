import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  ShoppingCart, 
  UtensilsCrossed, 
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
  Layers,
  Globe2,
  Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industries We Serve | Senior Living, Food Retail & Facilities',
  description: 'Checkit delivers industry-specific compliance and monitoring solutions for senior living communities, food retail operations, and facilities food service. Purpose-built for multi-site operational excellence.',
  openGraph: {
    title: 'Industries We Serve | Checkit',
    description: 'Purpose-built compliance and monitoring solutions for senior living, food retail, and facilities food service.',
  },
  alternates: {
    canonical: 'https://checkit-marketing.vercel.app/industries',
  },
};

const industries = [
  {
    href: '/industries/senior-living',
    name: 'Senior Living',
    icon: Building2,
    description: 'Compliance management and resident safety for senior care communities',
    customers: ['Morningstar', 'PLC', 'Atria'],
    product: 'V6',
    color: 'from-blue-500 to-blue-600'
  },
  {
    href: '/industries/food-retail',
    name: 'Food Retail',
    icon: ShoppingCart,
    description: 'Food safety and compliance for convenience stores and food-to-go',
    customers: ['BP', 'John Lewis Partners'],
    product: 'V6',
    color: 'from-orange-500 to-orange-600'
  },
  {
    href: '/industries/food-facilities',
    name: 'Facilities Food Service',
    icon: UtensilsCrossed,
    description: 'Food service operations for venues, stadiums, and events',
    customers: ['OVG', 'ISS'],
    product: 'V6',
    color: 'from-purple-500 to-purple-600'
  },
];

const valueProps = [
  {
    icon: Globe2,
    title: 'Multi-Site Control',
    description: 'One platform for all your locations. Standardize operations, compare performance, and manage compliance centrally.'
  },
  {
    icon: Shield,
    title: 'Regulatory Compliance',
    description: 'Meet and exceed industry-specific regulatory requirements with automated monitoring and documentation.'
  },
  {
    icon: Clock,
    title: 'Operational Efficiency',
    description: 'Eliminate paper-based processes and manual data entry. Free your teams to focus on what matters.'
  },
  {
    icon: CheckCircle2,
    title: 'Audit-Ready Always',
    description: 'Complete digital records with full traceability. Be confident in every inspection.'
  },
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Network grid background */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300A3E0' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='%2300A3E0' stroke-width='0.5' stroke-opacity='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Globe/network visualization */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Globe circles */}
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            <circle cx="200" cy="200" r="90" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            <ellipse cx="200" cy="200" rx="150" ry="60" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            <ellipse cx="200" cy="200" rx="60" ry="150" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-accent" />
            {/* Connection nodes */}
            <circle cx="200" cy="50" r="4" fill="currentColor" className="text-accent" />
            <circle cx="320" cy="140" r="4" fill="currentColor" className="text-accent" />
            <circle cx="340" cy="220" r="4" fill="currentColor" className="text-accent" />
            <circle cx="280" cy="320" r="4" fill="currentColor" className="text-accent" />
            <circle cx="120" cy="300" r="4" fill="currentColor" className="text-accent" />
            <circle cx="80" cy="180" r="4" fill="currentColor" className="text-accent" />
            <circle cx="140" cy="100" r="4" fill="currentColor" className="text-accent" />
            {/* Connection lines */}
            <line x1="200" y1="50" x2="320" y2="140" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="320" y1="140" x2="340" y2="220" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="340" y1="220" x2="280" y2="320" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="280" y1="320" x2="120" y2="300" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="120" y1="300" x2="80" y2="180" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="80" y1="180" x2="140" y2="100" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
            <line x1="140" y1="100" x2="200" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto lg:text-left lg:max-w-2xl lg:mx-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Industry-Specific Solutions for{' '}
              <span className="text-gradient">Forward Thinking Operations</span>
            </h1>
            <p className="text-lg text-muted mb-8">
              From senior living to food service, Checkit delivers purpose-built compliance 
              and monitoring solutions that transform how multi-site organizations operate.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 text-sm">
            <div className="flex items-center gap-2 text-muted">
              <Layers className="w-4 h-4 text-accent" />
              <span><strong className="text-foreground">Fully Connected</strong> Operational Ecosystem</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Globe2 className="w-4 h-4 text-accent" />
              <span><strong className="text-foreground">Multi-Site</strong> Operations Platform</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Award className="w-4 h-4 text-accent" />
              <span>ISO 17025 &amp; UKAS Accredited</span>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Markets We Serve
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Each industry has unique challenges. Our solutions are tailored to meet 
              the specific compliance, safety, and operational needs of your sector.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <Link
                  key={industry.href}
                  href={industry.href}
                  className="group bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all card-glow"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${industry.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {industry.name}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-surface-elevated text-muted rounded">
                      {industry.product}
                    </span>
                  </div>
                  
                  <p className="text-muted text-sm mb-4">
                    {industry.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {industry.customers.slice(0, 2).map((customer) => (
                        <span key={customer} className="text-xs text-muted/70">
                          {customer}{industry.customers.indexOf(customer) < Math.min(industry.customers.length - 1, 1) ? ',' : ''}
                        </span>
                      ))}
                      {industry.customers.length > 2 && (
                        <span className="text-xs text-muted/70">+{industry.customers.length - 2} more</span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 lg:py-20 bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Organizations Choose CheckIt
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Trusted by leading organizations across multiple industries to ensure 
              compliance, safety, and operational excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <div key={prop.title} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-muted">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how CheckIt can help your organization achieve compliance confidence, 
            operational efficiency, and real-time visibility across all your locations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.checkit.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-medium rounded-lg transition-colors"
            >
              Learn More at Checkit.net
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
