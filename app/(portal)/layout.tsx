import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import MainNav from '@/components/MainNav';
import QuickCaptureFAB from '@/components/QuickCaptureFAB';

export const metadata: Metadata = {
  title: {
    default: 'Checkit GTM Hub for Internal Employees & Partners',
    template: '%s | Checkit GTM Hub',
  },
  description: 'Go-to-market tools and enablement for Checkit employees and partners.',
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <MainNav userName={session.name || 'User'} userRole={session.role} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <QuickCaptureFAB />
    </div>
  );
}
