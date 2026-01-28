import { Metadata } from 'next';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: {
    default: 'Checkit V6 | Compliance, Safety, and Visibility for Operational Leaders',
    template: '%s | Checkit V6',
  },
  description: 'Transform operations with intelligent compliance. Checkit V6 combines IoT sensors, mobile apps, and cloud analytics to deliver automated monitoring and real-time visibility.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <PublicNav />
      <main>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
