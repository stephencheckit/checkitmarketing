import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { PLAYBOOK } from '@/lib/playbook';
import PlaybookView from './PlaybookView';

export default async function PlaybookPage() {
  const session = await getSession();

  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  const isAdmin = session.role === 'admin';

  return <PlaybookView verticals={PLAYBOOK} isAdmin={isAdmin} />;
}
