import type { Metadata } from 'next';
import Calculator from './Calculator';

export const metadata: Metadata = {
  title: 'Digital HACCP ROI Calculator',
  description:
    'Translating the platform into pounds and pence. Calculate the value Digital HACCP creates across paper, staff time, energy and stock loss.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DigitalHaccpRoiPage() {
  return <Calculator />;
}
