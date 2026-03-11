import { Metadata } from 'next';
import BrochureTemplate from '../BrochureTemplate';
import {
  Thermometer,
  FileCheck,
  AlertTriangle,
  BarChart3,
  Wrench,
  Bell,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Checkit for Forecourts | Automated Compliance & Temperature Monitoring',
  description:
    'Automated compliance and temperature monitoring for forecourt operations. Digital checklists, real-time alerts, and multi-site dashboards for fuel retail.',
  openGraph: {
    title: 'Checkit for Forecourts | Automated Compliance & Temperature Monitoring',
    description:
      'Automated compliance and temperature monitoring for forecourt operations. Digital checklists, real-time alerts, and multi-site dashboards for fuel retail.',
  },
};

export default function ForecourtsPage() {
  return (
    <BrochureTemplate
      industry="Forecourts & Fuel Retail"
      headline="Automated compliance for forecourt operations"
      subheadline="Forecourts face unique challenges — food-to-go, fuel safety, constant shift changes, and EHO visits. Checkit automates compliance across all of it so your teams can focus on serving customers."
      product="CAM"
      challenges={[
        {
          title: 'Manual temperature checks missed during busy periods',
          description:
            'When the forecourt is busy, temperature logs slip. Gaps in records leave you exposed during inspections.',
        },
        {
          title: 'Inconsistent compliance across multi-site estates',
          description:
            'Every site does things slightly differently, making it hard to maintain a consistent compliance standard.',
        },
        {
          title: "Paper records that aren't audit-ready",
          description:
            'Paper logs get lost, damaged, or filled in retrospectively — none of which stands up to scrutiny.',
        },
        {
          title: 'Equipment failures causing food waste',
          description:
            'A failing fridge or hot cabinet can go unnoticed for hours, spoiling stock and costing money.',
        },
        {
          title: 'Staff turnover making compliance training harder',
          description:
            'High turnover means constantly retraining new staff on procedures they often skip under pressure.',
        },
        {
          title: 'Limited visibility for area managers',
          description:
            "Area managers rely on site visits to understand compliance — there's no real-time view across the estate.",
        },
      ]}
      capabilities={[
        {
          icon: Thermometer,
          title: 'Automated Temperature Monitoring',
          description:
            'Wireless sensors continuously log fridge, freezer, and food-to-go cabinet temperatures with no manual checks needed.',
        },
        {
          icon: FileCheck,
          title: 'Digital Checklists',
          description:
            'Replace paper with guided digital checklists for shift handovers, cleaning, and food safety — with photo evidence.',
        },
        {
          icon: AlertTriangle,
          title: 'Real-Time Alerts',
          description:
            'Instant notifications when temperatures breach thresholds or a fridge door is left open, so issues are caught immediately.',
        },
        {
          icon: BarChart3,
          title: 'Multi-Site Dashboards',
          description:
            'Area managers can check compliance status, scores, and trends across 50+ sites from a single dashboard.',
        },
        {
          icon: Wrench,
          title: 'Asset Intelligence',
          description:
            'Track equipment health over time to spot ageing assets and prevent unplanned failures before they cause waste.',
        },
        {
          icon: Bell,
          title: 'Automatic Escalations',
          description:
            "If a corrective action isn't completed in time, the platform automatically escalates to the next responsible person.",
        },
      ]}
      results={[
        { stat: '60%', label: 'Less compliance admin' },
        { stat: '90%+', label: 'Audit scores' },
        { stat: '35%', label: 'Less equipment waste' },
        { stat: '24/7', label: 'Automated monitoring' },
      ]}
      customers={[{ name: 'BP' }, { name: 'John Lewis Partnership' }]}
      useCases={[
        'Automated temperature logging across fridges and food-to-go cabinets',
        'Digital shift handover checklists with photo evidence',
        'Real-time alerts when a fridge door is left open',
        'Area managers checking compliance across 50+ sites from one dashboard',
        "Automatic escalation when corrective actions aren't completed",
        'Equipment health tracking to prevent unplanned failures',
      ]}
    />
  );
}
