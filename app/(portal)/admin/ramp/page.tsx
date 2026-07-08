import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import {
  rampTransactions,
  rampSnapshotMeta,
  summarize,
  spendByCustomGroup,
  spendByVendor,
} from '@/lib/ramp-snapshot';
import RampDashboard from './RampDashboard';

export default async function RampPage() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) redirect('/login');
  if (session.role !== 'admin') redirect('/dashboard');

  return (
    <RampDashboard
      meta={rampSnapshotMeta}
      transactions={rampTransactions}
      summary={summarize()}
      groups={spendByCustomGroup()}
      vendors={spendByVendor()}
    />
  );
}
