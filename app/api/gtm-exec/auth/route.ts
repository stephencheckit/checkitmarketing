import { NextRequest } from 'next/server';
import { GTM_DECK_COOKIE, handleDeckLogin } from '@/lib/deck-auth';

export async function POST(req: NextRequest) {
  return handleDeckLogin(req, { cookie: GTM_DECK_COOKIE, password: process.env.DECK_GTM_EXEC_PASSWORD, path: '/gtm-exec' });
}
