'use client';

import { Calculator, TrendingUp, Shield, ChevronRight, DollarSign } from 'lucide-react';
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
  { id: 'plasma-blood', name: 'Plasma & Blood Products (US)', icon: '🩸' },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Calculator className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
            ROI Tools & Calculators
          </h1>
          <p className="text-sm text-muted mt-1">
            Quantify the business impact of moving from paper-based processes to Checkit&apos;s digital operations platform.
          </p>
        </div>

        {/* Vertical Tags */}
        <div className="mb-6">
          <p className="text-sm text-muted mb-3">Built for:</p>
          <div className="flex flex-wrap gap-2">
            {verticals.map((v) => (
              <span
                key={v.id}
                className="px-3 py-1.5 bg-surface-elevated border border-border rounded-full text-sm text-foreground/80"
              >
                {v.icon} {v.name}
              </span>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-4">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`bg-surface border rounded-xl p-6 ${
                tool.status === 'active'
                  ? 'border-border hover:border-accent/50 transition-colors'
                  : 'border-border opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  tool.status === 'active' ? 'bg-accent/10' : 'bg-surface-elevated'
                }`}>
                  <tool.icon className={`w-6 h-6 ${
                    tool.status === 'active' ? 'text-accent' : 'text-muted'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-foreground">{tool.name}</h2>
                    {tool.status === 'coming-soon' && (
                      <span className="px-2 py-0.5 text-xs bg-surface-elevated text-muted rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-muted mb-4">{tool.description}</p>
                  
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex flex-wrap gap-2">
                      {tool.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="px-2 py-1 text-xs bg-surface-elevated text-muted rounded"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                    
                    {tool.status === 'active' ? (
                      <Link
                        href={tool.href}
                        className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
                      >
                        Launch Calculator
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-2 px-4 py-2 bg-surface-elevated text-muted rounded-lg font-medium cursor-not-allowed"
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
        <div className="mt-6 p-6 bg-accent/10 border border-accent/20 rounded-xl">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="p-3 bg-accent/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">Need a Custom ROI Analysis?</h3>
              <p className="text-muted text-sm">
                For enterprise prospects or complex multi-site operations, we can build a tailored business case with your specific data.
              </p>
            </div>
            <button className="px-4 py-2 bg-surface-elevated hover:bg-surface text-foreground border border-border rounded-lg font-medium transition-colors">
              Request Custom Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
