import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import LeadsInbox from './LeadsInbox';

export default async function LeadsPage() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }
  if (session.role !== 'admin') {
    redirect('/dashboard');
  }

  return <LeadsInbox />;
}
