import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2027 GTM · v2',
  robots: { index: false, follow: false },
};

export default function GtmV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
