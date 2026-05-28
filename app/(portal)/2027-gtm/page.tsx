import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import KitPipelineDeck from './KitPipelineDeck';

export const metadata = {
  title: '2027 GTM',
};

export default async function KitPipelinePresentationPage() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect('/login');
  }

  return <KitPipelineDeck />;
}
