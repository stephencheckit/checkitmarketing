import { Metadata } from 'next';
import BrochureTemplate from '../BrochureTemplate';

export const metadata: Metadata = {
  title: 'Checkit for Food-to-Go | HACCP Compliance & Food Safety',
  description:
    'Automated HACCP compliance and food safety monitoring for food-to-go and QSR operations. Continuous monitoring, digital checklists, and predictive alerts.',
  openGraph: {
    title: 'Checkit for Food-to-Go | HACCP Compliance & Food Safety',
    description:
      'Automated HACCP compliance and food safety monitoring for food-to-go and QSR operations. Continuous monitoring, digital checklists, and predictive alerts.',
  },
};

export default function FoodToGoPage() {
  return (
    <BrochureTemplate
      industry="Food to Go & QSR"
      headline="Food safety compliance that keeps up with your kitchen"
      subheadline="Food-to-go operations need continuous compliance, not point-in-time checks. Especially during the lunch rush, gaps appear fast. Checkit keeps your food safety running in the background so your team can focus on service."
      product="CAM"
      challenges={[
        {
          title: 'HACCP documentation gaps during peak hours',
          description:
            'When the kitchen is flat-out, HACCP logs get skipped. Those gaps become liabilities during inspections.',
        },
        {
          title: 'Temperature excursions going unnoticed',
          description:
            'A fridge slowly warming or a hot hold dropping below safe temps can go undetected for hours without automated monitoring.',
        },
        {
          title: 'Inconsistent food prep procedures across sites',
          description:
            'Different sites develop their own shortcuts, making it hard to enforce consistent food safety standards.',
        },
        {
          title: 'Last-minute scrambles before EHO visits',
          description:
            'Without digital records, teams waste hours pulling together paperwork before an inspection.',
        },
        {
          title: 'Food waste from undetected equipment issues',
          description:
            'A failing fridge can spoil an entire stock run before anyone notices the temperature has drifted.',
        },
        {
          title: 'New staff not following food safety procedures',
          description:
            'High turnover means new starters regularly miss steps, creating compliance risk across the operation.',
        },
      ]}
      capabilities={[
        {
          icon: 'Thermometer',
          title: 'Automated HACCP Logging',
          description:
            'Continuous temperature monitoring across hot holds, fridges, and prep areas — logged automatically with no manual input.',
        },
        {
          icon: 'FileCheck',
          title: 'Digital Food Safety Checklists',
          description:
            'Guided digital checklists with conditional logic and photo evidence replace paper-based HACCP documentation.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Predictive Temperature Alerts',
          description:
            'Get notified before a fridge fails — not after. Predictive alerts flag equipment trending toward unsafe temperatures.',
        },
        {
          icon: 'BarChart3',
          title: 'Multi-Site Compliance Dashboards',
          description:
            'Compare compliance scores, completion rates, and trends across every site from a single view.',
        },
        {
          icon: 'Shield',
          title: 'Allergen Management Workflows',
          description:
            'Structured allergen management workflows with staff sign-off ensure consistent handling across all sites.',
        },
        {
          icon: 'Clock',
          title: 'Waste Reduction Tracking',
          description:
            'Track waste events alongside temperature data to identify patterns and reduce unnecessary food loss.',
        },
      ]}
      results={[
        { stat: '60%', label: 'Less audit prep time' },
        { stat: '90%+', label: 'Food safety scores' },
        { stat: '35%', label: 'Less food waste' },
        { stat: '100%', label: 'Digital traceability' },
      ]}
      customers={[{ name: 'OVG Hospitality' }, { name: 'ISS' }]}
      useCases={[
        '24/7 temperature monitoring of hot holds, fridges, and prep areas',
        'Digital HACCP checklists with conditional logic and photo evidence',
        'Predictive alerts when a fridge is trending toward failure',
        'Allergen management workflows with staff sign-off',
        'Delivery temperature checks logged digitally on arrival',
        'Area managers comparing compliance scores across all sites',
      ]}
    />
  );
}
