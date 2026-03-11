'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  BarChart3,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react';

interface Challenge {
  title: string;
  description: string;
}

interface Capability {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Result {
  stat: string;
  label: string;
}

interface CustomerLogo {
  name: string;
}

interface BrochureProps {
  industry: string;
  headline: string;
  subheadline: string;
  product: 'CAM' | 'CAM+';
  challenges: Challenge[];
  capabilities: Capability[];
  results: Result[];
  customers: CustomerLogo[];
  useCases: string[];
  ctaText?: string;
}

export default function BrochureTemplate({
  industry,
  headline,
  subheadline,
  product,
  challenges,
  capabilities,
  results,
  customers,
  useCases,
  ctaText = 'Book a Demo',
}: BrochureProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Checkit
          </Link>
          <span className="text-xs text-white/40 uppercase tracking-wider font-medium">
            {product === 'CAM+' ? 'Connected Automated Monitoring' : 'Checkit Platform'}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/5" />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full">
                {industry}
              </span>
              {product === 'CAM+' && (
                <span className="px-3 py-1 text-xs font-medium text-purple-400 bg-purple-400/10 border border-purple-400/20 rounded-full">
                  CAM+
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {headline}
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-2xl">
              {subheadline}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://www.checkit.net/checkit-demo"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {ctaText}
              </Link>
              <Link
                href="https://checkitv6.com/platform"
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Explore Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            The challenges you face
          </h2>
          <p className="text-white/50 mb-10 max-w-2xl">
            Common operational pain points we hear from {industry.toLowerCase()} teams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <span className="text-red-400 text-sm font-bold">{i + 1}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{challenge.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Checkit Helps */}
      <section className="border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            How Checkit helps
          </h2>
          <p className="text-white/50 mb-10 max-w-2xl">
            The key capabilities of the {product === 'CAM+' ? 'CAM+' : 'Checkit'} platform for {industry.toLowerCase()}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div key={i} className="flex gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{cap.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{cap.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Day-to-Day Use Cases */}
      <section className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            How teams use Checkit day to day
          </h2>
          <p className="text-white/50 mb-10 max-w-2xl">
            Real examples of how {industry.toLowerCase()} teams use the platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((uc, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.06] rounded-lg px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">{uc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
            Outcomes customers see
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((r, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{r.stat}</div>
                <div className="text-sm text-white/50">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      {customers.length > 0 && (
        <section className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
              Trusted by
            </h2>
            <div className="flex flex-wrap gap-6">
              {customers.map((c, i) => (
                <div key={i} className="px-6 py-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                  <span className="text-white/60 font-medium text-sm">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-white/5 bg-gradient-to-b from-blue-600/5 to-transparent">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">
            Book a 15-minute walkthrough tailored to {industry.toLowerCase()}. No slides — just a live look at the platform.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="https://www.checkit.net/checkit-demo"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              {ctaText}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/30 text-xs">
            © {new Date().getFullYear()} Checkit plc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://www.checkit.net/privacy-policy/" className="text-white/30 hover:text-white/50 text-xs transition-colors">Privacy Policy</Link>
            <Link href="https://checkitv6.com/platform" className="text-white/30 hover:text-white/50 text-xs transition-colors">Platform</Link>
            <Link href="https://www.checkit.net/blog/" className="text-white/30 hover:text-white/50 text-xs transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
