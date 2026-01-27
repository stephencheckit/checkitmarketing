'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { 
  CheckCircle2,
  Thermometer,
  Clock,
  Users,
  Shield,
  TrendingUp,
  Building2,
  BarChart3,
  Award,
  Zap,
  AlertTriangle,
  Bell,
  ClipboardCheck,
  Smartphone,
  Cloud,
  FileCheck,
  Eye,
  Quote,
  ChefHat
} from 'lucide-react';

// Morningstar Teal/Green - Senior Living health-focused
const MORNINGSTAR_TEAL = '#0D9488';

// Article schema for AI search
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Morningstar Senior Living: Modernizing Food Safety & Compliance at Scale',
  description: 'How Morningstar Senior Living transformed food safety compliance across 41 communities with Checkit\'s digital platform, reducing admin time and improving audit readiness.',
  image: 'https://checkit-marketing.vercel.app/morningstar-of-arvada.jpg',
  author: {
    '@type': 'Organization',
    name: 'Checkit'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Checkit',
    logo: {
      '@type': 'ImageObject',
      url: 'https://checkit-marketing.vercel.app/checkit-logo-horizontal-standard-rgb-white.svg'
    }
  },
  datePublished: '2024-06-01',
  dateModified: '2025-01-01',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://checkit-marketing.vercel.app/case-studies/morningstar'
  },
  about: {
    '@type': 'Organization',
    name: 'Morningstar Senior Living',
    description: 'Senior living operator with 41 communities nationwide'
  },
  mentions: [
    {
      '@type': 'Product',
      name: 'Checkit V6 Platform',
      description: 'Digital compliance and monitoring platform'
    }
  ],
  keywords: ['senior living compliance', 'food safety', 'HACCP', 'digital transformation', 'Morningstar Senior Living', 'case study']
};

// Key metrics
const metrics = [
  { value: '41', unit: '', label: 'Communities', icon: Building2 },
  { value: '100%', unit: '', label: 'Audit Trail', icon: FileCheck },
  { value: 'Real-Time', unit: '', label: 'Compliance', icon: Shield },
  { value: '↓', unit: '', label: 'Admin Time', icon: Clock },
];

// Outcomes list
const outcomes = [
  {
    metric: 'Compliance Accuracy',
    result: 'Significant improvement with automated logging',
    icon: CheckCircle2,
  },
  {
    metric: 'Time Spent on Admin Tasks',
    result: 'Reduced by a material percentage',
    icon: Clock,
  },
  {
    metric: 'Real-Time Issues Identified',
    result: 'Faster corrective action vs paper logs',
    icon: Zap,
  },
  {
    metric: 'Staff Confidence',
    result: 'Higher due to reliable process and data',
    icon: Users,
  },
];

// Benefits list
const benefits = [
  {
    icon: FileCheck,
    title: 'Accurate, Audit-Ready Records',
    description: 'Digital logs replaced paper charts, eliminating transcription delays and errors.',
  },
  {
    icon: Clock,
    title: 'Operational Efficiency',
    description: 'Staff spend less time on manual documentation and more on food quality and resident engagement.',
  },
  {
    icon: Shield,
    title: 'Real-Time Compliance',
    description: 'Automated checks and alerts ensure consistent adherence to food safety protocols across communities.',
  },
  {
    icon: Eye,
    title: 'Improved Visibility',
    description: 'Culinary leadership gains centralized insights into compliance status and trends.',
  },
];

// Solution components
const solutionComponents = [
  {
    icon: Thermometer,
    title: 'Asset Intelligence & Sensors',
    description: 'Continuous monitoring of critical kitchen and storage assets (walk-ins, coolers, hot holding) for automated temperature & environmental tracking.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App for Food Probing',
    description: 'Culinary staff use the Checkit app to perform digital food temperature checks, capture results instantly, and link data to compliance records.',
  },
  {
    icon: Cloud,
    title: 'Cloud Dashboard & Reporting',
    description: 'Centralized view of compliance results, overdue tasks, sensor alerts, and audit reports—accessible to culinary leadership.',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description: 'Instant notifications for deviations allow immediate corrective action, preventing food safety risks.',
  },
];

export default function MorningstarCaseStudy() {
  const [animatedMetrics, setAnimatedMetrics] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimatedMetrics(true);
        }
      },
      { threshold: 0.5 }
    );

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Article Schema for AI Search */}
      <Script
        id="morningstar-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Cover Page Hero */}
      <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/morningstar-of-arvada.jpg)' }}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Badge */}
          <span className="inline-block px-5 py-2 text-base font-semibold bg-white/10 backdrop-blur-sm text-white rounded-full mb-8 border border-white/20">
            Case Study
          </span>
          
          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Modernizing Food Safety &amp;<br />Compliance at Scale
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl lg:text-3xl text-white/80 mb-12 font-light">
            Delivering Consistent Compliance &amp; Resident Wellness
          </p>
          
        </div>
      </section>

      {/* Logos & Details */}
      <section className="py-16 lg:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Customer Logo - Centered */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl px-8 py-6 border border-gray-200 shadow-lg">
              <img 
                src="/morningstar-logo-500x125.png" 
                alt="Morningstar Senior Living"
                className="h-16 lg:h-20 w-auto object-contain"
              />
            </div>
          </div>
          
          {/* Details Grid */}
          <div className="grid sm:grid-cols-3 gap-6 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Scale</div>
                <div className="text-gray-600">41 communities nationwide</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Focus</div>
                <div className="text-gray-600">Resident wellness &amp; nutrition</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Challenge</div>
                <div className="text-gray-600">Food safety &amp; compliance</div>
              </div>
            </div>
          </div>

          {/* Environment Description */}
          <div className="mt-10 bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Senior Living Dining &amp; Compliance Environment</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Morningstar Senior Living operates over 40 communities nationwide, serving tailored nutritional 
              experiences daily. With rising regulatory demands, diverse dietary needs, and a mission to elevate 
              resident wellness, maintaining consistent food safety and compliance was critical — yet traditional 
              paper-based processes were straining staff, slowing reporting, and limiting visibility into key 
              food safety and asset performance metrics.
            </p>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Operational Challenge</h2>
          </div>
          
          <p className="text-xl text-gray-500 mb-10">Manual Methods Unable to Scale</p>
          
          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Paper-Based Processes</h3>
              <p className="text-gray-700">
                Culinary and dining teams relied on manual logs for food temperature checks, equipment compliance, 
                and sanitation records — leading to time lost on administrative tasks and potential data errors.
              </p>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Limited Visibility</h3>
              <p className="text-gray-700">
                Leadership lacked real-time insight into food safety checks, equipment deviations 
                (e.g., refrigeration temps) or compliance status across all 41 locations.
              </p>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Staff Burden</h3>
              <p className="text-gray-700">
                Culinary teams juggled service delivery with compliance documentation, 
                often duplicating work and delaying corrective actions.
              </p>
            </div>
          </div>

          {/* Why Traditional Methods Failed */}
          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Why Traditional Methods Failed</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-lg text-gray-700"><strong>Inconsistent Documentation</strong> — prone to gaps, delays, and loss</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-lg text-gray-700">Audit readiness <strong>difficult</strong> to maintain</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-lg text-gray-700"><strong>Reactive, not proactive</strong> — issues discovered after the fact</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-lg text-gray-700"><strong>Scattered accountability</strong> — manual tracking error-prone</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Thermometer className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">The Solution</h2>
          </div>
          
          <p className="text-xl text-gray-500 mb-10">Checkit Platform + Asset Intelligence, Sensors &amp; Mobile App</p>
          
          {/* Solution Components */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10">
            <p className="text-lg text-gray-600 mb-8">
              Morningstar implemented Checkit&apos;s digital compliance platform across 41 locations, integrating:
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {solutionComponents.map((component) => {
                const Icon = component.icon;
                return (
                  <div key={component.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{component.title}</h4>
                      <p className="text-gray-600">{component.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Screenshot */}
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <img 
              src="/checkitv6.png" 
              alt="Checkit V6 Platform Dashboard" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Featured Quote - Natalie Brown */}
      <section className="relative py-20 lg:py-24 overflow-hidden" style={{ backgroundColor: MORNINGSTAR_TEAL }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Quote className="w-16 h-16 text-white/20 mx-auto mb-6" />
          <blockquote className="text-center">
            <p className="text-2xl lg:text-3xl text-white leading-relaxed font-light mb-12">
              &ldquo;Checkit has transformed how we approach food safety across all our communities. 
              Our teams now spend <strong className="font-bold">less time on paperwork</strong> and 
              <strong className="font-bold"> more time with residents</strong>. The real-time visibility 
              gives me confidence that we&apos;re delivering <strong className="font-bold">consistent, 
              safe dining experiences</strong> every single day.&rdquo;
            </p>
            <footer className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white">Natalie Brown</div>
                <div className="text-white/70">VP of Culinary, Morningstar Senior Living</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* The Benefits */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Benefits</h2>
          </div>
          
          <p className="text-xl text-gray-500 mb-10">Better Data, Better Action</p>
          
          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section ref={metricsRef} className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Outcomes</h2>
          </div>

          {/* Outcomes Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-200">
              <div className="px-6 py-4 font-bold text-gray-900">Metric</div>
              <div className="px-6 py-4 font-bold text-gray-900">Result</div>
            </div>
            {outcomes.map((outcome, index) => {
              const Icon = outcome.icon;
              return (
                <div 
                  key={outcome.metric}
                  className={`grid grid-cols-2 ${index !== outcomes.length - 1 ? 'border-b border-gray-100' : ''} transition-all duration-700 ${
                    animatedMetrics ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="px-6 py-5 flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="font-medium text-gray-900">{outcome.metric}</span>
                  </div>
                  <div className="px-6 py-5 text-gray-600">{outcome.result}</div>
                </div>
              );
            })}
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.label}
                  className={`bg-white border-2 border-gray-200 rounded-2xl p-6 text-center transition-all duration-700 ${
                    animatedMetrics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                    {metric.value}
                    {metric.unit && <span className="text-lg text-gray-400 ml-1">{metric.unit}</span>}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CEO Quote - Kit Kyte */}
      <section className="relative py-20 lg:py-24 overflow-hidden bg-blue-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Quote className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <blockquote className="text-center">
            <p className="text-2xl lg:text-3xl text-white leading-relaxed font-light mb-12">
              &ldquo;Morningstar exemplifies what&apos;s possible when senior living operators commit to 
              <strong className="font-bold">digitizing compliance</strong>. Their leadership recognized 
              that resident wellness starts with <strong className="font-bold">excellence at the technology level</strong>—and 
              that paper-based processes simply can&apos;t deliver the consistency and visibility required 
              at scale. We&apos;re proud to support their mission across <strong className="font-bold">41 communities</strong> with more to come.&rdquo;
            </p>
            <footer className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-white">Kit Kyte</div>
                <div className="text-white/50">CEO, Checkit</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* What's Next */}
      <section className="py-16 lg:py-24 bg-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">What&apos;s Next</h2>
          </div>
          
          <p className="text-xl text-gray-500 mb-10">Ongoing UI &amp; Workflow Optimization</p>
          
          {/* What's Expanding */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-lg text-gray-600 mb-6">
              Morningstar is collaborating with Checkit&apos;s team to evaluate next-generation interfaces 
              and enhanced compliance workflows. This includes:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Intuitive Platform UI</h4>
                  <p className="text-gray-600">More user-friendly interface design</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Broader Operational Checks</h4>
                  <p className="text-gray-600">Beyond food safety to sanitation procedures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Cross-Location Benchmarking</h4>
                  <p className="text-gray-600">Performance comparison across communities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Enhanced Compliance Workflows</h4>
                  <p className="text-gray-600">Streamlined processes for regulatory requirements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
