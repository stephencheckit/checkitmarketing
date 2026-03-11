import { Metadata } from 'next';
import BrochureTemplate from '../BrochureTemplate';
import {
  Thermometer,
  FileCheck,
  AlertTriangle,
  BarChart3,
  Utensils,
  Shield,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Checkit for Chain Dining & Pub Groups | Food Safety Compliance',
  description:
    'Consistent food safety compliance across every site. Temperature monitoring, digital checklists, allergen management, and multi-site dashboards for chain dining and pub groups.',
  openGraph: {
    title: 'Checkit for Chain Dining & Pub Groups | Food Safety Compliance',
    description:
      'Consistent food safety compliance across every site. Temperature monitoring, digital checklists, allergen management, and multi-site dashboards for chain dining and pub groups.',
  },
};

export default function ChainDiningPage() {
  return (
    <BrochureTemplate
      industry="Chain Dining & Pub Groups"
      headline="Consistent food safety across every site"
      subheadline="Multi-site hospitality operators need centralised compliance that works even with high staff turnover and complex menus. Checkit gives you visibility and control across your entire estate without relying on manual processes."
      product="CAM"
      challenges={[
        {
          title: 'Inconsistent food safety practices across sites',
          description:
            'Each site develops its own habits. Without standardised digital processes, compliance varies wildly.',
        },
        {
          title: 'High staff turnover disrupting compliance routines',
          description:
            "Constant new starters mean procedures get forgotten or skipped, creating risk that's hard to detect remotely.",
        },
        {
          title: 'Cellar and kitchen equipment failures',
          description:
            'A failing beer cellar cooler or kitchen fridge can go unnoticed for hours, spoiling stock and disrupting service.',
        },
        {
          title: 'Allergen compliance complexity',
          description:
            'Complex menus with frequent changes make allergen management a constant challenge across multiple sites.',
        },
        {
          title: 'Paper-based EHO preparation',
          description:
            'Pulling together paper records before an EHO visit wastes management time and rarely presents well.',
        },
        {
          title: 'Area managers spread thin across many sites',
          description:
            "With dozens of sites to oversee, area managers can't be everywhere — they need a digital view of compliance.",
        },
      ]}
      capabilities={[
        {
          icon: Thermometer,
          title: 'Temperature Monitoring (incl. Cellars)',
          description:
            'Automated monitoring across fridges, freezers, hot holds, and beer cellars — logged 24/7 without manual checks.',
        },
        {
          icon: FileCheck,
          title: 'Digital Food Safety Checklists',
          description:
            'Standardised opening, closing, and cleaning checklists with photo evidence and staff sign-off.',
        },
        {
          icon: AlertTriangle,
          title: 'Smart Escalations',
          description:
            "If a corrective action isn't completed on time, the platform automatically escalates to the right person.",
        },
        {
          icon: BarChart3,
          title: 'Multi-Site Comparison',
          description:
            "Rank and compare compliance scores across all sites so area managers can focus attention where it's needed.",
        },
        {
          icon: Utensils,
          title: 'Allergen Management',
          description:
            'Structured allergen workflows with staff acknowledgement ensure consistent handling across every kitchen.',
        },
        {
          icon: Shield,
          title: 'Audit-Ready Records',
          description:
            'Every check, temperature reading, and corrective action is logged digitally — always ready for inspection.',
        },
      ]}
      results={[
        { stat: '90%+', label: 'Food safety scores' },
        { stat: '60%', label: 'Less compliance admin' },
        { stat: '35%', label: 'Less waste' },
        { stat: '100%', label: 'Audit-ready' },
      ]}
      customers={[]}
      useCases={[
        '24/7 temperature monitoring of fridges, freezers, hot holds, and beer cellars',
        'Digital opening/closing checklists with photo evidence',
        'Allergen management workflows with staff acknowledgement',
        'Multi-site compliance ranking dashboards for area managers',
        "Automatic alerts when corrective actions aren't completed on time",
        'Delivery temperature checks logged digitally',
      ]}
    />
  );
}
