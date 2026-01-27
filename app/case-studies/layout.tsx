import { Metadata } from 'next';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';

export const metadata: Metadata = {
  title: {
    default: 'Stories | Checkit V6',
    template: '%s | Checkit V6',
  },
  description: 'Real results from real operations. See how leading organizations use Checkit to transform compliance, protect revenue, and deliver exceptional experiences.',
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
