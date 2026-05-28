import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import QuickSendForm from './QuickSendForm';

export default async function QuickSendPage() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) redirect('/login');
  if (session.role !== 'admin') redirect('/dashboard');

  return <QuickSendForm />;
}
