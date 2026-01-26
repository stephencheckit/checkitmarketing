'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  CheckCircle2,
  Thermometer,
  Bell,
  Clock,
  Users,
  Shield,
  TrendingUp,
  Building2,
  ChefHat,
  Utensils,
  Target,
  BarChart3,
  Award,
  Zap,
  Play,
  ChevronRight,
  AlertTriangle,
  Wrench,
  Eye,
  Quote,
  ArrowRight
} from 'lucide-react';
import DemoRequestButton from '@/components/DemoRequestButton';

// Timeline stages for interactive storytelling
const timeline = [
  {
    id: 'challenge',
    title: 'The Challenge',
    icon: AlertTriangle,
    color: 'from-red-600 to-red-700',
    description: 'High-stakes game days with thousands of guests, multiple kitchens, and zero tolerance for failure.',
  },
  {
    id: 'solution',
    title: 'Solution Deployed',
    icon: Thermometer,
    color: 'from-blue-500 to-blue-600',
    description: 'Continuous monitoring and real-time alerts deployed across critical food storage and prep assets.',
  },
  {
    id: 'expansion',
    title: 'Expansion',
    icon: TrendingUp,
    color: 'from-emerald-500 to-emerald-600',
    description: 'Success with sensing led to customized digital workflows for daily kitchen operations.',
  },
  {
    id: 'outcomes',
    title: 'Outcomes',
    icon: Award,
    color: 'from-amber-500 to-amber-600',
    description: 'Protected revenue, enhanced guest experience, and scalable foundation for digital growth.',
  },
];

// Key metrics with animation
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
    description: 'Avoided inventory loss during peak revenue events through early detection.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: BarChart3,
    title: 'Improved Operational Control',
    description: 'Multiple kitchens and service teams now operate with unified visibility.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Shield,
    title: 'Greater Confidence',
    description: 'Food safety execution under high-pressure game day conditions.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Award,
    title: 'Premium Experiences',
    description: 'Consistent delivery to donors and season ticket holders.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Zap,
    title: 'Scalable Foundation',
    description: 'Expanded from sensing into digital workflows and compliance.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
];

// Stadium sections monitored
const operationalAreas = [
  { name: 'Stadium Operations', icon: Building2, description: 'Premium hospitality kitchens' },
  { name: 'Social Club', icon: Users, description: 'VIP guest service areas' },
  { name: 'Concessions', icon: Utensils, description: 'High-volume service points' },
];

export default function TexasTechCaseStudy() {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [animatedMetrics, setAnimatedMetrics] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  // Auto-advance timeline
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % timeline.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Metrics animation trigger
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
    <div className="min-h-screen">
      {/* Hero Section - Stadium Theme */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background with stadium pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23CC0000' stroke-width='0.5'%3E%3Crect x='10' y='10' width='80' height='80' rx='8'/%3E%3Cline x1='10' y1='50' x2='90' y2='50'/%3E%3Cline x1='50' y1='10' x2='50' y2='90'/%3E%3Ccircle cx='50' cy='50' r='15'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link 
            href="/industries/food-facilities" 
            className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Food Facilities
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1.5 text-sm font-semibold bg-red-600/20 text-red-400 rounded-full border border-red-600/30">
                  Case Study
                </span>
                <span className="px-3 py-1.5 text-sm font-medium bg-surface-elevated text-muted rounded-full">
                  College Football Hospitality
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                Protecting Revenue &amp; Guest Experience at{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                  Texas Tech
                </span>
              </h1>
              
              <p className="text-lg text-muted mb-6">
                How OVG Hospitality leverages Checkit to ensure food safety, prevent product loss, and 
                deliver premium experiences to thousands of guests on game day.
              </p>

              {/* Customer Info Card */}
              <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">Texas Tech University</span>
                      <span className="text-muted">•</span>
                      <span className="text-sm text-muted">Lubbock, TX</span>
                    </div>
                    <p className="text-sm text-muted">
                      Premium hospitality by <span className="text-foreground font-medium">OVG Hospitality</span>
                    </p>
                  </div>
                </div>
              </div>

              <DemoRequestButton industry="Food Facilities - OVG" />
            </div>
            
            {/* Visual - Stadium/Kitchen Visual */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden border border-red-600/20 bg-gradient-to-br from-surface to-surface-elevated">
                {/* Stadium graphic SVG */}
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  {/* Stadium bowl shape */}
                  <defs>
                    <linearGradient id="stadiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#CC0000" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#CC0000" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {/* Stadium outline */}
                  <ellipse cx="200" cy="180" rx="180" ry="100" fill="url(#stadiumGrad)" stroke="#CC0000" strokeWidth="2" strokeOpacity="0.3" />
                  
                  {/* Field */}
                  <ellipse cx="200" cy="180" rx="140" ry="70" fill="url(#fieldGrad)" />
                  
                  {/* Field lines */}
                  <line x1="60" y1="180" x2="340" y2="180" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" />
                  <line x1="200" y1="110" x2="200" y2="250" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" />
                  
                  {/* Premium sections - highlighted */}
                  <rect x="40" y="60" width="60" height="40" rx="4" fill="#CC0000" fillOpacity="0.3" stroke="#CC0000" strokeWidth="1" />
                  <text x="70" y="84" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">SUITES</text>
                  
                  <rect x="300" y="60" width="60" height="40" rx="4" fill="#CC0000" fillOpacity="0.3" stroke="#CC0000" strokeWidth="1" />
                  <text x="330" y="84" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">CLUB</text>
                  
                  {/* Kitchen/concession icons */}
                  <g transform="translate(140, 30)">
                    <rect width="120" height="30" rx="4" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="1" />
                    <text x="60" y="19" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">KITCHENS MONITORED</text>
                  </g>
                  
                  {/* Connection lines to Checkit */}
                  <line x1="70" y1="60" x2="160" y2="45" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" strokeOpacity="0.5" />
                  <line x1="330" y1="60" x2="240" y2="45" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" strokeOpacity="0.5" />
                  
                  {/* Sensor dots */}
                  <circle cx="70" cy="60" r="4" fill="#3b82f6">
                    <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="330" cy="60" r="4" fill="#3b82f6">
                    <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="0.5s" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </circle>
                  <circle cx="200" cy="45" r="4" fill="#22c55e">
                    <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="1s" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="1s" />
                  </circle>
                </svg>
                
                {/* Overlay label */}
                <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Real-time monitoring across</span>
                    <span className="font-semibold text-foreground">3 operational areas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Areas */}
      <section className="py-8 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {operationalAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div key={area.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{area.name}</div>
                    <div className="text-xs text-muted">{area.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section id="timeline" data-animate className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-accent/10 text-accent rounded-full mb-4">
              The Journey
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              From Challenge to Transformation
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Follow Texas Tech&apos;s path from operational challenges to a scalable digital foundation.
            </p>
          </div>

          {/* Timeline Navigation */}
          <div className="flex justify-center gap-2 mb-8">
            {timeline.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => setActiveTimeline(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTimeline === index
                    ? 'bg-accent text-white'
                    : 'bg-surface-elevated text-muted hover:text-foreground'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  activeTimeline === index ? 'bg-white' : 'bg-muted'
                }`} />
                {stage.title}
              </button>
            ))}
          </div>

          {/* Timeline Content */}
          <div className="relative bg-surface border border-border rounded-2xl p-8 lg:p-12 min-h-[300px]">
            {timeline.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className={`transition-all duration-500 ${
                    activeTimeline === index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start gap-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-4">{stage.title}</h3>
                      <p className="text-lg text-muted mb-6">{stage.description}</p>
                      
                      {/* Stage-specific content */}
                      {stage.id === 'challenge' && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-surface-elevated/50 rounded-lg p-4 border border-border">
                            <div className="text-red-500 font-semibold mb-1">High Stakes</div>
                            <div className="text-sm text-muted">Thousands of guests, donors, and season ticket holders</div>
                          </div>
                          <div className="bg-surface-elevated/50 rounded-lg p-4 border border-border">
                            <div className="text-red-500 font-semibold mb-1">Multiple Kitchens</div>
                            <div className="text-sm text-muted">Simultaneous operations at full capacity</div>
                          </div>
                          <div className="bg-surface-elevated/50 rounded-lg p-4 border border-border">
                            <div className="text-red-500 font-semibold mb-1">Reputation Risk</div>
                            <div className="text-sm text-muted">Athletic program and hospitality partner brand on the line</div>
                          </div>
                          <div className="bg-surface-elevated/50 rounded-lg p-4 border border-border">
                            <div className="text-red-500 font-semibold mb-1">National Events</div>
                            <div className="text-sm text-muted">College GameDay and other high-profile games</div>
                          </div>
                        </div>
                      )}
                      
                      {stage.id === 'solution' && (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Continuous Monitoring</div>
                              <div className="text-sm text-muted">Deployed across critical food storage and preparation assets</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Real-Time Alerts</div>
                              <div className="text-sm text-muted">Immediate visibility into temperature deviations and equipment issues</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Proactive Intervention</div>
                              <div className="text-sm text-muted">Teams act before food safety is compromised or product discarded</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {stage.id === 'expansion' && (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <ChevronRight className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Digital Workflows</div>
                              <div className="text-sm text-muted">Customized checklists rolled out across daily kitchen operations</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <ChevronRight className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Food Safety Protocols</div>
                              <div className="text-sm text-muted">Standardized opening, closing, and compliance procedures</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <ChevronRight className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                            <div>
                              <div className="font-medium text-foreground">Leadership-Managed</div>
                              <div className="text-sm text-muted">Workflows actively refined by OVG on-site hospitality leadership</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {stage.id === 'outcomes' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-success/10 rounded-lg">
                            <div className="text-2xl font-bold text-success">↓</div>
                            <div className="text-sm text-muted">Food Waste</div>
                          </div>
                          <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                            <div className="text-2xl font-bold text-blue-500">↑</div>
                            <div className="text-sm text-muted">Control</div>
                          </div>
                          <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                            <div className="text-2xl font-bold text-purple-500">↑</div>
                            <div className="text-sm text-muted">Confidence</div>
                          </div>
                          <div className="text-center p-4 bg-amber-500/10 rounded-lg">
                            <div className="text-2xl font-bold text-amber-500">↑</div>
                            <div className="text-sm text-muted">Experience</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-elevated overflow-hidden rounded-b-2xl">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${((activeTimeline + 1) / timeline.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-red-900/20 via-surface to-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Quote className="absolute -top-4 -left-4 w-16 h-16 text-red-600/20" />
            <blockquote className="relative bg-surface border border-red-600/20 rounded-2xl p-8 lg:p-12">
              <p className="text-xl lg:text-2xl text-foreground leading-relaxed mb-6">
                &ldquo;Within the first two months of using Checkit, the software paid for itself. 
                Sensors alerted to a walk-in cooler going down, and we were able to have it fixed 
                within the hour. This was in an event kitchen without a full-time staff and on a 
                Sunday with no onsite staff. Product was stocked for the upcoming Game Day and 
                <span className="text-red-500 font-semibold"> without Checkit we could have lost it all.</span>&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">OVG Hospitality Leadership</div>
                  <div className="text-sm text-muted">Texas Tech Football Operations</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section 
        ref={metricsRef}
        id="metrics" 
        data-animate 
        className="py-16 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Impact by the Numbers
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Measurable results from deploying Checkit at Texas Tech.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.label}
                  className={`relative bg-surface border border-border rounded-xl p-6 text-center overflow-hidden transition-all duration-700 ${
                    animatedMetrics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full" />
                  <div className="w-12 h-12 mx-auto rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-1">
                    {metric.value}
                    {metric.unit && <span className="text-lg text-muted ml-1">{metric.unit}</span>}
                  </div>
                  <div className="text-sm text-muted">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcomes Grid */}
      <section 
        id="outcomes" 
        data-animate 
        className={`py-16 lg:py-24 bg-surface-elevated/50 transition-all duration-700 ${
          visibleSections.has('outcomes') ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 text-sm font-medium bg-success/10 text-success rounded-full mb-4">
              <CheckCircle2 className="w-4 h-4 inline mr-1" />
              Outcomes Achieved
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Outcomes &amp; Impact
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outcomes.map((outcome, index) => {
              const Icon = outcome.icon;
              return (
                <div 
                  key={outcome.title}
                  className={`bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-all duration-500 ${
                    visibleSections.has('outcomes') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 rounded-lg ${outcome.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${outcome.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{outcome.title}</h3>
                  <p className="text-sm text-muted">{outcome.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commercial Significance */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 text-sm font-medium bg-amber-500/10 text-amber-500 rounded-full mb-4">
                <Target className="w-4 h-4 inline mr-1" />
                Land &amp; Expand
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Commercial Significance
              </h2>
              <p className="text-lg text-muted mb-6">
                The Texas Tech partnership demonstrates a clear <strong className="text-foreground">land and expand model</strong> where 
                initial operational wins in monitoring create momentum for broader adoption.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Start with Sensing</div>
                    <div className="text-sm text-muted">Deploy monitoring on critical assets, prove value fast</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Expand to Workflows</div>
                    <div className="text-sm text-muted">Roll out digital checklists and compliance procedures</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent font-bold text-sm">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Scale Across Portfolio</div>
                    <div className="text-sm text-muted">Create template for other OVG venues nationwide</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Growth Pattern</h3>
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-medium text-foreground">Monitoring (Deployed)</span>
                  </div>
                  <div className="ml-6 pl-4 border-l-2 border-emerald-500/30">
                    <div className="h-2 bg-emerald-500 rounded-full w-full" />
                    <p className="text-xs text-muted mt-1">Walk-in coolers, freezers, hot holding</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-medium text-foreground">Workflows (Expanding)</span>
                  </div>
                  <div className="ml-6 pl-4 border-l-2 border-blue-500/30">
                    <div className="h-2 bg-blue-500 rounded-full w-3/4" />
                    <p className="text-xs text-muted mt-1">Daily checklists, opening/closing, food safety</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="font-medium text-foreground">Compliance (Future)</span>
                  </div>
                  <div className="ml-6 pl-4 border-l-2 border-purple-500/30">
                    <div className="h-2 bg-purple-500 rounded-full w-1/4" />
                    <p className="text-xs text-muted mt-1">Full audit trail, reporting, analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related: OVG Map */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Explore the OVG Territory Map</h3>
                <p className="text-sm text-muted">See our engagement across OVG&apos;s venue portfolio</p>
              </div>
            </div>
            <Link
              href="/ovg-map"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              View OVG Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Protect Your Revenue &amp; Guest Experience?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            See how Checkit can help your venue or hospitality operation achieve the same results as Texas Tech.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <DemoRequestButton industry="Food Facilities - Hospitality" label="Schedule a Demo" />
            <Link
              href="/industries/food-facilities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-elevated text-foreground font-medium rounded-lg hover:bg-surface transition-colors"
            >
              Learn More About Food Facilities
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
                <li><Link href="/industries/senior-living" className="text-sm text-muted hover:text-foreground transition-colors">Senior Living</Link></li>
                <li><Link href="/industries/food-facilities" className="text-sm text-muted hover:text-foreground transition-colors">Food Facilities</Link></li>
                <li><Link href="/industries/food-retail" className="text-sm text-muted hover:text-foreground transition-colors">Food Retail</Link></li>
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
