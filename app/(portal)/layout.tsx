import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import PortalNav from '@/components/PortalNav';

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
    <div className="min-h-screen bg-background">
      <PortalNav userName={session.name || 'User'} userRole={session.role || 'user'} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
