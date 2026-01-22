'use client';

import { useState, useMemo } from 'react';
import { Calculator, ArrowLeft, Download, Building2, Users, Clock, DollarSign, TrendingUp, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Vertical presets with industry-specific defaults
const verticalPresets = [
  {
    id: 'senior-living',
    name: 'Senior Living (US)',
    icon: '🏥',
    defaults: {
      locations: 12,
      tasksPerDay: 45,
      avgHourlyWage: 18,
      minutesPerTask: 4,
      auditFrequency: 4, // per year
      auditPrepHours: 24,
      complianceRiskCost: 75000, // avg violation cost
    },
    description: 'CQC inspections, resident safety checks, medication logging',
  },
  {
    id: 'facilities-food',
    name: 'Facilities Food Ops',
    icon: '🏟️',
    defaults: {
      locations: 8,
      tasksPerDay: 60,
      avgHourlyWage: 16,
      minutesPerTask: 3,
      auditFrequency: 6,
      auditPrepHours: 16,
      complianceRiskCost: 50000,
    },
    description: 'Stadiums, venues, event-day operations',
  },
  {
    id: 'nhs-pharmacy',
    name: 'NHS Pharmacies (UK)',
    icon: '💊',
    defaults: {
      locations: 25,
      tasksPerDay: 30,
      avgHourlyWage: 14, // GBP
      minutesPerTask: 5,
      auditFrequency: 2,
      auditPrepHours: 40,
      complianceRiskCost: 100000, // GPhC penalties
    },
    description: 'Controlled drugs, fridge temps, GPhC compliance',
  },
  {
    id: 'food-retail',
    name: 'Multi-site Food Retail',
    icon: '🛒',
    defaults: {
      locations: 50,
      tasksPerDay: 35,
      avgHourlyWage: 12, // GBP
      minutesPerTask: 3,
      auditFrequency: 4,
      auditPrepHours: 20,
      complianceRiskCost: 40000,
    },
    description: 'BP, Greggs, John Lewis food service',
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: '⚙️',
    defaults: {
      locations: 20,
      tasksPerDay: 40,
      avgHourlyWage: 15,
      minutesPerTask: 4,
      auditFrequency: 4,
      auditPrepHours: 20,
      complianceRiskCost: 50000,
    },
    description: 'Enter your own values',
  },
];

export default function PaperToDigitalCalculator() {
  const [selectedVertical, setSelectedVertical] = useState(verticalPresets[0]);
  const [currency, setCurrency] = useState<'USD' | 'GBP'>('USD');
  
  // Form inputs
  const [inputs, setInputs] = useState(verticalPresets[0].defaults);

  // Update inputs when vertical changes
  const handleVerticalChange = (verticalId: string) => {
    const vertical = verticalPresets.find(v => v.id === verticalId);
    if (vertical) {
      setSelectedVertical(vertical);
      setInputs(vertical.defaults);
      // Auto-set currency for UK verticals
      if (verticalId === 'nhs-pharmacy' || verticalId === 'food-retail') {
        setCurrency('GBP');
      } else {
        setCurrency('USD');
      }
    }
  };

  // Calculate ROI
  const calculations = useMemo(() => {
    const { locations, tasksPerDay, avgHourlyWage, minutesPerTask, auditFrequency, auditPrepHours, complianceRiskCost } = inputs;
    
    // Labor savings from digitization
    const timeSavedPerTaskMinutes = minutesPerTask * 0.6; // 60% time reduction
    const dailyTimeSavedPerLocation = (tasksPerDay * timeSavedPerTaskMinutes) / 60; // hours
    const annualTimeSavedHours = dailyTimeSavedPerLocation * locations * 365;
    const annualLaborSavings = annualTimeSavedHours * avgHourlyWage;

    // Audit prep time savings
    const auditPrepSavingsHours = auditPrepHours * 0.75 * auditFrequency * locations; // 75% reduction
    const auditPrepSavingsCost = auditPrepSavingsHours * (avgHourlyWage * 1.5); // Manager rate

    // Manager visibility time savings (no more chasing paper)
    const managerTimeSavedWeekly = locations * 0.5; // 30 min per location per week
    const managerAnnualSavingsHours = managerTimeSavedWeekly * 52;
    const managerAnnualSavingsCost = managerAnnualSavingsHours * (avgHourlyWage * 2); // Senior rate

    // Compliance risk reduction (estimated 70% reduction in violation probability)
    const complianceRiskReduction = complianceRiskCost * 0.15 * 0.7; // 15% baseline risk, 70% reduction

    // Total annual savings
    const totalAnnualSavings = annualLaborSavings + auditPrepSavingsCost + managerAnnualSavingsCost + complianceRiskReduction;

    // Estimated Checkit cost (rough estimate for ROI calc)
    const estimatedAnnualCost = locations * 1200; // ~$100/location/month

    const roi = ((totalAnnualSavings - estimatedAnnualCost) / estimatedAnnualCost) * 100;
    const paybackMonths = (estimatedAnnualCost / totalAnnualSavings) * 12;

    return {
      annualTimeSavedHours: Math.round(annualTimeSavedHours),
      annualLaborSavings: Math.round(annualLaborSavings),
      auditPrepSavingsHours: Math.round(auditPrepSavingsHours),
      auditPrepSavingsCost: Math.round(auditPrepSavingsCost),
      managerAnnualSavingsHours: Math.round(managerAnnualSavingsHours),
      managerAnnualSavingsCost: Math.round(managerAnnualSavingsCost),
      complianceRiskReduction: Math.round(complianceRiskReduction),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      estimatedAnnualCost: Math.round(estimatedAnnualCost),
      roi: Math.round(roi),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
    };
  }, [inputs]);

  const currencySymbol = currency === 'USD' ? '$' : '£';

  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Calculator className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Paper to Digital ROI Calculator</h1>
          </div>
          <p className="text-slate-400">
            Calculate the financial impact of replacing paper checklists and manual logging with Checkit.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Vertical Selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Select Your Industry</h2>
              <div className="space-y-2">
                {verticalPresets.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVerticalChange(v.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedVertical.id === v.id
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{v.icon}</span>
                      <div>
                        <div className="font-medium">{v.name}</div>
                        <div className="text-xs text-slate-500">{v.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Toggle */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Currency</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    currency === 'USD'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => setCurrency('GBP')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                    currency === 'GBP'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  £ GBP
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-white mb-4">Your Numbers</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Number of Locations
                  </label>
                  <input
                    type="number"
                    value={inputs.locations}
                    onChange={(e) => setInputs({ ...inputs, locations: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Tasks/Checks per Day (per location)
                  </label>
                  <input
                    type="number"
                    value={inputs.tasksPerDay}
                    onChange={(e) => setInputs({ ...inputs, tasksPerDay: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Avg Minutes per Task (paper)
                  </label>
                  <input
                    type="number"
                    value={inputs.minutesPerTask}
                    onChange={(e) => setInputs({ ...inputs, minutesPerTask: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Average Hourly Wage ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={inputs.avgHourlyWage}
                    onChange={(e) => setInputs({ ...inputs, avgHourlyWage: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Audits per Year
                  </label>
                  <input
                    type="number"
                    value={inputs.auditFrequency}
                    onChange={(e) => setInputs({ ...inputs, auditFrequency: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Hours to Prep for Audit (per location)
                  </label>
                  <input
                    type="number"
                    value={inputs.auditPrepHours}
                    onChange={(e) => setInputs({ ...inputs, auditPrepHours: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Avg Compliance Violation Cost ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={inputs.complianceRiskCost}
                    onChange={(e) => setInputs({ ...inputs, complianceRiskCost: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-xl p-5">
                <div className="text-sm text-emerald-400 mb-1">Total Annual Savings</div>
                <div className="text-3xl font-bold text-white">{formatCurrency(calculations.totalAnnualSavings)}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-xl p-5">
                <div className="text-sm text-blue-400 mb-1">ROI</div>
                <div className="text-3xl font-bold text-white">{calculations.roi}%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 rounded-xl p-5">
                <div className="text-sm text-purple-400 mb-1">Payback Period</div>
                <div className="text-3xl font-bold text-white">{calculations.paybackMonths} mo</div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Savings Breakdown</h2>
              
              <div className="space-y-6">
                {/* Labor Savings */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white">Frontline Labor Savings</h3>
                      <span className="text-emerald-400 font-semibold">{formatCurrency(calculations.annualLaborSavings)}/yr</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      {calculations.annualTimeSavedHours.toLocaleString()} hours saved annually from faster task completion (60% time reduction per task)
                    </p>
                    <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (calculations.annualLaborSavings / calculations.totalAnnualSavings) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Audit Prep Savings */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white">Audit Preparation Savings</h3>
                      <span className="text-blue-400 font-semibold">{formatCurrency(calculations.auditPrepSavingsCost)}/yr</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      {calculations.auditPrepSavingsHours.toLocaleString()} manager hours saved on audit prep (75% reduction with instant reporting)
                    </p>
                    <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.min(100, (calculations.auditPrepSavingsCost / calculations.totalAnnualSavings) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Manager Time Savings */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white">Manager Visibility Savings</h3>
                      <span className="text-purple-400 font-semibold">{formatCurrency(calculations.managerAnnualSavingsCost)}/yr</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      {calculations.managerAnnualSavingsHours.toLocaleString()} hours saved from real-time dashboards vs. chasing paper trails
                    </p>
                    <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min(100, (calculations.managerAnnualSavingsCost / calculations.totalAnnualSavings) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Compliance Risk */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white">Compliance Risk Reduction</h3>
                      <span className="text-amber-400 font-semibold">{formatCurrency(calculations.complianceRiskReduction)}/yr</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      70% reduction in violation probability through consistent digital execution and audit trails
                    </p>
                    <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(100, (calculations.complianceRiskReduction / calculations.totalAnnualSavings) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment vs Return */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Investment Summary</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-slate-400 mb-2">Estimated Annual Investment</div>
                  <div className="text-2xl font-bold text-slate-300">{formatCurrency(calculations.estimatedAnnualCost)}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Based on ~{formatCurrency(100)}/location/month estimate
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-2">Net Annual Benefit</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(calculations.totalAnnualSavings - calculations.estimatedAnnualCost)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    After Checkit investment
                  </div>
                </div>
              </div>
            </div>

            {/* Assumptions */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Calculation Assumptions</h3>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• 60% time reduction per task when moving from paper to digital</li>
                <li>• 75% reduction in audit preparation time with instant reporting</li>
                <li>• Manager time valued at 2x average hourly wage</li>
                <li>• 15% baseline annual probability of compliance violation</li>
                <li>• 70% reduction in violation risk with digital compliance</li>
                <li>• 365 operating days per year</li>
              </ul>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
