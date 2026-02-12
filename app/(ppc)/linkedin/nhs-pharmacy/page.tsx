import { Metadata } from 'next';
import NhsPharmacyLandingPage from './NhsPharmacyLandingPage';

export const metadata: Metadata = {
  title: 'Checkit CAM+ | Automated Compliance for NHS Pharmacies',
  description:
    'Eliminate manual temperature checks and automate pharmacy compliance with CAM+ from Checkit. Trusted by 60+ NHS Trusts. Get your free compliance assessment.',
  robots: { index: false, follow: false },
};

export default function LinkedInNhsPharmacyPage() {
  return <NhsPharmacyLandingPage />;
}
