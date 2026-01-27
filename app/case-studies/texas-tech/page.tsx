'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  CheckCircle2,
  Thermometer,
  Clock,
  Users,
  Shield,
  TrendingUp,
  Building2,
  ChefHat,
  Utensils,
  BarChart3,
  Award,
  Zap,
  AlertTriangle,
  Wrench,
  Eye,
  Quote,
  Target,
  Bell,
  Calendar,
  ClipboardCheck,
  MapPin,
  ArrowRight
} from 'lucide-react';

// Dynamically import map component
const OVGMapComponent = dynamic(() => import('@/components/OVGMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-800 rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
});

// Texas Tech Red: #CC0000 (PANTONE 485)
const TEXAS_TECH_RED = '#CC0000';

// Key metrics
const metrics = [
  { value: '2', unit: 'Months', label: 'To ROI', icon: Clock },
  { value: '1', unit: 'Hour', label: 'Fix Time', icon: Wrench },
  { value: '1000s', unit: '', label: 'Guests Protected', icon: Users },
  { value: '100%', unit: '', label: 'Product Saved', icon: Shield },
];

// Outcomes list
const outcomes = [
  {
    icon: TrendingUp,
    title: 'Reduced Food Waste',
    description: 'Avoided inventory loss during peak revenue events',
  },
  {
    icon: BarChart3,
    title: 'Improved Operational Control',
    description: 'Unified visibility across multiple kitchens',
  },
  {
    icon: Shield,
    title: 'Greater Confidence',
    description: 'Food safety under high-pressure conditions',
  },
  {
    icon: Award,
    title: 'Premium Experiences',
    description: 'Consistent delivery to donors and VIPs',
  },
  {
    icon: Zap,
    title: 'Scalable Foundation',
    description: 'Platform for digital workflow expansion',
  },
];

// Stadium sections monitored
const operationalAreas = [
  { name: 'Stadium Operations', icon: Building2, description: 'Premium hospitality kitchens' },
  { name: 'Social Club', icon: Users, description: 'VIP guest service areas' },
  { name: 'Concessions', icon: Utensils, description: 'High-volume service points' },
];

interface OVGSite {
  id: number;
  name: string;
  venue_type: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  status: 'contracted' | 'engaged' | 'prospect';
  notes: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

export default function TexasTechCaseStudy() {
  const [animatedMetrics, setAnimatedMetrics] = useState(false);
  const [sites, setSites] = useState<OVGSite[]>([]);
  const [mapStats, setMapStats] = useState({ contracted: 0, engaged: 0, total: 0 });
  const metricsRef = useRef<HTMLDivElement>(null);

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
          pagePath: '/case-studies/texas-tech',
        }),
      });
    } catch (error) {
      console.log('Analytics recording failed:', error);
    }
  }, [getSessionId]);

  // Fetch OVG sites for the map and record page view
  useEffect(() => {
    recordPageView();
    
    fetch('/api/ovg/sites')
      .then(res => res.json())
      .then(data => {
        const allSites = data.sites || [];
        setSites(allSites);
        setMapStats({
          contracted: allSites.filter((s: OVGSite) => s.status === 'contracted').length,
          engaged: allSites.filter((s: OVGSite) => s.status === 'engaged').length,
          total: allSites.length,
        });
      })
      .catch(() => {});
  }, [recordPageView]);

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
      {/* Cover Page Hero */}
      <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/Jones.jpg)' }}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Checkit Logo */}
          <img 
            src="/checkit-logo-horizontal-standard-rgb-white.svg" 
            alt="Checkit" 
            className="h-10 lg:h-12 mx-auto mb-16 opacity-90"
          />
          
          {/* Badge */}
          <span className="inline-block px-5 py-2 text-base font-semibold bg-white/10 backdrop-blur-sm text-white rounded-full mb-8 border border-white/20">
            Case Study
          </span>
          
          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Protecting Revenue &amp;<br />Guest Experience at Scale
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl lg:text-3xl text-white/80 mb-12 font-light">
            College Football Hospitality
          </p>
          
        </div>
        
      </section>

      {/* Logos & Details */}
      <section className="py-16 lg:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Customer Logos - Centered */}
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20 mb-12">
            <img 
              src="/texas-tech-logo.png" 
              alt="Texas Tech University" 
              className="h-20 lg:h-24 object-contain"
            />
            <div className="hidden sm:block w-px h-16 bg-gray-300" />
            <img 
              src="/OVG_Hospitality_Logo_FullColor-f60e36da0b.webp" 
              alt="OVG Hospitality" 
              className="h-12 lg:h-14 object-contain"
            />
          </div>
          
          {/* Details Grid */}
          <div className="grid sm:grid-cols-3 gap-6 bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Utensils className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Operations</div>
                <div className="text-gray-600">Multiple high-volume kitchens</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Environment</div>
                <div className="text-gray-600">Year-round + game day</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900">Scale</div>
                <div className="text-gray-600">Thousands of guests per event</div>
              </div>
            </div>
          </div>

          {/* Premium Space Image */}
          <div className="mt-10 rounded-2xl overflow-hidden">
            <img 
              src="/Meeting-rooms-in-lubbock.jpg" 
              alt="Premium hospitality suite at Texas Tech" 
              className="w-full h-64 lg:h-80 object-cover"
            />
          </div>

          {/* Operational Areas */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Areas Covered</h4>
            <div className="grid sm:grid-cols-3 gap-4">
              {operationalAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div 
                    key={area.name} 
                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4"
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${TEXAS_TECH_RED}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: TEXAS_TECH_RED }} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{area.name}</div>
                      <div className="text-sm text-gray-500">{area.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Venue Image */}
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden">
            <img 
              src="/Texas-Tech-0031.jpg" 
              alt="Texas Tech game day hospitality" 
              className="w-full h-64 lg:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Quote - Red */}
      <section className="relative py-20 lg:py-24 overflow-hidden" style={{ backgroundColor: TEXAS_TECH_RED }}>
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
              &ldquo;Within the first <strong className="font-bold">two months</strong> of using Checkit, 
              the software <strong className="font-bold">paid for itself</strong>. Sensors alerted to a 
              walk-in cooler going down, and we were able to have it fixed <strong className="font-bold">within the hour</strong>.&rdquo;
            </p>
            <footer className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white">Megan Sunderman</div>
                <div className="text-white/70">General Manager, OVG Hospitality</div>
              </div>
            </footer>
          </blockquote>
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
          
          {/* Key Points - No Paragraphs */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">High Stakes Environment</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Thousands</strong> of guests, donors, season ticket holders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Kitchens at <strong>full capacity</strong> under extreme time pressure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>National events like <strong>College GameDay</strong></span>
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">The Risk</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Product loss</strong> = direct financial cost</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Guest experience</strong> at risk on peak days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Reputation</strong> of athletic program + hospitality partner</span>
                </li>
              </ul>
            </div>
          </div>

          {/* The Problem Statement */}
          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Why Traditional Methods Failed</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-lg text-gray-700">Multiple kitchens operating <strong>simultaneously</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-lg text-gray-700">Manual checks = <strong>reactive</strong>, not proactive</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-lg text-gray-700">Inconsistent <strong>food safety</strong> coverage</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-lg text-gray-700">No <strong>real-time visibility</strong> into assets</span>
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
          
          {/* Checkit Monitoring System */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Checkit Monitoring System</h3>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Thermometer className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Continuous Monitoring</h4>
                <p className="text-gray-600">Critical food storage &amp; prep assets</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Real-Time Alerts</h4>
                <p className="text-gray-600">Temperature deviations &amp; equipment issues</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Proactive Intervention</h4>
                <p className="text-gray-600">Act before product is compromised</p>
              </div>
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

      {/* The Benefits */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">The Benefits</h2>
          </div>
          
          {/* Results Grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-6">
              <CheckCircle2 className="w-8 h-8 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Immediate Visibility</h4>
                <p className="text-gray-600">Know the moment something deviates</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-6">
              <CheckCircle2 className="w-8 h-8 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Protected High-Value Product</h4>
                <p className="text-gray-600">Significant volumes saved on peak days</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-6">
              <CheckCircle2 className="w-8 h-8 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Uninterrupted Service</h4>
                <p className="text-gray-600">Thousands of guests served without issue</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-6">
              <CheckCircle2 className="w-8 h-8 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">Essential for Peak Days</h4>
                <p className="text-gray-600">Critical during most commercially important events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quote - Dark */}
      <section className="relative py-20 lg:py-24 overflow-hidden bg-gray-900">
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
              &ldquo;Checkit alerted us to a cooler failure in an event kitchen <strong className="font-bold">without full-time staff</strong>, 
              on a <strong className="font-bold">Sunday with no one onsite</strong>. Product was stocked for the 
              upcoming Game Day—without Checkit, <strong className="font-bold">we could have lost it all</strong>.&rdquo;
            </p>
            <footer className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-white">Megan Sunderman</div>
                <div className="text-white/50">General Manager, OVG Hospitality</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Outcomes</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;
              return (
                <div 
                  key={outcome.title}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{outcome.title}</h3>
                  <p className="text-gray-600">{outcome.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact by the Numbers */}
      <section ref={metricsRef} className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
            Impact by the Numbers
          </h2>
          <p className="text-xl text-gray-500 text-center mb-12">Measurable results from deployment</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.label}
                  className={`bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-700 ${
                    animatedMetrics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-1">
                    {metric.value}
                    {metric.unit && <span className="text-xl lg:text-2xl text-gray-400 ml-1">{metric.unit}</span>}
                  </div>
                  <div className="text-lg text-gray-500 font-medium">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Game Day Image */}
      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden">
            <img 
              src="/Cheerleader-2 (1).jpg" 
              alt="Texas Tech game day atmosphere" 
              className="w-full h-64 lg:h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* What's Next for OVG */}
      <section className="py-16 lg:py-24 bg-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">What&apos;s Next for OVG</h2>
          </div>
          
          {/* What's Expanding */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Following Success with Sensing</h3>
            <p className="text-lg text-gray-600 mb-6">Texas Tech is expanding Checkit into digital workflows:</p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Customized Checklists</h4>
                  <p className="text-gray-600">Rolled out across daily kitchen operations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Food Safety Protocols</h4>
                  <p className="text-gray-600">Standardized compliance procedures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Opening &amp; Closing</h4>
                  <p className="text-gray-600">Consistent shift procedures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Leadership-Managed</h4>
                  <p className="text-gray-600">Refined by OVG on-site hospitality team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVG Territory Map Section */}
      <section className="py-16 lg:py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              OVG Portfolio
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Checkit Across OVG Hospitality
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Texas Tech is just the beginning. See where Checkit is expanding across OVG's nationwide venue portfolio.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-2xl font-bold text-white">{mapStats.contracted}</span>
              </div>
              <div className="text-sm text-gray-400">Contracted</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-2xl font-bold text-white">{mapStats.engaged}</span>
              </div>
              <div className="text-sm text-gray-400">Engaged</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-2xl font-bold text-white">{mapStats.total - mapStats.contracted - mapStats.engaged}</span>
              </div>
              <div className="text-sm text-gray-400">Prospects</div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl mb-8">
            <OVGMapComponent 
              sites={sites} 
              onSiteSelect={() => {}}
            />
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href="/ovg-map"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-lg"
            >
              <MapPin className="w-5 h-5" />
              Explore Full Territory Map
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Interactive map with sortable venue list and filtering
            </p>
          </div>
        </div>
      </section>

      {/* Commercial Significance */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Expanding Operational Footprint</h2>
          </div>
          
          {/* Land & Expand */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-lg text-lg">
                Land &amp; Expand Model
              </div>
            </div>
            <p className="text-xl text-gray-700 mb-0">
              <strong>Initial operational wins</strong> in monitoring create momentum for <strong>broader adoption</strong> of 
              workflow and compliance capabilities—supporting <strong>long-term digital growth</strong> for both Texas Tech and Checkit.
            </p>
          </div>

          {/* Growth Pattern */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Growth Pattern</h3>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 shrink-0" />
                  <span className="text-xl font-bold text-gray-900">Monitoring</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">Deployed</span>
                </div>
                <div className="ml-9 text-gray-600 mb-2">Walk-in coolers, freezers, hot holding equipment</div>
                <div className="ml-9 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full w-full" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-xl font-bold text-gray-900">Workflows</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">Expanding</span>
                </div>
                <div className="ml-9 text-gray-600 mb-2">Daily checklists, opening/closing, food safety protocols</div>
                <div className="ml-9 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-3/4" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-xl font-bold text-gray-900">Compliance</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">Future</span>
                </div>
                <div className="ml-9 text-gray-600 mb-2">Full audit trail, reporting, analytics</div>
                <div className="ml-9 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Quote */}
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
              &ldquo;Our partnership with OVG at Texas Tech represents the beginning of an <strong className="font-bold">exceptional collaboration</strong>. 
              Forward-thinking hospitality operators like OVG clearly prioritize the <strong className="font-bold">safety, quality, and experience</strong> of 
              their guests. We&apos;re delighted to continue expanding across their operations—delivering value and 
              <strong className="font-bold"> streamlining food safety</strong> at every touchpoint.&rdquo;
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

      {/* Simple Footer */}
      <footer className="py-10 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-6 invert opacity-60"
            />
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Checkit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
