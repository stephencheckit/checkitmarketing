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
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-700 rounded-full mb-4">
              Customer Success
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Real Results from Real Operations
            </h1>
            <p className="text-lg text-gray-600">
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
                className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-red-300 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left side - Red accent */}
                  <div className="bg-red-600 p-6 md:p-8 md:w-1/3 flex flex-col justify-center">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{study.title}</h2>
                    <p className="text-red-200">{study.subtitle}</p>
                    
                    {study.featured && (
                      <span className="inline-block mt-4 px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full w-fit">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Right side - Content */}
                  <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        {study.industry}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {study.product}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{study.description}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-8 mb-6">
                      {study.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Read More */}
                    <div className="flex items-center gap-2 text-red-600 font-medium group-hover:gap-3 transition-all">
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
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Success Across Industries
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Checkit delivers measurable results across multiple verticals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Food Facilities</h3>
              <p className="text-sm text-gray-500">Venues, stadiums, hospitality</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Senior Living</h3>
              <p className="text-sm text-gray-500">Resident safety, compliance</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Operations</h3>
              <p className="text-sm text-gray-500">Restaurants, hospitality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-5 invert opacity-70"
            />
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Checkit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
