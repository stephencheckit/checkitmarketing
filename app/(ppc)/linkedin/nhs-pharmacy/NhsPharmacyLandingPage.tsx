'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Shield,
  Lock,
  Building2,
  Activity,
  Clock,
  Loader2,
  Thermometer,
  ClipboardCheck,
  TrendingDown,
  Zap,
  BadgeCheck,
  ArrowRight,
  ChevronDown,
  Quote,
  Wind,
  Gauge,
  FlaskConical,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────
interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

// ─── LinkedIn Conversion Tracking (global type augmentation) ────────
declare global {
  interface Window {
    lintrk?: (action: string, data: Record<string, unknown>) => void;
  }
}

// ─── Component ──────────────────────────────────────────────────────
export default function NhsPharmacyLandingPage() {
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

  // Capture UTM parameters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm: UtmParams = {};
    const keys: (keyof UtmParams)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          source: 'linkedin',
          listing: 'nhs-pharmacy',
          categoryName: 'NHS Pharmacy - CAM+',
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

      // === FIRE LINKEDIN CONVERSION TRACKING ===
      // Uncomment and set your conversion_id when ready:
      // if (typeof window.lintrk === 'function') {
      //   window.lintrk('track', { conversion_id: XXXXXXX });
      // }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Data ───────────────────────────────────────────────────────
  const stats = [
    { value: '60+', label: 'NHS Trusts Served', icon: Building2 },
    { value: '300+', label: 'NHS Sites Live', icon: Activity },
    { value: '24/7', label: 'Continuous Monitoring', icon: Clock },
    { value: '<10', label: 'Days to Deploy', icon: Zap },
  ];

  const roiStats = [
    {
      value: '£3.7m',
      label: 'Staff Time Repurposed Annually',
      description:
        'Eliminate manual temperature checks and free clinical staff for patient care',
    },
    {
      value: '£2.6m',
      label: 'Reduction in Stock Loss',
      description:
        'Protect high-value medicines, vaccines, and biologics from temperature excursions',
    },
    {
      value: '£840k',
      label: 'Saved in Audit Time',
      description:
        'Instant compliance reports replace weeks of manual record gathering',
    },
  ];

  const capabilities = [
    {
      icon: Thermometer,
      title: 'Temperature Monitoring',
      description:
        'Fridge, freezer, cryogenic, and ambient temperature sensors with UKAS-traceable calibration. Protect medicines from -80\u00b0C to +100\u00b0C.',
    },
    {
      icon: Wind,
      title: 'O\u2082 & CO\u2082 Monitoring',
      description:
        'Continuous oxygen and carbon dioxide level monitoring for controlled environments, cleanrooms, and storage areas.',
    },
    {
      icon: Gauge,
      title: 'Differential Pressure',
      description:
        'Monitor pressure differentials across cleanrooms, isolation rooms, and pharmaceutical preparation areas.',
    },
    {
      icon: FlaskConical,
      title: 'Humidity & Environmental',
      description:
        'Track humidity, door status, and ambient conditions to maintain optimal storage environments for sensitive medicines.',
    },
  ];

  const benefits = [
    {
      icon: ClipboardCheck,
      title: 'Audit-Ready in Seconds',
      description:
        'Digital audit trails compliant with MHRA, CQC, GMP, and 21 CFR Part 11. Generate compliance reports at the click of a button.',
    },
    {
      icon: Shield,
      title: 'Protect High-Value Stock',
      description:
        'A single batch of advanced cancer drugs can cost tens of thousands of pounds. Prevent costly excursions with real-time alerts.',
    },
    {
      icon: TrendingDown,
      title: 'Predict Failures Before They Happen',
      description:
        'Asset Intelligence uses AI and machine learning to identify fridges and freezers at risk of failure, enabling proactive budgeting.',
    },
    {
      icon: Zap,
      title: 'Deploy in Days, Not Months',
      description:
        'Proven rapid deployment \u2014 Checkit equipped NHS Nightingale with full monitoring in just 7 working days, including calibration.',
    },
  ];

  const certifications = [
    'ISO 27001',
    'ISO 9001',
    'ISO 17025',
    'UKAS Accredited',
    'Cyber Essentials',
    'UK Manufactured',
  ];

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* ━━━ Header ━━━ */}
      <header className="bg-[#003087]">
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
            <span>Trusted by 60+ NHS Trusts</span>
          </div>
        </div>
      </header>

      {/* ━━━ Hero ━━━ */}
      <section className="bg-linear-to-br from-[#001d4a] via-[#003087] to-[#001d4a] text-white relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0ea5e9] rounded-full blur-[180px] -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left — Copy */}
            <div>
              <span className="inline-block text-sm font-semibold text-teal-300 bg-teal-400/10 border border-teal-400/20 px-3 py-1 rounded-full mb-6">
                NHS Pharmacy Compliance
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-5">
                Eliminate Manual Temperature Checks.{' '}
                <span className="text-teal-300">
                  Automate Pharmacy Compliance.
                </span>
              </h1>

              <p className="text-lg text-blue-100/80 mb-8 leading-relaxed max-w-lg">
                CAM+ (Connected Automated Monitoring) gives NHS pharmacy leaders
                24/7 temperature monitoring, automated audit trails, and
                real-time alerts — so your team can focus on patient care, not
                paperwork.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3.5 px-7 rounded-lg transition-all cursor-pointer shadow-lg shadow-teal-500/25"
                >
                  Get Your Free Compliance Assessment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-blue-200/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  No obligation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  MHRA &amp; CQC compliant
                </span>
              </div>
            </div>

            {/* Right — Dashboard Preview */}
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                <Image
                  src="/dashboard-temperature-monitoring.png"
                  alt="Checkit CAM+ real-time temperature monitoring dashboard showing NHS pharmacy fridge and freezer readings"
                  width={1024}
                  height={576}
                  className="w-full h-auto"
                  priority
                />
              </div>
              {/* Floating stats overlay */}
              <div className="absolute -bottom-6 left-4 right-4 grid grid-cols-4 gap-2">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/95 backdrop-blur-sm rounded-lg p-2.5 text-center shadow-lg"
                  >
                    <div className="text-lg font-bold text-[#003087]">
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
          <ChevronDown className="w-5 h-5 text-blue-300/40 animate-bounce" />
        </div>
      </section>

      {/* ━━━ The Problem ━━━ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              NHS Pharmacies Face Growing Compliance Pressure
            </h2>
            <p className="text-gray-600 leading-relaxed">
              With the 2025/26 NHS pharmacy funding framework delivering a 19.7%
              uplift and greater scrutiny from regulators, pharmacy leaders need
              to demonstrate continuous compliance — not just at inspection time.
              Manual temperature logs, paper-based records, and reactive incident
              management are no longer sufficient.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                stat: '\u00a3700+',
                label:
                  'Cost per controlled drug item at risk from a single fridge failure',
              },
              {
                stat: '10,000+',
                label:
                  'Daily samples processed at large NHS trusts requiring continuous monitoring',
              },
              {
                stat: '90+',
                label:
                  'Medical fridges across a typical multi-site NHS trust needing oversight',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm"
              >
                <div className="text-2xl font-bold text-[#003087] mb-2">
                  {item.stat}
                </div>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CAM+ Sensor Capabilities ━━━ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Sensor Network Diagram */}
            <div className="order-2 lg:order-1">
              <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200">
                <Image
                  src="/sensor-network-diagram.png"
                  alt="Checkit CAM+ connected sensor network for hospital pharmacies — temperature, humidity, O2, CO2, differential pressure, and door monitoring"
                  width={1024}
                  height={576}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right — Copy + Cards */}
            <div className="order-1 lg:order-2">
              <span className="inline-block text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-4">
                CAM+ Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                One Platform. Every Sensor. Complete Compliance.
              </h2>
              <p className="text-gray-600 mb-8">
                CAM+ connects wireless sensors across your entire pharmacy
                estate — from medicine fridges and walk-in freezers to
                cleanrooms and preparation areas.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {capabilities.map((cap, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/50 transition-all"
                  >
                    <cap.icon className="w-5 h-5 text-teal-600 mb-2" />
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-4">
                All sensors feature 5-year battery life, data buffering for zero
                data loss, and ISO 17025 traceable calibration from
                UKAS-accredited laboratories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Key Benefits ━━━ */}
      <section className="bg-linear-to-br from-[#001d4a] via-[#003087] to-[#001d4a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Why Leading NHS Trusts Choose Checkit
            </h2>
            <p className="text-blue-200/70 max-w-2xl mx-auto">
              From single-site pharmacies to multi-trust networks, Checkit
              delivers measurable impact from day one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-teal-400/15 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-teal-300" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-blue-100/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ ROI Section with Compliance Image ━━━ */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — ROI Copy */}
            <div>
              <span className="inline-block text-sm font-semibold text-[#003087] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-4">
                Proven Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Measurable Return on Investment
              </h2>
              <p className="text-gray-600 mb-10">
                Across our NHS customer base, Checkit delivers financial impact
                that goes directly to your bottom line.
              </p>

              <div className="space-y-8">
                {roiStats.map((stat, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="text-3xl sm:text-4xl font-bold text-teal-600 shrink-0 w-28 text-right">
                      {stat.value}
                    </div>
                    <div className="border-l-2 border-teal-200 pl-4">
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

            {/* Right — Compliance Report Image */}
            <div>
              <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200">
                <Image
                  src="/compliance-audit-report.png"
                  alt="Checkit compliance audit report showing 99.7% compliance score, temperature readings, and MHRA/CQC compliance badges"
                  width={1024}
                  height={576}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                Compliance reporting dashboard — audit-ready at the click of a
                button
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ Social Proof — Quotes ━━━ */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Trusted by NHS Pharmacy Leaders
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative">
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-teal-100" />
              </div>
              <div className="w-10 h-10 bg-[#003087] rounded-full flex items-center justify-center text-white font-bold text-sm mb-5">
                NB
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;The dashboard gives me all the information I need,
                wherever I happen to be and whenever I need to check. Now I know
                exactly what the breach was, where it was and how long it lasted,
                so I can make better judgments about the next steps.&rdquo;
              </p>
              <div className="border-t border-slate-100 pt-4">
                <div className="font-semibold text-gray-900">Nigel Barnes</div>
                <div className="text-sm text-gray-500">
                  Director of Pharmacy &amp; Medicines Management
                </div>
                <div className="text-sm text-teal-600 font-medium">
                  Birmingham &amp; Solihull Mental Health NHS Foundation Trust
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative">
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-teal-100" />
              </div>
              <div className="w-10 h-10 bg-[#003087] rounded-full flex items-center justify-center text-white font-bold text-sm mb-5">
                NP
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                &ldquo;The Covid vaccination programme has been rolled out at an
                astonishing pace. The Checkit team did a fantastic job within an
                extremely short time frame, installing monitoring across our
                vaccination centres.&rdquo;
              </p>
              <div className="border-t border-slate-100 pt-4">
                <div className="font-semibold text-gray-900">Naheed Phul</div>
                <div className="text-sm text-gray-500">
                  Deputy Chief Pharmacist
                </div>
                <div className="text-sm text-teal-600 font-medium">
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
                className="text-xs font-semibold text-[#003087] bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Form Section ━━━ */}
      <section className="bg-linear-to-br from-[#001d4a] via-[#003087] to-[#001d4a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-teal-400 rounded-full blur-[200px] -translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left — CTA Copy */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Get Your Free NHS Pharmacy Compliance Assessment
              </h2>
              <p className="text-blue-100/70 mb-8 leading-relaxed">
                Our specialists will review your current monitoring setup and
                show you exactly how CAM+ can automate compliance, protect your
                stock, and free your pharmacy team from manual checks — with a
                tailored ROI projection for your trust.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Personalised compliance gap analysis for your pharmacy estate',
                  'ROI projection based on your number of sites and fridges',
                  'Live platform demonstration with real NHS pharmacy data',
                  'Implementation timeline tailored to your trust',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                    <span className="text-blue-100/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-blue-200/40">
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
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Thank You, {formData.firstName}!
                  </h3>
                  <p className="text-gray-600">
                    Your compliance assessment request has been received. A
                    Checkit NHS specialist will be in touch within one working
                    day.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Request Your Free Assessment
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Complete the form below and we&apos;ll be in touch within one
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
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
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
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
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
                        placeholder="name@nhs.net"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        NHS Trust / Organisation{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
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
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
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
                        placeholder="e.g. Chief Pharmacist, Head of Pharmacy"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
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
                      className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
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
      <footer className="bg-[#001d4a] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-blue-200/40">
          &copy; {new Date().getFullYear()} Checkit Ltd. All rights reserved. UK
          Manufactured.
        </div>
      </footer>
    </div>
  );
}
