import { NextRequest } from 'next/server';
import { handleDeckLogin } from '@/lib/deck-auth';

export async function POST(req: NextRequest) {
  return handleDeckLogin(req, { cookie: 'deck_gtm_exec', password: process.env.DECK_GTM_EXEC_PASSWORD, path: '/gtm-exec' });
}
