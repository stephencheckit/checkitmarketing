'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  CheckCircle2, 
  ThermometerSun, 
  ClipboardCheck, 
  Shield,
  ArrowRight,
  Building2,
  TrendingUp,
  Clock,
  ChevronRight,
  ExternalLink,
  FileText
} from 'lucide-react';

export default function OVGMicrositeHome() {
  const [stats, setStats] = useState({ contracted: 0, engaged: 0, total: 0 });

  // Generate session ID for tracking
  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return '';
    let sessionId = sessionStorage.getItem('ovg-session-id');
    if (!sessionId) {
      sessionId = `ovg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ovg-session-id', sessionId);
    }
    return sessionId;
  }, []);

  // Record page view
  const recordPageView = useCallback(async () => {
    try {
      await fetch('/api/ovg/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          pagePath: '/ovg',
        }),
      });
    } catch (error) {
      console.log('Analytics recording failed:', error);
    }
  }, [getSessionId]);

  useEffect(() => {
    // Record page view
    recordPageView();
    
    // Fetch live stats from API
    fetch('/api/ovg/sites')
      .then(res => res.json())
      .then(data => {
        const sites = data.sites || [];
        setStats({
          contracted: sites.filter((s: { status: string }) => s.status === 'contracted').length,
          engaged: sites.filter((s: { status: string }) => s.status === 'engaged').length,
          total: sites.length,
        });
      })
      .catch(() => {});
  }, [recordPageView]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/Jones.jpg" 
            alt="Stadium" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/90 to-gray-950"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          {/* Logos */}
          <div className="flex items-center gap-6 mb-8">
            <img 
              src="/OVG_Hospitality_Logo_FullColor-f60e36da0b.webp" 
              alt="OVG Hospitality" 
              className="h-12 md:h-16"
            />
            <div className="w-px h-10 bg-gray-600"></div>
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-6 md:h-8"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
            Operational Excellence for 
            <span className="text-blue-400"> World-Class Venues</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Checkit partners with OVG Hospitality to deliver automated compliance, 
            real-time monitoring, and operational visibility across your venue portfolio.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link 
              href="/ovg-map"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <MapPin className="w-5 h-5" />
              View Territory Map
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/case-studies/texas-tech"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
            >
              Read Texas Tech Case Study
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{stats.total}+</div>
              <div className="text-gray-400 text-sm">OVG Venues</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-1">{stats.contracted}</div>
              <div className="text-gray-400 text-sm">Live with Checkit</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-1">{stats.engaged}</div>
              <div className="text-gray-400 text-sm">In Active Discussions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Automated Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Highlight */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                <CheckCircle2 className="w-4 h-4" />
                Success Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Texas Tech University
              </h2>
              <p className="text-gray-300 mb-6">
                OVG Hospitality at Texas Tech deployed Checkit to transform food safety 
                operations across Jones AT&T Stadium and the United Supermarkets Arena.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">50% reduction in manual checks</div>
                    <div className="text-gray-400 text-sm">Automated temperature monitoring</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">100% audit-ready compliance</div>
                    <div className="text-gray-400 text-sm">Digital records with full traceability</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Real-time visibility for leadership</div>
                    <div className="text-gray-400 text-sm">Multi-venue dashboard and alerts</div>
                  </div>
                </div>
              </div>

              <Link 
                href="/case-studies/texas-tech"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
              >
                Read the full case study
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <img 
                src="/ovg-texastech.webp" 
                alt="Texas Tech Stadium" 
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-xl">
                <img 
                  src="/texas-tech-logo.png" 
                  alt="Texas Tech" 
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Checkit for OVG */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Checkit for OVG Venues
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Purpose-built for high-volume food service operations at stadiums, arenas, and convention centers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <ThermometerSun className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Temperature Monitoring</h3>
              <p className="text-gray-400 text-sm">
                Automated sensors monitor coolers, freezers, and holding equipment 24/7 with instant alerts.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Digital Checklists</h3>
              <p className="text-gray-400 text-sm">
                Replace paper logs with guided workflows for opening, closing, and event-day operations.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Venue Control</h3>
              <p className="text-gray-400 text-sm">
                Single dashboard to monitor compliance across your entire OVG portfolio in real-time.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Audit-Ready Records</h3>
              <p className="text-gray-400 text-sm">
                Complete digital audit trail with timestamps, photos, and corrective actions logged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Territory Map Preview */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
                  <MapPin className="w-4 h-4" />
                  Interactive Map
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  OVG Territory Map
                </h2>
                <p className="text-gray-300 mb-6">
                  Explore our engagement across the OVG Hospitality portfolio. See which venues are 
                  already live with Checkit and where we're in active discussions.
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-white font-semibold">{stats.contracted}</span>
                    </div>
                    <div className="text-gray-400 text-xs">Contracted</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-white font-semibold">{stats.engaged}</span>
                    </div>
                    <div className="text-gray-400 text-xs">Engaged</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-white font-semibold">{stats.total - stats.contracted - stats.engaged}</span>
                    </div>
                    <div className="text-gray-400 text-xs">Prospects</div>
                  </div>
                </div>

                <Link 
                  href="/ovg-map"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Open Territory Map
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="relative h-64 md:h-auto">
                <img 
                  src="/Texas-Tech-0031.jpg" 
                  alt="Venue" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent md:from-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Venue Operations?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join Texas Tech and other OVG venues in delivering operational excellence with Checkit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/case-studies/texas-tech"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Read Case Study
            </Link>
            <Link 
              href="/ovg-map"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors"
            >
              <MapPin className="w-5 h-5" />
              View Territory Map
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="/checkit-logo-horizontal-standard-rgb-white.svg" 
                  alt="Checkit" 
                  className="h-6"
                />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Checkit is a multi-site operational technology platform helping hospitality 
                and food service organizations maintain compliance, safety, and visibility.
              </p>
              <p className="text-gray-500 text-xs">
                LSE: CHK | London HQ | ISO 17025/UKAS Accredited
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">OVG Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/case-studies/texas-tech" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Texas Tech Case Study
                  </Link>
                </li>
                <li>
                  <Link href="/ovg-map" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Territory Map
                  </Link>
                </li>
                <li>
                  <a href="https://www.checkit.net" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1">
                    Checkit.net
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Learn More</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.oakviewgroup.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1">
                    OVG Hospitality
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.checkit.net/about" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1">
                    About Checkit
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Checkit. All rights reserved. This microsite is intended for OVG Hospitality partners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
