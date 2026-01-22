import Link from 'next/link';
import { 
  Building2, 
  Pill, 
  ShoppingCart, 
  UtensilsCrossed, 
  Droplets,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
  BarChart3
} from 'lucide-react';

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
    href: '/industries/nhs-pharmacies',
    name: 'NHS Pharmacies',
    icon: Pill,
    description: 'Connected automated monitoring for pharmaceutical compliance',
    customers: ['NHS Trust Partners'],
    product: 'CAM+',
    color: 'from-emerald-500 to-emerald-600'
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
    name: 'Food Facilities',
    icon: UtensilsCrossed,
    description: 'Food service operations for venues, stadiums, and events',
    customers: ['OVG', 'ISS'],
    product: 'V6',
    color: 'from-purple-500 to-purple-600'
  },
  {
    href: '/industries/plasma',
    name: 'Plasma',
    icon: Droplets,
    description: 'FDA/AABB compliant monitoring for plasma collection centers',
    customers: ['Octapharma', 'Grifols'],
    product: 'CAM+',
    color: 'from-red-500 to-red-600'
  },
];

const valueProps = [
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
    icon: BarChart3,
    title: 'Real-Time Visibility',
    description: 'Instant insights across all locations. Identify issues before they become problems.'
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
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Industry-Specific Solutions for{' '}
              <span className="text-gradient">Operational Excellence</span>
            </h1>
            <p className="text-lg text-muted mb-8">
              From senior living to plasma centers, CheckIt delivers purpose-built compliance 
              and monitoring solutions that transform how organizations operate.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:sales@checkit.net?subject=Demo Request"
                className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-medium rounded-lg"
              >
                Request a Demo
                <ArrowRight className="w-4 h-4" />
              </a>
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
              href="mailto:sales@checkit.net?subject=Demo Request"
              className="inline-flex items-center gap-2 px-6 py-3 btn-gradient text-white font-medium rounded-lg"
            >
              Schedule a Demo
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:info@checkit.net?subject=General Inquiry"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface transition-colors"
            >
              Contact Us
            </a>
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
