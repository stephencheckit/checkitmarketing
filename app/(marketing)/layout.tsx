import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { GTM_DECK_COOKIE, hasDeckAccess } from '@/lib/deck-auth';
import MainNav from '@/components/MainNav';
import QuickCaptureFAB from '@/components/QuickCaptureFAB';
import ScrollToTop from '@/components/ScrollToTop';

// Pages the GTM exec deck opens full screen; unlocking the deck grants read-only access to these.
const GTM_DECK_PAGES = ['/gtm-planning', '/gtm-map', '/gtm-outreach'];

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    const path = (await headers()).get('x-pathname');
    const pathname = path?.split('?')[0] ?? '';
    if (GTM_DECK_PAGES.includes(pathname) && (await hasDeckAccess(GTM_DECK_COOKIE))) {
      return (
        <div className="min-h-screen bg-background">
          <main>{children}</main>
        </div>
      );
    }
    redirect(path ? `/login?next=${encodeURIComponent(path)}` : '/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <MainNav userName={session.name || 'User'} userRole={session.role} />
      <main>
        {children}
      </main>
      <QuickCaptureFAB />
    </div>
  );
}
