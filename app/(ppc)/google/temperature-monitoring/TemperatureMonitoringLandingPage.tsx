'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Shield,
  Lock,
  Loader2,
  Thermometer,
  Wifi,
  Bell,
  BarChart3,
  ArrowRight,
  ChevronDown,
  Clock,
  Building2,
  Zap,
  BadgeCheck,
  ClipboardCheck,
  TrendingDown,
  Quote,
  Droplets,
  MapPin,
  Server,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────
interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
}

// ─── Google Ads Conversion Tracking (global type augmentation) ────
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// ─── Component ──────────────────────────────────────────────────────
export default function TemperatureMonitoringLandingPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [utmParams, setUtmParams] = useState<UtmParams>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    jobTitle: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Capture UTM parameters + gclid from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: UtmParams = {};
    const keys: (keyof UtmParams)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'gclid',
    ];
    keys.forEach((key) => {
      const val = params.get(key);
      if (val) utm[key] = val;
    });
    setUtmParams(utm);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/ppc-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'google',
          listing: 'temperature-monitoring',
          categoryName: 'Medical Temperature Monitoring',
          pageUrl: window.location.href,
          referrer: document.referrer,
          ...utmParams,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);

      // === FIRE GOOGLE ADS CONVERSION TRACKING ===
      // Uncomment and set your conversion label when ready:
      // if (typeof window.gtag === 'function') {
      //   window.gtag('event', 'conversion', {
      //     send_to: 'AW-XXXXXXXXX/XXXXXXXXXXXX',
      //     value: 1.0,
      //     currency: 'USD',
      //   });
      // }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Data ───────────────────────────────────────────────────────
  const trustStats = [
    { value: '500+', label: 'Medical Sites Live', icon: Building2 },
    { value: '24/7', label: 'Continuous Monitoring', icon: Clock },
    { value: '1M+', label: 'Daily Readings', icon: BarChart3 },
    { value: '<10', label: 'Days to Deploy', icon: Zap },
  ];

  const painPoints = [
    {
      stat: '$50K+',
      label: 'average loss from a single vaccine or pharmaceutical fridge failure',
    },
    {
      stat: '40%',
      label: 'of manual temperature logs contain errors, gaps, or missed readings',
    },
    {
      stat: '73%',
      label: 'of healthcare facilities report anxiety around regulatory audits',
    },
  ];

  const features = [
    {
      icon: Thermometer,
      title: 'Medical-Grade Temperature Sensors',
      description:
        'Monitor vaccine fridges, pharmacy cold storage, blood bank freezers, and cryogenic units from -80°C to +100°C with UKAS-traceable calibration.',
    },
    {
      icon: Droplets,
      title: 'Humidity & Environmental',
      description:
        'Track temperature and humidity together for cleanrooms, preparation areas, and sensitive storage environments. Monitor door status and ambient conditions.',
    },
    {
      icon: Wifi,
      title: 'Wireless Connectivity',
      description:
        'Wi-Fi, Ethernet, and Cellular options. Sensors buffer data locally so you never lose readings — even during network outages or power events.',
    },
    {
      icon: MapPin,
      title: 'Multi-Site Remote Monitoring',
      description:
        'Monitor every pharmacy, clinic, lab, and storage facility from a single dashboard — whether you manage 1 site or 500.',
    },
  ];

  const benefits = [
    {
      icon: Bell,
      title: 'Instant Alerts Protect Patients & Stock',
      description:
        'Get SMS, email, or push notifications the moment a fridge or freezer goes out of range. Respond in minutes — before vaccines, biologics, or medicines are compromised.',
    },
    {
      icon: ClipboardCheck,
      title: 'Regulatory-Ready Compliance Records',
      description:
        'Replace paper logs with digital audit trails compliant with FDA, MHRA, CDC, Joint Commission, and CQC requirements. Generate reports in seconds.',
    },
    {
      icon: TrendingDown,
      title: 'Predict Equipment Failures',
      description:
        'AI-powered analytics identify medical fridges and freezers trending toward failure — so you can act before you lose high-value stock.',
    },
    {
      icon: Shield,
      title: 'Protect High-Value Medical Inventory',
      description:
        'Vaccines, biologics, blood products, pharmaceuticals, and research samples — ensure every item stays within its required temperature range, 24/7.',
    },
  ];

  const useCases = [
    'Hospital Pharmacies',
    'Vaccine Storage (VFC)',
    'Blood Banks & Plasma',
    'Clinical Laboratories',
    'Senior Living & Long-Term Care',
    'Pharmaceutical & Biotech',
  ];

  const certifications = [
    'ISO 27001',
    'ISO 9001',
    'ISO 17025',
    'UKAS Accredited',
    'Cyber Essentials',
    '21 CFR Part 11 Ready',
  ];

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* ━━━ Header ━━━ */}
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
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>Trusted by 500+ Medical Facilities</span>
          </div>
          <button
            onClick={scrollToForm}
            className="sm:hidden text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Get a Demo
          </button>
        </div>
      </header>

      {/* ━━━ Hero ━━━ */}
      <section className="bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left — Copy */}
            <div>
              <span className="inline-block text-sm font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full mb-6">
                Medical Temperature Monitoring System
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-5">
                Protect Vaccines, Medicines &amp; Biologics.{' '}
                <span className="text-emerald-400">
                  Monitor Temperatures Automatically.
                </span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-lg">
                Checkit&apos;s wireless temperature monitoring system gives
                healthcare and pharmacy teams 24/7 visibility across every
                medical fridge, freezer, and cold storage unit — with instant
                alerts, automated compliance logs, and audit-ready reports.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3.5 px-7 rounded-lg transition-all cursor-pointer shadow-lg shadow-emerald-500/25"
                >
                  Get Your Free Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No obligation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Deploys in under 10 days
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  UKAS / ISO 17025 calibrated
                </span>
              </div>
            </div>

            {/* Right — Dashboard Preview */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                <Image
                  src="/dashboard-temperature-monitoring.png"
                  alt="Checkit medical temperature monitoring dashboard showing real-time vaccine fridge, pharmacy freezer, and cold storage readings with alerts"
                  width={1024}
                  height={576}
                  className="w-full h-auto"
                  priority
                />
              </div>
              {/* Floating stats overlay */}
              <div className="absolute -bottom-6 left-4 right-4 grid grid-cols-4 gap-2">
                {trustStats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/95 backdrop-blur-sm rounded-lg p-2.5 text-center shadow-lg"
                  >
                    <div className="text-lg font-bold text-[#0f172a]">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-gray-500 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-8 pt-4 relative z-10">
          <ChevronDown className="w-5 h-5 text-slate-500 animate-bounce" />
        </div>
      </section>

      {/* ━━━ The Problem ━━━ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Manual Temperature Logging Puts Patients &amp; Stock at Risk
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Paper logs, clipboard rounds, and reactive fire-fighting are
              unreliable and dangerous in medical settings. One missed reading
              can mean spoiled vaccines, compromised biologics, failed
              inspections, or regulatory action — and you won&apos;t know
              until it&apos;s too late.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {painPoints.map((item, i) => (
              <div
                key={i}
                className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {item.stat}
                </div>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ How It Works ━━━ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              How Medical Temperature Monitoring Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three components working together to give you complete control
              over temperature compliance across your medical facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                icon: Server,
                title: 'Sensors Monitor Continuously',
                description:
                  'Wireless sensors placed in vaccine fridges, pharmacy freezers, blood banks, and lab environments take readings every few minutes — no manual checks needed.',
              },
              {
                step: '2',
                icon: Wifi,
                title: 'Data Transmitted Securely',
                description:
                  'Readings are sent via Wi-Fi, Ethernet, or Cellular to the Checkit cloud. Data is buffered locally — zero loss, even during power events or network outages.',
              },
              {
                step: '3',
                icon: BarChart3,
                title: 'You See Everything, Anywhere',
                description:
                  'Real-time dashboards, instant out-of-range alerts, and automated compliance reports. Monitor every medical facility from a single screen.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-sm font-semibold text-emerald-600 mb-2">
                  Step {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Sensor Capabilities ━━━ */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Sensor Diagram */}
            <div>
              <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200">
                <Image
                  src="/sensor-network-diagram.png"
                  alt="Checkit wireless sensor network diagram showing connected temperature monitoring across hospital pharmacies, labs, and medical cold storage"
                  width={1024}
                  height={576}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right — Copy + Cards */}
            <div>
              <span className="inline-block text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
                Medical-Grade Sensors
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                One System for Every Medical Environment
              </h2>
              <p className="text-gray-600 mb-8">
                From vaccine fridges and pharmacy cold rooms to blood bank
                freezers and cryogenic storage, Checkit&apos;s wireless
                sensors cover -80°C to +100°C — with 5-year battery life
                and UKAS-traceable calibration as standard.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
                  >
                    <feat.icon className="w-5 h-5 text-emerald-600 mb-2" />
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-4">
                All sensors include 5-year battery life, local data buffering,
                and ISO 17025 traceable calibration from UKAS-accredited labs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Key Benefits ━━━ */}
      <section className="bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Why Healthcare Teams Switch to Checkit
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Whether you&apos;re replacing paper logs or upgrading from a
              basic monitoring system, here&apos;s what changes on day one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-400/15 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-emerald-300" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Use Cases ━━━ */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Temperature Monitoring Across Healthcare
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Checkit is used by pharmacy, laboratory, compliance, and
              facilities teams across the healthcare sector.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {useCases.map((uc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-gray-800">{uc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ ROI Section ━━━ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — ROI Copy */}
            <div>
              <span className="inline-block text-sm font-semibold text-[#0f172a] bg-slate-200 border border-slate-300 px-3 py-1 rounded-full mb-4">
                Proven Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                The Cost of Not Monitoring
              </h2>
              <p className="text-gray-600 mb-10">
                Healthcare organisations that switch to automated temperature
                monitoring typically see payback within 3-6 months — and
                eliminate the risk of catastrophic stock loss.
              </p>

              <div className="space-y-8">
                {[
                  {
                    value: '90%',
                    label: 'Reduction in Staff Time on Manual Checks',
                    description:
                      'Free clinical and pharmacy staff from clipboard rounds. Sensors do the work — your people focus on patient care.',
                  },
                  {
                    value: '$50K+',
                    label: 'Saved per Prevented Fridge Failure',
                    description:
                      'A single overnight pharmacy fridge failure can destroy an entire vaccine or medication inventory. Alerts stop losses before they happen.',
                  },
                  {
                    value: '100%',
                    label: 'Regulatory-Ready Compliance Records',
                    description:
                      'No gaps, no missing logs. Digital records are always complete, timestamped, and ready for FDA, MHRA, CDC, or Joint Commission inspection.',
                  },
                ].map((stat, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="text-3xl sm:text-4xl font-bold text-emerald-600 shrink-0 w-24 text-right">
                      {stat.value}
                    </div>
                    <div className="border-l-2 border-emerald-200 pl-4">
                      <div className="font-semibold text-gray-900">
                        {stat.label}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Compliance Image */}
            <div>
              <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200">
                <Image
                  src="/compliance-audit-report.png"
                  alt="Checkit automated compliance report showing temperature readings, audit trail, and 99.7% compliance score"
                  width={1024}
                  height={576}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                Automated compliance reports — audit-ready at the click of a
                button
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Social Proof ━━━ */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Trusted by Healthcare Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative">
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-emerald-100" />
              </div>
              <div className="w-10 h-10 bg-[#0f172a] rounded-full flex items-center justify-center text-white font-bold text-sm mb-5">
                NB
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;The dashboard gives me all the information I need,
                wherever I happen to be and whenever I need to check. Now I
                know exactly what the breach was, where it was and how long it
                lasted, so I can make better judgments about the next
                steps.&rdquo;
              </p>
              <div className="border-t border-slate-200 pt-4">
                <div className="font-semibold text-gray-900">Nigel Barnes</div>
                <div className="text-sm text-gray-500">
                  Director of Pharmacy &amp; Medicines Management
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  Birmingham &amp; Solihull Mental Health NHS Foundation Trust
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative">
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-emerald-100" />
              </div>
              <div className="w-10 h-10 bg-[#0f172a] rounded-full flex items-center justify-center text-white font-bold text-sm mb-5">
                NP
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;Checkit installed monitoring across our vaccination
                centres within an extremely short time frame. The speed and
                reliability gave us confidence that our vaccines were stored
                safely at all times.&rdquo;
              </p>
              <div className="border-t border-slate-200 pt-4">
                <div className="font-semibold text-gray-900">Naheed Phul</div>
                <div className="text-sm text-gray-500">
                  Deputy Chief Pharmacist
                </div>
                <div className="text-sm text-emerald-600 font-medium">
                  Barts Health NHS Trust
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Certifications Bar ━━━ */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {certifications.map((cert, i) => (
              <span
                key={i}
                className="text-xs font-semibold text-[#0f172a] bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Form Section ━━━ */}
      <section className="bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-emerald-400 rounded-full blur-[200px] -translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left — CTA Copy */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Get Your Free Medical Monitoring Assessment
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Tell us about your facilities and we&apos;ll show you exactly
                how Checkit can eliminate manual checks, protect your medical
                inventory, and keep you inspection-ready — with a tailored
                ROI estimate.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Personalised compliance gap analysis for your facilities',
                  'ROI projection based on your sites, fridges, and freezers',
                  'Live platform demonstration with real medical monitoring data',
                  'Deployment plan tailored to your organisation',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-slate-500">
                Typical assessment takes 30 minutes. No obligation, no hard
                sell.
              </p>
            </div>

            {/* Right — Form */}
            <div
              ref={formRef}
              className="bg-white rounded-xl shadow-2xl shadow-black/30 p-6 sm:p-8"
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Thank You, {formData.firstName}!
                  </h3>
                  <p className="text-gray-600">
                    Your assessment request has been received. A Checkit
                    specialist will be in touch within one working day to
                    discuss your temperature monitoring needs.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Request Your Free Assessment
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Complete the form and we&apos;ll be in touch within one
                    working day.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          First Name{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Last Name{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Work Email{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Company / Organisation{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="jobTitle"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Job Title
                      </label>
                      <input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Chief Pharmacist, Lab Manager, Facilities Director"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Get My Free Assessment'
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                      <Lock className="w-3 h-3" />
                      <span>
                        Your information is secure and will never be shared.
                      </span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Footer ━━━ */}
      <footer className="bg-[#0f172a] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Checkit Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
