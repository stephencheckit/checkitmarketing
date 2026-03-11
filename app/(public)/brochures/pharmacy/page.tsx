import { Metadata } from 'next';
import BrochureTemplate from '../BrochureTemplate';

export const metadata: Metadata = {
  title: 'Checkit CAM+ for Pharmacy & Pathology | Cold Chain Compliance',
  description:
    'CAM+ provides 24/7 automated temperature monitoring for pharmacies and pathology labs. Replace manual checks with tamper-proof digital records for MHRA and CQC compliance.',
  openGraph: {
    title: 'Checkit CAM+ for Pharmacy & Pathology | Cold Chain Compliance',
    description:
      'CAM+ provides 24/7 automated temperature monitoring for pharmacies and pathology labs. Replace manual checks with tamper-proof digital records for MHRA and CQC compliance.',
  },
};

export default function PharmacyPage() {
  return (
    <BrochureTemplate
      industry="Pharmacy & Pathology"
      headline="Connected Automated Monitoring for healthcare cold chains"
      subheadline="CAM+ provides 24/7 automated temperature monitoring for pharmacies and pathology labs, replacing unreliable manual checks with tamper-proof digital records that ensure MHRA and CQC compliance."
      product="CAM+"
      challenges={[
        {
          title: 'Manual twice-daily temperature checks are unreliable',
          description:
            "Staff forget, rush, or backfill readings. Two data points a day can't catch excursions that happen in between.",
        },
        {
          title: 'Out-of-hours fridge failures going undetected',
          description:
            'A fridge failing overnight or over a weekend can destroy thousands of pounds of vaccines or specimens.',
        },
        {
          title: 'Maintaining MHRA and CQC compliance documentation',
          description:
            'Regulatory inspections require complete, verifiable temperature records — paper logs rarely meet the standard.',
        },
        {
          title: 'No visibility across multiple pharmacy/lab sites',
          description:
            'Managers have no way to see cold chain status across sites without phoning each location individually.',
        },
        {
          title: 'Wasted stock from undetected temperature excursions',
          description:
            'Stock lost to undetected excursions is expensive, disruptive, and in healthcare contexts, potentially dangerous.',
        },
        {
          title: 'Time-consuming audit preparation',
          description:
            'Pulling together months of paper records for a CQC or MHRA inspection takes days of staff time.',
        },
      ]}
      capabilities={[
        {
          icon: 'Thermometer',
          title: '24/7 Automated Cold Chain Monitoring',
          description:
            'Wireless sensors log temperatures every few minutes across vaccine fridges, blood banks, and specimen storage — day and night.',
        },
        {
          icon: 'Lock',
          title: 'Tamper-Proof Digital Records',
          description:
            "Every reading is timestamped and immutable, creating a regulatory-grade audit trail that can't be altered or backfilled.",
        },
        {
          icon: 'Bell',
          title: 'Multi-Tier Alerting with Escalation',
          description:
            'Alerts reach the right person at the right time — from on-site staff to managers — with automatic escalation if unresolved.',
        },
        {
          icon: 'BarChart3',
          title: 'Multi-Site Dashboards',
          description:
            'See cold chain status across all pharmacy and lab locations from a single dashboard with drill-down detail.',
        },
        {
          icon: 'FileCheck',
          title: 'One-Click Regulatory Reports',
          description:
            'Generate MHRA and CQC-ready reports instantly — no manual data compilation or spreadsheet formatting.',
        },
        {
          icon: 'Server',
          title: 'Battery-Backed Sensors',
          description:
            'Sensors continue logging during power outages, so you never lose data when it matters most.',
        },
      ]}
      results={[
        { stat: '300+', label: 'NHS sites monitored' },
        { stat: '100%', label: 'Digital audit trail' },
        { stat: '24/7', label: 'Automated monitoring' },
        { stat: 'Zero', label: 'Undetected excursions' },
      ]}
      customers={[
        { name: '60+ NHS Trusts' },
        { name: 'NHS Blood & Transplant' },
        { name: 'Community Pharmacies' },
      ]}
      useCases={[
        'Automated monitoring of vaccine fridges, blood banks, and specimen storage',
        'Instant alerts when temperatures breach thresholds — even overnight',
        'One-click regulatory report generation for CQC and MHRA inspections',
        'Multi-site dashboard showing cold chain status across all locations',
        'Battery-backed sensors that continue logging during power outages',
        'Integration with pharmacy management and LIMS systems',
      ]}
    />
  );
}
