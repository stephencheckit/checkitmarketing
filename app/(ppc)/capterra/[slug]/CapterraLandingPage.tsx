'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CapterraCategory } from '@/lib/ppc-config';
import {
  CheckCircle2, Shield, Lock, Loader2,
  Wifi, Smartphone, BarChart3, Bell,
  Clock, ThermometerSun, ClipboardCheck,
  Building2, Activity, Eye, ArrowRight,
  ChevronDown, Zap, Globe2, HeadphonesIcon,
  Quote, BadgeCheck, Droplets, DoorOpen,
  Wind, MapPin, Radio, CloudUpload,
} from 'lucide-react';

/* ─── types ─── */
interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function CapterraLandingPage({ category }: { category: CapterraCategory }) {
  const formRef = useRef<HTMLDivElement>(null);
  const [utmParams, setUtmParams] = useState<UtmParams>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: UtmParams = {};
    const keys: (keyof UtmParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    keys.forEach((key) => {
      const val = params.get(key);
      if (val) utm[key] = val;
    });
    setUtmParams(utm);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/ppc-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'capterra',
          listing: category.slug,
          categoryName: category.category,
          pageUrl: window.location.href,
          referrer: document.referrer,
          ...utmParams,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }
      setSubmitted(true);

      // Capterra conversion
      if (typeof window !== 'undefined' && (window as any).ct?.sendEvent) {
        (window as any).ct.sendEvent({
          installationId: '57f13f21-c2d0-42cb-8bc1-87a48a4ab3fb',
        });
      }

      // Other pixels (uncomment when ready):
      // window.gtag?.('event', 'conversion', { send_to: 'AW-XXX/YYY' });
      // window.lintrk?.('track', { conversion_id: XXXXXXX });
      // window.fbq?.('track', 'Lead');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── data ─── */
  const sensorTypes = [
    { icon: ThermometerSun, label: 'Temperature', reading: '-2.4°C', status: 'ok' },
    { icon: Droplets, label: 'Humidity', reading: '45% RH', status: 'ok' },
    { icon: DoorOpen, label: 'Door Contact', reading: 'Closed', status: 'ok' },
    { icon: Wind, label: 'CO₂', reading: '412 ppm', status: 'ok' },
    { icon: Eye, label: 'Occupancy', reading: '12 / 40', status: 'ok' },
    { icon: Droplets, label: 'Water Leak', reading: 'Dry', status: 'ok' },
    { icon: ThermometerSun, label: 'Hot-Hold', reading: '72.1°C', status: 'warn' },
    { icon: Radio, label: 'Motion', reading: 'Active', status: 'ok' },
  ];

  const siteLocations = [
    { name: 'Site Alpha — London', sensors: 24, checks: 156, compliance: '99.8%' },
    { name: 'Site Bravo — Manchester', sensors: 18, checks: 112, compliance: '99.5%' },
    { name: 'Site Charlie — Birmingham', sensors: 31, checks: 204, compliance: '100%' },
  ];

  const capabilities = [
    { icon: ThermometerSun, title: 'Temperature Monitoring', desc: 'Fridge, freezer, hot-hold, and ambient sensors with UKAS-traceable calibration. Continuous 24/7 automated readings.' },
    { icon: Wifi, title: 'Wireless IoT Sensors', desc: 'Wi-Fi and cellular-connected sensors for temperature, humidity, CO₂, door contact, water leak, and more. 5-year battery life.' },
    { icon: Bell, title: 'Real-Time Alerts', desc: 'Instant SMS, email, and push notifications the moment readings go out of range or a scheduled check is missed.' },
    { icon: ClipboardCheck, title: 'Digital Checklists', desc: 'Replace paper with guided mobile workflows. Timestamped, photo-verified, GPS-tagged — complete audit trail.' },
  ];

  const benefits = [
    { icon: Eye, title: 'Multi-Site Visibility', desc: 'See every location, sensor, and check from a single dashboard. Drill into any site, team, or time period instantly.' },
    { icon: BarChart3, title: 'Compliance Reporting', desc: 'Audit-ready reports in seconds. Full traceability from sensor reading through to corrective action.' },
    { icon: Shield, title: 'Risk Prevention', desc: 'Trend analysis and exception-based alerting help you catch issues before they escalate into compliance failures.' },
    { icon: Smartphone, title: 'Mobile-First', desc: 'Your team completes checks on their phone — even offline. Data syncs automatically when connectivity returns.' },
  ];

  const certifications = [
    'ISO 17025', 'UKAS Accredited', 'ISO 27001', 'ISO 9001', 'Cyber Essentials', 'UK Manufactured',
  ];

  const faqs = [
    { q: 'What types of IoT sensors does Checkit offer?', a: 'Checkit offers wireless sensors for temperature, humidity, CO₂, door/window contact, water leak detection, motion, occupancy, and more. Sensors connect via Wi-Fi or cellular gateway — no complex wiring required. All sensors feature 5-year battery life and UKAS-traceable calibration.' },
    { q: 'How long does implementation take?', a: 'Most sites are fully operational within days. Sensors are self-provisioning, and our team handles configuration and onboarding. No lengthy IT projects required.' },
    { q: 'Do we need special IT infrastructure?', a: 'No. Our sensors connect over standard Wi-Fi or cellular. The platform is fully cloud-based — there is nothing to install on your servers. Your IT team just needs to allow our sensor traffic through the network.' },
    { q: 'Can Checkit work alongside our existing systems?', a: 'Yes. Checkit provides APIs and can integrate with your existing ERP, BMS, CMMS, or compliance systems. Data can also be exported in standard formats at any time.' },
    { q: 'How does pricing work?', a: 'Checkit operates on a per-site subscription that includes hardware, software, calibration, and 24/7 support. No capital outlay, no surprise costs. We\'ll tailor a proposal based on your sites and monitoring needs during the demo.' },
  ];

  /* ─── render ─── */
  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>

      {/* ━━━ HEADER ━━━ */}
      <header className="bg-[#0f172a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Image
            src="/checkit-logo-horizontal-standard-rgb-white.svg"
            alt="Checkit"
            width={120}
            height={32}
            className="h-7 w-auto"
            priority
          />
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <BadgeCheck className="w-4 h-4 text-white" />
            <span>Trusted by 500+ Locations</span>
          </div>
        </div>
      </header>

      {/* ━━━ HERO — dark gradient + live sensor mosaic ━━━ */}
      <section className="bg-linear-to-br from-[#0a1628] via-[#0f172a] to-[#0a1628] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3b82f6] rounded-full blur-[180px] -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left — Copy */}
            <div>
              <span className="inline-block text-sm font-semibold text-blue-300 bg-blue-400/10 border border-blue-400/20 px-3 py-1 rounded-full mb-6">
                {category.category}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-5">
                {category.headline}
              </h1>

              <p className="text-lg text-blue-100/80 mb-8 leading-relaxed max-w-lg">
                {category.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-7 rounded-lg transition-all cursor-pointer shadow-lg shadow-blue-600/25"
                >
                  {category.ctaText} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-blue-200/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> No obligation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Setup in days
                </span>
              </div>
            </div>

            {/* Right — Live sensor mosaic */}
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-2xl shadow-black/40">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-semibold text-blue-200">Live Sensor Readings</span>
                  </div>
                  <span className="text-[10px] text-blue-300/50">8 sensors across 3 sites</span>
                </div>
                {/* Sensor grid */}
                <div className="grid grid-cols-4 gap-2">
                  {sensorTypes.map((s, i) => (
                    <div
                      key={i}
                      className="bg-white/7 border border-white/8 rounded-lg p-2.5 text-center hover:bg-white/12 transition-colors"
                    >
                      <s.icon className={`w-4 h-4 mx-auto mb-1.5 ${s.status === 'warn' ? 'text-amber-400' : 'text-blue-400'}`} />
                      <div className={`text-xs font-bold ${s.status === 'warn' ? 'text-amber-300' : 'text-white'}`}>{s.reading}</div>
                      <div className="text-[9px] text-blue-300/50 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Sites summary */}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {siteLocations.map((site, i) => (
                    <div key={i} className="bg-white/5 border border-white/6 rounded-lg px-2.5 py-2">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span className="text-[10px] font-semibold text-blue-200 truncate">{site.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-blue-300/50">{site.sensors} sensors</span>
                        <span className="text-green-400 font-bold">{site.compliance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stats overlay */}
              <div className="absolute -bottom-6 left-4 right-4 grid grid-cols-4 gap-2">
                {[
                  { value: '500+', label: 'Locations' },
                  { value: '1M+', label: 'Daily Checks' },
                  { value: '24/7', label: 'Monitoring' },
                  { value: '99.9%', label: 'Uptime' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/95 backdrop-blur-sm rounded-lg p-2.5 text-center shadow-lg">
                    <div className="text-lg font-bold text-[#1e40af]">{stat.value}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-8 pt-4 relative z-10">
          <ChevronDown className="w-5 h-5 text-blue-300/40 animate-bounce" />
        </div>
      </section>

      {/* ━━━ TRUSTED BY ━━━ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Trusted by operational leaders at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {['Morningstar Senior Living', 'OVG Hospitality', 'BP', 'John Lewis', 'Greggs', 'ISS'].map((name) => (
              <span key={name} className="text-base font-bold tracking-tight text-slate-300">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Up and Running in Days, Not Months
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Checkit deploys fast with minimal IT involvement. Wireless sensors, mobile apps, and a cloud dashboard — all working together from day one.
            </p>
          </div>

          {/* Visual flow: Sensors → Cloud → Dashboard */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { step: '1', icon: Wifi, title: 'Connect', desc: 'Deploy wireless IoT sensors for temperature, humidity, doors, and more — or go mobile-first with our app. No complex wiring.' },
              { step: '2', icon: CloudUpload, title: 'Monitor', desc: 'Sensors report automatically 24/7. Instant alerts via SMS, email, or push when readings go out of range or checks are missed.' },
              { step: '3', icon: BarChart3, title: 'Act', desc: 'Real-time dashboards across every location. Audit-ready compliance reports in seconds. Spot trends before they become problems.' },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-blue-300" />
                  </div>
                )}
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-bold uppercase text-slate-400 mb-1 block">Step {item.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Workflow examples strip */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Temperature Logging', 'Opening & Closing', 'Cleaning Checks', 'Safety Audits', 'Food Safety HACCP', 'Equipment Checks', 'Receiving & Inventory', 'Custom Workflows'].map((wf) => (
              <span key={wf} className="text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                {wf}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ PLATFORM — sensor ecosystem + capabilities ━━━ */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Sensor ecosystem visual */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
                {/* Sensor types header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-900">IoT Sensor Ecosystem</span>
                  <span className="text-[10px] text-slate-400">Plug &amp; play — all wireless</span>
                </div>
                {/* Sensor grid */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: ThermometerSun, label: 'Temperature', range: '-80°C to +200°C' },
                    { icon: Droplets, label: 'Humidity', range: '0 – 100% RH' },
                    { icon: Wind, label: 'CO₂ / O₂', range: '0 – 5,000 ppm' },
                    { icon: DoorOpen, label: 'Door / Window', range: 'Open / Closed' },
                    { icon: Droplets, label: 'Water Leak', range: 'Wet / Dry' },
                    { icon: Radio, label: 'Motion / Occupancy', range: 'Zone counting' },
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center hover:border-blue-300 transition-colors">
                      <s.icon className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                      <div className="text-xs font-semibold text-gray-900">{s.label}</div>
                      <div className="text-[10px] text-slate-400">{s.range}</div>
                    </div>
                  ))}
                </div>
                {/* Connectivity */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Wi-Fi, Cellular &amp; Ethernet</div>
                    <div className="text-[10px] text-slate-500">5-year battery life · Data buffering for zero data loss · ISO 17025 calibration</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Copy + cards */}
            <div className="order-1 lg:order-2">
              <span className="inline-block text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-4">
                IoT Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                One Platform. Every Sensor. Complete Visibility.
              </h2>
              <p className="text-gray-600 mb-8">
                Checkit connects wireless IoT sensors across your entire estate — from fridges and warehouses to kitchens, prep areas, and loading docks. One platform to monitor, alert, and report.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {capabilities.map((cap, i) => (
                  <div key={i} className="p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                    <cap.icon className="w-5 h-5 text-blue-600 mb-2" />
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{cap.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{cap.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ BENEFITS — dark gradient, glassmorphism ━━━ */}
      <section className="bg-linear-to-br from-[#0a1628] via-[#0f172a] to-[#0a1628] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Why Operational Leaders Choose Checkit
            </h2>
            <p className="text-blue-200/70 max-w-2xl mx-auto">
              From single-site operations to multi-site estates, Checkit delivers measurable impact from day one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 bg-blue-400/15 rounded-lg flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-blue-300" />
                </div>
                <h3 className="font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-blue-100/60 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ ROI — results with visual dashboard mockup ━━━ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Stats */}
            <div>
              <span className="inline-block text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-4">
                Proven Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                The Impact of Switching to Checkit
              </h2>
              <p className="text-gray-600 mb-10">
                Across our customer base, Checkit delivers operational and financial impact that goes directly to your bottom line.
              </p>

              <div className="space-y-8">
                {[
                  { value: '40%', label: 'Reduction in Compliance Workload', desc: 'Eliminate manual checks and paper processes — free your team for higher-value work.' },
                  { value: '100%', label: 'Digital Audit Trail Coverage', desc: 'Every reading, every check, every corrective action — timestamped and traceable.' },
                  { value: '3x', label: 'Faster Audit Preparation', desc: 'Generate regulator-ready compliance reports in seconds, not weeks.' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="text-3xl sm:text-4xl font-bold text-blue-600 shrink-0 w-24 text-right">{stat.value}</div>
                    <div className="border-l-2 border-blue-200 pl-4">
                      <div className="font-semibold text-gray-900">{stat.label}</div>
                      <p className="text-sm text-gray-500 mt-0.5">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Dashboard mockup */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Title bar */}
              <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Multi-Site Compliance Dashboard</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
              </div>
              {/* Dashboard content */}
              <div className="p-5 space-y-4">
                {/* Top stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Sites', value: '12', sub: 'Active' },
                    { label: 'Sensors Online', value: '347', sub: '99.7% uptime' },
                    { label: 'Today\'s Checks', value: '2,841', sub: 'All complete' },
                  ].map((d, i) => (
                    <div key={i} className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{d.label}</div>
                      <div className="text-xl font-bold text-gray-900">{d.value}</div>
                      <div className="text-[10px] text-green-600">{d.sub}</div>
                    </div>
                  ))}
                </div>
                {/* Sites list */}
                <div className="bg-white rounded-lg border border-slate-200">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900">Site Overview</span>
                    <span className="text-[10px] text-slate-400">Last 24h</span>
                  </div>
                  {[
                    { name: 'London HQ', status: 'green', sensors: 48, compliance: '100%' },
                    { name: 'Manchester Depot', status: 'green', sensors: 32, compliance: '99.8%' },
                    { name: 'Birmingham East', status: 'amber', sensors: 24, compliance: '98.5%' },
                    { name: 'Leeds Distribution', status: 'green', sensors: 41, compliance: '99.9%' },
                  ].map((site, i) => (
                    <div key={i} className="px-3 py-2 flex items-center justify-between border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${site.status === 'green' ? 'bg-green-400' : 'bg-amber-400'}`} />
                        <span className="text-xs text-gray-700">{site.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px]">
                        <span className="text-slate-400">{site.sensors} sensors</span>
                        <span className="font-semibold text-green-600">{site.compliance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Customers Say
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-100" />
              <div className="w-10 h-10 bg-[#1e40af] rounded-full flex items-center justify-center text-white font-bold text-sm mb-5">VP</div>
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;Checkit has fundamentally changed the way we manage compliance across our sites. What used to take hours of paper-based checks now happens automatically. Our teams focus on operations instead of paperwork.&rdquo;
              </p>
              <div className="border-t border-slate-100 pt-4">
                <div className="font-semibold text-gray-900">VP of Operations</div>
                <div className="text-sm text-gray-500">Multi-Site Food Service Organization</div>
                <div className="text-sm text-blue-600 font-medium">500+ Locations Across the US</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-100" />
              <div className="w-10 h-10 bg-[#1e40af] rounded-full flex items-center justify-center text-white font-bold text-sm mb-5">DO</div>
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;We went from binders full of paper logs to a fully digital system in under a week. Now every temperature reading, every checklist, every corrective action is recorded automatically. Audit prep that used to take days now takes minutes.&rdquo;
              </p>
              <div className="border-t border-slate-100 pt-4">
                <div className="font-semibold text-gray-900">Director of Operations</div>
                <div className="text-sm text-gray-500">National Senior Living Provider</div>
                <div className="text-sm text-blue-600 font-medium">41 Communities Across 7 States</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ INDUSTRIES ━━━ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Built for Compliance-Heavy Industries
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Checkit is purpose-built for organizations where compliance, safety, and operational visibility are non-negotiable.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Building2, title: 'Senior Living', desc: 'Resident safety, food safety, environmental monitoring, and regulatory compliance across communities.' },
              { icon: ThermometerSun, title: 'Food Retail & QSR', desc: 'Temperature logging, HACCP checklists, and hygiene compliance for multi-site retail operations.' },
              { icon: Activity, title: 'Convenience & Fuel Retail', desc: 'Food-to-go safety, temperature monitoring, and operational checklists for forecourt and convenience stores.' },
              { icon: Globe2, title: 'Facilities & Venues', desc: 'Event-day food service, venue operations, and multi-site facilities with real-time oversight.' },
              { icon: Shield, title: 'Hospitality', desc: 'Digital HACCP, kitchen safety, allergen management, and supplier compliance across hotels and restaurants.' },
              { icon: Zap, title: 'Manufacturing', desc: 'Environmental monitoring, equipment checks, and production-line compliance with automated data capture.' },
            ].map((ind, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl p-5 border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center bg-blue-50">
                  <ind.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{ind.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ WHY CHECKIT ━━━ */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            What Sets Checkit Apart
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Wifi, title: 'Sensors + Software, One Vendor', desc: 'We design and manufacture our own IoT hardware and software. No third-party integration headaches, no finger-pointing. One platform, one support team.' },
              { icon: HeadphonesIcon, title: '24/7 Support & Managed Service', desc: 'Our team monitors your sensor network around the clock. If a sensor goes offline or needs calibration, we handle it — often before you even notice.' },
              { icon: Shield, title: 'ISO 17025 / UKAS Accredited', desc: 'Our calibration lab is UKAS accredited to ISO 17025. Sensor accuracy you can trust for regulatory compliance and audit confidence.' },
              { icon: Clock, title: 'Peace of Mind Subscription', desc: 'Hardware, software, calibration, and support — all included in a predictable subscription. No capital outlay, no surprise costs, always covered.' },
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl p-6 bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center bg-blue-50">
                  <d.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{d.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            Common Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform text-slate-400"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm leading-relaxed text-gray-500">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CERTIFICATIONS ━━━ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {certifications.map((cert, i) => (
              <span key={i} className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FORM SECTION — dark gradient + glow ━━━ */}
      <section className="bg-linear-to-br from-[#0a1628] via-[#0f172a] to-[#0a1628] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-blue-400 rounded-full blur-[200px] -translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to See Checkit in Action?
              </h2>
              <p className="text-blue-100/70 mb-8 leading-relaxed">
                Book a personalised demo and see how Checkit can automate compliance, protect your operations, and give you real-time visibility across every location.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Personalised demo tailored to your industry and use case',
                  'ROI projection based on your number of sites',
                  'Live walkthrough of sensors, apps, and dashboards',
                  'Implementation timeline and pricing overview',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <span className="text-blue-100/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-200/40">Typical demo takes 30 minutes. No obligation.</p>
            </div>

            {/* Form */}
            <div ref={formRef} className="bg-white rounded-xl shadow-2xl shadow-black/30 p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you, {formData.firstName}!</h3>
                  <p className="text-gray-600">A Checkit specialist will be in touch within one business day.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Request Your Free Demo</h3>
                  <p className="text-sm text-gray-500 mb-6">Complete the form and we&apos;ll be in touch within one business day.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField id="firstName" label="First Name" required value={formData.firstName} onChange={handleChange} />
                      <FormField id="lastName" label="Last Name" required value={formData.lastName} onChange={handleChange} />
                    </div>
                    <FormField id="email" label="Work Email" type="email" required value={formData.email} onChange={handleChange} />
                    <FormField id="company" label="Company" required value={formData.company} onChange={handleChange} />
                    <FormField id="phone" label="Phone" type="tel" value={formData.phone} onChange={handleChange} />
                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : category.ctaText}
                    </button>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                      <Lock className="w-3 h-3" />
                      <span>Your information is secure and will never be shared.</span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="bg-[#0a1628] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-200/40">
          <span>&copy; {new Date().getFullYear()} Checkit Ltd. All rights reserved.</span>
          <span>LSE: CHK &middot; London, UK &middot; ISO 17025 / UKAS Accredited</span>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FORM FIELD
═══════════════════════════════════════════════ */
function FormField({
  id, label, type = 'text', required, value, onChange,
}: {
  id: string; label: string; type?: string; required?: boolean;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={id} name={id} type={type} required={required} value={value} onChange={onChange}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}
