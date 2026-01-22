'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Clock, Shield, ChevronRight, DollarSign, Building2 } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    id: 'paper-to-digital',
    name: 'Paper to Digital ROI Calculator',
    description: 'Calculate labor savings, compliance improvements, and operational efficiency gains from digitizing checklists and temperature logging.',
    icon: Calculator,
    status: 'active',
    href: '/tools/paper-to-digital',
    metrics: ['Labor Hours Saved', 'Compliance Risk Reduction', 'Manager Time Freed'],
  },
  {
    id: 'temp-monitoring',
    name: 'Temperature Monitoring ROI',
    description: 'Quantify savings from automated temp logging: spoilage prevention, equipment failure detection, and audit readiness.',
    icon: TrendingUp,
    status: 'coming-soon',
    href: '/tools/temp-monitoring',
    metrics: ['Spoilage Reduction', 'Equipment Savings', 'Insurance Benefits'],
  },
  {
    id: 'compliance-risk',
    name: 'Compliance Risk Calculator',
    description: 'Assess your exposure to regulatory violations and calculate the cost of non-compliance vs. digital solutions.',
    icon: Shield,
    status: 'coming-soon',
    href: '/tools/compliance-risk',
    metrics: ['Violation Risk Score', 'Remediation Costs', 'Audit Prep Time'],
  },
];

const verticals = [
  { id: 'senior-living', name: 'Senior Living (US)', icon: '🏥' },
  { id: 'facilities-food', name: 'Facilities Food Ops', icon: '🏟️' },
  { id: 'nhs-pharmacy', name: 'NHS Pharmacies (UK)', icon: '💊' },
  { id: 'food-retail', name: 'Multi-site Food Retail', icon: '🛒' },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ROI Tools & Calculators</h1>
          <p className="text-slate-400">
            Quantify the business impact of moving from paper-based processes to Checkit&apos;s digital operations platform.
          </p>
        </div>

        {/* Vertical Tags */}
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-3">Built for:</p>
          <div className="flex flex-wrap gap-2">
            {verticals.map((v) => (
              <span
                key={v.id}
                className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-300"
              >
                {v.icon} {v.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`bg-slate-900 border rounded-xl p-6 ${
                tool.status === 'active'
                  ? 'border-slate-700 hover:border-emerald-500/50 transition-colors'
                  : 'border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  tool.status === 'active' ? 'bg-emerald-500/10' : 'bg-slate-800'
                }`}>
                  <tool.icon className={`w-6 h-6 ${
                    tool.status === 'active' ? 'text-emerald-400' : 'text-slate-500'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-white">{tool.name}</h2>
                    {tool.status === 'coming-soon' && (
                      <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 mb-4">{tool.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {tool.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                    
                    {tool.status === 'active' ? (
                      <Link
                        href={tool.href}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
                      >
                        Launch Calculator
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-500 rounded-lg font-medium cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Need a Custom ROI Analysis?</h3>
              <p className="text-slate-400 text-sm">
                For enterprise prospects or complex multi-site operations, we can build a tailored business case with your specific data.
              </p>
            </div>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
              Request Custom Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
