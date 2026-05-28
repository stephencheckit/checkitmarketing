import { cookies } from 'next/headers';
import Deck from './Deck';
import PasswordGate from './PasswordGate';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'deck_2027_gtm';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const authed = cookieStore.get(COOKIE_NAME)?.value === 'ok';
  const params = await searchParams;

  const bypass = process.env.NODE_ENV !== 'production';

  if (!authed && !bypass) {
    return <PasswordGate error={params.error === '1'} />;
  }

  return <Deck />;
}
