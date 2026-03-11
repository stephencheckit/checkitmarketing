import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Building2,
  ShoppingCart,
  UtensilsCrossed,
  Fuel,
  Coffee,
  Stethoscope,
  Beer,
  Wrench,
  FileText,
  BarChart3,
  GraduationCap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog & Resources | Checkit',
  description:
    'Explore Checkit resources — industry guides, case studies, platform overviews, and brochures for operational compliance and automated monitoring.',
  openGraph: {
    title: 'Blog & Resources | Checkit',
    description:
      'Industry guides, case studies, and platform resources for operational compliance teams.',
  },
};

const sections = [
  {
    title: 'Industry Brochures',
    description: 'Quick-start overviews tailored to your industry — share with your team or stakeholders.',
    items: [
      {
        href: '/brochures/forecourts',
        title: 'Forecourts',
        description: 'Automated monitoring and compliance for fuel retail and convenience operations.',
        icon: Fuel,
        color: 'from-amber-500 to-orange-500',
      },
      {
        href: '/brochures/food-to-go',
        title: 'Food to Go',
        description: 'HACCP temperature logging, food safety checklists, and multi-site dashboards.',
        icon: Coffee,
        color: 'from-orange-500 to-red-500',
      },
      {
        href: '/brochures/chain-dining',
        title: 'Chain Dining & Pub Groups',
        description: 'Compliance, cellar monitoring, and food safety for multi-site hospitality.',
        icon: Beer,
        color: 'from-purple-500 to-indigo-500',
      },
      {
        href: '/brochures/facilities',
        title: 'Facilities Management',
        description: 'Environmental monitoring, asset intelligence, and compliance automation.',
        icon: Wrench,
        color: 'from-teal-500 to-cyan-500',
      },
      {
        href: '/brochures/pharmacy',
        title: 'Pharmacy & Pathology (CAM+)',
        description: 'MHRA- and CQC-compliant cold chain monitoring for healthcare environments.',
        icon: Stethoscope,
        color: 'from-blue-500 to-indigo-500',
      },
    ],
  },
  {
    title: 'Industry Solutions',
    description: 'Deep dives into how Checkit serves specific verticals.',
    items: [
      {
        href: '/industries/senior-living',
        title: 'Senior Living',
        description: 'Compliance management and resident safety for senior care communities.',
        icon: Building2,
        color: 'from-blue-500 to-blue-600',
      },
      {
        href: '/industries/food-retail',
        title: 'Food Retail',
        description: 'Food safety and compliance for convenience stores and food-to-go operations.',
        icon: ShoppingCart,
        color: 'from-orange-500 to-orange-600',
      },
      {
        href: '/industries/food-facilities',
        title: 'Facilities Food Service',
        description: 'Operational compliance for venues, stadiums, and large-scale food service.',
        icon: UtensilsCrossed,
        color: 'from-purple-500 to-purple-600',
      },
    ],
  },
  {
    title: 'Case Studies',
    description: 'Real results from real operations teams.',
    items: [
      {
        href: '/case-studies/morningstar',
        title: 'Morningstar Senior Living',
        description: 'How Morningstar automated compliance across 41 communities — cutting audit prep and improving scores.',
        icon: FileText,
        color: 'from-emerald-500 to-green-600',
      },
      {
        href: '/case-studies/texas-tech',
        title: 'Texas Tech University',
        description: 'Digitizing food safety compliance with automated temperature monitoring at scale.',
        icon: GraduationCap,
        color: 'from-red-500 to-red-600',
      },
    ],
  },
  {
    title: 'Platform & Tools',
    description: 'Explore the Checkit platform and calculate your ROI.',
    items: [
      {
        href: '/platform',
        title: 'Platform Overview',
        description: 'Sensors, automated monitoring, digital checklists, reporting, and asset intelligence — all in one platform.',
        icon: BarChart3,
        color: 'from-cyan-500 to-blue-500',
      },
      {
        href: '/tools/paper-to-digital',
        title: 'Paper to Digital ROI Calculator',
        description: 'Estimate the savings from switching paper-based compliance to automated digital monitoring.',
        icon: BookOpen,
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-purple-500/5" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Resources & Insights
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Industry guides, case studies, and tools to help you modernise operations and stay compliant.
          </p>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section) => (
        <section
          key={section.title}
          className="py-12 border-t border-border first:border-t-0"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {section.title}
              </h2>
              <p className="text-muted">{section.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted mb-4">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent text-sm font-medium">
                      Read more
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-muted mb-8">
            See how Checkit can help you automate compliance and reduce
            operational risk across every site.
          </p>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
          >
            Explore the Platform
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
