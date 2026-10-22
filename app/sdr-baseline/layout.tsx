import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SDR Baseline · GTM',
  robots: { index: false, follow: false },
};

export default function SdrBaselineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
