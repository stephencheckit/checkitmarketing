import { Metadata } from 'next';
import BrochureTemplate from '../BrochureTemplate';
import {
  Thermometer,
  Wrench,
  FileCheck,
  BarChart3,
  Zap,
  Activity,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Checkit for Facilities Management | Environmental Monitoring & Compliance',
  description:
    'Proactive facilities monitoring and compliance with automated environmental monitoring, predictive maintenance, and portfolio-wide dashboards.',
  openGraph: {
    title: 'Checkit for Facilities Management | Environmental Monitoring & Compliance',
    description:
      'Proactive facilities monitoring and compliance with automated environmental monitoring, predictive maintenance, and portfolio-wide dashboards.',
  },
};

export default function FacilitiesPage() {
  return (
    <BrochureTemplate
      industry="Facilities Management"
      headline="Proactive facilities monitoring and compliance"
      subheadline="Facilities teams are shifting from reactive break-fix to proactive management. Checkit provides automated environmental monitoring and digital compliance workflows that give you real-time visibility across your entire portfolio."
      product="CAM"
      challenges={[
        {
          title: 'Unplanned equipment downtime',
          description:
            'Equipment failures catch teams off guard, leading to costly emergency repairs and service disruptions.',
        },
        {
          title: 'Environmental monitoring gaps',
          description:
            'Manual spot-checks miss issues between readings, leaving temperature, humidity, and air quality unmonitored for hours.',
        },
        {
          title: 'Manual compliance processes',
          description:
            'Paper-based compliance workflows are slow, error-prone, and difficult to verify during audits.',
        },
        {
          title: 'Difficulty demonstrating SLA performance',
          description:
            'Without digital records, proving you met contractual SLAs relies on anecdotal evidence rather than verifiable data.',
        },
        {
          title: 'Energy waste from unoptimised equipment',
          description:
            'Equipment running outside optimal parameters wastes energy and increases costs without anyone noticing.',
        },
        {
          title: 'No real-time visibility across portfolio',
          description:
            "Managers have no single view of what's happening across all sites, relying on phone calls and site visits.",
        },
      ]}
      capabilities={[
        {
          icon: Thermometer,
          title: 'Environmental Monitoring',
          description:
            'Continuous monitoring of temperature, humidity, and air quality across all sites with wireless sensors.',
        },
        {
          icon: Wrench,
          title: 'Predictive Maintenance',
          description:
            'Spot equipment degradation early through performance trend analysis and get alerted before failures happen.',
        },
        {
          icon: FileCheck,
          title: 'Digital Compliance Workflows',
          description:
            'Replace paper with automated, scheduled compliance checklists that create a verifiable digital audit trail.',
        },
        {
          icon: BarChart3,
          title: 'Portfolio Dashboards',
          description:
            "A single view of every site's status, compliance scores, and open issues across your entire portfolio.",
        },
        {
          icon: Zap,
          title: 'Energy Monitoring',
          description:
            'Track energy usage patterns tied to equipment performance and identify optimisation opportunities.',
        },
        {
          icon: Activity,
          title: 'Real-Time Alerting',
          description:
            'Instant alerts when environmental conditions breach thresholds or equipment performance degrades.',
        },
      ]}
      results={[
        { stat: '35%', label: 'Less unplanned downtime' },
        { stat: '60%', label: 'Less compliance admin' },
        { stat: '25%', label: 'Maintenance cost reduction' },
        { stat: 'Real-time', label: 'Multi-site visibility' },
      ]}
      customers={[{ name: 'OVG Hospitality' }, { name: 'ISS' }]}
      useCases={[
        'Continuous monitoring of temperature, humidity, and air quality',
        'Predictive maintenance alerts based on equipment performance trends',
        'Digital compliance checklists with automated scheduling',
        'Portfolio-wide dashboards showing all site statuses',
        'SLA performance reporting with verifiable digital records',
        "Automated escalations when issues aren't resolved within target",
      ]}
    />
  );
}
