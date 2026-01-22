import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import MainNav from '@/components/MainNav';

export default async function MarketingLayout({
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
      <MainNav userName={session.name || 'User'} userRole={session.role} />
      <main>
        {children}
      </main>
    </div>
  );
}
