'use client';

import { useState, useMemo } from 'react';
import { Calculator, ArrowLeft, Download, Users, Clock, DollarSign, Shield, AlertTriangle, ChevronDown, Zap, Thermometer } from 'lucide-react';
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
      auditFrequency: 4,
      auditPrepHours: 24,
      complianceRiskCost: 75000,
      refrigerationUnits: 8, // per location avg
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
      refrigerationUnits: 15,
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
      avgHourlyWage: 14,
      minutesPerTask: 5,
      auditFrequency: 2,
      auditPrepHours: 40,
      complianceRiskCost: 100000,
      refrigerationUnits: 3,
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
      avgHourlyWage: 12,
      minutesPerTask: 3,
      auditFrequency: 4,
      auditPrepHours: 20,
      complianceRiskCost: 40000,
      refrigerationUnits: 12,
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
      refrigerationUnits: 6,
    },
    description: 'Enter your own values',
  },
];

export default function PaperToDigitalCalculator() {
  const [selectedVertical, setSelectedVertical] = useState(verticalPresets[0]);
  const [currency, setCurrency] = useState<'USD' | 'GBP'>('USD');
  const [inputs, setInputs] = useState(verticalPresets[0].defaults);

  const handleVerticalChange = (verticalId: string) => {
    const vertical = verticalPresets.find(v => v.id === verticalId);
    if (vertical) {
      setSelectedVertical(vertical);
      setInputs(vertical.defaults);
      if (verticalId === 'nhs-pharmacy' || verticalId === 'food-retail') {
        setCurrency('GBP');
      } else {
        setCurrency('USD');
      }
    }
  };

  const calculations = useMemo(() => {
    const { locations, tasksPerDay, avgHourlyWage, minutesPerTask, auditFrequency, auditPrepHours, complianceRiskCost, refrigerationUnits } = inputs;
    
    // Time repurposed from digitization (60% reduction in wasted time per task)
    const wastedTimePreventedPerTaskMinutes = minutesPerTask * 0.6;
    const dailyTimeRepurposedPerLocation = (tasksPerDay * wastedTimePreventedPerTaskMinutes) / 60;
    const annualTimeRepurposedHours = dailyTimeRepurposedPerLocation * locations * 365;
    const laborValueRepurposed = annualTimeRepurposedHours * avgHourlyWage;

    // Audit prep - wasted time prevented
    const auditWastedTimePrevented = auditPrepHours * 0.75 * auditFrequency * locations;
    const auditPrepValue = auditWastedTimePrevented * (avgHourlyWage * 1.5);

    // Manager time - repurposed from chasing paper to strategic work
    const managerTimeRepurposedWeekly = locations * 0.5;
    const managerAnnualTimeRepurposed = managerTimeRepurposedWeekly * 52;
    const managerTimeValue = managerAnnualTimeRepurposed * (avgHourlyWage * 2);

    // Compliance risk reduction
    const complianceRiskReduction = complianceRiskCost * 0.15 * 0.7;

    // Energy savings from smart refrigeration monitoring
    // Average fridge/freezer costs ~$400/year to run, smart monitoring reduces by 15%
    const totalRefrigerationUnits = refrigerationUnits * locations;
    const avgAnnualEnergyCostPerUnit = currency === 'USD' ? 400 : 320; // USD vs GBP
    const energySavingsPercent = 0.15;
    const annualEnergySavings = totalRefrigerationUnits * avgAnnualEnergyCostPerUnit * energySavingsPercent;

    const totalAnnualBenefit = laborValueRepurposed + auditPrepValue + managerTimeValue + complianceRiskReduction + annualEnergySavings;
    const estimatedAnnualCost = locations * 1200;
    const roi = ((totalAnnualBenefit - estimatedAnnualCost) / estimatedAnnualCost) * 100;
    const paybackMonths = (estimatedAnnualCost / totalAnnualBenefit) * 12;

    return {
      annualTimeRepurposedHours: Math.round(annualTimeRepurposedHours),
      laborValueRepurposed: Math.round(laborValueRepurposed),
      auditWastedTimePrevented: Math.round(auditWastedTimePrevented),
      auditPrepValue: Math.round(auditPrepValue),
      managerAnnualTimeRepurposed: Math.round(managerAnnualTimeRepurposed),
      managerTimeValue: Math.round(managerTimeValue),
      complianceRiskReduction: Math.round(complianceRiskReduction),
      totalRefrigerationUnits,
      annualEnergySavings: Math.round(annualEnergySavings),
      totalAnnualBenefit: Math.round(totalAnnualBenefit),
      estimatedAnnualCost: Math.round(estimatedAnnualCost),
      roi: Math.round(roi),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
    };
  }, [inputs, currency]);

  const currencySymbol = currency === 'USD' ? '$' : '£';

  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-6">
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
            Calculate the value of eliminating paper-based processes and manual logging with Checkit.
          </p>
        </div>

        {/* SECTION 1: Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-5">1. Configure Your Scenario</h2>
          
          {/* Vertical + Currency Row */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Vertical Selection */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Industry Vertical</label>
              <div className="grid grid-cols-1 gap-2">
                {verticalPresets.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVerticalChange(v.id)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selectedVertical.id === v.id
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{v.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{v.name}</div>
                        <div className="text-xs text-slate-500">{v.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {/* Currency */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Currency</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                      currency === 'USD'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    $ USD
                  </button>
                  <button
                    onClick={() => setCurrency('GBP')}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                      currency === 'GBP'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    £ GBP
                  </button>
                </div>
              </div>

              {/* Core Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Locations</label>
                  <input
                    type="number"
                    value={inputs.locations}
                    onChange={(e) => setInputs({ ...inputs, locations: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Tasks/Day/Location</label>
                  <input
                    type="number"
                    value={inputs.tasksPerDay}
                    onChange={(e) => setInputs({ ...inputs, tasksPerDay: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Mins/Task (paper)</label>
                  <input
                    type="number"
                    value={inputs.minutesPerTask}
                    onChange={(e) => setInputs({ ...inputs, minutesPerTask: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Hourly Wage ({currencySymbol})</label>
                  <input
                    type="number"
                    value={inputs.avgHourlyWage}
                    onChange={(e) => setInputs({ ...inputs, avgHourlyWage: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Audits/Year</label>
                  <input
                    type="number"
                    value={inputs.auditFrequency}
                    onChange={(e) => setInputs({ ...inputs, auditFrequency: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Audit Prep Hrs/Location</label>
                  <input
                    type="number"
                    value={inputs.auditPrepHours}
                    onChange={(e) => setInputs({ ...inputs, auditPrepHours: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Refrigeration + Compliance */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    Fridges/Freezers per Location
                  </label>
                  <input
                    type="number"
                    value={inputs.refrigerationUnits}
                    onChange={(e) => setInputs({ ...inputs, refrigerationUnits: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Violation Cost ({currencySymbol})</label>
                  <input
                    type="number"
                    value={inputs.complianceRiskCost}
                    onChange={(e) => setInputs({ ...inputs, complianceRiskCost: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Results */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-5">2. Your ROI Results</h2>
          
          {/* Hero Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-900/40 to-slate-800 border border-emerald-500/30 rounded-xl p-4 text-center">
              <div className="text-sm text-emerald-400 mb-1">Total Annual Benefit</div>
              <div className="text-3xl font-bold text-white">{formatCurrency(calculations.totalAnnualBenefit)}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-800 border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="text-sm text-blue-400 mb-1">ROI</div>
              <div className="text-3xl font-bold text-white">{calculations.roi}%</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-800 border border-purple-500/30 rounded-xl p-4 text-center">
              <div className="text-sm text-purple-400 mb-1">Payback Period</div>
              <div className="text-3xl font-bold text-white">{calculations.paybackMonths} mo</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Value Breakdown</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Labor - Time Repurposed */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Frontline Time Repurposed</div>
                    <div className="text-lg font-semibold text-white">{formatCurrency(calculations.laborValueRepurposed)}/yr</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {calculations.annualTimeRepurposedHours.toLocaleString()} hours redirected to higher-value work
                </p>
              </div>

              {/* Audit Prep - Wasted Time Prevented */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Audit Prep Waste Eliminated</div>
                    <div className="text-lg font-semibold text-white">{formatCurrency(calculations.auditPrepValue)}/yr</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {calculations.auditWastedTimePrevented.toLocaleString()} hours of scrambling prevented
                </p>
              </div>

              {/* Manager Time - Repurposed */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Manager Time Repurposed</div>
                    <div className="text-lg font-semibold text-white">{formatCurrency(calculations.managerTimeValue)}/yr</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {calculations.managerAnnualTimeRepurposed.toLocaleString()} hours shifted from chasing paper to leading teams
                </p>
              </div>

              {/* Compliance Risk */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Compliance Risk Reduced</div>
                    <div className="text-lg font-semibold text-white">{formatCurrency(calculations.complianceRiskReduction)}/yr</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  70% reduction in violation probability
                </p>
              </div>

              {/* Energy Savings */}
              <div className="bg-slate-800/50 rounded-lg p-4 sm:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Energy Reduction</div>
                    <div className="text-lg font-semibold text-white">{formatCurrency(calculations.annualEnergySavings)}/yr</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  15% efficiency gain across {calculations.totalRefrigerationUnits} refrigeration units via smart monitoring
                </p>
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-slate-500 mb-1">Est. Annual Investment</div>
                <div className="text-lg font-semibold text-slate-300">{formatCurrency(calculations.estimatedAnnualCost)}</div>
                <div className="text-xs text-slate-600">~{formatCurrency(100)}/location/mo</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Total Value</div>
                <div className="text-lg font-semibold text-emerald-400">{formatCurrency(calculations.totalAnnualBenefit)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Net Annual Benefit</div>
                <div className="text-lg font-semibold text-white">{formatCurrency(calculations.totalAnnualBenefit - calculations.estimatedAnnualCost)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assumptions & Export */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 flex-1">
            <details className="group">
              <summary className="text-sm font-medium text-slate-400 cursor-pointer flex items-center gap-2">
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                Calculation Assumptions
              </summary>
              <ul className="mt-3 text-xs text-slate-500 space-y-1 pl-6">
                <li>• 60% reduction in wasted time per task (paper → digital)</li>
                <li>• 75% reduction in audit prep scrambling with instant reporting</li>
                <li>• Manager time valued at 2x hourly wage</li>
                <li>• 15% baseline annual violation probability, 70% risk reduction</li>
                <li>• Avg refrigeration unit: {formatCurrency(currency === 'USD' ? 400 : 320)}/yr energy cost</li>
                <li>• 15% energy reduction via smart temperature monitoring</li>
                <li>• 365 operating days per year</li>
              </ul>
            </details>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
