import Deck from './Deck';
import PasswordGate from '@/components/deck/PasswordGate';
import { hasDeckAccess } from '@/lib/deck-auth';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'deck_sdr_baseline';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authed = await hasDeckAccess(COOKIE_NAME);
  const params = await searchParams;

  const bypass = process.env.NODE_ENV !== 'production';

  if (!authed && !bypass) {
    return <PasswordGate title="SDR Baseline" action="/api/sdr-baseline/auth" error={params.error === '1'} />;
  }

  return <Deck />;
}
