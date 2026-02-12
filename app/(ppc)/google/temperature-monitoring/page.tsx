import { Metadata } from 'next';
import TemperatureMonitoringLandingPage from './TemperatureMonitoringLandingPage';

export const metadata: Metadata = {
  title: 'Medical Temperature Monitoring System | Wireless Sensors & Alerts | Checkit',
  description:
    'Wireless temperature monitoring for healthcare, pharmacies, labs, and medical facilities. 24/7 alerts, FDA/MHRA-ready compliance logs, and real-time dashboards. Get a free assessment.',
  robots: { index: false, follow: false },
};

export default function GoogleTemperatureMonitoringPage() {
  return <TemperatureMonitoringLandingPage />;
}
