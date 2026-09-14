import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkit × BioIVT · CAM+ Solution Overview',
  robots: { index: false, follow: false },
};

export default function BioIvtLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen w-full bg-[#020233] text-white">{children}</div>;
}
